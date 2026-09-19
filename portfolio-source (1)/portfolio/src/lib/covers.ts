/**
 * Generated project covers.
 *
 * Every cover is an inline SVG data-URI, so it works with no network and no image hosting.
 * Projects use them when `image` is blank, fails to load, or is set to "cover:<kind>[:<palette>]".
 * Text is deliberately drawn as bars: SVGs loaded through <img> can't use web fonts.
 */

export type CoverKind = "dashboard" | "mobile" | "store" | "system" | "landing" | "kanban"
export type PaletteName = "ocean" | "coral" | "moss" | "sky" | "teal" | "graphite"

export const COVER_KINDS: CoverKind[] = ["dashboard", "mobile", "store", "system", "landing", "kanban"]
export const PALETTE_NAMES: PaletteName[] = ["ocean", "coral", "moss", "sky", "teal", "graphite"]

interface Palette {
  bgA: string
  bgB: string
  surface: string
  surface2: string
  line: string
  ink: string
  mute: string
  accent: string
  accent2: string
  onAccent: string
  bezel: string
}

const PALETTES: Record<PaletteName, Palette> = {
  ocean: { bgA: "#0E2A4F", bgB: "#1D5A9E", surface: "#F6F9FD", surface2: "#E6EEF8", line: "#D3DEEC", ink: "#0F1E33", mute: "#8CA0BA", accent: "#0B6CFF", accent2: "#FFC21A", onAccent: "#FFFFFF", bezel: "#0A1524" },
  coral: { bgA: "#FF6A45", bgB: "#FF9E62", surface: "#FFF8F4", surface2: "#FFE9DF", line: "#F6D3C3", ink: "#2A1510", mute: "#C49A8A", accent: "#1B2A49", accent2: "#FFC21A", onAccent: "#FFFFFF", bezel: "#2A1510" },
  moss: { bgA: "#C4DABB", bgB: "#EAF2DF", surface: "#FFFFFF", surface2: "#EFF5E9", line: "#D5E3CC", ink: "#15301F", mute: "#8FAA95", accent: "#2C7A4B", accent2: "#F2B234", onAccent: "#FFFFFF", bezel: "#15301F" },
  sky: { bgA: "#B3D3F5", bgB: "#EAF3FD", surface: "#FFFFFF", surface2: "#EEF4FB", line: "#D7E3F1", ink: "#0E1B2E", mute: "#8EA2BD", accent: "#0B6CFF", accent2: "#FF6A45", onAccent: "#FFFFFF", bezel: "#0E1B2E" },
  teal: { bgA: "#0A4E55", bgB: "#12808A", surface: "#F4FBFB", surface2: "#DFF1F2", line: "#C4E2E4", ink: "#0B2A2E", mute: "#7FA9AD", accent: "#0E8C96", accent2: "#FFCE5C", onAccent: "#FFFFFF", bezel: "#062A2E" },
  graphite: { bgA: "#141922", bgB: "#2B3542", surface: "#1E2531", surface2: "#28313F", line: "#374255", ink: "#F0F4F8", mute: "#7C8BA0", accent: "#FFC21A", accent2: "#4DA3FF", onAccent: "#161A20", bezel: "#0A0D12" },
}

/* ---------- tiny SVG helpers ---------- */

type P = Palette

const rect = (x: number, y: number, w: number, h: number, rx: number, fill: string, attrs = "") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"${attrs ? " " + attrs : ""}/>`
const pill = (x: number, y: number, w: number, h: number, fill: string, op = 1) =>
  rect(x, y, w, h, h / 2, fill, op < 1 ? `opacity="${op}"` : "")
const circle = (cx: number, cy: number, r: number, fill: string, attrs = "") =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"${attrs ? " " + attrs : ""}/>`
const card = (p: P, x: number, y: number, w: number, h: number, rx = 18) =>
  rect(x, y, w, h, rx, p.surface, `stroke="${p.line}" stroke-width="2"`)
