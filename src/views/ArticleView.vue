<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getArticle } from '../content'
import ParallelReading from '../components/ParallelReading.vue'
import ArticleSummary from '../components/ArticleSummary.vue'
import {
  getArticleProgress,
  isArticleSaving,
  isSectionCompleted,
  loadStudyProgress,
  progressEditable,
  progressError,
  progressLoaded,
  toggleAllSections,
  toggleSectionProgress,
} from '../studyProgress'
import {
  contentDeleting,
  contentEditable,
  contentError,
  contentErrorKind,
  contentErrorSectionId,
  deleteContentItem,
} from '../vocabularyEditing'
import type { DeletableContentItem, DeletableContentKind } from '../vocabularyEditing'

const route = useRoute()
const article = computed(() => getArticle(String(route.params.slug)))
const articleProgress = computed(() => article.value ? getArticleProgress(article.value) : undefined)
const readingProgress = ref(0)
const showBackToTop = ref(false)
const activeSection = ref('')
const confirmingBulkAction = ref(false)
const bulkButton = ref<HTMLButtonElement>()
const tocSections = ref<HTMLElement>()
const confirmingDeletion = shallowRef<{
  kind: DeletableContentKind
  sectionId: string
  item: DeletableContentItem
}>()

function updateReadingState() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  readingProgress.value = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0
  showBackToTop.value = window.scrollY > 200
  if (!article.value) return
  const anchors = article.value.sections
    .map((section) => document.getElementById(section.id))
    .filter(Boolean) as HTMLElement[]
  const visible = [...anchors].reverse().find((anchor) => anchor.getBoundingClientRect().top <= 150)
  activeSection.value = visible?.id ?? anchors[0]?.id ?? ''
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function revealActiveTocSection(alignToTop = false) {
  const container = tocSections.value
  const activeLink = container?.querySelector<HTMLElement>('.toc-section-link.active')
  if (!container || !activeLink) return

  const containerRect = container.getBoundingClientRect()
  const linkRect = activeLink.getBoundingClientRect()
  if (alignToTop || linkRect.top < containerRect.top) {
    container.scrollTop += linkRect.top - containerRect.top
  } else if (linkRect.bottom > containerRect.bottom) {
    container.scrollTop += linkRect.bottom - containerRect.bottom
  }
}

async function initializeArticle() {
  confirmingBulkAction.value = false
  confirmingDeletion.value = undefined
  try {
    await loadStudyProgress()
  } catch {
    return
  }
  await nextTick()
  if (!article.value || route.hash || articleProgress.value?.status !== '学习中') return
  const firstIncomplete = article.value.sections.find((section) => !isSectionCompleted(article.value!, section.id))
  document.getElementById(firstIncomplete?.id ?? '')?.scrollIntoView({ block: 'start' })
  updateReadingState()
  await nextTick()
  revealActiveTocSection(true)
}

async function refreshProgress() {
  try {
    await loadStudyProgress(true)
  } catch {
    // The shared error message is rendered in the page.
  }
}

async function handleBulkAction() {
  if (!article.value || isArticleSaving(article.value.slug)) return
  if (!confirmingBulkAction.value) {
    confirmingBulkAction.value = true
    return
  }
  confirmingBulkAction.value = false
  await toggleAllSections(article.value)
}

function isConfirmingDeletion(kind: DeletableContentKind, sectionId: string, item: DeletableContentItem) {
  return confirmingDeletion.value?.kind === kind
    && confirmingDeletion.value.sectionId === sectionId
    && confirmingDeletion.value.item === item
}

async function handleContentDelete(kind: DeletableContentKind, sectionId: string, item: DeletableContentItem) {
  if (!article.value || contentDeleting.value) return
  if (!isConfirmingDeletion(kind, sectionId, item)) {
    confirmingDeletion.value = { kind, sectionId, item }
    return
  }
  confirmingDeletion.value = undefined
  if (!await deleteContentItem(article.value, sectionId, kind, item)) return
  const section = article.value.sections.find((candidate) => candidate.id === sectionId)
  const items = section?.[kind] as DeletableContentItem[] | undefined
  const index = items?.indexOf(item) ?? -1
  if (items && index >= 0) items.splice(index, 1)
}

