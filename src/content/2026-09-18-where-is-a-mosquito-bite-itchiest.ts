import type { StudyArticle, StudySection } from '../types'
import part1Sections from './2026-09-18-where-is-a-mosquito-bite-itchiest-part-1'
import part2Sections from './2026-09-18-where-is-a-mosquito-bite-itchiest-part-2'
import part3Sections from './2026-09-18-where-is-a-mosquito-bite-itchiest-part-3'
import part4Sections from './2026-09-18-where-is-a-mosquito-bite-itchiest-part-4'
import part5Sections from './2026-09-18-where-is-a-mosquito-bite-itchiest-part-5'

const sections = [
  ...part1Sections,
  ...part2Sections,
  ...part3Sections,
  ...part4Sections,
  ...part5Sections,
]

const article: StudyArticle = {
  slug: '2026-09-18-where-is-a-mosquito-bite-itchiest',
  title: '蚊に刺されたら、どこが一番かゆい',
  date: '2026-09-18',
  url: 'https://www.youtube.com/watch?v=JqWtURZs_YU',
  speakers: ['YUYU'],
  status: '已完成',
  description: '五月病や結婚記念日の近況、「芋キャラ」という言葉を紹介し、蚊に刺されて痒い場所のランキングや蚊対策の新しい研究について語る。',
  sections: sections.map((section, index): StudySection => ({
    id: `section-${index + 1}`,
    ...section,
  })),
}

export default article
