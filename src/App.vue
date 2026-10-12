<script setup>
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { useCursor } from '@/composables/useCursor'
import { useLocaleStore } from '@/composables/useLocale'
import { useThemeStore } from '@/composables/useTheme'
import AppNav from '@/components/layout/AppNav.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

// Both pull in GSAP / a full-page canvas loop — only the home page uses them.
const SplashScreen = defineAsyncComponent(() => import('@/components/ui/SplashScreen.vue'))
const BubbleCanvas = defineAsyncComponent(() => import('@/components/ui/BubbleCanvas.vue'))

// Initialize both stores early — they apply their effects immediately
const locale = useLocaleStore()
document.documentElement.lang = locale.locale

// Theme store applies .dark class to <html> via its watcher
useThemeStore()

const route = useRoute()
const isHome = computed(() => route.name === 'home')

const ROUTE_CLASSES = ['route-home', 'route-frontend', 'route-backend']
// Each route carries its own color palette (html.route-* below), so the whole chrome
// (nav/footer) re-skins with the page. index.html sets the first class before any CSS
// loads; this keeps it in sync on client-side navigation.
watch(() => route.name, (name) => {
  const root = document.documentElement
  root.classList.remove(...ROUTE_CLASSES)
  root.classList.add(`route-${String(name ?? 'home')}`)
}, { immediate: true })

// The splash plays only when the visit starts on the home page; /frontend and /backend
// open straight into their content (it would otherwise delay LCP by ~3s).
const splashDone = ref(!isHome.value)
const { setupCursor } = useCursor()

function startCursor() {
  if (!window.matchMedia('(hover: none)').matches) setupCursor()
}

function onSplashDone() {
  splashDone.value = true
  startCursor()
}

onMounted(() => {
  if (splashDone.value) startCursor()
})
</script>

<template>
  <SplashScreen v-if="!splashDone" @done="onSplashDone" />

  <Transition name="app-reveal">
    <div v-if="splashDone" class="app-wrapper">
      <div id="cursor" class="cursor" aria-hidden="true" />
      <div id="cursor-ring" class="cursor-ring" aria-hidden="true" />

      <BubbleCanvas v-if="isHome" />
      <AppNav />

      <main>
        <RouterView />
      </main>

      <AppFooter />
    </div>
  </Transition>
</template>

<style>
/* Web fonts are linked from index.html (non-render-blocking), not @imported here. */

/* ── Light theme (default) ── */
:root {
  --color-bg: #fefae0;
  --color-surface: #faedcd;
  --color-accent1: #d4a373;
  --color-accent2: #ccd5ae;
  --color-accent3: #e9edc9;
  --color-text: #3d2b1f;
  --color-text-muted: #705f4f;
  --color-error: #b85c38;
  --color-success: #4f7038;
  --color-info: #8aa399;
  /* small-text links/labels: accent1 is only 2.2:1 on the cream background */
  --color-link: #a04f2c;
  /* foregrounds for the inverted blocks painted with --color-text (hero snippet, featured
     card, contact, footer, splash) — every one ≥ 4.5:1 on that background */
  --color-inv-accent: #d4a373;
  --color-inv-muted: #b5a593;
  --color-inv-value: #ccd5ae;
  --color-inv-success: #9cbb82;

  /* Theme transition speed — applied on every color-using property */
  --theme-transition: 0.35s ease;
}

/* ── Dark theme — preto azulado + dourado ── */
html.dark {
  --color-bg: #0d0f14;
  --color-surface: #141720;
  --color-accent1: #d4a373;
  /* golden anchor — brand stays consistent */
  --color-accent2: #4a6fa5;
  /* medium blue */
  --color-accent3: #1e2a3a;
  /* deep blue */
  --color-text: #e8e0d0;
  /* warm off-white */
  --color-text-muted: #7a8fa6;
  /* blue-grey */
  --color-error: #c0714a;
  /* slightly lighter terracotta for dark bg */
  --color-success: #6aab7e;
  --color-info: #5a8fa0;
  --color-link: #d4a373;
  /* inverted blocks are light here, so their foregrounds go dark */
  --color-inv-accent: #8f4a26;
  --color-inv-muted: #516175;
  --color-inv-value: #3a5a8a;
  --color-inv-success: #2f6b45;
}

/* ── /frontend — Light: tema Vue.js ── */
html.route-frontend {
  --color-bg: #ffffff;
  --color-surface: #f0f9f5;
  /* #42b883 is only 2.5:1 on white, so text accents use a deeper Vue green (5.3:1);
     the brand green stays in fills and gradients (--fe-a / --fe-btn-a). */
  --color-accent1: #1f7a52;
  --color-accent2: #35495e;
  --color-accent3: #e3f5ec;
  --color-text: #35495e;
  --color-text-muted: #57687a;
  --color-error: #e0554a;
  --color-success: #42b883;
  --color-info: #4a6f8c;
  --font-title: 'Fraunces', Georgia, 'Times New Roman', serif;
  --font-body: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  /* gradient stops + glass, used by the /frontend page */
  --fe-a: #42b883;
  --fe-b: #2f9e8f;
  --fe-c: #35495e;
  --fe-btn-a: #42b883;
  --fe-btn-b: #2f9e8f;
  --fe-on-accent: #052016;
  --fe-glass: rgba(255, 255, 255, 0.72);
  --fe-border: rgba(53, 73, 94, 0.12);
  --fe-shadow: 0 24px 60px -28px rgba(53, 73, 94, 0.35);
}

