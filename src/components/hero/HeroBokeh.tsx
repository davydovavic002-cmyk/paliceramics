"use client";

import { useEffect, useRef } from "react";

const BOKEH_RGB = "251, 250, 247";

type Lobe = {
  /** offset along / across the smear axis, in units of the spot radius */
  dx: number;
  dy: number;
  /** lobe radius relative to the spot radius */
  size: number;
  /** horizontal stretch of the lobe (sx / sy) */
  aspect: number;
  rotate: number;
  alpha: number;
  morph: number;
};

type Spot = {
  /** anchor in 0..1 of the canvas box */
  x: number;
  y: number;
  /** radius as a fraction of the shorter side */
  r: number;
  /** smear axis angle, degrees — echoes the hakeme stroke rotations */
  rotate: number;
  skewX: number;
  /** how far the lobes spread along the axis */
  length: number;
  /** visible peak strength of the smear against the dark band, 0..1 of full white */
  strength: number;
  /** parallax travel in CSS px at full pointer offset — near smears move most */
  parallax: number;
  driftX: number;
  driftY: number;
  speed: number;
  phase: number;
  lobes: Lobe[];
};

type SpotSeed = Omit<Spot, "lobes" | "driftX" | "driftY" | "speed" | "phase"> & {
  seed: number;
  lobeCount: number;
};

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Uneven cluster of thick, stretched lobes strung along the smear axis, like a loaded brush drag. */
function buildLobes(rand: () => number, count: number): Lobe[] {
  return Array.from({ length: count }, (_, i) => {
    const along = count === 1 ? 0 : (i / (count - 1)) * 2 - 1;
    const taper = 1 - Math.abs(along) * 0.4;
    return {
      dx: along + (rand() - 0.5) * 0.35,
      dy: (rand() - 0.5) * 0.6,
      size: (0.68 + rand() * 0.5) * taper,
      aspect: 1.35 + rand() * 1.1,
      rotate: (rand() - 0.5) * 0.7,
      alpha: 0.3 + rand() * 0.3,
      morph: rand() * Math.PI * 2,
    };
  });
}

function withLobes(seeds: SpotSeed[]): Spot[] {
  return seeds.map(({ seed, lobeCount, ...spot }) => {
    const rand = mulberry32(seed);
    return {
      ...spot,
      driftX: 0.012 + rand() * 0.014,
      driftY: 0.01 + rand() * 0.014,
      speed: 0.035 + rand() * 0.03,
      phase: rand() * Math.PI * 2,
      lobes: buildLobes(rand, lobeCount),
    };
  });
}

/**
 * A few large, hand-placed smears along the edges, deliberately unbalanced: one heavy
 * diagonal accent top-left, the rest sparse. Rotations stay within ±41° so the breathing
 * sway keeps them inside ±45°. Accents (top-left, bottom-right, top-right) are dense and near;
 * the rest are muted and far.
 */
const DESKTOP_SPOTS = withLobes([
  { x: 0.13, y: 0.21, r: 0.23, rotate: -37, skewX: -9, length: 1.9, strength: 0.4, parallax: 65, seed: 11, lobeCount: 6 },
  { x: 0.87, y: 0.12, r: 0.15, rotate: 14, skewX: 5, length: 1.7, strength: 0.35, parallax: 44, seed: 37, lobeCount: 5 },
  { x: 0.05, y: 0.63, r: 0.13, rotate: 41, skewX: -4, length: 1.75, strength: 0.21, parallax: 14, seed: 67, lobeCount: 4 },
  { x: 0.84, y: 0.88, r: 0.17, rotate: -26, skewX: -8, length: 1.65, strength: 0.37, parallax: 56, seed: 41, lobeCount: 5 },
  { x: 0.23, y: 0.95, r: 0.12, rotate: 6, skewX: 6, length: 2.05, strength: 0.16, parallax: 10, seed: 29, lobeCount: 4 },
]);

