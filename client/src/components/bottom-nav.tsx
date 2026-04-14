import { Link, useLocation } from "wouter";

export default function BottomNav() {
  const [location] = useLocation();

  const isHome = location === "/";
  const isSuitcase = location.startsWith("/suitcase") || location.startsWith("/my-edits") || location.startsWith("/capsule") || location.startsWith("/my-trips");
  const isPassport = location === "/profile";

  const openHamburger = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-hamburger"));
  };

  const openConcierge = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-concierge"));
  };

  const tabStyle = (active: boolean) => ({
    color: active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.45)",
    fontFamily: "Inter, sans-serif" as const,
  });

  const labelStyle = (active: boolean) => ({
    fontSize: 9,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    fontWeight: active ? 600 : 400,
  });

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[80]"
      style={{
        height: "calc(60px + env(safe-area-inset-bottom, 0px))",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        backgroundColor: "#1A1A18",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        WebkitTransform: "translateZ(0)",
        transform: "translateZ(0)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
        alignItems: "end",
      }}
    >
      {/* HOME */}
      <Link href="/">
        <button
          className="flex flex-col items-center justify-end gap-0.5 bg-transparent border-none cursor-pointer w-full pb-2"
          style={tabStyle(isHome)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span style={labelStyle(isHome)}>Home</span>
        </button>
      </Link>

      {/* MENU */}
      <button
        onClick={openHamburger}
        className="flex flex-col items-center justify-end gap-0.5 bg-transparent border-none cursor-pointer w-full pb-2"
        style={tabStyle(false)}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
        <span style={labelStyle(false)}>Menu</span>
      </button>

      {/* CONCIERGE — pulsing gold circle, center */}
      <button
        onClick={openConcierge}
        className="flex flex-col items-center bg-transparent border-none cursor-pointer w-full"
        style={{ fontFamily: "Inter, sans-serif", paddingBottom: 4 }}
      >
        <div
          className="concierge-circle"
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: "#c9a84c",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: -10,
            boxShadow: "0 2px 12px rgba(201, 168, 76, 0.4)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
            <path d="M12 3l1.5 3.5L17 8l-3.5 1.5L12 13l-1.5-3.5L7 8l3.5-1.5z" />
          </svg>
        </div>
        <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 400, color: "#c9a84c", marginTop: 2 }}>
          Concierge
        </span>
      </button>

      {/* SUITCASE */}
      <Link href="/suitcase">
        <button
          className="flex flex-col items-center justify-end gap-0.5 bg-transparent border-none cursor-pointer w-full pb-2"
          style={tabStyle(isSuitcase)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="8" width="18" height="13" rx="2" />
            <path d="M8 8V5a2 2 0 012-2h4a2 2 0 012 2v3" />
          </svg>
          <span style={labelStyle(isSuitcase)}>Suitcase</span>
        </button>
      </Link>

      {/* PASSPORT */}
      <Link href="/profile">
        <button
          className="flex flex-col items-center justify-end gap-0.5 bg-transparent border-none cursor-pointer w-full pb-2"
          style={tabStyle(isPassport)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="8" r="4" />
            <path d="M20 21a8 8 0 00-16 0" />
          </svg>
          <span style={labelStyle(isPassport)}>Passport</span>
        </button>
      </Link>
    </nav>
  );
}
