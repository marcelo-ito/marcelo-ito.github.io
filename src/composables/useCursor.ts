import { onUnmounted, nextTick } from 'vue'

const HOVER_TARGETS = 'a, button, [role="button"], .project-card, [data-cursor="hover"]'

export function useCursor() {
  let mx = 0, my = 0, rx = 0, ry = 0
  let cursorScale = 1, ringScale = 1
  let rafId = 0
  let running = false
  let cursorEl: HTMLElement | null = null
  let ringEl: HTMLElement | null = null

  // transform is compositor-only (no layout pass), unlike left/top — keeps
  // the visual update as close as possible to the actual mouse position
  function applyCursorTransform() {
    if (cursorEl) cursorEl.style.transform = `translate3d(${mx - 6}px, ${my - 6}px, 0) scale(${cursorScale})`
  }
  function applyRingTransform() {
    if (ringEl) ringEl.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0) scale(${ringScale})`
  }

  function animateRing() {
    rx += (mx - rx) * 0.3
    ry += (my - ry) * 0.3
    applyRingTransform()
    // Sleep once the ring has caught up; the next mousemove wakes the loop again.
    if (Math.abs(mx - rx) < 0.1 && Math.abs(my - ry) < 0.1) {
      running = false
      return
    }
    rafId = requestAnimationFrame(animateRing)
  }

  function wake() {
    if (running) return
    running = true
    rafId = requestAnimationFrame(animateRing)
  }

  let shown = false
  function onMouseMove(e: MouseEvent) {
    mx = e.clientX
    my = e.clientY
    if (!shown) {
      // start the ring on the pointer instead of flying in from the corner
      rx = mx
      ry = my
      shown = true
      // CSS keeps both hidden until now, so they never sit at (0,0)
      if (cursorEl) cursorEl.style.visibility = 'visible'
      if (ringEl) ringEl.style.visibility = 'visible'
    }
    applyCursorTransform()
    wake()
  }

  function setHover(on: boolean) {
    if (!cursorEl || !ringEl) return
    cursorScale = on ? 2.5 : 1
    ringScale = on ? 1.5 : 1
    ringEl.style.opacity = on ? '0.3' : '0.6'
    applyCursorTransform()
    applyRingTransform()
  }

  // Delegated, so links rendered later (route changes, carousels) get the hover state too.
  function onOver(e: MouseEvent) {
    const target = (e.target as Element).closest?.(HOVER_TARGETS)
    if (!target) return
    const from = (e.relatedTarget as Element | null)?.closest?.(HOVER_TARGETS)
    if (from !== target) setHover(true)
  }
  function onOut(e: MouseEvent) {
    const target = (e.target as Element).closest?.(HOVER_TARGETS)
    if (!target) return
    const to = (e.relatedTarget as Element | null)?.closest?.(HOVER_TARGETS)
    if (to !== target) setHover(!!to)
  }

  const setupCursor = async () => {
    // Wait for Vue to render the #cursor divs (since they are behind a v-if)
    await nextTick()

    cursorEl = document.getElementById('cursor')
    ringEl = document.getElementById('cursor-ring')

    document.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })
    document.addEventListener('mouseout', onOut, { passive: true })
  }

  onUnmounted(() => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseover', onOver)
    document.removeEventListener('mouseout', onOut)
    cancelAnimationFrame(rafId)
  })

  return { setupCursor }
}
