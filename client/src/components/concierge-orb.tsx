import { useEffect, useRef } from "react";

export type OrbState = "idle" | "pressed" | "listening" | "thinking" | "responding";

interface ConciergeOrbProps {
  state: OrbState;
  circleSize?: number;
  amplitude?: number;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Living luminous orb — pure CSS radial gradient + blur. No canvas. No particles.
 * Like a candle behind frosted glass. Smooth. Luminous. Zero granularity.
 *
 * Two layers:
 *   1. Outer atmospheric glow — large blurred div, breathes via scale transform in RAF
 *   2. Inner bright core — fills circleSize area, very slight blur, no hard edge
 *
 * The outer div is positioned absolutely, extending circleSize * 3.2 in diameter,
 * centered via negative margins so glow bleeds into surrounding dark space.
 * Parent container is exactly circleSize × circleSize — used for layout.
 */
export function ConciergeOrb({ state, circleSize = 44, amplitude = 0, style, className }: ConciergeOrbProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(state);
  const ampRef = useRef(amplitude);
  const pressRef = useRef(0);
  const animRef = useRef<number>(0);
  const tRef = useRef(0);
  const lastTsRef = useRef(0);

  useEffect(() => {
    const prev = stateRef.current;
    stateRef.current = state;
    if (state === "pressed" && prev !== "pressed") {
      pressRef.current = 1;
    }
  }, [state]);

  useEffect(() => { ampRef.current = amplitude; }, [amplitude]);

  useEffect(() => {
    const animate = (ts: number) => {
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.05);
      lastTsRef.current = ts;
      tRef.current += dt;
      const t = tRef.current;
      const st = stateRef.current;
      const amp = ampRef.current;

      if (pressRef.current > 0) pressRef.current = Math.max(0, pressRef.current - dt * 4.5);
      const pp = pressRef.current;

      const breathe = Math.sin(t * (Math.PI * 2 / 3.5));
      let outerScale = 1.0;
      let innerScale = 1.0;

      if (st === "thinking") {
        outerScale = 0.65 + breathe * 0.06;
        innerScale = 0.90 + breathe * 0.04;
      } else if (st === "listening") {
        const eff = amp > 0.01 ? amp : Math.abs(Math.sin(t * Math.PI * 2.8));
        outerScale = 1.0 + eff * 0.65;
        innerScale = 1.0 + eff * 0.18;
      } else if (st === "responding") {
        outerScale = 1.06 + breathe * 0.09;
        innerScale = 1.04 + breathe * 0.04;
      } else {
        // idle — gentle 3.5s breathing, more pronounced on outer glow
        outerScale = 1.015 + breathe * 0.13;
        innerScale = 1.0 + breathe * 0.055;
      }

      if (pp > 0) {
        outerScale = Math.max(outerScale, 1.0 + pp * 0.9);
        innerScale = Math.max(innerScale, 1.0 + pp * 0.3);
      }

      if (outerRef.current) {
        outerRef.current.style.transform = `scale(${outerScale.toFixed(4)})`;
      }
      if (innerRef.current) {
        innerRef.current.style.transform = `scale(${innerScale.toFixed(4)})`;
      }

      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const outerDiam = circleSize * 3.2;
  const blurPx = Math.round(circleSize * 0.55);
  const innerBlurPx = Math.max(1, Math.round(circleSize * 0.07));

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
      {/* Outer atmospheric glow — large blurred circle, animates via scale */}
      <div
        ref={outerRef}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: outerDiam,
          height: outerDiam,
          marginTop: -(outerDiam / 2),
          marginLeft: -(outerDiam / 2),
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(245,228,168,0.52) 0%, rgba(201,168,76,0.28) 28%, rgba(201,168,76,0.10) 55%, transparent 78%)",
          filter: `blur(${blurPx}px)`,
          transform: "scale(1.015)",
          transformOrigin: "center center",
          pointerEvents: "none",
          willChange: "transform",
        }}
      />
      {/* Inner bright core — fills circleSize, animates via scale in RAF */}
      <div
        ref={innerRef}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 38% 36%, rgba(255,252,232,0.96) 0%, rgba(245,228,155,0.88) 22%, rgba(210,168,72,0.55) 55%, transparent 80%)",
          filter: `blur(${innerBlurPx}px)`,
          pointerEvents: "none",
          transformOrigin: "center center",
          willChange: "transform",
        }}
      />
    </div>
  );
}
