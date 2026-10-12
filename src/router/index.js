import { createRouter, createWebHistory } from 'vue-router'

// Every page is its own chunk: GSAP and the icon font only ship with the home page,
// so /frontend and /backend don't pay for animation libraries they don't use.
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: 'Marcelo Ito — Fullstack Developer' },
    },
    {
      path: '/frontend',
      name: 'frontend',
      component: () => import('@/views/FrontendView.vue'),
      meta: { title: 'Marcelo Ito — Desenvolvedor Frontend' },
    },
    {
      path: '/backend',
      name: 'backend',
      component: () => import('@/views/BackendView.vue'),
      meta: { title: 'Marcelo Ito — Desenvolvedor Backend' },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    // first load: the page is already at the top — skip the scrollTo (it forces a reflow)
    if (from.matched.length === 0) return false
    return { top: 0 }
  },
})

router.afterEach((to) => {
  if (to.meta.title) document.title = to.meta.title
})

export default router
