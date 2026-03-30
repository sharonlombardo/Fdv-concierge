import { useState } from "react";
import { useUser } from "@/contexts/user-context";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function PassportGate() {
  const { showPassportGate, setShowPassportGate, signup, login, pendingSaveCallback, setPendingSaveCallback } = useUser();
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = mode === "signup"
      ? await signup(name, email, password)
      : await login(email, password);

    setLoading(false);

    if (result.success) {
      setSuccess(true);
      // Wait for auth cookie to be set (verify with /api/auth/me), then fire pending save
      const waitForAuth = async () => {
        // Poll /api/auth/me up to 5 times to confirm cookie is set
        for (let i = 0; i < 5; i++) {
          await new Promise(r => setTimeout(r, 400));
          try {
            const check = await fetch('/api/auth/me', { credentials: 'same-origin' });
            if (check.ok) {
              const data = await check.json();
              if (data.user) break;
            }
          } catch {}
        }
        if (pendingSaveCallback) {
          pendingSaveCallback();
          setPendingSaveCallback(null);
        }
        setShowPassportGate(false);
        setSuccess(false);
        setName("");
        setEmail("");
        setPassword("");
        setMode("signup");
      };
      waitForAuth();
    } else {
      setError(result.error || "Something went wrong");
    }
  };

  const handleClose = () => {
    setShowPassportGate(false);
    setPendingSaveCallback(null);
    setError("");
    setSuccess(false);
  };

  return (
    <Sheet open={showPassportGate} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <SheetContent side="bottom" className="h-auto max-h-[90vh] rounded-t-2xl p-0 border-0">
        <div style={{ padding: "40px 24px 48px", maxWidth: 400, margin: "0 auto" }}>
          {success ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <p style={{ fontFamily: "Lora, serif", fontSize: 28, color: "#c9a84c", marginBottom: 8 }}>
                Welcome
              </p>
              <p style={{ fontFamily: "Lora, serif", fontSize: 15, color: "#666", fontStyle: "italic" }}>
                Your Digital Passport is ready.
              </p>
            </div>
          ) : (
            <>
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <p style={{ fontFamily: "Lora, serif", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", color: "#c9a84c", marginBottom: 12 }}>
                  FIL DE VIE CONCIERGE
                </p>
                <h2 style={{ fontFamily: "Lora, serif", fontSize: 22, fontWeight: 400, color: "#1a1a1a", marginBottom: 8 }}>
                  {mode === "signup" ? "Create Your Digital Passport" : "Welcome Back"}
                </h2>
                <p style={{ fontFamily: "Lora, serif", fontSize: 14, color: "#888", fontStyle: "italic" }}>
                  {mode === "signup"
                    ? "Save what you love. We'll keep it safe for you."
                    : "Sign in to access your Suitcase."}
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {mode === "signup" && (
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={inputStyle}
                  />
                )}
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={inputStyle}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  style={inputStyle}
                />

                {error && (
                  <p style={{ color: "#c44", fontSize: 13, textAlign: "center", fontFamily: "Lora, serif" }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: "#1a1a1a",
                    color: "#fff",
                    border: "none",
                    padding: "14px 24px",
                    fontFamily: "Lora, serif",
                    fontSize: 14,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    cursor: loading ? "wait" : "pointer",
                    opacity: loading ? 0.6 : 1,
                    transition: "opacity 0.2s",
                  }}
                >
                  {loading
                    ? "..."
                    : mode === "signup"
                    ? "Create Passport"
                    : "Sign In"}
                </button>
              </form>

              <div style={{ textAlign: "center", marginTop: 24 }}>
                <button
                  onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(""); }}
                  style={{
                    background: "none",
                    border: "none",
                    fontFamily: "Lora, serif",
                    fontSize: 13,
                    color: "#999",
                    cursor: "pointer",
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                  }}
                >
                  {mode === "signup" ? "Already have a Passport? Sign in" : "Need a Passport? Create one"}
                </button>
              </div>

              <div style={{ textAlign: "center", marginTop: 16 }}>
                <button
                  onClick={handleClose}
                  style={{
                    background: "none",
                    border: "none",
                    fontFamily: "Lora, serif",
                    fontSize: 12,
                    color: "#bbb",
                    cursor: "pointer",
                  }}
                >
                  Maybe later
                </button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

const inputStyle: React.CSSProperties = {
  border: "1px solid #e0ddd6",
  padding: "12px 16px",
  fontFamily: "Lora, serif",
  fontSize: 14,
  color: "#1a1a1a",
  background: "#faf9f6",
  outline: "none",
  width: "100%",
};
