import { useState, useRef } from "react";

export function HeroAnimation() {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

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
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        src="https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/LANDING%20FINAL.mp4"
      />

      {/* Mute toggle — bottom left, above bottom nav */}
      <button
        onClick={toggleMute}
        style={{
          position: "absolute",
          top: 48,
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
