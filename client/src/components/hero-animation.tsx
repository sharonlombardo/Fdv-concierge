import { useState, useEffect, useRef, useCallback } from "react";

const BLOB_BASE = "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2";

// Destination images — atmospheric/editorial photography already in the codebase
const HERO_IMAGES = [
  // Morocco
  `${BLOB_BASE}/morocco-hero`,
  `${BLOB_BASE}/morocco-motion-1`,
  `${BLOB_BASE}/morocco-experience-1`,
  `${BLOB_BASE}/morocco-ritual-1`,
  // Hydra
  `${BLOB_BASE}/hydra-hero`,
  `${BLOB_BASE}/hydra-light-1`,
  `${BLOB_BASE}/hydra-light-2`,
  `${BLOB_BASE}/hydra-ritual-1`,
  // Mallorca
  `${BLOB_BASE}/slow-travel-hero`,
  `${BLOB_BASE}/slow-culture-1`,
  `${BLOB_BASE}/slow-museum`,
  `${BLOB_BASE}/slow-lunch`,
  // Amangiri
  `${BLOB_BASE}/retreat-hero`,
  `${BLOB_BASE}/retreat-motion-1`,
  `${BLOB_BASE}/retreat-place-1`,
  `${BLOB_BASE}/retreat-ritual-1`,
  // New York
  `${BLOB_BASE}/newyork-hero`,
  `${BLOB_BASE}/newyork-culture-1`,
  `${BLOB_BASE}/newyork-experience-1`,
  `${BLOB_BASE}/newyork-ritual-1`,
];

// Greeting words in local languages
const GREETINGS = [
  { text: "مرحبا", lang: "ar" },      // Morocco — Arabic
  { text: "ΓΕΙΑ", lang: "el" },         // Hydra — Greek
  { text: "HOLA", lang: "es" },         // Mallorca — Spanish
  { text: "HELLO", lang: "en" },        // Amangiri / New York — English
  { text: "שָׁלוֹם", lang: "he" },      // Bonus — Hebrew
];

// Variable image durations — NOT uniform. Fast cuts mixed with slightly longer holds.
const IMAGE_DURATIONS = [300, 250, 500, 200, 400, 300, 600, 250, 350, 200];

// Variable text durations — slower rhythm, each word holds while images flash underneath
const TEXT_DURATIONS = [1400, 1200, 1600, 1300, 1500];

export function HeroAnimation() {
  const [imageIndex, setImageIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imageDurationIndex = useRef(0);
  const textDurationIndex = useRef(0);

  // Preload images
  useEffect(() => {
    let loaded = 0;
    const total = Math.min(HERO_IMAGES.length, 8); // preload first 8
    HERO_IMAGES.slice(0, total).forEach((src) => {
      const img = new Image();
      img.onload = () => {
        loaded++;
        if (loaded >= total) setImagesLoaded(true);
      };
      img.onerror = () => {
        loaded++;
        if (loaded >= total) setImagesLoaded(true);
      };
      img.src = src;
    });
    // Start anyway after 2s even if some images are slow
    const fallback = setTimeout(() => setImagesLoaded(true), 2000);
    return () => clearTimeout(fallback);
  }, []);

  // Image cycling — independent timer with variable durations
  const cycleImage = useCallback(() => {
    setImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    imageDurationIndex.current = (imageDurationIndex.current + 1) % IMAGE_DURATIONS.length;
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;
    const duration = IMAGE_DURATIONS[imageDurationIndex.current];
    const timer = setTimeout(cycleImage, duration);
    return () => clearTimeout(timer);
  }, [imageIndex, imagesLoaded, cycleImage]);

  // Text cycling — independent timer, slower rhythm
  const cycleText = useCallback(() => {
    setTextIndex((prev) => (prev + 1) % GREETINGS.length);
    textDurationIndex.current = (textDurationIndex.current + 1) % TEXT_DURATIONS.length;
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;
    const duration = TEXT_DURATIONS[textDurationIndex.current];
    const timer = setTimeout(cycleText, duration);
    return () => clearTimeout(timer);
  }, [textIndex, imagesLoaded, cycleText]);

  const currentGreeting = GREETINGS[textIndex];

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
      {/* Image layer — hard cut, no dissolve */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url('${HERO_IMAGES[imageIndex]}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "none",
        }}
      />

      {/* Subtle overlay for text legibility */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0, 0, 0, 0.3)",
        }}
      />

      {/* Text layer — floats on top, cycles independently */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        {/* Greeting word */}
        <p
          key={textIndex}
          lang={currentGreeting.lang}
          style={{
            fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
            fontSize: "clamp(42px, 8vw, 56px)",
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "0.18em",
            textTransform: currentGreeting.lang === "ar" || currentGreeting.lang === "he" ? "none" : "uppercase",
            margin: 0,
            lineHeight: 1.1,
            animation: "heroTextFadeIn 0.3s ease-out",
          }}
        >
          {currentGreeting.text}
        </p>

        {/* Constant subtitle */}
        <p
          style={{
            fontFamily: "'Lora', 'Cormorant Garamond', Georgia, serif",
            fontSize: 14,
            fontStyle: "italic",
            color: "rgba(255, 255, 255, 0.85)",
            letterSpacing: "0.04em",
            marginTop: 16,
          }}
        >
          Discover the world of FIL DE VIE
        </p>
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes heroTextFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
