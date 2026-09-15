import { promises as fs } from 'node:fs'
import path from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import ts from 'typescript'

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

interface VocabularyEntry {
  term: string
  reading?: string
  meaning: string
  note: string
}

interface DeleteVocabularyRequest {
  sectionId: string
  occurrence: number
  item: VocabularyEntry
}

interface DeleteStructuredItemRequest {
  sectionId: string
  occurrence: number
  itemKey: string
}

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

function validateVocabularyItem(value: unknown): VocabularyEntry {
  if (!value || typeof value !== 'object') throw new Error('单词内容必须是对象')
  const item = value as Partial<VocabularyEntry>
  if (
    typeof item.term !== 'string'
    || typeof item.meaning !== 'string'
    || typeof item.note !== 'string'
    || (item.reading !== undefined && typeof item.reading !== 'string')
  ) {
    throw new Error('单词内容格式无效')
  }
  return {
    term: item.term,
    ...(item.reading !== undefined ? { reading: item.reading } : {}),
    meaning: item.meaning,
    note: item.note,
  }
}

function validateDeleteVocabularyRequest(value: unknown): DeleteVocabularyRequest {
  if (!value || typeof value !== 'object') throw new Error('请求内容必须是对象')
  const body = value as Partial<DeleteVocabularyRequest>
  if (typeof body.sectionId !== 'string' || !idPattern.test(body.sectionId)) throw new Error('section id 格式无效')
  if (!Number.isSafeInteger(body.occurrence) || (body.occurrence ?? -1) < 0) throw new Error('单词序号无效')
  return {
    sectionId: body.sectionId,
    occurrence: body.occurrence!,
    item: validateVocabularyItem(body.item),
  }
}

function validateDeleteStructuredItemRequest(value: unknown): DeleteStructuredItemRequest {
  if (!value || typeof value !== 'object') throw new Error('请求内容必须是对象')
  const body = value as Partial<DeleteStructuredItemRequest>
  if (typeof body.sectionId !== 'string' || !idPattern.test(body.sectionId)) throw new Error('section id 格式无效')
  if (!Number.isSafeInteger(body.occurrence) || (body.occurrence ?? -1) < 0) throw new Error('内容序号无效')
  if (typeof body.itemKey !== 'string' || !body.itemKey) throw new Error('内容标识无效')
  return { sectionId: body.sectionId, occurrence: body.occurrence!, itemKey: body.itemKey }
}

function literalText(node: ts.Node | undefined) {
  return node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) ? node.text : undefined
}

function propertyNameText(name: ts.PropertyName) {
  return ts.isIdentifier(name) || ts.isStringLiteral(name) ? name.text : undefined
}

function vocabularyFromNode(node: ts.Expression): VocabularyEntry | undefined {
  if (ts.isObjectLiteralExpression(node)) {
    const values = new Map<string, string>()
    for (const property of node.properties) {
      if (!ts.isPropertyAssignment(property)) continue
      const name = propertyNameText(property.name)
      const value = literalText(property.initializer)
      if (name && value !== undefined) values.set(name, value)
    }
    const term = values.get('term')
    const meaning = values.get('meaning')
    const note = values.get('note')
    if (term === undefined || meaning === undefined || note === undefined) return undefined
    const reading = values.get('reading')
    return { term, ...(reading !== undefined ? { reading } : {}), meaning, note }
  }

  if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && ['v', 'vocab'].includes(node.expression.text)) {
    const [termNode, readingNode, meaningNode, noteNode] = node.arguments
    const term = literalText(termNode)
    const reading = literalText(readingNode)
    const meaning = literalText(meaningNode)
    const note = literalText(noteNode)
    if (term === undefined || reading === undefined || meaning === undefined || note === undefined) return undefined
    return { term, ...(reading ? { reading } : {}), meaning, note }
  }
}

function vocabularyMatches(left: VocabularyEntry, right: VocabularyEntry) {
  return left.term === right.term
    && (left.reading ?? '') === (right.reading ?? '')
    && left.meaning === right.meaning
    && left.note === right.note
}

