import { useEffect, useRef } from "react";

export type OrbState = "idle" | "pressed" | "listening" | "thinking" | "responding";

interface ConciergeOrbProps {
  state: OrbState;
  circleSize?: number; // diameter of the luminous core in px
  /** 0-1 real amplitude from voice input; falls back to simulated beat when 0 */
  amplitude?: number;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Living luminous orb — pure radial gradient light, no hard shapes, no star.
 * Like looking at a candle flame or distant star through atmosphere.
 *
 * Canvas is circleSize * 2.5 wide/tall so the glow bleeds beyond the circle
 * bounds into surrounding dark space (nav bar, screen backdrop, etc.)
 * Use margin: -(circleSize * 0.75)px to pull canvas back so the
 * luminous core aligns with the layout box.
 *
 * States:
 *   idle       — gentle breathing + dust particles drifting in glow + glint flash
 *   pressed    — quick expansion burst, glow floods outward
 *   listening  — glow expands/contracts with voice amplitude
 *   thinking   — glow tightens and brightens at center, particles spin faster
 *   responding — warm steady outward glow drift
 */
export function ConciergeOrb({ state, circleSize = 28, amplitude = 0, style, className }: ConciergeOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const stateRef = useRef(state);
  const amplitudeRef = useRef(amplitude);
  const pressedPulseRef = useRef(0);

  useEffect(() => {
    const prev = stateRef.current;
    stateRef.current = state;
    if (state === "pressed" && prev !== "pressed") {
      pressedPulseRef.current = 1;
    }
  }, [state]);

  useEffect(() => { amplitudeRef.current = amplitude; }, [amplitude]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas = circleSize * 2.5 → PADDING = circleSize * 0.75 on each side
    // Glow bleeds into the PADDING area, visually spilling beyond the "circle" boundary
    const PADDING = Math.round(circleSize * 0.75);
    const canvasSize = circleSize + PADDING * 2; // ≈ circleSize * 2.5
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cx = canvasSize / 2;
    const cy = canvasSize / 2;
    const r = circleSize / 2;

    canvas.width = canvasSize * dpr;
    canvas.height = canvasSize * dpr;
    ctx.scale(dpr, dpr);

    // More particles, smaller, slower — dust motes in golden light, not orbiting planets
    const COUNT = circleSize >= 80 ? 26 : circleSize >= 40 ? 22 : 20;
    const pScale = Math.max(1, circleSize / 28);
    // Cap size scale to keep particles fine at large orb sizes
    const pSizeCap = Math.min(pScale, 2.5);

    const particles = Array.from({ length: COUNT }, () => ({
      angle: Math.random() * Math.PI * 2,
      // Cloud distribution: from inside core to just beyond — feels like atmosphere, not ring
      orbitR: r * (0.55 + Math.random() * 0.85),
      // ~50% slower; some go CW, some CCW — floating not orbiting
      speed: (0.12 + Math.random() * 0.09) * (Math.random() < 0.5 ? 1 : -1) / Math.sqrt(pScale),
      size: pSizeCap * (0.45 + Math.random() * 0.60), // 0.45–1.05px per scale unit
      opacity: 0.18 + Math.random() * 0.62,            // 0.18–0.80 (wider range per spec)
      lighter: Math.random() < 0.4,
    }));

    let glintProgress = -1;
    let glintCooldown = 5 + Math.random() * 5;
    let glintTimer = 0;
    let lastTime = 0;

    const draw = (ts: number) => {
      const dt = Math.min((ts - lastTime) / 1000, 0.05);
      lastTime = ts;
      const time = ts / 1000;

      ctx.clearRect(0, 0, canvasSize, canvasSize);

      const st = stateRef.current;
      const amp = amplitudeRef.current;

      // Decay pressed pulse (~220ms at 4.5/s)
      if (pressedPulseRef.current > 0) {
        pressedPulseRef.current = Math.max(0, pressedPulseRef.current - dt * 4.5);
      }
      const pp = pressedPulseRef.current;

      // Breathing cycle — 3.5s, 0→1
      const breathe = Math.sin(time * (Math.PI * 2 / 3.5)) * 0.5 + 0.5;

      // ── State-driven parameters ──
      // glowRadiusMult at 2.0+ ensures glow bleeds visibly beyond the circle area
      let outerAlpha = 0.42 + breathe * 0.18;
      let glowRadiusMult = 2.0 + breathe * 0.25;
      let coreR = r * (0.70 + breathe * 0.06);
      let coreAlpha = 0.88 + breathe * 0.10;
      let orbitMult = 1.0;
      let speedMult = 1.0;
      let particleOpacity = 1.0;

      if (st === "thinking") {
        // Glow tightens and brightens at center
        orbitMult = 0.52;
        speedMult = 2.5;
        outerAlpha = 0.28;
        glowRadiusMult = 1.45;
        coreR = r * 0.62;
        coreAlpha = 0.98; // intense bright core
        particleOpacity = 0.30;
      } else if (st === "listening") {
        const effectiveAmp = amp > 0.01 ? amp : Math.abs(Math.sin(time * Math.PI * 2.8));
        orbitMult = 1 + effectiveAmp * 0.45;
        outerAlpha = 0.55 + effectiveAmp * 0.40;
        glowRadiusMult = 2.1 + effectiveAmp * 0.70;
        coreR = r * (0.70 + effectiveAmp * 0.20);
      } else if (st === "responding") {
        orbitMult = 1.15;
        outerAlpha = 0.50 + breathe * 0.16;
        glowRadiusMult = 2.25;
        coreR = r * 0.72;
      }

      // Pressed pulse — brief expansion flood
      if (pp > 0) {
        outerAlpha = Math.max(outerAlpha, pp * 0.92);
        glowRadiusMult = Math.max(glowRadiusMult, 2.0 + pp * 2.2);
        coreR = Math.max(coreR, r * (0.72 + pp * 0.30));
      }

      const maxGlowR = canvasSize / 2 - 1;
      const glowR = Math.min(r * glowRadiusMult, maxGlowR);
      const actualCoreR = Math.min(coreR, maxGlowR * 0.62);

      // ── Outer atmospheric glow — bleeds well beyond circle area ──
      const oA = Math.min(outerAlpha, 0.95);
      const outerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
      outerGlow.addColorStop(0,    `rgba(245, 228, 168, ${Math.min(oA * 2.5, 0.96)})`);
      outerGlow.addColorStop(0.15, `rgba(228, 192, 95,  ${Math.min(oA * 1.7, 0.88)})`);
      outerGlow.addColorStop(0.42, `rgba(201, 168, 76,  ${oA * 0.75})`);
      outerGlow.addColorStop(0.70, `rgba(201, 168, 76,  ${oA * 0.28})`);
      outerGlow.addColorStop(1,    "rgba(201, 168, 76, 0)");
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
      ctx.fill();

      // ── Inner bright core — no hard edge, fades to transparent ──
      // Slightly off-center gradient gives sense of light source
      const core = ctx.createRadialGradient(
        cx - actualCoreR * 0.20, cy - actualCoreR * 0.20, 0,
        cx, cy, actualCoreR
      );
      core.addColorStop(0,    `rgba(255, 252, 225, ${coreAlpha})`);
      core.addColorStop(0.25, `rgba(248, 232, 160, ${coreAlpha * 0.88})`);
      core.addColorStop(0.60, `rgba(224, 184, 88,  ${coreAlpha * 0.42})`);
      core.addColorStop(1,    "rgba(201, 168, 76, 0)");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, actualCoreR, 0, Math.PI * 2);
      ctx.fill();

      // ── Dust particles — fine, slow, varied opacity ──
      const canvasHalf = canvasSize / 2;
      particles.forEach((p) => {
        p.angle += p.speed * speedMult * dt;
        const dist = p.orbitR * orbitMult;
        if (dist > canvasHalf - 2) return;
        const px = cx + Math.cos(p.angle) * dist;
        const py = cy + Math.sin(p.angle) * dist;
        ctx.globalAlpha = p.opacity * particleOpacity;
        ctx.fillStyle = p.lighter ? "#f2dea8" : "#c9a84c";
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // ── Glint flash (idle / responding) — travels across the glow ──
      if (st === "idle" || st === "responding") {
        glintTimer += dt;
        if (glintProgress < 0 && glintTimer >= glintCooldown) {
          glintProgress = 0;
          glintTimer = 0;
          glintCooldown = 5 + Math.random() * 6;
        }
        if (glintProgress >= 0) {
          glintProgress = Math.min(1, glintProgress + dt * 1.1);
          const angle = -Math.PI * 0.75 + glintProgress * Math.PI * 1.3;
          const gx = cx + Math.cos(angle) * r * 0.42;
          const gy = cy + Math.sin(angle) * r * 0.24;
          const gr = r * 0.26 * Math.sin(glintProgress * Math.PI);
          if (gr > 0.4) {
            const gg = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
            gg.addColorStop(0, "rgba(255, 252, 228, 0.82)");
            gg.addColorStop(1, "rgba(255, 248, 200, 0)");
            ctx.fillStyle = gg;
            ctx.beginPath();
            ctx.arc(gx, gy, gr, 0, Math.PI * 2);
            ctx.fill();
          }
          if (glintProgress >= 1) glintProgress = -1;
        }
      } else {
        glintProgress = -1;
        glintTimer = 0;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [circleSize]); // re-init only when size changes

  const PADDING = Math.round(circleSize * 0.75);
  const canvasSize = circleSize + PADDING * 2;

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: canvasSize,
        height: canvasSize,
        display: "block",
        margin: `-${PADDING}px`, // pull back so luminous core aligns with layout box
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}
