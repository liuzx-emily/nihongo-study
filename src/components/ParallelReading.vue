<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  japanese: string
  translation: string
}>()

function splitParagraphs(text: string) {
  return text
    .trim()
    .split(/\r?\n(?:[ \t]*\r?\n)*/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

const paragraphPairs = computed(() => {
  const japanese = splitParagraphs(props.japanese)
  const translation = splitParagraphs(props.translation)
  const pairCount = Math.max(japanese.length, translation.length)

  return Array.from({ length: pairCount }, (_, index) => ({
    japanese: japanese[index] ?? '',
    translation: translation[index] ?? '',
  }))
})
</script>

<template>
  <section class="parallel-reading" aria-label="日中对照阅读">
    <header class="reading-heading reading-heading-japanese">
      <span>01</span>
      <h3>修正后的日文稿</h3>
    </header>
    <header class="reading-heading reading-heading-translation">
      <span>02</span>
      <h3>整段中文翻译</h3>
    </header>

    <div v-for="(pair, index) in paragraphPairs" :key="index" class="reading-pair">
      <p class="reading-paragraph reading-japanese" lang="ja">{{ pair.japanese }}</p>
      <p class="reading-paragraph reading-translation" lang="zh-CN">{{ pair.translation }}</p>
    </div>
  </section>
</template>
