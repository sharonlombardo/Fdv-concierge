import { useState, useEffect, useRef, useCallback } from "react";

const BLOB_BASE = "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2";

// Destination images — deeper pool so the animation has more visual variety
const GUIDE_BASE = "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/guide-morocco";
const HERO_IMAGES = [
  // Morocco — hero + editorial guide photography
  `${BLOB_BASE}/morocco-hero`,
  `${BLOB_BASE}/morocco-motion-1`,
  `${BLOB_BASE}/morocco-experience-1`,
  `${BLOB_BASE}/morocco-ritual-1`,
  `${BLOB_BASE}/destination-morocco`,
  `${GUIDE_BASE}/hero.jpg`,
  `${GUIDE_BASE}/stay-1-large.jpg`,
  `${GUIDE_BASE}/eat-1-large.jpg`,
  `${GUIDE_BASE}/exp-1-large.jpg`,
  `${GUIDE_BASE}/shop-1-large.jpg`,
  // Hydra
  `${BLOB_BASE}/hydra-hero`,
  `${BLOB_BASE}/hydra-light-1`,
  `${BLOB_BASE}/hydra-light-2`,
  `${BLOB_BASE}/hydra-ritual-1`,
  `${BLOB_BASE}/destination-hydra`,
  // Mallorca
  `${BLOB_BASE}/slow-travel-hero`,
  `${BLOB_BASE}/slow-culture-1`,
  `${BLOB_BASE}/slow-museum`,
  `${BLOB_BASE}/slow-lunch`,
  `${BLOB_BASE}/destination-slow-travel`,
  // Amangiri
  `${BLOB_BASE}/retreat-hero`,
  `${BLOB_BASE}/retreat-motion-1`,
  `${BLOB_BASE}/retreat-place-1`,
  `${BLOB_BASE}/retreat-ritual-1`,
  `${BLOB_BASE}/destination-retreat`,
  // New York
  `${BLOB_BASE}/newyork-hero`,
  `${BLOB_BASE}/newyork-culture-1`,
  `${BLOB_BASE}/newyork-experience-1`,
  `${BLOB_BASE}/newyork-ritual-1`,
  `${BLOB_BASE}/destination-new-york`,
];

// Variable image durations — energetic cuts, the silent frames provide the breathing room
const IMAGE_DURATIONS = [600, 450, 800, 400, 650, 500, 900, 450, 700, 500];

// --- TEXT SEQUENCE ---
// Each moment has a position so nothing repeats in the same spot back to back.
// Positions: "center", "top-left", "top-right", "bottom-left", "bottom-right", "lower-center"

interface TextMoment {
  type: "greeting" | "section" | "silent" | "whitecard";
  word?: string;
  lang?: string;
  // For positioned/scattered text — array of pieces with absolute positioning
  pieces?: { text: string; style: React.CSSProperties }[];
  // Show subtitle line?
  subtitle?: boolean;
}

// Shared font sizes
const SIZE_DEFAULT = "clamp(42px, 8vw, 56px)";
const SIZE_LARGE = "clamp(63px, 12vw, 84px)";
const SIZE_SMALL = "clamp(32px, 6vw, 42px)";

