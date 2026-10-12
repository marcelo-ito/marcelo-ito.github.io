<script setup>
import { computed, ref, useId } from 'vue'
import { useLocaleStore } from '@/composables/useLocale'
import { vReveal } from '@/composables/motion'

// Draws an architecture diagram from data (see src/data/backendProjects.js): groups, nodes and
// straight edges clipped to the node boxes. Edges "draw in" once the diagram is both on screen
// and on the active carousel slide; hovering a node highlights its connections.
const props = defineProps({
  diagram: { type: Object, required: true },
  label: { type: String, required: true },
  active: { type: Boolean, default: false },
})

const locale = useLocaleStore()
const tr = (v) => (v && typeof v === 'object' ? v[locale.locale === 'en' ? 'en' : 'pt'] : v)
const uid = useId()
const hovered = ref(null)

const nodesById = computed(() => Object.fromEntries(props.diagram.nodes.map((n) => [n.id, n])))

// point where the segment from the node centre towards (tx, ty) leaves the box (+ a small gap)
function anchor(n, tx, ty) {
  const cx = n.x + n.w / 2
  const cy = n.y + n.h / 2
  const dx = tx - cx
  const dy = ty - cy
  const s = Math.min((n.w / 2 + 5) / Math.abs(dx || 1e-6), (n.h / 2 + 5) / Math.abs(dy || 1e-6))
  return [cx + dx * s, cy + dy * s]
}

const edges = computed(() =>
  props.diagram.edges.map((e, i) => {
    const a = nodesById.value[e.from]
    const b = nodesById.value[e.to]
    const [x1, y1] = anchor(a, b.x + b.w / 2, b.y + b.h / 2)
    const [x2, y2] = anchor(b, a.x + a.w / 2, a.y + a.h / 2)
    return {
      key: `${e.from}-${e.to}`,
      i,
      from: e.from,
      to: e.to,
      dashed: e.dashed,
      label: tr(e.label),
      d: `M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`,
      lx: (x1 + x2) / 2,
      ly: (y1 + y2) / 2 - 7,
    }
  }),
)

const neighbours = computed(() => {
  if (!hovered.value) return null
  const set = new Set([hovered.value])
  for (const e of props.diagram.edges) {
    if (e.from === hovered.value) set.add(e.to)
    if (e.to === hovered.value) set.add(e.from)
  }
  return set
})
const isLit = (e) => hovered.value && (e.from === hovered.value || e.to === hovered.value)
</script>

<template>
  <svg
    v-reveal:scale
    class="ad"
    :class="{ 'is-active': active, 'is-focusing': hovered }"
    viewBox="0 0 560 360"
    role="img"
    :aria-label="label"
  >
    <defs>
      <marker :id="`${uid}-arrow`" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" class="ad-arrow" />
      </marker>
    </defs>

    <g v-for="(g, gi) in diagram.groups" :key="`g${gi}`" class="ad-group">
      <rect :x="g.x" :y="g.y" :width="g.w" :height="g.h" rx="14" />
      <text :x="g.x + 12" :y="g.y + 19">{{ tr(g.label) }}</text>
    </g>

    <g
      v-for="e in edges"
      :key="e.key"
      class="ad-edge"
      :class="{ 'is-lit': isLit(e), 'is-dashed': e.dashed }"
      :style="{ '--i': e.i }"
    >
      <path :d="e.d" pathLength="1" :marker-end="`url(#${uid}-arrow)`" />
      <text v-if="e.label" :x="e.lx" :y="e.ly" text-anchor="middle">{{ e.label }}</text>
    </g>

    <g
      v-for="(n, ni) in diagram.nodes"
      :key="n.id"
      class="ad-node"
      :class="[n.kind && `is-${n.kind}`, { 'is-dim': neighbours && !neighbours.has(n.id) }]"
      :style="{ '--i': ni }"
      @pointerenter="hovered = n.id"
      @pointerleave="hovered = null"
    >
      <rect :x="n.x" :y="n.y" :width="n.w" :height="n.h" rx="10" />
      <text :x="n.x + n.w / 2" :y="n.y + n.h / 2 + (n.sub ? -3 : 5)" text-anchor="middle" class="ad-label">{{ tr(n.label) }}</text>
      <text v-if="n.sub" :x="n.x + n.w / 2" :y="n.y + n.h / 2 + 14" text-anchor="middle" class="ad-sub">{{ tr(n.sub) }}</text>
    </g>
  </svg>
