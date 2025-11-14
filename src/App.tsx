import React from "react";
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

import Dashboard from "@/pages/dashboard";
import Objects from "@/pages/objects";
import Events from "@/pages/events";
import Patterns from "@/pages/patterns";
import AIAssistant from "@/pages/ai-assistant";
import Sources from "@/pages/sources";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";

import { AuthProvider } from "@/features/auth/auth-provider";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

// Обертки
const DashboardProtected = () => <ProtectedRoute component={Dashboard} />;
const ObjectsProtected = () => <ProtectedRoute component={Objects} />;
const EventsProtected = () => <ProtectedRoute component={Events} />;
const PatternsProtected = () => <ProtectedRoute component={Patterns} />;
const AIAssistantProtected = () => <ProtectedRoute component={AIAssistant} />;
const SourcesProtected = () => <ProtectedRoute component={Sources} />;

function Router() {
  return (
    <Switch>
      {/* защищенные */}
      <Route path="/" component={DashboardProtected} />
      <Route path="/objects" component={ObjectsProtected} />
      <Route path="/events" component={EventsProtected} />
      <Route path="/patterns" component={PatternsProtected} />
      <Route path="/ai" component={AIAssistantProtected} />
      <Route path="/sources" component={SourcesProtected} />

      {/* открытые */}
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />

      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const [location] = useLocation();

  const isAuthRoute =
    location.startsWith("/login") ||
    location.startsWith("/register");

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />

          {isAuthRoute ? (
            <main className="flex min-h-screen items-center justify-center bg-black">
              <Router />
            </main>
          ) : (
            <SidebarProvider style={style as React.CSSProperties}>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1">
                  <header className="flex items-center justify-between h-16 px-4 border-b border-border bg-card">
                    <SidebarTrigger />
                  </header>
                  <main className="flex-1 overflow-auto">
                    <Router />
                  </main>
                </div>
              </div>
            </SidebarProvider>
          )}
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
