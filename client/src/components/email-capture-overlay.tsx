import { useState } from "react";
import { X } from "lucide-react";
import { useUser } from "@/contexts/user-context";

interface EmailCaptureOverlayProps {
  variant: "save" | "itinerary";
  onDismiss: () => void;
  onComplete: () => void;
}

const COPY = {
  save: {
    heading: "You've been saving beautifully.",
    body: "Let us keep them safe for you — and start\nlearning what you love.",
    button: "CONTINUE",
    dismiss: "Maybe later",
  },
  itinerary: {
    heading: "This is your Morocco itinerary —",
    body: "8 days of places, outfits, and moments.\n\nEnter your email to save your spot\nand keep everything you discover.",
    button: "VIEW MY ITINERARY",
    dismiss: "Browse first",
  },
};

export function EmailCaptureOverlay({ variant, onDismiss, onComplete }: EmailCaptureOverlayProps) {
  const { setEmail } = useUser();
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const copy = COPY[variant];

  const isValidEmail = (e: string) => e.includes("@") && e.includes(".");

  const handleSubmit = async () => {
    if (!isValidEmail(inputValue) || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await setEmail(inputValue.trim().toLowerCase());
      setShowWelcome(true);
      setTimeout(() => {
        onComplete();
      }, 1800);
    } catch {
      setIsSubmitting(false);
    }
  };

  if (showWelcome) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <div
          style={{
            fontFamily: "Lora, serif",
            fontSize: 24,
            color: "#c9a84c",
            fontWeight: 500,
            animation: "fadeIn 0.5s ease-out",
          }}
        >
          ✦ Welcome
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onDismiss}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.25)",
        }}
      />

      {/* Glass card */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 480,
          background: "rgba(250, 249, 246, 0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderRadius: "20px 20px 0 0",
          padding: "40px 32px 24px",
          animation: "slideUp 0.4s ease-out",
        }}
      >
        {/* X button */}
        <button
          onClick={onDismiss}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
          }}
        >
          <X size={20} color="rgba(44, 36, 22, 0.35)" />
        </button>

        {/* Heading */}
        <p
          style={{
            fontFamily: "Lora, serif",
            fontSize: 20,
            color: "#2c2416",
            textAlign: "center",
            lineHeight: 1.5,
            margin: 0,
            marginBottom: 8,
            fontWeight: 500,
          }}
        >
          {copy.heading}
        </p>

        {/* Body */}
        <p
          style={{
            fontFamily: "Lora, serif",
            fontSize: 16,
            color: "rgba(44, 36, 22, 0.65)",
            textAlign: "center",
            lineHeight: 1.6,
            margin: 0,
            marginBottom: 28,
            whiteSpace: "pre-line",
          }}
        >
          {copy.body}
        </p>

        {/* Email input */}
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
            fontFamily: "Inter, sans-serif",
            fontSize: 16,
            color: "#2c2416",
            padding: "12px 0",
            outline: "none",
            textAlign: "center",
            marginBottom: 20,
          }}
        />

        {/* Submit button */}
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
            fontFamily: "Inter, sans-serif",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.1em",
            cursor: isValidEmail(inputValue) ? "pointer" : "default",
            transition: "background 0.2s, color 0.2s",
            marginBottom: 16,
          }}
        >
          {isSubmitting ? "..." : copy.button}
        </button>

        {/* Dismiss link */}
        <button
          onClick={onDismiss}
          style={{
            display: "block",
            margin: "0 auto",
            background: "none",
            border: "none",
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            color: "#2c2416",
            cursor: "pointer",
            padding: "4px 8px",
            textDecoration: "none",
          }}
        >
          {copy.dismiss}
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
