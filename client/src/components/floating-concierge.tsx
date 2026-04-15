import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { useUser } from "@/contexts/user-context";
import { getSessionId } from "@/lib/session";
import { ConciergeOrb, type OrbState } from "./concierge-orb";

interface Message {
  role: "user" | "assistant" | "gate";
  content: string;
}

// --- FIRST-TIME GREETINGS (isFirstChat = true) ---
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

// --- RETURNING GREETINGS (isFirstChat = false) ---
const RETURNING_GREETINGS: Record<string, string> = {
  "/": "Welcome back. Where to?",
  "/guides/morocco": "Back in Morocco. Anything catching your eye?",
  "/destinations": "Back in Morocco. Anything catching your eye?",
  "/shop": "Browsing the collection. Want me to pull something specific, or want picks based on what you've saved?",
  "/suitcase": "Your suitcase is filling up. I can work with this — want me to turn what's here into a trip? Or a wardrobe edit you can actually buy?",
  "/profile": "Hey. Anything you need to update, or are you here to explore?",
};

const RETURNING_DEFAULT = "Welcome back. Where to?";

// --- SPECIAL: 3+ saves curate prompt ---
const CURATE_PROMPT_GREETING = "I'm starting to see what moves you. Want me to build your trip around it?";

function getGreeting(path: string, isFirstChat: boolean, saveCount: number, curatePromptShown: boolean): string {
  if (saveCount >= 3 && !curatePromptShown) {
    return CURATE_PROMPT_GREETING;
  }

  if (isFirstChat) {
    if (path.startsWith("/suitcase") && saveCount > 0) {
      return FIRST_TIME_SUITCASE_HAS_SAVES;
    }
    for (const [prefix, greeting] of Object.entries(FIRST_TIME_GREETINGS)) {
      if (prefix === "/" ? path === "/" : path.startsWith(prefix)) return greeting;
    }
    return FIRST_TIME_DEFAULT;
  } else {
    for (const [prefix, greeting] of Object.entries(RETURNING_GREETINGS)) {
      if (prefix === "/" ? path === "/" : path.startsWith(prefix)) return greeting;
    }
    return RETURNING_DEFAULT;
  }
}

// Message limits by tier
const ANON_LIMIT = 3;
const FREE_LIMIT = 15;

const ANON_GATE_MSG = "I'd love to keep going — I can tell you have good taste. Create your Digital Passport and I'm all yours. It takes 10 seconds.";
const FREE_GATE_MSG = "I've enjoyed this. If you want me to really learn what moves you — what you save, what catches your eye, what you'd never wear — that's your Gold Passport. I get a lot better when I know you.";

// ─── Speech API feature detection ────────────────────────────────────────────
const hasSpeechRecognition =
  typeof window !== "undefined" &&
  ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

const hasSpeechSynthesis =
  typeof window !== "undefined" && "speechSynthesis" in window;

function getSpeechRecognitionClass(): any {
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
}

