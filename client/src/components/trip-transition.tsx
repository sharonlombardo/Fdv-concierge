import { useState, useEffect } from "react";

interface TripTransitionProps {
  isActive: boolean;
  onComplete: () => void;
}

const frames = [
  { 
    image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=1200",
    text: "Remembering what resonated..." 
  },
  { 
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&q=80&w=1200",
    text: "Building your aesthetic..." 
  },
  { 
    image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&q=80&w=1200",
    text: "Finding the places..." 
  },
  { 
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200",
    text: "Curating your experience..." 
  },
  { 
    image: "https://images.unsplash.com/photo-1507400492013-162706c8c05e?auto=format&fit=crop&q=80&w=1200",
    text: "Creating your journey..." 
  },
];

export function TripTransition({ isActive, onComplete }: TripTransitionProps) {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setCurrentFrameIndex(0);
      setIsVisible(false);
      setIsFadingOut(false);
      return;
    }

    setIsVisible(true);

    const frameInterval = setInterval(() => {
      setCurrentFrameIndex((prev) => {
        if (prev >= frames.length - 1) {
          clearInterval(frameInterval);
          setIsFadingOut(true);
          setTimeout(() => {
            onComplete();
          }, 600);
          return prev;
        }
        return prev + 1;
      });
    }, 650);

    return () => clearInterval(frameInterval);
  }, [isActive, onComplete]);

  if (!isActive && !isVisible) return null;

  const currentFrame = frames[currentFrameIndex];

  return (
    <div 
      className={`fixed inset-0 z-[9999] transition-opacity duration-500 ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
      data-testid="trip-transition-overlay"
    >
      <div className="absolute inset-0 bg-stone-900" />
      
      {frames.map((frame, index) => (
        <div 
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentFrameIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img 
            src={frame.image} 
            alt=""
            className="w-full h-full object-cover opacity-50 saturate-[0.7]"
          />
        </div>
      ))}
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
      
      <div className="absolute inset-0 flex items-center justify-center">
        {frames.map((frame, index) => (
          <p 
            key={index}
            className={`absolute text-white text-2xl md:text-3xl lg:text-4xl font-serif italic tracking-wide text-center px-8 transition-opacity duration-300 drop-shadow-lg ${
              index === currentFrameIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
          >
            {frame.text}
          </p>
        ))}
      </div>

      <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-2">
        {frames.map((_, index) => (
          <div 
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === currentFrameIndex 
                ? "bg-white/90 scale-125" 
                : index < currentFrameIndex 
                  ? "bg-white/50" 
                  : "bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
