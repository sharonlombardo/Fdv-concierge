import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { useUser } from "@/contexts/user-context";
import { getSessionId } from "@/lib/session";
import { ConciergeOrb, type OrbState } from "./concierge-orb";

interface Message {
  role: "user" | "assistant" | "gate";
  content: string;
}

// ─── Greetings ────────────────────────────────────────────────────────────────
const FIRST_TIME_GREETINGS: Record<string, string> = {
  "/": "Welcome. Start with Morocco — it's live now, everything from where to stay (El Fenn, always) to what to pack (the Marrakech Pants were literally designed for that city). Everything in the guides is shoppable — see something, tap it, it's yours. And when you're ready, I can build the whole trip for you — curated itinerary, wardrobe, packing list, bookings. All of it. I'm here whenever.",
  "/guides/morocco": "You're in the right place. This is the full Morocco guide — every restaurant, hotel, and experience I'd send a friend to, plus the wardrobe to match. Everything's shoppable directly. And if you want the whole thing personalized — your itinerary, your packing list, your reservations — that's what I'm really here for. Where do you want to start?",
  "/destinations": "You're in the right place. This is the full Morocco guide — every restaurant, hotel, and experience I'd send a friend to, plus the wardrobe to match. Everything's shoppable directly. And if you want the whole thing personalized — your itinerary, your packing list, your reservations — that's what I'm really here for. Where do you want to start?",
  "/shop": "This is the full collection — wardrobe, accessories, beauty. Fewer things, better things. If you tell me what you're dressing for — a dinner in Marrakech, a week on an island, a Tuesday that needs saving — I can pull a wardrobe edit just for you.",
  "/suitcase": "You haven't packed anything yet. Browse the guides, heart what stops you — it all lands here. Once I see what you're drawn to, the real work starts: I can build your trip, your wardrobe, the whole picture.",
  "/profile": "This is your home base. The more you explore and save, the better I get at reading what you actually want — not what an algorithm guesses.",
};
const FIRST_TIME_SUITCASE_HAS_SAVES = "Your suitcase is filling up. I can work with this — want me to turn what's here into a trip? Or a wardrobe edit you can actually buy?";
const FIRST_TIME_DEFAULT = "Welcome. I'm here to help you find what you're looking for — whether that's a place, a wardrobe, or the whole trip. Start with Destinations if you want to explore, or just tell me where you're headed.";

const RETURNING_GREETINGS: Record<string, string> = {
  "/": "Welcome back. Where to?",
  "/guides/morocco": "Back in Morocco. Anything catching your eye?",
  "/destinations": "Back in Morocco. Anything catching your eye?",
  "/shop": "Browsing the collection. Want me to pull something specific, or want picks based on what you've saved?",
  "/suitcase": "Your suitcase is filling up. I can work with this — want me to turn what's here into a trip? Or a wardrobe edit you can actually buy?",
  "/profile": "Hey. Anything you need to update, or are you here to explore?",
};
const RETURNING_DEFAULT = "Welcome back. Where to?";
const CURATE_PROMPT_GREETING = "I'm starting to see what moves you. Want me to build your trip around it?";

function getGreeting(path: string, isFirstChat: boolean, saveCount: number, curatePromptShown: boolean): string {
  if (saveCount >= 3 && !curatePromptShown) return CURATE_PROMPT_GREETING;
  if (isFirstChat) {
    if (path.startsWith("/suitcase") && saveCount > 0) return FIRST_TIME_SUITCASE_HAS_SAVES;
    for (const [prefix, g] of Object.entries(FIRST_TIME_GREETINGS)) {
      if (prefix === "/" ? path === "/" : path.startsWith(prefix)) return g;
    }
    return FIRST_TIME_DEFAULT;
  }
  for (const [prefix, g] of Object.entries(RETURNING_GREETINGS)) {
    if (prefix === "/" ? path === "/" : path.startsWith(prefix)) return g;
  }
  return RETURNING_DEFAULT;
}

const ANON_LIMIT = 3;
const FREE_LIMIT = 15;
const ANON_GATE_MSG = "I'd love to keep going — I can tell you have good taste. Create your Digital Passport and I'm all yours. It takes 10 seconds.";
const FREE_GATE_MSG = "I've enjoyed this. If you want me to really learn what moves you — what you save, what catches your eye, what you'd never wear — that's your Gold Passport. I get a lot better when I know you.";

