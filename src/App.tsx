
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Layout
import MainLayout from "./components/Layout/MainLayout";

// Auth Pages
import Index from "./pages/Index";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes (No Auth Required) */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/submission" element={<CVSubmission />} />
              
              {/* Protected Routes */}
              <Route path="/" element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/candidates" element={<Candidates />} />
                <Route path="/candidates/:id" element={<CandidateProfile />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/build-profile" element={<BuildProfile />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
