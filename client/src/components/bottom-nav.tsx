import { Link, useLocation } from "wouter";

export default function BottomNav() {
  const [location] = useLocation();

  // Don't render on landing page
  if (location === "/") return null;

  const isHome = location === "/concierge" || location === "/itinerary/morocco";
  const isCurrent = location === "/current";
  const isSuitcase = location.startsWith("/suitcase");
  const isMorocco = location === "/packing";

  const tabs = [
    {
      label: "HOME",
      href: "/concierge",
      active: isHome && !isMorocco,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 12l9-9 9 9" />
          <path d="M5 10v10h14V10" />
        </svg>
      ),
    },
    {
      label: "CURRENT",
      href: "/current",
      active: isCurrent,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2l10 10-10 10L2 12z" />
        </svg>
      ),
    },
    {
      label: "SUITCASE",
      href: "/suitcase",
      active: isSuitcase,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="8" width="18" height="13" rx="2" />
          <path d="M8 8V5a2 2 0 012-2h4a2 2 0 012 2v3" />
        </svg>
      ),
    },
    {
      label: "MOROCCO",
      href: "/packing",
      active: isMorocco,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z" />
        </svg>
      ),
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[80] bg-white border-t border-[#f0f0f0] flex justify-around items-center"
      style={{ height: 60, paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {tabs.map((tab) => (
        <Link key={tab.label} href={tab.href}>
          <button
            className="flex flex-col items-center justify-center gap-1 w-full h-full bg-transparent border-none cursor-pointer px-2"
            style={{
              color: tab.active ? "#1a1a1a" : "#999999",
            }}
          >
            {tab.icon}
            <span
              style={{
                fontSize: 10,
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
