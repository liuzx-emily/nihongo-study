import type { StudyArticle, StudySection } from '../types'
import part1Sections from './2026-09-18-high-school-cake-factory-part-1'
import part2Sections from './2026-09-18-high-school-cake-factory-part-2'
import part3Sections from './2026-09-18-high-school-cake-factory-part-3'
import part4Sections from './2026-09-18-high-school-cake-factory-part-4'
import part5Sections from './2026-09-18-high-school-cake-factory-part-5'
import part6Sections from './2026-09-18-high-school-cake-factory-part-6'

const sections = [
  ...part1Sections,
  ...part2Sections,
  ...part3Sections,
  ...part4Sections,
  ...part5Sections,
  ...part6Sections,
]

const article: StudyArticle = {
  slug: '2026-09-18-high-school-cake-factory',
  title: '死ぬかと思った！高校時代の鬼アルバイト',
  date: '2026-09-18',
  url: 'https://www.youtube.com/watch?v=jdyTcKkBolU',
  speakers: ['YUYU'],
  status: '已完成',
  description: '高校時代に経験したクリスマスケーキ工場の過酷なアルバイトを振り返り、苦手な仕事を知ることがやりたいことの発見につながると語る。',
  sections: sections.map((section, index): StudySection => ({
    id: `section-${index + 1}`,
    ...section,
  })),
}

export default article
