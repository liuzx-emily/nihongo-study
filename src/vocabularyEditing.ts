import { ref } from 'vue'
import type { GrammarItem, StudyArticle, VocabularyItem } from './types'

export type DeletableContentKind = 'vocabulary' | 'grammar'
export type DeletableContentItem = VocabularyItem | GrammarItem

export const contentEditable = import.meta.env.DEV
export const contentDeleting = ref(false)
export const contentError = ref('')
export const contentErrorKind = ref<DeletableContentKind>()
export const contentErrorSectionId = ref('')

function sameVocabulary(left: VocabularyItem, right: VocabularyItem) {
  return left.term === right.term
    && (left.reading ?? '') === (right.reading ?? '')
    && left.meaning === right.meaning
    && left.note === right.note
}

function itemKey(kind: DeletableContentKind, item: DeletableContentItem) {
  if (kind === 'vocabulary') return (item as VocabularyItem).term
  return (item as GrammarItem).pattern
}

function sectionItems(article: StudyArticle, kind: DeletableContentKind) {
  const items: DeletableContentItem[] = []
  for (const section of article.sections) {
    items.push(...section[kind] as DeletableContentItem[])
  }
  return items
}

function occurrenceInArticle(article: StudyArticle, kind: DeletableContentKind, target: DeletableContentItem) {
  let occurrence = 0
  for (const item of sectionItems(article, kind)) {
    if (item === target) return occurrence
    const matches = kind === 'vocabulary'
      ? sameVocabulary(item as VocabularyItem, target as VocabularyItem)
      : itemKey(kind, item) === itemKey(kind, target)
    if (matches) occurrence += 1
  }
  return occurrence
}

export async function deleteContentItem(
  article: StudyArticle,
  sectionId: string,
  kind: DeletableContentKind,
  item: DeletableContentItem,
) {
  if (!contentEditable || contentDeleting.value) return false
  contentDeleting.value = true
  contentError.value = ''
  contentErrorKind.value = kind
  contentErrorSectionId.value = sectionId
  const body = kind === 'vocabulary'
    ? { sectionId, occurrence: occurrenceInArticle(article, kind, item), item }
    : { sectionId, occurrence: occurrenceInArticle(article, kind, item), itemKey: itemKey(kind, item) }

  try {
    const response = await fetch(`/api/articles/${encodeURIComponent(article.slug)}/${kind}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    })
    if (!response.ok) {
      const responseBody = await response.json().catch(() => ({})) as { error?: string }
      throw new Error(responseBody.error ?? `删除失败（${response.status}）`)
    }
    return true
  } catch (error) {
    contentError.value = error instanceof Error ? error.message : '无法删除学习内容'
    return false
  } finally {
    contentDeleting.value = false
  }
}
