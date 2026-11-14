export type Lang = "es" | "en"
export type T = Record<Lang, string>

export const CONTACT = {
  name: "Camilo Meza Ytuarte",
  email: "mezaytuartec@gmail.com",
  phoneDisplay: "+54 9 266 504 8562",
  whatsapp: "https://wa.me/5492665048562",
}

export type Project = {
  id: "peec" | "mico" | "palette"
  year: string
  name: string
  accent: string
  kicker: T
  summary: T
  challenge: T
  approach: T
  note: T
  credits: T
  tags: string[]
  video: string
  preview: string
  poster: string
}

const credits = (extra?: T): T => ({
  es:
    "Concepto, dirección y animación: Camilo Meza Ytuarte." +
    (extra ? " " + extra.es : "") +
    " Entregado en 16:9, con versiones 9:16 y 1:1.",
  en:
    "Concept, direction and animation: Camilo Meza Ytuarte." +
    (extra ? " " + extra.en : "") +
    " Delivered in 16:9, with 9:16 and 1:1 versions.",
})

export const PROJECTS: Project[] = [
  {
    id: "peec",
    year: "2026",
    name: "Peec AI",
    accent: "#3ddc84",
    kicker: { es: "Video de lanzamiento", en: "Launch video" },
    summary: {
      es: "Un video de lanzamiento para Peec AI, una plataforma que mide cómo aparecen las marcas en ChatGPT, Perplexity y Gemini.",
      en: "A launch video for Peec AI, a platform that tracks how brands show up in ChatGPT, Perplexity and Gemini.",
    },
    challenge: {
      es: "Peec AI mide cómo aparecen las marcas dentro de ChatGPT, Perplexity y Gemini. Es difícil llevar eso a un video de lanzamiento, porque el producto rastrea algo que nadie puede ver. El objetivo era hacer tangible esa visibilidad en 30 segundos, para los equipos de marketing y SEO que recién empiezan a hacerse la pregunta.",
      en: "Peec AI measures how brands show up inside ChatGPT, Perplexity and Gemini. That is hard to turn into a launch video, because the product tracks something nobody can see. The goal was to make that visibility tangible in 30 seconds, for the marketing and SEO teams just starting to ask the question.",
    },
    approach: {
      es: "El video parte del comprador, no del producto: abre con una pregunta escrita en un prompt de IA y muestra las respuestas que vuelven sin la marca protagonista, así el producto llega como la respuesta a algo que el espectador ya sintió. La visibilidad se vuelve un número que sube y un ranking que se reordena, una mejora que se ve suceder en lugar de contarse. Respeta la sobriedad de la marca: la identidad de Peec es monocromática, así que un único color de acento aparece solo cuando los números mejoran, y el color pasa a ser una señal y no una decoración. El montaje sigue el ritmo de la banda sonora.",
      en: "The video starts from the buyer, not the product: it opens on a question typed into an AI prompt and shows the answers coming back without the brand in them, so the product arrives as the answer to something the viewer already felt. Visibility becomes a number that climbs and a ranking that reorders itself, an improvement you watch happen instead of being told about. It respects the brand’s restraint: Peec’s identity is monochrome, so a single accent color appears only when the numbers improve, and color becomes a signal rather than decoration. The edit follows the soundtrack.",
    },
    note: {
      es: "Pieza conceptual independiente, no encargada por ni afiliada a Peec AI. Marcas ficticias, datos ilustrativos.",
      en: "Independent concept piece, not commissioned by or affiliated with Peec AI. Fictional brands, illustrative data.",
    },
    credits: credits(),
    tags: ["2026", "30s", "16:9 · 9:16 · 1:1"],
    video: "/work/peec.mp4",
    preview: "/work/peec-preview.mp4",
    poster: "/work/peec.webp",
  },
  {
    id: "mico",
    year: "2026",
    name: "Mico",
    accent: "#8b6cff",
    kicker: { es: "Video de lanzamiento", en: "Launch video" },
    summary: {
      es: "Un video de lanzamiento para Mico, un cuaderno de reuniones para equipos hispanohablantes que graba sin que un bot entre a la llamada.",
      en: "A launch video for Mico, a meeting notebook for Spanish-speaking teams that records without a bot joining the call.",
    },
    challenge: {
      es: "Mico es un cuaderno de reuniones para equipos hispanohablantes que graba sin que un bot entre a la llamada. Las herramientas de notas de reuniones se parecen en una demo, así que el video debía mostrar qué hace diferente a esta, y el costo del problema que resuelve, en 30 segundos.",
      en: "Mico is a meeting notebook for Spanish-speaking teams that records without a bot joining the call. Meeting-notes tools all look alike in a demo, so the video had to show what makes this one different, and the cost of the problem it solves, in 30 seconds.",
    },
    approach: {
      es: "El diferenciador se dramatiza: la escena del problema muestra el momento incómodo en que un bot de notas pide entrar, y la escena del producto responde con “nadie entra a la llamada”. Un solo número carga la historia, un contador de compromisos sin responsable que sube al inicio y vuelve a cero en el remate, así el valor se lee como un cambio en algo que el espectador ya entendía. La conversación en bruto se ordena en pantalla en decisiones y compromisos con responsables, de modo que el resultado se ve, no se describe. El texto en pantalla está en español porque el producto es español primero, y el look sale de la propia identidad de Mico (papel cálido, acento violeta, toques dibujados a mano), evitando a propósito el default oscuro y técnico de la mayoría de los lanzamientos SaaS. La cámara se mantiene cerca del detalle que importa, para que el video funcione en formatos vertical y cuadrado.",
      en: "The differentiator is dramatized: the problem scene shows the awkward moment a notes bot asks to join, and the product scene answers with “no one joins the call.” A single number carries the story, a counter of ownerless commitments that climbs at the start and drops back to zero at the payoff, so the value reads as a change in something the viewer already understood. The raw conversation sorts itself on screen into decisions and commitments with owners, so the result is shown, not described. On-screen copy is in Spanish because the product is Spanish-first, and the look comes from Mico’s own identity (warm paper, violet accent, hand-drawn touches), deliberately avoiding the dark, technical default of most SaaS launches. The camera stays close to the detail that matters, so the video holds up in vertical and square formats.",
    },
    note: {
      es: "Pieza conceptual independiente, no encargada por ni afiliada a Mico. Elementos de interfaz y marca recreados a partir de materiales públicos.",
      en: "Independent concept piece, not commissioned by or affiliated with Mico. Interface and brand elements recreated from public materials.",
    },
    credits: credits(),
    tags: ["2026", "30s", "16:9 · 9:16 · 1:1"],
    video: "/work/mico.mp4",
    preview: "/work/mico-preview.mp4",
    poster: "/work/mico.webp",
  },
  {
    id: "palette",
    year: "2026",
    name: "Palette",
    accent: "#ff7a3d",
    kicker: { es: "Video de lanzamiento", en: "Launch video" },
    summary: {
      es: "Un video de lanzamiento para Palette, una app donde equipos enteros trabajan con agentes de IA sobre las carpetas que ya comparten.",
      en: "A launch video for Palette, an app where whole teams work with AI agents on the folders they already share.",
    },
    challenge: {
      es: "Palette permite que equipos enteros trabajen con agentes de IA como Claude Code, Codex o Gemini sobre las carpetas que ya comparten, y revisen los cambios antes de guardarlos. Su valor no está en lo que hace un agente, sino en lo que pasa entre personas, y eso no aparece en una captura de pantalla. El objetivo era mostrar en 30 segundos por qué no alcanza con que cada uno trabaje con su agente por su lado. El video apunta a equipos de producto, marketing y operaciones que empezaron a usar IA de a una persona a la vez.",
      en: "Palette lets whole teams work with AI agents like Claude Code, Codex or Gemini on the folders they already share, and review changes before saving them. Its value isn’t in what an agent does but in what happens between people, and that doesn’t show up in a screenshot. The goal was to show in 30 seconds why it isn’t enough for everyone to work with their own agent on the side. The video targets product, marketing and operations teams that started using AI one person at a time.",
    },
    approach: {
      es: "El video arranca con algo que el espectador ya vivió: cuatro compañeros, cada uno con su propio agente, y copias del mismo brief que se multiplican hasta que un contador marca siete versiones de la verdad. En el drop de la música todo colapsa en una sola carpeta que se convierte en la app, así el producto llega como el lugar donde ese desorden se ordena. El hilo visual es la construcción: tarjetas que nacen de una línea, una ventana que se arma por capas, archivos que viajan hacia la carpeta compartida y un logo cuyas letras salen de detrás del ícono. La revisión antes de guardar, el diferenciador más concreto del producto, tiene su propia escena. El naranja de Palette aparece solo en lo nuevo, sobre la paleta cálida de su sitio, y el montaje sigue el pulso de la canción. Antes del cierre, en lugar de cortarla, un filtro la apaga y la abre de golpe con el logo.",
      en: "The video opens on something the viewer has already lived: four teammates, each with their own agent, and copies of the same brief multiplying until a counter hits seven versions of the truth. On the music’s drop everything collapses into a single folder that becomes the app, so the product arrives as the place where that mess gets sorted. The visual thread is construction: cards born from a line, a window that assembles in layers, files traveling into the shared folder, and a logo whose letters slide out from behind the icon. Review-before-save, the product’s most concrete differentiator, gets a scene of its own. Palette’s orange appears only on what’s new, over the warm palette of its site, and the edit follows the pulse of the song. Before the close, instead of cutting the track, a filter muffles it and then bursts it open with the logo.",
    },
    note: {
      es: "Pieza conceptual independiente, no encargada por ni afiliada a Palette. Empresa y nombres ficticios, datos ilustrativos.",
      en: "Independent concept piece, not commissioned by or affiliated with Palette. Fictional company and names, illustrative data.",
    },
    credits: credits({
      es: "Voz en off y efectos con ElevenLabs.",
      en: "Voiceover and sound effects with ElevenLabs.",
    }),
    tags: ["2026", "30s", "16:9 · 9:16 · 1:1"],
    video: "/work/palette.mp4",
    preview: "/work/palette-preview.mp4",
    poster: "/work/palette.webp",
  },
]

