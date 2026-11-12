import { useEffect, useRef, useState, type ReactNode } from "react"
import HalftoneWordmarkFooter from "@/components/ui/halftone-wordmark-footer"
import { content, EMAIL, type Lang } from "./content"

const mono = "font-mono uppercase tracking-[0.18em] text-[11px]"

const POSTERS: Record<string, string> = { peec: "/posters/peec.png", mico: "/posters/mico.webp" }

// Phrases set in bold, per language + project.
const BOLD: Record<string, string[]> = {
  "en-peec": ["make that visibility tangible", "starts from the buyer, not the product", "a number that counts up and a ranking that reorders", "a single accent color appears only when the numbers improve", "live vector components"],
  "es-peec": ["hacer tangible esa visibilidad", "parte del comprador, no del producto", "un número que sube y un ranking que se reordena", "un único color de acento aparece solo cuando los números mejoran", "componentes vectoriales vivos"],
  "en-mico": ["without a bot joining the call", "“nobody joins the call”", "One number carries the story", "decisions and commitments with owners", "Spanish-first", "vertical and square formats"],
  "es-mico": ["sin que un bot entre a la llamada", "“nadie entra a la llamada”", "Un solo número carga la historia", "decisiones y compromisos con responsables", "español primero", "vertical y cuadrado"],
}

function withBold(text: string, phrases: string[]): ReactNode[] {
  const esc = phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  const parts = text.split(new RegExp(`(${esc.join("|")})`, "g"))
  return parts.map((s, i) => (phrases.includes(s) ? <strong key={i} className="font-semibold text-black">{s}</strong> : s))
}

function LangToggle({ lang, setLang, label }: { lang: Lang; setLang: (l: Lang) => void; label: string }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="fixed right-4 top-4 z-50 flex items-center rounded-full border border-[#e9e4da]/30 bg-[#0c0c0b]/80 p-1 backdrop-blur-md sm:right-8 sm:top-6"
    >
      {(["en", "es"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`${mono} cursor-pointer rounded-full border-0 px-4 py-2 text-[12px] transition-colors ${
            lang === l ? "bg-[#e9e4da] text-[#0c0c0b]" : "bg-transparent text-[#e9e4da]/60 hover:text-[#e9e4da]"
          }`}
        >
          {l === "en" ? "EN" : "ES"}
        </button>
      ))}
    </div>
  )
}

