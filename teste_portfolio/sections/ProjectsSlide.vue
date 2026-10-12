<script setup lang="ts">
import { useTemplateRef } from 'vue'
import SlideBg from './SlideBg.vue'
import { projects, slides } from '../content.js'
import { useSlideReveal } from '../useSlide.js'

const meta = slides[2]
const root = useTemplateRef('root')

useSlideReveal(root, (gsap) => gsap
  .timeline({ defaults: { ease: 'power3.out' } })
  .to('.slide-rule', { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, 0)
  .to('.slide-num, .slide-title', { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0)
  .to('.pj-card', { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.07 }, 0.25))
</script>

<template>
  <section :id="meta.id" ref="root" class="slide slide--bg">
    <SlideBg third />

    <div class="slide-inner">
      <header class="slide-head">
        <span class="slide-num" data-reveal="fade">{{ meta.num }}</span>
        <h2 class="slide-title" data-reveal="up">Projetos</h2>
        <span class="slide-rule" />
      </header>

      <div class="pj-grid">
        <article
          v-for="(project, i) in projects.items"
          :key="project.name"
          class="pj-card glass"
          :class="{ 'pj-card--featured': project.featured }"
        >
          <div class="pj-top">
            <span class="pj-num">{{ project.featured ? '★' : String(i).padStart(2, '0') }}</span>
            <span v-if="project.featured" class="pj-flag">{{ projects.featuredLabel }}</span>
          </div>

          <h3 class="pj-name">{{ project.name }}</h3>
          <p class="pj-desc">{{ project.description }}</p>

          <ul class="pj-tags">
            <li v-for="tag in project.tags" :key="tag">{{ tag }}</li>
          </ul>

          <span class="pj-glow" aria-hidden="true" />
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pj-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 1fr;
  gap: 1rem;
}

.pj-card {
  position: relative; overflow: hidden;
  display: flex; flex-direction: column;
  padding: 1.3rem 1.4rem;
  opacity: 0; transform: translateY(24px) scale(0.97);
  transition: border-color 0.3s var(--ease-out);
  will-change: transform;
}
.pj-card:hover { border-color: var(--color-accent1); }
.pj-card--featured { border-left: 3px solid var(--color-accent1); }

.pj-glow {
  position: absolute; inset: -40% 50% 50% -40%;
  background: radial-gradient(circle, var(--color-accent1) 0%, transparent 65%);
  opacity: 0; transition: opacity 0.4s var(--ease-out);
  pointer-events: none; z-index: -1;
}
.pj-card:hover .pj-glow { opacity: 0.28; }

.pj-top {
  display: flex; align-items: center; justify-content: space-between;
  gap: 0.75rem; margin-bottom: 0.9rem;
}
.pj-num { font-size: 0.7rem; letter-spacing: 0.18em; color: var(--color-accent1); }
.pj-flag {
  font-size: 0.58rem; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--color-error); white-space: nowrap;
}

.pj-name {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.32rem; font-weight: 700; line-height: 1.15;
  letter-spacing: -0.01em; margin-bottom: 0.6rem;
}

.pj-desc {
  font-size: 0.78rem; line-height: 1.65; color: var(--color-text-muted);
  margin-bottom: 1rem; flex: 1;
  display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 4;
  line-clamp: 4; overflow: hidden;
}

.pj-tags { display: flex; flex-wrap: wrap; gap: 0.35rem; list-style: none; }
.pj-tags li {
  font-size: 0.6rem; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--color-text-muted);
  border: 1px solid var(--glass-border);
  padding: 0.22rem 0.5rem; border-radius: 3px;
}

@media (min-width: 1101px) and (max-height: 860px) {
  .pj-card { padding: 1rem 1.15rem; }
  .pj-name { font-size: 1.18rem; }
  .pj-desc { -webkit-line-clamp: 3; line-clamp: 3; margin-bottom: 0.75rem; }
}
@media (max-width: 1100px) {
  .pj-grid { grid-template-columns: repeat(2, 1fr); gap: 0.8rem; }
  .pj-card { padding: 1.1rem 1.2rem; }
  .pj-name { font-size: 1.15rem; }
  .pj-desc { -webkit-line-clamp: 3; line-clamp: 3; }
}
@media (max-width: 820px) {
  .pj-grid { grid-template-columns: 1fr; }
  .pj-desc { -webkit-line-clamp: unset; line-clamp: unset; }
}
</style>
