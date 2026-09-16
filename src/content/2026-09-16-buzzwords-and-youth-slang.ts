import type { StudyArticle, StudySection } from '../types'
import part1Sections from './2026-09-16-buzzwords-and-youth-slang-part-1'
import part2Sections from './2026-09-16-buzzwords-and-youth-slang-part-2'
import { part3Sections } from './2026-09-16-buzzwords-and-youth-slang-part-3'
import { buzzwordsAndYouthSlangPart4Sections as part4Sections } from './2026-09-16-buzzwords-and-youth-slang-part-4'

const sections = [
  ...part1Sections,
  ...part2Sections,
  ...part3Sections,
  ...part4Sections,
]

const article: StudyArticle = {
  slug: '2026-09-16-buzzwords-and-youth-slang',
  title: '流行語と最近の若者言葉',
  date: '2026-09-16',
  url: 'https://www.youtube.com/watch?v=Bk0xfOohGiU',
  speakers: ['YUYU'],
  status: '已完成',
  description: '2023年の流行語「アレ」と、若者の間で流行した「ひき肉です」「それな」「なぜなぜ」の意味や使い方を紹介する。',
  sections: sections.map((section, index): StudySection => ({
    id: `section-${index + 1}`,
    ...section,
  })),
}

export default article
