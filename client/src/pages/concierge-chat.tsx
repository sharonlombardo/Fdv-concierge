import { useState, useRef, useEffect } from "react";
import { useUser } from "@/contexts/user-context";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ConciergeChat() {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/concierge/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) {
        throw new Error("Chat request failed");
      }

      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "I'm sorry, I wasn't able to respond just now. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: 70, background: "#faf9f6", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "24px 24px 16px", maxWidth: 600, margin: "0 auto", width: "100%" }}>
        <p style={{ fontFamily: "Lora, serif", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", color: "#c9a84c", marginBottom: 8 }}>
          YOUR FDV CONCIERGE
        </p>
        <p style={{ fontFamily: "Lora, serif", fontSize: 15, color: "#999", lineHeight: 1.6 }}>
          Ask me anything about Morocco — restaurants, packing, logistics, or what to wear.
        </p>
      </div>

      <div style={{ height: 1, background: "#e8e0d4", maxWidth: 600, margin: "0 auto", width: "100%" }} />

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 24px 120px", maxWidth: 600, margin: "0 auto", width: "100%" }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <p style={{ fontFamily: "Lora, serif", fontSize: 17, color: "#2c2416", lineHeight: 1.6, marginBottom: 24 }}>
              What can I help you plan?
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 320, margin: "0 auto" }}>
              {[
                "What should I pack for Morocco?",
                "Tell me about the best restaurants in Marrakech",
                "What's the weather like in the Atlas Mountains?",
                "Help me plan a day in the Medina",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => { setInput(suggestion); inputRef.current?.focus(); }}
                  style={{
                    background: "#fff",
                    border: "1px solid #e8e0d4",
                    padding: "12px 16px",
                    fontFamily: "Lora, serif",
                    fontSize: 14,
                    color: "#555",
                    cursor: "pointer",
                    textAlign: "left",
                    lineHeight: 1.5,
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              marginBottom: 20,
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "85%",
                padding: "14px 18px",
                background: msg.role === "user" ? "#1a1a1a" : "#fff",
                color: msg.role === "user" ? "#fff" : "#2c2416",
                border: msg.role === "assistant" ? "1px solid #e8e0d4" : "none",
                fontFamily: "Lora, serif",
                fontSize: 15,
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 20 }}>
            <div
              style={{
                padding: "14px 18px",
                background: "#fff",
                border: "1px solid #e8e0d4",
                fontFamily: "Lora, serif",
                fontSize: 15,
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
          position: "fixed",
          bottom: 80,
          left: 0,
          right: 0,
          background: "#faf9f6",
          borderTop: "1px solid #e8e0d4",
          padding: "12px 24px",
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto", display: "flex", gap: 12, alignItems: "flex-end" }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your concierge..."
            rows={1}
            style={{
              flex: 1,
              border: "1px solid #e8e0d4",
              background: "#fff",
              padding: "12px 16px",
              fontFamily: "Lora, serif",
              fontSize: 15,
              color: "#2c2416",
              resize: "none",
              outline: "none",
              lineHeight: 1.5,
            }}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            style={{
              background: isLoading || !input.trim() ? "#ccc" : "#1a1a1a",
              color: "#fff",
              border: "none",
              padding: "12px 20px",
              fontFamily: "Lora, serif",
              fontSize: 13,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: isLoading || !input.trim() ? "default" : "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
