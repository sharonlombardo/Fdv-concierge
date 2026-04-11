import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { PRESET_CAPSULES } from "@/data/capsule-data";
import { CapsuleView } from "@/components/capsule-view";

export default function CapsuleDetail() {
  const [match, params] = useRoute("/capsule/:capsuleId");
  const [, navigate] = useLocation();
  const [revealed, setRevealed] = useState(false);

  // Check if arriving from curate animation (ethereal reveal)
  const fromCurate = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('from') === 'curate';

  useEffect(() => {
    if (fromCurate) {
      window.history.replaceState({}, '', `/capsule/${params?.capsuleId}`);
      // Slow ethereal reveal
      requestAnimationFrame(() => {
        setTimeout(() => setRevealed(true), 50);
      });
    } else {
      setRevealed(true);
    }
  }, [fromCurate, params?.capsuleId]);

  if (!match || !params?.capsuleId) {
    navigate("/edits");
    return null;
  }

  const capsule = PRESET_CAPSULES.find((c) => c.id === params.capsuleId);

  if (!capsule) {
    navigate("/edits");
    return null;
  }

  return (
    <div style={{
      opacity: revealed ? 1 : 0,
      transform: revealed ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 1.5s ease-out, transform 1.5s ease-out',
    }}>
      <CapsuleView capsule={capsule} />
    </div>
  );
}