/* ── /frontend — Dark: tema VSCode ── */
html.dark.route-frontend {
  --color-bg: #1e1e1e;
  --color-surface: #252526;
  /* #007acc is 3.7:1 on #1e1e1e — fine for fills and large type, not for small text,
     so text accents use VS Code's lighter link blue (5.4:1). */
  --color-accent1: #3794ff;
  --color-accent2: #3e3e42;
  --color-accent3: #2d2d30;
  --color-text: #d4d4d4;
  --color-text-muted: #9d9d9d;
  --color-error: #f14c4c;
  --color-success: #89d185;
  --color-info: #3794ff;
  /* VS Code: brand blue → type teal → control-keyword purple */
  --fe-a: #007acc;
  --fe-b: #4ec9b0;
  --fe-c: #c586c0;
  --fe-btn-a: #3794ff;
  --fe-btn-b: #4ec9b0;
  --fe-on-accent: #06121f;
  --fe-glass: rgba(37, 37, 38, 0.72);
  --fe-border: rgba(255, 255, 255, 0.08);
  --fe-shadow: 0 30px 70px -30px rgba(0, 0, 0, 0.8);
}

/* ── /backend — Light: tema React.js ──
   #0081a3 (React docs teal) is exactly 4.5:1 on white: fine for fills and white button text,
   so small text accents use a deeper teal (5.7:1). */
html.route-backend {
  --color-bg: #ffffff;
  --color-surface: #eef8fb;
  --color-accent1: #00708e;
  --color-accent2: #20232a;
  --color-accent3: #d9f2f8;
  --color-text: #10232a;
  --color-text-muted: #536a71;
  --color-error: #c62828;
  --color-success: #2b7a3d;
  --color-info: #00708e;
  --font-title: 'JetBrains Mono', ui-monospace, 'Cascadia Code', Consolas, monospace;
  --font-body: 'IBM Plex Mono', ui-monospace, 'Cascadia Code', Consolas, monospace;
  /* brand + surfaces used by the /backend page */
  --be-a: #0081a3;
  --be-b: #61dafb;
  --be-c: #20232a;
  --be-btn: #007c9d; /* #0081a3 gives white text 4.49:1 — one shade darker passes */
  --be-on-accent: #ffffff;
  --be-glass: rgba(255, 255, 255, 0.82);
  --be-border: rgba(16, 35, 42, 0.12);
  --be-shadow: 0 24px 60px -30px rgba(16, 35, 42, 0.35);
  /* code panels stay dark in both themes, like React's docs */
  --be-code-bg: #20232a;
  --be-code-bar: #2a2e37;
  --be-code-text: #e6edf3;
  --be-code-key: #61dafb;
  --be-code-str: #ce9178;
  --be-code-punct: #97a0aa;
  --be-code-comment: #7ca668;
}

/* ── /backend — Dark: tema .NET ──
   #512bd4 is 2.1:1 on #1e1e1e — a fill colour (white on it is 7.9:1); text accents use a
   lighter .NET purple (6.5:1). */
html.dark.route-backend {
  --color-bg: #1e1e1e;
  --color-surface: #252131;
  --color-accent1: #a594f9;
  --color-accent2: #9780ff;
  --color-accent3: #2d2440;
  --color-text: #ece9f5;
  --color-text-muted: #a39cbc;
  --color-error: #f0707a;
  --color-success: #4ec9b0;
  --color-info: #9780ff;
  --be-a: #512bd4;
  --be-b: #9780ff;
  --be-c: #4ec9b0;
  --be-btn: #512bd4;
  --be-on-accent: #ffffff;
  --be-glass: rgba(37, 33, 49, 0.78);
  --be-border: rgba(255, 255, 255, 0.09);
  --be-shadow: 0 30px 70px -30px rgba(0, 0, 0, 0.85);
  --be-code-bg: #17141f;
  --be-code-bar: #211d2c;
  --be-code-key: #b4a5ff;
}

/* Smooth color transitions across the whole page */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  transition:
    background-color var(--theme-transition),
    border-color var(--theme-transition),
    color var(--theme-transition);
}

/* Re-exclude elements where transition would cause jitter */
.cursor,
.cursor-ring,
.hero-cta,
.hero-cta svg,
.cv-btn,
.project-card::before,
.skill-badge,
.contato-link,
.nav-hamburger span {
  transition: none;
}

html {
  scroll-behavior: smooth;
}

.sr-only {
  position: absolute !important;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

body {
  font-family: 'Crimson Pro', Georgia, serif;
  background: var(--color-bg);
  color: var(--color-text);
  overflow-x: hidden;
  cursor: none;
}

@media (hover: none) {
  body {
    cursor: auto;
  }
}

/* Cursor — position AND hover-scale are both driven by `transform` in JS
   (useCursor.ts), so this must never carry a transition on transform: that
   would re-ease every mousemove-driven update, adding lag back in. Anchored
   at top:0/left:0 so translate3d() in JS is relative to a fixed origin. */
.cursor,
.cursor-ring {
  visibility: hidden;
}

.cursor {
  top: 0;
  left: 0;
  width: 12px;
  height: 12px;
  background: var(--color-accent1);
  border-radius: 50%;
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  transition: none;
  mix-blend-mode: multiply;
}

.cursor-ring {
  top: 0;
  left: 0;
  width: 36px;
  height: 36px;
  border: 1.5px solid var(--color-accent1);
  border-radius: 50%;
  position: fixed;
  pointer-events: none;
  z-index: 9998;
  transition: opacity 0.08s ease;
  opacity: 0.6;
}

/* In dark mode, multiply blend-mode makes cursor invisible — switch to normal */
html.dark .cursor {
  mix-blend-mode: normal;
  opacity: 0.85;
}

@media (hover: none) {

  .cursor,
  .cursor-ring {
    display: none;
  }
}

/* Grain */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 200;
  opacity: 0.5;
}

/* App reveal */
.app-reveal-enter-active {
  transition: opacity 0.6s ease;
}

.app-reveal-enter-from {
  opacity: 0;
}
</style>
