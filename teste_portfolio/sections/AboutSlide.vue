<script setup lang="ts">
import { useTemplateRef } from 'vue'
import SlideBg from './SlideBg.vue'
import { about, slides } from '../content.js'
import { useSlideReveal, floatLoop } from '../useSlide.js'

const meta = slides[1]
const root = useTemplateRef('root')

useSlideReveal(
  root,
  (gsap) => gsap
    .timeline({ defaults: { ease: 'power3.out' } })
    .to('.slide-rule', { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, 0)
    .to('[data-reveal]', { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.7, stagger: 0.07 }, 0.1),
  {
    extras: () => {
      floatLoop('.about-photo-wrap', -3, 5)
      floatLoop('.about-chip', -14, 4.2, 0.5)
    },
  },
)
</script>

<template>
  <section :id="meta.id" ref="root" class="slide slide--surface">
    <SlideBg />

    <div class="slide-inner about">
      <header class="slide-head">
        <span class="slide-num" data-reveal="fade">{{ meta.num }}</span>
        <h2 class="slide-title" data-reveal="up">{{ about.eyebrow }}</h2>
        <span class="slide-rule" />
      </header>

      <div class="about-grid">
        <aside class="about-side">
          <div class="about-photo-wrap" data-reveal="left">
            <img
              class="about-photo"
              :src="about.photo"
              :alt="about.photoAlt"
              width="220"
              height="280"
              loading="lazy"
            >
            <span class="about-frame" aria-hidden="true" />
          </div>

          <p class="pill about-chip" data-reveal="left">
            <i class="live-dot" /> fullstack júnior
          </p>
        </aside>

        <div class="about-main">
          <h3 class="about-title" data-reveal="up">
            {{ about.title1 }}<br>
            <em>{{ about.title2 }}</em> {{ about.title3 }}
          </h3>

          <div class="about-bio scroll-pane" data-reveal="up">
            <p v-for="(paragraph, i) in about.bio" :key="i">{{ paragraph }}</p>
          </div>

          <div class="about-bottom" data-reveal="up">
            <dl class="about-stats">
              <div v-for="stat in about.stats" :key="stat.label" class="about-stat">
                <dt class="about-stat-num">{{ stat.value }}</dt>
                <dd class="about-stat-label">{{ stat.label }}</dd>
              </div>
            </dl>

            <a
              class="about-cv"
              :href="about.cv.href"
              :download="about.cv.file"
              data-magnetic
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M7 1v8M3 6l4 4 4-4M2 12h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              {{ about.cv.label }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-grid {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 3.5rem;
  align-items: start;
}

.about-side { display: flex; flex-direction: column; align-items: center; gap: 1.4rem; }

.about-photo-wrap { position: relative; width: 220px; }
.about-photo {
  display: block; width: 220px; height: 280px;
  object-fit: cover; object-position: top;
  border-radius: 4px; position: relative; z-index: 1;
  filter: grayscale(25%); transition: filter 0.4s ease;
}
.about-photo:hover { filter: grayscale(0%); }
.about-frame {
  position: absolute; top: 14px; left: 14px; right: -14px; bottom: -14px;
  border: 1.5px solid var(--color-accent1); opacity: 0.55; border-radius: 4px;
}

.about-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(1.7rem, 3.2vw, 2.8rem);
  font-weight: 700; line-height: 1.08; letter-spacing: -0.02em;
  margin-bottom: 1.4rem;
}
.about-title em { display: inline; font-style: italic; color: var(--color-error); }

.about-bio {
  max-height: 15.5rem;
  padding-right: 1rem;
  margin-bottom: 1.8rem;
  font-size: 0.92rem; line-height: 1.75; color: var(--color-text-muted);
}
.about-bio p + p { margin-top: 0.9rem; }

.about-bottom {
  display: flex; flex-wrap: wrap; align-items: center;
  justify-content: space-between; gap: 1.5rem;
  border-top: 1px solid var(--glass-border); padding-top: 1.5rem;
}

.about-stats { display: flex; gap: 2.5rem; }
.about-stat-num {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.9rem; font-weight: 900; line-height: 1;
  color: var(--color-accent1);
}
.about-stat-label {
  margin: 0.35rem 0 0;
  font-size: 0.62rem; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--color-text-muted);
}

.about-cv {
  display: inline-flex; align-items: center; gap: 0.7rem;
  font-family: inherit; font-size: 0.74rem;
  letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none;
  color: var(--color-text); border: 1px solid var(--color-text);
  padding: 0.8rem 1.5rem; will-change: transform;
  transition: background 0.25s var(--ease-out), color 0.25s var(--ease-out);
}
.about-cv:hover { background: var(--color-text); color: var(--color-bg); }

@media (max-width: 1100px) {
  .about-grid { grid-template-columns: 180px 1fr; gap: 2.2rem; }
  .about-photo-wrap, .about-photo { width: 180px; }
  .about-photo { height: 230px; }
  .about-bio { max-height: 12rem; }
}
@media (max-width: 820px) {
  .about-grid { grid-template-columns: 1fr; gap: 2rem; }
  .about-side { flex-direction: row; align-items: flex-end; justify-content: flex-start; gap: 2rem; }
  .about-bottom { flex-direction: column; align-items: flex-start; }
  .about-stats { gap: 1.8rem; }
}
</style>
