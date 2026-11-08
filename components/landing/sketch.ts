/* Pencil strokes for the landing page's drawings. Every stroke takes its
   own seed, so its wobble is identical on every render: things can move
   without their lines shimmering.                                  */

export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const wobble = (r: () => number, amt: number) => (r() - 0.5) * 2 * amt;

/* One hand-drawn stroke between two points: ends that wander a little,
   a middle that bows, and a tiny overshoot past the end            */
export function stroke(x1: number, y1: number, x2: number, y2: number, seed: number, amt = 1) {
  const r = rng(seed);
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const bow = Math.min(2.2, len * 0.015);
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const over = 1.5 + r() * 2;
  const mx = (x1 + x2) / 2 + wobble(r, bow) - uy * wobble(r, bow);
  const my = (y1 + y2) / 2 + wobble(r, bow) + ux * wobble(r, bow);
  return `M${(x1 + wobble(r, amt)).toFixed(1)},${(y1 + wobble(r, amt)).toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${(x2 + ux * over + wobble(r, amt)).toFixed(1)},${(y2 + uy * over + wobble(r, amt)).toFixed(1)}`;
}

/* The same line gone over twice, the way a pencil does it */
export const twice = (x1: number, y1: number, x2: number, y2: number, seed: number) =>
  `${stroke(x1, y1, x2, y2, seed)} ${stroke(x1, y1, x2, y2, seed + 101, 1.4)}`;

/* A rounded box drawn freehand: four sides, corners turned with a curve */
export function box(x: number, y: number, w: number, h: number, rad: number, seed: number) {
  const pass = (s: number, amt: number) => {
    const r = rng(s);
    const j = () => wobble(r, amt);
    const q = (cx: number, cy: number, ex: number, ey: number) =>
      `Q${(cx + j()).toFixed(1)},${(cy + j()).toFixed(1)} ${(ex + j()).toFixed(1)},${(ey + j()).toFixed(1)}`;
    return [
      `M${(x + rad + j()).toFixed(1)},${(y + j()).toFixed(1)}`,
      q(x + w / 2, y + j() * 0.6, x + w - rad, y),
      q(x + w, y, x + w, y + rad),
      q(x + w + j() * 0.5, y + h / 2, x + w, y + h - rad),
      q(x + w, y + h, x + w - rad, y + h),
      q(x + w / 2, y + h + j() * 0.6, x + rad, y + h),
      q(x, y + h, x, y + h - rad),
      q(x + j() * 0.5, y + h / 2, x, y + rad),
      q(x, y, x + rad + 2, y - 0.5),
    ].join(" ");
  };
  return `${pass(seed, 0.9)} ${pass(seed + 57, 1.3)}`;
}

/* A loose curved arrow from a note to the thing it's about. `bend` pushes
   the curve sideways; negative bends the other way.               */
export function arrow(x1: number, y1: number, x2: number, y2: number, bend: number, seed: number, head = 6) {
  const r = rng(seed);
  const cx = (x1 + x2) / 2 - (y2 - y1) * bend * 0.01;
  const cy = (y1 + y2) / 2 + (x2 - x1) * bend * 0.01;
  const a = Math.atan2(y2 - cy, x2 - cx);
  const h1 = a + Math.PI - 0.45 + wobble(r, 0.08);
  const h2 = a + Math.PI + 0.45 + wobble(r, 0.08);
  return [
    `M${x1},${y1} Q${cx.toFixed(1)},${cy.toFixed(1)} ${x2},${y2}`,
    `M${x2},${y2} L${(x2 + Math.cos(h1) * head).toFixed(1)},${(y2 + Math.sin(h1) * head).toFixed(1)}`,
    `M${x2},${y2} L${(x2 + Math.cos(h2) * head).toFixed(1)},${(y2 + Math.sin(h2) * head).toFixed(1)}`,
  ].join(" ");
}

/* Pencil shading: short diagonal strokes, not quite parallel */
export function hatch(x0: number, x1: number, top: (x: number) => number, bottom: number, seed: number, gap = 8) {
  const r = rng(seed);
  const out: string[] = [];
  for (let x = x0; x < x1; x += gap + wobble(r, 1.5)) {
    const t = top(x) + 2 + r() * 2;
    const len = Math.min(bottom - t, 12 + r() * 8);
    out.push(`M${x.toFixed(1)},${t.toFixed(1)} L${(x - len * 0.6 + wobble(r, 1)).toFixed(1)},${(t + len).toFixed(1)}`);
  }
  return out.join(" ");
}

/* A scribble: a zigzag that thins out at its ends */
export function scribble(cx: number, cy: number, w: number, h: number, seed: number) {
  const r = rng(seed);
  const pts: string[] = [];
  for (let i = 0; i <= 22; i++) {
    const t = i / 22;
    const x = cx - w / 2 + t * w + wobble(r, 2);
    const spread = Math.sin(t * Math.PI) * h;
    const y = cy + (i % 2 ? spread : -spread * 0.3) + wobble(r, 0.8);
    pts.push(`${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(" ");
}

/* A loose underline, the kind drawn under a signature */
export function underline(x: number, y: number, w: number, seed: number) {
  const r = rng(seed);
  return `M${x},${y + wobble(r, 1)} C${x + w * 0.3},${y + 3 + wobble(r, 1.5)} ${x + w * 0.65},${y - 3 + wobble(r, 1.5)} ${x + w},${y + 1 + wobble(r, 1)}`;
}
