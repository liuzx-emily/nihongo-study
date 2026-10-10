import type { StudyArticle } from '../types'
import whatAnimalDoYouWantToBe from './2026-10-10-what-animal-do-you-want-to-be'
import japaneseListeningGestures from './2026-09-23-japanese-listening-gestures'
import racismAndPositiveInterpretation from './2026-09-22-racism-and-positive-interpretation'
import shittakaburiRakugo from './2026-09-22-shittakaburi-rakugo'
import beginnerGrammarTop3 from './2026-09-19-beginner-grammar-top-3'
import meaningOfYuyuName from './2026-09-19-meaning-of-yuyu-name'
import highSchoolCakeFactory from './2026-09-18-high-school-cake-factory'
import sandalMotherSavesTheWorld from './2026-09-18-sandal-mother-saves-the-world'
import bestAnimeFilmInuOh from './2026-09-18-best-anime-film-inu-oh'
import whereIsAMosquitoBiteItchiest from './2026-09-18-where-is-a-mosquito-bite-itchiest'
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
  whatAnimalDoYouWantToBe,
  japaneseListeningGestures,
  racismAndPositiveInterpretation,
  shittakaburiRakugo,
  beginnerGrammarTop3,
  meaningOfYuyuName,
  highSchoolCakeFactory,
  sandalMotherSavesTheWorld,
  bestAnimeFilmInuOh,
  whereIsAMosquitoBiteItchiest,
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
