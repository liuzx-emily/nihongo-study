import type { StudyArticle, StudySection } from '../types'
import part1Sections from './2026-09-18-best-anime-film-inu-oh-part-1'
import { sections as part2Sections } from './2026-09-18-best-anime-film-inu-oh-part-2'
import part3Sections from './2026-09-18-best-anime-film-inu-oh-part-3'
import { bestAnimeFilmInuOhPart4Sections as part4Sections } from './2026-09-18-best-anime-film-inu-oh-part-4'
import { sections as part5Sections } from './2026-09-18-best-anime-film-inu-oh-part-5'

const sections = [
  ...part1Sections,
  ...part2Sections,
  ...part3Sections,
  ...part4Sections,
  ...part5Sections,
]

const article: StudyArticle = {
  slug: '2026-09-18-best-anime-film-inu-oh',
  title: '最高のアニメ映画「犬王」',
  date: '2026-09-18',
  url: 'https://www.youtube.com/watch?v=knAQsVyQoow',
  speakers: ['YUYU'],
  status: '已完成',
  description: 'メキシコの母の日や水不足、「下手っぴ」という言葉を紹介し、アニメーション映画『犬王』の作画、音楽、歴史的背景と魅力を語る。',
  sections: sections.map((section, index): StudySection => ({
    id: `section-${index + 1}`,
    ...section,
  })),
}

export default article
