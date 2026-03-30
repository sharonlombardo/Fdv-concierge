import { useState, useEffect, useCallback } from "react";

const BLOB = 'https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2';

const PHASES = [
  { text: "Pulling it together...", image: `${BLOB}/curate-linen` },
  { text: "Building your aesthetic...", image: `${BLOB}/curate-camera` },
  { text: "Remembering what resonated...", image: `${BLOB}/curate-oasis` },
  { text: "Curating your experience...", image: `${BLOB}/curate-staircase-pink` },
];

const PHASE_DURATION = 1100;
const TEXT_FADE = "opacity 0.5s ease-in-out";
const IMG_FADE = "opacity 0.8s ease-in-out";

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
  const [currentPhase, setCurrentPhase] = useState(0);
  const [textVisible, setTextVisible] = useState(false);
  const [isReveal, setIsReveal] = useState(false);
  const [revealReady, setRevealReady] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  // Fade in first text
  useEffect(() => {
    const t = setTimeout(() => setTextVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Phase transitions — text fades out, then image + text swap together
  const advancePhase = useCallback(() => {
    setTextVisible(false);
    setTimeout(() => {
      const next = currentPhase + 1;
      if (next < PHASES.length) {
        setCurrentPhase(next);
        setTimeout(() => setTextVisible(true), 250);
      } else {
        setIsReveal(true);
        setTimeout(() => setRevealReady(true), 300);
      }
    }, 350);
  }, [currentPhase]);

  useEffect(() => {
    if (isReveal) return;
    const t = setTimeout(advancePhase, PHASE_DURATION);
    return () => clearTimeout(t);
  }, [currentPhase, isReveal, advancePhase]);

  // Auto-complete after reveal
  useEffect(() => {
    if (revealReady) {
      const t1 = setTimeout(() => setFadeOut(true), 1000);
      const t2 = setTimeout(onComplete, 1600);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [revealReady, onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#000",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.6s ease-out",
      }}
    >
      {/* Background images — all rendered, opacity controlled */}
      {PHASES.map((phase, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${phase.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: isReveal ? (i === PHASES.length - 1 ? 1 : 0) : currentPhase === i ? 1 : 0,
            transition: IMG_FADE,
          }}
        />
      ))}

      {/* Dark overlay for text readability */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" }} />

      {/* Centered text — phase text */}
      {!isReveal && (
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <p
            style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: 28,
              fontStyle: "italic",
              color: "#fff",
              textShadow: "0 2px 20px rgba(0,0,0,0.4)",
              opacity: textVisible ? 1 : 0,
              transition: TEXT_FADE,
              textAlign: "center",
              padding: "0 32px",
            }}
          >
            {PHASES[currentPhase].text}
          </p>
        </div>
      )}

      {/* Reveal — capsule name + tagline */}
      {isReveal && (
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            textAlign: "center",
            padding: "0 32px",
            opacity: revealReady ? 1 : 0,
            transform: revealReady ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        >
          <h1
            style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: 36,
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#fff",
              textShadow: "0 2px 24px rgba(0,0,0,0.5)",
              marginBottom: 16,
            }}
          >
            {capsuleName}
          </h1>
          <p
            style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: 20,
              fontStyle: "italic",
              color: "rgba(255,255,255,0.85)",
              textShadow: "0 2px 16px rgba(0,0,0,0.4)",
              lineHeight: 1.6,
            }}
          >
            {capsuleTagline}
          </p>
        </div>
      )}

      {/* Dot indicators at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 10,
          zIndex: 2,
        }}
      >
        {PHASES.map((_, i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: isReveal || currentPhase >= i ? "#fff" : "rgba(255,255,255,0.4)",
              transition: "background 0.5s",
            }}
          />
        ))}
      </div>
    </div>
  );
}
