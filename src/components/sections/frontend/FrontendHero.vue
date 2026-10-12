<script setup>
import { computed, ref } from 'vue'
import { useLocaleStore } from '@/composables/useLocale'
import { usePointerParallax, vMagnetic } from '@/composables/motion'

const locale = useLocaleStore()
const t = computed(() => locale.t.frontendPage.hero)

const CV_PATH = '/cv-marcelo-ito.pdf'

const hero = ref(null)
const { onPointerMove } = usePointerParallax(hero)

// Badges sit on an ellipse around the avatar (upper half + sides, so they never cover the text).
const ORBIT_ANGLES = [-172, -138, -104, -76, -42, -8]
const orbit = computed(() =>
  t.value.orbit.map((label, i) => {
    const a = (ORBIT_ANGLES[i] * Math.PI) / 180
    return {
      label,
      style: {
        '--x': `${Math.cos(a) * 190}px`,
        '--y': `${Math.sin(a) * 108}px`,
        '--i': i,
        '--float': `${5.6 + (i % 3) * 0.9}s`,
      },
    }
  }),
)
</script>

<template>
  <section id="hero" ref="hero" class="fe-hero" @pointermove="onPointerMove">
    <div class="fe-hero-bg" aria-hidden="true">
      <div class="fe-aurora fe-aurora--a" />
      <div class="fe-aurora fe-aurora--b" />
      <div class="fe-aurora fe-aurora--c" />
      <div class="fe-grid" />
    </div>

    <p class="fe-hero-bgname" aria-hidden="true">Marcelo Ito</p>

    <div class="fe-hero-content">
      <div class="fe-avatar-wrap">
        <div class="fe-avatar">
          <img
            src="/assets/images/avatar-sq-320.webp"
            srcset="/assets/images/avatar-sq-320.webp 320w, /assets/images/avatar-sq-480.webp 480w"
            sizes="148px"
            :alt="t.photoAlt"
            width="148"
            height="148"
            fetchpriority="high"
            decoding="async"
          />
        </div>
        <ul class="fe-orbit" aria-hidden="true">
          <li v-for="item in orbit" :key="item.label" :style="item.style">
            <!-- entrance and float live on separate elements: two transform animations
                 on one element can't both run on the compositor -->
            <span class="fe-orbit-pop"><span class="fe-orbit-chip">{{ item.label }}</span></span>
          </li>
        </ul>
      </div>

      <span class="fe-chip">
        <span class="fe-chip-dot" aria-hidden="true" />
        {{ t.chip }}
      </span>

      <h1 class="fe-hero-title">
        <span class="sr-only">{{ t.srName }} {{ t.titlePre }} {{ t.titleWords[0] }} {{ t.titlePost }}</span>
        <span aria-hidden="true">
          <span v-if="t.titlePre" class="fe-title-line">{{ t.titlePre }}</span>
          <span class="fe-rotator">
            <span
              v-for="(word, i) in t.titleWords"
              :key="word"
              class="fe-rotator-word fe-gradient-text"
              :style="{ '--i': i, '--n': t.titleWords.length }"
            >{{ word }}</span>
          </span>
          <span class="fe-title-line">{{ t.titlePost }}</span>
        </span>
      </h1>

      <p class="fe-hero-sub">{{ t.subtitle }}</p>

      <div class="fe-hero-ctas">
        <a v-magnetic :href="CV_PATH" download="CV-Marcelo-Ito.pdf" class="fe-btn fe-btn--primary">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" class="arrow-down">
            <path d="M8 1.5v9M4 7l4 4 4-4M2.5 14h11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          {{ t.cta }}
        </a>
        <a v-magnetic href="#projetos" class="fe-btn fe-btn--ghost">
          {{ t.ctaSecondary }}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" class="arrow">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </a>
      </div>
    </div>

    <a href="#sobre" class="fe-scroll-cue" :aria-label="t.scroll">
      <span class="fe-mouse"><span class="fe-wheel" /></span>
    </a>
  </section>
</template>

<style scoped>
.fe-hero {
  --px: 0;
  --py: 0;
  position: relative;
  z-index: 1;
  min-height: 100svh;
  padding: clamp(5.5rem, 11vh, 7.5rem) 1.5rem 4.75rem;
  display: grid;
  place-items: center;
  text-align: center;
  overflow: hidden;
  isolation: isolate;
}

