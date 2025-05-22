import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";

// Layout
import MainLayout from "./components/Layout/MainLayout";

// Auth Pages
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

// Public Pages
import Home from "./pages/Home/Home";
import CVSubmission from "./pages/Submission/Submission";

// Dashboard Pages
import Dashboard from "./pages/Dashboard/Dashboard";
import Jobs from "./pages/Jobs/Jobs";
import Candidates from "./pages/Candidates/Candidates";
import CandidateProfile from "./pages/Candidates/CandidateProfile";
import Calendar from "./pages/Calendar/Calendar";
import BuildProfile from "./pages/BuildProfile/BuildProfile";
import Settings from "./pages/Settings/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// 🔁 Handles Supabase OAuth redirect hash and processes the access token
const HashRedirectHandler = () => {
  useEffect(() => {
    const hash = window.location.hash;

    if (hash.includes("access_token")) {
      console.log("🔐 OAuth redirect detected with access_token");

      // Prevent infinite redirect loop
      sessionStorage.setItem("processing_oauth_login", "true");

      // Force reload to /dashboard to allow Supabase to handle the session from hash
      window.location.replace("/dashboard");
    } else if (sessionStorage.getItem("processing_oauth_login")) {
      console.log("✅ OAuth login complete, cleaning up flag");
      sessionStorage.removeItem("processing_oauth_login");
    }
  }, []);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {/* This handles redirects from both Google and LinkedIn logins */}
            <HashRedirectHandler />
            <Routes>
              {/* Public Routes */}
              <Route index element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/submission" element={<CVSubmission />} />

              {/* Protected Routes inside Main Layout */}
              <Route path="/" element={<MainLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="jobs" element={<Jobs />} />
                <Route path="candidates" element={<Candidates />} />
                <Route path="candidates/:id" element={<CandidateProfile />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="build-profile" element={<BuildProfile />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Redirect legacy /index to dashboard */}
              <Route path="/index" element={<Navigate to="/dashboard" />} />

              {/* Fallback route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
