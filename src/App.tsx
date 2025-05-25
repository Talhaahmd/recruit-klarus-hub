
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

// Public Pages
import Home from "./pages/Home/Home";
import Apply from "./pages/Apply/Apply";
import NewApply from "./pages/Apply/NewApply";
import LinkedInTokenCallback from "./pages/LinkedInTokenCallback/LinkedInTokenCallback";
import CVUpload from "./pages/CVUpload/CVUpload";

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

const HashRedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const hash = window.location.hash;
    
    if (hash && hash.includes("access_token")) {
      console.log("🔐 OAuth access_token detected in hash, redirecting to dashboard...");
      sessionStorage.setItem("oauth_redirect_processed", "true");
      
      setTimeout(() => {
        window.location.replace("/dashboard");
      }, 100);
      return;
    }

    if (sessionStorage.getItem("oauth_redirect_processed") && location.pathname === "/dashboard") {
      console.log("✅ OAuth redirect to dashboard successful");
      sessionStorage.removeItem("oauth_redirect_processed");
    }
  }, [location, navigate, isAuthenticated]);

  return null;
};

const ProtectedRouteHandler = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, authReady } = useAuth();
  const location = useLocation();

  if (!authReady) {
    return <div className="min-h-screen flex items-center justify-center bg-white text-gray-500">Loading session...</div>;
  }
  
  if (sessionStorage.getItem("oauth_redirect_processed") && location.pathname === "/dashboard") {
    return <>{children}</>;
  }

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
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/apply/:jobId" element={<NewApply />} />
              <Route path="/cv-upload" element={<CVUpload />} />
              <Route path="/linkedin-token-callback" element={<LinkedInTokenCallback />} />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRouteHandler>
                    <MainLayout />
                  </ProtectedRouteHandler>
                }
              >
                <Route index element={<Dashboard />} />
              </Route>
              
              <Route
                path="/"
                element={
                  <ProtectedRouteHandler>
                    <MainLayout />
                  </ProtectedRouteHandler>
                }
              >
                <Route path="jobs" element={<Jobs />} />
                <Route path="candidates" element={<Candidates />} />
                <Route path="candidates/:id" element={<CandidateProfile />} />
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