const TABLET_SPOTS = withLobes([
  { x: 0.12, y: 0.18, r: 0.24, rotate: -36, skewX: -9, length: 1.75, strength: 0.38, parallax: 28, seed: 11, lobeCount: 5 },
  { x: 0.9, y: 0.13, r: 0.15, rotate: 14, skewX: 5, length: 1.6, strength: 0.3, parallax: 18, seed: 37, lobeCount: 5 },
  { x: 0.05, y: 0.66, r: 0.13, rotate: 41, skewX: -4, length: 1.65, strength: 0.2, parallax: 8, seed: 67, lobeCount: 4 },
  { x: 0.86, y: 0.88, r: 0.18, rotate: -26, skewX: -8, length: 1.6, strength: 0.36, parallax: 24, seed: 41, lobeCount: 5 },
]);

const MOBILE_SPOTS = withLobes([
  { x: 0.08, y: 0.13, r: 0.34, rotate: -34, skewX: -9, length: 1.65, strength: 0.46, parallax: 0, seed: 11, lobeCount: 5 },
  { x: 0.97, y: 0.4, r: 0.2, rotate: 18, skewX: 6, length: 1.5, strength: 0.28, parallax: 0, seed: 37, lobeCount: 4 },
  { x: 0.84, y: 0.9, r: 0.27, rotate: -39, skewX: -7, length: 1.55, strength: 0.42, parallax: 0, seed: 41, lobeCount: 5 },
]);

const DEG = Math.PI / 180;

/** Canvas is rendered at a fraction of CSS size; the upscale adds extra softness for free. */
const RENDER_SCALE = 0.35;
/** breathing-only frame cap; pointer follow runs at display refresh until settled */
const FRAME_MS = 1000 / 30;
/** exponential follow rate towards the pointer, per second (frame-rate independent) */
const PARALLAX_RATE = 4;
/** normalized pointer distance below which the follow counts as settled */
const PARALLAX_EPSILON = 0.001;
/** cross-axis fattening of the lobes, for a denser, oilier smear */
const LOBE_THICKNESS = 1.28;
/** the CSS blur flattens each smear's peak by roughly this factor (measured in screenshots) */
const BLUR_PEAK_LOSS = 1.1;

/* unit-radius gradient; each lobe's transform stretches it into a soft ellipse */
function createLobeGradient(c: CanvasRenderingContext2D) {
  const g = c.createRadialGradient(0, 0, 0, 0, 0, 1);
  g.addColorStop(0, `rgba(${BOKEH_RGB}, 1)`);
  g.addColorStop(0.35, `rgba(${BOKEH_RGB}, 0.55)`);
  g.addColorStop(0.7, `rgba(${BOKEH_RGB}, 0.16)`);
  g.addColorStop(1, `rgba(${BOKEH_RGB}, 0)`);
  return g;
}

function drawSpot(
  c: CanvasRenderingContext2D,
  s: Spot,
  t: number,
  cx: number,
  cy: number,
  minSide: number,
  gain: number,
) {
  const a = t * s.speed + s.phase;
  const r = s.r * minSide * (1 + Math.sin(a * 0.6) * 0.06);

  c.save();
  c.translate(cx, cy);
  c.rotate((s.rotate + Math.sin(a * 0.5) * 4) * DEG);
  c.transform(1, 0, Math.tan(s.skewX * DEG), 1, 0, 0);

  for (const lobe of s.lobes) {
    const m = a * 1.7 + lobe.morph;
    c.save();
    c.translate((lobe.dx * s.length + Math.sin(m) * 0.12) * r, (lobe.dy + Math.cos(m * 0.9) * 0.08) * r);
    c.rotate(lobe.rotate + Math.sin(m * 0.7) * 0.12);
    const size = lobe.size * r * (1 + Math.sin(m * 1.3) * 0.08);
    c.scale(size * lobe.aspect, size * LOBE_THICKNESS);
    c.globalAlpha = Math.min(1, lobe.alpha * gain);
    c.fillRect(-1, -1, 2, 2);
    c.restore();
  }

  c.restore();
  c.globalAlpha = 1;
}

/**
 * Overlapping lobes composite non-linearly, so solve per spot for the lobe gain that makes the
 * rendered peak alpha land on `strength` (a few fixed-point steps converge).
 */
