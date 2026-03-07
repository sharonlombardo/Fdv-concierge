import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { PRESET_CAPSULES } from "@/data/capsule-data";
import { CapsuleView } from "@/components/capsule-view";

export default function CapsuleDetail() {
  const [match, params] = useRoute("/capsule/:capsuleId");
  const [, navigate] = useLocation();

  if (!match || !params?.capsuleId) {
    navigate("/my-edits");
    return null;
  }

  const capsule = PRESET_CAPSULES.find((c) => c.id === params.capsuleId);

  if (!capsule) {
    navigate("/my-edits");
    return null;
  }

  return <CapsuleView capsule={capsule} />;
}
