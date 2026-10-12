import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import vuetify from 'vite-plugin-vuetify'

const SITE = 'https://marcelo-ito.github.io'

const ROUTE_PAGES = [
  {
    route: 'frontend',
    view: 'src/views/FrontendView.vue',
    title: 'Marcelo Ito — Desenvolvedor Frontend',
    description:
      'Marcelo Ito, desenvolvedor frontend: sites e landing pages bonitos, rápidos e acessíveis com Vue, React, GSAP e Three.js.',
  },
  {
    route: 'backend',
    view: 'src/views/BackendView.vue',
    title: 'Marcelo Ito — Desenvolvedor Backend',
    description:
      'Marcelo Ito, desenvolvedor backend: APIs e sistemas com .NET, Java/Spring Boot e Node.js, PostgreSQL, mensageria, Docker e Kubernetes.',
    // the portrait is the LCP element on mobile: start fetching it with the HTML, not after
    // the app has rendered (must match the <img> srcset/sizes in BackendHero.vue)
    extraHead: [
      '<link rel="preload" as="image" type="image/webp" fetchpriority="high"' +
        ' href="/assets/images/avatar-portrait-400.webp"' +
        ' imagesrcset="/assets/images/avatar-portrait-400.webp 400w, /assets/images/avatar-portrait-600.webp 600w"' +
        ' imagesizes="(max-width: 900px) 220px, 300px">',
    ],
  },
]

/**
 * Writes dist/<route>/index.html for every page besides the home:
 *  - static hosts (GitHub Pages) have no SPA fallback, so a direct visit to /frontend
 *    would 404 without a real file there;
 *  - the page's own chunk and CSS are preloaded from the HTML, instead of being discovered
 *    only after the entry script runs (one network round trip less before the LCP);
 *  - title, description and Open Graph tags match the page for crawlers and link previews.
 */
function routePages() {
  let base = '/'
  return {
    name: 'route-pages',
    apply: 'build',
    enforce: 'post',
    configResolved(config) {
      base = config.base
    },
    writeBundle(options, bundle) {
      const outDir = options.dir
      const html = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8')

      for (const page of ROUTE_PAGES) {
        const chunk = Object.values(bundle).find(
          (c) => c.type === 'chunk' && c.facadeModuleId?.replaceAll('\\', '/').endsWith(page.view),
        )
        if (!chunk) throw new Error(`route-pages: no chunk found for ${page.view}`)

        // the page chunk plus every chunk it statically imports (e.g. components shared by
        // several pages), minus whatever the root HTML already preloads
        const chunks = []
        const visit = (c) => {
          if (!c || chunks.includes(c)) return
          chunks.push(c)
          for (const name of c.imports ?? []) visit(bundle[name])
        }
        visit(chunk)
        const js = chunks.map((c) => c.fileName).filter((f) => !html.includes(f))
        const css = [...new Set(chunks.flatMap((c) => [...(c.viteMetadata?.importedCss ?? [])]))].filter(
          (f) => !html.includes(f),
        )
        const preload = [
          ...(page.extraHead ?? []),
          ...js.map((f) => `<link rel="modulepreload" crossorigin href="${base}${f}">`),
          ...css.map((f) => `<link rel="stylesheet" crossorigin href="${base}${f}">`),
        ]
        const url = `${SITE}/${page.route}`
        const out = html
          .replace(/<title>[^<]*<\/title>/, `<title>${page.title}</title>`)
          .replace(/(<meta name="description" content=")[^"]*/, `$1${page.description}`)
          .replace(/(<meta property="og:title"\s+content=")[^"]*/, `$1${page.title}`)
          .replace(/(<meta property="og:description" content=")[^"]*/, `$1${page.description}`)
          .replace(/(<meta property="og:url"\s+content=")[^"]*/, `$1${url}`)
          .replace(/(<meta name="twitter:title"\s+content=")[^"]*/, `$1${page.title}`)
          .replace(/(<meta name="twitter:description" content=")[^"]*/, `$1${page.description}`)
          .replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`)
          .replace('</head>', `  ${preload.join('\n  ')}\n</head>`)

        fs.mkdirSync(path.join(outDir, page.route), { recursive: true })
        fs.writeFileSync(path.join(outDir, page.route, 'index.html'), out)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vuetify({ autoImport: true }),
    vueDevTools(),
    routePages(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