</template>

<style scoped>
/* Lives on a dark code-window background in both themes, so it uses the --be-code-* palette. */
.ad {
  --ad-line: rgba(230, 237, 243, 0.32);
  --ad-node-bg: rgba(255, 255, 255, 0.045);
  --ad-node-stroke: rgba(230, 237, 243, 0.22);
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
  font-family: var(--font-body);
}

.ad-group rect {
  fill: color-mix(in srgb, var(--be-code-key) 5%, transparent);
  stroke: color-mix(in srgb, var(--be-code-key) 45%, transparent);
  stroke-width: 1;
  stroke-dasharray: 5 5;
}
.ad-group text {
  font-size: 11.5px;
  letter-spacing: 0.04em;
  fill: var(--be-code-key);
}

/* edges ─ drawn in with stroke-dashoffset (a one-off transition, not a loop) */
.ad-edge path {
  fill: none;
  stroke: var(--ad-line);
  stroke-width: 1.4;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  transition:
    stroke-dashoffset 0.9s cubic-bezier(0.6, 0, 0.2, 1) calc(0.35s + var(--i) * 0.11s),
    stroke 0.25s ease,
    stroke-width 0.25s ease;
}
.ad-edge.is-dashed path {
  stroke-dasharray: 0.018 0.014;
  stroke-dashoffset: 0;
  opacity: 0;
  transition:
    opacity 0.6s ease calc(0.35s + var(--i) * 0.11s),
    stroke 0.25s ease;
}
.ad-arrow { fill: var(--ad-line); }
.ad-edge text {
  font-size: 10.5px;
  fill: var(--be-code-str);
  paint-order: stroke;
  stroke: var(--be-code-bg);
  stroke-width: 4px;
  stroke-linejoin: round;
  opacity: 0;
  transition: opacity 0.5s ease calc(0.9s + var(--i) * 0.11s);
}

.ad[data-revealed].is-active .ad-edge path { stroke-dashoffset: 0; }
.ad[data-revealed].is-active .ad-edge.is-dashed path,
.ad[data-revealed].is-active .ad-edge text { opacity: 1; }

.ad-edge.is-lit path {
  stroke: var(--be-code-key);
  stroke-width: 2.2;
}

/* nodes */
.ad-node {
  cursor: default;
  opacity: 0.35;
  transition: opacity 0.5s ease calc(var(--i) * 0.06s);
}
.ad[data-revealed].is-active .ad-node { opacity: 1; }
.ad.is-focusing .ad-node { transition-delay: 0s; transition-duration: 0.2s; }
.ad.is-focusing .ad-node.is-dim { opacity: 0.35; }

.ad-node rect {
  fill: var(--ad-node-bg);
  stroke: var(--ad-node-stroke);
  stroke-width: 1.2;
  transition: stroke 0.25s ease, fill 0.25s ease;
}
.ad-node:hover rect {
  stroke: var(--be-code-key);
  fill: color-mix(in srgb, var(--be-code-key) 10%, transparent);
}
.ad-node.is-db rect { stroke: color-mix(in srgb, #4ec9b0 70%, transparent); }
.ad-node.is-queue rect { stroke: color-mix(in srgb, var(--be-code-str) 75%, transparent); }
.ad-node.is-guard rect { stroke: color-mix(in srgb, var(--be-code-key) 70%, transparent); }
.ad-node.is-core rect {
  fill: color-mix(in srgb, var(--be-a) 45%, transparent);
  stroke: color-mix(in srgb, var(--be-code-key) 80%, transparent);
}

.ad-label {
  font-family: var(--font-title);
  font-size: 13.5px;
  font-weight: 700;
  fill: var(--be-code-text);
}
.ad-sub {
  font-size: 10.5px;
  fill: var(--be-code-punct);
}

@media (max-width: 600px) {
  .ad-sub,
  .ad-edge text { display: none; }
  .ad-label { font-size: 16px; }
}

@media (prefers-reduced-motion: reduce) {
  .ad *,
  .ad *::before { transition: none !important; }
}
</style>
