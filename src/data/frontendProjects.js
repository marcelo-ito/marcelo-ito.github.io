// Language-independent data for the /frontend carousel. Texts live in the locale files
// under frontendPage.projects.items[id]. Screenshots were captured from each project's own
// production build (see public/assets/projects/).

export const frontendProjects = [
  {
    id: 'sofia-lune',
    concept: true,
    frame: 'browser',
    folder: 'sofia-lune-portfolio',
    image: { base: '/assets/projects/sofia-lune', width: 1280, height: 800 },
    stack: ['React 19', 'Tailwind 4', 'GSAP', 'Three.js', 'Lenis'],
  },
  {
    id: 'kaori-vex',
    concept: true,
    frame: 'browser',
    folder: 'cosplay-portfolio',
    image: { base: '/assets/projects/kaori-vex', width: 1280, height: 800 },
    stack: ['Vue 3', 'TypeScript', 'Vite', 'Vue Router', 'CSS puro'],
  },
  {
    id: 'portfolio-imersivo',
    frame: 'browser',
    folder: 'portfolio-imersivo',
    image: { base: '/assets/projects/portfolio-imersivo', width: 1280, height: 800 },
    stack: ['React 19', 'TypeScript', 'Three.js', 'React Three Fiber', 'GSAP'],
  },
  {
    id: 'xadrez-3d',
    frame: 'browser',
    folder: 'xadrez-3d',
    image: { base: '/assets/projects/xadrez-3d', width: 1280, height: 720 },
    stack: ['React 19', 'TypeScript', 'Three.js', 'React Three Fiber', 'Playwright'],
  },
  {
    id: 'cards-game',
    frame: 'phone',
    folder: 'cards-game',
    image: { base: '/assets/projects/cards-game', width: 800, height: 1640, sizes: [400, 800] },
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'Supabase Realtime'],
  },
  {
    id: 'memory-gallery',
    frame: 'browser',
    folder: 'memory-gallery',
    image: { base: '/assets/projects/memory-gallery', width: 1280, height: 800 },
    stack: ['React 19', 'TypeScript', 'Tailwind 4', 'IndexedDB', 'Vitest'],
  },
]
