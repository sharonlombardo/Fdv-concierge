import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSessionId } from "@/lib/session";

interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

interface UserState {
  email: string | null;
  name: string | null;
  user: AuthUser | null;
  setEmail: (email: string) => Promise<void>;
  clearEmail: () => void;
  isLoggedIn: boolean;
  saveCount: number;
  incrementSaveCount: () => number;
  // Auth methods
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  authLoading: boolean;
  showPassportGate: boolean;
  setShowPassportGate: (show: boolean) => void;
  pendingSaveCallback: (() => void) | null;
  setPendingSaveCallback: (cb: (() => void) | null) => void;
}

const UserContext = createContext<UserState | null>(null);

const LS_EMAIL_KEY = "fdv_user_email";
const LS_SAVE_COUNT_KEY = "fdv_save_count";
const LS_EMAIL_PROMPT_SHOWN_KEY = "fdv_email_prompt_shown";
const LS_ITINERARY_EMAIL_SHOWN_KEY = "fdv_itinerary_email_shown";

export function UserProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showPassportGate, setShowPassportGate] = useState(false);
  const [pendingSaveCallback, setPendingSaveCallback] = useState<(() => void) | null>(null);

  // Legacy email state (falls back to localStorage for backward compat)
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

  // Check for existing session on mount
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setEmailState(data.user.email);
          try { localStorage.setItem(LS_EMAIL_KEY, data.user.email); } catch {}
        }
      })
      .catch(() => {})
      .finally(() => setAuthLoading(false));
  }, []);

  const incrementSaveCount = useCallback(() => {
    const newCount = saveCount + 1;
    setSaveCount(newCount);
    try {
      localStorage.setItem(LS_SAVE_COUNT_KEY, String(newCount));
    } catch {}
    return newCount;
  }, [saveCount]);

  // Associate anonymous saves from this browser session with the authenticated user
  const associateSessionSaves = useCallback(async () => {
    try {
      await fetch("/api/saves/associate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ sessionId: getSessionId() }),
      });
    } catch {}
  }, []);

  // Signup — Create Digital Passport
  const signup = useCallback(async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password, sessionId: getSessionId() }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || "Signup failed" };

      setUser(data.user);
      setEmailState(data.user.email);
      try { localStorage.setItem(LS_EMAIL_KEY, data.user.email); } catch {}

      // Associate any anonymous saves from this session
      associateSessionSaves();

      // Also add to waitlist for tracking
      try {
        await fetch("/api/waitlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, source: "passport_signup" }),
        });
      } catch {}

      queryClient.invalidateQueries({ queryKey: ["/api/saves"] });
      return { success: true };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  }, [queryClient, associateSessionSaves]);

  // Login
  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || "Login failed" };

      setUser(data.user);
      setEmailState(data.user.email);
      try { localStorage.setItem(LS_EMAIL_KEY, data.user.email); } catch {}

      // Associate any anonymous saves from this session
      associateSessionSaves();

      queryClient.invalidateQueries({ queryKey: ["/api/saves"] });
      return { success: true };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  }, [queryClient, associateSessionSaves]);

  // Logout
  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {}
    setUser(null);
    setEmailState(null);
    try {
      localStorage.removeItem(LS_EMAIL_KEY);
      localStorage.removeItem(LS_SAVE_COUNT_KEY);
    } catch {}
    queryClient.invalidateQueries({ queryKey: ["/api/saves"] });
  }, [queryClient]);

  // Legacy setEmail — soft capture (email-only, not full auth)
  const setEmail = useCallback(async (newEmail: string) => {
    setEmailState(newEmail);
    try { localStorage.setItem(LS_EMAIL_KEY, newEmail); } catch {}

    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, source: "soft_capture" }),
      });
    } catch {}

    // Note: no longer associates saves here — soft capture doesn't create a full auth session.
    // Saves are associated on full signup/login via associate-email with session scoping.

    queryClient.invalidateQueries({ queryKey: ["/api/saves"] });
  }, [queryClient]);

  const clearEmail = useCallback(() => {
    setEmailState(null);
    try { localStorage.removeItem(LS_EMAIL_KEY); } catch {}
  }, []);

  return (
    <UserContext.Provider
      value={{
        email: user?.email || email,
        name: user?.name || null,
        user,
        setEmail,
        clearEmail,
        isLoggedIn: !!user || !!email,
        saveCount,
        incrementSaveCount,
        signup,
        login,
        logout,
        authLoading,
        showPassportGate,
        setShowPassportGate,
        pendingSaveCallback,
        setPendingSaveCallback,
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
