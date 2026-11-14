"use client"

import * as React from "react"
import { ArrowUpRight, Play, Rocket, MousePointerClick, Smartphone, MessageCircle, Copy, Check, ArrowUp } from "lucide-react"
import { PeekBlob } from "@/components/ui/peek-blob"
import { LiquidButton } from "@/components/ui/liquid-glass-button"
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button"
import { CONTACT, PROJECTS, UI, type Project } from "@/lib/content"
import { useSite } from "./providers"
import { LangToggle, Logo, scrollToId } from "./nav"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/* Reveal on scroll                                                    */
/* ------------------------------------------------------------------ */

export function RevealObserver() {
  React.useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.setAttribute("data-in", "")
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    )
    const scan = () => document.querySelectorAll(".reveal:not([data-in])").forEach((el) => io.observe(el))
    scan()
    const mo = new MutationObserver(scan)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])
  return null
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="reveal inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium tracking-[0.14em] text-white/60 uppercase glass">
      <span className="size-1.5 rounded-full bg-gradient-to-r from-[#ff8a5c] to-[#8b6cff]" />
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Work                                                                */
/* ------------------------------------------------------------------ */

export function Work() {
  const { t } = useSite()
  return (
    <section id="work" className="relative scroll-mt-20 px-5 pt-24 pb-10 md:pt-32">
      <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-6">
        <div>
          <Eyebrow>{t(UI.work.label)}</Eyebrow>
          <h2 className="reveal font-display mt-6 text-[clamp(2.2rem,5.2vw,4.2rem)] leading-[1.02] font-medium">{t(UI.work.title)}</h2>
        </div>
        <p className="reveal max-w-sm text-[15px] leading-relaxed text-white/55">{t(UI.work.sub)}</p>
      </div>
      <div className="mx-auto mt-16 flex max-w-6xl flex-col gap-24 md:mt-20 md:gap-36">
        {PROJECTS.map((p) => (
          <ProjectCase key={p.id} p={p} />
        ))}
      </div>

      <div className="reveal mx-auto mt-24 flex max-w-6xl flex-col items-center justify-between gap-5 rounded-2xl px-6 py-6 glass sm:flex-row md:mt-32 md:px-8">
        <p className="text-lg font-medium tracking-tight">{t(UI.work.more)}</p>
        <button
          onClick={() => scrollToId("contact")}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/85"
        >
          {t(UI.work.moreCta)} <ArrowUpRight className="size-4" />
        </button>
      </div>
    </section>
  )
}

