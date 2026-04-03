import { useState, useEffect, useRef, useCallback } from "react";

const BLOB_BASE = "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2";
const GUIDE_BASE = "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/guide-morocco";
const VIDEO_BASE = "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com";
const V2 = "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/4.3";

// Media pool — 35 stills + 18 video clips = 53 items
// Rule: stills always appear in groups of 2+, never a lone still between videos
const HERO_MEDIA = [
  // — Morocco stills (3) —
  `${BLOB_BASE}/morocco-hero`,
  `${BLOB_BASE}/morocco-motion-1`,
  `${BLOB_BASE}/morocco-ritual-1`,
  // — Morocco videos (3) —
  `${VIDEO_BASE}/hero-video-1.MP4`,
  `${VIDEO_BASE}/woman%20in%20white%20in%20water.MP4`,
  `${VIDEO_BASE}/blowing%20shirt%20cliop.mp4`,
  // — Morocco stills (5) —
  `${VIDEO_BASE}/morocco%20blk%20outfit.jpeg`,
  `${BLOB_BASE}/destination-morocco`,
  `${VIDEO_BASE}/morocco%20cream%20skirt.jpeg`,
  `${GUIDE_BASE}/stay-1-large.jpg`,
  `${GUIDE_BASE}/eat-1-large.jpg`,
  // — Morocco video (1) —
  `${VIDEO_BASE}/hero-video-2.MP4`,
  // — Hydra stills (3) —
  `${GUIDE_BASE}/shop-1-large.jpg`,
  `${BLOB_BASE}/hydra-hero`,
  `${V2}/hydra_cave_hotel.jpg`,
  // — Hydra video (1) —
  `${VIDEO_BASE}/hydra%20clip%201.MP4`,
  // — Hydra stills (2) —
  `${BLOB_BASE}/hydra-light-1`,
  `${BLOB_BASE}/hydra-ritual-1`,
  // — Hydra videos (2) —
  `${V2}/hydra_interior_arches.mp4`,
  `${V2}/hydra_white_look_boar.mp4`,
  // — Hydra/Med stills (2) —
  `${BLOB_BASE}/destination-hydra`,
  `${V2}/med_woman_floating_back.JPG`,
  // — Med / Italy videos (3) —
  `${VIDEO_BASE}/A%20realistic%20fashion%20editorial%20video%20of%20a%20model%20in%20a%20white%20dress%20and%20sunglasses%2C%20with%20a%20gentle%20breeze%20blowing%20her%20hair%20and%20dress.%20She%20is%20slowly%20walking%20along%20a%20stone%20wall%20next%20to%20the%20ocean%2C%20with%20a%20rocky%20cliff%20in%20the%20background.%20The%20camera%20captures%20%E2%80%A6.mp4`,
  `${V2}/med_blacony_drapes.mp4`,
  `${V2}/striped%20shirt%20on%20boat.mp4`,
  // — Med stills (3) —
  `${V2}/SIU%20_%20Perfume%20for%20spring%20_%20Spring%20_%20Parfum%20in%20Spring%20_%20Aesthetic%20_%20Parfum.jpeg`,
  `${V2}/amalfi_lunch.jpeg`,
  `${V2}/suitcase_open.jpg`,
  // — Italy / Med videos (5) —
  `${V2}/portofion_cliffside.mp4`,
  `${V2}/med_stroll.mp4`,
  `${V2}/med_interior_drapes.mp4`,
  `${V2}/interior%20of%20villa.mp4`,
  `${V2}/resort%20with%20curtains.mp4`,
  // — Slow Travel stills (2) —
  `${BLOB_BASE}/slow-travel-hero`,
  `${BLOB_BASE}/slow-culture-1`,
  // — Slow Travel videos (2) —
  `${VIDEO_BASE}/mallorca.MP4`,
  `${VIDEO_BASE}/hero-video-3.MP4`,
  // — Slow Travel stills (3) —
  `${BLOB_BASE}/slow-museum`,
  `${BLOB_BASE}/slow-lunch`,
  `${BLOB_BASE}/destination-slow-travel`,
  // — Retreat stills (3) —
  `${BLOB_BASE}/retreat-motion-1`,
  `${BLOB_BASE}/retreat-ritual-1`,
  `${BLOB_BASE}/destination-retreat`,
  // — New York stills (3) —
  `${VIDEO_BASE}/new%20york%201.jpeg`,
  `${V2}/newyork_swan_room.jpeg`,
  `${BLOB_BASE}/newyork-hero`,
  // — New York video (1) —
  `${VIDEO_BASE}/hero-video-4.MP4`,
  // — New York stills (6) —
  `${V2}/nyc_washington_square.jpeg`,
  `${VIDEO_BASE}/new%20york%202.jpeg`,
  `${BLOB_BASE}/newyork-culture-1`,
  `${BLOB_BASE}/newyork-experience-1`,
  `${BLOB_BASE}/newyork-ritual-1`,
  `${BLOB_BASE}/destination-new-york`,
];

