import type { StudyArticle, StudySection } from '../types'
import part1Sections from './2026-09-22-shittakaburi-rakugo-part-1'
import part2Sections from './2026-09-22-shittakaburi-rakugo-part-2'
import part3Sections from './2026-09-22-shittakaburi-rakugo-part-3'
import part4Sections from './2026-09-22-shittakaburi-rakugo-part-4'
import part5Sections from './2026-09-22-shittakaburi-rakugo-part-5'
import part6Sections from './2026-09-22-shittakaburi-rakugo-part-6'

const sections = [
  ...part1Sections,
  ...part2Sections,
  ...part3Sections,
  ...part4Sections,
  ...part5Sections,
  ...part6Sections,
]

const article: StudyArticle = {
  slug: '2026-09-22-shittakaburi-rakugo',
  title: '知ったかぶりの落語「転失気」',
  date: '2026-09-22',
  url: 'https://www.youtube.com/watch?v=2AtBOAd_9Qw',
  speakers: ['YUYU'],
  status: '已完成',
  description: '「知ったかぶり」をテーマに、自身の失敗談と、言葉の意味を知らない住職が巻き起こす落語「転失気」を紹介する。',
  sections: sections.map((section, index): StudySection => ({
    id: `section-${index + 1}`,
    ...section,
  })),
}

export default article
