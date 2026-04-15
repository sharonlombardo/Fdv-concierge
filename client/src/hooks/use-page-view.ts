import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { getSessionId, getSessionStart } from "@/lib/session";
import { useUser } from "@/contexts/user-context";

function trackEvent(eventType: string, data: Record<string, any>) {
  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventType, ...data }),
  }).catch(() => {});
}

export function usePageView() {
  const [location] = useLocation();
  const { email } = useUser();
  const sessionStarted = useRef(false);
  const pageEntryTime = useRef(Date.now());

  // Session start event — fires once per session
  useEffect(() => {
    if (sessionStarted.current) return;
    sessionStarted.current = true;
    trackEvent("session_start", {
      sourcePage: location,
      metadata: {
        sessionId: getSessionId(),
        sessionStart: getSessionStart(),
        userEmail: email || null,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        referrer: document.referrer || null,
        userAgent: navigator.userAgent,
      },
    });
  }, []);

  // Page view event — fires on every route change
  useEffect(() => {
    const timeOnPreviousPage = Date.now() - pageEntryTime.current;
    pageEntryTime.current = Date.now();

    // Store last meaningful page for returning user redirect
    if (location !== "/" && location !== "/profile") {
      try { localStorage.setItem("fdv_last_page", location); } catch {}
    }

    trackEvent("page_view", {
      sourcePage: location,
      metadata: {
        sessionId: getSessionId(),
        userEmail: email || null,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        referrer: document.referrer || null,
        timeOnPreviousPage: timeOnPreviousPage > 500 ? timeOnPreviousPage : null,
        timestamp: Date.now(),
      },
    });
  }, [location]);

  // Session end event — fires on tab close / navigate away
  useEffect(() => {
    const handleUnload = () => {
      const sessionDuration = Date.now() - getSessionStart();
      // Use sendBeacon for reliability on page unload
      const payload = JSON.stringify({
        eventType: "session_end",
        sourcePage: location,
        metadata: {
          sessionId: getSessionId(),
          userEmail: email || null,
          sessionDuration,
        },
      });
      navigator.sendBeacon?.("/api/events", new Blob([payload], { type: "application/json" }));
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [location, email]);
}