const poly = (pts: number[][], stroke: string, w: number, extra = "") =>
  `<polyline points="${pts.map((q) => q.join(",")).join(" ")}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`

let uid = 0

function browser(p: P, x: number, y: number, w: number, h: number, inner: string) {
  const id = `c${uid++}`
  return `
  <g filter="url(#sh)">${rect(x, y, w, h, 22, p.surface)}</g>
  <clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22"/></clipPath>
  <g clip-path="url(#${id})">
    ${rect(x, y, w, 58, 0, p.surface2)}
    ${rect(x, y + 58, w, 2, 0, p.line)}
    ${circle(x + 36, y + 29, 7, p.mute, 'opacity=".5"')}${circle(x + 60, y + 29, 7, p.mute, 'opacity=".5"')}${circle(x + 84, y + 29, 7, p.mute, 'opacity=".5"')}
    ${rect(x + w / 2 - 190, y + 14, 380, 30, 15, p.surface, `stroke="${p.line}" stroke-width="2"`)}
    ${pill(x + w / 2 - 60, y + 25, 120, 8, p.mute, 0.5)}
    ${inner}
  </g>`
}

function phone(p: P, x: number, y: number, w: number, h: number, inner: (sx: number, sy: number, sw: number, sh: number) => string) {
  const id = `c${uid++}`
  const sx = x + 10
  const sy = y + 10
  const sw = w - 20
  const sh = h - 20
  return `
  <g filter="url(#sh)">${rect(x, y, w, h, 52, p.bezel)}</g>
  <clipPath id="${id}"><rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" rx="42"/></clipPath>
  <g clip-path="url(#${id})">${rect(sx, sy, sw, sh, 0, p.surface)}${inner(sx, sy, sw, sh)}</g>
  ${pill(x + w / 2 - 44, y + 22, 88, 24, p.bezel)}`
}

/* ---------- scenes ---------- */

