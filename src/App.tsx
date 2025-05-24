
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

// Layout
import MainLayout from "./components/Layout/MainLayout";

// Auth Pages
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import LinkedInLogin from "./pages/Auth/LinkedInLogin";
import LinkedInSignup from "./pages/Auth/LinkedInSignup";

// Public Pages
import Home from "./pages/Home/Home";
import Apply from "./pages/Apply/Apply";

// Dashboard Pages
import Dashboard from "./pages/Dashboard/Dashboard";
import Jobs from "./pages/Jobs/Jobs";
import Candidates from "./pages/Candidates/Candidates";
import CandidateProfile from "./pages/Candidates/CandidateProfile";
import CandidateCV from "./pages/CandidateCV/CandidateCV";
import Calendar from "./pages/Calendar/Calendar";
import BuildProfile from "./pages/BuildProfile/BuildProfile";
import Settings from "./pages/Settings/Settings";
import LinkedInDashboard from "./pages/LinkedIn/LinkedInDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const HashRedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Detect access_token in hash for OAuth redirects
    const hash = window.location.hash;
    
    if (hash && hash.includes("access_token")) {
      console.log("🔐 OAuth access_token detected in hash, redirecting...");
      // Store a flag that we're handling an OAuth redirect
      sessionStorage.setItem("oauth_redirect_processed", "true");
      
      // Check if this is a LinkedIn Zero mode login
      const isLinkedInMode = sessionStorage.getItem("linkedin_mode") === "true";
      
      // Short delay to ensure Supabase has time to process the token
      setTimeout(() => {
        if (isLinkedInMode) {
          sessionStorage.removeItem("linkedin_mode");
          window.location.replace("/linkedin-dashboard");
        } else {
          window.location.replace("/dashboard");
        }
      }, 100);
      return;
    }

    // Check if we're coming from a successful OAuth redirect
    if (sessionStorage.getItem("oauth_redirect_processed")) {
      if (location.pathname === "/dashboard" || location.pathname === "/linkedin-dashboard") {
        console.log("✅ OAuth redirect successful");
        sessionStorage.removeItem("oauth_redirect_processed");
      }
    }
  }, [location, navigate, isAuthenticated]);

  return null;
};

const ProtectedRouteHandler = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, authReady } = useAuth();
  const location = useLocation();

  // If auth state is still initializing, show loading
  if (!authReady) {
    return <div className="min-h-screen flex items-center justify-center bg-white text-gray-500">Loading session...</div>;
  }
  
  // Special case: if we're handling an OAuth redirect to dashboard, allow access
  if (sessionStorage.getItem("oauth_redirect_processed") && (location.pathname === "/dashboard" || location.pathname === "/linkedin-dashboard")) {
    return <>{children}</>;
  }

  // Normal authenticated route check
  if (!isLoading && !isAuthenticated) {
    return (
      <Navigate
        to={`/login?from=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return <>{children}</>;
};

const LinkedInProtectedRouteHandler = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, authReady } = useAuth();
  const location = useLocation();

  // If auth state is still initializing, show loading
  if (!authReady) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading LinkedIn Zero...</div>;
  }
  
  // Special case: if we're handling an OAuth redirect to linkedin-dashboard, allow access
  if (sessionStorage.getItem("oauth_redirect_processed") && location.pathname === "/linkedin-dashboard") {
    return <>{children}</>;
  }

  // Normal authenticated route check for LinkedIn Zero
  if (!isLoading && !isAuthenticated) {
    return (
      <Navigate
        to="/linkedin-login"
        replace
      />
    );
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <HashRedirectHandler />
            <Routes>
              <Route index element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/linkedin-login" element={<LinkedInLogin />} />
              <Route path="/linkedin-signup" element={<LinkedInSignup />} />
              <Route path="/apply/:jobId" element={<Apply />} />

              {/* LinkedIn Zero Dashboard - Separate protected route */}
              <Route
                path="/linkedin-dashboard"
                element={
                  <LinkedInProtectedRouteHandler>
                    <LinkedInDashboard />
                  </LinkedInProtectedRouteHandler>
                }
              />

              {/* Regular Dashboard Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRouteHandler>
                    <MainLayout />
                  </ProtectedRouteHandler>
                }
              >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="jobs" element={<Jobs />} />
                <Route path="candidates" element={<Candidates />} />
                <Route path="candidates/:id" element={<CandidateProfile />} />
                <Route path="candidate-cv" element={<CandidateCV />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="build-profile" element={<BuildProfile />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              <Route path="/index" element={<Navigate to="/dashboard" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
