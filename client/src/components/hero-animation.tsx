import { useState, useEffect, useRef, useCallback } from "react";

const BLOB_BASE = "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2";
const GUIDE_BASE = "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/guide-morocco";

// Deep image pool — 30 editorial photos across 5 destinations
const HERO_IMAGES = [
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
  `${BLOB_BASE}/hydra-hero`,
  `${BLOB_BASE}/hydra-light-1`,
  `${BLOB_BASE}/hydra-light-2`,
  `${BLOB_BASE}/hydra-ritual-1`,
  `${BLOB_BASE}/destination-hydra`,
  `${BLOB_BASE}/slow-travel-hero`,
  `${BLOB_BASE}/slow-culture-1`,
  `${BLOB_BASE}/slow-museum`,
  `${BLOB_BASE}/slow-lunch`,
  `${BLOB_BASE}/destination-slow-travel`,
  `${BLOB_BASE}/retreat-hero`,
  `${BLOB_BASE}/retreat-motion-1`,
  `${BLOB_BASE}/retreat-place-1`,
  `${BLOB_BASE}/retreat-ritual-1`,
  `${BLOB_BASE}/destination-retreat`,
  `${BLOB_BASE}/newyork-hero`,
  `${BLOB_BASE}/newyork-culture-1`,
  `${BLOB_BASE}/newyork-experience-1`,
  `${BLOB_BASE}/newyork-ritual-1`,
  `${BLOB_BASE}/destination-new-york`,
];

// Image cut timing — energetic but not frantic
const IMAGE_DURATIONS = [600, 450, 800, 400, 650, 500, 900, 450, 700, 500];

// --- TEXT MOMENTS ---
// Typewriter effect on text. Scattered syllables for greetings.
// White cards get a clean silent beat before them.

interface Syllable {
  text: string;
  position: React.CSSProperties;
  delay?: number;
}

interface TextMoment {
  type: "text" | "silent" | "whitecard" | "scattered";
  word?: string;
  syllables?: Syllable[];
  position?: React.CSSProperties;
  fontSize?: string;
}

const SIZE_DEFAULT = "clamp(42px, 8vw, 56px)";
const SIZE_LARGE = "clamp(63px, 12vw, 84px)";
const SIZE_XL = "clamp(80px, 16vw, 110px)";

const TEXT_SEQUENCE: TextMoment[] = [
  // -- open with just images (3 beats)
  { type: "silent" },
  { type: "silent" },
  { type: "silent" },
  // -- HO · LA scattered large across screen
  { type: "scattered", syllables: [
    { text: "HO", position: { top: "22%", left: "8%" }, delay: 0 },
    { text: "LA", position: { bottom: "25%", right: "8%" }, delay: 800 },
  ]},
  { type: "silent" },
  { type: "silent" },
  // -- DISCOVER types out
  { type: "text", word: "DISCOVER", position: { bottom: "30%", left: "50%", transform: "translateX(-50%)" } },
  { type: "silent" },
  // -- clean beat, then white card
  { type: "silent" },
  { type: "whitecard", word: "MOROCCO" },
  // -- images breathe
  { type: "silent" },
  { type: "silent" },
  { type: "silent" },
  // -- TRAVEL types out bottom-right
  { type: "text", word: "TRAVEL", position: { bottom: "30%", right: "8%" } },
  { type: "silent" },
  { type: "silent" },
  // -- EAT types out, large
  { type: "text", word: "EAT", fontSize: SIZE_LARGE, position: { top: "40%", left: "10%" } },
  { type: "silent" },
  // -- ΓΕΙΑ large bottom-left
  { type: "text", word: "\u0393\u0395\u0399\u0391", fontSize: SIZE_LARGE, position: { bottom: "28%", left: "10%" } },
  { type: "silent" },
  { type: "silent" },
  // -- clean beat, then white card
  { type: "silent" },
  { type: "whitecard", word: "HYDRA" },
  // -- images breathe
  { type: "silent" },
  { type: "silent" },
  { type: "silent" },
  // -- MEMORIES center, large
  { type: "text", word: "MEMORIES", fontSize: SIZE_LARGE, position: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" } },
  { type: "silent" },
  { type: "silent" },
  // -- RITUAL types out
  { type: "text", word: "RITUAL", position: { top: "38%", right: "8%" } },
  { type: "silent" },
  { type: "silent" },
  // -- SA · LU · TE scattered large across screen
  { type: "scattered", syllables: [
    { text: "SA", position: { top: "20%", right: "10%" }, delay: 0 },
    { text: "LU", position: { top: "48%", left: "12%" }, delay: 700 },
    { text: "TE", position: { bottom: "22%", right: "15%" }, delay: 1400 },
  ]},
  { type: "silent" },
  { type: "silent" },
  // -- EXPLORE types out
  { type: "text", word: "EXPLORE", position: { bottom: "32%", left: "50%", transform: "translateX(-50%)" } },
  { type: "silent" },
  // -- clean beat, then white card
  { type: "silent" },
  { type: "whitecard", word: "MALLORCA" },
  // -- images breathe
  { type: "silent" },
  { type: "silent" },
  { type: "silent" },
  // -- SHOP types out, large
  { type: "text", word: "SHOP", fontSize: SIZE_LARGE, position: { bottom: "30%", left: "12%" } },
  { type: "silent" },
  { type: "silent" },
  // -- HELLO types out, center
  { type: "text", word: "HELLO", position: { bottom: "28%", left: "50%", transform: "translateX(-50%)" } },
  { type: "silent" },
  { type: "silent" },
  { type: "silent" },
];

// Durations — text moments longer to accommodate slow typewriter (~3s typing + hold)
function getTextDuration(moment: TextMoment): number {
  switch (moment.type) {
    case "text": return [4200, 4000, 4400, 4100, 4300][Math.floor(Math.random() * 5)];
    case "scattered": return [4800, 5000, 5200][Math.floor(Math.random() * 3)];
    case "silent": return [1100, 1200, 1400, 1000, 1300][Math.floor(Math.random() * 5)];
    case "whitecard": return [650, 700, 750, 600][Math.floor(Math.random() * 4)];
  }
}

// --- TYPEWRITER HOOK ---
// Adaptive speed: every word takes ~3 seconds to type out
function useTypewriter(text: string, targetDuration: number = 3000) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed("");
    indexRef.current = 0;
    if (!text) return;

    const speed = Math.floor(targetDuration / text.length);
    const timer = setInterval(() => {
      indexRef.current++;
      setDisplayed(text.slice(0, indexRef.current));
      if (indexRef.current >= text.length) {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, targetDuration]);

  return displayed;
}

// --- DELAYED TYPEWRITER HOOK ---
function useDelayedTypewriter(text: string, delay: number, targetDuration: number = 2000) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setDisplayed("");
    indexRef.current = 0;
    if (!text) return;

    const speed = Math.floor(targetDuration / text.length);
    const delayTimer = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        indexRef.current++;
        setDisplayed(text.slice(0, indexRef.current));
        if (indexRef.current >= text.length && intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(delayTimer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, delay, targetDuration]);

  return displayed;
}