function dashboard(p: P) {
  const X = 150, Y = 110, W = 1300, H = 780
  const nav = [0, 1, 2, 3, 4, 5]
    .map((i) => {
      const y = 282 + i * 58
      return i === 0
        ? rect(174, y - 14, 162, 46, 12, p.accent, 'opacity=".14"') + rect(190, y, 20, 20, 6, p.accent) + pill(222, y + 3, 86, 14, p.accent, 0.9)
        : rect(190, y, 20, 20, 6, p.mute, 'opacity=".45"') + pill(222, y + 3, 60 + ((i * 23) % 40), 14, p.mute, 0.4)
    })
    .join("")

  const kpis = [0, 1, 2]
    .map((i) => {
      const x = 396 + i * 347
      const color = i === 2 ? p.accent2 : p.accent
      const spark = [0, 1, 2, 3, 4, 5].map((k) => [x + 196 + k * 22, 396 - [0.3, 0.5, 0.42, 0.7, 0.62, 0.9][(k + i * 2) % 6] * 62])
      return (
        card(p, x, 290, 332, 152) +
        pill(x + 26, 316, 96, 12, p.mute, 0.55) +
        rect(x + 26, 346, 150 + i * 14, 34, 9, p.ink, 'opacity=".9"') +
        rect(x + 26, 398, 84, 28, 14, color, 'opacity=".18"') +
        circle(x + 42, 412, 5, color) +
        pill(x + 54, 407, 42, 10, color, 0.9) +
        poly(spark, color, 5)
      )
    })
    .join("")

  const d1 = [0.42, 0.55, 0.48, 0.66, 0.6, 0.78, 0.7, 0.9, 0.82, 0.96]
  const d2 = [0.3, 0.34, 0.4, 0.38, 0.46, 0.44, 0.52, 0.5, 0.58, 0.62]
  const pt = (d: number[]) => d.map((v, i) => [430 + i * (580 / 9), Math.round(800 - v * 250)])
  const p1 = pt(d1)
  const area = `M430,800 ${p1.map((q) => `L${q[0]},${q[1]}`).join(" ")} L1010,800 Z`
  const hi = p1[7]
  const chart =
    card(p, 396, 466, 644, 390) +
    pill(422, 494, 150, 16, p.ink, 0.85) +
    circle(880, 502, 6, p.accent) + pill(894, 496, 44, 12, p.mute, 0.5) +
    circle(966, 502, 6, p.accent2) + pill(980, 496, 44, 12, p.mute, 0.5) +
    [0, 1, 2, 3].map((i) => rect(430, 550 + i * 83, 580, 2, 0, p.line)).join("") +
    `<path d="${area}" fill="url(#area)"/>` +
    poly(p1, p.accent, 6) +
    poly(pt(d2), p.accent2, 5, 'stroke-dasharray="2 13"') +
    circle(hi[0], hi[1], 16, p.accent, 'opacity=".2"') +
    circle(hi[0], hi[1], 8, p.surface, `stroke="${p.accent}" stroke-width="5"`) +
    rect(hi[0] - 58, hi[1] - 82, 116, 46, 12, p.ink) +
    pill(hi[0] - 38, hi[1] - 66, 76, 8, p.surface, 0.85) + pill(hi[0] - 38, hi[1] - 52, 48, 8, p.mute, 0.8) +
    p1.map((q) => pill(q[0] - 14, 826, 28, 10, p.mute, 0.4)).join("")

  const C = 540.35
  const donut =
    card(p, 1066, 466, 356, 390) +
    pill(1092, 494, 110, 16, p.ink, 0.85) +
    circle(1244, 650, 86, "none", `stroke="${p.surface2}" stroke-width="30"`) +
    circle(1244, 650, 86, "none", `stroke="${p.accent}" stroke-width="30" stroke-dasharray="302 ${C}" transform="rotate(-90 1244 650)" stroke-linecap="butt"`) +
    circle(1244, 650, 86, "none", `stroke="${p.accent2}" stroke-width="30" stroke-dasharray="118 ${C}" stroke-dashoffset="-306" transform="rotate(-90 1244 650)"`) +
    pill(1214, 640, 60, 18, p.ink, 0.85) + pill(1224, 668, 40, 10, p.mute, 0.5) +
    circle(1100, 786, 6, p.accent) + pill(1116, 780, 96, 12, p.ink, 0.6) + pill(1340, 780, 54, 12, p.mute, 0.5) +
    circle(1100, 818, 6, p.accent2) + pill(1116, 812, 76, 12, p.ink, 0.6) + pill(1350, 812, 44, 12, p.mute, 0.5)

  const inner =
    rect(150, 168, 210, 722, 0, p.surface2) + rect(360, 168, 2, 722, 0, p.line) +
    rect(186, 204, 34, 34, 10, p.accent) + pill(230, 213, 92, 16, p.ink, 0.85) +
    nav +
    circle(212, 842, 20, p.accent2) + pill(244, 828, 80, 12, p.ink, 0.7) + pill(244, 848, 56, 10, p.mute, 0.5) +
    pill(396, 208, 230, 28, p.ink, 0.92) + pill(396, 250, 340, 14, p.mute, 0.5) +
    rect(1084, 206, 220, 44, 22, p.surface2) + circle(1108, 228, 8, "none", `stroke="${p.mute}" stroke-width="3"`) + pill(1128, 222, 80, 10, p.mute, 0.5) +
    circle(1350, 228, 22, p.accent2) +
    kpis + chart + donut

  return browser(p, X, Y, W, H, inner)
}

