<script setup>
import '@/styles/motion.css'
import '@/styles/frontend.css'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import FrontendHero from '@/components/sections/frontend/FrontendHero.vue'
import FrontendAbout from '@/components/sections/frontend/FrontendAbout.vue'
import FrontendProjects from '@/components/sections/frontend/FrontendProjects.vue'
import FrontendContact from '@/components/sections/frontend/FrontendContact.vue'

// The hero (which holds the LCP element) renders first; the sections below the fold
// mount one per idle slot, so the first render is one short task instead of a long one.
// A #hash in the URL needs its target right away, so everything renders at once.
const LAST_STAGE = 3
const route = useRoute()
const stage = ref(route.hash ? LAST_STAGE : 0)

onMounted(() => {
  if (stage.value === LAST_STAGE) return
  const idle = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 16))
  const next = () => {
    stage.value++
    if (stage.value < LAST_STAGE) idle(next, { timeout: 250 })
  }
  idle(next, { timeout: 250 })
})
</script>

<template>
  <div class="fe-page">
    <FrontendHero />
    <FrontendAbout v-if="stage >= 1" />
    <FrontendProjects v-if="stage >= 2" />
    <FrontendContact v-if="stage >= 3" />
  </div>
</template>
