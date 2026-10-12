<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  /** [{ id, name, category, description, highlights: [], stack: [], badge?, badgeHint? }] */
  items: { type: Array, required: true },
  /** { region, prev, next, of, highlights, stack } */
  labels: { type: Object, required: true },
})

const track = ref(null)
const slideEls = ref([])
const active = ref(0)
const count = computed(() => props.items.length)
const pad = (n) => String(n).padStart(2, '0')

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function nearestIndex() {
  const el = track.value
  if (!el) return 0
  const center = el.scrollLeft + el.clientWidth / 2
  let best = 0
  let bestDist = Infinity
  slideEls.value.forEach((slide, i) => {
    const dist = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center)
    if (dist < bestDist) {
      bestDist = dist
      best = i
    }
  })
  return best
}

function goTo(index, smooth = true) {
  const el = track.value
  const i = Math.max(0, Math.min(count.value - 1, index))
  const slide = slideEls.value[i]
  if (!el || !slide) return
  active.value = i
  el.scrollTo({
    left: slide.offsetLeft - (el.clientWidth - slide.offsetWidth) / 2,
    behavior: smooth && !reducedMotion() ? 'smooth' : 'auto',
  })
}

let scrollFrame = 0
function onScroll() {
  if (scrollFrame || drag) return
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0
    active.value = nearestIndex()
  })
}

function onKeydown(e) {
  const keys = { ArrowRight: active.value + 1, ArrowLeft: active.value - 1, Home: 0, End: count.value - 1 }
  if (!(e.key in keys)) return
  e.preventDefault()
  goTo(keys[e.key])
}

// Mouse drag (touch already scrolls natively). Pointer capture only starts once the
// pointer really moves, so plain clicks on links inside a slide keep working.
let drag = null
let suppressClick = false
function onPointerDown(e) {
  if (e.pointerType !== 'mouse' || e.button !== 0) return
  drag = { x: e.clientX, dx: 0, left: track.value.scrollLeft, moved: false, id: e.pointerId, from: active.value }
}
function onPointerMove(e) {
  if (!drag) return
  const dx = e.clientX - drag.x
  drag.dx = dx
  if (!drag.moved && Math.abs(dx) > 6) {
    drag.moved = true
    track.value.setPointerCapture(drag.id)
    track.value.classList.add('is-dragging')
  }
  if (drag.moved) track.value.scrollLeft = drag.left - dx
}
function onPointerUp() {
  if (!drag) return
  const { moved, dx, from } = drag
  drag = null
  if (!moved) return
  track.value.classList.remove('is-dragging')
  suppressClick = true
  // a deliberate flick (> 80px) always moves one slide; anything longer snaps to nearest
  const nearest = nearestIndex()
  if (nearest === from && Math.abs(dx) > 80) goTo(from + (dx < 0 ? 1 : -1))
  else goTo(nearest)
}
function onClickCapture(e) {
  if (!suppressClick) return
  suppressClick = false
  e.preventDefault()
  e.stopPropagation()
}

function onSlideClick(i) {
  if (i !== active.value) goTo(i)
}

// Re-centre the active slide when the track's width really changes. The first callback only
// records the width: reading offsets at mount would force layout of a section the browser
// is still skipping (content-visibility: auto).
let resizeObserver = null
let lastWidth = 0
onMounted(() => {
  resizeObserver = new ResizeObserver(([entry]) => {
    const width = entry.contentRect.width
    if (!width || width === lastWidth) return
    if (lastWidth) goTo(active.value, false)
    lastWidth = width
  })
  resizeObserver.observe(track.value)
})
onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  cancelAnimationFrame(scrollFrame)
})
</script>

