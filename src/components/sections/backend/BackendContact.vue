<script setup>
import { computed } from 'vue'
import { useLocaleStore } from '@/composables/useLocale'
import { splitWords, vMagnetic, vReveal } from '@/composables/motion'

const EMAIL = 'marcelo-ito@hotmail.com'
const LINKEDIN = 'https://www.linkedin.com/in/marcelo-ito-/'
const GITHUB = 'https://github.com/marcelo-ito'
const CV_PATH = '/cv-marcelo-ito.pdf'

const locale = useLocaleStore()
const t = computed(() => locale.t.backendPage.contact)
const titleWords = computed(() => splitWords(t.value.title))
</script>

<template>
  <section id="contato" class="be-section be-contact">
    <div class="be-contact-grid" aria-hidden="true" />

    <div class="be-container be-contact-inner">
      <p v-reveal class="be-eyebrow">{{ t.eyebrow }}</p>
      <p v-reveal="{ delay: 80 }" class="be-contact-cmd" aria-hidden="true">
        <span class="be-prompt">$</span> {{ t.command }}<span class="be-caret" />
      </p>

      <h2 v-reveal:split class="be-contact-title">
        <span class="sr-only">{{ t.title }}</span>
        <span aria-hidden="true">
          <template v-for="(word, i) in titleWords" :key="i">
            <span class="split-word"><span :style="{ '--i': i }">{{ word }}</span></span>{{ ' ' }}
          </template>
        </span>
      </h2>

      <p v-reveal="{ delay: 200 }" class="be-contact-text">{{ t.text }}</p>

      <div v-reveal="{ delay: 300 }" class="be-contact-actions">
        <a v-magnetic="0.25" :href="`mailto:${EMAIL}`" class="be-btn be-btn--primary">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3.5 6.5h17v11h-17zM4 7l8 6 8-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          {{ t.email }}
        </a>
        <a v-magnetic="0.25" :href="CV_PATH" download="CV-Marcelo-Ito.pdf" class="be-btn be-btn--ghost">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" class="arrow-down">
            <path d="M8 1.5v9M4 7l4 4 4-4M2.5 14h11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          {{ t.cv }}
        </a>
        <a v-magnetic="0.25" :href="LINKEDIN" target="_blank" rel="noopener noreferrer" class="be-btn be-btn--ghost">
          {{ t.linkedin }}
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" class="arrow">
            <path d="M5 11l6-6M6 5h5v5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </a>
        <a v-magnetic="0.25" :href="GITHUB" target="_blank" rel="noopener noreferrer" class="be-btn be-btn--ghost">
          {{ t.github }}
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" class="arrow">
            <path d="M5 11l6-6M6 5h5v5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </a>
      </div>

      <p v-reveal="{ delay: 400 }">
        <a :href="`mailto:${EMAIL}`" class="be-contact-email">{{ EMAIL }}</a>
      </p>
    </div>
  </section>
</template>

<style scoped>
.be-contact {
  overflow: hidden;
  isolation: isolate;
  background:
    radial-gradient(40% 55% at 50% 100%, color-mix(in srgb, var(--be-a) 18%, transparent), transparent 75%),
    var(--color-surface);
  border-top: 1px solid var(--be-border);
}
.be-contact-grid {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image:
    linear-gradient(color-mix(in srgb, var(--color-text) 6%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--color-text) 6%, transparent) 1px, transparent 1px);
  background-size: 44px 44px;
  -webkit-mask-image: radial-gradient(ellipse 60% 70% at 50% 60%, #000 10%, transparent 75%);
  mask-image: radial-gradient(ellipse 60% 70% at 50% 60%, #000 10%, transparent 75%);
}

.be-contact-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.be-contact-cmd {
  margin-bottom: 1.25rem;
  font-size: 0.9rem;
  color: var(--color-text-muted);
}
.be-contact-title {
  max-width: 22ch;
  font-family: var(--font-title);
  font-weight: 800;
  font-size: clamp(2rem, 5vw, 3.6rem);
  line-height: 1.1;
  letter-spacing: -0.04em;
  margin-bottom: 1.3rem;
}
.be-contact-text {
  max-width: 54ch;
  font-size: 0.95rem;
  line-height: 1.8;
  color: var(--color-text-muted);
  margin-bottom: 2.2rem;
}
.be-contact-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.8rem;
}
.be-contact-email {
  display: inline-block;
  margin-top: 2rem;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  text-decoration: none;
  background: linear-gradient(currentColor, currentColor) 0 100% / 0 1px no-repeat;
  transition: background-size 0.4s var(--ease-out), color 0.3s ease;
}
.be-contact-email:hover {
  color: var(--color-accent1);
  background-size: 100% 1px;
}
</style>
