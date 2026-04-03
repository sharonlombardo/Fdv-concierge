import { useState, useEffect, useRef, useCallback } from "react";

const BLOB_BASE = "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2";
const GUIDE_BASE = "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/guide-morocco";
const VIDEO_BASE = "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com";
const V2 = "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/4.3";

// Media pool — 35 stills + 18 video clips = 53 items
const HERO_MEDIA = [
  `${BLOB_BASE}/morocco-hero`,
  `${BLOB_BASE}/morocco-motion-1`,
  `${BLOB_BASE}/morocco-ritual-1`,
  `${VIDEO_BASE}/hero-video-1.MP4`,
  `${VIDEO_BASE}/woman%20in%20white%20in%20water.MP4`,
  `${VIDEO_BASE}/blowing%20shirt%20cliop.mp4`,
  `${VIDEO_BASE}/morocco%20blk%20outfit.jpeg`,
  `${BLOB_BASE}/destination-morocco`,
  `${VIDEO_BASE}/morocco%20cream%20skirt.jpeg`,
  `${GUIDE_BASE}/stay-1-large.jpg`,
  `${GUIDE_BASE}/eat-1-large.jpg`,
  `${VIDEO_BASE}/hero-video-2.MP4`,
  `${GUIDE_BASE}/shop-1-large.jpg`,
  `${BLOB_BASE}/hydra-hero`,
  `${V2}/hydra_cave_hotel.jpg`,
  `${VIDEO_BASE}/hydra%20clip%201.MP4`,
  `${BLOB_BASE}/hydra-light-1`,
  `${BLOB_BASE}/hydra-ritual-1`,
  `${V2}/hydra_interior_arches.mp4`,
  `${V2}/hydra_white_look_boar.mp4`,
  `${BLOB_BASE}/destination-hydra`,
  `${V2}/med_woman_floating_back.JPG`,
  `${VIDEO_BASE}/A%20realistic%20fashion%20editorial%20video%20of%20a%20model%20in%20a%20white%20dress%20and%20sunglasses%2C%20with%20a%20gentle%20breeze%20blowing%20her%20hair%20and%20dress.%20She%20is%20slowly%20walking%20along%20a%20stone%20wall%20next%20to%20the%20ocean%2C%20with%20a%20rocky%20cliff%20in%20the%20background.%20The%20camera%20captures%20%E2%80%A6.mp4`,
  `${V2}/med_blacony_drapes.mp4`,
  `${V2}/striped%20shirt%20on%20boat.mp4`,
  `${V2}/SIU%20_%20Perfume%20for%20spring%20_%20Spring%20_%20Parfum%20in%20Spring%20_%20Aesthetic%20_%20Parfum.jpeg`,
  `${V2}/amalfi_lunch.jpeg`,
  `${V2}/suitcase_open.jpg`,
  `${V2}/portofion_cliffside.mp4`,
  `${V2}/med_stroll.mp4`,
  `${V2}/med_interior_drapes.mp4`,
  `${V2}/interior%20of%20villa.mp4`,
  `${V2}/resort%20with%20curtains.mp4`,
  `${BLOB_BASE}/slow-travel-hero`,
  `${BLOB_BASE}/slow-culture-1`,
  `${VIDEO_BASE}/mallorca.MP4`,
  `${VIDEO_BASE}/hero-video-3.MP4`,
  `${BLOB_BASE}/slow-museum`,
  `${BLOB_BASE}/slow-lunch`,
  `${BLOB_BASE}/destination-slow-travel`,
  `${BLOB_BASE}/retreat-motion-1`,
  `${BLOB_BASE}/retreat-ritual-1`,
  `${BLOB_BASE}/destination-retreat`,
  `${VIDEO_BASE}/new%20york%201.jpeg`,
  `${V2}/newyork_swan_room.jpeg`,
  `${BLOB_BASE}/newyork-hero`,
  `${VIDEO_BASE}/hero-video-4.MP4`,
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

// Precompute: for each index, find the nearest preceding still (for fallback)
const NEAREST_STILL: string[] = [];
{
  let lastStill = HERO_MEDIA.find(u => !isVideo(u)) || HERO_MEDIA[0];
  for (let i = 0; i < HERO_MEDIA.length; i++) {
    if (!isVideo(HERO_MEDIA[i])) lastStill = HERO_MEDIA[i];
    NEAREST_STILL[i] = lastStill;
  }
}

// ---- TEXT ----

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
    const t = setInterval(() => {
      i.current++;
      setD(text.slice(0, i.current));
      if (i.current >= text.length) clearInterval(t);
    }, speed);
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
      iv.current = setInterval(() => {
        i.current++;
        setD(text.slice(0, i.current));
        if (i.current >= text.length && iv.current) clearInterval(iv.current);
      }, speed);
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

function TypewriterText({ word, style, color, fontSize }: {
  word: string; style: React.CSSProperties; color: string; fontSize?: string;
}) {
  const d = useTypewriter(word, 200);
  return (
    <p style={{ ...TEXT_STYLE, position: "absolute", fontSize: fontSize || SIZE_DEFAULT, ...style, color }}>
      {d}<span style={{ opacity: d.length < word.length ? 0.5 : 0, transition: "opacity 0.15s" }}>|</span>
    </p>
  );
}

function ScatteredSyllable({ text, position, delay, color }: {
  text: string; position: React.CSSProperties; delay: number; color: string;
}) {
  const d = useDelayedTypewriter(text, delay, 250);
  return (
    <p style={{ ...TEXT_STYLE, position: "absolute", fontSize: SIZE_XL, ...position, color }}>
      {d}<span style={{ opacity: d.length < text.length && d.length > 0 ? 0.5 : 0, transition: "opacity 0.15s" }}>|</span>
    </p>
  );
}

/*
 * MEDIA ENGINE — uses imperative DOM manipulation to avoid React re-render artifacts.
 *
 * React only knows about the text layer. The media layer (stills + video) is managed
 * entirely via refs and direct DOM style changes. This eliminates:
 * - React unmount/remount flicker
 * - Stale closure bugs
 * - Safari compositor ghost frames from hidden video elements
 *
 * Architecture:
 * - One permanent <div> for stills (backgroundImage swapped directly)
 * - One <video> element created/destroyed via ref container (not React state)
 * - One permanent fallback <div> behind everything
 * - All managed by a single useEffect interval
 */

export function HeroAnimation() {
  const [textIndex, setTextIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Refs for imperative media management
  const containerRef = useRef<HTMLDivElement>(null);
  const stillLayerRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const mediaIndexRef = useRef(0);
  const mediaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isWhiteCardRef = useRef(false);
  const currentVideoRef = useRef<HTMLVideoElement | null>(null);

  const currentMoment = TEXT_SEQUENCE[textIndex];
  const isWhiteCard = currentMoment.type === "whitecard";
  isWhiteCardRef.current = isWhiteCard;

  // Preload all stills
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

  // Show a specific media item — called imperatively, no React state
  const showMedia = useCallback((index: number) => {
    const url = HERO_MEDIA[index];
    const isVid = isVideo(url);
    const still = stillLayerRef.current;
    const vidContainer = videoContainerRef.current;
    if (!still || !vidContainer) return;

    if (isVid) {
      // Update the still layer to show the nearest preceding still as fallback
      // (visible behind the video while it loads)
      still.style.backgroundImage = `url('${NEAREST_STILL[index]}')`;

      // Remove any existing video element
      if (currentVideoRef.current) {
        currentVideoRef.current.pause();
        currentVideoRef.current.remove();
        currentVideoRef.current = null;
      }

      // Create a fresh video element — avoids all Safari compositor bugs
      // Start invisible so no partial rectangle flashes before first frame
      const video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      video.preload = "auto";
      video.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;";
      video.src = url;
      // Only reveal once the first frame is decoded and ready to paint
      const reveal = () => { video.style.opacity = "1"; };
      video.addEventListener("loadeddata", reveal, { once: true });
      vidContainer.appendChild(video);
      currentVideoRef.current = video;
      video.play().catch(() => {});
    } else {
      // Remove any video element
      if (currentVideoRef.current) {
        currentVideoRef.current.pause();
        currentVideoRef.current.remove();
        currentVideoRef.current = null;
      }

      // Swap the still background
      still.style.backgroundImage = `url('${url}')`;
    }
  }, []);

  // Advance to next media
  const advance = useCallback(() => {
    if (isWhiteCardRef.current) return;
    const nextIdx = (mediaIndexRef.current + 1) % HERO_MEDIA.length;
    mediaIndexRef.current = nextIdx;
    showMedia(nextIdx);
    scheduleNext(nextIdx);
  }, [showMedia]);

  // Schedule the next advance
  const scheduleNext = useCallback((index: number) => {
    if (mediaTimerRef.current) clearTimeout(mediaTimerRef.current);
    const url = HERO_MEDIA[index];
    const duration = isVideo(url) ? VIDEO_DURATION : IMAGE_DURATION;
    mediaTimerRef.current = setTimeout(advance, duration);
  }, [advance]);

  // Start media cycling when images are loaded
  useEffect(() => {
    if (!imagesLoaded) return;
    showMedia(0);
    scheduleNext(0);
    return () => {
      if (mediaTimerRef.current) clearTimeout(mediaTimerRef.current);
      // Clean up any playing video on unmount
      if (currentVideoRef.current) {
        currentVideoRef.current.pause();
        currentVideoRef.current.remove();
        currentVideoRef.current = null;
      }
    };
  }, [imagesLoaded, showMedia, scheduleNext]);

  // Handle white card enter/exit
  const wasWhiteCardRef = useRef(false);
  useEffect(() => {
    if (!imagesLoaded) return;

    if (isWhiteCard && !wasWhiteCardRef.current) {
      // Entering white card — pause media timer
      if (mediaTimerRef.current) {
        clearTimeout(mediaTimerRef.current);
        mediaTimerRef.current = null;
      }
    } else if (!isWhiteCard && wasWhiteCardRef.current) {
      // Exiting white card — advance and resume
      const nextIdx = (mediaIndexRef.current + 1) % HERO_MEDIA.length;
      mediaIndexRef.current = nextIdx;
      showMedia(nextIdx);
      scheduleNext(nextIdx);
    }

    wasWhiteCardRef.current = isWhiteCard;
  }, [isWhiteCard, imagesLoaded, showMedia, scheduleNext]);

  // Text timer
  const cycleText = useCallback(() => {
    setTextIndex(p => (p + 1) % TEXT_SEQUENCE.length);
  }, []);
  useEffect(() => {
    if (!imagesLoaded) return;
    const timer = setTimeout(cycleText, getTextDuration(TEXT_SEQUENCE[textIndex]));
    return () => clearTimeout(timer);
  }, [textIndex, imagesLoaded, cycleText]);

  // Preload the next upcoming video in the sequence
  useEffect(() => {
    if (!imagesLoaded) return;
    const idx = mediaIndexRef.current;
    for (let offset = 1; offset <= 5; offset++) {
      const nextUrl = HERO_MEDIA[(idx + offset) % HERO_MEDIA.length];
      if (isVideo(nextUrl)) {
        const v = document.createElement("video");
        v.preload = "auto";
        v.src = nextUrl;
        v.load();
        break;
      }
    }
  }, [imagesLoaded, textIndex]); // textIndex used as a proxy tick to keep preloading

  const showOverlay = currentMoment.type === "text" || currentMoment.type === "scattered";

  return (
    <section
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#0a0a0a",
      }}
    >
      {/* Layer 0: Permanent fallback still — always visible, never black */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url('${HERO_MEDIA[0]}')`,
        backgroundSize: "cover", backgroundPosition: "center",
      }} />

      {/* Layer 1: Current still — backgroundImage swapped imperatively via ref */}
      <div
        ref={stillLayerRef}
        style={{
          position: "absolute", inset: 0,
          backgroundSize: "cover", backgroundPosition: "center",
        }}
      />

      {/* Layer 2: Video container — video elements created/destroyed imperatively */}
      <div
        ref={videoContainerRef}
        style={{ position: "absolute", inset: 0 }}
      />

      {/* Layer 3: White card overlay */}
      <div style={{
        position: "absolute", inset: 0, backgroundColor: "#F7F5F1",
        zIndex: 5, opacity: isWhiteCard ? 1 : 0,
        transition: "opacity 0.1s",
        pointerEvents: isWhiteCard ? "auto" : "none",
      }} />

      {/* Layer 4: Dark overlay for text */}
      {showOverlay && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.15)", zIndex: 6 }} />
      )}

      {/* Layer 5: Text */}
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