// ─── Speech helpers ───────────────────────────────────────────────────────────
const hasSpeechRecognition =
  typeof window !== "undefined" &&
  ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
const hasSpeechSynthesis =
  typeof window !== "undefined" && "speechSynthesis" in window;

function getSR(): any {
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
}
function pickVoice(): SpeechSynthesisVoice | null {
  if (!hasSpeechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  for (const name of ["Samantha", "Karen", "Moira", "Tessa", "Natural", "Google US English", "Microsoft Aria"]) {
    const v = voices.find((v) => v.name.includes(name) && v.lang.startsWith("en"));
    if (v) return v;
  }
  return voices.find((v) => v.lang === "en-US") || voices[0] || null;
}

type Phase = "closed" | "entering" | "open" | "closing";

// ─── Component ────────────────────────────────────────────────────────────────
export function FloatingConcierge() {
  const [location] = useLocation();
  const { user, email, setShowPassportGate, setPendingSaveCallback } = useUser();

  const [phase, setPhase] = useState<Phase>("closed");
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGated, setIsGated] = useState(false);

  // Brief 'pressed' pulse when the chat opens → gold flood effect
  const [orbFlood, setOrbFlood] = useState(false);

  // Voice input
  const [isListening, setIsListening] = useState(false);
  const [voiceAmplitude, setVoiceAmplitude] = useState(0);
  const recognitionRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const amplitudeFrameRef = useRef<number>(0);
  const autoSendTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Voice output
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [messages, setMessages] = useState<Message[]>(() => {
    try { const s = sessionStorage.getItem("fdv_concierge_messages"); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const [userMsgCount, setUserMsgCount] = useState(() => {
    try { return parseInt(sessionStorage.getItem("fdv_concierge_msg_count") || "0"); } catch { return 0; }
  });
  const hasGreeted = useRef(messages.length > 0);

  useEffect(() => { try { sessionStorage.setItem("fdv_concierge_messages", JSON.stringify(messages)); } catch {} }, [messages]);
  useEffect(() => { try { sessionStorage.setItem("fdv_concierge_msg_count", String(userMsgCount)); } catch {} }, [userMsgCount]);

  const isAuthenticated = !!user;
  const hasEmail = !!email;
  const tier = isAuthenticated ? "free" : hasEmail ? "free" : "anon";
  const messageLimit = tier === "anon" ? ANON_LIMIT : FREE_LIMIT;
  const hidden = location === "/concierge-chat";

  // Computed orb state: flood → voice → loading → base
  const orbState: OrbState = orbFlood
    ? "pressed"
    : isListening
    ? "listening"
    : isLoading
    ? "thinking"
    : isSpeaking
    ? "responding"
    : "idle";

  const statusLabel = isListening
    ? "Listening..."
    : isLoading
    ? "Thinking..."
    : isSpeaking
    ? ""
    : "Your Concierge";

  // Global open event
  const handleOpenRef = useRef<() => void>(() => {});
  useEffect(() => {
    const h = () => handleOpenRef.current();
    window.addEventListener("open-concierge", h);
    return () => window.removeEventListener("open-concierge", h);
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => { if (phase === "open" && inputRef.current) setTimeout(() => inputRef.current?.focus(), 500); }, [phase]);
  useEffect(() => { if (isGated && isAuthenticated) setIsGated(false); }, [isAuthenticated, isGated]);

  // ─── Amplitude tracking ───────────────────────────────────────────────────
  const stopAmplitude = useCallback(() => {
    cancelAnimationFrame(amplitudeFrameRef.current);
    setVoiceAmplitude(0);
    audioCtxRef.current?.close();
    audioCtxRef.current = null;
    analyserRef.current = null;
  }, []);

  const startAmplitude = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const buf = new Float32Array(analyser.frequencyBinCount);
      const tick = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getFloatTimeDomainData(buf);
        const rms = Math.sqrt(buf.reduce((a, v) => a + v * v, 0) / buf.length);
        setVoiceAmplitude(Math.min(1, rms * 6));
        amplitudeFrameRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch { /* no audio context — orb falls back to simulated */ }
  }, []);

  // ─── Voice Input ──────────────────────────────────────────────────────────
  const stopListening = useCallback(() => {
    if (recognitionRef.current) { recognitionRef.current.stop(); recognitionRef.current = null; }
    clearTimeout(autoSendTimerRef.current);
    stopAmplitude();
    setIsListening(false);
  }, [stopAmplitude]);

  const sendMessageRef = useRef<(text?: string) => void>(() => {});

  const startListening = useCallback(() => {
    if (!hasSpeechRecognition) return;
    if (isListening) { stopListening(); return; }
    const rec = new (getSR())();
    recognitionRef.current = rec;
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-US";
    let captured = "";
    rec.onresult = (e: any) => {
      const t = Array.from(e.results as any[]).map((r: any) => r[0].transcript).join("");
      setInput(t);
      captured = t;
      clearTimeout(autoSendTimerRef.current);
      if ((e.results[e.results.length - 1] as any).isFinal) {
        autoSendTimerRef.current = setTimeout(() => { stopListening(); if (captured.trim()) sendMessageRef.current(captured); }, 1800);
      }
    };
    rec.onerror = () => { setIsListening(false); recognitionRef.current = null; stopAmplitude(); };
    rec.onend = () => { setIsListening(false); recognitionRef.current = null; stopAmplitude(); };
    rec.start();
    setIsListening(true);
    startAmplitude();
  }, [isListening, stopListening, startAmplitude, stopAmplitude]);

  useEffect(() => () => { stopListening(); window.speechSynthesis?.cancel(); }, [stopListening]);

  // ─── Voice Output ─────────────────────────────────────────────────────────
  const speakText = useCallback((text: string) => {
    if (!voiceEnabled || !hasSpeechSynthesis) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/[_*`]/g, "").trim();
    const utt = new SpeechSynthesisUtterance(clean);
    const voice = pickVoice();
    if (voice) utt.voice = voice;
    utt.rate = 0.95;
    utt.onstart = () => setIsSpeaking(true);
    utt.onend = () => setIsSpeaking(false);
    utt.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utt);
  }, [voiceEnabled]);

  useEffect(() => { if (!voiceEnabled) { window.speechSynthesis?.cancel(); setIsSpeaking(false); } }, [voiceEnabled]);

  // ─── Open ─────────────────────────────────────────────────────────────────
  const handleOpen = useCallback(async () => {
    clearTimeout(phaseTimerRef.current);
    setPhase("entering");

    phaseTimerRef.current = setTimeout(async () => {
      setPhase("open");
      // Brief gold flood effect as orb appears at full size
      setOrbFlood(true);
      setTimeout(() => setOrbFlood(false), 130);

      if (!hasGreeted.current) {
        hasGreeted.current = true;
        let isFirstChat = true, saveCount = 0, curatePromptShown = false;
        try {
          const res = await fetch("/api/concierge/greeting-context", { credentials: "include" });
          if (res.ok) { const d = await res.json(); isFirstChat = d.isFirstChat ?? true; saveCount = d.saveCount ?? 0; curatePromptShown = d.curatePromptShown ?? false; }
        } catch {}
        const greeting = getGreeting(location, isFirstChat, saveCount, curatePromptShown);
        setMessages([{ role: "assistant", content: greeting }]);
        if (saveCount >= 3 && !curatePromptShown) fetch("/api/concierge/mark-curate-shown", { method: "POST", credentials: "include" }).catch(() => {});
      }
    }, 700);
  }, [location]);

  handleOpenRef.current = handleOpen;

  // ─── Close ────────────────────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    clearTimeout(phaseTimerRef.current);
    setPhase("closing");
    stopListening();
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    phaseTimerRef.current = setTimeout(() => setPhase("closed"), 320);
  }, [stopListening]);

  // ─── Send ─────────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || isLoading || isGated) return;
    const newCount = userMsgCount + 1;
    if (newCount > messageLimit) {
      const gateMsg = tier === "anon" ? ANON_GATE_MSG : FREE_GATE_MSG;
      setMessages((prev) => [...prev, { role: "user", content: text }, { role: "gate", content: gateMsg }]);
      setInput("");
      setIsGated(true);
      return;
    }
    setUserMsgCount(newCount);
    const allMsgs: Message[] = [...messages, { role: "user", content: text }];
    setMessages(allMsgs);
    setInput("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/concierge/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ messages: allMsgs.filter((m) => m.role !== "gate").map((m) => ({ role: m.role, content: m.content })), pageContext: location, sessionId: getSessionId(), userEmail: email || undefined }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const reply = data.reply as string;
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      speakText(reply);
      fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ eventType: "concierge_chat", sourcePage: location, metadata: { sessionId: getSessionId(), userEmail: email || null, messageCount: newCount, userMessage: text.slice(0, 100), source: "floating_widget" } }) }).catch(() => {});
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "I'm sorry, I wasn't able to respond just now. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, isGated, messages, userMsgCount, messageLimit, tier, location, email, speakText]);

  sendMessageRef.current = sendMessage;

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }, [sendMessage]);

  const handleGateAction = useCallback(() => {
    if (tier === "anon") {
      setPendingSaveCallback(() => { setIsGated(false); setUserMsgCount(0); });
      setShowPassportGate(true);
    }
  }, [tier, setPendingSaveCallback, setShowPassportGate]);

  if (hidden || phase === "closed") return null;

  const isVisible = phase === "open";
  const isEntering = phase === "entering";
  const isClosing = phase === "closing";

  return (
    <>
      <style>{`
        @keyframes orbRise {
          from {
            transform: translate(calc(50vw - 14px), calc(100vh - 46px)) scale(1);
            opacity: 1;
            box-shadow: 0 0 16px rgba(201,168,76,0.6);
          }
          72% { opacity: 1; }
          to {
            transform: translate(calc(50vw - 14px), calc(20vh - 14px)) scale(5.2);
            opacity: 0;
            box-shadow: 0 0 120px rgba(201,168,76,0.65), 0 0 300px rgba(201,168,76,0.15);
          }
        }
        @keyframes chatFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes listeningDot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
      `}</style>

      {/* ── Dark backdrop ── appears instantly, fades out on close */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          background: "#0D0B09",
          zIndex: 10000,
          opacity: isClosing ? 0 : 1,
          transition: isClosing ? "opacity 0.32s ease-in" : "opacity 0.08s",
          pointerEvents: "none",
        }}
      />

      {/* ── Rising orb during entrance: grows from nav button to upper-center ── */}
      {isEntering && (
        <div
          aria-hidden
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "radial-gradient(circle at 32% 32%, #f2e4ad, #c9a84c 50%, #9c7c2a)",
            zIndex: 10002,
            pointerEvents: "none",
            animation: "orbRise 700ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
          }}
        />
      )}

      {/* ── Full-screen immersive layout ── */}
      {(isVisible || isClosing) && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10001,
            display: "flex",
            flexDirection: "column",
            opacity: isClosing ? 0 : 1,
            transition: isClosing ? "opacity 0.32s ease-in" : "none",
            animation: isVisible ? "chatFadeIn 0.4s ease-out" : "none",
          }}
        >
          {/* ══ TOP 40%: pure dark, large centered orb ══ */}
          <div
            style={{
              height: "40%",
              minHeight: 220,
              background: "#0D0B09",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              flexShrink: 0,
            }}
          >
            {/* Top-right controls */}
            <div style={{ position: "absolute", top: 16, right: 16, display: "flex", alignItems: "center", gap: 10 }}>
              {hasSpeechSynthesis && (
                <button
                  onClick={() => setVoiceEnabled((v) => !v)}
                  title={voiceEnabled ? "Mute" : "Enable voice"}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: voiceEnabled ? "#c9a84c" : "rgba(255,255,255,0.28)", display: "flex" }}
                >
                  {voiceEnabled ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                  )}
                </button>
              )}
              <button
                onClick={handleClose}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: "rgba(255,255,255,0.35)", fontSize: 18, lineHeight: 1, display: "flex" }}
              >
                ✕
              </button>
            </div>

            {/* ─── THE ORB — 140px, hero of the screen ─── */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ConciergeOrb state={orbState} circleSize={140} amplitude={voiceAmplitude} />
            </div>

            {/* Status text */}
            <p
              style={{
                fontFamily: "Lora, serif",
                fontSize: 11,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#c9a84c",
                margin: "16px 0 0",
                opacity: statusLabel ? 0.85 : 0,
                transition: "opacity 0.35s",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {isListening && (
                <span style={{ fontSize: 7, animation: "listeningDot 0.9s ease-in-out infinite", display: "inline-block" }}>●</span>
              )}
              {statusLabel}
            </p>
          </div>

          {/* ══ BOTTOM 60%: messages + input ══ */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              background: "rgba(13,11,9,0.98)",
              borderTop: "1px solid rgba(201,168,76,0.1)",
              overflow: "hidden",
            }}
          >
            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", WebkitOverflowScrolling: "touch" }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ marginBottom: 14, display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  <div
                    style={{
                      maxWidth: "85%",
                      padding: "11px 16px",
                      background: msg.role === "user" ? "rgba(201,168,76,0.14)" : msg.role === "gate" ? "rgba(201,168,76,0.07)" : "rgba(255,255,255,0.05)",
                      color: msg.role === "user" ? "#f0e6c8" : "#d4c9a8",
                      border: msg.role === "user" ? "1px solid rgba(201,168,76,0.22)" : msg.role === "gate" ? "1px solid rgba(201,168,76,0.18)" : "1px solid rgba(255,255,255,0.06)",
                      fontFamily: "Lora, serif",
                      fontSize: 14,
                      lineHeight: 1.75,
                      whiteSpace: "pre-wrap",
                      borderRadius: 2,
                    }}
                  >
                    {msg.content}
                    {msg.role === "gate" && tier === "anon" && (
                      <button onClick={handleGateAction} style={{ display: "block", marginTop: 12, background: "#c9a84c", color: "#0D0B09", border: "none", padding: "10px 24px", fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}>
                        Create Your Digital Passport
                      </button>
                    )}
                    {msg.role === "gate" && tier === "free" && (
                      <div style={{ marginTop: 10, padding: "9px 14px", background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.18)", fontFamily: "Inter, sans-serif", fontSize: 11, color: "#9a823e", lineHeight: 1.5 }}>
                        Gold Passport — $29/mo · Unlimited concierge · Personalized
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div style={{ display: "flex", marginBottom: 14 }}>
                  <div style={{ padding: "11px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "Lora, serif", fontSize: 13, color: "rgba(201,168,76,0.45)", fontStyle: "italic", borderRadius: 2 }}>
                    ...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div
              style={{
                borderTop: "1px solid rgba(201,168,76,0.09)",
                padding: "10px 16px",
                paddingBottom: "calc(10px + env(safe-area-inset-bottom))",
                background: "#0D0B09",
                flexShrink: 0,
              }}
            >
              {isListening && (
                <div style={{ marginBottom: 8, fontFamily: "Inter, sans-serif", fontSize: 10, color: "rgba(201,168,76,0.7)", letterSpacing: "0.07em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 6, animation: "listeningDot 0.9s ease-in-out infinite" }}>●</span>
                  Listening — speak now
                </div>
              )}
              <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                {hasSpeechRecognition && (
                  <button
                    onClick={startListening}
                    title={isListening ? "Stop" : "Speak"}
                    style={{ background: isListening ? "#c9a84c" : "rgba(255,255,255,0.06)", border: isListening ? "none" : "1px solid rgba(201,168,76,0.18)", borderRadius: 2, cursor: "pointer", padding: "10px 12px", color: isListening ? "#0D0B09" : "rgba(201,168,76,0.55)", display: "flex", alignItems: "center", flexShrink: 0, transition: "all 0.2s" }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="9" y="2" width="6" height="11" rx="3" />
                      <path d="M5 10a7 7 0 0014 0" />
                      <line x1="12" y1="22" x2="12" y2="17" />
                      <line x1="9" y1="22" x2="15" y2="22" />
                    </svg>
                  </button>
                )}
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isGated ? "Create your passport to continue..." : isListening ? "Listening..." : "Ask your concierge..."}
                  disabled={isGated || isListening}
                  rows={1}
                  style={{ flex: 1, border: "1px solid rgba(201,168,76,0.14)", background: isGated || isListening ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.06)", padding: "10px 14px", fontFamily: "Lora, serif", fontSize: 14, color: "#d4c9a8", resize: "none", outline: "none", lineHeight: 1.5, borderRadius: 0 }}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={isLoading || !input.trim() || isGated || isListening}
                  style={{ background: isLoading || !input.trim() || isGated || isListening ? "rgba(255,255,255,0.07)" : "#c9a84c", color: isLoading || !input.trim() || isGated || isListening ? "rgba(255,255,255,0.2)" : "#0D0B09", border: "none", padding: "10px 16px", fontFamily: "Lora, serif", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", cursor: isLoading || !input.trim() || isGated || isListening ? "default" : "pointer", whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.2s" }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
