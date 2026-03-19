import { useState, useEffect, useCallback, useRef } from "react";

type Phase = "scanning" | "finding" | "building" | "reveal";

const PHASE_TEXTS: Record<Phase, string> = {
  scanning: "Looking at what you saved...",
  finding: "Pulling it together...",
  building: "Building your capsule...",
  reveal: "",
};

const PHASE_DURATION = {
  scanning: 2000,
  finding: 2000,
  building: 2000,
};

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  driftX: number;
  driftY: number;
}

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 10 + Math.random() * 80,
    y: 20 + Math.random() * 60,
    size: 4 + Math.random() * 4,
    opacity: 0.4 + Math.random() * 0.3,
    speed: 0.3 + Math.random() * 0.4,
    driftX: (Math.random() - 0.5) * 6,
    driftY: (Math.random() - 0.5) * 4,
  }));
}

interface CuratingAnimationProps {
  capsuleName: string;
  capsuleTagline: string;
  onComplete: () => void;
}

export function CuratingAnimation({
  capsuleName,
  capsuleTagline,
  onComplete,
}: CuratingAnimationProps) {
  const [phase, setPhase] = useState<Phase>("scanning");
  const [textVisible, setTextVisible] = useState(false);
  const [diamondPulse, setDiamondPulse] = useState(false);
  const [revealReady, setRevealReady] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [particles] = useState(() => createParticles(14));
  const [tick, setTick] = useState(0);
  const rafRef = useRef<number>();

  // Gentle floating animation
  useEffect(() => {
    let frame = 0;
    const animate = () => {
      frame++;
      if (frame % 3 === 0) setTick((t) => t + 1);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const advancePhase = useCallback(() => {
    if (phase === "scanning") {
      setTextVisible(false);
      setTimeout(() => {
        setPhase("finding");
        setTimeout(() => setTextVisible(true), 100);
      }, 400);
    } else if (phase === "finding") {
      setTextVisible(false);
      setTimeout(() => {
        setPhase("building");
        setTimeout(() => setTextVisible(true), 100);
        setTimeout(() => setDiamondPulse(true), 1200);
      }, 400);
    } else if (phase === "building") {
      setTextVisible(false);
      setTimeout(() => {
        setPhase("reveal");
        setTimeout(() => setRevealReady(true), 200);
      }, 400);
    }
  }, [phase]);

  // Start text fade-in on mount
  useEffect(() => {
    const t = setTimeout(() => setTextVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Phase transitions
  useEffect(() => {
    if (phase === "reveal") return;
    const duration =
      PHASE_DURATION[phase as keyof typeof PHASE_DURATION] || 2000;
    const t = setTimeout(advancePhase, duration);
    return () => clearTimeout(t);
  }, [phase, advancePhase]);

  // Auto-complete after reveal — ethereal fade out
  useEffect(() => {
    if (revealReady) {
      const t1 = setTimeout(() => setFadeOut(true), 1800);
      const t2 = setTimeout(onComplete, 3000);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [revealReady, onComplete]);

  const getParticleStyle = (p: Particle): React.CSSProperties => {
    const isConverging = phase === "building";
    const isFinding = phase === "finding";
    const time = tick * 0.02;

    let x = p.x + Math.sin(time * p.speed + p.id) * p.driftX;
    let y = p.y + Math.cos(time * p.speed + p.id * 0.7) * p.driftY;

    if (isFinding) {
      x = x + (50 - x) * 0.5;
      y = y + (45 - y) * 0.5;
    } else if (isConverging) {
      x = 50;
      y = 45;
    }

    return {
      position: "absolute",
      left: `${x}%`,
      top: `${y}%`,
      width: isConverging ? 0 : p.size,
      height: isConverging ? 0 : p.size,
      borderRadius: "50%",
      background: "#c9a84c",
      boxShadow: "0 0 8px rgba(201, 168, 76, 0.4)",
      opacity: phase === "reveal" ? 0 : p.opacity,
      transition: isConverging
        ? "all 1.2s ease-in-out, opacity 0.6s"
        : "width 0.3s, height 0.3s, opacity 0.6s",
      pointerEvents: "none" as const,
    };
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "radial-gradient(ellipse at center, #faf9f6 0%, #f5f0e8 60%, #efe9dd 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 1.2s ease-out",
      }}
    >
      {/* Particles */}
      {particles.map((p) => (
        <div key={p.id} style={getParticleStyle(p)} />
      ))}

      {/* Diamond (appears in building phase) */}
      {(phase === "building" || phase === "reveal") && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "45%",
            transform: `translate(-50%, -50%) rotate(45deg) scale(${
              diamondPulse ? 1 : 0
            })`,
            width: 24,
            height: 24,
            background: "#c9a84c",
            boxShadow: "0 0 24px rgba(201, 168, 76, 0.35), 0 0 48px rgba(201, 168, 76, 0.15)",
            opacity: phase === "reveal" ? 0 : 1,
            transition: diamondPulse
              ? "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s"
              : "transform 0.6s ease-out, opacity 0.6s",
          }}
        />
      )}

      {/* Phase text */}
      {phase !== "reveal" && (
        <p
          style={{
            fontFamily: "Lora, serif",
            fontSize: 20,
            color: "#2c2416",
            opacity: textVisible ? 1 : 0,
            transition: "opacity 0.6s ease-in-out",
            textAlign: "center",
            padding: "0 32px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {PHASE_TEXTS[phase]}
        </p>
      )}

      {/* Reveal */}
      {phase === "reveal" && (
        <div
          style={{
            textAlign: "center",
            padding: "0 32px",
            opacity: revealReady ? 1 : 0,
            transform: revealReady ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
          }}
        >
          <h1
            style={{
              fontFamily: "Lora, serif",
              fontSize: 28,
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#2c2416",
              marginBottom: 16,
            }}
          >
            {capsuleName}
          </h1>
          <p
            style={{
              fontFamily: "Lora, serif",
              fontSize: 18,
              fontStyle: "italic",
              color: "#2c2416",
              lineHeight: 1.6,
            }}
          >
            {capsuleTagline}
          </p>
        </div>
      )}
    </div>
  );
}
