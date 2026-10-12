<script setup>
import '@/styles/motion.css'
import '@/styles/backend.css'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import BackendHero from '@/components/sections/backend/BackendHero.vue'
import BackendAbout from '@/components/sections/backend/BackendAbout.vue'
import BackendProjects from '@/components/sections/backend/BackendProjects.vue'
import BackendContact from '@/components/sections/backend/BackendContact.vue'

// Same staging as FrontendView: hero first (it holds the LCP), the rest one per idle slot.
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
  <div class="be-page">
    <BackendHero />
    <BackendAbout v-if="stage >= 1" />
    <BackendProjects v-if="stage >= 2" />
    <BackendContact v-if="stage >= 3" />
  </div>
</template>
