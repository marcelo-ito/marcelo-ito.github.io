<script setup>
import { computed, onMounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useLocaleStore } from '@/composables/useLocale'

gsap.registerPlugin(ScrollTrigger)

const locale = useLocaleStore()
const t = computed(() => locale.t.portfolios)

// each card previews its page and shows that page's two palettes (dark + light theme)
const cards = computed(() => [
  {
    key: 'frontend',
    to: '/frontend',
    img: '/assets/images/preview-frontend',
    swatches: ['#1e1e1e', '#007acc', '#4ec9b0', '#42b883', '#35495e'],
    ...t.value.frontend,
  },
  {
    key: 'backend',
    to: '/backend',
    img: '/assets/images/preview-backend',
    swatches: ['#1e1e1e', '#512bd4', '#9780ff', '#0081a3', '#61dafb'],
    ...t.value.backend,
  },
])

onMounted(() => {
  const trigger = { trigger: '#portfolios', start: 'top 75%' }
  gsap.to('.pf-title', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: trigger })
  gsap.to('.pf-intro', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.1, scrollTrigger: trigger })
  gsap.to('.pf-card', {
    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.15,
    scrollTrigger: { trigger: '.pf-grid', start: 'top 80%' },
  })
})
</script>

<template>
  <section id="portfolios" class="pf-section">
    <div class="section-header">
      <span class="section-num">{{ t.eyebrow }}</span>
      <h2 class="section-title pf-title">{{ t.title }}</h2>
      <div class="section-line" />
    </div>

    <p class="pf-intro">{{ t.intro }}</p>

    <div class="pf-grid">
      <RouterLink v-for="card in cards" :key="card.key" :to="card.to" class="pf-card">
        <div class="pf-thumb">
          <img
            :src="`${card.img}-560.webp`"
            :srcset="`${card.img}-560.webp 560w, ${card.img}-1120.webp 1120w`"
            sizes="(max-width: 900px) 92vw, 46vw"
            width="1120"
            height="700"
            :alt="card.alt"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div class="pf-body">
          <span class="pf-tag">{{ card.tag }}</span>
          <h3 class="pf-name">{{ card.title }}</h3>
          <p class="pf-text">{{ card.text }}</p>
          <div class="pf-footer">
            <span class="pf-cta">{{ card.cta }} <span class="pf-arrow" aria-hidden="true">→</span></span>
            <span class="pf-swatches" aria-hidden="true"><i v-for="c in card.swatches" :key="c" :style="{ background: c }" /></span>
          </div>
        </div>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.pf-section {
  position: relative;
  z-index: 1;
  padding: 7rem 3rem 8rem;
  background: var(--color-bg);
}

.section-header { display: flex; align-items: baseline; gap: 2rem; margin-bottom: 1.5rem; overflow: hidden; }
.section-num { font-family: 'DM Mono', monospace; font-size: 0.85rem; color: var(--color-link); }
.section-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 3.5vw, 3rem);
  font-weight: 900;
  line-height: 1;
  opacity: 0;
  transform: translateY(40px);
}
.section-line { flex: 1; height: 1px; background: var(--color-accent1); opacity: 0.4; }

.pf-intro {
  max-width: 60ch;
  margin-bottom: 3.5rem;
  font-size: 1.15rem;
  line-height: 1.6;
  color: var(--color-text-muted);
  opacity: 0;
  transform: translateY(20px);
}

.pf-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2rem;
}

.pf-card {
  display: flex;
  flex-direction: column;
  color: var(--color-text);
  text-decoration: none;
  background: var(--color-surface);
  border: 1px solid color-mix(in srgb, var(--color-accent1) 35%, transparent);
  opacity: 0;
  transform: translateY(40px);
  transition:
    border-color 0.3s ease,
    box-shadow 0.4s ease;
}
.pf-card:hover {
  border-color: var(--color-accent1);
  box-shadow: 0 30px 60px -35px color-mix(in srgb, var(--color-text) 60%, transparent);
}

.pf-thumb {
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-bottom: 1px solid color-mix(in srgb, var(--color-accent1) 35%, transparent);
}
.pf-thumb img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  transition: transform 1.1s cubic-bezier(0.2, 0.65, 0.25, 1);
}
.pf-card:hover .pf-thumb img { transform: scale(1.045); }

.pf-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 2rem 2rem 1.75rem;
}
.pf-tag {
  font-family: 'DM Mono', monospace;
  font-size: 0.68rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-link);
  margin-bottom: 0.75rem;
}
.pf-name {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 3vw, 2.6rem);
  font-weight: 900;
  line-height: 1;
  margin-bottom: 1rem;
}
.pf-text {
  flex: 1;
  font-size: 1.05rem;
  line-height: 1.65;
  color: var(--color-text-muted);
  margin-bottom: 1.75rem;
}
.pf-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
.pf-cta {
  font-family: 'DM Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text);
}
.pf-arrow {
  display: inline-block;
  margin-left: 0.35rem;
  color: var(--color-error);
  transition: transform 0.3s ease;
}
.pf-card:hover .pf-arrow { transform: translateX(6px); }
.pf-swatches { display: flex; }
.pf-swatches i {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid var(--color-surface);
  margin-left: -5px;
}

.pf-card:focus-visible { outline: 2px solid var(--color-accent1); outline-offset: 4px; }

@media (max-width: 1024px) {
  .pf-section { padding: 6rem 2rem; }
}
@media (max-width: 900px) {
  .pf-grid { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .pf-section { padding: 5rem 1.5rem 4rem; }
  .section-header { gap: 1rem; }
  .pf-intro { font-size: 1rem; margin-bottom: 2.5rem; }
  .pf-body { padding: 1.5rem; }
}
</style>
