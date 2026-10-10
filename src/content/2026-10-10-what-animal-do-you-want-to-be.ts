import type { StudyArticle, StudySection } from '../types'
import part1Sections from './2026-10-10-what-animal-do-you-want-to-be-part-1'
import part2Sections from './2026-10-10-what-animal-do-you-want-to-be-part-2'
import part3Sections from './2026-10-10-what-animal-do-you-want-to-be-part-3'
import part4Sections from './2026-10-10-what-animal-do-you-want-to-be-part-4'
import part5Sections from './2026-10-10-what-animal-do-you-want-to-be-part-5'
import part6Sections from './2026-10-10-what-animal-do-you-want-to-be-part-6'

const sections = [
  ...part1Sections,
  ...part2Sections,
  ...part3Sections,
  ...part4Sections,
  ...part5Sections,
  ...part6Sections,
]

const article: StudyArticle = {
  slug: '2026-10-10-what-animal-do-you-want-to-be',
  title: '動物になるならどんな動物になりたい？',
  date: '2026-10-10',
  url: 'https://www.youtube.com/watch?v=ksamxnM-UiA',
  speakers: ['YUYU'],
  status: '已完成',
  description: '「動物になるならどんな動物になりたいか」をテーマに、飼い猫の暮らしに憧れながら、高く飛べる鳥と深く潜れるクジラの魅力を比べ、最後は食物連鎖と自分の生き方の話になる。',
  sections: sections.map((section, index): StudySection => ({
    id: `section-${index + 1}`,
    ...section,
  })),
}

export default article
