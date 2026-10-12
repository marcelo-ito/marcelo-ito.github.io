<script setup>
import { computed } from 'vue'
import { useLocaleStore } from '@/composables/useLocale'
import { splitWords, vMagnetic, vReveal } from '@/composables/motion'

const EMAIL = 'marcelo-ito@hotmail.com'
const LINKEDIN = 'https://www.linkedin.com/in/marcelo-ito-/'
const GITHUB = 'https://github.com/marcelo-ito'

const locale = useLocaleStore()
const t = computed(() => locale.t.frontendPage.contact)
const titleWords = computed(() => splitWords(t.value.title))
</script>

<template>
  <section id="contato" class="fe-section fe-contact">
    <div class="fe-contact-glow" aria-hidden="true" />

    <div class="fe-container fe-contact-inner">
      <p v-reveal class="fe-eyebrow">{{ t.eyebrow }}</p>

      <h2 v-reveal:split class="fe-contact-title">
        <span class="sr-only">{{ t.title }}</span>
        <span aria-hidden="true">
          <template v-for="(word, i) in titleWords" :key="i">
            <span class="split-word"><span :style="{ '--i': i }" :class="{ 'fe-gradient-text': i >= titleWords.length - 2 }">{{ word }}</span></span>{{ ' ' }}
          </template>
        </span>
      </h2>

      <p v-reveal="{ delay: 200 }" class="fe-contact-text">{{ t.text }}</p>

      <div v-reveal="{ delay: 320 }" class="fe-contact-actions">
        <a v-magnetic :href="`mailto:${EMAIL}`" class="fe-btn fe-btn--primary">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3.5 6.5h17v11h-17zM4 7l8 6 8-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          {{ t.email }}
        </a>
        <a v-magnetic :href="LINKEDIN" target="_blank" rel="noopener noreferrer" class="fe-btn fe-btn--ghost">
          {{ t.linkedin }}
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" class="arrow">
            <path d="M5 11l6-6M6 5h5v5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </a>
        <a v-magnetic :href="GITHUB" target="_blank" rel="noopener noreferrer" class="fe-btn fe-btn--ghost">
          {{ t.github }}
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" class="arrow">
            <path d="M5 11l6-6M6 5h5v5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </a>
      </div>

      <p v-reveal="{ delay: 420 }">
        <a :href="`mailto:${EMAIL}`" class="fe-contact-email">{{ EMAIL }}</a>
      </p>
    </div>
  </section>
</template>

<style scoped>
.fe-contact {
  overflow: hidden;
  text-align: center;
  background: var(--color-surface);
  border-top: 1px solid var(--fe-border);
  isolation: isolate;
}
.fe-contact-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: -1;
  width: min(900px, 140vw);
  aspect-ratio: 1;
  margin: calc(min(900px, 140vw) / -2) 0 0 calc(min(900px, 140vw) / -2);
  /* three soft blobs orbiting the centre; each fades out before the box edge, so the
     rotating square never shows a border. Only transform animates. */
  background:
    radial-gradient(closest-side circle at 34% 36%, color-mix(in srgb, var(--fe-a) 26%, transparent), transparent),
    radial-gradient(closest-side circle at 66% 42%, color-mix(in srgb, var(--fe-c) 20%, transparent), transparent),
    radial-gradient(closest-side circle at 48% 66%, color-mix(in srgb, var(--fe-b) 22%, transparent), transparent);
  animation: fe-contact-spin 36s linear infinite;
}
@keyframes fe-contact-spin { to { transform: rotate(1turn); } }

.fe-contact-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.fe-contact-title {
  max-width: 14ch;
  font-family: var(--font-title);
  font-weight: 600;
  font-size: clamp(2.6rem, 7vw, 5.2rem);
  line-height: 1.02;
  letter-spacing: -0.03em;
  font-variation-settings: 'opsz' 144;
  margin-bottom: 1.5rem;
}
.fe-contact-text {
  max-width: 52ch;
  font-size: 1.06rem;
  line-height: 1.75;
  color: var(--color-text-muted);
  margin-bottom: 2.4rem;
}
.fe-contact-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.9rem;
}
.fe-contact-email {
  display: inline-block;
  margin-top: 2.2rem;
  font-size: 0.95rem;
  color: var(--color-text-muted);
  text-decoration: none;
  background: linear-gradient(currentColor, currentColor) 0 100% / 0 1px no-repeat;
  transition: background-size 0.4s var(--ease-out), color 0.3s ease;
}
.fe-contact-email:hover {
  color: var(--color-accent1);
  background-size: 100% 1px;
}
</style>
