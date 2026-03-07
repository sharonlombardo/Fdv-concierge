import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
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
import MoroccoGuide from "@/pages/guides/morocco";
import GuidesListing from "@/pages/guides-listing";
import ShopPage from "@/pages/shop";
import DailyFlow from "@/pages/daily-flow";
import MyEdits from "@/pages/my-edits";
import MyTrips from "@/pages/my-trips";
import ConciergeInfo from "@/pages/concierge-info";
import Profile from "@/pages/profile";
import CapsuleDetail from "@/pages/capsule-detail";
import { EmailCaptureManager } from "@/components/email-capture-manager";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Threshold} />
      <Route path="/destinations" component={Destinations} />
      <Route path="/destinations/hydra" component={ComingSoon} />
      <Route path="/destinations/slow-travel" component={ComingSoon} />
      <Route path="/destinations/retreat" component={ComingSoon} />
      <Route path="/destinations/new-york" component={ComingSoon} />
      <Route path="/guides" component={GuidesListing} />
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
      <Route path="/current">{() => <CurrentFeed />}</Route>
      <Route path="/suitcase" component={SuitcasePage} />
      <Route path="/suitcase/edit/:editTag" component={EditDetail} />
      <Route path="/todays-edit" component={TodaysEdit} />
      <Route path="/image-control" component={ImageControl} />
      <Route path="/test-saves" component={TestSaves} />
      <Route path="/shop" component={ShopPage} />
      <Route path="/daily-flow" component={DailyFlow} />
      <Route path="/my-edits" component={MyEdits} />
      <Route path="/capsule/:capsuleId" component={CapsuleDetail} />
      <Route path="/my-trips" component={MyTrips} />
      <Route path="/concierge-info" component={ConciergeInfo} />
      <Route path="/profile" component={Profile} />
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
          <EmailCaptureManager />
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
