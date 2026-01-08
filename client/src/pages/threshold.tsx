import { TopNav } from "@/components/global-nav";
import CurrentFeed from "./current";

export default function Threshold() {
  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-background">
      <TopNav variant="overlay" />
      
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="absolute inset-0 bg-stone-100 dark:bg-stone-900" />
        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
          <h1 
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight"
            data-testid="text-threshold-title"
          >
            FIL DE VIE CONCIERGE
          </h1>
          <div className="space-y-4">
            <p className="text-lg md:text-xl text-muted-foreground" data-testid="text-threshold-line1">
              Discover the world of FIL DE VIE.
            </p>
            <p className="text-lg md:text-xl text-muted-foreground" data-testid="text-threshold-line2">
              Places, objects, and experiences worth returning to.
            </p>
          </div>
          <p className="text-base text-muted-foreground/80 max-w-lg mx-auto leading-relaxed" data-testid="text-threshold-paragraph">
            A collection of places to enter, objects to live with, and moments to come back to.
          </p>
          <div className="pt-8">
            <div className="animate-bounce">
              <svg 
                className="w-6 h-6 mx-auto text-muted-foreground/50" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <CurrentFeed embedded />
    </div>
  );
}
