# teste_portfolio

Área de testes do portfólio em formato **apresentação de slides**: seis seções,
uma por tela, com scroll suave, snap entre slides e as animações tocando a cada
vez que você chega numa seção.

Nada aqui é importado pelo app principal (`src/`) — dá para quebrar à vontade.

## Como ver

```bash
npm run dev
```

Depois abrir `http://localhost:5173/teste_portfolio/preview.html`.

Navegação: **scroll**, **setas ↑ ↓**, **PageUp/PageDown**, **Home/End**, ou os
**dots** na lateral direita. O botão *Tema* no canto alterna claro/escuro.

## Arquivos

| Arquivo | O que é |
| --- | --- |
| `preview.html` | Entrada do Vite que monta o deck inteiro |
| `DeckApp.vue` | Shell: snap-scroll, dots laterais, barra de progresso, contador, teclado |
| `deck.css` | Estilos globais compartilhados (slide, fundo animado, cabeçalho, revelação) |
| `content.js` | Todo o conteúdo em um só lugar (espelha `src/locales/pt-BR.json`) |
| `useSlide.js` | Helpers: revelação por slide, parallax de mouse, botões magnéticos, flutuação |
| `TesteHeroSection.vue` | Slide 01 — hero |
| `sections/SlideBg.vue` | Camadas de fundo (blobs, grid, grão) reusadas por todos |
| `sections/*Slide.vue` | Slides 02 a 06 |
| `index.html` | Demo **standalone** só da hero, sem build e sem dependências |

## Os seis slides

| # | Slide | Destaques de animação |
| --- | --- | --- |
| 01 | Hero | Nome letra a letra, máquina de escrever, anéis em órbita, núcleo com morph |
| 02 | Sobre | Foto entrando pela lateral, bio com painel rolável, stats e CV magnético |
| 03 | Projetos | Grid 3×2 de cards de vidro em cascata, brilho radial no hover |
| 04 | Skills | Cinco grupos em cascata, linha que desenha, badges em stagger rápido |
| 05 | Experiência | Trilho que se desenha, nós que estouram, bullets entrando um a um |
| 06 | Contato | Título revelado linha a linha por máscara, órbita de fundo, links magnéticos |

## Como funciona

**Revelação por slide.** Cada seção monta uma timeline GSAP pausada e um
`IntersectionObserver` a dispara quando o slide entra em tela. Ao sair, a
timeline volta ao início — por isso a animação toca de novo a cada visita, que é
o comportamento esperado numa apresentação.

**Scroll.** `scroll-snap-type: y mandatory` no `html` mais `scroll-behavior: smooth`.
Cada slide ocupa exatamente `100dvh`, então nunca sobra meia seção na tela. O
scroller é o documento (não um container), o que mantém o ScrollTrigger da hero
funcionando sem `scrollerProxy`.

**Conteúdo longo.** A bio e os bullets de experiência rolam dentro do próprio
card (`.scroll-pane`, com `overscroll-behavior: contain`), sem quebrar o snap do
deck. No mobile esses painéis voltam a ser texto corrido.

**Convenção de revelação.** Elementos marcados com `data-reveal="up|left|right|scale"`
começam escondidos via CSS e entram em stagger — uma linha por slide na timeline.

## Acessibilidade e performance

- `prefers-reduced-motion: reduce` desliga as animações, mostra tudo no estado
  final e troca o scroll suave por instantâneo.
- Parallax e botões magnéticos só ligam em ponteiro fino (`hover: hover`).
- Parallax usa `x/y` e as flutuações usam `yPercent`, para as duas coisas somarem
  em vez de disputarem a mesma propriedade.
- Cada slide vive dentro de um `gsap.context()` e é revertido no `onBeforeUnmount`.
- No mobile o snap vira `proximity`, os slides podem crescer e o deck volta a ser
  uma página normal.
- Em notebooks de 720p há um bloco `@media (max-height: 860px)` que aperta
  paddings para os slides continuarem cabendo em uma tela.

## Migrar para o app

O deck não depende de nada em `src/`. Para levar para o portfólio de verdade:

1. Mover `sections/`, `useSlide.js` e `deck.css` para dentro de `src/`.
2. Trocar os imports de `content.js` por `useLocaleStore()` — os textos já estão
   separados do markup, então é substituição direta.
3. Importar `deck.css` no `App.vue` e trocar as seções atuais pelas novas.

Só um ajuste de dados: o link do CV aqui aponta para `/cv-marcelo-ito.pdf`, que é
onde o arquivo realmente está em `public/`. O `AboutSection.vue` atual usa
`/assets/cv-marcelo-ito.pdf`, caminho que não existe.
