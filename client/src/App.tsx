import { Switch, Route, Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import BottomNav from "@/components/bottom-nav";
import NotFound from "@/pages/not-found";
import Threshold from "@/pages/threshold";
import Concierge from "@/pages/home";
import ImageLibrary from "@/pages/image-library";
import ImageRules from "@/pages/image-rules";
import Editorial from "@/pages/editorial";
import PackingList from "@/pages/packing-list";
import TestSaves from "@/pages/test-saves";
import CurrentFeed from "@/pages/current";
import SuitcasePage from "@/pages/suitcase";
import ImageControl from "@/pages/image-control";
import EditDetail from "@/pages/edit-detail";
import TodaysEdit from "@/pages/todays-edit";
import Destinations from "@/pages/destinations";
import ComingSoon from "@/pages/coming-soon";
import TravelDiary from "@/pages/travel-diary";
import MoroccoGuide from "@/pages/guides/morocco";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Threshold} />
      <Route path="/destinations" component={Destinations} />
      <Route path="/destinations/hydra" component={ComingSoon} />
      <Route path="/destinations/slow-travel" component={ComingSoon} />
      <Route path="/destinations/retreat" component={ComingSoon} />
      <Route path="/destinations/new-york" component={ComingSoon} />
      <Route path="/guides/morocco" component={MoroccoGuide} />
      <Route path="/coming-soon/:page" component={ComingSoon} />
      <Route path="/concierge" component={Concierge} />
      <Route path="/itinerary/morocco" component={Concierge} />
      <Route path="/library" component={ImageLibrary} />
      <Route path="/rules" component={ImageRules} />
      <Route path="/editorial" component={Editorial} />
      <Route path="/packing" component={PackingList} />
      <Route path="/diary" component={TravelDiary} />
      <Route path="/current">{() => <CurrentFeed />}</Route>
      <Route path="/suitcase" component={SuitcasePage} />
      <Route path="/suitcase/edit/:editTag" component={EditDetail} />
      <Route path="/todays-edit" component={TodaysEdit} />
      <Route path="/image-control" component={ImageControl} />
      <Route path="/test-saves" component={TestSaves} />
      <Route component={NotFound} />
    </Switch>
  );
}

function FloatingSuitcase() {
  const [location] = useLocation();
  
  if (location === '/packing' || location === '/editorial' || location === '/suitcase' || location === '/todays-edit' || location === '/diary') return null;
  
  return (
    <Link href="/suitcase">
      <Button
        size="icon"
        className="fixed bottom-6 right-6 z-[100] rounded-full w-14 h-14 shadow-lg"
        data-testid="button-floating-suitcase"
      >
        <Briefcase className="w-6 h-6" />
      </Button>
    </Link>
  );
}

function StickyLogo() {
  const [location] = useLocation();
  const [visible, setVisible] = useState(false);
  const isLanding = location === "/";

  useEffect(() => {
    if (!isLanding) {
      setVisible(true);
      return;
    }

    const handleScroll = () => {
      // On landing page, fade in after scrolling past the hero (~80vh)
      const threshold = window.innerHeight * 0.75;
      setVisible(window.scrollY > threshold);
    };

    handleScroll(); // check initial position
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLanding]);

  const handleClick = () => {
    if (isLanding) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.location.href = "/";
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`fixed top-3 left-1/2 -translate-x-1/2 z-[90] w-[60px] h-[60px] rounded-full overflow-hidden transition-all duration-300 cursor-pointer ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
      data-testid="sticky-logo"
      aria-label="Home"
    >
      <img
        src="/logo-circle-white.png"
        alt="FIL DE VIE CONCIERGE"
        className="w-full h-full object-contain rounded-full drop-shadow-md"
      />
    </button>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="fdv-concierge-theme">
        <TooltipProvider>
          <Toaster />
          <StickyLogo />
          <Router />
          <BottomNav />
          <FloatingSuitcase />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
