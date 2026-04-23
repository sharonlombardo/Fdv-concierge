import { useState, useRef, useEffect } from "react";

export function HeroAnimation() {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.loop = true;
    v.play().catch(() => {});
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#0a0a0a",
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        onEnded={() => {
          const v = videoRef.current;
          if (v) { v.currentTime = 0; v.play().catch(() => {}); }
        }}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        src="https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/landing%20page%20video%20final%204_26.mp4"
      />

      {/* Mute toggle — bottom left, above bottom nav */}
      <button
        onClick={toggleMute}
        style={{
          position: "absolute",
          top: 6,
          right: 16,
          zIndex: 20,
          background: "rgba(0, 0, 0, 0.4)",
          border: "none",
          borderRadius: "50%",
          width: 36,
          height: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#fff",
          fontSize: 16,
        }}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? "🔇" : "🔊"}
      </button>
    </section>
  );
}
