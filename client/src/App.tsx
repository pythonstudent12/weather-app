import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import NotFound from "../src/pages/not-found";
import Login from "../src/pages/login";
import Weather from "../src/pages/weather";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./components/auth-provider";
import Layout from "./components/layout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/weather" component={Weather} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Layout>
            <Router />
            <Toaster />
          </Layout>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