function isVideo(url: string): boolean {
  return /\.(mp4|webm|mov)(\?.*)?$/i.test(url);
}

const IMAGE_DURATION = 750;
const VIDEO_DURATION = 2000;

// --- TEXT ---

interface Syllable { text: string; position: React.CSSProperties; delay: number; }
interface TextMoment {
  type: "text" | "silent" | "whitecard" | "scattered";
  word?: string; syllables?: Syllable[]; position?: React.CSSProperties; fontSize?: string;
}

const SIZE_DEFAULT = "clamp(36px, 7vw, 48px)";
const SIZE_LARGE = "clamp(52px, 10vw, 72px)";
const SIZE_XL = "clamp(72px, 15vw, 100px)";

const TEXT_SEQUENCE: TextMoment[] = [
  { type: "silent" }, { type: "silent" }, { type: "silent" },
  { type: "scattered", syllables: [
    { text: "HO", position: { top: "22%", left: "8%" }, delay: 0 },
    { text: "LA", position: { bottom: "22%", right: "8%" }, delay: 600 },
  ]},
  { type: "silent" }, { type: "silent" },
  { type: "text", word: "TRAVEL", position: { bottom: "30%", left: "50%", transform: "translateX(-50%)" } },
  { type: "silent" }, { type: "silent" }, { type: "silent" },
  { type: "silent" },
  { type: "whitecard", word: "MOROCCO" },
  { type: "silent" }, { type: "silent" }, { type: "silent" },
  { type: "text", word: "\u0393\u0395\u0399\u0391", fontSize: SIZE_LARGE, position: { bottom: "28%", left: "10%" } },
  { type: "silent" }, { type: "silent" },
  { type: "text", word: "TIPS", position: { bottom: "30%", left: "50%", transform: "translateX(-50%)" } },
  { type: "silent" }, { type: "silent" }, { type: "silent" },
  { type: "silent" },
  { type: "whitecard", word: "HYDRA" },
  { type: "silent" }, { type: "silent" }, { type: "silent" },
  { type: "text", word: "\u3053\u3093\u306B\u3061\u306F", fontSize: SIZE_LARGE, position: { top: "40%", right: "8%" } },
  { type: "silent" }, { type: "silent" },
  { type: "text", word: "MEMORIES", position: { bottom: "30%", left: "50%", transform: "translateX(-50%)" } },
  { type: "silent" }, { type: "silent" }, { type: "silent" },
  { type: "scattered", syllables: [
    { text: "SA", position: { top: "20%", left: "8%" }, delay: 0 },
    { text: "LU", position: { top: "45%", right: "8%" }, delay: 500 },
    { text: "TE", position: { bottom: "20%", left: "12%" }, delay: 1000 },
  ]},
  { type: "silent" }, { type: "silent" }, { type: "silent" },
  { type: "silent" },
  { type: "whitecard", word: "MALLORCA" },
  { type: "silent" }, { type: "silent" }, { type: "silent" },
  { type: "text", word: "\u0645\u0631\u062D\u0628\u0627", fontSize: SIZE_LARGE, position: { bottom: "28%", right: "10%" } },
  { type: "silent" }, { type: "silent" },
  { type: "text", word: "SHOP", position: { bottom: "30%", left: "50%", transform: "translateX(-50%)" } },
  { type: "silent" }, { type: "silent" },
  { type: "text", word: "\u05E9\u05DC\u05D5\u05DD", fontSize: SIZE_LARGE, position: { top: "38%", left: "10%" } },
  { type: "silent" }, { type: "silent" }, { type: "silent" },
  { type: "text", word: "HELLO", position: { bottom: "30%", left: "50%", transform: "translateX(-50%)" } },
  { type: "silent" }, { type: "silent" }, { type: "silent" },
];

function getTextDuration(m: TextMoment): number {
  switch (m.type) {
    case "text": return (m.word?.length || 5) * 200 + 1000;
    case "scattered": return 3500;
    case "silent": return 1300;
    case "whitecard": return (m.word?.length || 6) * 200 + 1200;
  }
}

function useTypewriter(text: string, speed = 200) {
  const [d, setD] = useState("");
  const i = useRef(0);
  useEffect(() => {
    setD(""); i.current = 0;
    if (!text) return;
    const t = setInterval(() => { i.current++; setD(text.slice(0, i.current)); if (i.current >= text.length) clearInterval(t); }, speed);
    return () => clearInterval(t);
  }, [text, speed]);
  return d;
}

