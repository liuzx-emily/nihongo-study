export interface VocabularyItem {
  term: string
  reading?: string
  meaning: string
  note: string
}

export interface GrammarItem {
  pattern: string
  connection: string
  meaning: string
  example: string
}

export interface KeySentence {
  original: string
  translation: string
  chunks: { text: string; note: string }[]
  spokenNote: string
  takeaway: string
  takeawayExample: string
}

export interface StudySection {
  id: string
  title: string
  japanese: string
  translation: string
  vocabulary: VocabularyItem[]
  grammar: GrammarItem[]
  keySentences: KeySentence[]
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
