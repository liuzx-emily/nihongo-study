import type { StudyArticle, StudySection } from '../types'
import part1Sections from './2026-09-22-racism-and-positive-interpretation-part-1'
import part2Sections from './2026-09-22-racism-and-positive-interpretation-part-2'
import part3Sections from './2026-09-22-racism-and-positive-interpretation-part-3'
import part4Sections from './2026-09-22-racism-and-positive-interpretation-part-4'
import part5Sections from './2026-09-22-racism-and-positive-interpretation-part-5'

const sections = [
  ...part1Sections,
  ...part2Sections,
  ...part3Sections,
  ...part4Sections,
  ...part5Sections,
]

const article: StudyArticle = {
  slug: '2026-09-22-racism-and-positive-interpretation',
  title: '人種差別とポジティブな受け取り方',
  date: '2026-09-22',
  url: 'https://www.youtube.com/watch?v=7BBh9dgDRe4',
  speakers: ['YUYU'],
  status: '已完成',
  description: 'メキシコでの暮らしや異文化交流の経験を通して、人種差別と受け取り方、前向きに対話する姿勢について考える。',
  sections: sections.map((section, index): StudySection => ({
    id: `section-${index + 1}`,
    ...section,
  })),
}

export default article