function mobile(p: P) {
  const centre = phone(p, 640, 84, 320, 832, (sx, sy, sw) => {
    const list = [0, 1, 2]
      .map((i) => {
        const y = sy + 384 + i * 84
        const c = [p.accent, p.accent2, p.mute][i]
        return rect(sx + 20, y, sw - 40, 68, 20, p.surface2) + circle(sx + 56, y + 34, 18, c) + pill(sx + 86, y + 20, 100 + i * 10, 12, p.ink, 0.8) + pill(sx + 86, y + 40, 70, 9, p.mute, 0.55) + rect(sx + sw - 88, y + 22, 52, 24, 12, c, 'opacity=".2"')
      })
      .join("")
    const bars = [30, 52, 40, 70, 58, 84].map((h, i) => rect(sx + 176 + i * 16, sy + 340 - h, 10, h, 5, p.onAccent, 'opacity=".4"')).join("")
    return (
      pill(sx + 32, sy + 62, 44, 10, p.ink, 0.6) + pill(sx + sw - 76, sy + 62, 44, 10, p.ink, 0.6) +
      circle(sx + 46, sy + 120, 22, p.accent2) + pill(sx + 82, sy + 106, 112, 14, p.ink, 0.85) + pill(sx + 82, sy + 128, 72, 10, p.mute, 0.55) +
      rect(sx + 20, sy + 166, sw - 40, 190, 28, p.accent) +
      pill(sx + 46, sy + 194, 96, 11, p.onAccent, 0.7) + rect(sx + 46, sy + 220, 140, 36, 10, p.onAccent, 'opacity=".95"') + bars +
      rect(sx + 46, sy + 292, 112, 40, 20, p.accent2) + pill(sx + 66, sy + 308, 72, 8, p.ink, 0.8) +
      list +
      rect(sx + 20, sy + 660, sw - 40, 64, 32, p.ink, 'opacity=".95"') +
      [0, 1, 2, 3].map((i) => circle(sx + 66 + i * 56, sy + 692, i === 0 ? 11 : 9, i === 0 ? p.accent2 : p.surface, i === 0 ? "" : 'opacity=".6"')).join("")
    )
  })

  const left = phone(p, 236, 176, 300, 744, (sx, sy, sw, sh) => {
    const roads = [
      `M${sx - 10},${sy + 210} C${sx + 90},${sy + 190} ${sx + 150},${sy + 300} ${sx + sw + 10},${sy + 260}`,
      `M${sx + 70},${sy + 60} C${sx + 90},${sy + 200} ${sx + 40},${sy + 330} ${sx + 110},${sy + 470}`,
      `M${sx + 210},${sy + 40} C${sx + 190},${sy + 180} ${sx + 240},${sy + 300} ${sx + 200},${sy + 470}`,
    ]
      .map((d) => `<path d="${d}" fill="none" stroke="${p.surface}" stroke-width="20" stroke-linecap="round"/>`)
      .join("")
    return (
      rect(sx, sy, sw, sh, 0, p.surface2) + roads +
      `<path d="M${sx + 60},${sy + 130} C${sx + 90},${sy + 220} ${sx + 200},${sy + 200} ${sx + 210},${sy + 340}" fill="none" stroke="${p.accent}" stroke-width="9" stroke-linecap="round" stroke-dasharray="1 18"/>` +
      circle(sx + 60, sy + 130, 14, p.accent, `stroke="${p.surface}" stroke-width="5"`) +
      circle(sx + 210, sy + 340, 18, p.accent2, `stroke="${p.surface}" stroke-width="6"`) +
      rect(sx + 16, sy + sh - 270, sw - 32, 256, 30, p.surface, `stroke="${p.line}" stroke-width="2"`) +
      pill(sx + sw / 2 - 26, sy + sh - 256, 52, 6, p.line) +
      pill(sx + 40, sy + sh - 226, 130, 16, p.ink, 0.85) + pill(sx + 40, sy + sh - 198, 96, 10, p.mute, 0.55) +
      [0, 1, 2].map((i) => rect(sx + 40, sy + sh - 160 + i * 42, sw - 80, 30, 15, i === 0 ? p.accent : p.surface2, i === 0 ? 'opacity=".9"' : "")).join("")
    )
  })

  const right = phone(p, 1064, 176, 300, 744, (sx, sy, sw) => {
    const C = 2 * Math.PI * 88
    const cx = sx + sw / 2
    return (
      pill(sx + 32, sy + 62, 44, 10, p.ink, 0.6) + pill(sx + sw - 76, sy + 62, 44, 10, p.ink, 0.6) +
      pill(sx + 30, sy + 100, 130, 16, p.ink, 0.85) +
      circle(cx, sy + 260, 88, "none", `stroke="${p.surface2}" stroke-width="24"`) +
      circle(cx, sy + 260, 88, "none", `stroke="${p.accent}" stroke-width="24" stroke-linecap="round" stroke-dasharray="${(C * 0.72).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 ${cx} ${sy + 260})"`) +
      pill(cx - 34, sy + 248, 68, 20, p.ink, 0.85) + pill(cx - 24, sy + 278, 48, 9, p.mute, 0.55) +
      [0, 1, 2, 3].map((i) => {
        const y = sy + 392 + i * 66
        return rect(sx + 24, y, sw - 48, 54, 18, p.surface2) + circle(sx + 54, y + 27, 13, i < 3 ? p.accent : "none", i < 3 ? "" : `stroke="${p.mute}" stroke-width="3"`) + pill(sx + 80, y + 21, 90 + (i % 2) * 20, 11, p.ink, 0.75) + pill(sx + sw - 76, y + 22, 34, 10, p.mute, 0.5)
      }).join("")
    )
  })

  return left + right + centre
}

