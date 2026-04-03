import { useState, useEffect, useRef, useCallback } from "react";

const BLOB_BASE = "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2";
const GUIDE_BASE = "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/guide-morocco";
const VIDEO_BASE = "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com";
const V2 = "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/4.3";

// Media pool — 36 stills + 22 video clips = 58 items
// Rule: stills always appear in groups of 2+, never a lone still between videos
const HERO_MEDIA = [
  // — Morocco stills —
  `${BLOB_BASE}/morocco-hero`,
  `${BLOB_BASE}/morocco-motion-1`,
  `${BLOB_BASE}/morocco-ritual-1`,
  // — Morocco videos —
  `${VIDEO_BASE}/hero-video-1.MP4`,
  `${VIDEO_BASE}/woman%20in%20white%20in%20water.MP4`,
  `${VIDEO_BASE}/blowing%20shirt%20cliop.mp4`,
  // — Morocco stills —
  `${VIDEO_BASE}/morocco%20blk%20outfit.jpeg`,
  `${BLOB_BASE}/destination-morocco`,
  `${VIDEO_BASE}/morocco%20cream%20skirt.jpeg`,
  `${GUIDE_BASE}/stay-1-large.jpg`,
  `${GUIDE_BASE}/eat-1-large.jpg`,
  // — Morocco video —
  `${VIDEO_BASE}/hero-video-2.MP4`,
  `${GUIDE_BASE}/shop-1-large.jpg`,
  // — Hydra stills —
  `${BLOB_BASE}/hydra-hero`,
  `${V2}/hydra_cave_hotel.jpg`,
  // — Hydra / Greece videos —
  `${VIDEO_BASE}/hydra%20clip%201.MP4`,
  `${V2}/greece_water_pan.mp4?v=2`,
  `${V2}/hydra_black_fringe_caftan_video.mp4`,
  // — Hydra stills —
  `${BLOB_BASE}/hydra-light-1`,
  `${BLOB_BASE}/hydra-ritual-1`,
  // — Hydra videos —
  `${V2}/hydra_water_panoramic.mp4?v=2`,
  `${V2}/hydra_interior_arches.mp4`,
  `${V2}/hydra_white_look_boar.mp4`,
  // — Hydra still + transition —
  `${BLOB_BASE}/destination-hydra`,
  `${V2}/med_woman_floating_back.JPG`,
  // — Med / Italy videos —
  `${VIDEO_BASE}/A%20realistic%20fashion%20editorial%20video%20of%20a%20model%20in%20a%20white%20dress%20and%20sunglasses%2C%20with%20a%20gentle%20breeze%20blowing%20her%20hair%20and%20dress.%20She%20is%20slowly%20walking%20along%20a%20stone%20wall%20next%20to%20the%20ocean%2C%20with%20a%20rocky%20cliff%20in%20the%20background.%20The%20camera%20captures%20%E2%80%A6.mp4`,
  `${V2}/med_blacony_drapes.mp4`,
  `${V2}/striped%20shirt%20on%20boat.mp4`,
  // — Med stills —
  `${V2}/SIU%20_%20Perfume%20for%20spring%20_%20Spring%20_%20Parfum%20in%20Spring%20_%20Aesthetic%20_%20Parfum.jpeg`,
  `${V2}/amalfi_lunch.jpeg`,
  `${V2}/suitcase_open.jpg`,
  // — Italy / Med videos —
  `${VIDEO_BASE}/italy%20coast.MP4`,
  `${V2}/portofion_cliffside.mp4`,
  `${V2}/med_stroll.mp4`,
  `${V2}/med_interior_drapes.mp4`,
  `${V2}/interior%20of%20villa.mp4`,
  `${V2}/resort%20with%20curtains.mp4`,
  // — Slow Travel stills —
  `${BLOB_BASE}/slow-travel-hero`,
  `${BLOB_BASE}/slow-culture-1`,
  // — Slow Travel videos —
  `${VIDEO_BASE}/mallorca.MP4`,
  `${VIDEO_BASE}/hero-video-3.MP4`,
  // — Slow Travel stills —
  `${BLOB_BASE}/slow-museum`,
  `${BLOB_BASE}/slow-lunch`,
  `${BLOB_BASE}/destination-slow-travel`,
  // — Retreat stills —
  `${BLOB_BASE}/retreat-motion-1`,
  `${BLOB_BASE}/retreat-ritual-1`,
  `${BLOB_BASE}/destination-retreat`,
  // — New York stills —
  `${VIDEO_BASE}/new%20york%201.jpeg`,
  `${V2}/newyork_swan_room.jpeg`,
  `${BLOB_BASE}/newyork-hero`,
  // — New York video —
  `${VIDEO_BASE}/hero-video-4.MP4`,
  // — New York stills —
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

// Stills cut at 1s, videos hold 2s for motion
const IMAGE_DURATION = 750;
const VIDEO_DURATION = 2000;

// --- TEXT MOMENTS ---

interface Syllable {
  text: string;
  position: React.CSSProperties;
  delay: number;
}

interface TextMoment {
  type: "text" | "silent" | "whitecard" | "scattered";
  word?: string;
  syllables?: Syllable[];
  position?: React.CSSProperties;
  fontSize?: string;
}

const SIZE_DEFAULT = "clamp(36px, 7vw, 48px)";
const SIZE_LARGE = "clamp(52px, 10vw, 72px)";
const SIZE_XL = "clamp(72px, 15vw, 100px)";

// The full sequence — greetings in 7 languages, feature words, white card destinations
// Scattered syllable treatments for HOLA and SALUTE
const TEXT_SEQUENCE: TextMoment[] = [
  // -- open with images (3 beats of breathing)
  { type: "silent" },
  { type: "silent" },
  { type: "silent" },

  // -- HO · LA scattered large
  { type: "scattered", syllables: [
    { text: "HO", position: { top: "22%", left: "8%" }, delay: 0 },
    { text: "LA", position: { bottom: "22%", right: "8%" }, delay: 600 },
  ]},
  { type: "silent" },
  { type: "silent" },

  // -- TRAVEL types out center-bottom
  { type: "text", word: "TRAVEL", position: { bottom: "30%", left: "50%", transform: "translateX(-50%)" } },
  { type: "silent" },
  { type: "silent" },
  { type: "silent" },

  // -- clean beat then white card
  { type: "silent" },
  { type: "whitecard", word: "MOROCCO" },

  // -- images breathe
  { type: "silent" },
  { type: "silent" },
  { type: "silent" },

  // -- ΓΕΙΑ (Greek hello) large
  { type: "text", word: "\u0393\u0395\u0399\u0391", fontSize: SIZE_LARGE, position: { bottom: "28%", left: "10%" } },
  { type: "silent" },
  { type: "silent" },

  // -- TIPS types out
  { type: "text", word: "TIPS", position: { bottom: "30%", left: "50%", transform: "translateX(-50%)" } },
  { type: "silent" },
  { type: "silent" },
  { type: "silent" },

  // -- clean beat then white card
  { type: "silent" },
  { type: "whitecard", word: "HYDRA" },

  // -- images breathe
  { type: "silent" },
  { type: "silent" },
  { type: "silent" },

  // -- こんにちは (Japanese hello)
  { type: "text", word: "\u3053\u3093\u306B\u3061\u306F", fontSize: SIZE_LARGE, position: { top: "40%", right: "8%" } },
  { type: "silent" },
  { type: "silent" },

  // -- MEMORIES types out center
  { type: "text", word: "MEMORIES", position: { bottom: "30%", left: "50%", transform: "translateX(-50%)" } },
  { type: "silent" },
  { type: "silent" },
  { type: "silent" },

  // -- SA · LU · TE scattered large
  { type: "scattered", syllables: [
    { text: "SA", position: { top: "20%", left: "8%" }, delay: 0 },
    { text: "LU", position: { top: "45%", right: "8%" }, delay: 500 },
    { text: "TE", position: { bottom: "20%", left: "12%" }, delay: 1000 },
  ]},
  { type: "silent" },
  { type: "silent" },
  { type: "silent" },

  // -- clean beat then white card
  { type: "silent" },
  { type: "whitecard", word: "MALLORCA" },

  // -- images breathe
  { type: "silent" },
  { type: "silent" },
  { type: "silent" },

  // -- مرحبا (Arabic hello)
  { type: "text", word: "\u0645\u0631\u062D\u0628\u0627", fontSize: SIZE_LARGE, position: { bottom: "28%", right: "10%" } },
  { type: "silent" },
  { type: "silent" },

  // -- SHOP types out center
  { type: "text", word: "SHOP", position: { bottom: "30%", left: "50%", transform: "translateX(-50%)" } },
  { type: "silent" },
  { type: "silent" },

  // -- שלום (Hebrew hello)
  { type: "text", word: "\u05E9\u05DC\u05D5\u05DD", fontSize: SIZE_LARGE, position: { top: "38%", left: "10%" } },
  { type: "silent" },
  { type: "silent" },
  { type: "silent" },

  // -- HELLO types out center
  { type: "text", word: "HELLO", position: { bottom: "30%", left: "50%", transform: "translateX(-50%)" } },
  { type: "silent" },
  { type: "silent" },
  { type: "silent" },
];

// Durations per moment type
function getTextDuration(moment: TextMoment): number {
  switch (moment.type) {
    // Text: typing time (~200ms/char) + 1s hold after
    case "text": {
      const len = moment.word?.length || 5;
      return len * 200 + 1000;
    }
    // Scattered: stagger delays + typing + hold
    case "scattered": return 3500;
    // Silent: breathing room
    case "silent": return [1100, 1300, 1500, 1200, 1400][Math.floor(Math.random() * 5)];
    // White card: typing + hold — Zara holds these ~2.5s
    case "whitecard": {
      const len = moment.word?.length || 6;
      return len * 200 + 1200;
    }
  }
}

// --- TYPEWRITER HOOK ---
// Fixed speed per character (~200ms) like Zara
function useTypewriter(text: string, charSpeed: number = 200) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed("");
    indexRef.current = 0;
    if (!text) return;

    const timer = setInterval(() => {
      indexRef.current++;
      setDisplayed(text.slice(0, indexRef.current));
      if (indexRef.current >= text.length) {
        clearInterval(timer);
      }
    }, charSpeed);

    return () => clearInterval(timer);
  }, [text, charSpeed]);

  return displayed;
}

