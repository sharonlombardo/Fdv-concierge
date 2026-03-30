// Session tracking — generates a unique session ID per browser session
// Stored in sessionStorage so it persists across page navigations but resets on tab close

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

export function getSessionId(): string {
  try {
    let id = sessionStorage.getItem("fdv_session_id");
    if (!id) {
      id = generateId();
      sessionStorage.setItem("fdv_session_id", id);
    }
    return id;
  } catch {
    // Fallback if sessionStorage blocked
    return generateId();
  }
}

export function getSessionStart(): number {
  try {
    let start = sessionStorage.getItem("fdv_session_start");
    if (!start) {
      start = String(Date.now());
      sessionStorage.setItem("fdv_session_start", start);
    }
    return parseInt(start, 10);
  } catch {
    return Date.now();
  }
}
