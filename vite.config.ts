import { promises as fs } from 'node:fs'
import path from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

interface StoredArticleProgress {
  completedSectionIds: string[]
  startedOn?: string
  completedOn?: string
}

interface StoredProgressFile {
  version: 1
  articles: Record<string, StoredArticleProgress>
}

const emptyProgress = (): StoredProgressFile => ({ version: 1, articles: {} })
const datePattern = /^\d{4}-\d{2}-\d{2}$/
const idPattern = /^[A-Za-z0-9_-]+$/

function isCalendarDate(value: string) {
  if (!datePattern.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}

function validateArticleProgress(value: unknown): StoredArticleProgress {
  if (!value || typeof value !== 'object') throw new Error('请求内容必须是对象')
  const candidate = value as Partial<StoredArticleProgress>
  if (!Array.isArray(candidate.completedSectionIds)) throw new Error('completedSectionIds 必须是数组')
  const completedSectionIds = candidate.completedSectionIds
  if (!completedSectionIds.every((id) => typeof id === 'string' && idPattern.test(id))) {
    throw new Error('section id 格式无效')
  }
  if (candidate.startedOn !== undefined && !isCalendarDate(candidate.startedOn)) throw new Error('startedOn 日期无效')
  if (candidate.completedOn !== undefined && !isCalendarDate(candidate.completedOn)) throw new Error('completedOn 日期无效')
  return {
    completedSectionIds: Array.from(new Set(completedSectionIds)),
    ...(candidate.startedOn ? { startedOn: candidate.startedOn } : {}),
    ...(candidate.completedOn ? { completedOn: candidate.completedOn } : {}),
  }
}

function validateProgressFile(value: unknown): StoredProgressFile {
  if (!value || typeof value !== 'object') throw new Error('进度文件格式无效')
  const candidate = value as Partial<StoredProgressFile>
  if (candidate.version !== 1 || !candidate.articles || typeof candidate.articles !== 'object') {
    throw new Error('进度文件版本或内容无效')
  }
  const articles = Object.fromEntries(
    Object.entries(candidate.articles).map(([slug, progress]) => [slug, validateArticleProgress(progress)]),
  )
  return { version: 1, articles }
}

function sendJson(response: ServerResponse, status: number, value: unknown) {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.end(JSON.stringify(value))
}

async function readRequestBody(request: IncomingMessage) {
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buffer.length
    if (size > 64 * 1024) throw new Error('请求内容过大')
    chunks.push(buffer)
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown
}

function studyProgressPlugin(): Plugin {
  const progressPath = path.resolve(process.cwd(), 'study-progress.json')
  const temporaryPath = `${progressPath}.tmp`
  let writeQueue = Promise.resolve()

  async function readProgress() {
    try {
      return validateProgressFile(JSON.parse(await fs.readFile(progressPath, 'utf8')))
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return emptyProgress()
      throw error
    }
  }

  async function writeProgress(progress: StoredProgressFile) {
    await fs.writeFile(temporaryPath, `${JSON.stringify(progress, null, 2)}\n`, 'utf8')
    await fs.rename(temporaryPath, progressPath)
  }

  return {
    name: 'study-progress-api',
    async generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'study-progress.json',
        source: `${JSON.stringify(await readProgress(), null, 2)}\n`,
      })
    },
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const pathname = new URL(request.url ?? '/', 'http://localhost').pathname
        if (!pathname.startsWith('/api/study-progress')) return next()

        try {
          if (pathname === '/api/study-progress' && request.method === 'GET') {
            await writeQueue
            sendJson(response, 200, await readProgress())
            return
          }

          const match = pathname.match(/^\/api\/study-progress\/([^/]+)$/)
          if (!match || request.method !== 'PATCH') {
            sendJson(response, 405, { error: '不支持的进度 API 请求' })
            return
          }

          const slug = decodeURIComponent(match[1])
          if (!idPattern.test(slug)) {
            sendJson(response, 400, { error: '文章 slug 格式无效' })
            return
          }
          const articleProgress = validateArticleProgress(await readRequestBody(request))
          let saved = emptyProgress()
          const operation = writeQueue.then(async () => {
            const current = await readProgress()
            saved = { ...current, articles: { ...current.articles, [slug]: articleProgress } }
            await writeProgress(saved)
          })
          writeQueue = operation.catch(() => undefined)
          await operation
          sendJson(response, 200, saved)
        } catch (error) {
          const message = error instanceof Error ? error.message : '进度服务发生未知错误'
          sendJson(response, 400, { error: message })
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [vue(), studyProgressPlugin()],
  base: './',
})
