import type { StudyArticle, StudySection } from '../types'
import part1Sections from './2026-10-10-jlpt-listening-advice-part-1'
import part2Sections from './2026-10-10-jlpt-listening-advice-part-2'
import part3Sections from './2026-10-10-jlpt-listening-advice-part-3'
import part4Sections from './2026-10-10-jlpt-listening-advice-part-4'
import part5Sections from './2026-10-10-jlpt-listening-advice-part-5'
import part6Sections from './2026-10-10-jlpt-listening-advice-part-6'
import part7Sections from './2026-10-10-jlpt-listening-advice-part-7'

const sections = [
  ...part1Sections,
  ...part2Sections,
  ...part3Sections,
  ...part4Sections,
  ...part5Sections,
  ...part6Sections,
  ...part7Sections,
]

const article: StudyArticle = {
  slug: '2026-10-10-jlpt-listening-advice',
  title: 'これで合格？JLPT聴解問題のアドバイス',
  date: '2026-10-10',
  url: 'https://www.youtube.com/watch?v=US6L0VKR1OE',
  speakers: ['YUYU'],
  status: '已完成',
  description:
    'JLPTの聴解問題がテーマ。普段の会話の聴解と試験の聴解の違い、問題タイプごとに気をつけること、場面を想像しながら聞くトレーニング、語彙を耳から増やす方法、そしてリアルな会話で分かったことをどう伝えるかを話す。',
  sections: sections.map((section, index): StudySection => ({
    id: `section-${index + 1}`,
    ...section,
  })),
}

export default article
