import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useUser } from "@/contexts/user-context";
import { X } from "lucide-react";

const STORAGE_KEY = "fdv_concierge_nudge_shown";

const TAG_SIGNALS: Record<string, string> = {
  desert: "desert warmth and golden light",
  sand: "desert warmth and golden light",
  terracotta: "desert warmth and golden light",
  warm: "desert warmth and golden light",
  neutral: "desert warmth and golden light",
  minimal: "clean lines and quiet luxury",
  architectural: "clean lines and quiet luxury",
  clean: "clean lines and quiet luxury",
  modern: "clean lines and quiet luxury",
  evening: "evening drama",
  night: "evening drama",
  dramatic: "evening drama",
  dark: "evening drama",
  color: "color and texture",
  pattern: "color and texture",
  textile: "color and texture",
  print: "color and texture",
};

function getDominantSignal(saves: any[]): string {
  const tagCounts: Record<string, number> = {};

  for (const save of saves) {
    const tags: string[] = save.aestheticTags || save.aesthetic_tags || [];
    if (typeof tags === "string") {
      try {
        const parsed = JSON.parse(tags);
        if (Array.isArray(parsed)) {
          parsed.forEach((t: string) => {
            const key = t.toLowerCase().trim();
            if (TAG_SIGNALS[key]) {
              const signal = TAG_SIGNALS[key];
              tagCounts[signal] = (tagCounts[signal] || 0) + 1;
            }
          });
        }
      } catch {}
    } else if (Array.isArray(tags)) {
      tags.forEach((t: string) => {
        const key = t.toLowerCase().trim();
        if (TAG_SIGNALS[key]) {
          const signal = TAG_SIGNALS[key];
          tagCounts[signal] = (tagCounts[signal] || 0) + 1;
        }
      });
    }
  }

  let best = "something beautiful";
  let bestCount = 0;
  for (const [signal, count] of Object.entries(tagCounts)) {
    if (count > bestCount) {
      best = signal;
      bestCount = count;
    }
  }
  return best;
}

export function ConciergeNudge() {
  const { saveCount } = useUser();
  const [show, setShow] = useState(false);
  const [signal, setSignal] = useState("something beautiful");
  const [, navigate] = useLocation();

  useEffect(() => {
    // Only trigger on saves 3-5
    if (saveCount < 3 || saveCount > 5) return;

    // Only show once
    if (localStorage.getItem(STORAGE_KEY)) return;

    // Fetch saves to analyze tags
    fetch("/api/saves", { credentials: "include" })
      .then((r) => r.json())
      .then((saves: any[]) => {
        if (Array.isArray(saves) && saves.length > 0) {
          setSignal(getDominantSignal(saves));
        }
        localStorage.setItem(STORAGE_KEY, "true");
        setTimeout(() => setShow(true), 800);
      })
      .catch(() => {
        localStorage.setItem(STORAGE_KEY, "true");
        setTimeout(() => setShow(true), 800);
      });
  }, [saveCount]);

  if (!show) return null;

  const dismiss = () => setShow(false);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={dismiss}
    >
      <div
        className="relative bg-white rounded-lg shadow-2xl max-w-sm w-[90vw] mx-auto p-8 text-center animate-in fade-in zoom-in-95 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={18} />
        </button>

        <p
          className="text-[12px] uppercase tracking-[0.15em] mb-4"
          style={{ color: "#c9a84c", fontFamily: "'Inter', sans-serif" }}
        >
          Your Concierge
        </p>

        <p
          className="text-[19px] leading-relaxed mb-2"
          style={{ fontFamily: "'Lora', Georgia, serif", color: "#2c2416" }}
        >
          You're drawn to {signal}.
        </p>

        <p
          className="text-[15px] leading-relaxed mb-6"
          style={{ fontFamily: "'Lora', Georgia, serif", color: "#888" }}
        >
          Your Concierge can build from here.
        </p>

        <button
          onClick={() => {
            dismiss();
            navigate("/suitcase?curate=true");
          }}
          className="w-full bg-black text-white uppercase tracking-[0.15em] text-[13px] font-medium py-3 rounded hover:bg-gray-900 transition-colors"
        >
          Curate for Me
        </button>

        <button
          onClick={dismiss}
          className="mt-4 text-[13px] text-gray-400 hover:text-gray-600 transition-colors"
        >
          Keep exploring
        </button>
      </div>
    </div>
  );
}
