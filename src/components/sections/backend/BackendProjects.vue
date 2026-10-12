<script setup>
import { computed } from 'vue'
import ArchDiagram from '@/components/ui/ArchDiagram.vue'
import ProjectCarousel from '@/components/ui/ProjectCarousel.vue'
import { useLocaleStore } from '@/composables/useLocale'
import { splitWords, vReveal } from '@/composables/motion'
import { backendProjects } from '@/data/backendProjects'

const locale = useLocaleStore()
const t = computed(() => locale.t.backendPage.projects)
const titleWords = computed(() => splitWords(t.value.title))

const items = computed(() =>
  backendProjects.map((p) => ({ ...p, ...t.value.items[p.id] })),
)

const labels = computed(() => ({
  region: t.value.carouselLabel,
  prev: t.value.prev,
  next: t.value.next,
  of: t.value.of,
  highlights: t.value.highlightsLabel,
  stack: t.value.stackLabel,
}))
</script>

<template>
  <section id="projetos" class="be-section be-projects">
    <div class="be-container be-projects-head">
      <p v-reveal class="be-eyebrow">{{ t.eyebrow }}</p>
      <h2 v-reveal:split class="be-heading">
        <span class="sr-only">{{ t.title }}</span>
        <span aria-hidden="true">
          <template v-for="(word, i) in titleWords" :key="i">
            <span class="split-word"><span :style="{ '--i': i }">{{ word }}</span></span>{{ ' ' }}
          </template>
        </span>
      </h2>
      <p v-reveal="{ delay: 150 }" class="be-projects-intro">{{ t.intro }}</p>
    </div>

    <div v-reveal="{ delay: 200 }">
      <ProjectCarousel :items="items" :labels="labels">
        <template #media="{ item, active }">
          <figure class="be-window be-diagram">
            <figcaption class="be-window-bar">
              <span class="be-dots" aria-hidden="true"><i /><i /><i /></span>
              <span class="be-window-title">{{ item.folder }}/architecture.svg</span>
            </figcaption>
            <div class="be-diagram-body">
              <ArchDiagram :diagram="item.diagram" :label="`${t.diagramLabel} ${item.name}`" :active="active" />
            </div>
          </figure>
        </template>
      </ProjectCarousel>
    </div>
  </section>
</template>

<style scoped>
.be-projects {
  overflow: hidden;
  background:
    radial-gradient(45% 40% at 100% 15%, color-mix(in srgb, var(--be-a) 10%, transparent), transparent 70%),
    var(--color-bg);
}
.be-projects-head { margin-bottom: 1rem; }
.be-projects-intro {
  max-width: 64ch;
  margin-top: 1rem;
  font-size: 0.93rem;
  line-height: 1.8;
  color: var(--color-text-muted);
}
.be-diagram-body {
  padding: clamp(0.75rem, 2vw, 1.25rem);
  background-image: radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.07) 1px, transparent 0);
  background-size: 18px 18px;
}
</style>
