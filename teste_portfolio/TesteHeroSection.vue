<script setup lang="ts">
import { ref, onBeforeUnmount, useTemplateRef } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { slides } from './content.js'
import { useSlideReveal, floatLoop, prefersReduced } from './useSlide.js'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  name:       { type: String, default: 'Marcelo Ito' },
  eyebrow:    { type: String, default: 'Disponível para novos projetos' },
  prefix:     { type: String, default: 'Construindo' },
  roles:      { type: Array,  default: () => ['APIs em .NET', 'interfaces em Vue', 'produtos com IA', 'experiências web'] },
  subtitle:   { type: String, default: 'Desenvolvedor full-stack focado em interfaces rápidas, acessíveis e com personalidade — do .NET no backend ao Vue na ponta.' },
  ctaPrimary: { type: String, default: 'Ver projetos' },
  ctaGhost:   { type: String, default: 'Falar comigo' },
})

const meta  = slides[0]
const root  = useTemplateRef('root')
const typed = ref('')

// Quebra o nome em caracteres para o stagger de entrada
const chars = props.name.split('')

let typeTimer

/** Máquina de escrever que cicla pela lista de papéis */
function startTyping() {
  let word = 0
  let i = 0
  let erasing = false

  const tick = () => {
    const current = props.roles[word]
    typed.value = current.slice(0, i)

    let next = 70
    if (!erasing && i < current.length) i++
    else if (!erasing) { erasing = true; next = 1600 }
    else if (i > 0) { i--; next = 35 }
    else { erasing = false; word = (word + 1) % props.roles.length; next = 260 }

    typeTimer = window.setTimeout(tick, next)
  }

  typeTimer = window.setTimeout(tick, 1400)
}

useSlideReveal(
  root,
  (g) => g
    .timeline({ defaults: { ease: 'power3.out' } })
    .to('.th-eyebrow', { opacity: 1, y: 0, duration: 0.6 }, 0.15)
    .to('.th-char', { opacity: 1, y: 0, rotate: 0, duration: 0.9, stagger: 0.045 }, 0.3)
    .to('.th-visual', { opacity: 1, duration: 1, ease: 'power2.out' }, 0.6)
    .to('.th-role', { opacity: 1, y: 0, duration: 0.7 }, 0.85)
    .to('.th-sub', { opacity: 1, y: 0, duration: 0.7 }, 1.0)
    .to('.th-actions', { opacity: 1, y: 0, duration: 0.7 }, 1.15),
  {
    extras: (g) => {
      // Flutuação dos cards de vidro — yPercent para somar ao y do parallax
      floatLoop('.th-code', -9, 3.5)
      floatLoop('.th-badge', -30, 4, 0.6)

      // Núcleo orgânico que muda de forma
      g.to('.th-core', {
        borderRadius: '62% 38% 40% 60% / 44% 62% 38% 56%',
        rotate: 28, scale: 1.08,
        duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut',
      })

      // Anéis em órbita
      g.to('.th-ring--1', { rotate: 360, duration: 46, repeat: -1, ease: 'none' })
      g.to('.th-ring--2', { rotate: -360, duration: 30, repeat: -1, ease: 'none' })
      g.to('.th-ring--3', { rotate: 360, duration: 20, repeat: -1, ease: 'none' })

      // Traço do "role para baixo"
      g.fromTo('.th-cue-line',
        { scaleX: 0.1 },
        { scaleX: 1, transformOrigin: 'left', duration: 1, repeat: -1, yoyo: true, ease: 'power2.inOut' })

      // Parallax de scroll no fundo
      const el = root.value
      g.to('.th-blob--1', { yPercent: -18, scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 1.4 } })
      g.to('.th-blob--2', { yPercent: 12, scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 1 } })
      g.to('.th-copy', { y: 70, opacity: 0.35, scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 1 } })
    },
  },
)

if (prefersReduced()) typed.value = props.roles[0]
else startTyping()

onBeforeUnmount(() => window.clearTimeout(typeTimer))
</script>

