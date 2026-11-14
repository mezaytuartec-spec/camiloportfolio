"use client"

import * as React from "react"
import { X } from "lucide-react"
import { GlassFilter } from "@/components/ui/liquid-glass-button"
import { PROJECTS, UI, type Lang, type Project, type T } from "@/lib/content"

type Ctx = {
  lang: Lang
  setLang: (l: Lang) => void
  t: (s: T) => string
  play: (id: Project["id"]) => void
  /** Slow connection or data saver: show posters instead of autoplaying previews. */
  lite: boolean
}

const SiteContext = React.createContext<Ctx | null>(null)

export function useSite() {
  const c = React.useContext(SiteContext)
  if (!c) throw new Error("useSite must be used inside <SiteProvider>")
  return c
}

/* Language: URL (?lang=) > saved choice > browser language. Read as an external store so the
   server render ("es") and the client agree without an extra render pass. */
const LANG_EVENT = "langchange"
function readLang(): Lang {
  const url = new URLSearchParams(window.location.search).get("lang")
  if (url === "es" || url === "en") return url
  const saved = window.localStorage.getItem("lang")
  if (saved === "es" || saved === "en") return saved
  return navigator.language?.toLowerCase().startsWith("es") ? "es" : "en"
}
function onLangChange(cb: () => void) {
  window.addEventListener(LANG_EVENT, cb)
  window.addEventListener("storage", cb)
  return () => {
    window.removeEventListener(LANG_EVENT, cb)
    window.removeEventListener("storage", cb)
  }
}

/* Slow connection or data saver. */
function readLite() {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection
  return !!c && (!!c.saveData || /(^|-)2g|3g/.test(c.effectiveType ?? ""))
}
const noop = () => () => {}

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const lang = React.useSyncExternalStore(onLangChange, readLang, () => "es" as Lang)
  const lite = React.useSyncExternalStore(noop, readLite, () => false)
  const [playing, setPlaying] = React.useState<Project | null>(null)

  React.useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = React.useCallback((l: Lang) => {
    window.localStorage.setItem("lang", l)
    const url = new URL(window.location.href)
    if (url.searchParams.has("lang")) {
      url.searchParams.delete("lang")
      window.history.replaceState(null, "", url)
    }
    window.dispatchEvent(new Event(LANG_EVENT))
  }, [])

  const t = React.useCallback((s: T) => s[lang], [lang])
  const play = React.useCallback((id: Project["id"]) => {
    setPlaying(PROJECTS.find((p) => p.id === id) ?? null)
  }, [])

  const value = React.useMemo(() => ({ lang, setLang, t, play, lite }), [lang, setLang, t, play, lite])

  return (
    <SiteContext.Provider value={value}>
      {children}
      <GlassFilter />
      <VideoModal project={playing} onClose={() => setPlaying(null)} label={t(UI.modal.close)} lang={lang} />
    </SiteContext.Provider>
  )
}

function VideoModal({
  project,
  onClose,
  label,
  lang,
}: {
  project: Project | null
  onClose: () => void
  label: string
  lang: Lang
}) {
  React.useEffect(() => {
    if (!project) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [project, onClose])

  if (!project) return null
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={project.name}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl modal-fade md:p-10"
      onClick={onClose}
    >
      <div
        className="modal-pop relative w-full max-w-6xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between text-sm text-white/70">
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full" style={{ background: project.accent }} />
            <span className="font-medium text-white">{project.name}</span>
            <span className="hidden text-white/40 sm:inline">· {project.kicker[lang]}</span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 transition hover:bg-white/10"
          >
            {label} <X className="size-3.5" />
          </button>
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_40px_120px_-20px_rgba(120,90,255,0.35)]">
          <video
            key={project.id}
            src={project.video}
            poster={project.poster}
            controls
            autoPlay
            playsInline
            className="aspect-video w-full"
          />
        </div>
      </div>
    </div>
  )
}