// Pick the best available TTS voice for a warm, natural read
function pickVoice(): SpeechSynthesisVoice | null {
  if (!hasSpeechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  // Prefer natural/neural US English voices
  const preferred = [
    "Samantha", "Karen", "Moira", "Tessa", "Victoria", "Natural",
    "Google US English", "Microsoft Aria",
  ];
  for (const name of preferred) {
    const v = voices.find((v) => v.name.includes(name) && v.lang.startsWith("en"));
    if (v) return v;
  }
  return voices.find((v) => v.lang === "en-US") || voices[0] || null;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function FloatingConcierge() {
  const [location] = useLocation();
  const { user, email, setShowPassportGate, setPendingSaveCallback } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGated, setIsGated] = useState(false);

  // Orb animation state
  const [orbState, setOrbState] = useState<OrbState>("idle");

  // Entrance animation (gold circle expands from button position)
  const [showEntrance, setShowEntrance] = useState(false);

  // Voice input
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const autoSendTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Voice output
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Persist conversation across page navigations via sessionStorage
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const stored = sessionStorage.getItem("fdv_concierge_messages");
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  const [userMsgCount, setUserMsgCount] = useState(() => {
    try {
      return parseInt(sessionStorage.getItem("fdv_concierge_msg_count") || "0");
    } catch { return 0; }
  });
  const hasGreeted = useRef(messages.length > 0);

  useEffect(() => {
    try { sessionStorage.setItem("fdv_concierge_messages", JSON.stringify(messages)); } catch {}
  }, [messages]);
  useEffect(() => {
    try { sessionStorage.setItem("fdv_concierge_msg_count", String(userMsgCount)); } catch {}
  }, [userMsgCount]);

  const isAuthenticated = !!user;
  const hasEmail = !!email;
  const tier = isAuthenticated ? "free" : hasEmail ? "free" : "anon";
  const messageLimit = tier === "anon" ? ANON_LIMIT : FREE_LIMIT;
  const hidden = location === "/concierge-chat";

  // Orb state driven by loading / listening / speaking
  useEffect(() => {
    if (isListening) {
      setOrbState("listening");
    } else if (isLoading) {
      setOrbState("thinking");
    } else if (isSpeaking) {
      setOrbState("responding");
    } else {
      setOrbState("idle");
    }
  }, [isListening, isLoading, isSpeaking]);

  // Stable ref so the event listener always calls the latest handleOpen
  const handleOpenRef = useRef<() => void>(() => {});

  useEffect(() => {
    const handler = () => handleOpenRef.current();
    window.addEventListener("open-concierge", handler);
    return () => window.removeEventListener("open-concierge", handler);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isGated && isAuthenticated) setIsGated(false);
  }, [isAuthenticated, isGated]);

  // ─── Voice Input ──────────────────────────────────────────────────────────
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    clearTimeout(autoSendTimerRef.current);
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    if (!hasSpeechRecognition) return;
    if (isListening) { stopListening(); return; }

    const SR = getSpeechRecognitionClass();
    const rec = new SR();
    recognitionRef.current = rec;
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-US";

    let capturedTranscript = "";

    rec.onresult = (e: any) => {
      const transcript = Array.from(e.results as any[])
        .map((r: any) => r[0].transcript)
        .join("");
      setInput(transcript);
      capturedTranscript = transcript;

      // Auto-send 1.8s after final result
      clearTimeout(autoSendTimerRef.current);
      if ((e.results[e.results.length - 1] as any).isFinal) {
        autoSendTimerRef.current = setTimeout(() => {
          stopListening();
          if (capturedTranscript.trim()) {
            sendMessageRef.current(capturedTranscript);
          }
        }, 1800);
      }
    };

    rec.onerror = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    rec.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    rec.start();
    setIsListening(true);
  }, [isListening, stopListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
      window.speechSynthesis?.cancel();
    };
  }, [stopListening]);

  // ─── Voice Output ─────────────────────────────────────────────────────────
  const speakText = useCallback((text: string) => {
    if (!voiceEnabled || !hasSpeechSynthesis) return;
    window.speechSynthesis.cancel();
    // Strip markdown-style formatting for speech
    const clean = text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/[_*`]/g, "").trim();
    const utterance = new SpeechSynthesisUtterance(clean);
    const voice = pickVoice();
    if (voice) utterance.voice = voice;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    currentUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled]);

  // Stop speaking when voice is toggled off
  useEffect(() => {
    if (!voiceEnabled) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    }
  }, [voiceEnabled]);

  // ─── Open / greeting ─────────────────────────────────────────────────────
  const handleOpen = useCallback(async () => {
    // Entrance animation
    setShowEntrance(true);
    setTimeout(() => setShowEntrance(false), 650);

    setIsOpen(true);

    if (!hasGreeted.current) {
      hasGreeted.current = true;

      let isFirstChat = true;
      let saveCount = 0;
      let curatePromptShown = false;

      try {
        const res = await fetch("/api/concierge/greeting-context", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          isFirstChat = data.isFirstChat ?? true;
          saveCount = data.saveCount ?? 0;
          curatePromptShown = data.curatePromptShown ?? false;
        }
      } catch {}

      const greeting = getGreeting(location, isFirstChat, saveCount, curatePromptShown);
      setMessages([{ role: "assistant", content: greeting }]);

      if (saveCount >= 3 && !curatePromptShown) {
        fetch("/api/concierge/mark-curate-shown", { method: "POST", credentials: "include" }).catch(() => {});
      }
    }
  }, [location]);

  handleOpenRef.current = handleOpen;

  // ─── Send message ─────────────────────────────────────────────────────────
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
    const allMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(allMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/concierge/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          messages: allMessages.filter((m) => m.role !== "gate").map((m) => ({ role: m.role, content: m.content })),
          pageContext: location,
          sessionId: getSessionId(),
          userEmail: email || undefined,
        }),
      });

      if (!res.ok) throw new Error("Chat request failed");
      const data = await res.json();
      const reply = data.reply as string;

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      speakText(reply);

      fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "concierge_chat",
          sourcePage: location,
          metadata: { sessionId: getSessionId(), userEmail: email || null, messageCount: newCount, userMessage: text.slice(0, 100), source: "floating_widget" },
        }),
      }).catch(() => {});
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "I'm sorry, I wasn't able to respond just now. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, isGated, messages, userMsgCount, messageLimit, tier, location, email, speakText]);

  // Auto-send after voice input finalizes
  const sendMessageRef = useRef(sendMessage);
  sendMessageRef.current = sendMessage;

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  const handleGateAction = useCallback(() => {
    if (tier === "anon") {
      setPendingSaveCallback(() => { setIsGated(false); setUserMsgCount(0); });
      setShowPassportGate(true);
    }
  }, [tier, setPendingSaveCallback, setShowPassportGate]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    stopListening();
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, [stopListening]);

  if (hidden) return null;

  return (
    <>
      {/* ── Entrance: gold circle expands from button position ── */}
      {showEntrance && (
        <div
          aria-hidden
          style={{
            position: "fixed",
            bottom: 46,
            left: "50%",
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#c9a84c",
            zIndex: 10002,
            pointerEvents: "none",
            transformOrigin: "center center",
            animation: "conciergeEntrance 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
          }}
        />
      )}

      {/* ── Slide-up chat panel ── */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            height: "75vh",
            zIndex: 10000,
            background: "#faf9f6",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            boxShadow: "0 -4px 24px rgba(0,0,0,0.12)",
            display: "flex",
            flexDirection: "column",
            animation: "slideUpPanel 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {/* ── Header ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 16px 10px",
              borderBottom: "1px solid #e8e0d4",
              flexShrink: 0,
            }}
          >
            {/* Living orb */}
            <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
              <ConciergeOrb state={orbState} circleSize={32} />
            </div>

            {/* Label */}
            <p
              style={{
                fontFamily: "Lora, serif",
                fontSize: 11,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#c9a84c",
                margin: 0,
                flex: 1,
              }}
            >
              Your Concierge
            </p>

            {/* Voice output toggle */}
            {hasSpeechSynthesis && (
              <button
                onClick={() => setVoiceEnabled((v) => !v)}
                title={voiceEnabled ? "Mute voice" : "Enable voice"}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 6,
                  color: voiceEnabled ? "#c9a84c" : "#bbb",
                  display: "flex",
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                {voiceEnabled ? (
                  /* Speaker on */
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" />
                  </svg>
                ) : (
                  /* Speaker off */
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                )}
              </button>
            )}

            {/* Close */}
            <button
              onClick={handleClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 6,
                color: "#bbb",
                fontSize: 18,
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>

          {/* ── Messages ── */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 20px",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 16,
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "12px 16px",
                    background: msg.role === "user" ? "#1a1a1a" : msg.role === "gate" ? "#fff8e7" : "#fff",
                    color: msg.role === "user" ? "#fff" : "#2c2416",
                    border: msg.role === "user" ? "none" : msg.role === "gate" ? "1px solid #e8d9a8" : "1px solid #e8e0d4",
                    fontFamily: "Lora, serif",
                    fontSize: 14,
                    lineHeight: 1.7,
                    whiteSpace: "pre-wrap",
                    borderRadius: 2,
                  }}
                >
                  {msg.content}
                  {msg.role === "gate" && tier === "anon" && (
                    <button
                      onClick={handleGateAction}
                      style={{
                        display: "block",
                        marginTop: 12,
                        background: "#c9a84c",
                        color: "#1a1a1a",
                        border: "none",
                        padding: "10px 24px",
                        fontFamily: "Inter, sans-serif",
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                      }}
                    >
                      Create Your Digital Passport
                    </button>
                  )}
                  {msg.role === "gate" && tier === "free" && (
                    <div
                      style={{
                        marginTop: 12,
                        padding: "10px 16px",
                        background: "rgba(201, 168, 76, 0.08)",
                        border: "1px solid rgba(201, 168, 76, 0.2)",
                        fontFamily: "Inter, sans-serif",
                        fontSize: 11,
                        color: "#8a7340",
                        lineHeight: 1.5,
                      }}
                    >
                      Gold Passport — $29/mo · Unlimited concierge · Personalized
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 16 }}>
                <div
                  style={{
                    padding: "12px 16px",
                    background: "#fff",
                    border: "1px solid #e8e0d4",
                    fontFamily: "Lora, serif",
                    fontSize: 14,
                    color: "#999",
                    fontStyle: "italic",
                  }}
                >
                  Thinking...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Input ── */}
          <div
            style={{
              borderTop: "1px solid #e8e0d4",
              padding: "12px 16px",
              paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
              background: "#faf9f6",
              flexShrink: 0,
            }}
          >
            {/* Listening indicator */}
            {isListening && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                  fontFamily: "Inter, sans-serif",
                  fontSize: 11,
                  color: "#c9a84c",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                <span style={{ animation: "listeningDot 1.2s ease-in-out infinite" }}>●</span>
                Listening — speak now, I'll send automatically
              </div>
            )}

            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              {/* Mic button (voice input) */}
              {hasSpeechRecognition && (
                <button
                  onClick={startListening}
                  title={isListening ? "Stop listening" : "Speak to your concierge"}
                  style={{
                    background: isListening ? "#c9a84c" : "none",
                    border: isListening ? "none" : "1px solid #e8e0d4",
                    borderRadius: 2,
                    cursor: "pointer",
                    padding: "10px 12px",
                    color: isListening ? "#fff" : "#aaa",
                    display: "flex",
                    alignItems: "center",
                    flexShrink: 0,
                    transition: "all 0.2s",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
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
                  isGated
                    ? "Create your passport to continue..."
                    : isListening
                    ? "Listening..."
                    : "Ask your concierge..."
                }
                disabled={isGated || isListening}
                rows={1}
                style={{
                  flex: 1,
                  border: "1px solid #e8e0d4",
                  background: isGated || isListening ? "#f5f5f0" : "#fff",
                  padding: "10px 14px",
                  fontFamily: "Lora, serif",
                  fontSize: 14,
                  color: "#2c2416",
                  resize: "none",
                  outline: "none",
                  lineHeight: 1.5,
                  borderRadius: 0,
                }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !input.trim() || isGated || isListening}
                style={{
                  background: isLoading || !input.trim() || isGated || isListening ? "#ccc" : "#1a1a1a",
                  color: "#fff",
                  border: "none",
                  padding: "10px 16px",
                  fontFamily: "Lora, serif",
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor: isLoading || !input.trim() || isGated || isListening ? "default" : "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Backdrop ── */}
      {isOpen && (
        <div
          onClick={handleClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.3)",
          }}
        />
      )}

      <style>{`
        @keyframes slideUpPanel {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes conciergeEntrance {
          0% {
            transform: translateX(-50%) scale(1);
            opacity: 0.9;
          }
          55% {
            opacity: 0.18;
          }
          100% {
            transform: translateX(-50%) scale(55);
            opacity: 0;
          }
        }
        @keyframes listeningDot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </>
  );
}
