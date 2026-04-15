import { useEffect, useRef } from "react";

export type OrbState = "idle" | "pressed" | "listening" | "thinking" | "responding";

interface ConciergeOrbProps {
  state: OrbState;
  circleSize?: number; // diameter of the gold circle in px
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Living gold orb with canvas particles, breathing glow, and state-responsive animations.
 * States: idle (gentle breathing + orbiting particles + glint)
 *         pressed (quick expansion pulse)
 *         listening (rapid pulsing — simulates hearing voice)
 *         thinking (particles orbit tight and fast)
 *         responding (warm steady outward drift)
 *
 * The canvas is (circleSize + 2*PADDING) in each dimension so glow and particles
 * can extend beyond the circle edge without clipping.
 */
export function ConciergeOrb({ state, circleSize = 28, style, className }: ConciergeOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const stateRef = useRef(state);
  const pressedPulseRef = useRef(0); // 0-1, decays after 'pressed' state

  useEffect(() => {
    const prev = stateRef.current;
    stateRef.current = state;
    if (state === "pressed" && prev !== "pressed") {
      pressedPulseRef.current = 1;
    }
  }, [state]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const PADDING = 12;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const canvasSize = circleSize + PADDING * 2;
    const cx = canvasSize / 2;
    const cy = canvasSize / 2;
    const r = circleSize / 2;

    canvas.width = canvasSize * dpr;
    canvas.height = canvasSize * dpr;
    ctx.scale(dpr, dpr);

    // 8 particles orbiting just outside the circle
    const particles = Array.from({ length: 8 }, (_, i) => ({
      angle: (i / 8) * Math.PI * 2 + Math.random() * 0.9,
      orbitR: r + 3.5 + (i % 3) * 1.5,
      speed: 0.28 + Math.random() * 0.18,
      size: 0.9 + Math.random() * 1.1,
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

      // Decay pressed pulse
      if (pressedPulseRef.current > 0) {
        pressedPulseRef.current = Math.max(0, pressedPulseRef.current - dt * 4.5);
      }
      const pp = pressedPulseRef.current;

      // Breathe: 0→1→0, 3.5s cycle
      const breathe = Math.sin(time * (Math.PI * 2 / 3.5)) * 0.5 + 0.5;

      // State-driven parameters
      let glowAlpha = 0.28 + breathe * 0.16;
      let glowRadiusMult = 1.5 + breathe * 0.15;
      let orbitMult = 1.0;
      let speedMult = 1.0;
      let particleOpacity = 1.0;

      if (st === "thinking") {
        orbitMult = 0.62;
        speedMult = 2.0;
        glowAlpha = 0.18;
        glowRadiusMult = 1.25;
        particleOpacity = 0.55;
      } else if (st === "listening") {
        // fast beat simulating hearing
        const beat = Math.abs(Math.sin(time * Math.PI * 2.8));
        orbitMult = 1 + beat * 0.45;
        glowAlpha = 0.42 + beat * 0.28;
        glowRadiusMult = 1.6 + beat * 0.5;
      } else if (st === "responding") {
        orbitMult = 1.18;
        glowAlpha = 0.38 + breathe * 0.12;
        glowRadiusMult = 1.65;
      }

      // Pressed pulse overrides
      if (pp > 0) {
        glowAlpha = Math.max(glowAlpha, pp * 0.75);
        glowRadiusMult = Math.max(glowRadiusMult, 1.5 + pp * 1.2);
      }

      // --- Glow ---
      const glowR = r * glowRadiusMult;
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
      glow.addColorStop(0.2, `rgba(201, 168, 76, ${glowAlpha})`);
      glow.addColorStop(0.6, `rgba(201, 168, 76, ${glowAlpha * 0.45})`);
      glow.addColorStop(1, "rgba(201, 168, 76, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
      ctx.fill();

      // --- Gold circle ---
      const circR = r * (1 + pp * 0.22);
      const circ = ctx.createRadialGradient(
        cx - circR * 0.28, cy - circR * 0.28, 0,
        cx, cy, circR
      );
      circ.addColorStop(0, "#f2e4ad");
      circ.addColorStop(0.4, "#c9a84c");
      circ.addColorStop(1, "#9c7c2a");
      ctx.fillStyle = circ;
      ctx.beginPath();
      ctx.arc(cx, cy, circR, 0, Math.PI * 2);
      ctx.fill();

      // --- Star icon (4-pointed sparkle, drawn as canvas path) ---
      // Based on the SVG path in bottom-nav: a 4-pointed star centered at origin
      // Using s as the "arm length" — tips reach ~72% of circle radius
      const s = circR * 0.36;
      const inner = s * 0.3; // waist width
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.beginPath();
      ctx.moveTo(cx, cy - s * 2);       // top
      ctx.lineTo(cx + inner, cy - inner);
      ctx.lineTo(cx + s * 2, cy);       // right
      ctx.lineTo(cx + inner, cy + inner);
      ctx.lineTo(cx, cy + s * 2);       // bottom
      ctx.lineTo(cx - inner, cy + inner);
      ctx.lineTo(cx - s * 2, cy);       // left
      ctx.lineTo(cx - inner, cy - inner);
      ctx.closePath();
      ctx.fill();

      // --- Particles ---
      particles.forEach((p) => {
        p.angle += p.speed * speedMult * dt;
        const dist = p.orbitR * orbitMult;
        if (dist > canvasSize / 2 - 2) return; // stay in canvas
        const px = cx + Math.cos(p.angle) * dist;
        const py = cy + Math.sin(p.angle) * dist;
        ctx.globalAlpha = p.opacity * particleOpacity;
        ctx.fillStyle = p.lighter ? "#e8d5a3" : "#c9a84c";
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // --- Glint (idle / responding) ---
      if (st === "idle" || st === "responding") {
        glintTimer += dt;
        if (glintProgress < 0 && glintTimer >= glintCooldown) {
          glintProgress = 0;
          glintTimer = 0;
          glintCooldown = 5 + Math.random() * 5;
        }
        if (glintProgress >= 0) {
          glintProgress = Math.min(1, glintProgress + dt * 1.3);
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
  }, [circleSize]);

  const PADDING = 12;
  const canvasSize = circleSize + PADDING * 2;

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: canvasSize,
        height: canvasSize,
        display: "block",
        // Pull back by PADDING so the canvas center aligns with where the circle should be
        margin: `-${PADDING}px`,
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}
