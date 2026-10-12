<script setup>
import { computed, ref } from 'vue'
import { useLocaleStore } from '@/composables/useLocale'
import { usePointerParallax, vMagnetic } from '@/composables/motion'

const locale = useLocaleStore()
const t = computed(() => locale.t.backendPage.hero)

const CV_PATH = '/cv-marcelo-ito.pdf'

const hero = ref(null)
const { onPointerMove } = usePointerParallax(hero)

// typed effect: one span per character, revealed by a staggered opacity step
const cmdChars = computed(() => [...t.value.command])
const roleChars = computed(() => [...t.value.role])
</script>

<template>
  <section id="hero" ref="hero" class="be-hero" @pointermove="onPointerMove">
    <div class="be-hero-bg" aria-hidden="true">
      <div class="be-grid" />
      <div class="be-glow" />
      <div class="be-scan" />
    </div>

    <!-- one wrapper: as a grid container, bare text + the caret would become two grid items -->
    <p class="be-hero-bgname" aria-hidden="true"><span>Marcelo Ito<span class="be-bgname-caret">_</span></span></p>

    <div class="be-container be-hero-grid">
      <figure class="be-photo">
        <div class="be-window">
          <figcaption class="be-window-bar">
            <span class="be-dots" aria-hidden="true"><i /><i /><i /></span>
            <span class="be-window-title">{{ t.photoFile }}</span>
          </figcaption>
          <div class="be-photo-frame">
            <img
              src="/assets/images/avatar-portrait-400.webp"
              srcset="/assets/images/avatar-portrait-400.webp 400w, /assets/images/avatar-portrait-600.webp 600w"
              sizes="(max-width: 900px) 220px, 300px"
              width="600"
              height="800"
              :alt="t.photoAlt"
              fetchpriority="high"
            />
            <span class="be-corner be-corner--tl" aria-hidden="true" />
            <span class="be-corner be-corner--tr" aria-hidden="true" />
            <span class="be-corner be-corner--bl" aria-hidden="true" />
            <span class="be-corner be-corner--br" aria-hidden="true" />
            <span class="be-photo-scan" aria-hidden="true" />
          </div>
        </div>
      </figure>

      <div class="be-hero-main">
        <p class="be-cmd" aria-hidden="true">
          <span class="be-prompt">$</span>
          <span class="be-typed"><span v-for="(c, i) in cmdChars" :key="i" :style="{ '--c': i }">{{ c }}</span></span>
        </p>

        <h1 class="be-role">
          <span class="sr-only">{{ t.srName }}</span>
          <span aria-hidden="true">
            <span class="be-role-arrow">&gt;</span>
            <span class="be-typed be-typed--role"><span v-for="(c, i) in roleChars" :key="i" :style="{ '--c': i }">{{ c }}</span></span><span class="be-caret" />
          </span>
        </h1>

        <p class="be-tagline">{{ t.tagline }}</p>

        <figure class="be-window be-stack">
          <figcaption class="be-window-bar">
            <span class="be-dots" aria-hidden="true"><i /><i /><i /></span>
            <span class="be-window-title">{{ t.stackFile }}</span>
          </figcaption>
          <pre class="be-code"><code><span class="be-line be-line--comment" :style="{ '--l': 0 }"><span class="be-ln" aria-hidden="true">1</span><span>{{ t.stackComment }}</span></span><span
            v-for="(row, r) in t.stack"
            :key="row.key"
            class="be-line"
            :style="{ '--l': r + 1 }"
          ><span class="be-ln" aria-hidden="true">{{ r + 2 }}</span><span class="be-key">{{ row.key }}<span class="be-p">:</span></span><span class="be-vals"><span class="be-p">[</span><template
            v-for="(item, ii) in row.items"
            :key="item"
          ><span class="be-tok">{{ item }}</span><span v-if="ii < row.items.length - 1" class="be-p">, </span></template><span class="be-p">]</span></span></span></code></pre>
        </figure>

        <div class="be-hero-ctas">
          <a v-magnetic="0.25" :href="CV_PATH" download="CV-Marcelo-Ito.pdf" class="be-btn be-btn--primary">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" class="arrow-down">
              <path d="M8 1.5v9M4 7l4 4 4-4M2.5 14h11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            {{ t.cta }}
          </a>
          <a v-magnetic="0.25" href="#projetos" class="be-btn be-btn--ghost">
            {{ t.ctaSecondary }}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" class="arrow">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </div>

    <a href="#sobre" class="be-scroll-cue">scroll<span class="sr-only"> — {{ t.scroll }}</span> <span aria-hidden="true">↓</span></a>
  </section>
