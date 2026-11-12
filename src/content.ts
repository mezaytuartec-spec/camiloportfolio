export type Lang = "en" | "es"

// TODO: replace with your real contact email
export const EMAIL = "mezaytuartec@gmail.com"

type Project = {
  id: string
  name: string
  video: string
  disclaimer: string
  paragraphs: string[]
  credit: string
}

export const content: Record<Lang, {
  subtitle: string; langLabel: string
  projects: Project[]
  cta: { title: string; body: string; button: string }
  footer: { label: string; work: string; contact: string }
}> = {
  en: {
    subtitle: "Motion graphics & product animation for SaaS",
    langLabel: "Language",
    projects: [
      {
        id: "peec",
        name: "Peec AI",
        video: "/videos/peec.mp4",
        disclaimer: "Independent concept piece, not commissioned by or affiliated with Peec AI. Fictional brands, illustrative data.",
        paragraphs: [
          "Peec AI measures how brands appear inside ChatGPT, Perplexity and Gemini. That is hard to put in a launch film, because the product tracks something nobody can see. The goal was to make that visibility tangible in 30 seconds, for the marketing and SEO teams who are just starting to ask the question.",
          "The film starts from the buyer, not the product: it opens on a question typed into an AI prompt and shows the answers that come back without the hero brand, so the product arrives as the answer to something the viewer has already felt. Visibility becomes a number that counts up and a ranking that reorders, an improvement you watch happen instead of being told. The film respects the brand’s restraint: Peec’s identity is monochrome, so a single accent color appears only when the numbers improve, turning color into a signal and not a decoration. The interface is rebuilt as live vector components, so any number, name or line of copy can change in the code and the film re-renders, with the edit paced to the soundtrack.",
        ],
        credit: "Concept and direction: Camilo Meza Ytuarte. Built in code at 60 fps with Remotion, AI-assisted. Delivered in 16:9, with 9:16 and 1:1 cutdowns.",
      },
      {
        id: "mico",
        name: "Mico",
        video: "/videos/mico.mp4",
        disclaimer: "Independent concept piece, not commissioned by or affiliated with Mico. Interface and brand elements recreated from public materials.",
        paragraphs: [
          "Mico is a meeting notebook for Spanish-speaking teams that records without a bot joining the call. Meeting-notes tools look alike in a demo, so the film needed to show what makes this one different, and the cost of the problem it solves, in 30 seconds.",
          "The differentiator is dramatized: the problem scene stages the awkward moment a notetaking bot asks to join, and the product scene answers it with “nobody joins the call”. One number carries the story, a counter of unowned commitments that climbs in the opening and returns to zero at the payoff, so the value reads as a change in something the viewer already understood. Raw conversation is sorted on screen into decisions and commitments with owners, so the result is visible, not described. On-screen copy is in Spanish because the product is Spanish-first, and the look comes from Mico’s own identity (warm paper, violet accent, hand-drawn touches), deliberately avoiding the dark, technical default of most SaaS launches. The camera stays close to the detail that matters, so the film holds up in vertical and square formats.",
        ],
        credit: "Concept and direction: Camilo Meza Ytuarte. Built in code at 60 fps with Remotion, AI-assisted. Delivered in 16:9, with 9:16 and 1:1 cutdowns.",
      },
    ],
    cta: {
      title: "Request yours.",
      body: "Let’s talk about a launch film or product animation for your SaaS.",
      button: "Talk with me",
    },
    footer: { label: "Camilo Meza Ytuarte", work: "Work", contact: "Contact" },
  },
  es: {
    subtitle: "Motion graphics y animación de producto para SaaS",
    langLabel: "Idioma",
    projects: [
      {
        id: "peec",
        name: "Peec AI",
        video: "/videos/peec.mp4",
        disclaimer: "Pieza conceptual independiente, no encargada por ni afiliada a Peec AI. Marcas ficticias, datos ilustrativos.",
        paragraphs: [
          "Peec AI mide cómo aparecen las marcas dentro de ChatGPT, Perplexity y Gemini. Es difícil llevar eso a un video de lanzamiento, porque el producto rastrea algo que nadie puede ver. El objetivo era hacer tangible esa visibilidad en 30 segundos, para los equipos de marketing y SEO que recién empiezan a hacerse la pregunta.",
          "El video parte del comprador, no del producto: abre con una pregunta escrita en un prompt de IA y muestra las respuestas que vuelven sin la marca protagonista, así el producto llega como la respuesta a algo que el espectador ya sintió. La visibilidad se vuelve un número que sube y un ranking que se reordena, una mejora que se ve suceder en lugar de contarse. Respeta la sobriedad de la marca: la identidad de Peec es monocromática, así que un único color de acento aparece solo cuando los números mejoran, y el color pasa a ser una señal y no una decoración. La interfaz está reconstruida como componentes vectoriales vivos, por lo que cualquier número, nombre o línea de texto se cambia en el código y el video se vuelve a renderizar, con el montaje al ritmo de la banda sonora.",
        ],
        credit: "Concepto y dirección: Camilo Meza Ytuarte. Construido en código a 60 fps con Remotion, asistido por IA. Entregado en 16:9, con versiones 9:16 y 1:1.",
      },
      {
        id: "mico",
        name: "Mico",
        video: "/videos/mico.mp4",
        disclaimer: "Pieza conceptual independiente, no encargada por ni afiliada a Mico. Elementos de interfaz y marca recreados a partir de materiales públicos.",
        paragraphs: [
          "Mico es un cuaderno de reuniones para equipos hispanohablantes que graba sin que un bot entre a la llamada. Las herramientas de notas de reuniones se parecen en una demo, así que el video debía mostrar qué hace diferente a esta, y el costo del problema que resuelve, en 30 segundos.",
          "El diferenciador se dramatiza: la escena del problema muestra el momento incómodo en que un bot de notas pide entrar, y la escena del producto responde con “nadie entra a la llamada”. Un solo número carga la historia, un contador de compromisos sin responsable que sube al inicio y vuelve a cero en el remate, así el valor se lee como un cambio en algo que el espectador ya entendía. La conversación en bruto se ordena en pantalla en decisiones y compromisos con responsables, de modo que el resultado se ve, no se describe. El texto en pantalla está en español porque el producto es español primero, y el look sale de la propia identidad de Mico (papel cálido, acento violeta, toques dibujados a mano), evitando a propósito el default oscuro y técnico de la mayoría de los lanzamientos SaaS. La cámara se mantiene cerca del detalle que importa, para que el video funcione en formatos vertical y cuadrado.",
        ],
        credit: "Concepto y dirección: Camilo Meza Ytuarte. Construido en código a 60 fps con Remotion, asistido por IA. Entregado en 16:9, con versiones 9:16 y 1:1.",
      },
    ],
    cta: {
      title: "Pide el tuyo.",
      body: "Hablemos de un video de lanzamiento o animación de producto para tu SaaS.",
      button: "Habla conmigo",
    },
    footer: { label: "Camilo Meza Ytuarte", work: "Trabajo", contact: "Contacto" },
  },
}