// --- DELAYED TYPEWRITER HOOK (for scattered syllables) ---
function useDelayedTypewriter(text: string, delay: number, charSpeed: number = 200) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setDisplayed("");
    indexRef.current = 0;
    if (!text) return;

    const delayTimer = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        indexRef.current++;
        setDisplayed(text.slice(0, indexRef.current));
        if (indexRef.current >= text.length && intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }, charSpeed);
    }, delay);

    return () => {
      clearTimeout(delayTimer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, delay, charSpeed]);

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
function TypewriterText({ word, style, color, fontSize }: {
  word: string; style: React.CSSProperties; color: string; fontSize?: string;
}) {
  const displayed = useTypewriter(word, 200);
  return (
    <p style={{ ...TEXT_STYLE, position: "absolute", fontSize: fontSize || SIZE_DEFAULT, ...style, color }}>
      {displayed}
      <span style={{ opacity: displayed.length < word.length ? 0.5 : 0, transition: "opacity 0.15s" }}>|</span>
    </p>
  );
}

// --- Scattered syllable component ---
function ScatteredSyllable({ text, position, delay, color }: {
  text: string; position: React.CSSProperties; delay: number; color: string;
}) {
  const displayed = useDelayedTypewriter(text, delay, 250);
  return (
    <p style={{ ...TEXT_STYLE, position: "absolute", fontSize: SIZE_XL, ...position, color }}>
      {displayed}
      <span style={{ opacity: displayed.length < text.length && displayed.length > 0 ? 0.5 : 0, transition: "opacity 0.15s" }}>|</span>
    </p>
  );
}

