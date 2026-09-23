import type { StudyArticle, StudySection } from '../types'
import part1Sections from './2026-09-23-japanese-listening-gestures-part-1'
import part2Sections from './2026-09-23-japanese-listening-gestures-part-2'
import part3Sections from './2026-09-23-japanese-listening-gestures-part-3'
import part4Sections from './2026-09-23-japanese-listening-gestures-part-4'
import part5Sections from './2026-09-23-japanese-listening-gestures-part-5'
import part6Sections from './2026-09-23-japanese-listening-gestures-part-6'

const sections = [
  ...part1Sections,
  ...part2Sections,
  ...part3Sections,
  ...part4Sections,
  ...part5Sections,
  ...part6Sections,
]

const article: StudyArticle = {
  slug: '2026-09-23-japanese-listening-gestures',
  title: '日本人と話す時にやってはいけないジェスチャー',
  date: '2026-09-23',
  url: 'https://www.youtube.com/watch?v=pC0dpgjmaZw',
  speakers: ['YUYU'],
  status: '已完成',
  description: '日本人との会話で相手に与える印象をテーマに、話を聞く時に避けたい姿勢と、真剣さや敬意が伝わる座り方を紹介する。',
  sections: sections.map((section, index): StudySection => ({
    id: `section-${index + 1}`,
    ...section,
  })),
}

export default article
