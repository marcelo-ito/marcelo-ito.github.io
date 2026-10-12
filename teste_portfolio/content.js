/**
 * Conteúdo do deck, em um só lugar.
 * Espelha src/locales/pt-BR.json — trocar por useLocaleStore() na hora de migrar.
 */

export const slides = [
  { id: 'hero',        num: '01', label: 'Início'      },
  { id: 'sobre',       num: '02', label: 'Sobre'       },
  { id: 'projetos',    num: '03', label: 'Projetos'    },
  { id: 'skills',      num: '04', label: 'Skills'      },
  { id: 'experiencia', num: '05', label: 'Experiência' },
  { id: 'contato',     num: '06', label: 'Contato'     },
]

export const about = {
  eyebrow: 'Sobre mim',
  title1: 'Código com',
  title2: 'propósito',
  title3: 'e cuidado',
  photo: '/assets/images/photo.jpg',
  photoAlt: 'Foto de Marcelo Ito',
  bio: [
    'Minha carreira na área da tecnologia se inicia no curso de Ciência da Computação, posteriormente direcionada para Análise e Desenvolvimento de Sistemas. Paralelamente, busquei aprimorar meus conhecimentos por meio de cursos, blogs, artigos especializados e principalmente no desenvolvimento de projetos pessoais.',
    'A partir daí, fui contratado para atuar como Quality Assurance atuando na garantia da qualidade de sistemas por meio de análises detalhadas e testes automatizados, ao qual eu fui responsável pelo desenvolvimento do projeto. Permaneci nessa função por quase quatro anos, consolidando uma base sólida em boas práticas, testes e automação, e qualidade de software.',
    'Após esta jornada, tive a oportunidade de atuar como desenvolvedor fullstack júnior, posição em que estou atualmente.',
  ],
  stats: [
    { value: '+3', label: 'Anos de QA'  },
    { value: 'Vue', label: '+ .NET'     },
    { value: '∞',  label: 'Curiosidade' },
  ],
  cv: { label: 'Download CV', href: '/cv-marcelo-ito.pdf', file: 'CV-Marcelo-Ito.pdf' },
}

export const projects = {
  featuredLabel: '✦ Projeto principal',
  items: [
    {
      name: 'Minoru',
      description: 'Aplicação full-stack de produtividade e finanças pessoais. Blog, Kanban, finanças, sessões de estudo com IA, autenticação Google OAuth e geração de PDFs.',
      tags: ['.NET 9', 'Vue 3', 'PostgreSQL', 'Gemini AI', 'Vuetify', 'QuestPDF'],
      featured: true,
    },
    {
      name: 'RAG Engine',
      description: 'Sistema de retrieval-augmented generation com Sentence-BERT, FAISS e Gemini API.',
      tags: ['Python', 'FAISS', 'Gemini'],
    },
    {
      name: 'NLP Pipeline',
      description: 'Classificação de texto com TF-IDF, Naive Bayes, SVM e fine-tuning de DistilBERT.',
      tags: ['BERT', 'sklearn', 'HuggingFace'],
    },
    {
      name: 'Email Notifier',
      description: 'Sistema de notificações com MailKit e Hangfire para agendamento de tarefas em background.',
      tags: ['MailKit', 'Hangfire', '.NET'],
    },
    {
      name: 'Discord Bot',
      description: 'Bot pessoal que lembra do Duolingo e envia as últimas notícias do Correio Braziliense via API NewsData.',
      tags: ['.NET'],
    },
    {
      name: 'Arrecadação Federal 2000–2024',
      description: 'Análise exploratória dos dados de arrecadação de impostos federais no Brasil, com tendências por estado e por ano.',
      tags: ['Python', 'Numpy', 'Pandas', 'Seaborn'],
    },
  ],
}

export const skills = [
  {
    title: 'Backend',
    items: ['C# · ASP.NET Core', 'Entity Framework', 'Java · Spring Boot', 'Node · Express', 'REST APIs'],
  },
  {
    title: 'Frontend',
    items: ['Vue 3', 'React', 'Bootstrap', 'JavaScript', 'GSAP', 'Vite', 'Axios'],
  },
  {
    title: 'AI & Machine Learning',
    items: ['Python', 'scikit-learn', 'HuggingFace', 'BERT / DistilBERT', 'Gemini API', 'FAISS', 'LangGraph', 'RAG'],
  },
  {
    title: 'Database',
    items: ['PostgreSQL', 'SQL Server'],
  },
  {
    title: 'Tools',
    items: ['Git', 'GitHub', 'Docker', 'Cypress', 'Jupyter', 'VS Code', 'Postman', 'Swagger UI'],
  },
]

export const experience = {
  currentLabel: 'Atual',
  items: [
    {
      period: '10/2021 — 06/2025',
      company: 'Skychart',
      role: 'Analista de Qualidade de Software',
      tags: ['Cypress', 'Git', 'Python', 'SQL Server'],
      bullets: [
        'Colaboração com times de desenvolvimento na validação, análise e melhoria contínua de sistemas.',
        'Testes manuais e apoio à automação com Cypress, sustentando a estabilidade das aplicações.',
        'Análise de demandas e problemas reportados por clientes, com proposição de soluções.',
        'Manipulação de dados em SQL, incluindo correções e validações a partir de APIs externas.',
        'Scripts e bots para automação de tarefas repetitivas, otimizando processos internos.',
        'Participação em reuniões técnicas, sugerindo melhorias em fluxos e qualidade.',
      ],
    },
    {
      period: '07/2025 — hoje',
      company: 'Triveni Holding',
      role: 'Fullstack Developer',
      tags: ['.NET', 'Vue 3', 'PostgreSQL', 'Git', 'Docker'],
      current: true,
      bullets: [
        'Desenvolvimento e manutenção de aplicações web com Vue.js e .NET + Entity Framework.',
        'Versionamento com Git e uso de Docker para padronizar ambientes de desenvolvimento.',
        'Manutenção e refatoração contínua, com foco em legibilidade e boas práticas.',
        'Análise de qualidade de código com SonarQube.',
        'Ambiente ágil com Scrum, organizando entregas contínuas.',
        'Suporte e evolução de sistemas usados por diferentes empresas do grupo.',
      ],
    },
  ],
}

export const contact = {
  eyebrow: '✦ Vamos conversar',
  title1: 'Pronto para',
  title2: 'criar algo',
  title3: 'incrível?',
  email: 'marcelo-ito@hotmail.com',
  links: [
    { label: 'GitHub',   href: 'https://github.com/marcelo-ito' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/marcelo-ito-/' },
  ],
}
