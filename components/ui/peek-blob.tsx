"use client";

// Peek Blob by Louis Studios.
// 200 more hand-made React components at https://studios.lou15.com/?ref=21st-code

import * as React from "react";

export interface PeekBlobProps {
  /** Body colour of the glowing dome, at its deepest point. The lighter top and the soft edge that bleeds into the halo are mixed from this colour in code. */
  color?: string;
  /** Eye colour. The lower part of each eye picks up a little of `color` so the eyes read as rounded. */
  eyeColor?: string;
  /** Page colour around the character and under its ledge. */
  background?: string;
  /** Colour of the soft halo the dome glows into. */
  glow?: string;
  /** Wordmark ink. */
  textColor?: string;
  /** Small wordmark above the dome. Pass an empty string to hide it. */
  wordmark?: string;
  /** Font stack for the wordmark. */
  font?: string;
  /** How lively the character is, 0 to 1: spring snap, breathing depth, blink rate and how far it looks around. 0.5 is the designed feel. */
  energy?: number;
  /** "window" makes the eyes follow the pointer anywhere on the page; "container" only while the pointer is over the component. */
  track?: "window" | "container";
  /** Strength of the lens colour fringing on every edge, 0 (off) to 2. 1 matches the reference. */
  aberration?: number;
  /** Space kept under the ledge the character peeks over, as a share of the designed gap. 0 puts the ledge on the bottom edge of the container. */
  floor?: number;
  /** Softness of the ledge edge the character peeks over, as a multiple of the designed edge. Raise it on dark backgrounds, where a hair-thin edge can break into dashes under the lens fringing. */
  edgeSoftness?: number;
  /** Duck down and pop back up when clicked or tapped. */
  interactive?: boolean;
  /** Called each time a click, tap, Enter or Space makes it duck. When set, the component is also focusable and acts as a button. */
  onPeek?: () => void;
  /** Freeze the animation at this many seconds of the 10 second idle loop (looking around, blinking, breathing). For stills and tests. */
  time?: number;
  /** Accessible name. Defaults to a short description that includes the wordmark. */
  ariaLabel?: string;
  /** Extra class on the outer element. */
  className?: string;
  /** Extra style on the outer element. The root fills its container (width and height 100%), falls back to a 24 / 25 aspect ratio when the container has no height, and is never shorter than 360 px. */
  style?: React.CSSProperties;
  /** Content layered over the scene, centred in the open space above the character, for a headline or a call to action. */
  children?: React.ReactNode;
}

const DEFAULT_FONT =
  '"SF Pro Rounded", ui-rounded, "Nunito", "Varela Round", "Arial Rounded MT Bold", -apple-system, BlinkMacSystemFont, system-ui, sans-serif';


/* ------------------------------------------------------------------ */
/* Geometry, measured on the reference still. Stage units: the still   */
/* is 958 by 998, y grows downward. Every shape is analytic, so the    */
/* character stays sharp at any size and any device pixel ratio.       */
/* ------------------------------------------------------------------ */

const G = {
  stageW: 958,
  stageCx: 479,
  ledgeY: 707.2263, // ledge height at its lowest point (the clip line)
  gap: 291, // stage units under the ledge
  topRoom: 140, // stage units kept above the halo when the height is the limit
  // ledge: a very wide arc, lowest in the middle
  ledgeCx: 485,
  ledgeK: 2.791e-04,
  ledgeSoft: 0.6,
  haloDrop: 5.0531,
  haloLedgeK: 1.810e-04,
  haloLedgeSoft: 2.937,
  // halo: a soft rounded rectangle
  haloCx: 485.9113,
  haloTop: 294.0528,
  haloA: 321.5422,
  haloR: 24.1414,
  haloArch: 3.664e-04,
  haloBarrel: 15.8132,
  haloSigSide: 12.2682,
  haloSigTop: 8.5797,
  // body: a blurred ellipse whose opacity climbs from top to bottom
  bodyCx: 490.4514,
  bodyCy: 660.8353,
  bodyA: 254.5313,
  bodyB: 235.7081,
  bodySig: 40.1026,
  bodyTop: 480.4994,
  bodyBot: 710.9736,
  bodyV0: 0.388,
  // eyes: [cx, cy, semi axis across, semi axis along, tilt in degrees, top to the right]
  eyeL: [414.9962, 654.3234, 70.9136, 97.7624, -27.1065],
  eyeR: [627.1312, 626.6387, 63.8664, 93.16, 5.9697],
  eyeSoft: 0.65,
  eyeShade: 0.36,
  eyeEdge: 0.12,
  eyeRim: 2.0,
  eyeRimW: 4,
  eyeIn: 0.25, // bluish shade inside each eye's lower left
  eyeCyan: 0.3, // cyan glow outside each eye's outer side
  eyeCyanW: 12,
  eyeLine: 2, // thin dark line beyond it
  eyeLineW: 5,
  cyanTurn: -28,
  cyanLight: 0.74,
  // pink rim on the glow's lower flanks and the ledge
  rimAmt: 0.8,
  rimA0: 0.12,
  rimA1: 0.25,
  rimA2: 0.45,
  rimY0: 560,
  rimY1: 680,
  rimTurn: 96,
  rimLight: 0.93,
  // wordmark
  textCx: 480,
  textBase: 392.5,
  fontRef: 19.5,
  // lens fringing
  caCx: 485.7538,
  caKx: 0.1082,
  caCy: 586.9862,
  caKy: 0.1056,
  caBand: 0.4414,
  caPow: 2.8055, // fringing grows faster than distance from the middle, like a real lens
  textKy: 0.014,
  textKx: 6.000e-03, // the wordmark fringes mostly vertically, like the reference
};

const LOOP = 10;