function solveGains(spots: Spot[], width: number, height: number): Map<Spot, number> {
  const gains = new Map<Spot, number>();
  const probe = document.createElement("canvas");
  probe.width = width;
  probe.height = height;
  const c = probe.getContext("2d", { willReadFrequently: true });
  if (!c) return gains;
  c.fillStyle = createLobeGradient(c);
  const minSide = Math.min(width, height);
  const target = (s: Spot) => Math.min(0.95, s.strength * BLUR_PEAK_LOSS);

  for (const s of spots) {
    let gain = target(s);
    for (let i = 0; i < 4; i++) {
      c.clearRect(0, 0, width, height);
      drawSpot(c, s, 0, s.x * width, s.y * height, minSide, gain);
      const data = c.getImageData(0, 0, width, height).data;
      let peak = 0;
      for (let p = 3; p < data.length; p += 4) if (data[p] > peak) peak = data[p];
      if (!peak) break;
      gain *= target(s) / (peak / 255);
    }
    gains.set(s, gain);
  }
  return gains;
}

export function HeroBokeh({ animate }: { animate: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shouldAnimate = animate && !reduced;
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const tabletQuery = window.matchMedia("(min-width: 768px) and (max-width: 1023px)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const trackPointer = shouldAnimate && finePointer;

    let width = 0;
    let height = 0;
    const pickSpots = () =>
      mobileQuery.matches ? MOBILE_SPOTS : tabletQuery.matches ? TABLET_SPOTS : DESKTOP_SPOTS;
    let spots = pickSpots();
    let gains = new Map<Spot, number>();

    /* pointer offset from the viewport centre, -1..1 */
    const target = { x: 0, y: 0 };
    const pointer = { x: 0, y: 0 };

    const lobeGradient = createLobeGradient(ctx);

    const draw = (t: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = lobeGradient;
      const minSide = Math.min(width, height);

      for (const s of spots) {
        const a = t * s.speed + s.phase;
        const shift = s.parallax * RENDER_SCALE;
        const cx = (s.x + Math.sin(a) * s.driftX) * width + pointer.x * shift;
        const cy = (s.y + Math.cos(a * 0.8) * s.driftY) * height + pointer.y * shift;
        drawSpot(ctx, s, t, cx, cy, minSide, gains.get(s) ?? s.strength);
      }
    };

    const resize = () => {
      const { clientWidth, clientHeight } = canvas;
      if (!clientWidth || !clientHeight) return;
      width = Math.max(1, Math.round(clientWidth * RENDER_SCALE));
      height = Math.max(1, Math.round(clientHeight * RENDER_SCALE));
      canvas.width = width;
      canvas.height = height;
      spots = pickSpots();
      gains = solveGains(spots, width, height);
      draw(performance.now() / 1000);
    };

    let raf = 0;
    let last = 0;
    let visible = true;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const elapsed = now - last;
      const following =
        trackPointer &&
        (Math.abs(target.x - pointer.x) > PARALLAX_EPSILON ||
          Math.abs(target.y - pointer.y) > PARALLAX_EPSILON);
      if (!following && elapsed < FRAME_MS) return;
      last = now;
      if (following) {
        const k = 1 - Math.exp((-PARALLAX_RATE * Math.min(elapsed, 250)) / 1000);
        pointer.x += (target.x - pointer.x) * k;
        pointer.y += (target.y - pointer.y) * k;
      }
      draw(now / 1000);
    };

    const start = () => {
      if (!shouldAnimate || raf || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onVisibility = () => (document.hidden ? stop() : start());

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onPointerLeave = () => {
      target.x = 0;
      target.y = 0;
    };
    const onPointerOut = (e: PointerEvent) => {
      if (!e.relatedTarget) onPointerLeave();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    intersection.observe(canvas);

    document.addEventListener("visibilitychange", onVisibility);
    if (trackPointer) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerout", onPointerOut, { passive: true });
      window.addEventListener("blur", onPointerLeave);
      document.documentElement.addEventListener("mouseleave", onPointerLeave);
    }
    resize();
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("blur", onPointerLeave);
      document.documentElement.removeEventListener("mouseleave", onPointerLeave);
    };
  }, [animate]);

  return (
    <>
      <canvas ref={canvasRef} className="hero-bokeh" aria-hidden />
      <div className="hero-bokeh-shade" aria-hidden />
    </>
  );
}
