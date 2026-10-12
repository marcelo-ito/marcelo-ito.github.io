<script setup>
import { computed } from 'vue'
import ProjectCarousel from '@/components/ui/ProjectCarousel.vue'
import { useLocaleStore } from '@/composables/useLocale'
import { splitWords, vReveal } from '@/composables/motion'
import { frontendProjects } from '@/data/frontendProjects'

const locale = useLocaleStore()
const t = computed(() => locale.t.frontendPage.projects)
const titleWords = computed(() => splitWords(t.value.title))

const items = computed(() =>
  frontendProjects.map((p) => ({
    ...p,
    ...t.value.items[p.id],
    badge: p.concept ? t.value.concept : null,
    badgeHint: p.concept ? t.value.conceptHint : null,
  })),
)

const labels = computed(() => ({
  region: t.value.carouselLabel,
  prev: t.value.prev,
  next: t.value.next,
  of: t.value.of,
  highlights: t.value.highlightsLabel,
  stack: t.value.stackLabel,
}))

function srcset(image) {
  const [small, large] = image.sizes ?? [640, 1280]
  return `${image.base}-${small}.webp ${small}w, ${image.base}-${large}.webp ${large}w`
}
function src(image) {
  const [small] = image.sizes ?? [640, 1280]
  return `${image.base}-${small}.webp`
}
</script>

<template>
  <section id="projetos" class="fe-section fe-projects">
    <div class="fe-container fe-projects-head">
      <p v-reveal class="fe-eyebrow">{{ t.eyebrow }}</p>
      <h2 v-reveal:split class="fe-heading">
        <span class="sr-only">{{ t.title }}</span>
        <span aria-hidden="true">
          <template v-for="(word, i) in titleWords" :key="i">
            <span class="split-word"><span :style="{ '--i': i }">{{ word }}</span></span>{{ ' ' }}
          </template>
        </span>
      </h2>
      <p v-reveal="{ delay: 150 }" class="fe-projects-intro">{{ t.intro }}</p>
    </div>

    <div v-reveal="{ delay: 200 }">
      <ProjectCarousel :items="items" :labels="labels">
        <template #media="{ item }">
          <div v-if="item.frame === 'phone'" class="fe-phone-stage">
            <div class="fe-phone">
              <span class="fe-phone-notch" aria-hidden="true" />
              <img
                :src="src(item.image)"
                :srcset="srcset(item.image)"
                sizes="240px"
                :width="item.image.width"
                :height="item.image.height"
                :alt="`${t.screenshotAlt} ${item.name}`"
                loading="lazy"
                decoding="async"
                draggable="false"
              />
            </div>
          </div>

          <figure v-else class="fe-browser">
            <figcaption class="fe-browser-bar" aria-hidden="true">
              <span class="fe-browser-dots"><i /><i /><i /></span>
              <span class="fe-browser-url">{{ item.folder }}</span>
            </figcaption>
            <div class="fe-browser-view">
              <img
                :src="src(item.image)"
                :srcset="srcset(item.image)"
                sizes="(max-width: 900px) 84vw, 580px"
                :width="item.image.width"
                :height="item.image.height"
                :alt="`${t.screenshotAlt} ${item.name}`"
                loading="lazy"
                decoding="async"
                draggable="false"
              />
            </div>
          </figure>
        </template>
      </ProjectCarousel>
    </div>
  </section>
</template>

<style scoped>
.fe-projects {
  overflow: hidden;
  background:
    radial-gradient(50% 40% at 100% 20%, color-mix(in srgb, var(--fe-c) 10%, transparent), transparent 70%),
    radial-gradient(45% 40% at 0% 90%, color-mix(in srgb, var(--fe-b) 10%, transparent), transparent 70%),
    var(--color-bg);
}
.fe-projects-head { margin-bottom: 1rem; }
.fe-projects-intro {
  max-width: 56ch;
  margin-top: 1.1rem;
  font-size: 1.02rem;
  line-height: 1.75;
  color: var(--color-text-muted);
}

/* Browser mockup ─────────────────────────────────────────────────────── */
.fe-browser {
  margin: 0;
  border-radius: 16px;
  overflow: hidden;
  background: var(--color-surface);
  border: 1px solid var(--fe-border);
  box-shadow: 0 30px 60px -30px rgba(0, 0, 0, 0.55);
}
.fe-browser-bar {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.65rem 0.9rem;
  border-bottom: 1px solid var(--fe-border);
  background: color-mix(in srgb, var(--color-text) 4%, var(--color-surface));
}
.fe-browser-dots { display: flex; gap: 6px; }
.fe-browser-dots i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ff5f57;
}
.fe-browser-dots i:nth-child(2) { background: #febc2e; }
.fe-browser-dots i:nth-child(3) { background: #28c840; }
.fe-browser-url {
  flex: 1;
  max-width: 260px;
  margin-inline: auto;
  padding: 0.22rem 0.8rem;
  border-radius: 999px;
  font-size: 0.72rem;
  text-align: center;
  /* muted alone is 4.45:1 on the dark-theme bar */
  color: color-mix(in srgb, var(--color-text-muted) 80%, var(--color-text));
  background: color-mix(in srgb, var(--color-text) 6%, transparent);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.fe-browser-view {
  aspect-ratio: 16 / 10;
  overflow: hidden;
}
.fe-browser-view img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  transition: transform 1.4s var(--ease-out);
}
/* scoped CSS only tags the last compound, so the carousel's own classes match here */
.pc-slide.is-active .fe-browser-view img:hover { transform: scale(1.045); }

/* Phone mockup ───────────────────────────────────────────────────────── */
.fe-phone-stage {
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 16 / 11;
  border-radius: 16px;
  background:
    radial-gradient(closest-side, color-mix(in srgb, var(--fe-a) 28%, transparent), transparent),
    color-mix(in srgb, var(--color-text) 4%, transparent);
  overflow: hidden;
}
.fe-phone {
  position: relative;
  width: min(240px, 46%);
  aspect-ratio: 400 / 820;
  padding: 9px;
  border-radius: 34px;
  background: #111;
  box-shadow:
    0 0 0 1.5px #3a3a3c,
    0 35px 60px -25px rgba(0, 0, 0, 0.6);
  transform: rotate(-4deg) translateY(8%);
  transition: transform 0.9s var(--ease-out);
}
.pc-slide.is-active .fe-phone:hover { transform: rotate(0deg) translateY(4%); }
.fe-phone img {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 26px;
  object-fit: cover;
  object-position: top;
}
.fe-phone-notch {
  position: absolute;
  top: 16px;
  left: 50%;
  z-index: 1;
  width: 32%;
  height: 16px;
  margin-left: -16%;
  border-radius: 999px;
  background: #111;
}
</style>