<template>
  <div class="pc" role="region" aria-roledescription="carrossel" :aria-label="labels.region">
    <div
      ref="track"
      class="pc-track"
      tabindex="0"
      @scroll.passive="onScroll"
      @keydown="onKeydown"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @click.capture="onClickCapture"
    >
      <div
        v-for="(item, i) in items"
        :key="item.id"
        ref="slideEls"
        class="pc-slide"
        :class="{ 'is-active': i === active }"
        role="group"
        aria-roledescription="slide"
        :aria-label="`${i + 1} ${labels.of} ${count}: ${item.name}`"
        @click="onSlideClick(i)"
      >
        <article class="pc-card">
          <div class="pc-media">
            <slot name="media" :item="item" :index="i" :active="i === active" />
          </div>

          <div class="pc-body">
            <p class="pc-index" aria-hidden="true">{{ pad(i + 1) }}<span> / {{ pad(count) }}</span></p>
            <p v-if="item.badge" class="pc-badge" :title="item.badgeHint">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 1l1.3 3.2L10.5 5 7.6 7l.8 3.5L6 8.7 3.6 10.5 4.4 7 1.5 5l3.2-.8z" fill="currentColor" />
              </svg>
              {{ item.badge }}
              <span v-if="item.badgeHint" class="sr-only">— {{ item.badgeHint }}</span>
            </p>
            <h3 class="pc-name">{{ item.name }}</h3>
            <p class="pc-category">{{ item.category }}</p>
            <p class="pc-desc">{{ item.description }}</p>

            <p class="sr-only">{{ labels.highlights }}</p>
            <ul class="pc-highlights">
              <li v-for="(h, hi) in item.highlights" :key="h" :style="{ '--hi': hi }">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                {{ h }}
              </li>
            </ul>

            <ul class="pc-stack" :aria-label="labels.stack">
              <li v-for="s in item.stack" :key="s">{{ s }}</li>
            </ul>
          </div>
        </article>
      </div>
    </div>

    <div class="pc-nav">
      <button type="button" class="pc-arrow" :disabled="active === 0" :aria-label="labels.prev" @click="goTo(active - 1)">
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <div class="pc-dots">
        <button
          v-for="(item, i) in items"
          :key="item.id"
          type="button"
          class="pc-dot"
          :class="{ 'is-active': i === active }"
          :aria-label="item.name"
          :aria-current="i === active ? 'true' : undefined"
          @click="goTo(i)"
        />
      </div>

      <span class="pc-counter" aria-live="polite">{{ pad(active + 1) }} <span>/ {{ pad(count) }}</span></span>

      <button type="button" class="pc-arrow" :disabled="active === count - 1" :aria-label="labels.next" @click="goTo(active + 1)">
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Pages theme the carousel by setting --carousel-* on an ancestor. */
.pc {
  --pc-slide-w: var(--carousel-slide-w, min(1080px, 86vw));
  --pc-accent: var(--carousel-accent, var(--color-accent1));
  --pc-radius: var(--carousel-radius, 28px);
  --pc-card-bg: var(--carousel-card-bg, var(--color-surface));
  --pc-border: var(--carousel-border, rgba(127, 127, 127, 0.15));
  --pc-shadow: var(--carousel-shadow, 0 24px 60px -30px rgba(0, 0, 0, 0.45));
  --pc-badge: var(--carousel-badge, var(--pc-accent));
  --pc-title-font: var(--font-title);
  position: relative;
}

.pc-track {
  position: relative;
  display: flex;
  gap: clamp(1rem, 2.5vw, 2rem);
  margin: 0;
  padding: 1.5rem calc((100% - var(--pc-slide-w)) / 2) 2rem;
  list-style: none;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  cursor: grab;
}
.pc-track::-webkit-scrollbar { display: none; }
.pc-track:focus-visible { outline: 2px solid var(--pc-accent); outline-offset: -2px; border-radius: var(--pc-radius); }
.pc-track.is-dragging {
  cursor: grabbing;
  scroll-snap-type: none;
  user-select: none;
}

.pc-slide {
  flex: 0 0 var(--pc-slide-w);
  scroll-snap-align: center;
}
.pc-slide:not(.is-active) { cursor: pointer; }

.pc-card {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: clamp(1.5rem, 3.5vw, 3rem);
  align-items: center;
  height: 100%;
  padding: clamp(1rem, 2.2vw, 1.75rem);
  border-radius: var(--pc-radius);
  background: var(--pc-card-bg);
  border: 1px solid var(--pc-border);
  box-shadow: var(--pc-shadow);
  transform: scale(0.93);
  opacity: 0.4;
  transition:
    transform 0.7s var(--ease-out),
    opacity 0.7s var(--ease-out);
}
.pc-slide.is-active .pc-card {
  transform: none;
  opacity: 1;
}

