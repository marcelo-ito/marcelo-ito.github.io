<script setup lang="ts">
import { useTemplateRef } from 'vue'
import SlideBg from './SlideBg.vue'
import { experience, slides } from '../content.js'
import { useSlideReveal } from '../useSlide.js'

const meta = slides[4]
const root = useTemplateRef('root')

useSlideReveal(root, (gsap) => gsap
  .timeline({ defaults: { ease: 'power3.out' } })
  .to('.slide-rule', { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, 0)
  .to('.slide-num, .slide-title', { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0)
  .to('.xp-rail', { scaleX: 1, duration: 1, ease: 'power2.inOut' }, 0.15)
  .to('.xp-node', { scale: 1, opacity: 1, duration: 0.45, stagger: 0.25, ease: 'back.out(2.2)' }, 0.55)
  .to('.xp-card', { opacity: 1, y: 0, duration: 0.7, stagger: 0.15 }, 0.65)
  .to('.xp-bullet', { opacity: 1, x: 0, duration: 0.4, stagger: 0.04, ease: 'power2.out' }, 0.95))
</script>

<template>
  <section :id="meta.id" ref="root" class="slide slide--surface">
    <SlideBg third />

    <div class="slide-inner">
      <header class="slide-head">
        <span class="slide-num" data-reveal="fade">{{ meta.num }}</span>
        <h2 class="slide-title" data-reveal="up">Experiência</h2>
        <span class="slide-rule" />
      </header>

      <div class="xp">
        <span class="xp-rail" aria-hidden="true" />

        <div class="xp-track">
          <article
            v-for="item in experience.items"
            :key="item.company"
            class="xp-col"
          >
            <span class="xp-node" :class="{ 'xp-node--current': item.current }" aria-hidden="true" />

            <div class="xp-card glass">
              <div class="xp-head">
                <span class="xp-period">{{ item.period }}</span>
                <span v-if="item.current" class="xp-badge">
                  <i class="live-dot" />{{ experience.currentLabel }}
                </span>
              </div>

              <h3 class="xp-role">{{ item.role }}</h3>
              <p class="xp-company">{{ item.company }}</p>

              <ul class="xp-bullets scroll-pane">
                <li v-for="(bullet, i) in item.bullets" :key="i" class="xp-bullet">{{ bullet }}</li>
              </ul>

              <ul class="xp-tags">
                <li v-for="tag in item.tags" :key="tag">{{ tag }}</li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.xp { position: relative; padding-top: 1.6rem; }

.xp-rail {
  position: absolute; top: 0.4rem; left: 0; right: 0;
  height: 1.5px; background: var(--color-accent1); opacity: 0.45;
  transform: scaleX(0); transform-origin: left;
}

.xp-track { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.6rem; }

.xp-col { position: relative; }

.xp-node {
  position: absolute; top: -1.55rem; left: 2rem;
  width: 13px; height: 13px; border-radius: 50%;
  background: var(--color-accent1);
  border: 3px solid var(--color-surface);
  opacity: 0; transform: scale(0);
}
.xp-node--current { background: var(--color-success); }

.xp-card {
  display: flex; flex-direction: column;
  padding: 1.4rem 1.5rem;
  opacity: 0; transform: translateY(26px);
  border-top: 2px solid var(--color-accent1);
}

.xp-head {
  display: flex; align-items: center; justify-content: space-between;
  gap: 0.75rem; margin-bottom: 0.8rem;
}
.xp-period { font-size: 0.66rem; letter-spacing: 0.14em; color: var(--color-text-muted); }
.xp-badge {
  display: inline-flex; align-items: center; gap: 0.45rem;
  font-size: 0.58rem; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--color-success);
}

.xp-role {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.32rem; font-weight: 700; line-height: 1.15; letter-spacing: -0.01em;
}
.xp-company {
  font-size: 0.7rem; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--color-accent1); margin: 0.3rem 0 1rem;
}

.xp-bullets {
  list-style: none; max-height: 11.5rem; padding-right: 0.9rem;
  margin-bottom: 1.1rem;
}
.xp-bullet {
  position: relative; padding-left: 1rem;
  font-size: 0.76rem; line-height: 1.6; color: var(--color-text-muted);
  opacity: 0; transform: translateX(-12px);
}
.xp-bullet + .xp-bullet { margin-top: 0.5rem; }
.xp-bullet::before {
  content: ''; position: absolute; left: 0; top: 0.55em;
  width: 5px; height: 1px; background: var(--color-accent1);
}

.xp-tags {
  display: flex; flex-wrap: wrap; gap: 0.35rem; list-style: none;
  border-top: 1px solid var(--glass-border); padding-top: 0.9rem;
}
.xp-tags li {
  font-size: 0.6rem; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--color-text-muted);
  border: 1px solid var(--glass-border);
  padding: 0.22rem 0.5rem; border-radius: 3px;
}

@media (max-width: 1100px) {
  .xp-bullets { max-height: 9rem; }
  .xp-role { font-size: 1.15rem; }
}
@media (max-width: 820px) {
  .xp-track { grid-template-columns: 1fr; gap: 2.4rem; }
  .xp-rail { display: none; }
  .xp-node { top: -1rem; left: 1.5rem; }
}
</style>