/* Idle gaze path: holds and quick glances, in gaze units (-1 to 1). */
const LOOK: [number, number, number][] = [
  [0, 0, 0],
  [0.55, 0, 0],
  [0.85, -0.8, 0.08],
  [2.45, -0.8, 0.08],
  [2.8, 0.82, -0.2],
  [4.55, 0.82, -0.2],
  [4.85, 0.3, 0.36],
  [6.4, 0.3, 0.36],
  [6.75, -0.45, -0.4],
  [8.4, -0.45, -0.4],
  [8.85, 0, 0],
  [10, 0, 0],
];
const LOOP_BLINKS = [1.9, 5.6, 5.87];

/* ------------------------------------------------------------------ */
/* Shaders                                                             */
/* ------------------------------------------------------------------ */

const VERT = `attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `precision highp float;
uniform vec2 uRes;
uniform vec3 uMap;
uniform vec3 uBg;
uniform vec3 uGlow;
uniform vec3 uBody;
uniform vec3 uEye;
uniform vec3 uInk;
uniform vec4 uHalo;
uniform vec4 uHalo2;
uniform vec4 uBodyE;
uniform vec4 uBodyV;
uniform vec4 uLedge;
uniform vec3 uLedgeHalo;
uniform vec2 uEyeLc;
uniform vec4 uEyeLm;
uniform vec2 uEyeRc;
uniform vec4 uEyeRm;
uniform vec4 uEyeShade;
uniform vec4 uEyeFx;
uniform float uEyeIn;
uniform vec3 uCyan;
uniform vec3 uRimCol;
uniform vec4 uRim;
uniform vec2 uRimY;
uniform float uEyeAA;
uniform vec4 uText;
uniform float uTextOn;
uniform sampler2D uTex;
uniform vec2 uCAc;
uniform float uCAp;
uniform vec2 uK;
uniform vec2 uKt;
uniform vec3 uW[16];
uniform float uS[16];
uniform float uN;
uniform float uSeed;

float th(float x) { x = clamp(x, -9.0, 9.0); float e = exp(2.0 * x); return (e - 1.0) / (e + 1.0); }
float soft(float d, float s) { return 0.5 - 0.5 * th(0.85 * d / s); }
// gaussian edge: 0.5 * erfc(d / (s * sqrt 2)), with short tails so glows end cleanly
float gsoft(float d, float s) {
  float x = d / (s * 1.41421356);
  float x2 = x * x;
  float e = sqrt(1.0 - exp(-x2 * (1.2732395 + 0.147 * x2) / (1.0 + 0.147 * x2)));
  return 0.5 - 0.5 * sign(x) * e;
}
float ledgeY(float x) { float dx = x - uLedge.z; return uLedge.x - uLedge.y * dx * dx; }

// the halo: a soft rounded rectangle with a faintly arched top and slightly barrelled sides
float halo(vec2 p) {
  float x = p.x - uHalo.x;
  float top = uHalo.y + uHalo2.y * x * x;
  float yy = (p.y - 560.0) / 180.0;
  float hw = uHalo.z + uHalo2.x * max(0.0, 1.0 - yy * yy);
  float R = uHalo.w;
  vec2 q = vec2(abs(x) - (hw - R), (top + R) - p.y);
  float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - R;
  vec2 n = max(q, 0.0);
  float up = q.y > 0.0 ? (q.x > 0.0 ? n.y * n.y / max(dot(n, n), 1e-6) : 1.0) : 0.0;
  return gsoft(d, mix(uHalo2.z, uHalo2.w, up));
}

float body(vec2 p) {
  vec2 q = (p - uBodyE.xy) / uBodyE.zw;
  float r = max(length(q), 1e-4);
  vec2 g = q / uBodyE.zw / r;
  float d = (r - 1.0) / max(length(g), 1e-6);
  float t = clamp((p.y - uBodyV.y) / (uBodyV.w - uBodyV.y), 0.0, 1.0);
  return gsoft(d, uBodyV.x) * (uBodyV.z + (1.0 - uBodyV.z) * t);
}

float eye(vec2 p, vec2 c, vec4 m, out float sd, out float r, out float v, out float u) {
  vec2 q = p - c;
  vec2 l = vec2(m.x * q.x + m.y * q.y, m.z * q.x + m.w * q.y);
  r = max(length(l), 1e-4);
  vec2 g = vec2(m.x * l.x + m.z * l.y, m.y * l.x + m.w * l.y) / r;
  sd = (r - 1.0) / max(length(g), 1e-6);
  v = l.y;
  u = l.x;
  return soft(sd, uEyeAA);
}

vec3 eyeCol(float r, float v, float u) {
  vec3 tint = mix(uEye, uBody, 0.55);
  float low = smoothstep(-0.4, 0.5, v);
  float k = 0.02 + uEyeShade.x * smoothstep(-0.2, 0.6, v) + uEyeShade.y * smoothstep(0.7, 1.0, r) * low;
  // a faint bluish shade inside the lower left, as if lit from the upper right
  k += uEyeIn * smoothstep(0.25, 1.0, dot(vec2(u, v), vec2(-0.7071, 0.7071)));
  return mix(uEye, tint, clamp(k, 0.0, 1.0));
}

vec3 haloLayer(vec2 p) {
  float hx = p.x - uLedge.z;
  float h = halo(p) * soft(p.y - (uLedge.x + uLedgeHalo.x - uLedgeHalo.z * hx * hx), uLedgeHalo.y);
  return mix(uBg, uGlow, h);
}