function useDelayedTypewriter(text: string, delay: number, speed = 200) {
  const [d, setD] = useState("");
  const i = useRef(0);
  const iv = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    setD(""); i.current = 0;
    if (!text) return;
    const dt = setTimeout(() => {
      iv.current = setInterval(() => { i.current++; setD(text.slice(0, i.current)); if (i.current >= text.length && iv.current) clearInterval(iv.current); }, speed);
    }, delay);
    return () => { clearTimeout(dt); if (iv.current) clearInterval(iv.current); };
  }, [text, delay, speed]);
  return d;
}

const TEXT_STYLE: React.CSSProperties = {
  fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  fontWeight: 700, letterSpacing: "0.18em", lineHeight: 1.1, margin: 0, textTransform: "uppercase",
};
const SUBTITLE_STYLE: React.CSSProperties = {
  fontFamily: "'Lora', 'Cormorant Garamond', Georgia, serif",
  fontSize: 14, fontStyle: "italic", color: "rgba(255,255,255,0.85)",
  letterSpacing: "0.04em", position: "absolute", bottom: "8%", left: "50%",
  transform: "translateX(-50%)", textAlign: "center", whiteSpace: "nowrap",
};

function TypewriterText({ word, style, color, fontSize }: { word: string; style: React.CSSProperties; color: string; fontSize?: string }) {
  const d = useTypewriter(word, 200);
  return <p style={{ ...TEXT_STYLE, position: "absolute", fontSize: fontSize || SIZE_DEFAULT, ...style, color }}>{d}<span style={{ opacity: d.length < word.length ? 0.5 : 0, transition: "opacity 0.15s" }}>|</span></p>;
}

function ScatteredSyllable({ text, position, delay, color }: { text: string; position: React.CSSProperties; delay: number; color: string }) {
  const d = useDelayedTypewriter(text, delay, 250);
  return <p style={{ ...TEXT_STYLE, position: "absolute", fontSize: SIZE_XL, ...position, color }}>{d}<span style={{ opacity: d.length < text.length && d.length > 0 ? 0.5 : 0, transition: "opacity 0.15s" }}>|</span></p>;
}

/*
 * SIMPLE APPROACH — no double-buffer state machine.
 *
 * Uses DOM refs to directly manage two video elements and swap their src,
 * avoiding React's unmount/remount cycle entirely. For stills, uses
 * background-image which is already preloaded.
 *
 * Layers (bottom to top):
 * 0. Permanent fallback still — ALWAYS visible, never black
 * 1. Previous media (still div OR video element)
 * 2. Current media (still div OR video element)
 * 5. White card overlay
 * 6. Dark text overlay
 * 7. Text layer
 */

const FALLBACK_STILL = HERO_MEDIA.find(src => !isVideo(src)) || HERO_MEDIA[0];

