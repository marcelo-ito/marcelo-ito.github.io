<script setup lang="ts">
import { useTemplateRef } from 'vue'
import SlideBg from './SlideBg.vue'
import { contact, slides } from '../content.js'
import { useSlideReveal, floatLoop } from '../useSlide.js'

const meta = slides[5]
const root = useTemplateRef('root')

function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

useSlideReveal(
  root,
  (gsap) => gsap
    .timeline({ defaults: { ease: 'power3.out' } })
    .to('.ct-eyebrow', { opacity: 1, y: 0, duration: 0.6 }, 0)
    // O GSAP lê o translateY(105%) do CSS como `y` em pixels e mantém yPercent
    // em zero — daí o fromTo explícito, zerando as duas partes no fim.
    .fromTo(
      '.ct-line span',
      { yPercent: 105, y: 0 },
      { yPercent: 0, y: 0, duration: 0.9, stagger: 0.09 },
      0.1,
    )
    .to('.ct-links', { opacity: 1, y: 0, duration: 0.7 }, 0.55)
    .to('.ct-email', { opacity: 1, y: 0, duration: 0.7 }, 0.7)
    .to('.ct-foot', { opacity: 1, duration: 0.6 }, 0.9),
  { extras: () => floatLoop('.ct-orb', -6, 6) },
)
</script>

<template>
  <section :id="meta.id" ref="root" class="slide slide--dark">
    <SlideBg third />
    <span class="ct-orb" data-depth="9" aria-hidden="true" />

    <div class="ct">
      <p class="pill ct-eyebrow">{{ contact.eyebrow }}</p>

      <h2 class="ct-title">
        <span class="ct-line"><span>{{ contact.title1 }}</span></span>
        <span class="ct-line"><span><em>{{ contact.title2 }}</em></span></span>
        <span class="ct-line"><span>{{ contact.title3 }}</span></span>
      </h2>

      <nav class="ct-links" aria-label="Redes sociais">
        <a
          v-for="link in contact.links"
          :key="link.label"
          class="ct-link"
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          data-magnetic
        >{{ link.label }}</a>
      </nav>

      <a class="ct-email" :href="`mailto:${contact.email}`">{{ contact.email }}</a>

      <div class="ct-foot">
        <button class="ct-top" type="button" @click="toTop">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 10V2M2.5 5.5 6 2l3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          voltar ao início
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.slide--dark :deep(.sbg-blob) { opacity: 0.22; }

.ct {
  position: relative;
  display: flex; flex-direction: column; align-items: center; text-align: center;
  padding: 5.5rem 2rem;
}

.ct-orb {
  position: absolute; top: 50%; left: 50%;
  width: 420px; height: 420px; margin: -210px 0 0 -210px;
  border-radius: 46% 54% 60% 40% / 52% 44% 56% 48%;
  border: 1px solid var(--color-accent1);
  opacity: 0.22; z-index: -1;
  animation: ct-morph 12s ease-in-out infinite alternate;
}
@keyframes ct-morph {
  to { border-radius: 62% 38% 40% 60% / 44% 62% 38% 56%; rotate: 30deg; scale: 1.1; }
}

.ct-eyebrow {
  color: var(--color-accent1);
  margin-bottom: 2rem;
  opacity: 0; transform: translateY(16px);
}

.ct-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(2.6rem, 6.4vw, 6rem);
  font-weight: 900; line-height: 0.95; letter-spacing: -0.03em;
  margin-bottom: 2.6rem;
}
.ct-line { display: block; overflow: hidden; padding-bottom: 0.06em; }
.ct-line > span { display: block; transform: translateY(105%); }
.ct-title em { font-style: italic; color: var(--color-accent1); }

.ct-links {
  display: flex; gap: 2.5rem; margin-bottom: 2.4rem;
  opacity: 0; transform: translateY(18px);
}
.ct-link {
  font-size: 0.76rem; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--color-accent3); text-decoration: none;
  border-bottom: 1px solid transparent; padding-bottom: 0.25rem;
  will-change: transform;
  transition: color 0.2s, border-color 0.2s;
}
.ct-link:hover { color: var(--color-accent1); border-bottom-color: var(--color-accent1); }

.ct-email {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(1rem, 3vw, 1.6rem); font-style: italic;
  color: var(--color-accent1); text-decoration: none;
  border-bottom: 1px solid transparent;
  word-break: break-word; max-width: 100%;
  opacity: 0; transform: translateY(18px);
  transition: border-color 0.2s;
}
.ct-email:hover { border-bottom-color: var(--color-accent1); }

.ct-foot { margin-top: 3rem; opacity: 0; }
.ct-top {
  display: inline-flex; align-items: center; gap: 0.55rem;
  font-family: inherit; font-size: 0.64rem;
  letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--color-text-muted); background: none; border: 0;
  cursor: pointer; padding: 0.5rem;
  transition: color 0.2s;
}
.ct-top:hover { color: var(--color-accent1); }

@media (max-width: 820px) {
  .ct { padding: 4.5rem 1.5rem; }
  .ct-orb { width: 280px; height: 280px; margin: -140px 0 0 -140px; }
  .ct-links { gap: 1.5rem; flex-wrap: wrap; justify-content: center; }
}
</style>
