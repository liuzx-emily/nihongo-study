export interface VocabularyItem {
  term: string
  reading?: string
  meaning: string
  note: string
}

export interface GrammarItem {
  pattern: string
  meaning: string
  example: string
}

export interface StudySection {
  id: string
  title: string
  japanese: string
  translation: string
  vocabulary: VocabularyItem[]
  grammar: GrammarItem[]
}

export interface StudyArticle {
  slug: string
  title: string
  date: string
  url?: string
  speakers: string[]
  status: '进行中' | '已完成'
  description: string
  sections: StudySection[]
}