<template>
  <section :id="meta.id" ref="root" class="slide th">
    <div class="th-bg" aria-hidden="true">
      <span class="th-blob th-blob--1" data-depth="4" />
      <span class="th-blob th-blob--2" data-depth="7" />
      <span class="th-blob th-blob--3" data-depth="10" />
      <span class="th-grid" />
      <span class="th-noise" />
    </div>

    <div class="th-copy">
      <p class="th-eyebrow js-fade">
        <i class="th-dot" />
        {{ eyebrow }}
      </p>

      <h1 class="th-name">
        <span
          v-for="(c, i) in chars"
          :key="`${c}-${i}`"
          class="th-char"
          :class="{ 'th-char--space': c === ' ' }"
        >{{ c === ' ' ? ' ' : c }}</span>
      </h1>

      <p class="th-role js-fade">
        {{ prefix }} <span class="th-typed">{{ typed }}</span><i class="th-caret" />
      </p>

      <p class="th-sub js-fade">{{ subtitle }}</p>

      <div class="th-actions js-fade">
        <a class="th-btn th-btn--primary" href="#projetos" data-magnetic>
          <span>{{ ctaPrimary }}</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </a>
        <a class="th-btn th-btn--ghost" href="#contato" data-magnetic>
          <span>{{ ctaGhost }}</span>
        </a>
      </div>
    </div>

    <div class="th-visual" aria-hidden="true">
      <div class="th-stage" data-depth="14">
        <span class="th-ring th-ring--1"><i class="th-sat" /></span>
        <span class="th-ring th-ring--2"><i class="th-sat" /></span>
        <span class="th-ring th-ring--3"><i class="th-sat" /></span>
        <span class="th-core" />
      </div>

      <div class="th-badge" data-depth="40"><i class="th-dot" /> deploy ok</div>

      <div class="th-code" data-depth="46">
        <span class="cm">// stack atual</span><br>
        <span class="k">backend</span>: <span class="v">.NET 9</span><br>
        <span class="k">frontend</span>: <span class="v">Vue 3</span><br>
        <span class="k">banco</span>: <span class="v">PostgreSQL</span><br>
        <span class="k">status</span>: <span class="ok">online</span>
      </div>
    </div>

    <div class="th-cue">
      <i class="th-cue-line" />
      <span>role para baixo</span>
    </div>
  </section>
</template>

<style scoped>
.th {
  --glass: rgba(255, 255, 255, 0.55);
  --glass-border: rgba(61, 43, 31, 0.12);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);

  position: relative; z-index: 1;
  min-height: 100vh;
  display: grid; grid-template-columns: 1.05fr 0.95fr;
  align-items: center; gap: 4rem;
  padding: 8rem 3rem 6rem;
  overflow: hidden; isolation: isolate;
  font-family: 'DM Mono', ui-monospace, monospace;
}
:global(html.dark) .th {
  --glass: rgba(20, 23, 32, 0.55);
  --glass-border: rgba(232, 224, 208, 0.12);
}

/* ── Fundo ─────────────────────────────────── */
.th-bg { position: absolute; inset: 0; z-index: -1; overflow: hidden; }
.th-blob { position: absolute; display: block; border-radius: 50%; filter: blur(70px); opacity: 0.55; will-change: transform; }
.th-blob--1 { width: 46vw; height: 46vw; background: var(--color-accent1); top: -12vw; left: -10vw; }
.th-blob--2 { width: 38vw; height: 38vw; background: var(--color-accent2); bottom: -14vw; right: -8vw; }
.th-blob--3 { width: 24vw; height: 24vw; background: var(--color-error); top: 45%; left: 42%; opacity: 0.3; }

.th-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(var(--color-text) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-text) 1px, transparent 1px);
  background-size: 72px 72px;
  opacity: 0.045;
  mask-image: radial-gradient(ellipse 80% 65% at 50% 40%, #000 30%, transparent 78%);
}
.th-noise {
  position: absolute; inset: 0; opacity: 0.16; mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* ── Texto ─────────────────────────────────── */
.th-copy { position: relative; max-width: 620px; }

.th-eyebrow {
  display: inline-flex; align-items: center; gap: 0.6rem;
  font-size: 0.7rem; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--color-accent1);
  border: 1px solid var(--glass-border); background: var(--glass);
  backdrop-filter: blur(8px);
  padding: 0.45rem 0.95rem; border-radius: 999px; margin-bottom: 1.6rem;
  opacity: 0; transform: translateY(16px);
}
.th-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--color-success);
  animation: th-pulse 2.2s ease-out infinite;
}
@keyframes th-pulse {
  0%   { box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-success) 60%, transparent); }
  70%  { box-shadow: 0 0 0 9px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}

.th-name {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(2.6rem, 6.4vw, 5.4rem);
  font-weight: 900; line-height: 0.95; letter-spacing: -0.035em;
  margin-bottom: 0.35rem;
}
.th-char {
  display: inline-block; opacity: 0;
  transform: translateY(0.55em) rotate(6deg);
  will-change: transform, opacity;
}
.th-char--space { width: 0.28em; }

.th-role {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(1.25rem, 2.6vw, 2.1rem);
  font-weight: 700; font-style: italic; line-height: 1.2;
  color: var(--color-text-muted);
  margin-bottom: 1.4rem; min-height: 1.3em;
  opacity: 0; transform: translateY(20px);
}
.th-typed { color: var(--color-error); font-style: normal; }
.th-caret {
  display: inline-block; width: 2px; height: 0.95em;
  background: var(--color-accent1); vertical-align: -0.12em; margin-left: 3px;
  animation: th-blink 1s steps(1) infinite;
}
@keyframes th-blink { 50% { opacity: 0; } }

.th-sub {
  font-size: 1.02rem; line-height: 1.7; color: var(--color-text-muted);
  max-width: 460px; margin-bottom: 2.4rem;
  opacity: 0; transform: translateY(20px);
}

.th-actions { display: flex; flex-wrap: wrap; gap: 1rem; opacity: 0; transform: translateY(20px); }

