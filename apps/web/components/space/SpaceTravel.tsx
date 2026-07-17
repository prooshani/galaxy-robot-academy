"use client";

import { useEffect, useRef } from "react";

interface Star { x: number; y: number; z: number; color: string; twinklePhase: number; twinkleFreq: number; }
interface Streak { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; width: number; }

const STAR_COLORS = ["#F7F9FA", "#F7F9FA", "#F7F9FA", "#F7F9FA", "#9CC5FF", "#9CC5FF", "#FFD9A0", "#D9B3FF"];
const TRAVEL_SPEED = 0.05; // z units per second — a calm cruise, not a warp jump
const FRAME_INTERVAL = 1000 / 30; // 30fps is plenty for a slow starfield and halves GPU load

const starCountFor = (width: number, height: number) => Math.min(650, Math.max(380, Math.floor((width * height) / 3200)));

function spawnStar(z: number): Star {
  return { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z, color: STAR_COLORS[(Math.random() * STAR_COLORS.length) | 0], twinklePhase: Math.random() * Math.PI * 2, twinkleFreq: 0.5 + Math.random() * 2.5 };
}

/** Nebulae, galaxies, and the Milky Way band change so slowly they are rendered ONCE
 *  into an offscreen canvas; the frame loop just blits it with a tiny drift. */
