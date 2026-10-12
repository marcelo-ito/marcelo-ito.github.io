/**
 * Helpers compartilhados pelos slides do deck.
 * Tudo aqui respeita `prefers-reduced-motion` e ponteiro sem hover.
 */
import { onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'

export const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const canHover = () => window.matchMedia('(hover: hover)').matches

/**
 * Monta a timeline de entrada do slide e a dispara quando ele entra em tela.
 * Ao sair, a timeline volta ao início — então a animação toca de novo a cada
 * visita, que é o comportamento esperado numa apresentação de slides.
 *
 * Também liga, por padrão, o parallax de mouse (`data-depth`) e os botões
 * magnéticos (`data-magnetic`) dentro do slide.
 *
 * @param {import('vue').Ref<HTMLElement|null>} rootRef  raiz do slide
 * @param {(gsap: any) => gsap.core.Timeline | void} build  cria a timeline
 * @param {{ threshold?: number, extras?: (gsap: any) => void, interactive?: boolean }} [options]
 *        `extras` roda uma vez, para loops contínuos que não dependem da entrada.
 */
export function useSlideReveal(rootRef, build, options = {}) {
  const { threshold = 0.35, extras, interactive = true } = options
  let ctx = null
  let observer = null

  onMounted(() => {
    const el = rootRef.value
    if (!el) return

    ctx = gsap.context(() => {
      const teardown = []

      if (interactive && !prefersReduced()) {
        teardown.push(setupParallax(el), setupMagnetic(el))
      }

      extras?.(gsap)

      const tl = build(gsap)

      if (tl && prefersReduced()) {
        tl.progress(1).pause()
      } else if (tl) {
        tl.pause(0)
        observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) tl.play()
            else tl.pause(0)
          },
          { threshold },
        )
        observer.observe(el)
      }

      return () => {
        observer?.disconnect()
        teardown.forEach((fn) => fn())
      }
    }, el)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    ctx?.revert()
  })
}

/**
 * Parallax de mouse nas camadas marcadas com `data-depth`.
 * Usa x/y — animações de flutuação devem usar yPercent para não brigar.
 * @returns {() => void} cleanup
 */
export function setupParallax(scope) {
  if (!canHover()) return () => {}

  const setters = gsap.utils.toArray('[data-depth]', scope).map((el) => ({
    depth: Number(el.dataset.depth) / 100,
    x: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' }),
    y: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3.out' }),
  }))

  const onMove = (e) => {
    const dx = e.clientX - window.innerWidth / 2
    const dy = e.clientY - window.innerHeight / 2
    setters.forEach((s) => { s.x(dx * s.depth); s.y(dy * s.depth) })
  }

  window.addEventListener('mousemove', onMove)
  return () => window.removeEventListener('mousemove', onMove)
}

/**
 * Botões magnéticos: o alvo persegue levemente o cursor e volta com easing.
 * @returns {() => void} cleanup
 */
export function setupMagnetic(scope) {
  if (!canHover()) return () => {}

  const cleanups = []

  gsap.utils.toArray('[data-magnetic]', scope).forEach((btn) => {
    const xTo = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' })
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' })

    const move = (e) => {
      const r = btn.getBoundingClientRect()
      xTo((e.clientX - r.left - r.width / 2) * 0.28)
      yTo((e.clientY - r.top - r.height / 2) * 0.4)
    }
    const leave = () => { xTo(0); yTo(0) }

    btn.addEventListener('mousemove', move)
    btn.addEventListener('mouseleave', leave)
    cleanups.push(() => {
      btn.removeEventListener('mousemove', move)
      btn.removeEventListener('mouseleave', leave)
    })
  })

  return () => cleanups.forEach((fn) => fn())
}

/** Flutuação contínua dos cards de vidro (yPercent, para somar ao parallax). */
export function floatLoop(selector, amount = -8, duration = 3.6, delay = 0) {
  return gsap.to(selector, {
    yPercent: amount,
    duration,
    delay,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  })
}
