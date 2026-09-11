import { ref } from 'vue'
import type { StudyArticle } from './types'

export type LearningStatus = '未学' | '学习中' | '已学'

export interface ArticleProgress {
  completedSectionIds: string[]
  startedOn?: string
  completedOn?: string
}

export interface ArticleProgressView extends ArticleProgress {
  completedCount: number
  totalCount: number
  status: LearningStatus
}

interface StudyProgressFile {
  version: 1
  articles: Record<string, ArticleProgress>
}

const emptyProgress = (): StudyProgressFile => ({ version: 1, articles: {} })
const progressFile = ref<StudyProgressFile>(emptyProgress())
const progressLoaded = ref(false)
const progressLoading = ref(false)
const progressError = ref('')
const savingSlugs = ref(new Set<string>())
const saveQueues = new Map<string, Promise<void>>()
let loadPromise: Promise<void> | undefined

export const progressEditable = import.meta.env.DEV

function isDate(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function normalizeProgressFile(value: unknown): StudyProgressFile {
  if (!value || typeof value !== 'object') throw new Error('进度文件格式无效')
  const candidate = value as { version?: unknown; articles?: unknown }
  if (candidate.version !== 1 || !candidate.articles || typeof candidate.articles !== 'object') {
    throw new Error('进度文件版本或内容无效')
  }

  const articles: Record<string, ArticleProgress> = {}
  for (const [slug, raw] of Object.entries(candidate.articles)) {
    if (!raw || typeof raw !== 'object') continue
    const item = raw as Partial<ArticleProgress>
    if (!Array.isArray(item.completedSectionIds)) continue
    articles[slug] = {
      completedSectionIds: Array.from(new Set(item.completedSectionIds.filter((id): id is string => typeof id === 'string'))),
      ...(isDate(item.startedOn) ? { startedOn: item.startedOn } : {}),
      ...(isDate(item.completedOn) ? { completedOn: item.completedOn } : {}),
    }
  }
  return { version: 1, articles }
}

function localDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function validProgress(article: StudyArticle): ArticleProgress {
  const stored = progressFile.value.articles[article.slug]
  const validIds = new Set(article.sections.map((section) => section.id))
  return {
    completedSectionIds: stored?.completedSectionIds.filter((id) => validIds.has(id)) ?? [],
    ...(stored?.startedOn ? { startedOn: stored.startedOn } : {}),
    ...(stored?.completedOn ? { completedOn: stored.completedOn } : {}),
  }
}

export function getArticleProgress(article: StudyArticle): ArticleProgressView {
  const progress = validProgress(article)
  const completedCount = progress.completedSectionIds.length
  const totalCount = article.sections.length
  const status: LearningStatus = completedCount === 0
    ? '未学'
    : totalCount > 0 && completedCount === totalCount
      ? '已学'
      : '学习中'
  return { ...progress, completedCount, totalCount, status }
}

export function isSectionCompleted(article: StudyArticle, sectionId: string) {
  return getArticleProgress(article).completedSectionIds.includes(sectionId)
}

export function isArticleSaving(slug: string) {
  return savingSlugs.value.has(slug)
}

export function formatProgressDate(value: string | undefined, fallback: string) {
  return value?.replaceAll('-', '.') ?? fallback
}

export async function loadStudyProgress(force = false) {
  if (loadPromise && !force) return loadPromise
  if (savingSlugs.value.size > 0 && force) return

  progressLoading.value = true
  const request = (async () => {
    try {
      const progressUrl = progressEditable
        ? '/api/study-progress'
        : `${import.meta.env.BASE_URL}study-progress.json`
      const response = await fetch(progressUrl, { headers: { Accept: 'application/json' } })
      if (!response.ok) throw new Error(`读取失败（${response.status}）`)
      progressFile.value = normalizeProgressFile(await response.json())
      progressLoaded.value = true
      progressError.value = ''
    } catch (error) {
      progressError.value = error instanceof Error ? error.message : '无法读取学习进度'
      throw error
    } finally {
      progressLoading.value = false
    }
  })()

  loadPromise = request
  try {
    await request
  } finally {
    if (loadPromise === request) loadPromise = undefined
  }
}

async function saveArticleProgress(article: StudyArticle, next: ArticleProgress) {
  if (!progressEditable) return

  const previous = progressFile.value.articles[article.slug]
  progressFile.value = {
    ...progressFile.value,
    articles: { ...progressFile.value.articles, [article.slug]: next },
  }
  savingSlugs.value = new Set(savingSlugs.value).add(article.slug)
  progressError.value = ''

  const queued = (saveQueues.get(article.slug) ?? Promise.resolve())
    .then(async () => {
      const response = await fetch(`/api/study-progress/${encodeURIComponent(article.slug)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(next),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => ({})) as { error?: string }
        throw new Error(body.error ?? `保存失败（${response.status}）`)
      }
      progressFile.value = normalizeProgressFile(await response.json())
    })
    .catch((error) => {
      const articles = { ...progressFile.value.articles }
      if (previous) articles[article.slug] = previous
      else delete articles[article.slug]
      progressFile.value = { ...progressFile.value, articles }
      progressError.value = error instanceof Error ? error.message : '无法保存学习进度'
    })
    .finally(() => {
      if (saveQueues.get(article.slug) === queued) {
        saveQueues.delete(article.slug)
        const nextSaving = new Set(savingSlugs.value)
        nextSaving.delete(article.slug)
        savingSlugs.value = nextSaving
      }
    })

  saveQueues.set(article.slug, queued)
  await queued
}

export async function toggleSectionProgress(article: StudyArticle, sectionId: string) {
  const current = validProgress(article)
  const ids = new Set(current.completedSectionIds)
  const completing = !ids.has(sectionId)
  if (completing) ids.add(sectionId)
  else ids.delete(sectionId)

  const completedSectionIds = article.sections.map((section) => section.id).filter((id) => ids.has(id))
  const isComplete = article.sections.length > 0 && completedSectionIds.length === article.sections.length
  const today = localDate()
  await saveArticleProgress(article, {
    completedSectionIds,
    ...(current.startedOn || completing ? { startedOn: current.startedOn ?? today } : {}),
    ...(isComplete ? { completedOn: current.completedOn ?? today } : {}),
  })
}

export async function toggleAllSections(article: StudyArticle) {
  const current = getArticleProgress(article)
  if (current.status === '已学') {
    await saveArticleProgress(article, { completedSectionIds: [] })
    return
  }

  const today = localDate()
  await saveArticleProgress(article, {
    completedSectionIds: article.sections.map((section) => section.id),
    startedOn: current.startedOn ?? today,
    completedOn: today,
  })
}

export { progressError, progressLoaded, progressLoading }