function store(p: P) {
  const tints = [p.accent, p.accent2, p.mute, p.accent]
  const opac = [0.14, 0.3, 0.25, 0.28]
  const products = [0, 1, 2, 3]
    .map((i) => {
      const x = 186 + i * 312.6
      const cx = x + 145
      const shape = [
        circle(cx, 668, 66, p.accent2),
        rect(cx - 62, 596, 124, 158, 62, p.accent),
        `<path d="M${cx - 70},752 L${cx},600 L${cx + 70},752 Z" fill="${p.ink}" opacity=".88"/>`,
        circle(cx - 34, 690, 44, p.accent) + circle(cx + 40, 650, 34, p.accent2),
      ][i]
      return (
        card(p, x, 550, 290, 350, 20) +
        rect(x + 14, 564, 262, 204, 14, tints[i], `opacity="${opac[i]}"`) +
        shape +
        pill(x + 18, 792, 140, 14, p.ink, 0.85) + pill(x + 18, 816, 92, 10, p.mute, 0.5) +
        rect(x + 200, 786, 72, 30, 15, p.accent, 'opacity=".14"') + pill(x + 214, 797, 44, 8, p.accent)
      )
    })
    .join("")

  const inner =
    circle(212, 210, 18, p.accent) + pill(242, 202, 96, 16, p.ink, 0.85) +
    [0, 1, 2, 3].map((i) => pill(560 + i * 112, 204, 70, 12, p.mute, 0.55)).join("") +
    circle(1338, 210, 20, p.surface2) + circle(1384, 210, 20, p.accent) + pill(1372, 205, 24, 10, p.onAccent, 0.9) +
    rect(186, 262, 1228, 262, 22, p.accent, 'opacity=".13"') +
    pill(230, 300, 440, 40, p.ink, 0.92) + pill(230, 354, 340, 40, p.ink, 0.92) +
    pill(230, 414, 420, 14, p.mute, 0.6) + pill(230, 438, 360, 14, p.mute, 0.5) +
    rect(230, 470, 156, 40, 20, p.accent) + pill(258, 486, 100, 8, p.onAccent, 0.9) +
    circle(1130, 396, 150, p.accent) + circle(1000, 452, 84, p.accent2) +
    rect(1206, 302, 124, 210, 62, p.ink, 'opacity=".9"') + circle(1310, 478, 46, p.surface) +
    products

  return browser(p, 150, 110, 1300, 780, inner)
}

