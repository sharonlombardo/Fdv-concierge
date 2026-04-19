export type OrbState = "idle" | "pressed" | "listening" | "thinking" | "responding";

interface ConciergeOrbProps {
  state: OrbState;
  circleSize?: number;
  amplitude?: number; // kept for API compat, not used
  palette?: "gold" | "silver";
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Living luminous orb — pure CSS keyframe animations. No RAF. No canvas.
 * Guaranteed smooth by the browser's compositor. Always breathing.
 *
 * Idle:      slow 4s deep breath — scale 1.0 → 1.08. Dreamy.
 * Thinking:  slightly contracted, faster 2s — scale 0.88 → 1.02.
 * Listening: fast reactive pulse, 1.2s — scale 0.96 → 1.30 outer.
 * Responding: expanded and fuller, 2.5s — scale 1.05 → 1.22 outer.
 */
export function ConciergeOrb({ state, circleSize = 44, palette = "gold", style, className }: ConciergeOrbProps) {
  const outerDiam = circleSize * 3.2;
  const blurPx = Math.round(circleSize * 0.55);
  const innerBlurPx = Math.max(1, Math.round(circleSize * 0.07));

  // Animation durations per state
  const dur =
    state === "thinking"   ? "2s"   :
    state === "listening"  ? "1.2s" :
    state === "responding" ? "2.5s" :
    "4s"; // idle / pressed

  // Outer glow animation name per state
  const outerAnim =
    state === "thinking"   ? "orbOuterThink"   :
    state === "listening"  ? "orbOuterListen"  :
    state === "responding" ? "orbOuterRespond" :
    "orbOuterIdle";

  // Inner core animation name per state
  const innerAnim =
    state === "thinking"   ? "orbInnerThink"   :
    state === "listening"  ? "orbInnerListen"  :
    state === "responding" ? "orbInnerRespond" :
    "orbInnerIdle";

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: circleSize,
        height: circleSize,
        flexShrink: 0,
        ...style,
      }}
    >
      <style>{`
        /* ── IDLE: slow 4s deep breath ── */
        @keyframes orbOuterIdle {
          0%, 100% { transform: scale(1.00); }
          50%       { transform: scale(1.18); }
        }
        @keyframes orbInnerIdle {
          0%, 100% { transform: scale(1.00); }
          50%       { transform: scale(1.08); }
        }

        /* ── THINKING: contracted, faster ── */
        @keyframes orbOuterThink {
          0%, 100% { transform: scale(0.88); }
          50%       { transform: scale(1.04); }
        }
        @keyframes orbInnerThink {
          0%, 100% { transform: scale(0.90); }
          50%       { transform: scale(1.02); }
        }

        /* ── LISTENING: reactive, quick pulse ── */
        @keyframes orbOuterListen {
          0%, 100% { transform: scale(0.96); }
          50%       { transform: scale(1.35); }
        }
        @keyframes orbInnerListen {
          0%, 100% { transform: scale(0.96); }
          50%       { transform: scale(1.18); }
        }

        /* ── RESPONDING: expanded, full ── */
        @keyframes orbOuterRespond {
          0%, 100% { transform: scale(1.06); }
          50%       { transform: scale(1.24); }
        }
        @keyframes orbInnerRespond {
          0%, 100% { transform: scale(1.04); }
          50%       { transform: scale(1.11); }
        }
      `}</style>

      {/* Outer atmospheric glow — large blurred circle, breathes via CSS animation */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: outerDiam,
          height: outerDiam,
          marginTop: -(outerDiam / 2),
          marginLeft: -(outerDiam / 2),
          borderRadius: "50%",
          background: palette === "silver"
            ? "radial-gradient(circle, rgba(255,255,255,0.60) 0%, rgba(220,218,214,0.32) 28%, rgba(200,198,194,0.10) 55%, transparent 78%)"
            : "radial-gradient(circle, rgba(245,228,168,0.52) 0%, rgba(201,168,76,0.28) 28%, rgba(201,168,76,0.10) 55%, transparent 78%)",
          filter: `blur(${blurPx}px)`,
          transformOrigin: "center center",
          pointerEvents: "none",
          willChange: "transform",
          animation: `${outerAnim} ${dur} ease-in-out infinite`,
        }}
      />

      {/* Inner bright core — fills circleSize, breathes via CSS animation */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: palette === "silver"
            ? "radial-gradient(circle at 38% 36%, rgba(255,255,255,0.98) 0%, rgba(242,240,236,0.90) 22%, rgba(210,208,204,0.55) 55%, transparent 80%)"
            : "radial-gradient(circle at 38% 36%, rgba(255,252,232,0.96) 0%, rgba(245,228,155,0.88) 22%, rgba(210,168,72,0.55) 55%, transparent 80%)",
          filter: `blur(${innerBlurPx}px)`,
          pointerEvents: "none",
          transformOrigin: "center center",
          willChange: "transform",
          animation: `${innerAnim} ${dur} ease-in-out infinite`,
        }}
      />
    </div>
  );
}
