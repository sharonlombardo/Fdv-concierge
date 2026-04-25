import { Switch, Route, Redirect, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from "@/contexts/user-context";
import BottomNav from "@/components/bottom-nav";
import TopBar from "@/components/top-bar";
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
import DiaryKeepsake from "@/pages/diary-keepsake";
import MoroccoGuide from "@/pages/guides/morocco";
import HydraGuide from "@/pages/guides/hydra";
import ShopPage from "@/pages/shop";
import DailyFlow from "@/pages/daily-flow";
import MyEdits from "@/pages/my-edits";
import EditsPage from "@/pages/edits";
import MyTrips from "@/pages/my-trips";
import ConciergeInfo from "@/pages/concierge-info";
import Profile from "@/pages/profile";
import CapsuleDetail from "@/pages/capsule-detail";
import About from "@/pages/about";
import { EmailCaptureManager } from "@/components/email-capture-manager";
import PassportGate from "@/components/passport-gate";
import { FirstSavePrompt } from "@/components/first-save-prompt";
import { ConciergeNudge } from "@/components/concierge-nudge";
import { FloatingConcierge } from "@/components/floating-concierge";
import AdminPilot from "@/pages/admin/pilot";
import ConciergeChat from "@/pages/concierge-chat";
import { usePageView } from "@/hooks/use-page-view";

function PageViewTracker() {
  usePageView();
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Threshold} />
      <Route path="/about" component={About} />
      <Route path="/destinations" component={Destinations} />
      <Route path="/guides/hydra" component={HydraGuide} />
      <Route path="/destinations/hydra">{() => <Redirect to="/guides/hydra" />}</Route>
      <Route path="/destinations/slow-travel" component={ComingSoon} />
      <Route path="/destinations/retreat" component={ComingSoon} />
      <Route path="/destinations/new-york" component={ComingSoon} />
      <Route path="/guides">{() => <Redirect to="/destinations" />}</Route>
      <Route path="/guides/morocco" component={MoroccoGuide} />
      <Route path="/coming-soon/:page" component={ComingSoon} />
      <Route path="/concierge" component={Concierge} />
      <Route path="/itinerary/morocco" component={Concierge} />
      <Route path="/library" component={ImageLibrary} />
      <Route path="/rules" component={ImageRules} />
      <Route path="/editorial" component={Editorial} />
      <Route path="/packing" component={PackingList} />
      <Route path="/diary" component={TravelDiary} />
      <Route path="/travel-diary" component={TravelDiary} />
      <Route path="/diary-keepsake" component={DiaryKeepsake} />
      <Route path="/current">{() => <CurrentFeed />}</Route>
      <Route path="/suitcase" component={SuitcasePage} />
      <Route path="/suitcase/edit/:editTag" component={EditDetail} />
      <Route path="/todays-edit" component={TodaysEdit} />
      <Route path="/image-control" component={ImageControl} />
      <Route path="/test-saves" component={TestSaves} />
      <Route path="/shop" component={ShopPage} />
      <Route path="/daily-flow" component={DailyFlow} />
      <Route path="/edits" component={EditsPage} />
      <Route path="/my-edits" component={MyEdits} />
      <Route path="/capsule/:capsuleId" component={CapsuleDetail} />
      <Route path="/my-trips" component={MyTrips} />
      <Route path="/concierge-info" component={ConciergeInfo} />
      <Route path="/profile" component={Profile} />
      <Route path="/concierge-chat" component={ConciergeChat} />
      <Route path="/admin/pilot" component={AdminPilot} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
      <ThemeProvider defaultTheme="light" storageKey="fdv-concierge-theme">
        <TooltipProvider>
          <Toaster />
          <ScrollToTop />
          <PageViewTracker />
          <EmailCaptureManager />
          <PassportGate />
          {/* FirstSavePrompt removed — curate prompt now surfaces via concierge greeting after 3+ saves */}
          {/* ConciergeNudge removed — replaced by concierge greeting logic */}
          <FloatingConcierge />
          <TopBar />
          <Router />
          <BottomNav />
        </TooltipProvider>
      </ThemeProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