</template>

<style scoped>
.be-hero {
  --px: 0;
  --py: 0;
  position: relative;
  z-index: 1;
  min-height: 100svh;
  padding: clamp(6rem, 12vh, 7.5rem) 0 4.5rem;
  display: grid;
  align-items: center;
  overflow: hidden;
  isolation: isolate;
}

/* Background ─────────────────────────────────────────────────────────── */
.be-hero-bg {
  position: absolute;
  inset: -4%;
  z-index: -2;
  contain: strict;
  pointer-events: none;
  transform: translate3d(calc(var(--px) * 14px), calc(var(--py) * 10px), 0);
  transition: transform 0.9s var(--ease-out);
}
.be-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(color-mix(in srgb, var(--color-text) 7%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--color-text) 7%, transparent) 1px, transparent 1px);
  background-size: 44px 44px;
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 60% 45%, #000 15%, transparent 75%);
  mask-image: radial-gradient(ellipse 70% 60% at 60% 45%, #000 15%, transparent 75%);
}
.be-glow {
  position: absolute;
  top: 8%;
  right: 6%;
  width: 52vmax;
  height: 52vmax;
  border-radius: 50%;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--be-a) 26%, transparent), transparent);
}
.be-scan {
  /* a soft band sweeping down the grid, like a CRT refresh — transform only */
  position: absolute;
  inset: 0 0 auto;
  height: 22%;
  background: linear-gradient(transparent, color-mix(in srgb, var(--be-a) 9%, transparent), transparent);
  animation: be-scan 9s linear infinite;
  will-change: transform;
}

.be-hero-bgname {
  position: absolute;
  inset: 0;
  z-index: -1;
  display: grid;
  place-items: end center;
  padding: 0 0 1.5vh;
  margin: 0;
  font-family: var(--font-title);
  font-weight: 800;
  font-size: clamp(3.6rem, 12vw, 11rem);
  line-height: 1;
  letter-spacing: -0.05em;
  white-space: nowrap;
  color: transparent;
  -webkit-text-stroke: 1.5px color-mix(in srgb, var(--color-text) 12%, transparent);
  transform: translate3d(calc(var(--px) * -20px), calc(var(--py) * -10px), 0);
  transition: transform 0.9s var(--ease-out);
  pointer-events: none;
  user-select: none;
}
.be-bgname-caret {
  -webkit-text-stroke: 0;
  color: color-mix(in srgb, var(--be-a) 30%, transparent);
  animation: be-blink 1.1s steps(1, end) infinite;
}

/* Layout ─────────────────────────────────────────────────────────────── */
.be-hero-grid {
  display: grid;
  grid-template-columns: minmax(220px, 300px) minmax(0, 1fr);
  gap: clamp(2rem, 5vw, 4.5rem);
  align-items: center;
}

/* Photo ──────────────────────────────────────────────────────────────── */
.be-photo {
  margin: 0;
  animation: be-rise 0.8s var(--ease-out) 0.1s both;
}
.be-photo-frame {
  position: relative;
  aspect-ratio: 3 / 4;
  overflow: hidden;
}
.be-photo-frame img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.9) contrast(1.03);
}
.be-corner {
  position: absolute;
  width: 18px;
  height: 18px;
  border: 2px solid var(--be-code-key);
  animation: be-corner 0.7s var(--ease-spring) 0.6s both;
}
.be-corner--tl { top: 10px; left: 10px; border-right: 0; border-bottom: 0; }
.be-corner--tr { top: 10px; right: 10px; border-left: 0; border-bottom: 0; }
.be-corner--bl { bottom: 10px; left: 10px; border-right: 0; border-top: 0; }
.be-corner--br { bottom: 10px; right: 10px; border-left: 0; border-top: 0; }
.be-photo-scan {
  /* one sweep over the photo on load */
  position: absolute;
  inset: 0 0 auto;
  height: 30%;
  background: linear-gradient(transparent, color-mix(in srgb, var(--be-code-key) 30%, transparent), transparent);
  animation: be-photo-scan 1.4s var(--ease-out) 0.35s both;
}

/* Text ───────────────────────────────────────────────────────────────── */
.be-hero-main { min-width: 0; }

