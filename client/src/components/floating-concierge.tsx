import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { useUser } from "@/contexts/user-context";
import { getSessionId } from "@/lib/session";

interface Message {
  role: "user" | "assistant" | "gate";
  content: string;
}

const PAGE_GREETINGS: Record<string, string> = {
  "/guides/morocco": "Exploring Morocco? I've been. Ask me anything.",
  "/capsule/": "Seeing something you like? I can help you put the look together.",
  "/suitcase": "Nice saves. Want me to find the thread?",
  "/shop": "Looking for something specific? I know this catalog well.",
  "/packing": "Packing for a trip? I've packed for this one — happy to help.",
  "/concierge": "Planning your days? Let me help fill in the details.",
  "/current": "Exploring The Current? Ask me about anything that catches your eye.",
  "/my-edits": "Your edits are looking good. Want me to build on what you've started?",
};

const DEFAULT_GREETING = "Welcome to FDV. I'm your concierge — think of me as a well-traveled friend with good taste.";
const RETURN_GREETING = "Welcome back.";

function getGreeting(path: string, isReturn: boolean): string {
  if (isReturn) return RETURN_GREETING;
  for (const [prefix, greeting] of Object.entries(PAGE_GREETINGS)) {
    if (path.startsWith(prefix)) return greeting;
  }
  return DEFAULT_GREETING;
}

// Message limits by tier
const ANON_LIMIT = 3;
const FREE_LIMIT = 15;

const ANON_GATE_MSG = "I'd love to keep going — I can tell you have good taste. Create your Digital Passport and I'm all yours. It takes 10 seconds.";
const FREE_GATE_MSG = "I've enjoyed this. If you want me to really learn your taste — what you save, what catches your eye, what you'd never wear — that's your Gold Passport. I get a lot better when I know you.";

export function FloatingConcierge() {
  const [location] = useLocation();
  const { user, email, setShowPassportGate, setPendingSaveCallback } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userMsgCount, setUserMsgCount] = useState(0);
  const [isGated, setIsGated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const hasGreeted = useRef(false);

  const isAuthenticated = !!user;
  const hasEmail = !!email;
  const tier = isAuthenticated ? "free" : hasEmail ? "free" : "anon";
  const messageLimit = tier === "anon" ? ANON_LIMIT : FREE_LIMIT;
  const hidden = location === "/concierge-chat";

  // Stable ref so the event listener always calls the latest handleOpen
  const handleOpenRef = useRef<() => void>(() => {});

  // Listen for open-concierge event from bottom nav / hamburger
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
      inputRef.current.focus();
    }
  }, [isOpen]);

  // When gate clears after auth, reset
  useEffect(() => {
    if (isGated && isAuthenticated) {
      setIsGated(false);
    }
  }, [isAuthenticated, isGated]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    if (!hasGreeted.current) {
      hasGreeted.current = true;
      const isReturn = sessionStorage.getItem("fdv_concierge_greeted") === "true";
      const greeting = getGreeting(location, isReturn);
      setMessages([{ role: "assistant", content: greeting }]);
      sessionStorage.setItem("fdv_concierge_greeted", "true");
    }
  }, [location]);

  // Keep ref in sync with latest handleOpen
  handleOpenRef.current = handleOpen;

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading || isGated) return;

    const newCount = userMsgCount + 1;

    // Check gate
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
        }),
      });

      if (!res.ok) throw new Error("Chat request failed");

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);

      // Track event
      fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "concierge_chat",
          sourcePage: location,
          metadata: {
            sessionId: getSessionId(),
            userEmail: email || null,
            messageCount: newCount,
            userMessage: text.slice(0, 100),
            source: "floating_widget",
          },
        }),
      }).catch(() => {});
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm sorry, I wasn't able to respond just now. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, isGated, messages, userMsgCount, messageLimit, tier, location, email]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  const handleGateAction = useCallback(() => {
    if (tier === "anon") {
      setPendingSaveCallback(() => {
        setIsGated(false);
        setUserMsgCount(0);
      });
      setShowPassportGate(true);
    }
  }, [tier, setPendingSaveCallback, setShowPassportGate]);

  // Don't render on dedicated chat page or landing
  if (hidden) return null;

  return (
    <>
      {/* Slide-up chat panel — triggered by bottom nav concierge button */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            height: "75vh",
            zIndex: 200,
            background: "#faf9f6",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            boxShadow: "0 -4px 24px rgba(0,0,0,0.12)",
            display: "flex",
            flexDirection: "column",
            animation: "slideUpPanel 0.3s ease-out",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 20px 12px",
              borderBottom: "1px solid #e8e0d4",
              flexShrink: 0,
            }}
          >
            <p
              style={{
                fontFamily: "Lora, serif",
                fontSize: 12,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#c9a84c",
                margin: 0,
              }}
            >
              YOUR CONCIERGE
            </p>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
                color: "#999",
                fontSize: 20,
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
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
                      Gold Passport — $29/mo · Unlimited concierge · Personalized taste
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

          {/* Input */}
          <div
            style={{
              borderTop: "1px solid #e8e0d4",
              padding: "12px 20px",
              paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
              background: "#faf9f6",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isGated ? "Create your passport to continue..." : "Ask your concierge..."}
                disabled={isGated}
                rows={1}
                style={{
                  flex: 1,
                  border: "1px solid #e8e0d4",
                  background: isGated ? "#f5f5f0" : "#fff",
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
                onClick={sendMessage}
                disabled={isLoading || !input.trim() || isGated}
                style={{
                  background: isLoading || !input.trim() || isGated ? "#ccc" : "#1a1a1a",
                  color: "#fff",
                  border: "none",
                  padding: "10px 16px",
                  fontFamily: "Lora, serif",
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor: isLoading || !input.trim() || isGated ? "default" : "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop when panel is open */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 199,
            background: "rgba(0,0,0,0.3)",
          }}
        />
      )}

      <style>{`
        @keyframes slideUpPanel {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
