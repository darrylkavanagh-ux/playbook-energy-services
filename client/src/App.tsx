import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import Analyze from "@/pages/Analyze";
import Results from "@/pages/Results";
import OrbAI from "@/pages/OrbAI";
import KavanAI from "@/pages/KavanAI";
import SystemStatus from "@/pages/SystemStatus";
import Foxlite from "@/pages/Foxlite";
import ForensicInvestigation from "@/pages/ForensicInvestigation";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/analyze" component={Analyze} />
      <Route path="/results" component={Results} />
      <Route path="/orb" component={OrbAI} />
      <Route path="/kavan" component={KavanAI} />
      <Route path="/forensic" component={ForensicInvestigation} />
      <Route path="/status" component={SystemStatus} />
      <Route path="/foxlite" component={Foxlite} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
