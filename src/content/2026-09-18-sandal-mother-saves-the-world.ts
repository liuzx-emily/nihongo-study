import type { StudyArticle, StudySection } from '../types'
import part1Sections from './2026-09-18-sandal-mother-saves-the-world-part-1'
import part2Sections from './2026-09-18-sandal-mother-saves-the-world-part-2'
import part3Sections from './2026-09-18-sandal-mother-saves-the-world-part-3'
import part4Sections from './2026-09-18-sandal-mother-saves-the-world-part-4'
import part5Sections from './2026-09-18-sandal-mother-saves-the-world-part-5'

const sections = [
  ...part1Sections,
  ...part2Sections,
  ...part3Sections,
  ...part4Sections,
  ...part5Sections,
]

const article: StudyArticle = {
  slug: '2026-09-18-sandal-mother-saves-the-world',
  title: 'メキシコで学んだ「サンダル👡母ちゃんが世界を救う」',
  date: '2026-09-18',
  url: 'https://www.youtube.com/watch?v=Xs60d25FBfs',
  speakers: ['YUYU'],
  status: '已完成',
  description: '日本とラテンアメリカのジェンダー観を比べ、強い母親像や自分らしいかっこよさが社会を変える可能性について語る。',
  sections: sections.map((section, index): StudySection => ({
    id: `section-${index + 1}`,
    ...section,
  })),
}

export default article
