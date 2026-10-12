<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLocaleStore } from '@/composables/useLocale'
import { useThemeStore }  from '@/composables/useTheme'

const locale = useLocaleStore()
const themeStore = useThemeStore()
const route = useRoute()
const t = computed(() => locale.t)

const isDark = computed(() => themeStore.theme === 'dark')
const isHome = computed(() => route.name === 'home')

// Home has the full single-page section list plus the two specialised portfolios;
// /frontend and /backend only have Sobre + Projetos + Contato, plus a link back to Home.
const navLinks = computed(() => {
  if (isHome.value) {
    return [
      { label: t.value.nav.about,      href: '#sobre'       },
      { label: t.value.nav.projects,   href: '#projetos'    },
      { label: t.value.nav.skills,     href: '#skills'      },
      { label: t.value.nav.experience, href: '#experiencia' },
      { label: t.value.nav.contact,    href: '#contato'     },
      { label: t.value.nav.frontend,   to: '/frontend', page: true },
      { label: t.value.nav.backend,    to: '/backend',  page: true },
    ]
  }
  return [
    { label: t.value.nav.about,    href: '#sobre'    },
    { label: t.value.nav.projects, href: '#projetos' },
    { label: t.value.nav.contact,  href: '#contato'  },
    { label: t.value.nav.home,     to: '/'           },
  ]
})

// Each page has its own pair of themes; the toggle names the one you'd switch to.
const THEME_LABELS = {
  home:     { toLight: 'Light — Tema café',  toDark: 'Dark — Tema noite' },
  frontend: { toLight: 'Light — Vue.js',     toDark: 'Dark — VS Code' },
  backend:  { toLight: 'Light — React',      toDark: 'Dark — .NET' },
}
const themeLabel = computed(() => {
  const labels = THEME_LABELS[route.name] ?? THEME_LABELS.home
  return isDark.value ? labels.toLight : labels.toDark
})

const menuOpen = ref(false)
function toggleMenu() { menuOpen.value = !menuOpen.value }
function closeMenu()  { menuOpen.value = false }
</script>

<template>
  <nav class="app-nav" :class="{ 'menu-open': menuOpen }">
    <RouterLink v-if="!isHome" to="/" class="nav-logo" @click="closeMenu">MI.</RouterLink>
    <a v-else href="#hero" class="nav-logo" @click="closeMenu">MI.</a>

    <!-- Desktop links -->
    <ul class="nav-links">
      <li v-for="link in navLinks" :key="link.href || link.to" :class="{ 'is-page': link.page }">
        <RouterLink v-if="link.to" :to="link.to">{{ link.label }}<span v-if="link.page" class="nav-page-arrow" aria-hidden="true">↗</span></RouterLink>
        <a v-else :href="link.href">{{ link.label }}</a>
      </li>
    </ul>

    <!-- Right: theme toggle + locale toggle + hamburger -->
    <div class="nav-right">

      <!-- Theme toggle -->
      <button
        class="theme-toggle"
        @click="themeStore.toggle"
        :aria-label="themeLabel"
      >
        <span class="theme-icon">
          <!-- Sun (light mode) -->
          <svg v-if="isDark" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
          </svg>
          <!-- Moon (dark mode) -->
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </span>
        <span class="theme-label">{{ themeLabel }}</span>
      </button>

      <!-- Divider -->
      <span class="nav-divider" aria-hidden="true">|</span>

      <!-- Locale toggle -->
      <button
        class="locale-toggle"
        @click="locale.toggle"
        :aria-label="`PT / EN — ${locale.locale === 'pt-BR' ? 'Switch to English' : 'Mudar para português'}`"
      >
        <span :class="{ active: locale.locale === 'pt-BR' }">PT</span>
        <span class="locale-divider">/</span>
        <span :class="{ active: locale.locale === 'en' }">EN</span>
      </button>

      <!-- Mobile hamburger -->
      <button
        class="nav-hamburger"
        :class="{ open: menuOpen }"
        @click="toggleMenu"
        aria-label="Abrir menu"
      >
        <span /><span /><span />
      </button>
    </div>

    <!-- Backdrop -->
    <Transition name="fade">
      <div v-if="menuOpen" class="nav-backdrop" @click="closeMenu" />
    </Transition>

    <!-- Mobile drawer -->
    <Transition name="drawer">
      <div v-if="menuOpen" class="nav-drawer">
        <ul>
          <li v-for="link in navLinks" :key="link.href || link.to" :class="{ 'is-page': link.page }">
            <RouterLink v-if="link.to" :to="link.to" @click="closeMenu">{{ link.label }}<span v-if="link.page" aria-hidden="true"> ↗</span></RouterLink>
            <a v-else :href="link.href" @click="closeMenu">{{ link.label }}</a>
          </li>
        </ul>

        <!-- Toggles inside drawer -->
        <div class="drawer-toggles">
          <button class="theme-toggle theme-toggle--drawer" @click="themeStore.toggle">
            <span class="theme-icon">
              <svg v-if="isDark" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </span>
            {{ themeLabel }}
          </button>

          <button class="locale-toggle locale-toggle--drawer" @click="locale.toggle">
            <span :class="{ active: locale.locale === 'pt-BR' }">PT</span>
            <span class="locale-divider">/</span>
            <span :class="{ active: locale.locale === 'en' }">EN</span>
          </button>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.app-nav {
  position: fixed; top: 0; left: 0; right: 0;
  z-index: 100;
  padding: 1.5rem 3rem;
  display: flex; justify-content: space-between; align-items: center;
  /* mix-blend-mode: multiply; */
}
.app-nav.menu-open { mix-blend-mode: normal; }

.nav-logo {
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem; font-weight: 900; letter-spacing: -0.02em;
  color: var(--color-text); text-decoration: none;
  position: relative; z-index: 101;
}