function system(p: P) {
  const ramp = (y: number, color: string, ops: number[]) => ops.map((o, i) => rect(190 + i * 68, y, 56, 56, 12, color, `opacity="${o}"`)).join("")
  const inner =
    pill(190, 204, 90, 14, p.ink, 0.85) +
    ramp(240, p.accent, [1, 0.8, 0.6, 0.4, 0.2]) + ramp(308, p.accent2, [1, 0.8, 0.6, 0.4, 0.2]) + ramp(376, p.ink, [0.95, 0.75, 0.5, 0.3, 0.12]) +
    pill(190, 470, 70, 14, p.ink, 0.85) +
    [0, 12, 28].map((r, i) => rect(190 + i * 110, 500, 90, 90, r, "none", `stroke="${p.accent}" stroke-width="4"`)).join("") +
    pill(190, 630, 70, 14, p.ink, 0.85) +
    [8, 16, 24, 32, 48, 64].map((w, i) => rect(190 + [0, 24, 58, 108, 176, 274][i], 664, w, 28, 4, p.accent, `opacity="${0.35 + i * 0.13}"`)).join("") +
    rect(580, 204, 384, 300, 20, p.surface2) +
    pill(612, 240, 190, 62, p.ink, 0.92) + pill(612, 322, 262, 30, p.ink, 0.8) +
    [0, 1, 2].map((i) => pill(612, 376 + i * 26, 300 - i * 40, 12, p.mute, 0.6)).join("") +
    card(p, 580, 530, 384, 340, 20) +
    [0, 1, 2, 3, 4].map((i) => {
      const y = 566 + i * 58
      return circle(618, y + 20, 14, i === 1 ? p.accent2 : p.accent, `opacity="${i === 1 ? 1 : 0.85 - i * 0.1}"`) + pill(650, y + 8, 120 + (i % 3) * 22, 12, p.ink, 0.75) + pill(650, y + 28, 80, 9, p.mute, 0.5) + rect(880, y + 6, 54, 26, 13, p.accent, 'opacity=".14"') + rect(596, y + 52, 352, 2, 0, p.line)
    }).join("") +
    rect(1000, 204, 130, 48, 12, p.accent) + pill(1030, 224, 70, 8, p.onAccent, 0.9) +
    rect(1146, 204, 130, 48, 12, "none", `stroke="${p.accent}" stroke-width="3"`) + pill(1176, 224, 70, 8, p.accent) +
    rect(1292, 204, 118, 48, 12, p.surface2) + pill(1318, 224, 66, 8, p.ink, 0.6) +
    rect(996, 282, 418, 64, 16, "none", `stroke="${p.accent}" stroke-width="6" opacity=".25"`) +
    rect(1000, 286, 410, 56, 12, p.surface, `stroke="${p.accent}" stroke-width="4"`) + pill(1024, 309, 150, 10, p.mute, 0.6) + rect(1180, 306, 3, 18, 1, p.accent) +
    rect(1000, 372, 84, 44, 22, p.accent) + circle(1062, 394, 16, "#fff") +
    rect(1104, 372, 84, 44, 22, p.line) + circle(1126, 394, 16, "#fff") +
    rect(1220, 378, 32, 32, 8, p.accent) + poly([[1228, 394], [1234, 401], [1245, 387]], "#fff", 4) +
    rect(1268, 378, 32, 32, 8, "none", `stroke="${p.mute}" stroke-width="3" opacity=".7"`) +
    circle(1348, 394, 16, "none", `stroke="${p.accent}" stroke-width="4"`) + circle(1348, 394, 7, p.accent) +
    rect(1000, 452, 410, 8, 4, p.line) + rect(1000, 452, 262, 8, 4, p.accent) + circle(1262, 456, 15, "#fff", `stroke="${p.accent}" stroke-width="4"`) +
    rect(1000, 496, 100, 34, 17, p.accent, 'opacity=".16"') + pill(1020, 509, 60, 8, p.accent) +
    rect(1112, 496, 100, 34, 17, p.accent2, 'opacity=".3"') + pill(1132, 509, 60, 8, p.ink, 0.6) +
    rect(1224, 496, 100, 34, 17, p.surface2) + pill(1244, 509, 60, 8, p.mute) +
    card(p, 1000, 566, 410, 304, 20) +
    rect(1016, 582, 378, 124, 12, p.accent, 'opacity=".16"') + circle(1205, 644, 34, p.accent) + circle(1250, 662, 18, p.accent2) +
    pill(1020, 730, 170, 14, p.ink, 0.85) + pill(1020, 756, 300, 10, p.mute, 0.5) + pill(1020, 774, 250, 10, p.mute, 0.5) +
    rect(1020, 806, 120, 40, 12, p.accent) + pill(1046, 823, 68, 8, p.onAccent, 0.9)
  return browser(p, 150, 110, 1300, 780, inner)
}

