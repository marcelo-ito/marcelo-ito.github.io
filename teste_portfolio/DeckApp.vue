<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import './deck.css'

import { slides } from './content.js'
import HeroSlide from './TesteHeroSection.vue'
import AboutSlide from './sections/AboutSlide.vue'
import ProjectsSlide from './sections/ProjectsSlide.vue'
import SkillsSlide from './sections/SkillsSlide.vue'
import ExperienceSlide from './sections/ExperienceSlide.vue'
import ContactSlide from './sections/ContactSlide.vue'

const active = ref(0)
const progress = ref(0)

const current = computed(() => slides[active.value] ?? slides[0])

let observer = null

/** Leva o deck até um slide pelo índice. */
function goTo(index) {
  const clamped = Math.max(0, Math.min(slides.length - 1, index))
  const el = document.getElementById(slides[clamped].id)
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight
  progress.value = max > 0 ? window.scrollY / max : 0
}

/** Setas / PageUp / PageDown / Home / End navegam entre slides. */
function onKey(e) {
  if (e.metaKey || e.ctrlKey || e.altKey) return

  // Não sequestra o teclado quando o foco está num painel que rola por dentro
  if (document.activeElement?.closest?.('.scroll-pane')) return

  const map = {
    ArrowDown: 1, PageDown: 1, ' ': 1,
    ArrowUp: -1, PageUp: -1,
  }

  if (e.key === 'Home') { e.preventDefault(); goTo(0); return }
  if (e.key === 'End') { e.preventDefault(); goTo(slides.length - 1); return }

  const step = map[e.key]
  if (step === undefined) return

  e.preventDefault()
  goTo(active.value + step)
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const index = slides.findIndex((s) => s.id === entry.target.id)
        if (index !== -1) active.value = index
      })
    },
    { threshold: 0.5 },
  )

  slides.forEach((slide) => {
    const el = document.getElementById(slide.id)
    if (el) observer.observe(el)
  })

  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div class="deck">
    <!-- Barra de progresso do deck -->
    <div class="deck-progress" aria-hidden="true">
      <span class="deck-progress-bar" :style="{ transform: `scaleX(${progress})` }" />
    </div>

    <!-- Navegação lateral -->
    <nav class="deck-nav" aria-label="Navegação entre seções">
      <button
        v-for="(slide, i) in slides"
        :key="slide.id"
        type="button"
        class="deck-dot"
        :class="{ 'is-active': i === active }"
        :aria-current="i === active ? 'true' : undefined"
        :aria-label="slide.label"
        @click="goTo(i)"
      >
        <span class="deck-dot-label">{{ slide.label }}</span>
        <span class="deck-dot-mark" />
      </button>
    </nav>

    <!-- Contador -->
    <p class="deck-counter" aria-live="polite">
      <span class="deck-counter-num">{{ current.num }}</span>
      <span class="deck-counter-sep">/</span>
      <span class="deck-counter-total">{{ String(slides.length).padStart(2, '0') }}</span>
      <span class="deck-counter-label">{{ current.label }}</span>
    </p>

    <main>
      <HeroSlide />
      <AboutSlide />
      <ProjectsSlide />
      <SkillsSlide />
      <ExperienceSlide />
      <ContactSlide />
    </main>
  </div>
</template>

<style scoped>
.deck-progress {
  position: fixed; inset: 0 0 auto 0; z-index: 40;
  height: 2px; background: transparent;
}
.deck-progress-bar {
  display: block; height: 100%; width: 100%;
  background: var(--color-accent1);
  transform-origin: left; transform: scaleX(0);
}

/* ── Dots laterais ───────────────────────────────────────── */
.deck-nav {
  position: fixed; z-index: 40;
  top: 50%; right: 1.6rem; transform: translateY(-50%);
  display: flex; flex-direction: column; align-items: flex-end; gap: 1rem;
}

.deck-dot {
  display: flex; align-items: center; gap: 0.7rem;
  background: none; border: 0; padding: 0.25rem 0;
  cursor: pointer; color: var(--color-text-muted);
  font-family: 'DM Mono', ui-monospace, monospace;
}

.deck-dot-label {
  font-size: 0.6rem; letter-spacing: 0.16em; text-transform: uppercase;
  opacity: 0; transform: translateX(6px);
  transition: opacity 0.3s var(--ease-out), transform 0.3s var(--ease-out);
  white-space: nowrap;
}
.deck-dot:hover .deck-dot-label,
.deck-dot.is-active .deck-dot-label { opacity: 1; transform: translateX(0); }
.deck-dot.is-active .deck-dot-label { color: var(--color-accent1); }

.deck-dot-mark {
  width: 22px; height: 1.5px; flex: none;
  background: currentColor; opacity: 0.35;
  transition: width 0.3s var(--ease-out), opacity 0.3s var(--ease-out), background 0.3s;
}
.deck-dot:hover .deck-dot-mark { opacity: 0.7; }
.deck-dot.is-active .deck-dot-mark {
  width: 40px; opacity: 1; background: var(--color-accent1);
}

/* ── Contador ────────────────────────────────────────────── */
.deck-counter {
  position: fixed; z-index: 40; left: 1.8rem; bottom: 1.6rem;
  display: flex; align-items: baseline; gap: 0.4rem;
  font-family: 'DM Mono', ui-monospace, monospace;
  font-size: 0.62rem; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--color-text-muted);
  pointer-events: none;
}
.deck-counter-num { color: var(--color-accent1); font-size: 0.78rem; }
.deck-counter-sep { opacity: 0.5; }
.deck-counter-label {
  margin-left: 0.6rem; padding-left: 0.7rem;
  border-left: 1px solid currentColor;
}

/* O slide de contato é escuro: a chrome precisa clarear junto */
@media (min-width: 821px) {
  .deck-counter { mix-blend-mode: difference; color: #8a8a8a; }
}

@media (max-width: 820px) {
  .deck-nav { right: 0.9rem; gap: 0.75rem; }
  .deck-dot-label { display: none; }
  .deck-dot-mark { width: 14px; }
  .deck-dot.is-active .deck-dot-mark { width: 24px; }
  .deck-counter { left: 1.2rem; bottom: 1rem; }
  .deck-counter-label { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .deck-dot-label, .deck-dot-mark, .deck-progress-bar { transition: none; }
}
</style>
