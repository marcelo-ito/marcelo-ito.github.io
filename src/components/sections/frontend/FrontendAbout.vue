<script setup>
import { computed } from 'vue'
import { useLocaleStore } from '@/composables/useLocale'
import { splitWords, vCount, vReveal, vSpotlight } from '@/composables/motion'

const locale = useLocaleStore()
const t = computed(() => locale.t.frontendPage.about)
const introWords = computed(() => splitWords(t.value.intro))

// One line-icon per card, in the same order as about.cards in the locale files.
const ICONS = [
  // design: sparkle pen
  'M4 20l4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20zM14 7l3 3M19 14l.7 1.8 1.8.7-1.8.7L19 19l-.7-1.8-1.8-.7 1.8-.7z',
  // speed: gauge
  'M12 14l4-5M4.9 18a9 9 0 1 1 14.2 0M12 5v1.5M6.3 8.3l1 1M17.7 8.3l-1 1',
  // screens: phone + monitor
  'M3 5h13v9H3zM7 18h5M9.5 14v4M17 9h4v11h-4zM18.6 17.5h.8',
  // accessibility: person in circle
  'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7.2v.1M8 10l4 1 4-1M12 11v3l-2 3.5M12 14l2 3.5',
]
</script>

<template>
  <section id="sobre" class="fe-section fe-about">
    <div class="fe-container fe-about-grid">
      <div class="fe-about-text">
        <p v-reveal class="fe-eyebrow">{{ t.eyebrow }}</p>

        <h2 v-reveal:split class="fe-heading fe-about-intro">
          <span class="sr-only">{{ t.intro }}</span>
          <span aria-hidden="true">
            <template v-for="(word, i) in introWords" :key="i">
              <span class="split-word"><span :style="{ '--i': i }">{{ word }}</span></span>{{ ' ' }}
            </template>
          </span>
        </h2>

        <p v-reveal="{ delay: 200 }" class="fe-about-full">{{ t.full }}</p>

        <dl class="fe-stats">
          <div v-for="(stat, i) in t.stats" :key="stat.label" v-reveal="{ delay: 120 * i }" class="fe-stat">
            <dt class="fe-stat-value">
              <span v-if="stat.prefix">{{ stat.prefix }}</span><span v-count="stat.value" /><span v-if="stat.suffix" class="fe-stat-suffix">{{ stat.suffix }}</span>
            </dt>
            <dd class="fe-stat-label">{{ stat.label }}</dd>
          </div>
        </dl>
      </div>

      <div class="fe-about-cards">
        <p v-reveal class="fe-cards-title">{{ t.cardsTitle }}</p>
        <ul class="fe-cards">
          <li
            v-for="(card, i) in t.cards"
            :key="card.title"
            v-reveal="{ delay: 90 * i }"
            v-spotlight
            class="fe-card"
          >
            <span class="fe-card-icon" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path :d="ICONS[i]" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <h3 class="fe-card-title">{{ card.title }}</h3>
            <p class="fe-card-text">{{ card.text }}</p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fe-about {
  background:
    radial-gradient(60% 50% at 0% 0%, color-mix(in srgb, var(--fe-a) 9%, transparent), transparent 70%),
    var(--color-surface);
  border-block: 1px solid var(--fe-border);
}

.fe-about-grid {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: clamp(2.5rem, 6vw, 5.5rem);
  align-items: start;
}

.fe-about-intro { margin-bottom: 1.6rem; }

.fe-about-full {
  font-size: 1.04rem;
  line-height: 1.85;
  color: var(--color-text-muted);
  max-width: 58ch;
  margin-bottom: 2.75rem;
}

.fe-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
}
.fe-stat {
  padding-top: 1rem;
  border-top: 1px solid var(--fe-border);
}
.fe-stat-value {
  font-family: var(--font-title);
  font-size: clamp(2rem, 3.4vw, 2.8rem);
  font-weight: 600;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  color: var(--color-text);
}
.fe-stat-suffix {
  font-size: 0.45em;
  font-weight: 500;
  color: var(--color-text-muted);
  margin-left: 0.1em;
}
.fe-stat-label {
  margin-top: 0.55rem;
  font-size: 0.82rem;
  line-height: 1.45;
  color: var(--color-text-muted);
}

.fe-cards-title {
  font-family: var(--font-title);
  font-size: 1.35rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
}
.fe-cards {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}
.fe-card {
  --spot-x: 50%;
  --spot-y: 0%;
  position: relative;
  padding: 1.6rem 1.4rem 1.5rem;
  border-radius: 20px;
  background: var(--fe-glass);
  border: 1px solid var(--fe-border);
  overflow: hidden;
  isolation: isolate;
}
.fe-card::before {
  /* pointer-following glow, faded in on hover */
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: radial-gradient(260px circle at var(--spot-x) var(--spot-y), color-mix(in srgb, var(--fe-a) 22%, transparent), transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
}
.fe-card:hover::before { opacity: 1; }
.fe-card::after {
  /* gradient hairline on top */
  content: '';
  position: absolute;
  inset: 0 18% auto;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--fe-a), var(--fe-b), transparent);
  opacity: 0.7;
}
.fe-card-icon {
  display: inline-grid;
  place-items: center;
  width: 46px;
  height: 46px;
  margin-bottom: 1.1rem;
  border-radius: 14px;
  color: var(--color-accent1);
  background: color-mix(in srgb, var(--color-accent1) 12%, transparent);
  transition: transform 0.5s var(--ease-spring);
}
.fe-card:hover .fe-card-icon { transform: rotate(-8deg) scale(1.08); }
.fe-card-title {
  font-family: var(--font-body);
  font-size: 1.02rem;
  font-weight: 650;
  margin-bottom: 0.45rem;
  color: var(--color-text);
}
.fe-card-text {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--color-text-muted);
}

@media (max-width: 960px) {
  .fe-about-grid { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .fe-cards { grid-template-columns: 1fr; }
  .fe-stats { grid-template-columns: 1fr; gap: 1.1rem; }
}
</style>