vec3 scene(vec2 p, vec2 pt, vec3 base) {
  vec3 col = base;
  float ly = ledgeY(p.x);
  float cb = soft(p.y - ly, uLedge.w);
  float ba = body(p) * cb;
  col = mix(col, uBody, ba);
  float sdL; float rL; float vL; float uL;
  float sdR; float rR; float vR; float uR;
  float aL = eye(p, uEyeLc, uEyeLm, sdL, rL, vL, uL) * cb;
  float aR = eye(p, uEyeRc, uEyeRm, sdR, rR, vR, uR) * cb;
  // a soft contact shadow around each eye, deeper toward the bottom where the eyes sit in the body
  // on each eye's outer side: a cyan glow, wider the further the eye sits from the middle, then a thin dark line beyond it
  float kL = abs(uEyeLc.x - uCAc.x) / 200.0;
  float kR = abs(uEyeRc.x - uCAc.x) / 200.0;
  float oL = smoothstep(-10.0, 30.0, (p.x - uEyeLc.x) * sign(uEyeLc.x - uCAc.x)) * cb * (1.0 - aL);
  float oR = smoothstep(-10.0, 30.0, (p.x - uEyeRc.x) * sign(uEyeRc.x - uCAc.x)) * cb * (1.0 - aR);
  float rim = uEyeShade.z * cb * (exp(-max(sdL, 0.0) / uEyeShade.w) * (1.0 - aL) * smoothstep(-1.1, 0.1, vL) * (1.0 - 0.6 * oL) + exp(-max(sdR, 0.0) / uEyeShade.w) * (1.0 - aR) * smoothstep(-1.1, 0.1, vR) * (1.0 - 0.6 * oR));
  col = mix(col, col * mix(vec3(1.0), uBody, 0.25) * 0.92, clamp(rim, 0.0, 1.0));
  float wL = uEyeFx.y * kL;
  float wR = uEyeFx.y * kR;
  float lnL = (sdL - 4.0 - wL * 1.6) / uEyeFx.w;
  float lnR = (sdR - 4.0 - wR * 1.6) / uEyeFx.w;
  col = mix(col, col * 0.86, clamp(uEyeFx.z * (oL * exp(-lnL * lnL) * smoothstep(-0.9, 0.2, vL) + oR * exp(-lnR * lnR) * smoothstep(-0.9, 0.2, vR)), 0.0, 1.0));
  col = mix(col, uCyan, clamp(uEyeFx.x * (oL * exp(-max(sdL, 0.0) / max(wL, 0.5)) + oR * exp(-max(sdR, 0.0) / max(wR, 0.5))), 0.0, 1.0));
  col = mix(col, eyeCol(rL, vL, uL), aL);
  col = mix(col, eyeCol(rR, vR, uR), aR);
  if (uTextOn > 0.5) {
    vec2 t = (pt - uText.xy) / uText.zw;
    if (t.x > 0.0 && t.x < 1.0 && t.y > 0.0 && t.y < 1.0) col = mix(col, uInk, texture2D(uTex, t).a);
  }
  return col;
}

float hash(vec2 p) { p = fract(p * vec2(443.897, 441.423)); p += dot(p, p.yx + 19.19); return fract((p.x + p.y) * p.x); }