.pc-media { min-width: 0; }

.pc-body {
  min-width: 0;
  padding: 0.5rem 0.75rem 0.5rem 0;
}
.pc-index {
  font-family: var(--pc-title-font);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--pc-accent);
  margin-bottom: 0.9rem;
}
.pc-index span { color: var(--color-text-muted); font-weight: 400; }

.pc-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.28rem 0.7rem;
  margin-bottom: 0.9rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--color-text);
  background: color-mix(in srgb, var(--pc-badge) 18%, transparent);
  border: 1px solid color-mix(in srgb, var(--pc-badge) 35%, transparent);
  cursor: help;
}

.pc-name {
  font-family: var(--pc-title-font);
  font-size: clamp(1.6rem, 2.8vw, 2.2rem);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.015em;
  color: var(--color-text);
}
.pc-category {
  margin-top: 0.35rem;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--pc-accent);
}
.pc-desc {
  margin-top: 1rem;
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--color-text-muted);
}

.pc-highlights {
  list-style: none;
  margin: 1.1rem 0 0;
  padding: 0;
  display: grid;
  gap: 0.55rem;
}
.pc-highlights li {
  display: flex;
  gap: 0.6rem;
  align-items: flex-start;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--color-text);
  opacity: 0;
  transform: translate3d(-10px, 0, 0);
  transition:
    opacity 0.5s var(--ease-out),
    transform 0.5s var(--ease-out);
}
.pc-slide.is-active .pc-highlights li {
  opacity: 1;
  transform: none;
  transition-delay: calc(0.25s + var(--hi) * 90ms);
}
.pc-highlights svg {
  flex-shrink: 0;
  margin-top: 0.15rem;
  color: var(--pc-accent);
}

.pc-stack {
  list-style: none;
  margin: 1.3rem 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}
.pc-stack li {
  padding: 0.3rem 0.7rem;
  border-radius: 8px;
  font-size: 0.76rem;
  font-weight: 500;
  color: var(--color-text-muted);
  background: color-mix(in srgb, var(--color-text) 6%, transparent);
  border: 1px solid var(--pc-border);
}

/* Navigation ─────────────────────────────────────────────────────────── */
.pc-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.1rem;
  margin-top: 0.25rem;
  padding-inline: 1.5rem;
}
.pc-arrow {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid var(--pc-border);
  background: var(--pc-card-bg);
  color: var(--color-text);
  cursor: pointer;
  transition:
    transform 0.3s var(--ease-out),
    border-color 0.3s ease,
    color 0.3s ease,
    opacity 0.3s ease;
}
.pc-arrow:hover:not(:disabled) { border-color: var(--pc-accent); color: var(--pc-accent); transform: scale(1.06); }
.pc-arrow:disabled { opacity: 0.35; cursor: not-allowed; }
.pc-arrow:focus-visible,
.pc-dot:focus-visible { outline: 2px solid var(--pc-accent); outline-offset: 3px; }

.pc-dots { display: flex; gap: 0.5rem; align-items: center; }
.pc-dot {
  width: 9px;
  height: 9px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-text) 22%, transparent);
  cursor: pointer;
  transition: transform 0.4s var(--ease-out), background-color 0.3s ease;
}
.pc-dot.is-active {
  background: var(--pc-accent);
  transform: scaleX(2.6);
}
.pc-dot.is-active + .pc-dot,
.pc-dot:has(+ .pc-dot.is-active) { margin-inline: 0.45rem; }

.pc-counter {
  min-width: 4.5ch;
  font-family: var(--pc-title-font);
  font-size: 0.95rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--color-text);
}
.pc-counter span { color: var(--color-text-muted); font-weight: 400; }

@media (max-width: 900px) {
  .pc { --pc-slide-w: 88vw; --pc-radius: min(var(--carousel-radius, 22px), 22px); }
  .pc-card { grid-template-columns: 1fr; align-items: start; }
  .pc-body { padding: 0.25rem 0.25rem 0.5rem; }
}
@media (max-width: 560px) {
  .pc-counter { display: none; }
  .pc-nav { gap: 0.75rem; }
}
</style>
