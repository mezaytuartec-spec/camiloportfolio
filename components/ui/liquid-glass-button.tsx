"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const sizes = {
  sm: "h-8 gap-1.5 px-4 text-xs",
  lg: "h-10 px-6",
} as const

/** Liquid-glass pill button: a glass rim drawn with layered shadows over an SVG displacement backdrop. */
export function LiquidButton({
  className,
  size = "lg",
  children,
  ...props
}: React.ComponentProps<"button"> & { size?: keyof typeof sizes }) {
  return (
    <button
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md text-sm font-medium whitespace-nowrap text-white outline-none transition duration-300 hover:scale-105 focus-visible:ring-[3px] focus-visible:ring-white/40 disabled:pointer-events-none disabled:opacity-50",
        sizes[size],
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="absolute inset-0 z-0 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]"
      />
      <span
        aria-hidden
        className="absolute inset-0 isolate -z-10 overflow-hidden rounded-full"
        style={{ backdropFilter: 'url("#container-glass")' }}
      />
      <span className="pointer-events-none relative z-10">{children}</span>
    </button>
  )
}

/** The displacement filter the glass buttons refract through. Render once per page. */
export function GlassFilter() {
  return (
    <svg className="hidden" aria-hidden>
      <defs>
        <filter id="container-glass" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves="1" seed="1" result="turbulence" />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="70" xChannelSelector="R" yChannelSelector="B" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  )
}
