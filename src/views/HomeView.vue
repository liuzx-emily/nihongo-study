<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { articles } from '../content'
import ArticleSummary from '../components/ArticleSummary.vue'
import { getArticleProgress, loadStudyProgress, progressError } from '../studyProgress'

const archiveNumbers = new Map(
  articles.map((article, index) => [article.slug, articles.length - index]),
)
const recommendedSlug = ref('')

function updateRecommendation() {
  const articlesByAscendingNumber = [...articles].reverse()
  recommendedSlug.value = articlesByAscendingNumber.find((article) => getArticleProgress(article).status === '学习中')?.slug
    ?? articlesByAscendingNumber.find((article) => getArticleProgress(article).status === '未学')?.slug
    ?? ''
}

async function refreshProgress() {
  try {
    await loadStudyProgress(true)
    updateRecommendation()
  } catch {
    // The shared error message is rendered in the page.
  }
}

async function initializeHome() {
  try {
    await loadStudyProgress()
  } catch {
    return
  }
  updateRecommendation()
  await nextTick()
  if (recommendedSlug.value) {
    document.getElementById(`lesson-${recommendedSlug.value}`)?.scrollIntoView({ block: 'center' })
  }
}

onMounted(() => {
  void initializeHome()
  window.addEventListener('focus', refreshProgress)
})
onBeforeUnmount(() => window.removeEventListener('focus', refreshProgress))
</script>

<template>
  <div class="home-page">
    <header class="home-hero">
      <div class="hero-copy">
        <h1>学习档案</h1>
      </div>
    </header>

    <section class="archive-section" aria-label="文章列表">
      <p v-if="progressError" class="progress-error" role="alert">{{ progressError }}</p>
      <div class="article-list">
        <RouterLink
          v-for="article in articles"
          :id="`lesson-${article.slug}`"
          :key="article.slug"
          :to="`/article/${article.slug}`"
          class="archive-card"
          :class="{ 'recommended-card': recommendedSlug === article.slug }"
        >
          <div class="card-number">{{ String(archiveNumbers.get(article.slug)).padStart(2, '0') }}</div>
          <div class="card-main">
            <ArticleSummary :article="article" :progress="getArticleProgress(article)" />
          </div>
          <div class="card-action" aria-hidden="true">読む <span>↗</span></div>
        </RouterLink>
      </div>
    </section>
  </div>
</template>
