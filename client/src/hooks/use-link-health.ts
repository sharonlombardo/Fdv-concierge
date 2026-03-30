import { useQuery } from "@tanstack/react-query";

// Client-side link health cache — loads broken links once, caches for 1 hour
// Returns a function to check if a URL is broken and get its replacement

interface LinkHealthMap {
  [url: string]: { broken: boolean; replacement?: string };
}

export function useLinkHealth() {
  const { data: healthMap } = useQuery<LinkHealthMap>({
    queryKey: ["/api/link-health"],
    queryFn: async () => {
      const res = await fetch("/api/link-health");
      if (!res.ok) return {};
      return res.json();
    },
    staleTime: 60 * 60 * 1000, // 1 hour cache
    retry: false,
  });

  const getHealthyUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;
    if (!healthMap) return url; // not loaded yet, show original
    const entry = healthMap[url];
    if (!entry) return url; // not tracked, assume healthy
    if (entry.broken && entry.replacement) return entry.replacement;
    if (entry.broken) return null; // broken, no replacement — hide
    return url;
  };

  return { getHealthyUrl };
}