.th-btn {
  position: relative; overflow: hidden;
  display: inline-flex; align-items: center; gap: 0.7rem;
  font-family: inherit; font-size: 0.78rem;
  letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none;
  padding: 0.95rem 1.9rem; border: 1px solid var(--color-text);
  cursor: pointer; will-change: transform;
}
.th-btn--primary { background: var(--color-text); color: var(--color-bg); }
.th-btn--primary::after {
  content: ''; position: absolute; inset: 0; background: var(--color-error);
  transform: translateY(101%); transition: transform 0.45s var(--ease-out);
}
.th-btn--primary:hover::after { transform: translateY(0); }
.th-btn--primary span, .th-btn--primary svg { position: relative; z-index: 1; }
.th-btn--ghost { background: transparent; color: var(--color-text); border-color: var(--glass-border); }
.th-btn--ghost:hover { border-color: var(--color-accent1); color: var(--color-accent1); }
.th-btn svg { transition: transform 0.3s var(--ease-out); }
.th-btn:hover svg { transform: translateX(5px); }

/* ── Visual ────────────────────────────────── */
.th-visual { position: relative; height: 540px; opacity: 0; }
.th-stage  { position: absolute; inset: 0; display: grid; place-items: center; }

.th-ring { position: absolute; border-radius: 50%; border: 1px dashed var(--glass-border); }
.th-ring--1 { width: 460px; height: 460px; }
.th-ring--2 { width: 330px; height: 330px; border-style: solid; border-color: color-mix(in srgb, var(--color-accent1) 35%, transparent); }
.th-ring--3 { width: 210px; height: 210px; }

.th-sat {
  position: absolute; top: -6px; left: 50%; margin-left: -6px;
  width: 12px; height: 12px; border-radius: 50%; background: var(--color-accent1);
}
.th-ring--2 .th-sat { background: var(--color-error); width: 10px; height: 10px; margin-left: -5px; }
.th-ring--3 .th-sat { background: var(--color-success); width: 8px; height: 8px; margin-left: -4px; }

.th-core {
  width: 132px; height: 132px;
  border-radius: 46% 54% 60% 40% / 52% 44% 56% 48%;
  background: linear-gradient(140deg, var(--color-accent1), var(--color-accent2));
}

.th-code {
  position: absolute; right: -0.5rem; bottom: 4%;
  width: 264px; padding: 1.1rem 1.3rem;
  background: var(--glass); backdrop-filter: blur(14px);
  border: 1px solid var(--glass-border);
  border-left: 3px solid var(--color-accent1);
  border-radius: 4px;
  font-size: 0.72rem; line-height: 1.85;
  box-shadow: 0 20px 50px -20px rgba(0, 0, 0, 0.35);
}
.th-code .k  { color: var(--color-accent1); }
.th-code .v  { color: var(--color-text-muted); }
.th-code .ok { color: var(--color-success); }
.th-code .cm { color: var(--color-text-muted); opacity: 0.7; }

.th-badge {
  position: absolute; top: 6%; left: 0;
  display: flex; align-items: center; gap: 0.55rem;
  padding: 0.55rem 1rem; border-radius: 999px;
  background: var(--glass); backdrop-filter: blur(14px);
  border: 1px solid var(--glass-border);
  font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase;
}

.th-cue {
  position: absolute; left: 3rem; bottom: 2.2rem;
  display: flex; align-items: center; gap: 0.8rem;
  font-size: 0.66rem; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--color-text-muted);
}
.th-cue-line { display: block; width: 64px; height: 1px; background: var(--color-accent1); }

/* ── Responsivo ────────────────────────────── */
/* Notebooks baixos: a hero também precisa caber numa tela só */
@media (min-width: 1101px) and (max-height: 860px) {
  .th { padding: 5.5rem 3rem 4rem; }
  .th-visual { height: 420px; }
  .th-ring--1 { width: 380px; height: 380px; }
  .th-ring--2 { width: 280px; height: 280px; }
  .th-ring--3 { width: 180px; height: 180px; }
  .th-sub { margin-bottom: 1.8rem; }
}
@media (max-width: 1100px) {
  .th { padding: 7rem 2rem 5rem; gap: 2rem; }
  .th-visual { height: 430px; }
  .th-ring--1 { width: 360px; height: 360px; }
  .th-ring--2 { width: 260px; height: 260px; }
  .th-ring--3 { width: 170px; height: 170px; }
  .th-cue { left: 2rem; }
}
@media (max-width: 820px) {
  .th { grid-template-columns: 1fr; padding: 6.5rem 1.5rem 4.5rem; }
  .th-visual { display: none; }
  .th-sub { max-width: 100%; }
  .th-cue { left: 1.5rem; }
}

@media (prefers-reduced-motion: reduce) {
  .th-dot, .th-caret { animation: none; }
  .th-eyebrow, .th-role, .th-sub, .th-actions, .th-visual { opacity: 1; transform: none; }
  .th-char { opacity: 1; transform: none; }
}
</style>
