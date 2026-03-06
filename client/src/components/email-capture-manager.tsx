import { useState, useCallback } from "react";
import { useUser } from "@/contexts/user-context";
import { EmailCaptureOverlay } from "./email-capture-overlay";
import { LS_EMAIL_PROMPT_SHOWN_KEY } from "@/contexts/user-context";

/**
 * App-level manager that triggers the soft email capture overlay
 * on the 3rd or 4th save when the user hasn't entered an email.
 *
 * Listens via a global callback that PinButton can invoke.
 */

let globalOnSave: (() => void) | null = null;

export function triggerSaveEvent() {
  if (globalOnSave) globalOnSave();
}

export function EmailCaptureManager() {
  const { email, saveCount } = useUser();
  const [showOverlay, setShowOverlay] = useState(false);

  const handleSave = useCallback(() => {
    if (email) return; // already identified

    // Check if we've already shown this prompt
    try {
      const shown = localStorage.getItem(LS_EMAIL_PROMPT_SHOWN_KEY);
      if (shown === "true") return;
    } catch {}

    // Trigger on first save
    if (saveCount >= 1) {
      setShowOverlay(true);
      try {
        localStorage.setItem(LS_EMAIL_PROMPT_SHOWN_KEY, "true");
      } catch {}
    }
  }, [email, saveCount]);

  // Register global callback
  globalOnSave = handleSave;

  if (!showOverlay) return null;

  return (
    <EmailCaptureOverlay
      variant="save"
      onDismiss={() => setShowOverlay(false)}
      onComplete={() => setShowOverlay(false)}
    />
  );
}