function ProjectCase({ p }: { p: Project }) {
  const { t, play, lite } = useSite()
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [open, setOpen] = React.useState(false)

  // play the muted preview only while it is on screen
  React.useEffect(() => {
    const v = videoRef.current
    if (!v || lite) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.35 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [lite])

  return (
    <article id={`case-${p.id}`} className="relative scroll-mt-24">
      <div className="reveal flex flex-wrap items-end justify-between gap-4 border-b border-white/[0.08] pb-5">
        <h3 className="font-display text-3xl font-medium md:text-4xl">{p.name}</h3>
        <span className="flex items-center gap-2 text-[13px] text-white/50">
          <span className="size-2 rounded-full" style={{ background: p.accent, boxShadow: `0 0 12px ${p.accent}` }} />
          {t(p.kicker)} · {p.year}
        </span>
      </div>

      <div className="reveal relative mt-8" style={{ ["--d" as string]: "80ms" }}>
        <div
          aria-hidden
          className="absolute inset-x-[8%] -bottom-10 top-[30%] -z-10 rounded-full opacity-50 blur-[90px]"
          style={{ background: p.accent }}
        />
        <button
          onClick={() => play(p.id)}
          className="group relative block aspect-video w-full cursor-pointer overflow-hidden rounded-[22px] bg-zinc-100 ring-1 ring-white/10"
          aria-label={`${t(UI.work.play)} — ${p.name}`}
        >
          <video
            ref={videoRef}
            src={p.preview}
            poster={p.poster}
            muted
            loop
            playsInline
            preload="none"
            className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.025]"
          />
          <span className="absolute inset-0 grid place-items-center">
            <span className="flex items-center gap-2.5 rounded-full bg-black/75 py-2.5 pr-5 pl-2.5 text-sm font-medium text-white opacity-0 shadow-2xl backdrop-blur-md transition-all duration-500 group-hover:scale-100 group-hover:opacity-100 md:scale-90">
              <span className="grid size-8 place-items-center rounded-full bg-white text-black">
                <Play className="size-3.5 fill-current" />
              </span>
              {t(UI.work.play)}
            </span>
          </span>
        </button>
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-12 md:gap-8">
        <div className="reveal md:col-span-5">
          <p className="text-xl leading-snug font-medium tracking-tight text-white/90 md:text-2xl">{t(p.summary)}</p>
          <div className="mt-6 flex flex-wrap gap-1.5">
            {p.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[10.5px] text-white/55">
                {tag}
              </span>
            ))}
          </div>
          <button
            onClick={() => play(p.id)}
            className="mt-7 inline-flex cursor-pointer items-center gap-2 text-sm text-white/80 transition hover:text-white"
          >
            {t(UI.work.play)} <ArrowUpRight className="size-4" />
          </button>
        </div>

        <div className="reveal space-y-7 md:col-span-7" style={{ ["--d" as string]: "120ms" }}>
          <div>
            <h4 className="mb-2.5 font-mono text-[10.5px] tracking-[0.16em] text-white/40 uppercase">{t(UI.work.challenge)}</h4>
            <p className="text-[15px] leading-relaxed text-white/75">{t(p.challenge)}</p>
          </div>
          <div>
            <h4 className="mb-2.5 font-mono text-[10.5px] tracking-[0.16em] text-white/40 uppercase">{t(UI.work.approach)}</h4>
            <div className={cn("relative overflow-hidden transition-[max-height] duration-700 ease-[cubic-bezier(.2,.8,.2,1)]", open ? "max-h-[1200px]" : "max-h-[7.4rem]")}>
              <p className="text-[15px] leading-relaxed text-white/60">{t(p.approach)}</p>
              {!open && <span aria-hidden className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-b from-transparent to-[#07070a]" />}
            </div>
            <button
              onClick={() => setOpen((o) => !o)}
              className="mt-2 cursor-pointer text-[13px] text-white/50 underline-offset-4 transition hover:text-white hover:underline"
              aria-expanded={open}
            >
              {open ? t(UI.work.readLess) : t(UI.work.readMore)}
            </button>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 text-[12.5px] leading-relaxed text-white/45">
            <p>{t(p.credits)}</p>
            <p className="mt-2 text-white/30">{t(p.note)}</p>
          </div>
        </div>
      </div>
    </article>
  )
}

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

