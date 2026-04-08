import { Link, useLocation } from "wouter";

export default function BottomNav() {
  const [location] = useLocation();

  const isGuides = location === "/destinations" || location.startsWith("/guides");
  const isShop = location === "/shop";
  const isSuitcase = location.startsWith("/suitcase") || location.startsWith("/my-edits") || location.startsWith("/capsule") || location.startsWith("/my-trips");
  const isPassport = location === "/profile";

  const tabs = [
    {
      label: "GUIDES",
      href: "/destinations",
      active: isGuides,
      icon: (
        // Compass icon
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z" />
        </svg>
      ),
    },
    {
      label: "SHOP",
      href: "/shop",
      active: isShop,
      icon: (
        // Shopping bag icon
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      ),
    },
    {
      label: "SUITCASE",
      href: "/suitcase",
      active: isSuitcase,
      icon: (
        // Suitcase icon
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="8" width="18" height="13" rx="2" />
          <path d="M8 8V5a2 2 0 012-2h4a2 2 0 012 2v3" />
        </svg>
      ),
    },
    {
      label: "PASSPORT",
      href: "/profile",
      active: isPassport,
      icon: (
        // User circle icon
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="8" r="4" />
          <path d="M20 21a8 8 0 00-16 0" />
        </svg>
      ),
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[80] flex justify-around items-center"
      style={{
        height: "calc(60px + env(safe-area-inset-bottom, 0px))",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        backgroundColor: "#1A1A18",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        WebkitTransform: "translateZ(0)",
        transform: "translateZ(0)",
      }}
    >
      {tabs.map((tab) => (
        <Link key={tab.label} href={tab.href}>
          <button
            className="flex flex-col items-center justify-center gap-1 w-full h-full bg-transparent border-none cursor-pointer px-2"
            style={{
              color: tab.active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.45)",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {tab.icon}
            <span
              style={{
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: tab.active ? 600 : 400,
              }}
            >
              {tab.label}
            </span>
          </button>
        </Link>
      ))}
    </nav>
  );
}
