"use client"

import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders"
import * as React from "react"

const H = 46
const EASE = "cubic-bezier(0.34, 1.56, 0.64, 1)"
const CSS = `
.lm-shader canvas{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;display:block!important;border-radius:100px!important}
@keyframes lm-ripple{0%{transform:translate(-50%,-50%) scale(0);opacity:.6}100%{transform:translate(-50%,-50%) scale(4);opacity:0}}`

/** Pill button with a live liquid-metal rim. The shader only runs while the button is on screen. */
export function LiquidMetalButton({
  label,
  onClick,
  width = 142,
}: {
  label: string
  onClick?: () => void
  width?: number
}) {
  const [hover, setHover] = React.useState(false)
  const [pressed, setPressed] = React.useState(false)
  const [ripples, setRipples] = React.useState<{ x: number; y: number; id: number }[]>([])
  const shaderRef = React.useRef<HTMLDivElement>(null)
  const mount = React.useRef<ShaderMount | null>(null)
  const rid = React.useRef(0)

  React.useEffect(() => {
    const el = shaderRef.current
    if (!el) return
    mount.current = new ShaderMount(
      el,
      liquidMetalFragmentShader,
      {
        u_repetition: 4,
        u_softness: 0.5,
        u_shiftRed: 0.3,
        u_shiftBlue: 0.3,
        u_distortion: 0,
        u_contour: 0,
        u_angle: 45,
        u_scale: 8,
        u_shape: 1,
        u_offsetX: 0.1,
        u_offsetY: -0.1,
      },
      undefined,
      0.6,
    )
    // pause the animation while off screen
    const io = new IntersectionObserver(([e]) => mount.current?.setSpeed(e.isIntersecting ? 0.6 : 0))
    io.observe(el)
    return () => {
      io.disconnect()
      mount.current?.dispose()
      mount.current = null
    }
  }, [])

  const speed = (s: number) => mount.current?.setSpeed(s)

  const click = (e: React.MouseEvent<HTMLButtonElement>) => {
    speed(2.4)
    setTimeout(() => speed(hover ? 1 : 0.6), 300)
    const r = e.currentTarget.getBoundingClientRect()
    const ripple = { x: e.clientX - r.left, y: e.clientY - r.top, id: rid.current++ }
    setRipples((p) => [...p, ripple])
    setTimeout(() => setRipples((p) => p.filter((x) => x.id !== ripple.id)), 600)
    onClick?.()
  }

  const press = pressed ? "translateY(1px) scale(0.98)" : "none"
  const layer: React.CSSProperties = { position: "absolute", inset: 0, transition: `all 0.8s ${EASE}` }

  return (
    <div className="relative inline-block" style={{ width, height: H }}>
      <style>{CSS}</style>
      {/* metal rim */}
      <div
        style={{
          ...layer,
          transform: press,
          borderRadius: 100,
          transition: `all 0.8s ${EASE}, box-shadow 0.15s ease`,
          boxShadow: pressed
            ? "0 0 0 1px rgba(0,0,0,.5), 0 1px 2px rgba(0,0,0,.3)"
            : hover
              ? "0 0 0 1px rgba(0,0,0,.4), 0 12px 6px rgba(0,0,0,.05), 0 8px 5px rgba(0,0,0,.1), 0 4px 4px rgba(0,0,0,.15), 0 1px 2px rgba(0,0,0,.2)"
              : "0 0 0 1px rgba(0,0,0,.3), 0 36px 14px rgba(0,0,0,.02), 0 20px 12px rgba(0,0,0,.08), 0 9px 9px rgba(0,0,0,.12), 0 2px 5px rgba(0,0,0,.15)",
        }}
      >
        <div ref={shaderRef} className="lm-shader" style={{ position: "relative", width: "100%", height: "100%", borderRadius: 100, overflow: "hidden" }} />
      </div>
      {/* dark face */}
      <div
        style={{
          ...layer,
          inset: 2,
          transform: press,
          borderRadius: 100,
          background: "linear-gradient(180deg, #202020 0%, #000 100%)",
          boxShadow: pressed ? "inset 0 2px 4px rgba(0,0,0,.4), inset 0 1px 2px rgba(0,0,0,.3)" : "none",
        }}
      />
      {/* label */}
      <span
        style={{
          ...layer,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          fontSize: 14,
          fontWeight: 500,
          whiteSpace: "nowrap",
          color: hover ? "#f4f4f5" : "#c4c4c8",
          textShadow: "0 1px 2px rgba(0,0,0,.5)",
        }}
      >
        {label}
      </span>
      <button
        onClick={click}
        onMouseEnter={() => (setHover(true), speed(1))}
        onMouseLeave={() => (setHover(false), setPressed(false), speed(0.6))}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        aria-label={label}
        className="absolute inset-0 cursor-pointer overflow-hidden rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        {ripples.map((r) => (
          <span
            key={r.id}
            style={{
              position: "absolute",
              left: r.x,
              top: r.y,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,.4) 0%, rgba(255,255,255,0) 70%)",
              pointerEvents: "none",
              animation: "lm-ripple .6s ease-out",
            }}
          />
        ))}
      </button>
    </div>
  )
}