export function HeroAnimation() {
  const [mediaIndex, setMediaIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const wasWhiteCardRef = useRef(false);

  // Direct refs to video elements — avoids React key-based remounting
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  // Track which video element is "current" (A or B alternate)
  const videoSlotRef = useRef<"A" | "B">("A");

  const currentMoment = TEXT_SEQUENCE[textIndex];
  const isWhiteCard = currentMoment.type === "whitecard";
  const currentUrl = HERO_MEDIA[mediaIndex];
  const prevUrl = HERO_MEDIA[prevIndex];
  const currentIsVideo = isVideo(currentUrl);
  const prevIsVideo = isVideo(prevUrl);

  // Preload all stills on mount
  useEffect(() => {
    let loaded = 0;
    const stills = HERO_MEDIA.filter(s => !isVideo(s));
    const total = stills.length;
    stills.forEach(src => {
      const img = new Image();
      img.onload = () => { loaded++; if (loaded >= total) setImagesLoaded(true); };
      img.onerror = () => { loaded++; if (loaded >= total) setImagesLoaded(true); };
      img.src = src;
    });
    setTimeout(() => setImagesLoaded(true), 4000);
  }, []);

  // When mediaIndex changes, load video into the next slot via ref (no React remount)
  useEffect(() => {
    if (!currentIsVideo) return;
    const slot = videoSlotRef.current;
    const el = slot === "A" ? videoARef.current : videoBRef.current;
    if (el) {
      el.src = currentUrl;
      el.currentTime = 0;
      el.load();
      el.play().catch(() => {});
    }
  }, [mediaIndex, currentIsVideo, currentUrl]);

  // Preload next video
  useEffect(() => {
    const nextUrl = HERO_MEDIA[(mediaIndex + 1) % HERO_MEDIA.length];
    if (isVideo(nextUrl)) {
      const v = document.createElement("video");
      v.preload = "auto";
      v.src = nextUrl;
      v.load();
    }
  }, [mediaIndex]);

  const cycleMedia = useCallback(() => {
    setPrevIndex(mediaIndex);
    const nextIdx = (mediaIndex + 1) % HERO_MEDIA.length;
    // Alternate video slot for next video
    if (isVideo(HERO_MEDIA[nextIdx])) {
      videoSlotRef.current = videoSlotRef.current === "A" ? "B" : "A";
    }
    setMediaIndex(nextIdx);
  }, [mediaIndex]);

  // White card exit → advance
  useEffect(() => {
    if (wasWhiteCardRef.current && !isWhiteCard) {
      cycleMedia();
    }
    wasWhiteCardRef.current = isWhiteCard;
  }, [isWhiteCard, cycleMedia]);

  // Media timer
  useEffect(() => {
    if (!imagesLoaded || isWhiteCard) return;
    const duration = isVideo(HERO_MEDIA[mediaIndex]) ? VIDEO_DURATION : IMAGE_DURATION;
    const timer = setTimeout(cycleMedia, duration);
    return () => clearTimeout(timer);
  }, [mediaIndex, imagesLoaded, cycleMedia, isWhiteCard]);

  // Text timer
  const cycleText = useCallback(() => {
    setTextIndex(p => (p + 1) % TEXT_SEQUENCE.length);
  }, []);
  useEffect(() => {
    if (!imagesLoaded) return;
    const timer = setTimeout(cycleText, getTextDuration(TEXT_SEQUENCE[textIndex]));
    return () => clearTimeout(timer);
  }, [textIndex, imagesLoaded, cycleText]);

  const showOverlay = currentMoment.type === "text" || currentMoment.type === "scattered";
  const currentVideoSlot = videoSlotRef.current;

  return (
    <section style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden", backgroundColor: "#0a0a0a" }}>

      {/* z-0: Permanent fallback still — NEVER see black */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: `url('${FALLBACK_STILL}')`,
        backgroundSize: "cover", backgroundPosition: "center",
      }} />

      {/* z-1: Previous media — stays visible behind current */}
      {!prevIsVideo && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          backgroundImage: `url('${prevUrl}')`,
          backgroundSize: "cover", backgroundPosition: "center",
        }} />
      )}

      {/* z-2: Current still (only rendered when current is a still) */}
      {!currentIsVideo && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 2,
          backgroundImage: `url('${currentUrl}')`,
          backgroundSize: "cover", backgroundPosition: "center",
        }} />
      )}

      {/* z-2/z-3: Two persistent video elements — NEVER unmount, swap via src ref */}
      <video
        ref={videoARef}
        muted
        playsInline
        preload="auto"
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover",
          zIndex: currentIsVideo && currentVideoSlot === "A" ? 3 : 0,
          visibility: currentIsVideo && currentVideoSlot === "A" ? "visible" : "hidden",
        }}
      />
      <video
        ref={videoBRef}
        muted
        playsInline
        preload="auto"
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover",
          zIndex: currentIsVideo && currentVideoSlot === "B" ? 3 : 0,
          visibility: currentIsVideo && currentVideoSlot === "B" ? "visible" : "hidden",
        }}
      />

      {/* z-5: White card overlay */}
      <div style={{
        position: "absolute", inset: 0, backgroundColor: "#F7F5F1",
        zIndex: 5, opacity: isWhiteCard ? 1 : 0,
        pointerEvents: isWhiteCard ? "auto" : "none",
      }} />

      {/* z-6: Dark overlay for text */}
      {showOverlay && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.15)", zIndex: 6 }} />
      )}

      {/* z-7: Text */}
      <div key={textIndex} style={{ position: "absolute", inset: 0, zIndex: 7 }}>
        {currentMoment.type === "text" && currentMoment.word && (
          <>
            <TypewriterText word={currentMoment.word} style={currentMoment.position || {}} color="#ffffff" fontSize={currentMoment.fontSize} />
            <p style={SUBTITLE_STYLE as React.CSSProperties}>Discover the world of FIL DE VIE</p>
          </>
        )}
        {currentMoment.type === "scattered" && currentMoment.syllables && (
          <>
            {currentMoment.syllables.map((syl, i) => (
              <ScatteredSyllable key={i} text={syl.text} position={syl.position} delay={syl.delay} color="#ffffff" />
            ))}
            <p style={SUBTITLE_STYLE as React.CSSProperties}>Discover the world of FIL DE VIE</p>
          </>
        )}
        {isWhiteCard && currentMoment.word && (
          <TypewriterText word={currentMoment.word} style={{ bottom: "35%", left: "8%" }} color="#1A1A18" fontSize={SIZE_LARGE} />
        )}
      </div>
    </section>
  );
}
