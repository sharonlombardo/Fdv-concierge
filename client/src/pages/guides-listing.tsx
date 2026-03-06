import { Link } from "wouter";
import { DESTINATIONS } from "@shared/destinations";
import { ChevronRight } from "lucide-react";

function GuideCard({ destination }: { destination: typeof DESTINATIONS[0] }) {
  const imageUrl = destination.defaultImage;

  const inner = (
    <div className="group relative overflow-hidden rounded-lg aspect-[4/5] cursor-pointer">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* GUIDE badge */}
      <div className="absolute top-4 left-4 z-10">
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase' as const,
            color: '#fff',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
            padding: '6px 14px',
            borderRadius: 4,
          }}
        >
          GUIDE
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.2em',
            textTransform: 'uppercase' as const,
            opacity: 0.7,
            marginBottom: 8,
          }}
        >
          {destination.subtitle}
        </p>
        <h3
          style={{
            fontFamily: 'Lora, serif',
            fontSize: 28,
            fontWeight: 500,
            marginBottom: 8,
          }}
        >
          {destination.title}
        </h3>
        <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 16, lineHeight: 1.5 }}>
          {destination.summary}
        </p>
        {destination.available && (
          <div className="flex items-center gap-2" style={{ fontSize: 12, fontWeight: 500, opacity: 0.7 }}>
            <span>Read the Guide</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        )}
        {!destination.available && (
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const,
              opacity: 0.5,
            }}
          >
            Coming Soon
          </span>
        )}
      </div>
    </div>
  );

  if (destination.available) {
    return <Link href={destination.route}>{inner}</Link>;
  }
  return <div style={{ opacity: 0.7 }}>{inner}</div>;
}

export default function GuidesListing() {
  return (
    <div
      style={{
        minHeight: '100vh',
        paddingTop: 70,
        paddingBottom: 80,
        background: '#faf9f6',
      }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px' }}>
        <header style={{ textAlign: 'center', marginBottom: 48 }}>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'rgba(44, 36, 22, 0.5)',
              marginBottom: 12,
            }}
          >
            Explore
          </p>
          <h1
            style={{
              fontFamily: 'Lora, serif',
              fontSize: 36,
              fontWeight: 500,
              color: '#2c2416',
              marginBottom: 12,
            }}
          >
            Destination Guides
          </h1>
          <p
            style={{
              fontFamily: 'Lora, serif',
              fontSize: 16,
              fontStyle: 'italic',
              color: 'rgba(44, 36, 22, 0.6)',
              maxWidth: 420,
              margin: '0 auto',
            }}
          >
            Places, restaurants, culture, and wardrobe — curated by Fil de Vie.
          </p>
        </header>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 24,
          }}
        >
          {DESTINATIONS.map((dest) => (
            <GuideCard key={dest.slug} destination={dest} />
          ))}
        </div>

        <footer
          style={{
            textAlign: 'center',
            padding: '48px 0',
            marginTop: 48,
            borderTop: '1px solid rgba(0,0,0,0.08)',
          }}
        >
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(44, 36, 22, 0.35)',
            }}
          >
            More guides coming soon
          </p>
        </footer>
      </div>
    </div>
  );
}