const TEXT_STYLE: React.CSSProperties = {
  fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  fontWeight: 700,
  letterSpacing: "0.18em",
  lineHeight: 1.1,
  margin: 0,
  textTransform: "uppercase",
};

const SUBTITLE_STYLE: React.CSSProperties = {
  fontFamily: "'Lora', 'Cormorant Garamond', Georgia, serif",
  fontSize: 14,
  fontStyle: "italic",
  color: "rgba(255, 255, 255, 0.85)",
  letterSpacing: "0.04em",
  position: "absolute",
  bottom: "8%",
  left: "50%",
  transform: "translateX(-50%)",
  textAlign: "center",
  whiteSpace: "nowrap",
};

// --- Typewriter text component (positioned absolutely) ---
function TypewriterText({ word, style, color, fontSize }: { word: string; style: React.CSSProperties; color: string; fontSize?: string }) {
  const displayed = useTypewriter(word, 3000);
  return (
    <p style={{ ...TEXT_STYLE, position: "absolute", fontSize: fontSize || SIZE_DEFAULT, ...style, color }}>
      {displayed}
      <span style={{ opacity: displayed.length < word.length ? 0.6 : 0, transition: "opacity 0.1s" }}>|</span>
    </p>
  );
}

// --- Scattered syllable component ---
function ScatteredSyllable({ text, position, delay, color }: { text: string; position: React.CSSProperties; delay: number; color: string }) {
  const displayed = useDelayedTypewriter(text, delay, 1500);
  return (
    <p style={{ ...TEXT_STYLE, position: "absolute", fontSize: SIZE_XL, ...position, color }}>
      {displayed}
      <span style={{ opacity: displayed.length < text.length ? 0.6 : 0, transition: "opacity 0.1s" }}>|</span>
    </p>
  );
}

export function HeroAnimation() {
  const [imageIndex, setImageIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imageDurationIndex = useRef(0);
  const imageTimerPaused = useRef(false);

  const currentMoment = TEXT_SEQUENCE[textIndex];
  const isWhiteCard = currentMoment.type === "whitecard";

  // Preload first batch of images
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

  // Image cycling — pauses during white cards
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

  // Text sequence cycling
  const cycleText = useCallback(() => {
    setTextIndex((prev) => (prev + 1) % TEXT_SEQUENCE.length);
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;
    const duration = getTextDuration(TEXT_SEQUENCE[textIndex]);
    const timer = setTimeout(cycleText, duration);
    return () => clearTimeout(timer);
  }, [textIndex, imagesLoaded, cycleText]);

  const showOverlay = currentMoment.type === "text" || currentMoment.type === "scattered";

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

      {/* Overlay for text legibility — only when text/scattered is showing */}
      {showOverlay && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0, 0, 0, 0.25)" }} />
      )}

      {/* TEXT LAYER */}
      <div key={textIndex} style={{ position: "absolute", inset: 0, zIndex: 2 }}>

        {/* Typewriter text over images */}
        {currentMoment.type === "text" && currentMoment.word && (
          <>
            <TypewriterText
              word={currentMoment.word}
              style={currentMoment.position || {}}
              color="#ffffff"
              fontSize={currentMoment.fontSize}
            />
            <p style={SUBTITLE_STYLE as React.CSSProperties}>
              Discover the world of FIL DE VIE
            </p>
          </>
        )}

        {/* Scattered syllables — large, positioned across screen */}
        {currentMoment.type === "scattered" && currentMoment.syllables && (
          <>
            {currentMoment.syllables.map((syl, i) => (
              <ScatteredSyllable
                key={i}
                text={syl.text}
                position={syl.position}
                delay={syl.delay || 0}
                color="#ffffff"
              />
            ))}
            <p style={SUBTITLE_STYLE as React.CSSProperties}>
              Discover the world of FIL DE VIE
            </p>
          </>
        )}

        {/* White card — typewriter in black on white */}
        {isWhiteCard && currentMoment.word && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TypewriterText
              word={currentMoment.word}
              style={{ position: "relative" }}
              color="#1A1A18"
            />
          </div>
        )}
      </div>
    </section>
  );
}