export function Services() {
  const { t } = useSite()
  const icons = [Rocket, MousePointerClick, Smartphone]
  const glows = ["#ff8a5c", "#8b6cff", "#3ddc84"]
  return (
    <section id="services" className="relative scroll-mt-20 px-5 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Eyebrow>{t(UI.services.label)}</Eyebrow>
        <h2 className="reveal font-display mt-6 text-[clamp(2.2rem,5.2vw,4.2rem)] leading-[1.02] font-medium">{t(UI.services.title)}</h2>

        <div className="mt-12 grid gap-3 md:grid-cols-3">
          {UI.services.items.map((s, k) => {
            const Icon = icons[k]
            return (
              <div
                key={k}
                className="reveal group relative overflow-hidden rounded-2xl p-6 glass transition-colors duration-500 hover:bg-white/[0.06]"
                style={{ ["--d" as string]: `${k * 90}ms` }}
              >
                <div
                  aria-hidden
                  className="absolute -top-16 -right-16 size-40 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-60"
                  style={{ background: glows[k] }}
                />
                <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-b from-white/15 to-white/[0.03] ring-hairline">
                  <Icon className="size-[18px] text-white/85" />
                </span>
                <h3 className="mt-10 text-lg font-medium tracking-tight">{t(s.t)}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-white/55">{t(s.d)}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

export function Contact() {
  const { t } = useSite()
  const [copied, setCopied] = React.useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {}
  }

  return (
    <section id="contact" className="relative scroll-mt-16 px-3 py-12 md:px-5 md:py-20">
      <div className="reveal relative mx-auto h-[660px] max-w-6xl overflow-hidden rounded-[32px] bg-[#0b0a10] ring-1 ring-white/10 md:h-[760px]">
        {/* the character fills the card and peeks up from its bottom edge, behind the text */}
        <div className="absolute bottom-0 left-1/2 h-[115%] w-[220%] -translate-x-1/2 md:h-[112%] md:w-[125%]">
          <PeekBlob
            color="#7c5cff"
            background="#0b0a10"
            glow="#0b0a10"
            textColor="#ffffff"
            wordmark=""
            energy={0.55}
            floor={0.08}
            edgeSoftness={4}
            aberration={0.3}
            ariaLabel="Camilo Meza Ytuarte"
            style={{ width: "100%", height: "100%", minHeight: 0, aspectRatio: "auto" }}
          />
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#0b0a10] via-[#0b0a10]/70 to-transparent" />
        <div className="pointer-events-none relative z-10 px-5 pt-16 text-center md:pt-20 [&_button]:pointer-events-auto">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium tracking-[0.14em] text-white/60 uppercase glass">
            <span className="size-1.5 rounded-full bg-[#3ddc84]" />
            {t(UI.contact.label)}
          </div>
          <h2 className="font-display mt-6 text-[clamp(2.4rem,6vw,4.6rem)] leading-[1] font-medium text-white">{t(UI.contact.title)}</h2>
          <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-white/60">{t(UI.contact.sub)}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <LiquidMetalButton label={t(UI.contact.email)} width={150} onClick={() => (window.location.href = `mailto:${CONTACT.email}`)} />
            <LiquidButton
              size="lg"
              className="h-[46px] rounded-full px-6 text-white"
              onClick={() => window.open(CONTACT.whatsapp, "_blank", "noopener")}
            >
              <span className="flex items-center gap-2">
                <MessageCircle className="size-4" /> {t(UI.contact.whatsapp)}
              </span>
            </LiquidButton>
          </div>
          <button
            onClick={copy}
            className="mt-6 inline-flex cursor-pointer items-center gap-2 font-mono text-[12px] text-white/45 transition hover:text-white"
          >
            {CONTACT.email}
            {copied ? <Check className="size-3.5 text-[#3ddc84]" /> : <Copy className="size-3.5" />}
            <span className="sr-only">{copied ? t(UI.contact.copied) : t(UI.contact.copy)}</span>
          </button>
        </div>

      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export function Footer() {
  const { t } = useSite()
  return (
    <footer className="relative px-5 pt-10 pb-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 border-t border-white/[0.08] pt-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <Logo size={30} />
              <span className="font-medium tracking-tight">{CONTACT.name}</span>
            </div>
            <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-white/45">{t(UI.hero.sub)}</p>
          </div>
          <div className="text-[13px] md:col-span-4">
            <h4 className="mb-3 font-mono text-[10.5px] tracking-[0.16em] text-white/35 uppercase">{t(UI.contact.label)}</h4>
            <ul className="space-y-2 text-white/70">
              <li>
                <a className="transition hover:text-white" href={`mailto:${CONTACT.email}`}>
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a className="transition hover:text-white" href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer">
                  {CONTACT.phoneDisplay}
                </a>
              </li>
            </ul>
          </div>
          <div className="text-[13px] md:col-span-3">
            <h4 className="mb-3 font-mono text-[10.5px] tracking-[0.16em] text-white/35 uppercase">{t(UI.work.label)}</h4>
            <ul className="space-y-2 text-white/70">
              {PROJECTS.map((p) => (
                <li key={p.id}>
                  <a className="transition hover:text-white" href={`#case-${p.id}`}>
                    {p.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 text-[12px] text-white/35 md:flex-row md:items-center">
          <span>© 2026 {CONTACT.name}</span>
          <div className="flex items-center gap-3">
            <LangToggle />
            <button
              onClick={() => scrollToId("top")}
              className="flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 transition glass hover:text-white"
            >
              {t(UI.footer.top)} <ArrowUp className="size-3.5" />
            </button>
          </div>
        </div>

        <div
          aria-hidden
          className="font-display pointer-events-none mt-10 bg-gradient-to-b from-white/[0.12] to-transparent bg-clip-text text-center text-[clamp(3.5rem,13.5vw,12.5rem)] leading-[0.85] font-semibold whitespace-nowrap text-transparent select-none"
        >
          Camilo Meza
        </div>
      </div>
    </footer>
  )
}
