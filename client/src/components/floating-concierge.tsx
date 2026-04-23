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
const ANON_WELCOME = "Welcome. I'm your concierge — I can help you plan a trip, pack for it, find the perfect restaurant, or just point you somewhere beautiful. Everything here is shoppable, saveable, and yours. Ask me anything, or just start exploring.";

const FIRST_TIME_GREETINGS: Record<string, string> = {
  "/guides/morocco": "You're in the right place. This is the full Morocco guide — every restaurant, hotel, and experience I'd send a friend to, plus the wardrobe to match. Everything's shoppable directly. And if you want the whole thing personalized — your itinerary, your packing list, your reservations — that's what I'm really here for. Where do you want to start?",
  "/destinations": "You're in the right place. This is the full Morocco guide — every restaurant, hotel, and experience I'd send a friend to, plus the wardrobe to match. Everything's shoppable directly. And if you want the whole thing personalized — your itinerary, your packing list, your reservations — that's what I'm really here for. Where do you want to start?",
  "/shop": "This is the full collection — wardrobe, accessories, beauty. Fewer things, better things. If you tell me what you're dressing for — a dinner in Marrakech, a week on an island, a Tuesday that needs saving — I can pull a wardrobe edit just for you.",
  "/suitcase": "You haven't packed anything yet. Browse the guides, heart what stops you — it all lands here. Once I see what you're drawn to, the real work starts: I can build your trip, your wardrobe, the whole picture.",
  "/profile": "This is your home base. The more you explore and save, the better I get at reading what you actually want — not what an algorithm guesses.",
};
const FIRST_TIME_SUITCASE_HAS_SAVES = "Your suitcase is filling up. I can work with this — want me to turn what's here into a trip? Or a wardrobe edit you can actually buy?";

const RETURNING_GREETINGS: Record<string, string> = {
  "/guides/morocco": "Back in Morocco. Anything catching your eye?",
  "/destinations": "Back in Morocco. Anything catching your eye?",
  "/shop": "Browsing the collection. Want me to pull something specific, or want picks based on what you've saved?",
  "/suitcase": "Your suitcase is filling up. I can work with this — want me to turn what's here into a trip? Or a wardrobe edit you can actually buy?",
  "/profile": "Hey. Anything you need to update, or are you here to explore?",
};
const CURATE_PROMPT_GREETING = "I'm starting to see what moves you. Want me to build your trip around it?";

function getGreeting(path: string, isFirstChat: boolean, saveCount: number, curatePromptShown: boolean, isLoggedIn: boolean, name: string | null): string {
  // Logged-in users get a personal greeting (curate prompt still takes priority)
  if (isLoggedIn) {
    if (saveCount >= 3 && !curatePromptShown) return CURATE_PROMPT_GREETING;
    const firstName = name ? name.split(" ")[0] : null;
    return firstName ? `Hi ${firstName}. How can I help you today?` : "Welcome back. How can I help you today?";
  }
  // Non-logged-in users always see the full welcome
  return ANON_WELCOME;
}

const ANON_LIMIT = 3;
const FREE_LIMIT = 15;
const ANON_GATE_MSG = "I'd love to keep chatting. Create your Digital Passport so I can get to know you — your saves, your trips, all of it. Ten seconds.";
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

// Split assistant text into sentences for staggered reveal animation
function splitToSentences(text: string): string[] {
  return text
    .replace(/([.!?…])\s+/g, '$1\x01')
    .split(/\x01|\n/)
    .map(s => s.trim())
    .filter(Boolean);
}