export function HeroAnimation() {
  const [mediaIndex, setMediaIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imageTimerPaused = useRef(false);

  const currentMoment = TEXT_SEQUENCE[textIndex];
  const isWhiteCard = currentMoment.type === "whitecard";
  const currentMedia = HERO_MEDIA[mediaIndex];
  const currentIsVideo = isVideo(currentMedia);

  // Preload first batch of images (skip videos)
  useEffect(() => {
    let loaded = 0;
    const imagesToPreload = HERO_MEDIA.filter(src => !isVideo(src)).slice(0, 8);
    const total = imagesToPreload.length;
    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.onload = () => { loaded++; if (loaded >= total) setImagesLoaded(true); };
      img.onerror = () => { loaded++; if (loaded >= total) setImagesLoaded(true); };
      img.src = src;
    });
    const fallback = setTimeout(() => setImagesLoaded(true), 2000);
    return () => clearTimeout(fallback);
  }, []);

  // Media cycling — pauses during white cards, videos hold longer
  const cycleMedia = useCallback(() => {
    setMediaIndex((prev) => (prev + 1) % HERO_MEDIA.length);
  }, []);

  useEffect(() => {
    imageTimerPaused.current = isWhiteCard;
  }, [isWhiteCard]);

  useEffect(() => {
    if (!imagesLoaded || isWhiteCard) return;
    const duration = isVideo(HERO_MEDIA[mediaIndex]) ? VIDEO_DURATION : IMAGE_DURATION;
    const timer = setTimeout(cycleMedia, duration);
    return () => clearTimeout(timer);
  }, [mediaIndex, imagesLoaded, cycleMedia, isWhiteCard]);

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
      {/* Media layer — image or video, hidden during white card */}
      {!isWhiteCard && (
        currentIsVideo ? (
          <video
            key={currentMedia}
            autoPlay
            muted
            playsInline
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            src={currentMedia}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url('${currentMedia}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )
      )}

      {/* Overlay for text legibility */}
      {showOverlay && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0, 0, 0, 0.15)" }} />
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

        {/* Scattered syllables — large, staggered, at different positions */}
        {currentMoment.type === "scattered" && currentMoment.syllables && (
          <>
            {currentMoment.syllables.map((syl, i) => (
              <ScatteredSyllable
                key={i}
                text={syl.text}
                position={syl.position}
                delay={syl.delay}
                color="#ffffff"
              />
            ))}
            <p style={SUBTITLE_STYLE as React.CSSProperties}>
              Discover the world of FIL DE VIE
            </p>
          </>
        )}

        {/* White card — typewriter in black, positioned lower-left like Zara */}
        {isWhiteCard && currentMoment.word && (
          <TypewriterText
            word={currentMoment.word}
            style={{ bottom: "35%", left: "8%" }}
            color="#1A1A18"
            fontSize={SIZE_LARGE}
          />
        )}
      </div>
    </section>
  );
}
