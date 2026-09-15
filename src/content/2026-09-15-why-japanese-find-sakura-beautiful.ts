import type { StudyArticle, StudySection } from '../types'
import part1 from './2026-09-15-why-japanese-find-sakura-beautiful-part-1'
import part2 from './2026-09-15-why-japanese-find-sakura-beautiful-part-2'
import part3 from './2026-09-15-why-japanese-find-sakura-beautiful-part-3'
import part4 from './2026-09-15-why-japanese-find-sakura-beautiful-part-4'

const sections = [...part1, ...part2, ...part3, ...part4]

const article: StudyArticle = {
  slug: '2026-09-15-why-japanese-find-sakura-beautiful',
  title: '日本人はどうして桜を綺麗だと思うのか',
  date: '2026-09-15',
  url: 'https://www.youtube.com/watch?v=1IqdeIR6vT0',
  speakers: ['YUYU'],
  status: '已完成',
  description: '日本人が桜を美しいと感じる理由を、縄文時代から国風文化、『源氏物語』と「物の哀れ」への流れを通して考える。',
  sections: sections.map((section, index): StudySection => ({
    id: `section-${index + 1}`,
    ...section,
  })),
}

export default article
