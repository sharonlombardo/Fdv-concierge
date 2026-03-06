import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface UserState {
  email: string | null;
  setEmail: (email: string) => Promise<void>;
  clearEmail: () => void;
  isLoggedIn: boolean;
  saveCount: number;
  incrementSaveCount: () => number; // returns new count
}

const UserContext = createContext<UserState | null>(null);

const LS_EMAIL_KEY = "fdv_user_email";
const LS_SAVE_COUNT_KEY = "fdv_save_count";
const LS_EMAIL_PROMPT_SHOWN_KEY = "fdv_email_prompt_shown";
const LS_ITINERARY_EMAIL_SHOWN_KEY = "fdv_itinerary_email_shown";

export function UserProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [email, setEmailState] = useState<string | null>(() => {
    try {
      return localStorage.getItem(LS_EMAIL_KEY);
    } catch {
      return null;
    }
  });

  const [saveCount, setSaveCount] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem(LS_SAVE_COUNT_KEY) || "0", 10);
    } catch {
      return 0;
    }
  });

  const incrementSaveCount = useCallback(() => {
    const newCount = saveCount + 1;
    setSaveCount(newCount);
    try {
      localStorage.setItem(LS_SAVE_COUNT_KEY, String(newCount));
    } catch {}
    return newCount;
  }, [saveCount]);

  // Sync existing saves to server when email is first set
  const setEmail = useCallback(async (newEmail: string) => {
    setEmailState(newEmail);
    try {
      localStorage.setItem(LS_EMAIL_KEY, newEmail);
    } catch {}

    // Save to waitlist
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, source: "soft_capture" }),
      });
    } catch {}

    // Backfill: associate any existing anonymous saves with this email
    try {
      await fetch("/api/saves/associate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail }),
      });
    } catch {}

    // Refresh saves queries
    queryClient.invalidateQueries({ queryKey: ["/api/saves"] });
  }, [queryClient]);

  const clearEmail = useCallback(() => {
    setEmailState(null);
    try {
      localStorage.removeItem(LS_EMAIL_KEY);
    } catch {}
  }, []);

  return (
    <UserContext.Provider
      value={{
        email,
        setEmail,
        clearEmail,
        isLoggedIn: !!email,
        saveCount,
        incrementSaveCount,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}

// Export localStorage keys for use in other components
export { LS_EMAIL_KEY, LS_SAVE_COUNT_KEY, LS_EMAIL_PROMPT_SHOWN_KEY, LS_ITINERARY_EMAIL_SHOWN_KEY };
