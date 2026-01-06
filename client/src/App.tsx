import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import ImageManagement from "@/pages/image-management";
import ImageLibrary from "@/pages/image-library";
import ImageRules from "@/pages/image-rules";
import Editorial from "@/pages/editorial";
import PackingList from "@/pages/packing-list";
import TestSaves from "@/pages/test-saves";
import CurrentFeed from "@/pages/current";
import SuitcasePage from "@/pages/suitcase";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/images" component={ImageManagement} />
      <Route path="/library" component={ImageLibrary} />
      <Route path="/rules" component={ImageRules} />
      <Route path="/editorial" component={Editorial} />
      <Route path="/packing" component={PackingList} />
      <Route path="/current" component={CurrentFeed} />
      <Route path="/suitcase" component={SuitcasePage} />
      <Route path="/test-saves" component={TestSaves} />
      <Route component={NotFound} />
    </Switch>
  );
}

function FloatingSuitcase() {
  const [location] = useLocation();
  
  if (location === '/packing' || location === '/editorial' || location === '/suitcase') return null;
  
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="fdv-concierge-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
          <FloatingSuitcase />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
