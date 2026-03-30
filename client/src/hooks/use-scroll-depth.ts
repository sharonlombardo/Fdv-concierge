import { useEffect, useRef } from "react";
import { getSessionId } from "@/lib/session";
import { useUser } from "@/contexts/user-context";

// Tracks scroll depth at 25%, 50%, 75%, 100% thresholds
// Fires one event per threshold per page load
export function useScrollDepth(pageName: string) {
  const { email } = useUser();
  const firedThresholds = useRef(new Set<number>());
  const entryTime = useRef(Date.now());

  useEffect(() => {
    firedThresholds.current.clear();
    entryTime.current = Date.now();

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const percent = Math.round((scrollTop / docHeight) * 100);
      const thresholds = [25, 50, 75, 100];

      for (const t of thresholds) {
        if (percent >= t && !firedThresholds.current.has(t)) {
          firedThresholds.current.add(t);
          const timeOnPage = Date.now() - entryTime.current;
          fetch("/api/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              eventType: "scroll_depth",
              sourcePage: pageName,
              metadata: {
                sessionId: getSessionId(),
                userEmail: email || null,
                depth: t,
                timeOnPage,
              },
            }),
          }).catch(() => {});
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pageName, email]);
}