// ─── Component ────────────────────────────────────────────────────────────────
export function FloatingConcierge() {
  const [location] = useLocation();
  const { user, email, setShowPassportGate, setPendingSaveCallback, signup, login } = useUser();

  const [phase, setPhase] = useState<Phase>("closed");
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGated, setIsGated] = useState(false);

  // Inline signup flow
  const [signupStage, setSignupStage] = useState<'idle' | 'collecting_email' | 'collecting_password' | 'logging_in'>('idle');
  const [pendingSignupEmail, setPendingSignupEmail] = useState('');

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
  // Tracks how many messages existed when the chat last closed — messages before this index don't animate on reopen
  const animateFromIndexRef = useRef(messages.length);
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


  // Global open event — accepts optional { message } in CustomEvent.detail
  const handleOpenRef = useRef<(customMessage?: string) => void>(() => {});
  useEffect(() => {
    const h = (e: Event) => handleOpenRef.current((e as CustomEvent).detail?.message);
    window.addEventListener("open-concierge", h);
    return () => window.removeEventListener("open-concierge", h);
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => { if (phase === "open" && inputRef.current) setTimeout(() => inputRef.current?.focus(), 500); }, [phase]);
  useEffect(() => { if (isAuthenticated) { setIsGated(false); setSignupStage('idle'); } }, [isAuthenticated]);

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
  const handleOpen = useCallback(async (customMessage?: string) => {
    clearTimeout(phaseTimerRef.current);
    setPhase("entering");

    phaseTimerRef.current = setTimeout(async () => {
      setPhase("open");
      // Brief gold flood effect as orb appears at full size
      setOrbFlood(true);
      setTimeout(() => setOrbFlood(false), 130);

      if (customMessage) {
        // Post-purchase or contextual trigger: inject the message and reset the greeting flag
        // so it doesn't fire the standard greeting on top of it
        hasGreeted.current = true;
        animateFromIndexRef.current = 0;
        setMessages([{ role: "assistant", content: customMessage }]);
      } else {
        // Check for a queued trip-ready message (fired 30s after purchase)
        let tripReadyMsg: string | null = null;
        try { tripReadyMsg = sessionStorage.getItem("fdv_trip_ready_message"); } catch {}
        if (tripReadyMsg) {
          try { sessionStorage.removeItem("fdv_trip_ready_message"); } catch {}
          hasGreeted.current = true;
          animateFromIndexRef.current = 0;
          setMessages([{ role: "assistant", content: tripReadyMsg }]);
        }
      }
      if (!customMessage && !hasGreeted.current) {
        hasGreeted.current = true;
        let isFirstChat = true, saveCount = 0, curatePromptShown = false;
        try {
          const res = await fetch("/api/concierge/greeting-context", { credentials: "include" });
          if (res.ok) { const d = await res.json(); isFirstChat = d.isFirstChat ?? true; saveCount = d.saveCount ?? 0; curatePromptShown = d.curatePromptShown ?? false; }
        } catch {}
        const greeting = getGreeting(location, isFirstChat, saveCount, curatePromptShown, !!user, user?.name ?? null);
        setMessages([{ role: "assistant", content: greeting }]);
        if (saveCount >= 3 && !curatePromptShown) fetch("/api/concierge/mark-curate-shown", { method: "POST", credentials: "include" }).catch(() => {});
      }
    }, 700);
  }, [location, user]);

  handleOpenRef.current = handleOpen;

  // ─── Close ────────────────────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    clearTimeout(phaseTimerRef.current);
    // Snapshot current message count so they won't reanimate on next open
    animateFromIndexRef.current = messages.length;
    setPhase("closing");
    stopListening();
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    phaseTimerRef.current = setTimeout(() => setPhase("closed"), 320);
  }, [stopListening, messages.length]);

  // ─── Send ─────────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || isLoading) return;

    // ── Inline signup: collecting email ──
    if (signupStage === 'collecting_email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setMessages((prev) => [...prev, { role: 'user', content: text }]);
      setInput('');
      if (!emailRegex.test(text)) {
        setMessages((prev) => [...prev, { role: 'assistant', content: "That doesn't look like an email address — just drop it here and we're good to go." }]);
        return;
      }
      setPendingSignupEmail(text);
      setSignupStage('collecting_password');
      setMessages((prev) => [...prev, { role: 'assistant', content: "Pick a password — at least 6 characters. I'll keep it safe." }]);
      return;
    }

    // ── Inline signup: collecting password ──
    if (signupStage === 'collecting_password') {
      const masked = '•'.repeat(Math.min(text.length, 10));
      if (text.length < 6) {
        setMessages((prev) => [...prev, { role: 'user', content: masked }, { role: 'assistant', content: "Just a bit longer — needs to be at least 6 characters." }]);
        setInput('');
        return;
      }
      setMessages((prev) => [...prev, { role: 'user', content: masked }]);
      setInput('');
      setIsLoading(true);
      const result = await signup('', pendingSignupEmail, text);
      setIsLoading(false);
      if (result.success) {
        setSignupStage('idle');
        setIsGated(false);
        setUserMsgCount(0);
        setMessages((prev) => [...prev, { role: 'assistant', content: "You're in. Everything from here — saves, trips, recommendations — it's all yours now." }]);
      } else if (result.error?.toLowerCase().includes('already exists') || result.error?.toLowerCase().includes('already')) {
        setSignupStage('logging_in');
        setMessages((prev) => [...prev, { role: 'assistant', content: "That email already has a Passport. Drop your password and I'll log you in." }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: "Something went wrong — try that again, or tap the button below to sign up the usual way." }]);
      }
      return;
    }

    // ── Inline signup: logging in existing user ──
    if (signupStage === 'logging_in') {
      const masked = '•'.repeat(Math.min(text.length, 10));
      setMessages((prev) => [...prev, { role: 'user', content: masked }]);
      setInput('');
      setIsLoading(true);
      const result = await login(pendingSignupEmail, text);
      setIsLoading(false);
      if (result.success) {
        setSignupStage('idle');
        setIsGated(false);
        setUserMsgCount(0);
        setMessages((prev) => [...prev, { role: 'assistant', content: "Welcome back. Where were we?" }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: "Hmm, that password didn't match. Try again, or tap the button below to start fresh." }]);
      }
      return;
    }

    // ── Free-tier gate (no inline signup) ──
    if (isGated) return;

    const newCount = userMsgCount + 1;
    if (newCount > messageLimit) {
      if (tier === "anon") {
        // Start inline signup flow
        setMessages((prev) => [
          ...prev,
          { role: "user", content: text },
          { role: "gate", content: ANON_GATE_MSG },
          { role: "assistant", content: "What's your email? I'll create your Digital Passport right here so nothing we talk about gets lost." },
        ]);
        setInput('');
        setSignupStage('collecting_email');
        return;
      } else {
        setMessages((prev) => [...prev, { role: "user", content: text }, { role: "gate", content: FREE_GATE_MSG }]);
        setInput("");
        setIsGated(true);
        return;
      }
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
  }, [input, isLoading, isGated, signupStage, pendingSignupEmail, signup, login, messages, userMsgCount, messageLimit, tier, location, email, speakText]);

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
            transform: translate(calc(50vw - 22px), calc(100vh - 52px)) scale(1);
            opacity: 1;
          }
          72% { opacity: 1; }
          to {
            transform: translate(calc(50vw - 22px), calc(20vh - 22px)) scale(3.86);
            opacity: 0;
          }
        }
        @keyframes chatFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes msgLineFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
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
          background: "#faf9f6",
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
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "radial-gradient(circle at 38% 36%, rgba(255,252,232,0.96), rgba(245,228,155,0.88) 30%, rgba(210,168,72,0.55) 65%, transparent)",
            filter: "blur(3px)",
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
          {/* ── Orb floating at top — no background, transparent, pointer-events none ── */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 260,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              zIndex: 15,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ConciergeOrb state={orbState} circleSize={170} amplitude={voiceAmplitude} />
            </div>
          </div>

          {/* ── Gradient: top area fades to transparent so messages dissolve into orb ── */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 300,
              background: "linear-gradient(to bottom, #faf9f6 0%, #faf9f6 38%, rgba(250,249,246,0.75) 62%, transparent 100%)",
              pointerEvents: "none",
              zIndex: 10,
            }}
          />

          {/* ── Controls — absolute top-right, z-index above gradient ── */}
          <div style={{ position: "absolute", top: 20, right: 12, display: "flex", alignItems: "center", gap: 0, zIndex: 20 }}>
            {hasSpeechSynthesis && (
              <button
                onClick={() => setVoiceEnabled((v) => !v)}
                title={voiceEnabled ? "Mute" : "Enable voice"}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  width: 44,
                  height: 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: voiceEnabled ? "#2c2416" : "rgba(44,36,22,0.25)",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                {voiceEnabled ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                )}
              </button>
            )}
            {/* Close X — 78×78 tap target, 34px icon, high-contrast */}
            <button
              onClick={handleClose}
              aria-label="Close"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                width: 78,
                height: 78,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(44,36,22,0.65)",
                WebkitTapHighlightColor: "transparent",
                flexShrink: 0,
              }}
            >
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* ── Messages + input fill full height — text scrolls behind floating orb ── */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Scrollable messages — top padding reserves space for the floating orb */}
            <div style={{ flex: 1, overflowY: "auto", padding: "280px 28px 28px", WebkitOverflowScrolling: "touch" }}>
              {/* Label scrolls away naturally as conversation grows */}
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontStyle: "italic", letterSpacing: "0.02em", color: "#2c2416", opacity: 0.55 }}>
                  How can I help you?
                </span>
              </div>
              {messages.map((msg, i) => {
                const isNew = i >= animateFromIndexRef.current;
                const msgBaseStyle: React.CSSProperties = {
                  fontFamily: "'Instrument Sans', Inter, sans-serif",
                  fontSize: 18,
                  lineHeight: 1.65,
                  letterSpacing: "0.01em",
                };

                if (msg.role === "user") {
                  return (
                    <div key={i} style={{ marginBottom: 24, display: "flex", justifyContent: "flex-end" }}>
                      <div style={{
                        maxWidth: "88%",
                        ...msgBaseStyle,
                        color: "#2c2416",
                        whiteSpace: "pre-wrap",
                        ...(isNew ? { opacity: 0, animation: "msgLineFadeIn 320ms ease-out forwards" } : {}),
                      }}>
                        {msg.content}
                      </div>
                    </div>
                  );
                }

                if (msg.role === "assistant") {
                  const sentences = splitToSentences(msg.content);
                  return (
                    <div key={i} style={{ marginBottom: 24, display: "flex", justifyContent: "flex-start" }}>
                      <div style={{ maxWidth: "88%", ...msgBaseStyle, color: "#2c2416" }}>
                        {isNew ? sentences.map((sentence, si) => (
                          <span
                            key={si}
                            style={{
                              display: "block",
                              opacity: 0,
                              animation: "msgLineFadeIn 460ms ease-out forwards",
                              animationDelay: `${si * 260}ms`,
                              ...(si > 0 ? { marginTop: "0.45em" } : {}),
                            }}
                          >
                            {sentence}
                          </span>
                        )) : (
                          <span style={{ display: "block", whiteSpace: "pre-wrap" }}>{msg.content}</span>
                        )}
                      </div>
                    </div>
                  );
                }

                // Gate message
                return (
                  <div key={i} style={{ marginBottom: 24, display: "flex", justifyContent: "flex-start" }}>
                    <div style={{
                      maxWidth: "88%",
                      ...msgBaseStyle,
                      fontStyle: "italic",
                      color: "rgba(44,36,22,0.6)",
                      whiteSpace: "pre-wrap",
                      ...(isNew ? { opacity: 0, animation: "msgLineFadeIn 460ms ease-out forwards" } : {}),
                    }}>
                      {msg.content}
                      {msg.role === "gate" && tier === "anon" && signupStage === 'idle' && (
                        <button onClick={handleGateAction} style={{ display: "block", marginTop: 14, background: "rgba(201,168,76,0.10)", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.32)", padding: "11px 28px", fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", borderRadius: 9999, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 0 16px rgba(201,168,76,0.06)" }}>
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
                );
              })}

              {isLoading && (
                <div style={{ display: "flex", marginBottom: 24 }}>
                  <div style={{ fontFamily: "'Instrument Sans', Inter, sans-serif", fontSize: 18, color: "rgba(201,168,76,0.40)", letterSpacing: "0.12em" }}>
                    · · ·
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div
              style={{
                padding: "10px 16px",
                paddingBottom: "calc(10px + env(safe-area-inset-bottom))",
                background: "transparent",
                flexShrink: 0,
              }}
            >
              {isListening && (
                <div style={{ marginBottom: 8, fontFamily: "Inter, sans-serif", fontSize: 10, color: "rgba(201,168,76,0.7)", letterSpacing: "0.07em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6, paddingLeft: 4 }}>
                  <span style={{ fontSize: 6, animation: "listeningDot 0.9s ease-in-out infinite" }}>●</span>
                  Listening — speak now
                </div>
              )}
              {/* Glassy pill container */}
              <div style={{
                display: "flex",
                alignItems: "center",
                borderRadius: 9999,
                background: "rgba(255,255,255,0.88)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(44,36,22,0.10)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 2px 12px rgba(0,0,0,0.06)",
                padding: "2px 4px 2px 4px",
                minHeight: 52,
                gap: 0,
              }}>
                {/* Microphone — inside pill, left */}
                {hasSpeechRecognition && (
                  <button
                    onClick={startListening}
                    title={isListening ? "Stop" : "Speak"}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      width: 62,
                      height: 62,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: isListening ? "#2c2416" : "rgba(44,36,22,0.28)",
                      flexShrink: 0,
                      transition: "color 0.2s",
                      WebkitTapHighlightColor: "transparent",
                    }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
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
                  placeholder={
                    isGated && signupStage === 'idle' ? "Create your passport to continue..." :
                    signupStage === 'collecting_email' ? "Your email address..." :
                    signupStage === 'collecting_password' || signupStage === 'logging_in' ? "Password..." :
                    isListening ? "Listening..." :
                    "Ask your concierge..."
                  }
                  disabled={isListening || (isGated && signupStage === 'idle')}
                  rows={1}
                  style={{
                    flex: 1,
                    border: "none",
                    background: "transparent",
                    padding: "10px 10px",
                    fontFamily: "'Instrument Sans', Inter, sans-serif",
                    fontSize: 17,
                    color: "#2c2416",
                    resize: "none",
                    outline: "none",
                    lineHeight: 1.5,
                    borderRadius: 0,
                    ...(signupStage === 'collecting_password' || signupStage === 'logging_in'
                      ? { WebkitTextSecurity: 'disc' } as React.CSSProperties
                      : {}),
                  }}
                />
                {/* Send arrow — inside pill, right */}
                <button
                  onClick={() => { if (isListening) stopListening(); sendMessage(); }}
                  disabled={isLoading || !input.trim() || (isGated && signupStage === 'idle')}
                  style={{
                    background: "none",
                    color: isLoading || !input.trim() || (isGated && signupStage === 'idle') ? "rgba(201,168,76,0.22)" : "#c9a84c",
                    border: "none",
                    padding: 0,
                    width: 62,
                    height: 62,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: isLoading || !input.trim() || (isGated && signupStage === 'idle') ? "default" : "pointer",
                    flexShrink: 0,
                    transition: "color 0.2s",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
