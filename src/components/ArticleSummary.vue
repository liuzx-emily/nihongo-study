<script setup lang="ts">
import type { StudyArticle } from '../types'
import { formatProgressDate, type ArticleProgressView } from '../studyProgress'

withDefaults(defineProps<{
  article: StudyArticle
  progress: ArticleProgressView
  headingLevel?: 'h1' | 'h3'
}>(), {
  headingLevel: 'h3',
})
</script>

<template>
  <div class="article-summary">
    <component :is="headingLevel" class="article-summary-title" lang="ja">
      {{ article.title }}
    </component>
    <p class="article-summary-description" lang="ja">{{ article.description }}</p>
    <div class="article-summary-meta">
      <span class="meta-item progress-status" :class="`progress-status-${progress.status}`">
        <span class="status-dot" aria-hidden="true"></span>
        <span>{{ progress.status }}（{{ progress.completedCount }}/{{ progress.totalCount }}）</span>
      </span>
      <span v-if="progress.status === '学习中' && progress.startedOn" class="meta-item progress-date">
        <span class="meta-label">开始日期</span>
        <time :datetime="progress.startedOn">{{ formatProgressDate(progress.startedOn, '') }}</time>
      </span>
      <span v-if="progress.status === '已学' && progress.completedOn" class="meta-item progress-date">
        <span class="meta-label">完成日期</span>
        <time :datetime="progress.completedOn">{{ formatProgressDate(progress.completedOn, '') }}</time>
      </span>
      <span class="meta-item article-author">
        <span class="meta-label">作者</span>
        <span>{{ article.speakers.join(' / ') }}</span>
      </span>
    </div>
  </div>
</template>