function landing(p: P) {
  const features = [0, 1, 2]
    .map((i) => {
      const x = 186 + i * 416
      return rect(x, 750, 396, 220, 22, p.surface2) + rect(x + 28, 780, 48, 48, 14, i === 1 ? p.accent2 : p.accent) + pill(x + 28, 850, 160, 16, p.ink, 0.85) + pill(x + 28, 878, 300, 10, p.mute, 0.5) + pill(x + 28, 898, 240, 10, p.mute, 0.5)
    })
    .join("")
  const inner =
    circle(212, 212, 17, p.accent) + pill(242, 205, 84, 14, p.ink, 0.85) +
    [0, 1, 2, 3].map((i) => pill(880 + i * 92, 206, 60, 12, p.mute, 0.55)).join("") +
    rect(1290, 190, 124, 44, 22, p.ink) + pill(1318, 208, 68, 8, p.surface, 0.9) +
    pill(210, 300, 560, 66, p.ink, 0.92) + pill(210, 386, 470, 66, p.ink, 0.92) + pill(210, 472, 330, 66, p.accent, 0.95) +
    pill(210, 574, 500, 16, p.mute, 0.6) + pill(210, 602, 420, 16, p.mute, 0.5) +
    rect(210, 654, 190, 56, 28, p.accent) + pill(246, 678, 118, 8, p.onAccent, 0.9) +
    rect(418, 654, 172, 56, 28, "none", `stroke="${p.ink}" stroke-width="3" opacity=".35"`) + pill(450, 678, 108, 8, p.ink, 0.6) +
    circle(1130, 450, 262, "none", `stroke="${p.accent}" stroke-width="3" stroke-dasharray="3 15" stroke-linecap="round" opacity=".5"`) +
    circle(1130, 450, 192, p.accent) +
    rect(1008, 344, 172, 300, 86, p.accent2) +
    circle(1262, 560, 64, p.ink, 'opacity=".92"') + circle(1006, 628, 42, p.surface, `stroke="${p.line}" stroke-width="3"`) +
    `<g filter="url(#sh2)">${rect(1176, 262, 196, 82, 18, p.surface)}</g>` +
    circle(1210, 303, 16, p.accent2) + pill(1238, 292, 96, 12, p.ink, 0.8) + pill(1238, 312, 64, 9, p.mute, 0.55) +
    features
  return browser(p, 150, 110, 1300, 780, inner)
}