/* Background ─────────────────────────────────────────────────────────── */
.fe-hero-bg {
  position: absolute;
  inset: -6%;
  z-index: -2;
  contain: strict;
  transform: translate3d(calc(var(--px) * 22px), calc(var(--py) * 16px), 0);
  transition: transform 0.9s var(--ease-out);
  pointer-events: none;
}
.fe-aurora {
  position: absolute;
  width: 62vmax;
  height: 62vmax;
  border-radius: 50%;
  opacity: 0.55;
  will-change: transform;
}
.fe-aurora--a {
  top: -28vmax;
  left: -16vmax;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--fe-a) 45%, transparent), transparent);
  animation: fe-drift-a 22s ease-in-out infinite alternate;
}
.fe-aurora--b {
  bottom: -34vmax;
  right: -20vmax;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--fe-b) 40%, transparent), transparent);
  animation: fe-drift-b 26s ease-in-out infinite alternate;
}
.fe-aurora--c {
  top: 20%;
  right: 8%;
  width: 34vmax;
  height: 34vmax;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--fe-c) 30%, transparent), transparent);
  animation: fe-drift-c 19s ease-in-out infinite alternate;
}
.fe-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--color-text) 16%, transparent) 1px, transparent 0);
  background-size: 30px 30px;
  -webkit-mask-image: radial-gradient(ellipse 60% 55% at 50% 45%, #000 20%, transparent 75%);
  mask-image: radial-gradient(ellipse 60% 55% at 50% 45%, #000 20%, transparent 75%);
}

.fe-hero-bgname {
  position: absolute;
  inset: 0;
  z-index: -1;
  display: grid;
  place-items: center;
  margin: 0;
  font-family: var(--font-title);
  font-weight: 700;
  font-size: clamp(4.5rem, 17vw, 15rem);
  line-height: 1;
  letter-spacing: -0.04em;
  white-space: nowrap;
  color: transparent;
  -webkit-text-stroke: 1.5px color-mix(in srgb, var(--color-text) 13%, transparent);
  transform: translate3d(calc(var(--px) * -26px), calc(var(--py) * -12px), 0);
  transition: transform 0.9s var(--ease-out);
  pointer-events: none;
  user-select: none;
}

/* Content ─────────────────────────────────────────────────────────────── */
.fe-hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1000px;
}

.fe-avatar-wrap {
  position: relative;
  width: 148px;
  height: 148px;
  margin-bottom: 1.6rem;
}
.fe-avatar {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  animation: fe-pop 0.9s var(--ease-spring) 0.1s both;
}
.fe-avatar::before {
  /* spinning gradient ring — only its transform animates */
  content: '';
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, var(--fe-a), var(--fe-b), var(--fe-c), var(--fe-a));
  animation: fe-spin 9s linear infinite;
}
.fe-avatar::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  background: var(--color-bg);
}
.fe-avatar img {
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 20px 60px -20px color-mix(in srgb, var(--fe-a) 70%, transparent);
}

.fe-orbit {
  list-style: none;
  position: absolute;
  inset: 0;
  margin: 0;
  padding: 0;
  pointer-events: none;
}
.fe-orbit li {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(calc(-50% + var(--x)), calc(-50% + var(--y)), 0);
}
.fe-orbit-pop {
  display: block;
  animation: fe-badge-in 0.7s var(--ease-spring) calc(0.45s + var(--i) * 90ms) both;
}
.fe-orbit-chip {
  display: block;
  padding: 0.38rem 0.8rem;
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 600;
  white-space: nowrap;
  color: var(--color-text);
  background: var(--fe-glass);
  border: 1px solid var(--fe-border);
  box-shadow: var(--fe-shadow);
  animation: fe-float var(--float) ease-in-out calc(1.2s + var(--i) * 0.4s) infinite alternate both;
}

.fe-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 1.1rem 0.5rem 0.9rem;
  margin-bottom: 1.3rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-accent1);
  background: color-mix(in srgb, var(--color-accent1) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-accent1) 30%, transparent);
  animation: fe-rise 0.8s var(--ease-out) 0.25s both;
}
.fe-chip-dot {
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-success);
}
.fe-chip-dot::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--color-success);
  animation: fe-ping 2s ease-out infinite;
}

.fe-hero-title {
  font-family: var(--font-title);
  font-weight: 600;
  font-size: clamp(2.2rem, 5.3vw, 4.1rem);
  line-height: 1.06;
  letter-spacing: -0.025em;
  font-variation-settings: 'opsz' 120;
  margin-bottom: 1.25rem;
}
.fe-title-line { display: block; }
.fe-rotator {
  display: grid;
  justify-items: center;
}
.fe-rotator-word {
  grid-area: 1 / 1;
  font-style: italic;
  padding: 0 0.12em 0.08em;
  animation: fe-word calc(var(--n) * 2.6s) var(--ease-out) calc(var(--i) * 2.6s) infinite backwards;
}