// ~50% of moments are silent (just images). Text is punctuation, not constant.
// Every white card has a clean silent frame before it.
const TEXT_SEQUENCE: TextMoment[] = [
  // -- opening: images only, then first word
  { type: "silent" },
  { type: "silent" },
  {
    type: "greeting", word: "HOLA", lang: "es", subtitle: true, pieces: [
      { text: "HO", style: { position: "absolute", top: "22%", left: "12%", fontSize: SIZE_LARGE } },
      { text: "LA", style: { position: "absolute", bottom: "25%", right: "10%", fontSize: SIZE_LARGE } },
    ],
  },
  { type: "silent" },
  {
    type: "section", subtitle: true, pieces: [
      { text: "TRAVEL", style: { position: "absolute", top: "28%", right: "8%", fontSize: SIZE_DEFAULT } },
    ],
  },
  { type: "silent" },
  // -- clean beat before white card
  { type: "silent" },
  { type: "whitecard", word: "MOROCCO" },
  // -- images breathe, then greeting
  { type: "silent" },
  { type: "silent" },
  {
    type: "greeting", word: "ΓΕΙΑ", lang: "el", subtitle: true, pieces: [
      { text: "ΓΕΙΑ", style: { position: "absolute", bottom: "30%", left: "10%", fontSize: SIZE_DEFAULT } },
    ],
  },
  { type: "silent" },
  {
    type: "section", subtitle: true, pieces: [
      { text: "MEMORIES", style: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: SIZE_LARGE } },
    ],
  },
  { type: "silent" },
  {
    type: "greeting", word: "SALUTE", lang: "it", subtitle: true, pieces: [
      { text: "SA", style: { position: "absolute", top: "18%", left: "8%", fontSize: SIZE_LARGE } },
      { text: "LU", style: { position: "absolute", top: "48%", right: "12%", fontSize: SIZE_LARGE } },
      { text: "TE", style: { position: "absolute", bottom: "22%", left: "22%", fontSize: SIZE_LARGE } },
    ],
  },
  { type: "silent" },
  // -- clean beat before white card
  { type: "silent" },
  { type: "whitecard", word: "HYDRA" },
  // -- images breathe
  { type: "silent" },
  { type: "silent" },
  {
    type: "greeting", word: "ようこそ", lang: "ja", subtitle: true, pieces: [
      { text: "ようこそ", style: { position: "absolute", top: "25%", left: "8%", fontSize: SIZE_DEFAULT } },
    ],
  },
  { type: "silent" },
  {
    type: "section", subtitle: true, pieces: [
      { text: "SHOP", style: { position: "absolute", top: "22%", left: "10%", fontSize: SIZE_LARGE } },
    ],
  },
  { type: "silent" },
  {
    type: "greeting", word: "שָׁלוֹם", lang: "he", subtitle: true, pieces: [
      { text: "שָׁלוֹם", style: { position: "absolute", top: "35%", right: "12%", fontSize: SIZE_DEFAULT } },
    ],
  },
  { type: "silent" },
  // -- clean beat before white card
  { type: "silent" },
  { type: "whitecard", word: "MALLORCA" },
  // -- final stretch
  { type: "silent" },
  {
    type: "greeting", word: "HELLO", lang: "en", subtitle: true, pieces: [
      { text: "HELLO", style: { position: "absolute", bottom: "22%", left: "50%", transform: "translateX(-50%)", fontSize: SIZE_DEFAULT } },
    ],
  },
  { type: "silent" },
  { type: "silent" },
  {
    type: "section", subtitle: true, pieces: [
      { text: "THE NEW", style: { position: "absolute", bottom: "25%", right: "8%", fontSize: SIZE_SMALL } },
    ],
  },
  { type: "silent" },
  {
    type: "greeting", word: "مرحبا", lang: "ar", subtitle: true, pieces: [
      { text: "مرحبا", style: { position: "absolute", top: "30%", right: "10%", fontSize: SIZE_DEFAULT } },
    ],
  },
  { type: "silent" },
  { type: "silent" },
];

// Duration per treatment type (ms)
function getTextDuration(moment: TextMoment): number {
  switch (moment.type) {
    case "greeting": return [2200, 2000, 2400, 2100, 2300][Math.floor(Math.random() * 5)];
    case "section": return [1800, 1600, 2000, 1700, 1900][Math.floor(Math.random() * 5)];
    case "silent": return [1100, 1200, 1400, 1000, 1300][Math.floor(Math.random() * 5)];
    case "whitecard": return [650, 700, 750, 600][Math.floor(Math.random() * 4)];
  }
}

const SHARED_TEXT_STYLE: React.CSSProperties = {
  fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  fontWeight: 700,
  letterSpacing: "0.18em",
  lineHeight: 1.1,
  margin: 0,
  color: "#ffffff",
};

