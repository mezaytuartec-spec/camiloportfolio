"use client"

// Halftone headline: same dot-field effect as the footer wordmark, sized like a
// normal title. Dots part around the pointer on springs; click sends a shock ring.

import * as React from "react"
import { hwfHex, hwfRadius, hwfStep, hwfWarmth } from "@/components/ui/halftone-wordmark-footer"

interface Props {
  text: string
  /** Max font size in px (shrinks to fit the width). */
  size?: number
  ink?: string
  /** Colour dots drift toward when pushed (keep it neutral). */
  warm?: string
  dotGap?: number
  radius?: number
  fontFamily?: string
  fontWeight?: number
  className?: string
}

const SANS = '"Inter Tight", "Inter", "Helvetica Neue", Arial, system-ui, sans-serif'

export default function HalftoneText({
  text,
  size = 96,
  ink = "#000000",
  warm = "#8a867f",
  dotGap = 3,
  radius = 70,
  fontFamily = SANS,
  fontWeight = 800,
  className = "",
}: Props) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const inkRgb = hwfHex(ink) || [12, 12, 11]
    const warmRgb = hwfHex(warm) || [138, 134, 127]

    let w = 0, h = 0, dpr = 1, px = -1e5, py = -1e5, raf = 0
    let visible = true, awake = true
    let ring = { x: 0, y: 0, t: -1 }
    let dots = new Float32Array(0)
    let count = 0

    const layout = () => {
      w = Math.max(1, Math.round(root.offsetWidth))
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      const probe = document.createElement("canvas").getContext("2d")!
      probe.font = `${fontWeight} 100px ${fontFamily}`
      const fit = Math.min(size, ((w * 0.96) / Math.max(1, probe.measureText(text).width)) * 100)
      h = Math.round(fit * 1.3)
      root.style.height = h + "px"
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)

      const mask = document.createElement("canvas")
      mask.width = w
      mask.height = h
      const m = mask.getContext("2d", { willReadFrequently: true })
      if (!m) return
      m.font = `${fontWeight} ${fit}px ${fontFamily}`
      if ("letterSpacing" in m) (m as any).letterSpacing = `${-0.02 * fit}px`
      const box = m.measureText(text)
      m.fillStyle = "#000"
      m.textBaseline = "alphabetic"
      m.fillText(text, (w - box.width) / 2, fit * 0.98)
      const img = m.getImageData(0, 0, w, h).data

      const gap = Math.max(3, dotGap)
      const cols = Math.ceil(w / gap)
      const rows = Math.ceil(h / gap)
      const tmp: number[] = []
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          let sum = 0
          for (let sy = 0; sy < 3; sy++) {
            for (let sx = 0; sx < 3; sx++) {
              const x = Math.min(w - 1, Math.floor(gx * gap + ((sx + 0.5) * gap) / 3))
              const y = Math.min(h - 1, Math.floor(gy * gap + ((sy + 0.5) * gap) / 3))
              sum += img[(y * w + x) * 4 + 3]
            }
          }
          const cov = sum / (9 * 255)
          if (cov < 0.06) continue
          const hx = gx * gap + gap / 2
          const hy = gy * gap + gap / 2
          tmp.push(hx, hy, 0, 0, hx, hy, hwfRadius(Math.min(1, cov * 1.1), gap))
        }
      }
      dots = new Float32Array(tmp)
      count = tmp.length / 7
      awake = true
    }

    const draw = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      const r = reduced ? 0 : radius
      const ringAge = ring.t < 0 ? 1e9 : now - ring.t
      const ringR = ringAge * 0.9
      let moving = false
      for (let i = 0; i < count; i++) {
        const j = i * 7
        let x = dots[j], y = dots[j + 1], vx = dots[j + 2], vy = dots[j + 3]
        const hx = dots[j + 4], hy = dots[j + 5]
        if (!reduced) {
          if (ringAge < 900) {
            const dx = hx - ring.x
            const dy = hy - ring.y
            const d = Math.sqrt(dx * dx + dy * dy) + 0.001
            const band = 1 - Math.min(1, Math.abs(d - ringR) / 26)
            if (band > 0) {
              const f = band * 3.2 * (1 - ringAge / 900)
              vx += (dx / d) * f
              vy += (dy / d) * f
            }
          }
          const s = hwfStep(x, y, vx, vy, hx, hy, px, py, r)
          x = s[0]; y = s[1]; vx = s[2]; vy = s[3]
          if (Math.abs(vx) + Math.abs(vy) > 0.02 || Math.abs(x - hx) + Math.abs(y - hy) > 0.05) moving = true
          else { x = hx; y = hy; vx = 0; vy = 0 }
          dots[j] = x; dots[j + 1] = y; dots[j + 2] = vx; dots[j + 3] = vy
        }
        const k = hwfWarmth(x, y, hx, hy, 28)
        ctx.fillStyle =
          k > 0.02
            ? `rgb(${Math.round(inkRgb[0] + (warmRgb[0] - inkRgb[0]) * k)},${Math.round(inkRgb[1] + (warmRgb[1] - inkRgb[1]) * k)},${Math.round(inkRgb[2] + (warmRgb[2] - inkRgb[2]) * k)})`
            : ink
        ctx.beginPath()
        ctx.arc(x, y, dots[j + 6], 0, 6.2832)
        ctx.fill()
      }
      awake = moving || ringAge < 900 || px > -1e4
    }

    const loop = (now: number) => {
      raf = 0
      if (!visible) return
      draw(now)
      if (awake) raf = requestAnimationFrame(loop)
    }
    const wake = () => {
      awake = true
      if (!raf && visible) raf = requestAnimationFrame(loop)
    }
    const local = (e: PointerEvent) => {
      const b = canvas.getBoundingClientRect()
      return [((e.clientX - b.left) * w) / (b.width || w), ((e.clientY - b.top) * h) / (b.height || h)]
    }
    const onMove = (e: PointerEvent) => { const p = local(e); px = p[0]; py = p[1]; wake() }
    const onLeave = () => { px = -1e5; py = -1e5; wake() }
    const onDown = (e: PointerEvent) => {
      if (reduced) return
      const p = local(e)
      ring = { x: p[0], y: p[1], t: performance.now() }
      wake()
    }

    layout()
    draw(performance.now())
    wake()
    root.addEventListener("pointermove", onMove)
    root.addEventListener("pointerleave", onLeave)
    root.addEventListener("pointerdown", onDown)
    const ro = new ResizeObserver(() => { layout(); wake() })
    ro.observe(root)
    const io = new IntersectionObserver((en) => {
      visible = en[0] ? en[0].isIntersecting : true
      if (visible) wake()
    })
    io.observe(root)
    let alive = true
    document.fonts?.ready.then(() => { if (alive) { layout(); wake() } })

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      root.removeEventListener("pointermove", onMove)
      root.removeEventListener("pointerleave", onLeave)
      root.removeEventListener("pointerdown", onDown)
    }
  }, [text, size, ink, warm, dotGap, radius, fontFamily, fontWeight])

  return (
    <div ref={rootRef} className={"relative w-full " + className} style={{ touchAction: "pan-y" }}>
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 block h-full w-full" />
      <span className="sr-only">{text}</span>
    </div>
  )
}
