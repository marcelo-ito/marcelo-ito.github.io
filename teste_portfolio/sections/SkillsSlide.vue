<script setup lang="ts">
import { useTemplateRef } from 'vue'
import SlideBg from './SlideBg.vue'
import { skills, slides } from '../content.js'
import { useSlideReveal } from '../useSlide.js'

const meta = slides[3]
const root = useTemplateRef('root')

useSlideReveal(root, (gsap) => gsap
  .timeline({ defaults: { ease: 'power3.out' } })
  .to('.slide-rule', { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, 0)
  .to('.slide-num, .slide-title', { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0)
  .to('.sk-group', { opacity: 1, y: 0, duration: 0.6, stagger: 0.09 }, 0.2)
  .to('.sk-line', { scaleX: 1, duration: 0.6, stagger: 0.09, ease: 'power2.inOut' }, 0.3)
  .to('.sk-item', { opacity: 1, y: 0, duration: 0.4, stagger: 0.018, ease: 'power2.out' }, 0.4))
</script>

<template>
  <section :id="meta.id" ref="root" class="slide slide--accent">
    <SlideBg />

    <div class="slide-inner">
      <header class="slide-head">
        <span class="slide-num" data-reveal="fade">{{ meta.num }}</span>
        <h2 class="slide-title" data-reveal="up">Skills</h2>
        <span class="slide-rule" />
      </header>

      <div class="sk-grid">
        <section v-for="group in skills" :key="group.title" class="sk-group">
          <h3 class="sk-group-title">
            {{ group.title }}
            <span class="sk-count">{{ String(group.items.length).padStart(2, '0') }}</span>
          </h3>
          <span class="sk-line" aria-hidden="true" />

          <ul class="sk-items">
            <li v-for="item in group.items" :key="item" class="sk-item">{{ item }}</li>
          </ul>
        </section>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sk-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem 2.5rem;
}

.sk-group { opacity: 0; transform: translateY(26px); }

.sk-group-title {
  display: flex; align-items: baseline; justify-content: space-between;
  gap: 0.75rem;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.1rem; font-weight: 700; letter-spacing: -0.01em;
  margin-bottom: 0.55rem;
}
.sk-count { font-family: inherit; font-size: 0.62rem; letter-spacing: 0.18em; color: var(--color-accent1); }

.sk-line {
  display: block; height: 1.5px; background: var(--color-accent1);
  opacity: 0.65; margin-bottom: 1rem;
  transform: scaleX(0); transform-origin: left;
}

.sk-items { display: flex; flex-wrap: wrap; gap: 0.42rem; list-style: none; }

.sk-item {
  opacity: 0; transform: translateY(8px);
  font-size: 0.68rem; letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--color-text);
  background: var(--glass); border: 1px solid var(--color-accent1);
  padding: 0.38rem 0.75rem; border-radius: 3px;
  transition: background 0.22s var(--ease-out), color 0.22s var(--ease-out);
  cursor: default;
}
.sk-item:hover { background: var(--color-accent1); color: var(--color-bg); }

@media (max-width: 1100px) {
  .sk-grid { grid-template-columns: repeat(2, 1fr); gap: 1.6rem 2rem; }
  .sk-item { font-size: 0.64rem; padding: 0.32rem 0.62rem; }
}
@media (max-width: 820px) {
  .sk-grid { grid-template-columns: 1fr; gap: 1.6rem; }
}
</style>
