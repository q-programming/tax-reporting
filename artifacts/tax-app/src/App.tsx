import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { MainLayout } from "@/components/layout/MainLayout";
import TaxSummary from "@/pages/TaxSummary";
import TaxTransactions from "@/pages/TaxTransactions";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  }
});

function Router() {
  return (
    <MainLayout>
      <Switch>
        {/* Redirect root to tax-summary */}
        <Route path="/" component={() => <Redirect to="/tax-summary" />} />
        
        {/* App Pages */}
        <Route path="/tax-summary" component={TaxSummary} />
        <Route path="/tax-transactions" component={TaxTransactions} />
        
        {/* Fallback */}
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
