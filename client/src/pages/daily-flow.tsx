import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Daily Flow currently lives within the /concierge page (home.tsx).
 * This redirect ensures hamburger menu → Daily Flow goes to the right place.
 * In v2, this will be a standalone per-day detailed flow page.
 */
export default function DailyFlow() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation("/concierge");
  }, [setLocation]);

  return null;
}