/** Small blurred poster + play button. On play: poster fades, video starts, card grows. */
function VideoCard({ src, poster, name }: { src: string; poster: string; name: string }) {
  const [started, setStarted] = useState(false)
  const [q, setQ] = useState(0) // 0 = full size, 1 = back to the small poster
  const ref = useRef<HTMLVideoElement>(null)
  const wrap = useRef<HTMLDivElement>(null)

  const start = () => {
    setQ(0)
    setStarted(true)
    // Start once the poster has faded out.
    window.setTimeout(() => ref.current?.play(), 550)
  }

  // While playing, scrolling past the video shrinks it back, step by step.
  useEffect(() => {
    if (!started) return
    const onScroll = () => {
      const el = wrap.current
      if (!el) return
      const top = el.getBoundingClientRect().top
      const next = Math.max(0, Math.min(1, (-60 - top) / 260))
      if (next >= 0.98) {
        ref.current?.pause()
        setStarted(false)
        setQ(0)
      } else setQ(next)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [started])

  const maxWidth = started ? 1280 - (1280 - 640) * q : 640

  return (
    <div className="px-3 sm:px-6" ref={wrap}>
      <div
        className={`relative mx-auto aspect-video overflow-hidden rounded-[28px] bg-black sm:rounded-[40px] ${
          q === 0 ? "transition-[max-width] duration-[900ms] ease-[cubic-bezier(.2,.7,.1,1)]" : ""
        }`}
        style={{ maxWidth }}
      >
        <video ref={ref} src={src} controls={started} playsInline preload="metadata" className="h-full w-full object-cover" />
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${started ? "pointer-events-none opacity-0" : "opacity-100"}`}
        >
          <img src={poster} alt="" className="h-full w-full scale-110 object-cover blur-[18px]" />
          <button
            onClick={start}
            aria-label={`Play ${name}`}
            className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/50 bg-white/25 backdrop-blur-md transition-transform hover:scale-105"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
              <path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

/** CTA: starts as a small blurred card, grows to a full white screen as you scroll. */
function CtaReveal({ title, body, button }: { title: string; body: string; button: string }) {
  const wrap = useRef<HTMLDivElement>(null)
  const [p, setP] = useState(0)
  const [vp, setVp] = useState({ w: 1200, h: 800 })

  useEffect(() => {
    const onScroll = () => {
      const el = wrap.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const dist = el.offsetHeight - window.innerHeight
      // Start growing as the card scrolls into view, finish before the end.
      const raw = (window.innerHeight * 0.6 - r.top) / (dist + window.innerHeight * 0.6) / 0.75
      setP(Math.max(0, Math.min(1, raw)))
      setVp({ w: window.innerWidth, h: window.innerHeight })
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  const e = p * p * (3 - 2 * p) // smoothstep
  const w0 = Math.min(640, vp.w - 24)
  const h0 = (w0 * 9) / 16
  const w = w0 + (vp.w - w0) * e
  const h = h0 + (vp.h - h0) * e
  const radius = 40 * (1 - e)
  const blur = 14 * (1 - e)

  return (
    <section ref={wrap} className="relative" style={{ height: "230vh" }}>
      <div className="sticky top-0 flex h-screen items-center justify-center">
        <div
          className="flex flex-col items-center justify-center overflow-hidden bg-[#f4f1ea] px-6 text-center text-[#0c0c0b]"
          style={{ width: w, height: h, borderRadius: radius }}
        >
          <div style={{ filter: `blur(${blur}px)`, transform: `scale(${0.7 + 0.3 * e})` }}>
            <h2 className="m-0 text-[clamp(40px,7vw,96px)] font-extrabold leading-none tracking-[-0.04em]">{title}</h2>
            <p className="mx-auto mb-0 mt-6 max-w-md text-[17px] leading-relaxed text-[#4a4741] sm:text-[19px]">{body}</p>
            <a
              href={`mailto:${EMAIL}`}
              className="mt-10 inline-block rounded-full bg-[#0c0c0b] px-8 py-4 text-[15px] font-medium text-white no-underline transition-opacity hover:opacity-80"
            >
              {button}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("lang")
    if (saved === "en" || saved === "es") return saved
    return navigator.language.toLowerCase().startsWith("es") ? "es" : "en"
  })
  useEffect(() => {
    localStorage.setItem("lang", lang)
    document.documentElement.lang = lang
  }, [lang])
  const t = content[lang]

  return (
    <>
      <LangToggle lang={lang} setLang={setLang} label={t.langLabel} />

      <HalftoneWordmarkFooter
        wordmark="portfolio"
        label={t.footer.label}
        meta={t.subtitle}
        backToTop={false}
        crop={-0.32}
        columns={[
          { title: t.footer.work, links: t.projects.map((p) => ({ label: p.name, href: `#${p.id}` })) },
          { title: t.footer.contact, links: [
              { label: EMAIL, href: `mailto:${EMAIL}` },
              // +54 9 = Argentine mobile format required by wa.me
              { label: "+54 266 504 8562", href: "https://wa.me/5492665048562" },
            ],
          },
        ]}
        height="clamp(440px, 70vh, 680px)"
      />

      <main>
        {t.projects.map((p, idx) => (
          <article id={p.id} key={p.id} className="scroll-mt-4 pt-8">
            <VideoCard src={p.video} poster={POSTERS[p.id]} name={p.name} />

            {/* Full-bleed white sector with curved top and bottom edges */}
            <div className="mt-8 rounded-[48px] bg-[#f4f1ea] px-6 pb-20 pt-16 text-[#0c0c0b] sm:rounded-[80px] sm:px-16 sm:pb-28 sm:pt-24">
              <p className={`${mono} m-0 mb-6 text-center text-[#85817a]`}>
                {lang === "es" ? "Proyecto" : "Project"} 0{idx + 1} · 2026
              </p>
              <h2 className="m-0 text-center text-[clamp(40px,7vw,96px)] font-extrabold leading-none tracking-[-0.04em]">{p.name}</h2>
              <div className="mx-auto mt-12 max-w-[680px] sm:mt-16">
                {p.paragraphs.map((para, i) => (
                  <p key={i} className="mb-6 mt-0 text-[17px] leading-[1.65] text-[#4a4741] sm:text-[19px]">
                    {withBold(para, BOLD[`${lang}-${p.id}`])}
                  </p>
                ))}
                <p className="mb-0 mt-10 font-mono text-[11px] uppercase leading-[1.8] tracking-[0.12em] text-[#85817a]">{p.disclaimer}</p>
                <p className="m-0 mt-3 font-mono text-[11px] uppercase leading-[1.8] tracking-[0.12em] text-[#85817a]">{p.credit}</p>
              </div>
            </div>
          </article>
        ))}

        <div className="pt-8" />
        <CtaReveal title={t.cta.title} body={t.cta.body} button={t.cta.button} />
      </main>
    </>
  )
}