.nav-links {
  display: flex; gap: 2.5rem; list-style: none; padding: 0; margin: 0;
}
.nav-links a {
  font-family: 'DM Mono', monospace; font-size: 0.75rem;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--color-text-muted); text-decoration: none; transition: color 0.2s;
}
.nav-links a:hover { color: var(--color-error); }

/* links to the specialised portfolios: set apart from the in-page anchors */
.nav-links li.is-page a { color: var(--color-link); }
.nav-links li.is-page a:hover { color: var(--color-error); }
.nav-links li:not(.is-page) + li.is-page {
  padding-left: 2.5rem;
  border-left: 1px solid color-mix(in srgb, var(--color-text-muted) 35%, transparent);
}
.nav-page-arrow {
  display: inline-block;
  margin-left: 0.3em;
  transition: transform 0.2s ease;
}
.nav-links li.is-page a:hover .nav-page-arrow { transform: translate(2px, -2px); }
@media (max-width: 1240px) {
  .nav-links { gap: 1.5rem; }
  .nav-links li:not(.is-page) + li.is-page { padding-left: 1.5rem; }
}
/* not enough room before the hamburger kicks in: the home's portfolio section links there */
@media (max-width: 960px) {
  .nav-links li.is-page { display: none; }
}

/* ── Right group ── */
.nav-right {
  display: flex; align-items: center; gap: 1rem;
  position: relative; z-index: 101;
}

.nav-divider {
  font-family: 'DM Mono', monospace;
  font-size: 0.65rem; color: var(--color-text-muted); opacity: 0.3;
  user-select: none;
}

/* ── Theme toggle ── */
.theme-toggle {
  display: flex; align-items: center; gap: 0.5rem;
  background: none; border: none; cursor: pointer; padding: 0;
  font-family: 'DM Mono', monospace; font-size: 0.68rem;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--color-text-muted);
  white-space: nowrap;
}
.theme-toggle:hover { color: var(--color-accent1); }
.theme-icon {
  display: flex; align-items: center;
  color: var(--color-accent1);
  flex-shrink: 0;
}

/* ── Locale toggle ── */
.locale-toggle {
  display: flex; align-items: center; gap: 0.3rem;
  background: none; border: none; cursor: pointer; padding: 0;
  font-family: 'DM Mono', monospace; font-size: 0.7rem;
  letter-spacing: 0.12em; color: var(--color-text-muted);
}
.locale-toggle span       { transition: color 0.2s; }
.locale-toggle span.active { color: var(--color-text); font-weight: 600; }
.locale-toggle:hover span  { color: var(--color-accent1); }
.locale-divider            { opacity: 0.4; }

/* ── Hamburger ── */
.nav-hamburger {
  display: none; flex-direction: column; justify-content: space-between;
  width: 24px; height: 18px; background: none; border: none;
  cursor: pointer; padding: 0;
}
.nav-hamburger span {
  display: block; width: 100%; height: 1.5px;
  background: var(--color-text); transform-origin: center;
}
.nav-hamburger.open span:nth-child(1) { transform: translateY(8.25px) rotate(45deg); }
.nav-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.nav-hamburger.open span:nth-child(3) { transform: translateY(-8.25px) rotate(-45deg); }

/* ── Backdrop ── */
.nav-backdrop {
  position: fixed; inset: 0;
  background: rgba(13, 15, 20, 0.6);
  backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
  z-index: 99;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from,   .fade-leave-to     { opacity: 0; }

/* ── Drawer ── */
.nav-drawer {
  position: fixed; inset: 0;
  background: var(--color-bg);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  z-index: 100; mix-blend-mode: normal;
}
.nav-drawer ul {
  list-style: none; padding: 0; margin: 0;
  text-align: center; display: flex; flex-direction: column; gap: 2.5rem;
}
.nav-drawer a {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 8vw, 3rem); font-weight: 700;
  color: var(--color-text); text-decoration: none;
  display: block; transition: color 0.2s;
}
.nav-drawer a:hover { color: var(--color-error); }
/* "safe" keeps the top items reachable when the list is taller than a short phone */
.nav-drawer { overflow-y: auto; padding-block: 5rem 2rem; justify-content: safe center; }
.nav-drawer:has(li.is-page) ul { gap: 1.6rem; }
.nav-drawer li.is-page a {
  font-family: 'DM Mono', monospace;
  font-size: 0.95rem; font-weight: 400;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--color-link);
}
.nav-drawer li:not(.is-page) + li.is-page {
  margin-top: 0.6rem; padding-top: 1.6rem;
  border-top: 1px solid color-mix(in srgb, var(--color-text-muted) 30%, transparent);
}

.drawer-toggles {
  display: flex; flex-direction: column;
  align-items: center; gap: 1.25rem;
  margin-top: 3rem;
}

.theme-toggle--drawer {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}
.locale-toggle--drawer {
  font-size: 1rem; letter-spacing: 0.15em;
}
.locale-toggle--drawer span.active { color: var(--color-text); }

.drawer-enter-active, .drawer-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.drawer-enter-from,   .drawer-leave-to     { opacity: 0; transform: translateY(-12px); }

/* ── Tablet ── */
@media (max-width: 1024px) {
  .app-nav { padding: 1.25rem 2rem; }
  /* Hide theme label text on tablet, keep icon only */
  .theme-label { display: none; }
}
@media (max-width: 768px) {
  .app-nav       { padding: 1.25rem 1.5rem; }
  .nav-links     { display: none; }
  .nav-hamburger { display: flex; }
  .theme-toggle:not(.theme-toggle--drawer) { display: none; }
  .locale-toggle:not(.locale-toggle--drawer) { display: none; }
  .nav-divider   { display: none; }
}
</style>
