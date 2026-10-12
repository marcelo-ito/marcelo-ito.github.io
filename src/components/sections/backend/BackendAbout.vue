<script setup>
import { computed } from 'vue'
import { useLocaleStore } from '@/composables/useLocale'
import { splitWords, vCount, vReveal } from '@/composables/motion'

const locale = useLocaleStore()
const t = computed(() => locale.t.backendPage.about)
const introWords = computed(() => splitWords(t.value.intro))
</script>

<template>
  <section id="sobre" class="be-section be-about">
    <div class="be-container be-about-grid">
      <div class="be-about-text">
        <p v-reveal class="be-eyebrow">{{ t.eyebrow }}</p>

        <h2 v-reveal:split class="be-heading be-about-intro">
          <span class="sr-only">{{ t.intro }}</span>
          <span aria-hidden="true">
            <template v-for="(word, i) in introWords" :key="i">
              <span class="split-word"><span :style="{ '--i': i }">{{ word }}</span></span>{{ ' ' }}
            </template>
          </span>
        </h2>

        <p v-for="(para, i) in t.full" :key="i" v-reveal="{ delay: 120 * (i + 1) }" class="be-about-p">{{ para }}</p>
      </div>

      <div class="be-about-side">
        <figure v-reveal="{ delay: 100 }" class="be-window be-log">
          <figcaption class="be-window-bar">
            <span class="be-dots" aria-hidden="true"><i /><i /><i /></span>
            <span class="be-window-title">bash</span>
          </figcaption>
          <div class="be-log-body">
            <p class="be-log-cmd"><span class="be-prompt">$</span> {{ t.logCommand }}</p>
            <ol class="be-log-list">
              <li v-for="(entry, i) in t.log" :key="entry.hash" :style="{ '--i': i }">
                <span class="be-log-hash" aria-hidden="true">{{ entry.hash }}</span>
                <span class="be-log-msg">
                  <span class="be-log-tag" :class="`is-${entry.tag}`">{{ entry.tag }}:</span>
                  {{ entry.text }}
                  <span v-if="entry.when" class="be-log-when">({{ entry.when }})</span>
                </span>
              </li>
            </ol>
            <p class="be-log-end" aria-hidden="true"><span class="be-prompt">$</span><span class="be-caret" /></p>
          </div>
        </figure>

        <dl class="be-stats">
          <div v-for="(stat, i) in t.stats" :key="stat.label" v-reveal="{ delay: 150 + 110 * i }" class="be-stat">
            <dt class="be-stat-value">
              <span v-if="stat.prefix" class="be-stat-prefix">{{ stat.prefix }}</span><span v-count="stat.value" />
            </dt>
            <dd class="be-stat-label">{{ stat.label }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>

<style scoped>
.be-about {
  background: var(--color-surface);
  border-block: 1px solid var(--be-border);
}
.be-about-grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: clamp(2.5rem, 6vw, 5rem);
  align-items: start;
}

.be-about-intro { margin-bottom: 1.5rem; }
.be-about-p {
  max-width: 62ch;
  margin-bottom: 1.1rem;
  font-size: 0.93rem;
  line-height: 1.85;
  color: var(--color-text-muted);
}

/* git log window */
.be-log-body {
  padding: 1rem 1.2rem 1.1rem;
  font-size: 0.8rem;
  line-height: 1.7;
}
.be-log-cmd { margin-bottom: 0.6rem; }
.be-log-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.55rem;
}
.be-log-list li {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  gap: 0.8rem;
  opacity: 0;
  transform: translate3d(0, 6px, 0);
  transition:
    opacity 0.45s var(--ease-out),
    transform 0.45s var(--ease-out);
}
.be-log[data-revealed] .be-log-list li {
  opacity: 1;
  transform: none;
  transition-delay: calc(0.55s + var(--i) * 0.28s);
}
.be-log-hash { color: #e5c07b; }
.be-log-tag { font-weight: 600; }
.be-log-tag.is-feat { color: #7ee2a8; }
.be-log-tag.is-test { color: var(--be-code-key); }
.be-log-tag.is-init { color: var(--be-code-str); }
.be-log-when { color: var(--be-code-punct); }
.be-log-end { margin-top: 0.7rem; }

/* stats */
.be-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
  margin-top: 2rem;
}
.be-stat {
  padding-top: 0.9rem;
  border-top: 1px solid var(--be-border);
}
.be-stat-value {
  font-family: var(--font-title);
  font-size: clamp(1.7rem, 3vw, 2.3rem);
  font-weight: 800;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  color: var(--color-text);
}
.be-stat-prefix { color: var(--color-accent1); }
.be-stat-label {
  margin-top: 0.5rem;
  font-size: 0.76rem;
  line-height: 1.5;
  color: var(--color-text-muted);
}

@media (max-width: 960px) {
  .be-about-grid { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .be-stats { grid-template-columns: 1fr; gap: 1rem; }
  .be-log-list li { grid-template-columns: 1fr; gap: 0; }
}
</style>