function showsContentError(sectionId: string, kinds: DeletableContentKind[]) {
  return contentError.value
    && contentErrorSectionId.value === sectionId
    && contentErrorKind.value !== undefined
    && kinds.includes(contentErrorKind.value)
}

function cancelBulkConfirmation(event: MouseEvent) {
  if (confirmingBulkAction.value && !bulkButton.value?.contains(event.target as Node)) {
    confirmingBulkAction.value = false
  }
  if (confirmingDeletion.value && !(event.target as Element).closest?.('.content-delete-button.confirming')) {
    confirmingDeletion.value = undefined
  }
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    confirmingBulkAction.value = false
    confirmingDeletion.value = undefined
  }
}

onMounted(() => {
  updateReadingState()
  void initializeArticle()
  window.addEventListener('scroll', updateReadingState, { passive: true })
  window.addEventListener('focus', refreshProgress)
  document.addEventListener('mousedown', cancelBulkConfirmation)
  document.addEventListener('keydown', handleEscape)
})
watch(() => route.params.slug, () => void initializeArticle())
watch(activeSection, async () => {
  await nextTick()
  revealActiveTocSection()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateReadingState)
  window.removeEventListener('focus', refreshProgress)
  document.removeEventListener('mousedown', cancelBulkConfirmation)
  document.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <div v-if="article" class="article-page">
    <div class="reading-progress" :style="{ width: `${readingProgress}%` }" />
    <header class="article-hero">
      <a
        v-if="article.url"
        class="source-link"
        :href="article.url"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="打开原始页面"
        title="打开原始页面"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14 5h5v5M19 5l-8 8M17 13v5H6V7h5" />
        </svg>
      </a>
      <ArticleSummary v-if="articleProgress" :article="article" :progress="articleProgress" heading-level="h1" />
      <div v-if="articleProgress && progressEditable" class="article-progress-actions">
        <p v-if="progressError" class="progress-error" role="alert">{{ progressError }}</p>
        <button
          ref="bulkButton"
          class="bulk-progress-button"
          :class="{ confirming: confirmingBulkAction }"
          type="button"
          :disabled="isArticleSaving(article.slug) || !progressLoaded"
          @click="handleBulkAction"
        >
          <svg v-if="articleProgress.status !== '已学'" viewBox="0 0 24 24" aria-hidden="true">
            <path d="m4 12 4 4L18 6M11 17l2 2 7-8" />
          </svg>
          <svg v-else viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7v5h5M5 12a7 7 0 1 0 2-5" />
          </svg>
          <span v-if="isArticleSaving(article.slug)">正在保存…</span>
          <span v-else-if="confirmingBulkAction">
            {{ articleProgress.status === '已学' ? '确认全部设为未学' : '确认学完全部' }}
          </span>
          <span v-else>{{ articleProgress.status === '已学' ? '全部设为未学' : '学完全部' }}</span>
        </button>
      </div>
    </header>

    <div class="article-layout">
      <aside class="toc">
        <div class="toc-header">
          <span>CONTENTS</span>
          <RouterLink class="toc-home-link" to="/">
            <span aria-hidden="true">←</span>
            <span>档案</span>
          </RouterLink>
        </div>
        <nav ref="tocSections" class="toc-sections" aria-label="文章目录">
          <RouterLink
            v-for="(section, index) in article.sections"
            :key="section.id"
            class="toc-section-link"
            :to="{ hash: `#${section.id}` }"
            :class="{ active: activeSection === section.id, completed: isSectionCompleted(article, section.id) }"
          >
            <span class="toc-number">{{ String(index + 1).padStart(2, '0') }}</span>
            <span class="toc-title">{{ section.title }}</span>
          </RouterLink>
        </nav>
      </aside>

      <article class="study-content">
        <section
          v-for="(section, sectionIndex) in article.sections"
          :key="section.id"
          class="study-section"
        >
          <header :id="section.id" class="study-section-header">
            <div>
              <span>SECTION {{ String(sectionIndex + 1).padStart(2, '0') }}</span>
              <h2 lang="ja">{{ section.title }}</h2>
            </div>
          </header>

          <ParallelReading :japanese="section.japanese" :translation="section.translation" />

          <section v-if="section.vocabulary.length || section.grammar.length" class="learning-panel">
            <header class="panel-heading">
              <span>03</span>
              <h3>困难单词和语法</h3>
            </header>

            <p v-if="showsContentError(section.id, ['vocabulary', 'grammar'])" class="content-delete-error" role="alert">{{ contentError }}</p>
            <div v-if="section.vocabulary.length" class="data-table vocabulary-table">
              <div class="table-row table-head">
                <span>单词 / 读音</span><span>中文意思</span><span>语境说明</span>
              </div>
              <div v-for="(item, itemIndex) in section.vocabulary" :key="`${item.term}-${itemIndex}`" class="table-row" :class="{ editable: contentEditable }">
                <span class="term-cell"><b lang="ja">{{ item.term }}</b><small v-if="item.reading">{{ item.reading }}</small></span>
                <span>{{ item.meaning }}</span>
                <span>{{ item.note }}</span>
                <button
                  v-if="contentEditable"
                  class="content-delete-button table-delete-button"
                  :class="{ confirming: isConfirmingDeletion('vocabulary', section.id, item) }"
                  type="button"
                  :disabled="contentDeleting"
                  :aria-label="isConfirmingDeletion('vocabulary', section.id, item) ? `确认删除${item.term}` : `删除${item.term}`"
                  :title="isConfirmingDeletion('vocabulary', section.id, item) ? `确认删除${item.term}` : `删除${item.term}`"
                  @click="handleContentDelete('vocabulary', section.id, item)"
                >
                  <span v-if="isConfirmingDeletion('vocabulary', section.id, item)">确认删除</span>
                  <svg v-else viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>
            </div>

            <div v-if="section.grammar.length" class="data-table grammar-table">
              <div class="table-row table-head">
                <span>语法</span><span>例句</span><span>含义</span>
              </div>
              <div v-for="(item, itemIndex) in section.grammar" :key="`${item.pattern}-${itemIndex}`" class="table-row" :class="{ editable: contentEditable }">
                <span class="term-cell"><b lang="ja">{{ item.pattern }}</b></span>
                <span lang="ja">{{ item.example }}</span>
                <span>{{ item.meaning }}</span>
                <button
                  v-if="contentEditable"
                  class="content-delete-button table-delete-button"
                  :class="{ confirming: isConfirmingDeletion('grammar', section.id, item) }"
                  type="button"
                  :disabled="contentDeleting"
                  :aria-label="isConfirmingDeletion('grammar', section.id, item) ? `确认删除${item.pattern}` : `删除${item.pattern}`"
                  :title="isConfirmingDeletion('grammar', section.id, item) ? `确认删除${item.pattern}` : `删除${item.pattern}`"
                  @click="handleContentDelete('grammar', section.id, item)"
                >
                  <span v-if="isConfirmingDeletion('grammar', section.id, item)">确认删除</span>
                  <svg v-else viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>
            </div>
          </section>

          <footer v-if="progressEditable" class="section-progress-footer">
            <div
              class="section-progress-control"
              :class="{ completed: isSectionCompleted(article, section.id) }"
            >
              <button
                type="button"
                :disabled="isArticleSaving(article.slug) || !progressLoaded"
                :aria-label="isSectionCompleted(article, section.id) ? `将${section.title}设为未学` : `将${section.title}标记为已学`"
                :title="isSectionCompleted(article, section.id) ? '设为未学' : '标记为已学'"
                @click="toggleSectionProgress(article, section.id)"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path v-if="isSectionCompleted(article, section.id)" d="m8 12 3 3 6-7" />
                </svg>
              </button>
            </div>
          </footer>
        </section>
      </article>
    </div>

    <button
      v-show="showBackToTop"
      class="back-to-top"
      type="button"
      aria-label="返回顶部"
      title="返回顶部"
      @click="scrollToTop"
    >
      <span aria-hidden="true">↑</span>
    </button>

  </div>
  <div v-else class="not-found">
    <p>404</p><h1>没有找到这篇档案</h1><RouterLink to="/">返回首页</RouterLink>
  </div>
</template>
