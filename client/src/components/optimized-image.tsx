import { useState, useEffect, useRef } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  fallbackSrc?: string;
  priority?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  className = "",
  aspectRatio,
  fallbackSrc = "https://images.unsplash.com/photo-1549944850-84e00be4203b?auto=format&fit=crop&q=80&w=800",
  priority = false,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const prevSrcRef = useRef<string>(src);

  useEffect(() => {
    if (!src) return;
    
    if (src !== prevSrcRef.current) {
      setIsLoaded(false);
      prevSrcRef.current = src;
    }

    const img = new Image();
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
      setHasError(false);
    };
    img.onerror = () => {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
      setIsLoaded(true);
    };
    
    if (priority) {
      img.fetchPriority = "high";
    }
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallbackSrc, priority]);

  const displaySrc = hasError ? fallbackSrc : (currentSrc || src);

  return (
    <div className={`relative overflow-hidden ${aspectRatio || ""}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <img
        ref={imgRef}
        src={displaySrc}
        alt={alt}
        className={`${className} ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    </div>
  );
}

export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

export function preloadImages(srcs: string[]): Promise<void[]> {
  return Promise.all(srcs.map(preloadImage));
}