export const UI = {
  nav: {
    work: { es: "Trabajos", en: "Work" },
    services: { es: "Qué hago", en: "What I do" },
    contact: { es: "Contacto", en: "Contact" },
  },
  hero: {
    available: { es: "Disponible para nuevos proyectos", en: "Available for new projects" },
    hello: { es: "Hola, soy Camilo.", en: "Hi, I’m Camilo." },
    titleA: { es: "Hago", en: "I do" },
    titleEm: { es: "motion design", en: "motion design" },
    titleB: { es: "para empresas SaaS.", en: "for SaaS companies." },
    sub: {
      es: "Videos de lanzamiento, animación de producto y piezas para redes. Acá te dejo algunos de mis trabajos recientes.",
      en: "Launch videos, product animation and social cuts. Here are some of my recent projects.",
    },
    ctaWork: { es: "Ver trabajos", en: "See my work" },
    ctaTalk: { es: "Contacto", en: "Get in touch" },
  },
  marquee: {
    es: ["Videos de lanzamiento", "Animación de producto", "Motion de interfaz", "Piezas para redes", "Explainers", "16:9 · 9:16 · 1:1"],
    en: ["Launch videos", "Product animation", "UI motion", "Social cuts", "Explainers", "16:9 · 9:16 · 1:1"],
  },
  work: {
    label: { es: "Trabajos", en: "Work" },
    title: { es: "Trabajos recientes", en: "Recent work" },
    sub: {
      es: "Una selección de proyectos. Si querés ver más, escribime y te paso otros.",
      en: "A selection of projects. If you’d like to see more, get in touch and I’ll send you others.",
    },
    challenge: { es: "El desafío", en: "The challenge" },
    approach: { es: "La idea", en: "The idea" },
    play: { es: "Ver con sonido", en: "Watch with sound" },
    readMore: { es: "Leer más", en: "Read more" },
    readLess: { es: "Leer menos", en: "Read less" },
    more: { es: "¿Querés ver más trabajos?", en: "Want to see more work?" },
    moreCta: { es: "Pedímelos", en: "Ask me" },
  },
  services: {
    label: { es: "Qué hago", en: "What I do" },
    title: { es: "En qué te puedo ayudar", en: "How I can help" },
    items: [
      {
        t: { es: "Videos de lanzamiento", en: "Launch videos" },
        d: {
          es: "Piezas cortas para presentar un producto o una función nueva.",
          en: "Short pieces to introduce a product or a new feature.",
        },
      },
      {
        t: { es: "Animación de producto", en: "Product animation" },
        d: {
          es: "La interfaz de tu app, animada para la web, demos y presentaciones.",
          en: "Your app’s interface, animated for your site, demos and decks.",
        },
      },
      {
        t: { es: "Versiones para redes", en: "Social cuts" },
        d: {
          es: "Cada video adaptado a 16:9, 9:16 y 1:1 para que funcione en todos lados.",
          en: "Every video adapted to 16:9, 9:16 and 1:1 so it works everywhere.",
        },
      },
    ],
  },
  contact: {
    label: { es: "Contacto", en: "Contact" },
    title: { es: "¿Hablamos?", en: "Let’s talk" },
    sub: {
      es: "Contame sobre tu producto y vemos cómo te puedo ayudar.",
      en: "Tell me about your product and let’s see how I can help.",
    },
    email: { es: "Escribime", en: "Email me" },
    whatsapp: { es: "WhatsApp", en: "WhatsApp" },
    copied: { es: "Copiado", en: "Copied" },
    copy: { es: "Copiar mail", en: "Copy email" },
  },
  footer: {
    top: { es: "Volver arriba", en: "Back to top" },
  },
  modal: { close: { es: "Cerrar", en: "Close" } },
}