function renderDeepSpace(width: number, height: number): HTMLCanvasElement {
  const layer = document.createElement("canvas");
  layer.width = width; layer.height = height;
  const ctx = layer.getContext("2d");
  if (!ctx) return layer;
  const nebulae = [
    { x: 0.16, y: 0.2, r: 0.5, color: "rgba(124, 77, 219, 0.12)" },
    { x: 0.82, y: 0.34, r: 0.42, color: "rgba(193, 59, 158, 0.09)" },
    { x: 0.55, y: 0.72, r: 0.55, color: "rgba(70, 120, 215, 0.07)" },
    { x: 0.36, y: 0.5, r: 0.3, color: "rgba(225, 189, 255, 0.06)" },
    { x: 0.9, y: 0.8, r: 0.35, color: "rgba(90, 200, 235, 0.05)" },
  ];
  for (const nebula of nebulae) {
    const radius = nebula.r * Math.min(width, height) * 1.15;
    const cloud = ctx.createRadialGradient(nebula.x * width, nebula.y * height, 0, nebula.x * width, nebula.y * height, radius);
    cloud.addColorStop(0, nebula.color);
    cloud.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = cloud;
    ctx.beginPath();
    ctx.arc(nebula.x * width, nebula.y * height, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  for (const galaxy of [{ x: 0.24, y: 0.68, r: 34, tilt: -0.7 }, { x: 0.72, y: 0.14, r: 26, tilt: 0.5 }]) {
    ctx.save();
    ctx.translate(galaxy.x * width, galaxy.y * height);
    ctx.rotate(galaxy.tilt);
    ctx.scale(1, 0.3);
    const core = ctx.createRadialGradient(0, 0, 0, 0, 0, galaxy.r);
    core.addColorStop(0, "rgba(240, 235, 255, 0.35)");
    core.addColorStop(0.25, "rgba(214, 190, 255, 0.14)");
    core.addColorStop(1, "rgba(214, 190, 255, 0)");
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(0, 0, galaxy.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.save();
  ctx.translate(width / 2, height * 0.42);
  ctx.rotate(-0.45);
  ctx.scale(2.8, 0.55);
  const band = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.min(width, height) * 0.55);
  band.addColorStop(0, "rgba(214, 190, 255, 0.055)");
  band.addColorStop(0.55, "rgba(180, 160, 230, 0.03)");
  band.addColorStop(1, "rgba(180, 160, 230, 0)");
  ctx.fillStyle = band;
  ctx.beginPath();
  ctx.arc(0, 0, Math.min(width, height) * 0.55, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  return layer;
}

/** Pre-rendered halo sprite per star color — beats per-star per-frame gradients. */
function renderHalo(color: string): HTMLCanvasElement {
  const sprite = document.createElement("canvas");
  sprite.width = 32; sprite.height = 32;
  const ctx = sprite.getContext("2d");
  if (!ctx) return sprite;
  const halo = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  halo.addColorStop(0, color);
  halo.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, 32, 32);
  return sprite;
}

/**
 * The view out the spacecraft window: stars stream slowly toward us with real
 * parallax depth, meteors cut across the sky, and dust motes whip past close by.
 * Budget: 30fps, dpr ≤ 1.5, static layers pre-rendered. One static frame under
 * prefers-reduced-motion.
 */
export function SpaceTravel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0, height = 0, frame = 0, last = performance.now(), lastDraw = 0, elapsed = 0;
    let deepSpace: HTMLCanvasElement | null = null;
    const halos = new Map<string, HTMLCanvasElement>();
    for (const color of new Set(STAR_COLORS)) halos.set(color, renderHalo(color));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = width * dpr; canvas.height = height * dpr;
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      deepSpace = renderDeepSpace(width, height);
    };
    resize();

    const stars = Array.from({ length: starCountFor(window.innerWidth, window.innerHeight) }, () => spawnStar(0.05 + Math.random() * 0.95));
    const meteors: Streak[] = [];
    const dust: Streak[] = [];
    let nextMeteor = 1.5 + Math.random() * 3;
    let nextDust = 0.5;

    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      if (now - lastDraw < FRAME_INTERVAL) return;
      lastDraw = now;
      const dt = Math.min((now - last) / 1000, 0.08);
      last = now; elapsed += dt;
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2, cy = height * 0.42, scale = Math.min(width, height) * 0.6;

      // deep space blitted with a barely-there drift
      if (deepSpace) ctx.drawImage(deepSpace, Math.sin(elapsed * 0.02) * 9, Math.cos(elapsed * 0.016) * 6);

      for (const star of stars) {
        if (!reduced) {
          star.z -= TRAVEL_SPEED * dt;
          if (star.z <= 0.05) Object.assign(star, spawnStar(1));
        }
        const px = cx + (star.x / star.z) * scale;
        const py = cy + (star.y / star.z) * scale;
        if (px < -20 || px > width + 20 || py < -20 || py > height + 20) continue;
        const closeness = 1 - star.z;
        const twinkle = 0.72 + 0.28 * Math.sin(elapsed * star.twinkleFreq + star.twinklePhase);
        const radius = Math.min(0.6 + closeness * 2, 2.6);
        const alpha = Math.min(0.3 + closeness * 0.95, 1) * twinkle;
        if (radius > 1.7) {
          const sprite = halos.get(star.color);
          if (sprite) {
            ctx.globalAlpha = alpha * 0.28;
            const haloSize = radius * 6.4;
            ctx.drawImage(sprite, px - haloSize / 2, py - haloSize / 2, haloSize, haloSize);
          }
        }
        ctx.globalAlpha = alpha;
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
        // close stars stretch into short radial streaks — the "flying past" cue
        if (star.z < 0.16 && !reduced) {
          const dx = px - cx, dy = py - cy;
          const norm = Math.hypot(dx, dy) || 1;
          const streakLength = (0.16 - star.z) * 160;
          ctx.strokeStyle = star.color;
          ctx.lineWidth = radius * 0.9;
          ctx.globalAlpha *= 0.55;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + (dx / norm) * streakLength, py + (dy / norm) * streakLength);
          ctx.stroke();
        }
      }

      if (!reduced) {
        // Meteors — random spot, random heading, bright gradient tail
        nextMeteor -= dt;
        if (nextMeteor <= 0) {
          const fromLeft = Math.random() < 0.5;
          const angle = (fromLeft ? -0.35 : Math.PI + 0.35) + (Math.random() - 0.5) * 0.5;
          const speed = 520 + Math.random() * 480;
          meteors.push({ x: Math.random() * width, y: Math.random() * height * 0.55, vx: Math.cos(angle) * speed, vy: Math.abs(Math.sin(angle)) * speed * 0.45 + 60, life: 0, maxLife: 0.7 + Math.random() * 0.6, width: 1.4 + Math.random() * 1.2 });
          nextMeteor = 2 + Math.random() * 5;
          if (Math.random() < 0.2) nextMeteor = 0.15; // occasional double
        }
        // Dust motes — debris whipping past the hull, fast and faint
        nextDust -= dt;
        if (nextDust <= 0) {
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.max(width, height) * (0.25 + Math.random() * 0.3);
          const speed = 380 + Math.random() * 420;
          dust.push({ x: cx + Math.cos(angle) * distance * 0.4, y: cy + Math.sin(angle) * distance * 0.4, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 0, maxLife: 0.5 + Math.random() * 0.4, width: 0.8 });
          nextDust = 0.25 + Math.random() * 0.6;
        }
        for (const list of [meteors, dust]) {
          for (let index = list.length - 1; index >= 0; index--) {
            const item = list[index];
            item.life += dt;
            if (item.life >= item.maxLife) { list.splice(index, 1); continue; }
            item.x += item.vx * dt; item.y += item.vy * dt;
            const progress = item.life / item.maxLife;
            const fade = progress < 0.15 ? progress / 0.15 : 1 - (progress - 0.15) / 0.85;
            const tail = list === meteors ? 0.13 : 0.05;
            const gradient = ctx.createLinearGradient(item.x, item.y, item.x - item.vx * tail, item.y - item.vy * tail);
            gradient.addColorStop(0, `rgba(247, 249, 250, ${0.9 * fade})`);
            gradient.addColorStop(1, "rgba(225, 189, 255, 0)");
            ctx.strokeStyle = gradient;
            ctx.lineWidth = item.width;
            ctx.globalAlpha = 1;
            ctx.beginPath();
            ctx.moveTo(item.x, item.y);
            ctx.lineTo(item.x - item.vx * tail, item.y - item.vy * tail);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      if (reduced) cancelAnimationFrame(frame);
    };

    const start = () => { last = performance.now(); lastDraw = 0; frame = requestAnimationFrame(draw); };
    const onVisibility = () => { cancelAnimationFrame(frame); if (!document.hidden) start(); };
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    start();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); document.removeEventListener("visibilitychange", onVisibility); };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10" />;
}
