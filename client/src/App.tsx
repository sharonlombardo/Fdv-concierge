import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import ImageManagement from "@/pages/image-management";
import ImageLibrary from "@/pages/image-library";
import ImageRules from "@/pages/image-rules";
import PackingList from "@/pages/packing-list";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/images" component={ImageManagement} />
      <Route path="/library" component={ImageLibrary} />
      <Route path="/rules" component={ImageRules} />
      <Route path="/packing" component={PackingList} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="fdv-concierge-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
