import type { StudyArticle, StudySection } from '../types'
import part1 from './2026-09-15-osushi-ni-tsuite-part-1'
import part2 from './2026-09-15-osushi-ni-tsuite-part-2'
import part3 from './2026-09-15-osushi-ni-tsuite-part-3'
import part4 from './2026-09-15-osushi-ni-tsuite-part-4'

const sections = [...part1, ...part2, ...part3, ...part4]

const article: StudyArticle = {
  slug: '2026-09-15-osushi-ni-tsuite',
  title: 'お寿司について',
  date: '2026-09-15',
  url: 'https://www.youtube.com/watch?v=TTcIccd08mA',
  speakers: ['YUYU'],
  status: '已完成',
  description: '寿司の歴史と種類、高級店と回転寿司の違い、おいしい寿司を楽しめる季節や場所について紹介する。',
  sections: sections.map((section, index): StudySection => ({
    id: `section-${index + 1}`,
    ...section,
  })),
}

export default article
