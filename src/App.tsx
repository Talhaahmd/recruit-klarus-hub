
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

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

// 🔁 Handles Supabase OAuth redirect and processes access_token in URL hash
const HashRedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Process OAuth redirects
    const hash = window.location.hash;
    
    console.log('🔍 HashRedirectHandler checking URL:', location.pathname, 'Hash:', hash ? `${hash.substring(0, 20)}...` : 'none', 'Auth:', isAuthenticated);
    
    // Check if we have an access_token in the URL (from OAuth redirect)
    if (hash && hash.includes('access_token')) {
      console.log('🔐 OAuth access_token detected in hash, redirecting...');
      sessionStorage.setItem('oauth_redirect_processed', 'true');
      
      // Force a full page navigation to dashboard (not React Router)
      // This ensures the token is properly processed by Supabase
      window.location.replace('/dashboard');
      return;
    }
    
    // Check if we just completed an OAuth redirect and are now on dashboard
    if (sessionStorage.getItem('oauth_redirect_processed') && location.pathname === '/dashboard') {
      console.log('✅ OAuth redirect to dashboard successful');
      sessionStorage.removeItem('oauth_redirect_processed');
      
      if (!isAuthenticated) {
        console.log('⚠️ Still not authenticated after OAuth redirect, waiting for session...');
        // The auth context will handle authentication when the session is available
      }
    }
  }, [location, isAuthenticated]);

  return null;
};

// Authenticated route wrapper that handles redirect while auth is loading
const ProtectedRouteHandler = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // If we're processing an OAuth redirect, render children even if not yet authenticated
  // This prevents redirect loops during OAuth processing
  if (sessionStorage.getItem('oauth_redirect_processed') && location.pathname === '/dashboard') {
    console.log('⏳ Allowing access to dashboard during OAuth processing...');
    return <>{children}</>;
  }

  // For all other cases, normal auth check applies
  if (!isLoading && !isAuthenticated) {
    console.log('🔒 Access to protected route denied, redirecting to login...');
    return <Navigate to={`/login?from=${encodeURIComponent(location.pathname)}`} replace />;
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
            {/* Handle Supabase OAuth redirect from Google/LinkedIn */}
            <HashRedirectHandler />

            <Routes>
              {/* Public Routes */}
              <Route index element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/submission" element={<CVSubmission />} />

              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRouteHandler>
                  <MainLayout />
                </ProtectedRouteHandler>
              }>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="jobs" element={<Jobs />} />
                <Route path="candidates" element={<Candidates />} />
                <Route path="candidates/:id" element={<CandidateProfile />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="build-profile" element={<BuildProfile />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Legacy or fallback */}
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
