<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
  text: string
  lang: 'ja' | 'zh-CN'
  tone?: 'paper' | 'ink'
}>()
</script>

<template>
  <section class="reading-block" :class="tone === 'ink' ? 'reading-translation' : ''">
    <header>
      <span>{{ eyebrow }}</span>
      <h3>{{ title }}</h3>
    </header>
    <div class="reading-text" :lang="lang">{{ text }}</div>
  </section>
</template>
