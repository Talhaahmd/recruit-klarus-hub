
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import Jobs from "./pages/Jobs/Jobs";
import Candidates from "./pages/Candidates/Candidates";
import CandidateProfile from "./pages/Candidates/CandidateProfile";
import Calendar from "./pages/Calendar/Calendar";
import Settings from "./pages/Settings/Settings";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import CandidateCV from "./pages/CandidateCV/CandidateCV";
import CVUpload from "./pages/CVUpload/CVUpload";
import Apply from "./pages/Apply/Apply";
import NewApply from "./pages/Apply/NewApply";
import BuildProfile from "./pages/BuildProfile/BuildProfile";
import LinkedInTokenCallback from "./pages/LinkedInTokenCallback/LinkedInTokenCallback";
import AIInterviews from "./pages/AIInterviews/AIInterviews";
import InterviewDetail from "./pages/AIInterviews/InterviewDetail";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/Layout/MainLayout";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/apply/:jobId" element={<Apply />} />
                <Route path="/apply-new/:jobId" element={<NewApply />} />
                <Route path="/upload-cv/:applicationId" element={<CVUpload />} />
                <Route path="/build-profile" element={<BuildProfile />} />
                <Route path="/linkedin-callback" element={<LinkedInTokenCallback />} />
                
                {/* Protected Routes with Layout */}
                <Route path="/" element={<MainLayout />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="jobs" element={<Jobs />} />
                  <Route path="candidates" element={<Candidates />} />
                  <Route path="candidates/:id" element={<CandidateProfile />} />
                  <Route path="candidate-cv" element={<CandidateCV />} />
                  <Route path="ai-interviews" element={<AIInterviews />} />
                  <Route path="ai-interviews/:id" element={<InterviewDetail />} />
                  <Route path="calendar" element={<Calendar />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
