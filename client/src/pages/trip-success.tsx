import { useEffect, useState } from "react";
import { useLocation } from "wouter";

const F = {
  serif: "'Cormorant Garamond', Georgia, serif" as const,
  body: "'Lora', Georgia, serif" as const,
  ui: "'Inter', sans-serif" as const,
};

type VerifyState =
  | { status: "loading" }
  | { status: "paid"; destination: string; tier: string }
  | { status: "unpaid" }
  | { status: "error"; message: string };

export default function TripSuccess() {
  const [, setLocation] = useLocation();
  const [state, setState] = useState<VerifyState>({ status: "loading" });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    const destinationFallback = params.get("destination") || "Morocco";
    const tierFallback = params.get("tier") || "compass";

    if (!sessionId) {
      setState({ status: "error", message: "Missing checkout session." });
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`/api/checkout-session/${encodeURIComponent(sessionId)}`, {
          credentials: "include",
        });
        if (!r.ok) throw new Error(`Verification failed (${r.status})`);
        const data = await r.json();
        if (cancelled) return;
        if (data.paid) {
          const destination = data.destination || destinationFallback;
          const tier = data.tier || tierFallback;
          setState({ status: "paid", destination, tier });

          // Open the concierge with the intake message we stashed pre-redirect.
          let conciergeMsg: string | null = null;
          try { conciergeMsg = sessionStorage.getItem("fdv_pending_concierge_msg"); } catch {}
          if (!conciergeMsg) {
            conciergeMsg = `Your ${destination} curation is underway. Tell me a bit about your trip — when are you going, how long, who's coming with you, and what matters most?`;
          }
          // Small delay so the success card is visible before the concierge takes over.
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("open-concierge", { detail: { message: conciergeMsg } }));
            try {
              sessionStorage.removeItem("fdv_pending_concierge_msg");
              sessionStorage.removeItem("fdv_pending_destination");
              sessionStorage.removeItem("fdv_pending_tier_name");
            } catch {}
          }, 1400);
        } else {
          setState({ status: "unpaid" });
        }
      } catch (e: any) {
        if (cancelled) return;
        setState({ status: "error", message: e?.message || "Could not verify payment." });
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const wrap: React.CSSProperties = {
    minHeight: "100vh",
    background: "#faf9f6",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 24px",
    textAlign: "center",
  };

  if (state.status === "loading") {
    return (
      <div style={wrap}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", border: "1.5px solid rgba(44,36,22,0.08)", borderTop: "1.5px solid #c9a84c", animation: "spin 1s linear infinite", marginBottom: 24 }} />
        <p style={{ fontFamily: F.body, fontSize: 13, fontStyle: "italic", color: "rgba(44,36,22,0.45)" }}>
          Confirming your payment…
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (state.status === "paid") {
    const tierLabel = state.tier === "passage" ? "Passage" : state.tier === "trunk" ? "Trunk" : "Compass";
    return (
      <div style={wrap}>
        <span style={{ fontSize: 36, color: "#c9a84c", marginBottom: 18 }}>✦</span>
        <p style={{ fontFamily: F.ui, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#c9a84c", marginBottom: 12 }}>
          Confirmed
        </p>
        <h1 style={{ fontFamily: F.serif, fontSize: 36, fontWeight: 400, color: "#2c2416", lineHeight: 1.15, marginBottom: 12 }}>
          Your {state.destination} {tierLabel}<br />is underway.
        </h1>
        <p style={{ fontFamily: F.body, fontSize: 15, fontStyle: "italic", color: "rgba(44,36,22,0.55)", maxWidth: 460, lineHeight: 1.6, marginBottom: 28 }}>
          Your concierge is opening now. A few questions and we'll start curating.
        </p>
        <button
          onClick={() => setLocation("/suitcase")}
          style={{
            padding: "13px 28px",
            background: "#2c2416",
            color: "#faf9f6",
            border: "none",
            fontFamily: F.ui,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Open My Suitcase
        </button>
      </div>
    );
  }

  if (state.status === "unpaid") {
    return (
      <div style={wrap}>
        <p style={{ fontFamily: F.serif, fontSize: 28, color: "#2c2416", marginBottom: 12 }}>
          Payment not completed
        </p>
        <p style={{ fontFamily: F.body, fontSize: 14, fontStyle: "italic", color: "rgba(44,36,22,0.55)", marginBottom: 28 }}>
          You can try again whenever you're ready.
        </p>
        <button
          onClick={() => setLocation("/destinations")}
          style={{
            padding: "13px 28px",
            background: "#2c2416",
            color: "#faf9f6",
            border: "none",
            fontFamily: F.ui,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Back to Destinations
        </button>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <p style={{ fontFamily: F.serif, fontSize: 26, color: "#2c2416", marginBottom: 10 }}>
        Something went wrong
      </p>
      <p style={{ fontFamily: F.body, fontSize: 14, fontStyle: "italic", color: "rgba(44,36,22,0.55)", maxWidth: 420, lineHeight: 1.55, marginBottom: 24 }}>
        {state.message} If you were charged, your trip will still appear in your Suitcase shortly — or reach out and we'll sort it out.
      </p>
      <button
        onClick={() => setLocation("/suitcase")}
        style={{
          padding: "13px 28px",
          background: "#2c2416",
          color: "#faf9f6",
          border: "none",
          fontFamily: F.ui,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        Open My Suitcase
      </button>
    </div>
  );
}
