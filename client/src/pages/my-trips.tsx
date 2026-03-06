import { Link } from "wouter";
import { ChevronRight, MapPin, Lock } from "lucide-react";

const TRIPS = [
  {
    title: "Morocco",
    subtitle: "Marrakech & Beyond",
    dates: "8 Days · 2026",
    route: "/concierge",
    available: true,
    image: "https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/guide-morocco/hero-main.jpg",
  },
  {
    title: "Hydra",
    subtitle: "Greek Island Escape",
    dates: "Coming Soon",
    route: "/coming-soon/hydra",
    available: false,
    image: "",
  },
  {
    title: "Slow Travel",
    subtitle: "Spain & Portugal",
    dates: "Coming Soon",
    route: "/coming-soon/slow-travel",
    available: false,
    image: "",
  },
  {
    title: "Ritual Retreat",
    subtitle: "Utah · Wellness",
    dates: "Coming Soon",
    route: "/coming-soon/retreat",
    available: false,
    image: "",
  },
];

export default function MyTrips() {
  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: 70,
        paddingBottom: 80,
        background: "#faf9f6",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px" }}>
        <header style={{ textAlign: "center", marginBottom: 40, paddingTop: 16 }}>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(44, 36, 22, 0.4)",
              marginBottom: 12,
            }}
          >
            Your Journeys
          </p>
          <h1
            style={{
              fontFamily: "Lora, serif",
              fontSize: 32,
              fontWeight: 500,
              color: "#2c2416",
              marginBottom: 8,
            }}
          >
            My Trips
          </h1>
          <p
            style={{
              fontFamily: "Lora, serif",
              fontSize: 15,
              fontStyle: "italic",
              color: "rgba(44, 36, 22, 0.55)",
              maxWidth: 360,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Itineraries you've unlocked, saved, or purchased.
          </p>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {TRIPS.map((trip) => (
            <Link key={trip.title} href={trip.route}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: 16,
                  background: "#fff",
                  borderRadius: 12,
                  cursor: trip.available ? "pointer" : "default",
                  opacity: trip.available ? 1 : 0.6,
                  border: "1px solid rgba(0,0,0,0.06)",
                  transition: "box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (trip.available) (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                {/* Trip image or placeholder */}
                <div
                  style={{
                    width: 72,
                    height: 96,
                    borderRadius: 8,
                    overflow: "hidden",
                    flexShrink: 0,
                    background: trip.image
                      ? `url('${trip.image}') center/cover`
                      : "linear-gradient(135deg, #e8e4df 0%, #d4cec5 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {!trip.image && <MapPin style={{ width: 20, height: 20, color: "rgba(44,36,22,0.3)" }} />}
                </div>

                {/* Trip info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: "Lora, serif",
                      fontSize: 18,
                      fontWeight: 500,
                      color: "#2c2416",
                      marginBottom: 2,
                    }}
                  >
                    {trip.title}
                  </p>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 12,
                      color: "rgba(44,36,22,0.55)",
                      marginBottom: 4,
                    }}
                  >
                    {trip.subtitle}
                  </p>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 11,
                      fontWeight: 500,
                      letterSpacing: "0.05em",
                      color: trip.available ? "rgba(44,36,22,0.7)" : "rgba(44,36,22,0.35)",
                      textTransform: "uppercase",
                    }}
                  >
                    {trip.dates}
                  </p>
                </div>

                {/* Action icon */}
                <div style={{ flexShrink: 0 }}>
                  {trip.available ? (
                    <ChevronRight style={{ width: 20, height: 20, color: "rgba(44,36,22,0.3)" }} />
                  ) : (
                    <Lock style={{ width: 16, height: 16, color: "rgba(44,36,22,0.25)" }} />
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
