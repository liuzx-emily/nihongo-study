import type { StudyArticle, StudySection } from '../types'
import part1Sections from './2026-09-19-meaning-of-yuyu-name-part-1'
import part2Sections from './2026-09-19-meaning-of-yuyu-name-part-2'
import part3Sections from './2026-09-19-meaning-of-yuyu-name-part-3'
import part4Sections from './2026-09-19-meaning-of-yuyu-name-part-4'
import part5Sections from './2026-09-19-meaning-of-yuyu-name-part-5'
import part6Sections from './2026-09-19-meaning-of-yuyu-name-part-6'

const sections = [
  ...part1Sections,
  ...part2Sections,
  ...part3Sections,
  ...part4Sections,
  ...part5Sections,
  ...part6Sections,
]

const article: StudyArticle = {
  slug: '2026-09-19-meaning-of-yuyu-name',
  title: '「YUYU」の名前の意味って知ってる？',
  date: '2026-09-19',
  url: 'https://www.youtube.com/watch?v=q3WHkngg-JQ',
  speakers: ['YUYU'],
  status: '已完成',
  description: '「YUYU」という名前の由来と祖母が「裕介」に込めた願いを振り返り、競争ではなく自分のペースで日本語と触れ合い続ける大切さを語る。',
  sections: sections.map((section, index): StudySection => ({
    id: `section-${index + 1}`,
    ...section,
  })),
}

export default article
