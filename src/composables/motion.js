// Lightweight motion toolkit for the /frontend and /backend pages: no animation library,
// one shared IntersectionObserver, and CSS doing the actual animating (transform/opacity
// only, so it runs on the compositor). Visual states live in src/styles/motion.css.

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches

// Revealed elements get a data-revealed attribute, not a class: Vue rewrites the whole
// class attribute whenever an element's :class binding changes, which would silently wipe
// a class added from here (it did, on the carousel's diagrams).
const onReveal = new WeakMap()
let observer = null

function getObserver() {
  if (observer) return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const el = entry.target
        el.dataset.revealed = ''
        onReveal.get(el)?.()
        observer.unobserve(el)
      }
    },
    { rootMargin: '0px 0px -12% 0px' },
  )
  return observer
}

function whenRevealed(el, callback) {
  if (callback) onReveal.set(el, callback)
  if (reducedMotion() || !('IntersectionObserver' in window)) {
    el.dataset.revealed = ''
    callback?.()
    return
  }
  getObserver().observe(el)
}

/**
 * v-reveal            → fade + rise when scrolled into view
 * v-reveal:left|right|scale|split
 * v-reveal="{ delay: 120 }"
 */
export const vReveal = {
  beforeMount(el, binding) {
    el.dataset.reveal = binding.arg || 'up'
    const delay = binding.value?.delay
    if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`)
  },
  mounted(el) {
    whenRevealed(el)
  },
  unmounted(el) {
    observer?.unobserve(el)
  },
}

function formatCount(value, n) {
  const decimals = String(value).split('.')[1]?.length ?? 0
  return n.toLocaleString(document.documentElement.lang || 'pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/** v-count="99" on an empty element → counts up from 0 the first time it is revealed. */
export const vCount = {
  mounted(el, binding) {
    const target = Number(binding.value) || 0
    const format = (n) => formatCount(binding.value, n)
    if (reducedMotion()) {
      el.textContent = format(target)
      return
    }
    el.textContent = format(0)
    whenRevealed(el, () => {
      const start = performance.now()
      const duration = 1400
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        el.textContent = format(target * eased)
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    })
  },
  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      el.textContent = formatCount(binding.value, Number(binding.value) || 0)
    }
  },
}

/** v-magnetic → the element leans toward the pointer (mouse only). */
export const vMagnetic = {
  mounted(el, binding) {
    if (!finePointer() || reducedMotion()) return
    const strength = binding.value ?? 0.3
    let frame = 0
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - (r.left + r.width / 2)) * strength
      const y = (e.clientY - (r.top + r.height / 2)) * strength
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`
      })
    }
    const leave = () => {
      cancelAnimationFrame(frame)
      el.style.transform = ''
    }
    el.classList.add('is-magnetic')
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    el._magnetic = { move, leave }
  },
  unmounted(el) {
    if (!el._magnetic) return
    el.removeEventListener('pointermove', el._magnetic.move)
    el.removeEventListener('pointerleave', el._magnetic.leave)
  },
}

/** v-spotlight → exposes the pointer position as --spot-x/--spot-y for a hover glow. */
export const vSpotlight = {
  mounted(el) {
    if (!finePointer()) return
    const move = (e) => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--spot-x', `${e.clientX - r.left}px`)
      el.style.setProperty('--spot-y', `${e.clientY - r.top}px`)
    }
    el.addEventListener('pointermove', move, { passive: true })
    el._spotlight = move
  },
  unmounted(el) {
    if (el._spotlight) el.removeEventListener('pointermove', el._spotlight)
  },
}

/**
 * Pointer parallax for a section: writes --px / --py (-1…1) on the element while the
 * mouse moves over it. Nothing runs while the pointer is still.
 */
export function usePointerParallax(elRef) {
  let frame = 0
  function onPointerMove(e) {
    const el = elRef.value
    if (!el || e.pointerType !== 'mouse' || reducedMotion()) return
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--px', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3))
      el.style.setProperty('--py', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3))
    })
  }
  return { onPointerMove }
}

/** Splits text into word spans for the masked "split" reveal. */
export function splitWords(text) {
  return String(text).split(/\s+/).filter(Boolean)
}