async function articleSourceFiles(slug: string) {
  const contentDirectory = path.resolve(process.cwd(), 'src/content')
  const fileNames = (await fs.readdir(contentDirectory)).filter((name) => name.endsWith('.ts'))
  const files = await Promise.all(fileNames.map(async (name) => {
    const filePath = path.join(contentDirectory, name)
    return { filePath, source: await fs.readFile(filePath, 'utf8') }
  }))
  const root = files.find(({ source }) => source.includes(`slug: '${slug}'`) || source.includes(`slug: \"${slug}\"`))
  if (!root) throw new Error('找不到文章源码')

  const byPath = new Map(files.map((file) => [path.normalize(file.filePath), file]))
  const result: typeof files = []
  const visited = new Set<string>()
  const visit = (file: (typeof files)[number]) => {
    if (visited.has(file.filePath)) return
    visited.add(file.filePath)
    result.push(file)
    const sourceFile = ts.createSourceFile(file.filePath, file.source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
    for (const statement of sourceFile.statements) {
      if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue
      const specifier = statement.moduleSpecifier.text
      if (!specifier.startsWith('.')) continue
      const importedPath = path.normalize(path.resolve(path.dirname(file.filePath), `${specifier}.ts`))
      const imported = byPath.get(importedPath)
      if (imported) visit(imported)
    }
  }
  visit(root)
  return result
}

async function deleteVocabularyFromSource(slug: string, request: DeleteVocabularyRequest) {
  const files = await articleSourceFiles(slug)
  const matches: { filePath: string; source: string; array: ts.ArrayLiteralExpression; index: number }[] = []

  for (const file of files) {
    const sourceFile = ts.createSourceFile(file.filePath, file.source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
    const visit = (node: ts.Node) => {
      if (
        ts.isPropertyAssignment(node)
        && propertyNameText(node.name) === 'vocabulary'
        && ts.isArrayLiteralExpression(node.initializer)
      ) {
        const array = node.initializer
        array.elements.forEach((element, index) => {
          if (!ts.isExpression(element)) return
          const item = vocabularyFromNode(element)
          if (item && vocabularyMatches(item, request.item)) {
            matches.push({ filePath: file.filePath, source: file.source, array, index })
          }
        })
      }
      ts.forEachChild(node, visit)
    }
    visit(sourceFile)
  }

  const match = matches[request.occurrence]
  if (!match) throw new Error('源码中的单词已发生变化，请刷新页面后重试')
  const elements = match.array.elements
  const element = elements[match.index]!
  let start = element.getStart()
  let end = element.end
  if (match.index < elements.length - 1) {
    end = elements[match.index + 1]!.getStart()
  } else if (match.index > 0) {
    start = elements[match.index - 1]!.end
  }

  const updated = match.source.slice(0, start) + match.source.slice(end)
  await fs.writeFile(match.filePath, updated, 'utf8')
}

function structuredItemKey(node: ts.Expression, propertyName: 'pattern' | 'original') {
  if (ts.isObjectLiteralExpression(node)) {
    for (const property of node.properties) {
      if (ts.isPropertyAssignment(property) && propertyNameText(property.name) === propertyName) {
        return literalText(property.initializer)
      }
    }
  }
  if (ts.isCallExpression(node)) {
    return literalText(node.arguments[0])
  }
}

async function deleteStructuredItemFromSource(
  slug: string,
  request: DeleteStructuredItemRequest,
  arrayName: 'grammar' | 'keySentences',
) {
  const propertyName = arrayName === 'grammar' ? 'pattern' : 'original'
  const files = await articleSourceFiles(slug)
  const matches: { filePath: string; source: string; array: ts.ArrayLiteralExpression; index: number }[] = []

  for (const file of files) {
    const sourceFile = ts.createSourceFile(file.filePath, file.source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
    const visit = (node: ts.Node) => {
      if (
        ts.isPropertyAssignment(node)
        && propertyNameText(node.name) === arrayName
        && ts.isArrayLiteralExpression(node.initializer)
      ) {
        const array = node.initializer
        array.elements.forEach((element, index) => {
          if (ts.isExpression(element) && structuredItemKey(element, propertyName) === request.itemKey) {
            matches.push({ filePath: file.filePath, source: file.source, array, index })
          }
        })
      }
      ts.forEachChild(node, visit)
    }
    visit(sourceFile)
  }

  const match = matches[request.occurrence]
  if (!match) throw new Error('源码中的学习内容已发生变化，请刷新页面后重试')
  const elements = match.array.elements
  const element = elements[match.index]!
  let start = element.getStart()
  let end = element.end
  if (match.index < elements.length - 1) end = elements[match.index + 1]!.getStart()
  else if (match.index > 0) start = elements[match.index - 1]!.end
  await fs.writeFile(match.filePath, match.source.slice(0, start) + match.source.slice(end), 'utf8')
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

function contentEditingPlugin(): Plugin {
  let writeQueue = Promise.resolve()
  return {
    name: 'content-editing-api',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const pathname = new URL(request.url ?? '/', 'http://localhost').pathname
        const match = pathname.match(/^\/api\/articles\/([^/]+)\/(vocabulary|grammar|key-sentences)$/)
        if (!match) return next()
        if (request.method !== 'DELETE') {
          sendJson(response, 405, { error: '不支持的内容 API 请求' })
          return
        }

        try {
          const slug = decodeURIComponent(match[1])
          if (!idPattern.test(slug)) throw new Error('文章 slug 格式无效')
          const rawBody = await readRequestBody(request)
          const operation = match[2] === 'vocabulary'
            ? writeQueue.then(() => deleteVocabularyFromSource(slug, validateDeleteVocabularyRequest(rawBody)))
            : writeQueue.then(() => deleteStructuredItemFromSource(
                slug,
                validateDeleteStructuredItemRequest(rawBody),
                match[2] === 'grammar' ? 'grammar' : 'keySentences',
              ))
          writeQueue = operation.catch(() => undefined)
          await operation
          sendJson(response, 200, { ok: true })
        } catch (error) {
          const message = error instanceof Error ? error.message : '删除学习内容时发生未知错误'
          sendJson(response, 400, { error: message })
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [vue(), studyProgressPlugin(), contentEditingPlugin()],
  base: './',
})
