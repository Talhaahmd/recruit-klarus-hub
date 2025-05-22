
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

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

// Enhanced HashRedirectHandler with more robust hash detection
const HashRedirectHandler = () => {
  useEffect(() => {
    // Check if we have a hash with access_token
    if (window.location.hash && window.location.hash.includes('access_token')) {
      console.log('🔐 OAuth redirect detected with access_token');
      
      // Store the fact that we're processing a login to prevent infinite loops
      sessionStorage.setItem('processing_oauth_login', 'true');
      
      // Force a full page reload to the dashboard route
      // This ensures Supabase client properly processes the token
      window.location.replace('/dashboard');
    } else if (sessionStorage.getItem('processing_oauth_login')) {
      // Clean up the processing flag after redirect is complete
      console.log('✅ OAuth login process completed');
      sessionStorage.removeItem('processing_oauth_login');
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
            {/* Place HashRedirectHandler at the top level so it runs on every route change */}
            <HashRedirectHandler />
            <Routes>
              {/* Public Routes */}
              <Route index element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/submission" element={<CVSubmission />} />

              {/* Protected Routes */}
              <Route path="/" element={<MainLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="jobs" element={<Jobs />} />
                <Route path="candidates" element={<Candidates />} />
                <Route path="candidates/:id" element={<CandidateProfile />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="build-profile" element={<BuildProfile />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Redirect legacy route */}
              <Route path="/index" element={<Navigate to="/dashboard" />} />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