.be-cmd {
  display: flex;
  gap: 0.6rem;
  margin-bottom: 0.7rem;
  font-size: 0.92rem;
  color: var(--color-text-muted);
}
.be-typed > span {
  animation: be-char 0.01s steps(1, end) both;
  animation-delay: calc(0.25s + var(--c) * 70ms);
}
.be-typed--role > span { animation-delay: calc(0.85s + var(--c) * 42ms); }
@keyframes be-char {
  from { opacity: 0; }
  to { opacity: 1; }
}

.be-role {
  font-family: var(--font-title);
  font-weight: 800;
  font-size: clamp(2rem, 4.6vw, 3.6rem);
  line-height: 1.08;
  letter-spacing: -0.04em;
  color: var(--color-text);
  margin-bottom: 1rem;
}
.be-role-arrow { color: var(--color-accent1); margin-right: 0.15em; }

.be-tagline {
  max-width: 56ch;
  font-size: 0.98rem;
  line-height: 1.7;
  color: var(--color-text-muted);
  margin-bottom: 1.6rem;
}

/* stack.yml ──────────────────────────────────────────────────────────── */
.be-stack {
  margin-bottom: 1.6rem;
  animation: be-rise 0.8s var(--ease-out) 0.5s both;
}
.be-code {
  margin: 0;
  padding: 0.85rem 0;
  font-family: var(--font-body);
  font-size: 0.8rem;
  line-height: 1.75;
  white-space: normal;
  overflow: hidden;
}
.be-line {
  display: grid;
  grid-template-columns: 2.6em max-content minmax(0, 1fr);
  gap: 0 0.6em;
  padding-right: 1rem;
  animation: be-line 0.45s var(--ease-out) both;
  animation-delay: calc(1.35s + var(--l) * 75ms);
}
.be-line:hover { background: rgba(255, 255, 255, 0.035); }
.be-line--comment {
  grid-template-columns: 2.6em minmax(0, 1fr);
  color: var(--be-code-comment);
  font-style: italic;
}
.be-ln {
  text-align: right;
  color: var(--be-code-punct);
  user-select: none;
}
.be-key { color: var(--be-code-key); }
.be-p { color: var(--be-code-punct); }
.be-tok {
  color: var(--be-code-str);
  border-radius: 3px;
  transition: background-color 0.2s ease, color 0.2s ease;
}
.be-tok:hover {
  color: var(--be-code-bg);
  background: var(--be-code-str);
}

.be-hero-ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  animation: be-rise 0.8s var(--ease-out) 1.9s both;
}

.be-scroll-cue {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  translate: -50% 0;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  text-decoration: none;
  animation: be-rise 0.8s var(--ease-out) 2.2s both;
}
.be-scroll-cue:hover { color: var(--color-accent1); }

/* Keyframes (transform / opacity only) ─────────────────────────────── */
@keyframes be-rise {
  from { opacity: 0; transform: translate3d(0, 16px, 0); }
  to { opacity: 1; transform: none; }
}
@keyframes be-line {
  from { opacity: 0; transform: translate3d(-10px, 0, 0); }
  to { opacity: 1; transform: none; }
}
@keyframes be-corner {
  from { opacity: 0; transform: scale(1.8); }
  to { opacity: 1; transform: none; }
}
@keyframes be-photo-scan {
  from { transform: translate3d(0, -100%, 0); opacity: 1; }
  to { transform: translate3d(0, 340%, 0); opacity: 0; }
}
@keyframes be-scan {
  from { transform: translate3d(0, -100%, 0); }
  to { transform: translate3d(0, 520%, 0); }
}

@media (max-width: 900px) {
  .be-hero-grid { grid-template-columns: 1fr; gap: 2rem; }
  .be-photo { width: min(220px, 60vw); }
}
@media (max-width: 600px) {
  .be-code { font-size: 0.74rem; }
  .be-hero-bgname { font-size: 18vw; padding-bottom: 3vh; }
}
/* short laptop screens: keep the CTAs above the fold */
@media (min-width: 901px) and (max-height: 820px) {
  .be-hero-grid { grid-template-columns: minmax(200px, 250px) minmax(0, 1fr); }
  .be-role { font-size: clamp(1.9rem, 3.8vw, 2.9rem); margin-bottom: 0.7rem; }
  .be-tagline { margin-bottom: 1.1rem; }
  .be-code { font-size: 0.74rem; line-height: 1.6; padding: 0.6rem 0; }
  .be-stack { margin-bottom: 1.1rem; }
  .be-scroll-cue { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .be-scan,
  .be-photo-scan { display: none; }
}
</style>
