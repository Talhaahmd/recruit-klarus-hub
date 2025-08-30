
import React, { useEffect } from "react";
import { Toaster } from "@/components/UI/toaster.tsx";
import { Toaster as Sonner } from "@/components/UI/sonner.tsx";
import { TooltipProvider } from "@/components/UI/tooltip.tsx";
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
import PostSuccess from "./pages/BuildProfile/PostSuccess";
import Theme from "./pages/Theme/Theme";
import Settings from "./pages/Settings/Settings";
import BillingPage from "./pages/Settings/BillingPage";
import NotFound from "./pages/NotFound";
import Leads from "./pages/Leads/Leads";

const queryClient = new QueryClient();

const ProtectedRouteHandler = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, authReady } = useAuth();
  const location = useLocation();

  if (!authReady) {
    return <div className="min-h-screen flex items-center justify-center bg-white text-gray-500">Loading session...</div>;
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
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/apply/:jobId" element={<NewApply />} />
              <Route path="/cv-upload" element={<CVUpload />} />
              <Route path="/linkedin-token-callback" element={<LinkedInTokenCallback />} />

              {/* Protected routes with MainLayout */}
              <Route
                path="/*"
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
                <Route path="calendar" element={<Calendar />} />
                <Route path="themes" element={<Theme />} />
                <Route path="ideas" element={<BuildProfile />} />
                <Route path="build-profile" element={<BuildProfile />} />
                <Route path="build-profile/success" element={<PostSuccess />} />
                <Route path="leads" element={<Leads />} />
                <Route path="settings" element={<Settings />} />
                <Route path="settings/billing" element={<BillingPage />} />
              </Route>

              <Route path="/index" element={<Navigate to="/dashboard" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