void main() {
  vec2 px = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec2 p = uMap.yz + px * uMap.x;
  vec3 acc = vec3(0.0);
  vec3 base = haloLayer(p);
  // lens fringing: each wavelength samples the scene at its own magnification,
  // growing faster than linearly with distance from the centre like a real lens
  vec2 d = p - uCAc;
  // (capped far out, where nothing is left to fringe, so the outermost samples never fold back over the middle)
  vec2 bend = d * pow(min(length(d), 380.0) / 200.0 + 1e-6, uCAp - 1.0);
  for (int i = 0; i < 16; i++) {
    if (float(i) >= uN) break;
    vec2 pb = p - uS[i] * uK * bend;
    vec2 pt = p - uS[i] * uKt * bend;
    acc += uW[i] * scene(pb, pt, base);
  }
  // the glow's lower flanks and the ledge line turn a saturated pink over a short distance
  float ba = body(p) * soft(p.y - ledgeY(p.x), uLedge.w);
  float band = smoothstep(uRim.y, uRim.z, ba) * (1.0 - smoothstep(uRim.z, uRim.w, ba));
  acc = mix(acc, uRimCol, uRim.x * band * smoothstep(uRimY.x, uRimY.y, p.y));
  float n = hash(gl_FragCoord.xy + uSeed) + hash(gl_FragCoord.yx * 1.37 + uSeed + 7.1) - 1.0;
  gl_FragColor = vec4(clamp(acc + n / 255.0, 0.0, 1.0), 1.0);
}`;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

type RGB = [number, number, number];
let colorCtx: CanvasRenderingContext2D | null = null;
function parseColor(c: string, fallback: RGB): RGB {
  if (typeof document === "undefined") return fallback;
  if (!colorCtx) colorCtx = document.createElement("canvas").getContext("2d");
  if (!colorCtx) return fallback;
  colorCtx.fillStyle = "#000000"; // ls:keep
  colorCtx.fillStyle = c;
  const v = String(colorCtx.fillStyle);
  if (v[0] === "#" && v.length >= 7) return [parseInt(v.slice(1, 3), 16) / 255, parseInt(v.slice(3, 5), 16) / 255, parseInt(v.slice(5, 7), 16) / 255];
  const m = v.match(/[\d.]+/g);
  return m && m.length >= 3 ? [+m[0] / 255, +m[1] / 255, +m[2] / 255] : fallback;
}

/* A colour derived from the body colour: its hue turned by some degrees, fully saturated, at a set lightness. */
function turnHue(c: RGB, turn: number, light: number): RGB {
  const mx = Math.max(c[0], c[1], c[2]);
  const mn = Math.min(c[0], c[1], c[2]);
  const d = mx - mn;
  let h = 0;
  if (d > 1e-6) {
    if (mx === c[0]) h = ((c[1] - c[2]) / d + 6) % 6;
    else if (mx === c[1]) h = (c[2] - c[0]) / d + 2;
    else h = (c[0] - c[1]) / d + 4;
  }
  h = (((h * 60 + turn) % 360) + 360) % 360;
  const a = Math.min(light, 1 - light);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return light - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [f(0), f(8), f(4)];
}

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const smoother = (x: number) => {
  const t = clamp(x, 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
};
const wrap = (t: number) => ((t % LOOP) + LOOP) % LOOP;

function lookPath(t: number): [number, number] {
  const u = wrap(t);
  for (let i = 1; i < LOOK.length; i++) {
    const a = LOOK[i - 1];
    const b = LOOK[i];
    if (u <= b[0]) {
      const k = smoother((u - a[0]) / Math.max(1e-6, b[0] - a[0]));
      return [a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
    }
  }
  return [0, 0];
}

/* One blink: a quick close, a short hold, a slower open. 0 open, 1 shut. */
function blinkShape(x: number) {
  if (x < 0 || x > 0.27) return 0;
  if (x < 0.075) {
    const k = x / 0.075;
    return k * k;
  }
  if (x < 0.105) return 1;
  const k = (x - 0.105) / 0.165;
  return 1 - smoother(k);
}

/* Duck after a click: down fast, a beat, then spring back up past rest. */
function duckShape(x: number) {
  if (x < 0) return 0;
  if (x < 0.13) {
    const k = x / 0.13;
    return 1 - (1 - k) * (1 - k) * (1 - k);
  }
  if (x < 0.2) return 1;
  const y = x - 0.2;
  if (y > 2.5) return 0;
  return Math.exp(-5.2 * y) * Math.cos(8.4 * y);
}

function spectral(n: number, band: number) {
  const S: number[] = [];
  const W: number[] = [];
  const sum = [0, 0, 0];
  const bump = (t: number, c: number) => {
    const z = (t - c) / band;
    return Math.max(0, 1 - z * z) ** 2;
  };
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : (i + 0.5) / n;
    S.push(n === 1 ? 0 : 2 * t - 1);
    const w = n === 1 ? [1, 1, 1] : [bump(t, 0.12), bump(t, 0.5), bump(t, 0.88)];
    W.push(...w);
    sum[0] += w[0];
    sum[1] += w[1];
    sum[2] += w[2];
  }
  for (let i = 0; i < n; i++) for (let c = 0; c < 3; c++) W[i * 3 + c] /= sum[c];
  while (S.length < 16) {
    S.push(0);
    W.push(0, 0, 0);
  }
  return { S, W };
}

interface Layout {
  W: number;
  H: number;
  s: number;
  yBottom: number;
}

function layoutFor(W: number, H: number, floor: number): Layout {
  const yBottom = G.ledgeY + G.gap * clamp(floor, 0, 3);
  const s = Math.max(0.05, Math.min(W / G.stageW, H / Math.max(200, yBottom - G.topRoom)));
  return { W, H, s, yBottom };
}

/* Wordmark bitmap at device resolution: white ink on transparent, used as a mask. */
function drawWordmark(text: string, font: string, cssPx: number, dpr: number) {
  const cv = document.createElement("canvas");
  const ctx = cv.getContext("2d");
  if (!ctx) return null;
  const fp = cssPx * dpr;
  const f = `800 ${fp}px ${font}`;
  ctx.font = f;
  const tw = text ? ctx.measureText(text).width : 0;
  const pad = Math.ceil(fp * 0.5);
  const base = pad + Math.ceil(fp * 1.05);
  cv.width = Math.max(2, Math.ceil(tw + pad * 2));
  cv.height = Math.max(2, Math.ceil(base + fp * 0.35 + pad));
  ctx.font = f;
  ctx.fillStyle = "#ffffff"; // ls:keep
  ctx.textBaseline = "alphabetic";
  if (text) ctx.fillText(text, pad, base);
  return { canvas: cv, base };
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

/* ------------------------------------------------------------------ */
/* Motion state                                                        */
/* ------------------------------------------------------------------ */

interface Motion {
  gx: number;
  gy: number;
  vx: number;
  vy: number;
  blink: number;
  duck: number;
  breath: number;
}

function springStep(m: Motion, tx: number, ty: number, dt: number, omega: number, zeta: number) {
  const ax = omega * omega * (tx - m.gx) - 2 * zeta * omega * m.vx;
  const ay = omega * omega * (ty - m.gy) - 2 * zeta * omega * m.vy;
  m.vx += ax * dt;
  m.vy += ay * dt;
  m.gx += m.vx * dt;
  m.gy += m.vy * dt;
}

function springFor(energy: number) {
  return { omega: 10 + 8 * energy, zeta: 0.66 - 0.14 * energy };
}

/* The idle loop as a pure function of time, so stills and the card loop are exact and seamless. */
function loopMotion(t: number, energy: number): Motion {
  const m: Motion = { gx: 0, gy: 0, vx: 0, vy: 0, blink: 0, duck: 0, breath: 0 };
  const amp = 0.7 + 0.6 * energy;
  // replay the gaze spring over the last 4 s of the loop path, so the state at t is exact and the loop seamless
  const { omega, zeta } = springFor(energy);
  const t0 = t - 4;
  const p0 = lookPath(t0);
  m.gx = p0[0] * amp;
  m.gy = p0[1] * amp;
  const dt = 1 / 240;
  for (let k = 0; k < 960; k++) {
    const p = lookPath(t0 + k * dt);
    springStep(m, p[0] * amp, p[1] * amp, dt, omega, zeta);
  }
  let b = 0;
  for (const tb of LOOP_BLINKS) b = Math.max(b, blinkShape(wrap(t - tb)));
  m.blink = b;
  m.breath = Math.sin((2 * Math.PI * wrap(t)) / 5) * (0.5 + energy);
  return m;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function PeekBlob({
  color = "#32aaf9",
  eyeColor = "#ffffff",
  background = "#f1f1f1",
  glow = "#ffffff",
  textColor = "#0c0b14",
  wordmark = "",
  font = DEFAULT_FONT,
  energy = 0.5,
  track = "window",
  aberration = 1,
  floor = 1,
  edgeSoftness = 1,
  interactive = true,
  onPeek,
  time,
  ariaLabel,
  className,
  style,
  children,
}: PeekBlobProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const [haloTop, setHaloTop] = React.useState(0);

  const props = React.useRef({ color, eyeColor, background, glow, textColor, wordmark, font, energy, track, aberration, floor, edgeSoftness, interactive, onPeek, time, reduced });
  React.useLayoutEffect(() => {
    props.current = { color, eyeColor, background, glow, textColor, wordmark, font, energy, track, aberration, floor, edgeSoftness, interactive, onPeek, time, reduced };
  });

  const api = React.useRef<{ duck: () => void; redraw: () => void; text: () => void }>({ duck: () => {}, redraw: () => {}, text: () => {} });

  React.useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let lay = layoutFor(1, 1, 1);
    let raf = 0;
    let visible = true;
    let disposed = false;
    const t0 = performance.now();
    const live: Motion = { gx: 0, gy: 0, vx: 0, vy: 0, blink: 0, duck: 0, breath: 0 };
    let lastT = 0;
    let pointer: { x: number; y: number; at: number } | null = null;
    let nextBlink = 2.2 + Math.random() * 2.5;
    let blinkAt = -10;
    let doubleAt = -10;
    let duckAt = -10;
    let dirty = true;
    let quality = 1; // drops on slow devices so the glow stays at 60 fps
    let slow = 0;

    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false, preserveDrawingBuffer: false, powerPreference: "high-performance" }) as WebGLRenderingContext | null;
    let prog: WebGLProgram | null = null;
    const U: Record<string, WebGLUniformLocation | null> = {};
    let tex: WebGLTexture | null = null;
    let text: { x0: number; y0: number; w: number; h: number; on: boolean } = { x0: 0, y0: 0, w: 1, h: 1, on: false };
    let textCanvas: HTMLCanvasElement | null = null;
    let textKey = "";

    if (gl) {
      const sh = (type: number, src: string) => {
        const s = gl.createShader(type)!;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
          console.warn("PeekBlob shader", gl.getShaderInfoLog(s));
          return null;
        }
        return s;
      };
      const vs = sh(gl.VERTEX_SHADER, VERT);
      const fs = sh(gl.FRAGMENT_SHADER, FRAG);
      if (vs && fs) {
        prog = gl.createProgram()!;
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.bindAttribLocation(prog, 0, "aPos");
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) prog = null;
      }
      if (prog) {
        gl.useProgram(prog);
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        for (const n of ["uRes", "uMap", "uBg", "uGlow", "uBody", "uEye", "uInk", "uHalo", "uHalo2", "uBodyE", "uBodyV", "uLedge", "uLedgeHalo", "uEyeLc", "uEyeLm", "uEyeRc", "uEyeRm", "uEyeShade", "uEyeFx", "uEyeIn", "uCyan", "uRimCol", "uRim", "uRimY", "uEyeAA", "uText", "uTextOn", "uTex", "uCAc", "uCAp", "uK", "uKt", "uW", "uS", "uN", "uSeed"])
          U[n] = gl.getUniformLocation(prog, n);
        tex = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
        gl.uniform1i(U.uTex, 0);
      }
    }
    const ctx2d = !prog ? canvas.getContext("2d") : null;

    const fontPx = () => Math.max(11, G.fontRef * lay.s);

    const buildText = () => {
      const p = props.current;
      const label = p.wordmark || "";
      const on = !!label;
      const key = `${label}|${p.font}|${fontPx().toFixed(3)}|${dpr}`;
      if (key === textKey) return;
      textKey = key;
      if (!label) {
        text = { ...text, on: false };
        textCanvas = null;
        dirty = true;
        return;
      }
      const d = drawWordmark(label, p.font, fontPx(), dpr);
      if (!d) return;
      textCanvas = d.canvas;
      const k = 1 / (dpr * lay.s);
      const w = d.canvas.width * k;
      const h = d.canvas.height * k;
      text = { x0: G.textCx - w / 2, y0: G.textBase - d.base * k, w, h, on };
      if (gl && prog && tex) {
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, d.canvas);
      }
      dirty = true;
    };

    const resize = () => {
      const r = root.getBoundingClientRect();
      W = Math.max(1, r.width);
      H = Math.max(1, r.height);
      dpr = Math.min(2, window.devicePixelRatio || 1) * quality;
      canvas.width = Math.max(1, Math.round(W * dpr));
      canvas.height = Math.max(1, Math.round(H * dpr));
      lay = layoutFor(W, H, props.current.floor);
      setHaloTop(Math.max(0, H - (lay.yBottom - G.haloTop) * lay.s));
      textKey = "";
      buildText();
      dirty = true;
    };

    /* Gaze target from the pointer, in gaze units, saturating softly. */
    const pointerGaze = (): [number, number] | null => {
      if (!pointer) return null;
      const ex = W / 2 + (520 - G.stageCx) * lay.s;
      const ey = H - (lay.yBottom - 625) * lay.s;
      const sx = (pointer.x - ex) / Math.max(120, 430 * lay.s);
      const sy = (pointer.y - ey) / Math.max(120, 360 * lay.s);
      return [sx / Math.sqrt(1 + sx * sx), sy / Math.sqrt(1 + sy * sy)];
    };

    const draw = (m: Motion, seconds: number) => {
      const p = props.current;
      const s = lay.s;
      const e = clamp(p.energy, 0, 1);
      const bg = parseColor(p.background, [0.945, 0.945, 0.945]);
      const glow = parseColor(p.glow, [1, 1, 1]);
      const bodyC = parseColor(p.color, [0.196, 0.667, 0.976]);
      const eyeC = parseColor(p.eyeColor, [1, 1, 1]);
      const ink = parseColor(p.textColor, [0.05, 0.05, 0.08]);
      const gx = m.gx;
      const gy = m.gy;
      const br = m.breath;
      const dk = m.duck;

      // body, halo and eyes respond to gaze, breath and duck
      const bodyCx = G.bodyCx + gx * 9;
      const bodyCy = G.bodyCy + gy * 4 + dk * 64;
      const bodyB = G.bodyB * (1 + 0.016 * br);
      const bodyTop = G.bodyTop - 3 * br + dk * 64;
      const haloCx = G.haloCx + gx * 3;
      const haloTop = G.haloTop - 1.2 * br + dk * 12;

      // eye squash from the spring's velocity, in stage units per second
      const vx = m.vx * 30;
      const vy = m.vy * 20;
      const sp = Math.hypot(vx, vy);
      const st = Math.min(0.16, (sp / 900) * (0.7 + 0.6 * e));
      const dx = sp > 1e-3 ? vx / sp : 1;
      const dy = sp > 1e-3 ? vy / sp : 0;
      const open = Math.max(0.045, (1 - 0.955 * m.blink) * (1 - 0.32 * Math.max(0, dk)));
      const midX = (G.eyeL[0] + G.eyeR[0]) / 2;

      const eyeMat = (E: number[], side: number): [number, number, number, number, number, number] => {
        const th = ((E[4] + gx * 6) * Math.PI) / 180;
        const c = Math.cos(th);
        const sn = Math.sin(th);
        const ax = E[2] * (1 - 0.1 * Math.max(0, side * gx));
        const ay = E[3] * (1 - 0.03 * gy);
        // a blink squashes the eye vertically toward a point low in the eye, near the ledge
        const pivot = 0.42 * ay;
        const cx = midX + (E[0] - midX) * (1 - 0.07 * Math.abs(gx)) + gx * 30;
        const cy = E[1] + gy * 20 - 1.6 * br + dk * 66 + pivot * (1 - open);
        // squash and stretch along the gaze velocity
        const a1 = 1 + st;
        const a2 = 1 / (1 + st);
        const i1 = 1 / a1 - 1;
        const i2 = 1 / a2 - 1;
        const nx = -dy;
        const ny = dx;
        const s00 = 1 + i1 * dx * dx + i2 * nx * nx;
        const s01 = i1 * dx * dy + i2 * nx * ny;
        const s11 = 1 + i1 * dy * dy + i2 * ny * ny;
        // inverse: unstretch, unblink, then rotate into the eye frame
        const b10 = s01 / open;
        const b11 = s11 / open;
        const r00 = c * s00 + sn * b10;
        const r01 = c * s01 + sn * b11;
        const r10 = -sn * s00 + c * b10;
        const r11 = -sn * s01 + c * b11;
        return [cx, cy, r00 / ax, r01 / ax, r10 / ay, r11 / ay];
      };
      const L = eyeMat(G.eyeL, -1);
      const R = eyeMat(G.eyeR, 1);

      if (prog && gl) {
        gl.viewport(0, 0, canvas.width, canvas.height);
        const k = 1 / (s * dpr);
        gl.uniform2f(U.uRes, canvas.width, canvas.height);
        gl.uniform3f(U.uMap, k, G.stageCx - W / 2 / s, lay.yBottom - H / s);
        gl.uniform3fv(U.uBg, bg);
        gl.uniform3fv(U.uGlow, glow);
        gl.uniform3fv(U.uBody, bodyC);
        gl.uniform3fv(U.uEye, eyeC);
        gl.uniform3fv(U.uInk, ink);
        gl.uniform4f(U.uHalo, haloCx, haloTop, G.haloA, G.haloR);
        gl.uniform4f(U.uHalo2, G.haloBarrel, G.haloArch, G.haloSigSide, G.haloSigTop);
        gl.uniform4f(U.uBodyE, bodyCx, bodyCy, G.bodyA, bodyB);
        gl.uniform4f(U.uBodyV, G.bodySig, bodyTop, G.bodyV0, G.bodyBot + dk * 64);
        gl.uniform4f(U.uLedge, G.ledgeY, G.ledgeK, G.ledgeCx, Math.max(G.ledgeSoft, 0.6 * k) * Math.max(0.5, p.edgeSoftness));
        gl.uniform3f(U.uLedgeHalo, G.haloDrop, G.haloLedgeSoft, G.haloLedgeK);
        gl.uniform2f(U.uEyeLc, L[0], L[1]);
        gl.uniform4f(U.uEyeLm, L[2], L[3], L[4], L[5]);
        gl.uniform2f(U.uEyeRc, R[0], R[1]);
        gl.uniform4f(U.uEyeRm, R[2], R[3], R[4], R[5]);
        gl.uniform4f(U.uEyeShade, G.eyeShade, G.eyeEdge, G.eyeRim, G.eyeRimW);
        gl.uniform4f(U.uEyeFx, G.eyeCyan, G.eyeCyanW, G.eyeLine, G.eyeLineW);
        gl.uniform1f(U.uEyeIn, G.eyeIn);
        gl.uniform3fv(U.uCyan, turnHue(bodyC, G.cyanTurn, G.cyanLight));
        gl.uniform3fv(U.uRimCol, turnHue(bodyC, G.rimTurn, G.rimLight));
        gl.uniform4f(U.uRim, G.rimAmt, G.rimA0, G.rimA1, G.rimA2);
        gl.uniform2f(U.uRimY, G.rimY0, G.rimY1);
        gl.uniform1f(U.uEyeAA, Math.max(G.eyeSoft, 0.55 * k));
        gl.uniform4f(U.uText, text.x0, text.y0, text.w, text.h);
        gl.uniform1f(U.uTextOn, text.on && textCanvas ? 1 : 0);
        const ab = clamp(p.aberration, 0, 2);
        const n = ab <= 0.001 ? 1 : canvas.width * canvas.height > 2.4e6 ? 12 : 16;
        const sp2 = spectral(n, G.caBand);
        gl.uniform2f(U.uCAc, G.caCx, G.caCy);
        gl.uniform1f(U.uCAp, G.caPow);
        gl.uniform2f(U.uK, G.caKx * ab, G.caKy * ab);
        gl.uniform2f(U.uKt, G.textKx * ab, G.textKy * ab);
        gl.uniform3fv(U.uW, sp2.W);
        gl.uniform1fv(U.uS, sp2.S);
        gl.uniform1f(U.uN, n);
        gl.uniform1f(U.uSeed, (seconds * 60) % 97);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        return;
      }
      if (!ctx2d) return;
      // Canvas 2D fallback: the same shapes without the lens fringing.
      const css = (c: RGB, a = 1) => `rgba(${Math.round(c[0] * 255)}, ${Math.round(c[1] * 255)}, ${Math.round(c[2] * 255)}, ${a})`;
      const X = (x: number) => (W / 2 + (x - G.stageCx) * s) * dpr;
      const Y = (y: number) => (H - (lay.yBottom - y) * s) * dpr;
      const S = s * dpr;
      const c2 = ctx2d;
      c2.setTransform(1, 0, 0, 1, 0, 0);
      c2.filter = "none";
      c2.fillStyle = css(bg);
      c2.fillRect(0, 0, canvas.width, canvas.height);
      c2.save();
      c2.beginPath();
      c2.moveTo(0, 0);
      c2.lineTo(canvas.width, 0);
      c2.lineTo(canvas.width, Y(G.ledgeY - G.ledgeK * (G.stageW / 2) ** 2));
      for (let i = 0; i <= 48; i++) {
        const x = G.stageW - (i / 48) * G.stageW;
        c2.lineTo(X(x), Y(G.ledgeY - G.ledgeK * (x - G.ledgeCx) ** 2));
      }
      c2.closePath();
      c2.clip();
      c2.filter = `blur(${Math.max(1, G.haloSigSide * S)}px)`;
      c2.fillStyle = css(glow);
      c2.beginPath();
      c2.roundRect?.(X(haloCx - G.haloA), Y(haloTop), G.haloA * 2 * S, (G.ledgeY + 40 - haloTop) * S, G.haloR * S);
      c2.fill();
      c2.filter = `blur(${Math.max(1, G.bodySig * 0.8 * S)}px)`;
      const grad = c2.createLinearGradient(0, Y(bodyCy - bodyB), 0, Y(G.bodyBot));
      grad.addColorStop(0, css(bodyC, G.bodyV0 * 0.7));
      grad.addColorStop(1, css(bodyC, 1));
      c2.fillStyle = grad;
      c2.beginPath();
      c2.ellipse(X(bodyCx), Y(bodyCy), G.bodyA * S, bodyB * S, 0, 0, Math.PI * 2);
      c2.fill();
      c2.filter = "none";
      for (const [E, M] of [[G.eyeL, L], [G.eyeR, R]] as [number[], number[]][]) {
        c2.save();
        c2.translate(X(M[0]), Y(M[1]));
        c2.scale(1, open);
        c2.rotate((E[4] * Math.PI) / 180);
        const eg = c2.createLinearGradient(0, -E[3] * S, 0, E[3] * S);
        eg.addColorStop(0, css(eyeC));
        eg.addColorStop(1, css([eyeC[0] * 0.8 + bodyC[0] * 0.2, eyeC[1] * 0.8 + bodyC[1] * 0.2, eyeC[2] * 0.8 + bodyC[2] * 0.2]));
        c2.fillStyle = eg;
        c2.beginPath();
        c2.ellipse(0, 0, E[2] * S, E[3] * S, 0, 0, Math.PI * 2);
        c2.fill();
        c2.restore();
      }
      c2.restore();
      if (text.on && textCanvas) {
        const tc = document.createElement("canvas");
        tc.width = textCanvas.width;
        tc.height = textCanvas.height;
        const tx = tc.getContext("2d");
        if (tx) {
          tx.drawImage(textCanvas, 0, 0);
          tx.globalCompositeOperation = "source-in";
          tx.fillStyle = css(ink);
          tx.fillRect(0, 0, tc.width, tc.height);
          c2.drawImage(tc, X(text.x0), Y(text.y0));
        }
      }
    };

    const frame = (now: number) => {
      raf = 0;
      if (disposed) return;
      const p = props.current;
      const tSec = (now - t0) / 1000;
      const rawDt = tSec - lastT;
      // adaptive resolution: if frames keep running long, render fewer pixels (the glow is soft, the eyes stay smooth)
      if (p.time === undefined && !p.reduced && rawDt > 0.024 && rawDt < 0.2) slow++;
      else if (rawDt <= 0.02) slow = Math.max(0, slow - 1);
      if (slow > 45 && quality > 0.55) {
        quality *= 0.8;
        slow = 0;
        resize();
      }
      const dt = Math.min(0.05, Math.max(0, rawDt));
      lastT = tSec;
      const e = clamp(p.energy, 0, 1);
      if (p.time !== undefined) {
        if (dirty) draw(loopMotion(p.time, e), p.time);
        dirty = false;
        return;
      }
      if (p.reduced) {
        // resting frame, eyes still follow the pointer
        const g = pointerGaze() || [0, 0];
        const { omega, zeta } = springFor(0.3);
        const steps = Math.ceil(dt / (1 / 240));
        for (let i = 0; i < steps; i++) springStep(live, g[0], g[1], dt / Math.max(1, steps), omega, zeta);
        const moving = Math.abs(live.vx) + Math.abs(live.vy) + Math.abs(g[0] - live.gx) + Math.abs(g[1] - live.gy) > 1e-4;
        if (moving || dirty) draw({ ...live, vx: 0, vy: 0, blink: 0, duck: 0, breath: 0 }, 0);
        dirty = false;
        if (visible) raf = requestAnimationFrame(frame);
        return;
      }
      const amp = 0.7 + 0.6 * e;
      const idle = !pointer || tSec - pointer.at > 2.6;
      let target: [number, number];
      if (idle) {
        const lp = lookPath(tSec);
        target = [lp[0] * amp, lp[1] * amp];
      } else target = pointerGaze() || [0, 0];
      const { omega, zeta } = springFor(e);
      const steps = Math.max(1, Math.ceil(dt * 240));
      for (let i = 0; i < steps; i++) springStep(live, target[0], target[1], dt / steps, omega, zeta);
      // blinks at natural, irregular intervals
      if (tSec >= nextBlink) {
        blinkAt = tSec;
        doubleAt = Math.random() < 0.18 ? tSec + 0.27 : -10;
        nextBlink = tSec + (1.8 + Math.random() * 3.6) * (1.25 - 0.5 * e);
      }
      live.blink = Math.max(blinkShape(tSec - blinkAt), blinkShape(tSec - doubleAt));
      live.duck = duckShape(tSec - duckAt);
      live.breath = Math.sin((2 * Math.PI * tSec) / 5) * (0.5 + e);
      draw(live, tSec);
      if (visible) raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (!raf && visible && !disposed) raf = requestAnimationFrame(frame);
    };

    api.current.redraw = () => {
      dirty = true;
      kick();
    };
    api.current.text = () => {
      buildText();
      dirty = true;
      kick();
    };
    api.current.duck = () => {
      const p = props.current;
      if (p.reduced || p.time !== undefined) return;
      duckAt = (performance.now() - t0) / 1000;
      kick();
    };

    const toLocal = (ev: PointerEvent) => {
      const r = root.getBoundingClientRect();
      return { x: ev.clientX - r.left, y: ev.clientY - r.top };
    };
    const onMove = (ev: PointerEvent) => {
      const l = toLocal(ev);
      if (props.current.track === "container" && (l.x < 0 || l.y < 0 || l.x > W || l.y > H)) return;
      pointer = { ...l, at: (performance.now() - t0) / 1000 };
      kick();
    };
    const onLeave = () => {
      pointer = null;
      kick();
    };
    const winLeave = (ev: PointerEvent) => {
      if (!ev.relatedTarget) onLeave();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    const rootLeave = (ev: PointerEvent) => {
      if (props.current.track === "container" || ev.pointerType !== "mouse") onLeave();
    };
    root.addEventListener("pointerleave", rootLeave);
    document.addEventListener("pointerout", winLeave);

    const ro = new ResizeObserver(() => {
      resize();
      kick();
    });
    ro.observe(root);
    const io = new IntersectionObserver((ents) => {
      visible = ents.some((x) => x.isIntersecting) && !document.hidden;
      if (visible) {
        lastT = (performance.now() - t0) / 1000;
        dirty = true;
        kick();
      }
    });
    io.observe(root);
    const onVis = () => {
      visible = !document.hidden;
      if (visible) {
        lastT = (performance.now() - t0) / 1000;
        dirty = true;
        kick();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        if (disposed) return;
        textKey = "";
        buildText();
        kick();
      });
    }
    const onLost = (ev: Event) => ev.preventDefault();
    canvas.addEventListener("webglcontextlost", onLost);

    resize();
    kick();
    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      root.removeEventListener("pointerleave", rootLeave);
      document.removeEventListener("pointerout", winLeave);
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("webglcontextlost", onLost);
      // The context is not force-lost here: React StrictMode re-runs this effect on the
      // same <canvas>, and a lost context would leave the scene blank. The browser frees
      // it with the canvas on unmount.
    };
  }, []);

  React.useEffect(() => {
    api.current.text();
  }, [wordmark, font]);

  React.useEffect(() => {
    api.current.redraw();
  }, [color, eyeColor, background, glow, textColor, energy, aberration, floor, edgeSoftness, time, reduced, track]);

  const peek = () => {
    if (!interactive) return;
    api.current.duck();
    onPeek?.();
  };
  const button = !!onPeek;
  const label = ariaLabel || `A glowing blue character peeking over a ledge${wordmark ? `, under the ${wordmark} wordmark` : ""}`;
  const cls = `ls-peek-blob-${uid}`;

  return (
    <div
      ref={rootRef}
      className={[cls, className].filter(Boolean).join(" ")}
      role={button ? "button" : "img"}
      aria-label={label}
      tabIndex={button ? 0 : undefined}
      onPointerDown={(e) => {
        if (e.button === 0) peek();
      }}
      onKeyDown={(e) => {
        if (!button) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          peek();
        }
      }}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 360,
        aspectRatio: "24 / 25",
        overflow: "hidden",
        background,
        cursor: interactive ? "pointer" : undefined,
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
        outline: "none",
        ...style,
      }}
    >
      {button ? (
        <style>{`.${cls}:focus-visible{box-shadow:inset 0 0 0 2px ${color},inset 0 0 0 5px ${glow};}`}</style>
      ) : null}
      <canvas ref={canvasRef} aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />
      {children ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: haloTop,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <div style={{ pointerEvents: "auto" }}>{children}</div>
        </div>
      ) : null}
    </div>
  );
}

export default PeekBlob;