function kanban(p: P) {
  const cols = [p.accent, p.accent2, p.mute]
  const kc = (x: number, y: number, h: number, c: string, opts: { drag?: boolean } = {}) => {
    const w = 390
    const body =
      rect(x + 14, y, w - 28, h, 16, p.surface, `stroke="${opts.drag ? p.accent : p.line}" stroke-width="${opts.drag ? 4 : 2}"`) +
      pill(x + 36, y + 24, w - 130, 13, p.ink, 0.85) + pill(x + 36, y + 48, w - 190, 10, p.mute, 0.5) +
      rect(x + 36, y + h - 48, 60, 22, 11, c, 'opacity=".2"') + rect(x + 106, y + h - 48, 48, 22, 11, p.line) +
      circle(x + w - 56, y + h - 37, 14, c)
    return opts.drag ? `<g filter="url(#sh2)" transform="rotate(-2.2 ${x + w / 2} ${y + h / 2})">${body}</g>` : body
  }
  const columns = [0, 1, 2]
    .map((i) => {
      const x = 190 + i * 415
      return (
        rect(x, 262, 390, 700, 20, p.surface2) +
        circle(x + 32, 298, 7, cols[i]) + pill(x + 50, 291, 96, 13, p.ink, 0.8) + rect(x + 328, 286, 42, 24, 12, p.line)
      )
    })
    .join("")
  const inner =
    pill(190, 202, 210, 28, p.ink, 0.92) +
    [0, 1, 2].map((i) => circle(1188 + i * 34, 217, 19, [p.accent2, p.accent, p.mute][i], `stroke="${p.surface}" stroke-width="4"`)).join("") +
    rect(1296, 195, 118, 44, 22, p.accent) + pill(1322, 213, 66, 8, p.onAccent, 0.9) +
    columns +
    kc(190, 334, 134, p.accent) + kc(190, 480, 114, p.accent2) + kc(190, 616, 142, p.mute) +
    kc(605, 334, 120, p.accent2) + kc(605, 470, 154, p.accent, { drag: true }) + kc(605, 644, 122, p.mute) +
    kc(1020, 334, 142, p.accent) + kc(1020, 492, 114, p.accent2) +
    rect(1034, 620, 362, 92, 16, "none", `stroke="${p.mute}" stroke-width="3" stroke-dasharray="10 10" opacity=".7"`)
  return browser(p, 150, 110, 1300, 780, inner)
}

const SCENES: Record<CoverKind, (p: P) => string> = { dashboard, mobile, store, system, landing, kanban }

/* ---------- public API ---------- */

const cache = new Map<string, string>()

export function coverDataUri(kind: CoverKind, palette: PaletteName): string {
  const key = `${kind}:${palette}`
  const hit = cache.get(key)
  if (hit) return hit
  uid = 0
  const p = PALETTES[palette]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p.bgA}"/><stop offset="1" stop-color="${p.bgB}"/></linearGradient>
  <linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.accent}" stop-opacity=".34"/><stop offset="1" stop-color="${p.accent}" stop-opacity="0"/></linearGradient>
  <pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.6" fill="#fff" opacity=".16"/></pattern>
  <filter id="sh" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="30" stdDeviation="30" flood-color="#000" flood-opacity=".3"/></filter>
  <filter id="sh2" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#000" flood-opacity=".22"/></filter>
</defs>
<rect width="1600" height="1000" fill="url(#bg)"/><rect width="1600" height="1000" fill="url(#dots)"/>
${SCENES[kind](p)}
</svg>`
  const uri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  cache.set(key, uri)
  return uri
}

function hash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Deterministic fallback so a project without an image always looks the same. */
export function fallbackCover(seed: string): string {
  const h = hash(seed || "project")
  return coverDataUri(COVER_KINDS[h % COVER_KINDS.length], PALETTE_NAMES[(h >>> 4) % PALETTE_NAMES.length])
}

/** Turns a project's `image` field into something an <img> can load. */
export function resolveImage(image: string, seed: string): { src: string; generated: boolean } {
  const value = (image || "").trim()
  if (!value) return { src: fallbackCover(seed), generated: true }
  if (value.startsWith("cover:")) {
    const [, kind, palette] = value.split(":")
    const k = COVER_KINDS.includes(kind as CoverKind) ? (kind as CoverKind) : COVER_KINDS[hash(seed) % COVER_KINDS.length]
    const pal = PALETTE_NAMES.includes(palette as PaletteName) ? (palette as PaletteName) : PALETTE_NAMES[(hash(seed) >>> 4) % PALETTE_NAMES.length]
    return { src: coverDataUri(k, pal), generated: true }
  }
  return { src: value, generated: false }
}
