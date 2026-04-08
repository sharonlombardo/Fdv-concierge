export function HeroAnimation() {
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
        src="https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/landing%20page%20video.mp4"
      />
    </section>
  );
}
