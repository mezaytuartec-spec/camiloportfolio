"use client"

import * as React from "react"
import { LiquidButton } from "@/components/ui/liquid-glass-button"
import { UI } from "@/lib/content"
import { useSite } from "./providers"
import { cn } from "@/lib/utils"

export function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
}

export function LangToggle({ className }: { className?: string }) {
  const { lang, setLang } = useSite()
  return (
    <div
      role="group"
      aria-label="Language / Idioma"
      className={cn("relative flex items-center rounded-full bg-white/[0.06] p-0.5 text-[11px] font-medium ring-hairline", className)}
    >
      <span
        aria-hidden
        className="absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,.4)] transition-transform duration-500 ease-[cubic-bezier(.34,1.4,.5,1)]"
        style={{ transform: lang === "es" ? "translateX(0)" : "translateX(100%)" }}
      />
      {(["es", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={cn(
            "relative z-10 w-9 cursor-pointer rounded-full py-1 uppercase tracking-wider transition-colors",
            lang === l ? "text-black" : "text-white/55 hover:text-white",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

export function Nav() {
  const { t } = useSite()
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener("scroll", on, { passive: true })
    return () => window.removeEventListener("scroll", on)
  }, [])

  const links = [
    { href: "#work", label: t(UI.nav.work) },
    { href: "#services", label: t(UI.nav.services) },
  ]

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 md:pt-4">
      <nav
        className={cn(
          "pointer-events-auto flex w-full max-w-5xl items-center justify-between gap-2 rounded-full py-1.5 pr-1.5 pl-4 transition-all duration-500",
          scrolled ? "glass !bg-[#0b0b0f]/75" : "border border-transparent",
        )}
      >
        <a href="#top" className="flex items-center gap-2.5 text-sm font-medium tracking-tight">
          <Logo />
          <span className="hidden sm:inline">Camilo Meza</span>
        </a>

        <ul className="hidden items-center gap-1 text-[13px] text-white/60 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="rounded-full px-3.5 py-2 transition-colors hover:bg-white/5 hover:text-white">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <LangToggle />
          <LiquidButton size="sm" className="rounded-full text-[13px] text-white" onClick={() => scrollToId("contact")}>
            {t(UI.nav.contact)}
          </LiquidButton>
        </div>
      </nav>
    </header>
  )
}

export function Logo({ size = 26 }: { size?: number }) {
  return (
    <span
      className="relative grid place-items-center overflow-hidden rounded-[9px] bg-gradient-to-b from-white to-zinc-300 text-black shadow-[inset_0_-2px_4px_rgba(0,0,0,.2),0_4px_14px_-4px_rgba(139,108,255,.6)]"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" width={size * 0.62} height={size * 0.62} fill="none">
        <path d="M4 15.5c2.2-6 5-9 8-9s5.8 3 8 9" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="12" cy="16.5" r="2.2" fill="currentColor" />
      </svg>
    </span>
  )
}
