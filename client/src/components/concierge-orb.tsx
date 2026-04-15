import { useEffect, useRef } from "react";

export type OrbState = "idle" | "pressed" | "listening" | "thinking" | "responding";

interface ConciergeOrbProps {
  state: OrbState;
  circleSize?: number; // diameter of the gold circle in px
  /** 0-1 real amplitude from voice input; falls back to simulated beat when 0 */
  amplitude?: number;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Living gold orb — canvas particles, breathing glow, state-responsive animation.
 *
 * Canvas is circleSize * 2.5 wide/tall so glow and particles have room at any size.
 * Use margin: -(circleSize * 0.75)px to pull the canvas back so the
 * gold circle aligns with the layout box.
 *
 * States:
 *   idle       — gentle breathing + orbiting particles + glint flash
 *   pressed    — quick expansion pulse, particles scatter
 *   listening  — rapid pulse (amplitude-driven if provided, else simulated)
 *   thinking   — particles orbit tight and fast, glow dims
 *   responding — warm outward drift, calm steady glow
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

    // Canvas = circleSize * 2.5 → padding = circleSize * 0.75 on each side
    const PADDING = Math.round(circleSize * 0.75);
    const canvasSize = circleSize + PADDING * 2; // ≈ circleSize * 2.5
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cx = canvasSize / 2;
    const cy = canvasSize / 2;
    const r = circleSize / 2;

    canvas.width = canvasSize * dpr;
    canvas.height = canvasSize * dpr;
    ctx.scale(dpr, dpr);

    // More particles for larger orbs; proportional sizes and orbit radii
    const COUNT = circleSize >= 80 ? 16 : circleSize >= 40 ? 12 : 8;
    const pScale = Math.max(1, circleSize / 28);

    const particles = Array.from({ length: COUNT }, (_, i) => ({
      angle: (i / COUNT) * Math.PI * 2 + Math.random() * 0.9,
      orbitR: r * (1.1 + (i % 4) * 0.035), // proportional — just outside the circle
      speed: (0.28 + Math.random() * 0.18) / Math.sqrt(pScale), // slower for big orbs
      size: pScale * (0.75 + Math.random() * 0.8),
      opacity: 0.45 + Math.random() * 0.35,
      lighter: i % 3 === 0,
    }));

    let glintProgress = -1;
    let glintCooldown = 5 + Math.random() * 4;
    let glintTimer = 0;
    let lastTime = 0;

    const draw = (ts: number) => {
      const dt = Math.min((ts - lastTime) / 1000, 0.05);
      lastTime = ts;
      const time = ts / 1000;

      ctx.clearRect(0, 0, canvasSize, canvasSize);

      const st = stateRef.current;
      const amp = amplitudeRef.current;

      // Decay pressed pulse (decays in ~220ms at 4.5/s)
      if (pressedPulseRef.current > 0) {
        pressedPulseRef.current = Math.max(0, pressedPulseRef.current - dt * 4.5);
      }
      const pp = pressedPulseRef.current;

      // Breathing cycle — 3.5s, 0→1
      const breathe = Math.sin(time * (Math.PI * 2 / 3.5)) * 0.5 + 0.5;

      // State-driven parameters
      let glowAlpha = 0.28 + breathe * 0.16;
      let glowRadiusMult = 1.45 + breathe * 0.15;
      let orbitMult = 1.0;
      let speedMult = 1.0;
      let particleOpacity = 1.0;

      if (st === "thinking") {
        orbitMult = 0.62;
        speedMult = 2.2;
        glowAlpha = 0.16;
        glowRadiusMult = 1.2;
        particleOpacity = 0.5;
      } else if (st === "listening") {
        // Use real amplitude when available, otherwise simulate
        const effectiveAmp = amp > 0.01 ? amp : Math.abs(Math.sin(time * Math.PI * 2.8));
        orbitMult = 1 + effectiveAmp * 0.5;
        glowAlpha = 0.42 + effectiveAmp * 0.32;
        glowRadiusMult = 1.55 + effectiveAmp * 0.55;
      } else if (st === "responding") {
        orbitMult = 1.2;
        glowAlpha = 0.4 + breathe * 0.12;
        glowRadiusMult = 1.65;
      }

      // Pressed pulse — brief expansion burst
      if (pp > 0) {
        glowAlpha = Math.max(glowAlpha, pp * 0.8);
        glowRadiusMult = Math.max(glowRadiusMult, 1.5 + pp * 1.4);
      }

      // Clamp glow to canvas bounds
      const maxGlowR = canvasSize / 2 - 1;
      const glowR = Math.min(r * glowRadiusMult, maxGlowR);

      // ── Glow ──
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
      glow.addColorStop(0.15, `rgba(201, 168, 76, ${glowAlpha})`);
      glow.addColorStop(0.55, `rgba(201, 168, 76, ${glowAlpha * 0.4})`);
      glow.addColorStop(1, "rgba(201, 168, 76, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
      ctx.fill();

      // ── Gold circle ──
      const circR = r * (1 + pp * 0.2);
      const circ = ctx.createRadialGradient(
        cx - circR * 0.28, cy - circR * 0.28, 0,
        cx, cy, circR
      );
      circ.addColorStop(0, "#f2e4ad");
      circ.addColorStop(0.42, "#c9a84c");
      circ.addColorStop(1, "#9c7c2a");
      ctx.fillStyle = circ;
      ctx.beginPath();
      ctx.arc(cx, cy, circR, 0, Math.PI * 2);
      ctx.fill();

      // ── 4-pointed star icon ──
      const s = circR * 0.36;
      const inner = s * 0.3;
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.beginPath();
      ctx.moveTo(cx, cy - s * 2);
      ctx.lineTo(cx + inner, cy - inner);
      ctx.lineTo(cx + s * 2, cy);
      ctx.lineTo(cx + inner, cy + inner);
      ctx.lineTo(cx, cy + s * 2);
      ctx.lineTo(cx - inner, cy + inner);
      ctx.lineTo(cx - s * 2, cy);
      ctx.lineTo(cx - inner, cy - inner);
      ctx.closePath();
      ctx.fill();

      // ── Particles ──
      const canvasHalf = canvasSize / 2;
      particles.forEach((p) => {
        p.angle += p.speed * speedMult * dt;
        const dist = p.orbitR * orbitMult;
        if (dist > canvasHalf - 2) return;
        const px = cx + Math.cos(p.angle) * dist;
        const py = cy + Math.sin(p.angle) * dist;
        ctx.globalAlpha = p.opacity * particleOpacity;
        ctx.fillStyle = p.lighter ? "#e8d5a3" : "#c9a84c";
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // ── Glint (idle / responding) ──
      if (st === "idle" || st === "responding") {
        glintTimer += dt;
        if (glintProgress < 0 && glintTimer >= glintCooldown) {
          glintProgress = 0;
          glintTimer = 0;
          glintCooldown = 5 + Math.random() * 6;
        }
        if (glintProgress >= 0) {
          glintProgress = Math.min(1, glintProgress + dt * 1.2);
          const angle = -Math.PI * 0.75 + glintProgress * Math.PI * 1.3;
          const gx = cx + Math.cos(angle) * r * 0.52;
          const gy = cy + Math.sin(angle) * r * 0.28;
          const gr = r * 0.3 * Math.sin(glintProgress * Math.PI);
          if (gr > 0.5) {
            const gg = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
            gg.addColorStop(0, "rgba(255, 248, 220, 0.88)");
            gg.addColorStop(1, "rgba(255, 248, 220, 0)");
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
        margin: `-${PADDING}px`, // pull back so gold circle aligns with layout box
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}
