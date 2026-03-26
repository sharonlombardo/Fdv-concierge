import { useEffect } from "react";
import { useLocation } from "wouter";

export function usePageView() {
  const [location] = useLocation();

  useEffect(() => {
    try {
      fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "page_view",
          sourcePage: location,
          metadata: { timestamp: Date.now(), userAgent: navigator.userAgent },
        }),
      }).catch(() => {});
    } catch {}
  }, [location]);
}
