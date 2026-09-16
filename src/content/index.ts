import type { StudyArticle } from '../types'
import buzzwordsAndYouthSlang from './2026-09-16-buzzwords-and-youth-slang'
import shogunHistoryAndLanguage from './2026-09-15-shogun-history-and-language'
import whyJapaneseFindSakuraBeautiful from './2026-09-15-why-japanese-find-sakura-beautiful'
import osushiNiTsuite from './2026-09-15-osushi-ni-tsuite'
import kamiTaiouShioTaiou from './2026-09-15-kami-taiou-shio-taiou'
import languageNotFullyConveyed from './2026-09-14-language-not-fully-conveyed'
import badJapaneseLesson from './2026-09-10-bad-japanese-lesson'
import japanesePronunciation from './2026-09-10-japanese-pronunciation'
import odaNobunagaHieizan from './2026-09-14-oda-nobunaga-hieizan'
import goodJapaneseLesson from './good-japanese-lesson'

export const articles: StudyArticle[] = [
  buzzwordsAndYouthSlang,
  shogunHistoryAndLanguage,
  whyJapaneseFindSakuraBeautiful,
  osushiNiTsuite,
  kamiTaiouShioTaiou,
  languageNotFullyConveyed,
  odaNobunagaHieizan,
  japanesePronunciation,
  badJapaneseLesson,
  goodJapaneseLesson,
].sort((a, b) => b.date.localeCompare(a.date))

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug)
}
