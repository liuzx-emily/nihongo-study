import type { StudyArticle } from '../types'
import languageNotFullyConveyed from './2026-09-14-language-not-fully-conveyed'
import badJapaneseLesson from './2026-09-10-bad-japanese-lesson'
import japanesePronunciation from './2026-09-10-japanese-pronunciation'
import odaNobunagaHieizan from './2026-09-14-oda-nobunaga-hieizan'
import goodJapaneseLesson from './good-japanese-lesson'

export const articles: StudyArticle[] = [
  languageNotFullyConveyed,
  odaNobunagaHieizan,
  japanesePronunciation,
  badJapaneseLesson,
  goodJapaneseLesson,
].sort((a, b) => b.date.localeCompare(a.date))

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug)
}