const SUBTITLE_STYLE: React.CSSProperties = {
  fontFamily: "'Lora', 'Cormorant Garamond', Georgia, serif",
  fontSize: 14,
  fontStyle: "italic",
  color: "rgba(255, 255, 255, 0.85)",
  letterSpacing: "0.04em",
};

export function HeroAnimation() {
  const [imageIndex, setImageIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imageDurationIndex = useRef(0);
  const imageTimerPaused = useRef(false);

  const currentMoment = TEXT_SEQUENCE[textIndex];
  const isWhiteCard = currentMoment.type === "whitecard";

  // Preload images
  useEffect(() => {
    let loaded = 0;
    const total = Math.min(HERO_IMAGES.length, 8);
    HERO_IMAGES.slice(0, total).forEach((src) => {
      const img = new Image();
      img.onload = () => { loaded++; if (loaded >= total) setImagesLoaded(true); };
      img.onerror = () => { loaded++; if (loaded >= total) setImagesLoaded(true); };
      img.src = src;
    });
    const fallback = setTimeout(() => setImagesLoaded(true), 2000);
    return () => clearTimeout(fallback);
  }, []);

  // Image cycling — pauses during white card moments
  const cycleImage = useCallback(() => {
    setImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    imageDurationIndex.current = (imageDurationIndex.current + 1) % IMAGE_DURATIONS.length;
  }, []);

  useEffect(() => {
    imageTimerPaused.current = isWhiteCard;
  }, [isWhiteCard]);

  useEffect(() => {
    if (!imagesLoaded || imageTimerPaused.current) return;
    const duration = IMAGE_DURATIONS[imageDurationIndex.current];
    const timer = setTimeout(cycleImage, duration);
    return () => clearTimeout(timer);
  }, [imageIndex, imagesLoaded, cycleImage, isWhiteCard]);

  // Text cycling
  const cycleText = useCallback(() => {
    setTextIndex((prev) => (prev + 1) % TEXT_SEQUENCE.length);
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;
    const duration = getTextDuration(TEXT_SEQUENCE[textIndex]);
    const timer = setTimeout(cycleText, duration);
    return () => clearTimeout(timer);
  }, [textIndex, imagesLoaded, cycleText]);

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: isWhiteCard ? "#F7F5F1" : "#0a0a0a",
      }}
    >
      {/* Image layer — hidden during white card */}
      {!isWhiteCard && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url('${HERO_IMAGES[imageIndex]}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      {/* Overlay for text legibility — hidden during white card and silent */}
      {!isWhiteCard && currentMoment.type !== "silent" && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0, 0, 0, 0.3)" }} />
      )}

      {/* TEXT LAYER — sharp cut, no fade */}
      <div key={textIndex} style={{ position: "absolute", inset: 0, zIndex: 2 }}>
        {/* Positioned text pieces (greetings + section words) */}
        {currentMoment.pieces && currentMoment.pieces.map((piece, i) => {
          const isRtl = currentMoment.lang === "ar" || currentMoment.lang === "he";
          return (
            <p
              key={i}
              lang={currentMoment.lang}
              style={{
                ...SHARED_TEXT_STYLE,
                fontSize: SIZE_DEFAULT,
                ...piece.style,
                color: isWhiteCard ? "#1A1A18" : "#ffffff",
                textTransform: isRtl || currentMoment.lang === "ja" ? "none" : "uppercase",
              }}
            >
              {piece.text}
            </p>
          );
        })}

        {/* Subtitle — positioned bottom center, only for moments that want it */}
        {currentMoment.subtitle && !isWhiteCard && (
          <p style={{
            ...SUBTITLE_STYLE,
            position: "absolute",
            bottom: "8%",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            whiteSpace: "nowrap",
          }}>
            Discover the world of FIL DE VIE
          </p>
        )}

        {/* White card — centered destination name */}
        {isWhiteCard && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ ...SHARED_TEXT_STYLE, fontSize: SIZE_DEFAULT, color: "#1A1A18", textTransform: "uppercase" }}>
              {currentMoment.word}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
