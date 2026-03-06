import { useState } from "react";
import { useUser } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";

export default function Profile() {
  const { email, setEmail, clearEmail, isLoggedIn, saveCount } = useUser();
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showChangeEmail, setShowChangeEmail] = useState(false);

  const isValidEmail = (e: string) => e.includes("@") && e.includes(".");

  // Fetch server save count when logged in
  const { data: serverSaveCount } = useQuery({
    queryKey: ["/api/saves/count", email],
    queryFn: async () => {
      if (!email) return 0;
      const res = await fetch(`/api/saves/count?email=${encodeURIComponent(email)}`);
      if (!res.ok) return 0;
      const data = await res.json();
      return data.count || 0;
    },
    enabled: !!email,
  });

  const displaySaveCount = serverSaveCount ?? saveCount;

  const handleSubmit = async () => {
    if (!isValidEmail(inputValue) || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await setEmail(inputValue.trim().toLowerCase());
      setInputValue("");
      setShowChangeEmail(false);
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = () => {
    clearEmail();
    setShowChangeEmail(false);
    setInputValue("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: 70,
        paddingBottom: 100,
        background: "#faf9f6",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 24px" }}>
        {/* Page title */}
        <h1
          style={{
            fontFamily: "Lora, serif",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#c9a84c",
            marginBottom: 32,
            marginTop: 16,
          }}
        >
          YOUR PROFILE
        </h1>

        {/* Divider */}
        <div style={{ height: 1, background: "#e8e0d4", marginBottom: 28 }} />

        {/* Email section */}
        {isLoggedIn && !showChangeEmail ? (
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#2c2416",
                }}
              >
                {email}
              </span>
              <button
                onClick={() => setShowChangeEmail(true)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 13,
                  color: "#9B8D7C",
                  cursor: "pointer",
                  textDecoration: "underline",
                  padding: 0,
                }}
              >
                change
              </button>
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: 28 }}>
            {!isLoggedIn && (
              <>
                <p
                  style={{
                    fontFamily: "Lora, serif",
                    fontSize: 18,
                    color: "#2c2416",
                    textAlign: "center",
                    lineHeight: 1.5,
                    margin: 0,
                    marginBottom: 6,
                    fontWeight: 500,
                  }}
                >
                  You've been saving beautifully.
                </p>
                <p
                  style={{
                    fontFamily: "Lora, serif",
                    fontSize: 15,
                    color: "rgba(44, 36, 22, 0.6)",
                    textAlign: "center",
                    lineHeight: 1.6,
                    margin: 0,
                    marginBottom: 20,
                    whiteSpace: "pre-line",
                  }}
                >
                  {"Let us keep them safe for you — and start\nlearning what you love."}
                </p>
              </>
            )}
            <input
              type="email"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="your email"
              style={{
                width: "100%",
                border: "none",
                borderBottom: "1px solid #d4cdbf",
                background: "transparent",
                fontSize: 16,
                color: "#2c2416",
                padding: "12px 0",
                outline: "none",
                textAlign: "center",
                marginBottom: 16,
              }}
            />
            <button
              onClick={handleSubmit}
              disabled={!isValidEmail(inputValue) || isSubmitting}
              style={{
                width: "100%",
                height: 48,
                background: isValidEmail(inputValue) ? "#1a1a1a" : "rgba(44, 36, 22, 0.15)",
                color: isValidEmail(inputValue) ? "#ffffff" : "rgba(44, 36, 22, 0.4)",
                border: "none",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.1em",
                cursor: isValidEmail(inputValue) ? "pointer" : "default",
                transition: "background 0.2s, color 0.2s",
              }}
            >
              {isSubmitting ? "..." : "CONTINUE"}
            </button>
            {showChangeEmail && (
              <button
                onClick={() => setShowChangeEmail(false)}
                style={{
                  display: "block",
                  margin: "12px auto 0",
                  background: "none",
                  border: "none",
                  fontSize: 13,
                  color: "#9B8D7C",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            )}
          </div>
        )}

        {/* Divider */}
        <div style={{ height: 1, background: "#e8e0d4", marginBottom: 28 }} />

        {/* Your Suitcase */}
        <div style={{ marginBottom: 24 }}>
          <h2
            style={{
              fontFamily: "Lora, serif",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#c9a84c",
              marginBottom: 8,
            }}
          >
            YOUR SUITCASE
          </h2>
          <p style={{ fontSize: 16, color: "#2c2416", margin: 0 }}>
            {displaySaveCount} item{displaySaveCount !== 1 ? "s" : ""} saved
          </p>
        </div>

        {/* Your Trips */}
        <div style={{ marginBottom: 28 }}>
          <h2
            style={{
              fontFamily: "Lora, serif",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#c9a84c",
              marginBottom: 8,
            }}
          >
            YOUR TRIPS
          </h2>
          <p style={{ fontSize: 16, color: "#2c2416", margin: 0 }}>
            Morocco — 8 Days
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#e8e0d4", marginBottom: 28 }} />

        {/* About */}
        <div style={{ marginBottom: 28 }}>
          <h2
            style={{
              fontFamily: "Lora, serif",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#c9a84c",
              marginBottom: 16,
            }}
          >
            ABOUT FDV CONCIERGE
          </h2>
          <p
            style={{
              fontFamily: "Lora, serif",
              fontSize: 15,
              color: "#2c2416",
              lineHeight: 1.7,
              margin: 0,
              marginBottom: 16,
            }}
          >
            Fil de Vie Concierge is a new way to travel —
            with intention, with taste, and with someone
            who understands both.
          </p>
          <p
            style={{
              fontFamily: "Lora, serif",
              fontSize: 15,
              color: "#2c2416",
              lineHeight: 1.7,
              margin: 0,
              marginBottom: 16,
            }}
          >
            We pair the places worth returning to with the
            wardrobe that belongs there. Every detail
            considered. Every outfit earned its moment.
          </p>
          <p
            style={{
              fontFamily: "Lora, serif",
              fontSize: 15,
              color: "#2c2416",
              lineHeight: 1.7,
              margin: 0,
              marginBottom: 20,
            }}
          >
            This is a pilot experience. We'd love to hear
            what resonates — and what doesn't.
          </p>
          <a
            href="mailto:sharonplombardo@mac.com"
            style={{
              fontSize: 14,
              color: "#2c2416",
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            sharonplombardo@mac.com
          </a>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#e8e0d4", marginBottom: 28 }} />

        {/* Version */}
        <p
          style={{
            fontSize: 12,
            color: "#9B8D7C",
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          v0.1 — Pilot
        </p>

        {/* Sign Out */}
        {isLoggedIn && (
          <button
            onClick={handleSignOut}
            style={{
              display: "block",
              margin: "0 auto",
              background: "none",
              border: "none",
              fontSize: 14,
              color: "#9B8D7C",
              cursor: "pointer",
              padding: "8px 16px",
            }}
          >
            SIGN OUT
          </button>
        )}
      </div>
    </div>
  );
}