.fe-hero-sub {
  max-width: 640px;
  font-size: clamp(1rem, 1.5vw, 1.14rem);
  line-height: 1.7;
  color: var(--color-text-muted);
  margin-bottom: 2rem;
}

.fe-hero-ctas {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.9rem;
  animation: fe-rise 0.8s var(--ease-out) 0.45s both;
}

.fe-scroll-cue {
  position: absolute;
  bottom: 1.8rem;
  left: 50%;
  translate: -50% 0;
  padding: 0.5rem;
  animation: fe-rise 0.8s var(--ease-out) 1s both;
}
.fe-mouse {
  display: block;
  width: 24px;
  height: 38px;
  border-radius: 14px;
  border: 1.5px solid color-mix(in srgb, var(--color-text) 40%, transparent);
  position: relative;
}
.fe-wheel {
  position: absolute;
  top: 7px;
  left: 50%;
  width: 3px;
  height: 7px;
  margin-left: -1.5px;
  border-radius: 2px;
  background: var(--color-accent1);
  animation: fe-wheel 1.8s var(--ease-out) infinite;
}

/* Keyframes (transform/opacity only) ────────────────────────────────── */
@keyframes fe-spin { to { transform: rotate(1turn); } }
@keyframes fe-pop {
  from { opacity: 0; transform: scale(0.82); }
  to   { opacity: 1; transform: none; }
}
@keyframes fe-rise {
  from { opacity: 0; transform: translate3d(0, 18px, 0); }
  to   { opacity: 1; transform: none; }
}
@keyframes fe-badge-in {
  from { opacity: 0; transform: scale(0.6); }
  to   { opacity: 1; transform: none; }
}
@keyframes fe-float {
  from { transform: translate3d(0, -5px, 0); }
  to   { transform: translate3d(0, 6px, 0); }
}
@keyframes fe-ping {
  0%   { transform: scale(1); opacity: 0.7; }
  80%, 100% { transform: scale(2.8); opacity: 0; }
}
@keyframes fe-wheel {
  0%   { transform: translate3d(0, 0, 0); opacity: 1; }
  70%  { transform: translate3d(0, 11px, 0); opacity: 0; }
  100% { transform: translate3d(0, 0, 0); opacity: 0; }
}
/* Each word owns a 1/n slot. It exits during the first 4% of the next slot, which is
   exactly when the next word enters — so the line is never empty. Tuned for n = 4. */
@keyframes fe-word {
  0%        { opacity: 0; transform: translate3d(0, 45%, 0); }
  4%, 25%   { opacity: 1; transform: none; }
  29%, 100% { opacity: 0; transform: translate3d(0, -45%, 0); }
}
@keyframes fe-drift-a { to { transform: translate3d(9vmax, 7vmax, 0) scale(1.12); } }
@keyframes fe-drift-b { to { transform: translate3d(-8vmax, -6vmax, 0) scale(1.08); } }
@keyframes fe-drift-c { to { transform: translate3d(-10vmax, 6vmax, 0) scale(0.9); } }

@media (max-width: 860px) {
  .fe-orbit li:nth-child(n + 5) { display: none; }
}
/* short laptop screens (720–800px tall): keep the CTAs above the fold */
@media (min-width: 601px) and (max-height: 800px) {
  .fe-avatar-wrap { width: 118px; height: 118px; margin-bottom: 1.2rem; }
  .fe-orbit { display: none; }
  .fe-chip { margin-bottom: 1rem; }
  .fe-hero-title { font-size: clamp(2.1rem, 4.6vw, 3.5rem); margin-bottom: 1rem; }
  .fe-hero-sub { margin-bottom: 1.5rem; }
  .fe-scroll-cue { display: none; }
}
@media (max-width: 600px) {
  .fe-avatar-wrap { width: 132px; height: 132px; margin-bottom: 1.6rem; }
  .fe-orbit { display: none; }
  .fe-hero-bgname { font-size: 22vw; }
}

@media (prefers-reduced-motion: reduce) {
  /* show the first word, statically */
  .fe-rotator-word { animation: none; opacity: 0; }
  .fe-rotator-word:first-child { opacity: 1; }
}
</style>
