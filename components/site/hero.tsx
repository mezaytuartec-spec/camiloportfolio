"use client"

import * as React from "react"
import { Play, Volume2 } from "lucide-react"
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button"
import { LiquidButton } from "@/components/ui/liquid-glass-button"
import { PROJECTS, UI } from "@/lib/content"
import { useSite } from "./providers"
import { scrollToId } from "./nav"
import { cn } from "@/lib/utils"

export function Hero() {
  const { t } = useSite()

  return (
    <section id="top" className="relative isolate overflow-hidden pt-36 md:pt-44">
      {/* ambient glow + dotted desk */}
      <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 -z-20 [mask-image:radial-gradient(70%_55%_at_50%_30%,black,transparent)]" />
      <div aria-hidden className="pointer-events-none absolute top-[-20%] left-1/2 -z-20 h-[620px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(139,108,255,.20),transparent)] blur-2xl" />

      <div className="mx-auto max-w-5xl px-5 text-center">
        <div className="rise mx-auto inline-flex items-center gap-2.5 rounded-full py-1.5 pr-3.5 pl-2 text-[12px] text-white/70 glass">
          <span className="relative flex size-2">
            <span className="pulse-dot size-2 rounded-full bg-[#3ddc84]" />
          </span>
          {t(UI.hero.available)}
        </div>

        <h1 className="rise font-display mt-7 text-[clamp(2.6rem,7.4vw,6.2rem)] leading-[0.98] font-medium" style={{ ["--d" as string]: "80ms" }}>
          <span className="text-white/45">{t(UI.hero.hello)}</span>
          <br />
          {t(UI.hero.titleA)}{" "}
          <span className="text-gradient pr-2 font-serif text-[1.08em] font-normal italic tracking-[-0.02em]">
            {t(UI.hero.titleEm)}
          </span>{" "}
          <br className="hidden md:block" />
          {t(UI.hero.titleB)}
        </h1>

        <p className="rise mx-auto mt-7 max-w-2xl text-[15px] leading-relaxed text-white/60 md:text-lg" style={{ ["--d" as string]: "160ms" }}>
          {t(UI.hero.sub)}
        </p>

        <div className="rise mt-9 flex flex-wrap items-center justify-center gap-4" style={{ ["--d" as string]: "240ms" }}>
          <LiquidMetalButton label={t(UI.hero.ctaWork)} width={168} onClick={() => scrollToId("work")} />
          <LiquidButton size="lg" className="h-[46px] rounded-full px-7 text-white" onClick={() => scrollToId("contact")}>
            {t(UI.hero.ctaTalk)}
          </LiquidButton>
        </div>
      </div>

      {/* horizon + reel */}
      <div className="relative mt-32 md:mt-44">
        <div className="horizon -z-10 top-[-70px] md:top-[-130px]" aria-hidden />
        <div className="rise relative mx-auto max-w-5xl px-4" style={{ ["--d" as string]: "320ms" }}>
          <Reel />
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-24 bg-gradient-to-b md:block from-transparent to-[#07070a]" />
      </div>

      <Marquee />
    </section>
  )
}

function Reel() {
  const { t, play, lang, lite } = useSite()
  const [i, setI] = React.useState(0)
  const [dur, setDur] = React.useState(30)
  const ref = React.useRef<HTMLVideoElement>(null)
  const p = PROJECTS[i]

  React.useEffect(() => {
    const v = ref.current
    if (!v || lite) return
    v.currentTime = 0
    v.play().catch(() => {})
  }, [i, lite])

  return (
    <div className="relative">
      <div aria-hidden className="absolute -inset-x-10 -top-10 -bottom-4 -z-10 rounded-[40px] bg-[radial-gradient(60%_60%_at_50%_40%,rgba(139,108,255,.35),transparent)] blur-2xl" />
      <div className="overflow-hidden rounded-[22px] border border-white/10 bg-[#0d0d11]/90 p-1.5 shadow-[0_50px_140px_-30px_rgba(0,0,0,.9),inset_0_1px_0_rgba(255,255,255,.08)] backdrop-blur-xl">
        {/* window chrome */}
        <div className="flex items-center gap-3 px-3 pt-1.5 pb-2.5">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
          </div>
          <div className="flex flex-1 items-center gap-1 overflow-x-auto [scrollbar-width:none]">
            {PROJECTS.map((pr, k) => (
              <button
                key={pr.id}
                onClick={() => setI(k)}
                className={cn(
                  "relative flex shrink-0 cursor-pointer items-center gap-2 overflow-hidden rounded-lg px-3 py-1.5 text-[12px] transition-colors",
                  k === i ? "bg-white/[0.08] text-white" : "text-white/45 hover:text-white/80",
                )}
              >
                <span className="size-1.5 rounded-full" style={{ background: pr.accent, opacity: k === i ? 1 : 0.5 }} />
                {pr.name}
                {k === i && !lite && (
                  <span
                    key={i + lang}
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-px origin-left"
                    style={{ background: pr.accent, animation: `progress ${dur}s linear forwards` }}
                  />
                )}
              </button>
            ))}
          </div>
          <span className="hidden font-mono text-[10px] tracking-widest text-white/35 uppercase sm:block">Showreel</span>
        </div>

        {/* video */}
        <button
          onClick={() => play(p.id)}
          className="group relative block aspect-video w-full cursor-pointer overflow-hidden rounded-[16px] bg-[#f4f4f5]"
          aria-label={`${t(UI.work.play)} — ${p.name}`}
        >
          <video
            ref={ref}
            key={p.id}
            src={p.preview}
            poster={p.poster}
            muted
            playsInline
            autoPlay={!lite}
            preload={lite ? "none" : "metadata"}
            onLoadedMetadata={(e) => setDur(e.currentTarget.duration || 30)}
            onEnded={() => setI((i + 1) % PROJECTS.length)}
            className="h-full w-full object-cover"
          />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <span className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/70 py-2 pr-4 pl-2.5 text-[12px] font-medium text-white opacity-0 backdrop-blur-md transition-all duration-500 group-hover:opacity-100 md:translate-y-2 md:group-hover:translate-y-0">
            <span className="grid size-6 place-items-center rounded-full bg-white text-black">
              <Play className="size-3 fill-current" />
            </span>
            {t(UI.work.play)}
            <Volume2 className="size-3.5 text-white/60" />
          </span>
        </button>
      </div>
    </div>
  )
}

function Marquee() {
  const { lang } = useSite()
  const items = UI.marquee[lang]
  const row = [...items, ...items, ...items, ...items]
  return (
    <div className="relative mt-6 overflow-hidden border-y border-white/[0.06] py-5 [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
      <div className="marquee flex w-max gap-10 font-mono text-[11px] tracking-[0.2em] text-white/35 uppercase">
        {row.map((s, k) => (
          <span key={k} className="flex items-center gap-10">
            {s}
            <span className="size-1 rounded-full bg-white/20" />
          </span>
        ))}
      </div>
    </div>
  )
}
