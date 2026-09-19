import type { StudyArticle, StudySection } from '../types'
import part1Sections from './2026-09-19-beginner-grammar-top-3-part-1'
import part2Sections from './2026-09-19-beginner-grammar-top-3-part-2'
import part3Sections from './2026-09-19-beginner-grammar-top-3-part-3'
import part4Sections from './2026-09-19-beginner-grammar-top-3-part-4'
import part5Sections from './2026-09-19-beginner-grammar-top-3-part-5'
import part6Sections from './2026-09-19-beginner-grammar-top-3-part-6'
import part7Sections from './2026-09-19-beginner-grammar-top-3-part-7'

const sections = [
  ...part1Sections,
  ...part2Sections,
  ...part3Sections,
  ...part4Sections,
  ...part5Sections,
  ...part6Sections,
  ...part7Sections,
]

const article: StudyArticle = {
  slug: '2026-09-19-beginner-grammar-top-3',
  title: '間違えたらヤバい初級文法TOP3',
  date: '2026-09-19',
  url: 'https://www.youtube.com/watch?v=r69u6CGXyJI',
  speakers: ['YUYU'],
  status: '已完成',
  description: '意味の向きを取り違えると誤解につながりやすい初級文法として、自動詞・他動詞、授受表現、受け身・使役を例とともに解説する。',
  sections: sections.map((section, index): StudySection => ({
    id: `section-${index + 1}`,
    ...section,
  })),
}

export default article
