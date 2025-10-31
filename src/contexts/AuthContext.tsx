
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { profilesService, type Profile as ProfileType } from '@/services/profilesService';
import { onboardingService } from '@/services/onboardingService';
import type { OnboardingData } from '@/types/onboarding';

type AuthContextType = {
  user: User | null;
  profile: ProfileType | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authReady: boolean;
  onboardingData: OnboardingData | null;
  hasCompletedOnboarding: boolean;
  isRecruitmentRestricted: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithLinkedIn: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<ProfileType>) => Promise<void>;
  refreshOnboardingData: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

const REDIRECT_TO = `${window.location.protocol}//${window.location.host}/dashboard`;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Recruitment restriction feature flag - set to true to restrict access
  const isRecruitmentRestricted = false;

  const fetchProfile = async (userId: string) => {
    try {
      const profileData = await profilesService.getProfile();
      
      if (profileData) {
        setProfile(profileData);
      } else {
        const userMeta = session?.user?.user_metadata || {};
        const newProfileData = {
          full_name: userMeta.full_name ?? userMeta.name ?? '',
          avatar_url: userMeta.avatar_url ?? null,
          company: null,
          phone: null,
          company_contact: null
        };
        
        const createdProfile = await profilesService.updateProfile(newProfileData);
        if (createdProfile) {
          setProfile(createdProfile);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchOnboardingData = async (userId: string) => {
    try {
      const data = await onboardingService.getOnboardingStatus(userId);
      setOnboardingData(data);
    } catch (error) {
      console.error('Error fetching onboarding data:', error);
    }
  };

  const refreshOnboardingData = async () => {
    if (user) {
      await fetchOnboardingData(user.id);
    }
  };

  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        console.log('🔄 Initializing auth...');
        
        // Get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (mounted) {
          if (initialSession?.user) {
            console.log('✅ Found existing session');
            setSession(initialSession);
            setUser(initialSession.user);
            // Don't await this to prevent blocking
            fetchProfile(initialSession.user.id);
            fetchOnboardingData(initialSession.user.id);
          } else {
            console.log('❌ No existing session');
          }
          setAuthReady(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setAuthReady(true);
          setIsLoading(false);
        }
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (!mounted) return;
        
        console.log('🔐 Auth state changed:', event, !!currentSession);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user && event === 'SIGNED_IN') {
          console.log('✅ User signed in');
          // Don't await this to prevent blocking
          fetchProfile(currentSession.user.id);
          fetchOnboardingData(currentSession.user.id);
        } else if (!currentSession) {
          setProfile(null);
          setOnboardingData(null);
          if (event === 'SIGNED_OUT') {
            console.log('👋 User signed out');
          }
        }
        
        setAuthReady(true);
        setIsLoading(false);
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Handle redirects based on auth state
  useEffect(() => {
    if (!authReady || isLoading) return;

    const isPublicRoute = location.pathname === '/' || 
                         location.pathname === '/login' || 
                         location.pathname === '/signup' ||
                         location.pathname.startsWith('/apply/');

    if (user && isPublicRoute && location.pathname !== '/') {
      console.log('Authenticated user on auth page, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    } else if (!user && !isPublicRoute) {
      console.log('Unauthenticated user on protected route, redirecting to login');
      navigate('/login', { replace: true });
    }
  }, [user, authReady, isLoading, location.pathname, navigate]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Login successful');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { 
          data: { name },
          emailRedirectTo: REDIRECT_TO
        },
      });
      if (error) throw error;
      toast.success('Registration successful! Check your email.');
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: REDIRECT_TO },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'Google login failed');
    }
  };

  const loginWithLinkedIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: { redirectTo: REDIRECT_TO },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'LinkedIn login failed');
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Logged out');
    } catch (error: any) {
      toast.error(error.message || 'Logout failed');
    }
  };

  const updateProfile = async (data: Partial<ProfileType>) => {
    if (!user) return;
    
    try {
      const updateData = {
        ...data,
        phone: data.phone !== undefined ? data.phone : profile?.phone,
        company_contact: data.company_contact !== undefined ? data.company_contact : profile?.company_contact,
        full_name: data.full_name !== undefined ? data.full_name : profile?.full_name,
        company: data.company !== undefined ? data.company : profile?.company,
        avatar_url: data.avatar_url !== undefined ? data.avatar_url : profile?.avatar_url
      };
      
      const updatedProfile = await profilesService.updateProfile(updateData);
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
    } catch (error: any) {
      toast.error(error.message || 'Profile update failed');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isAuthenticated: !!user,
        isLoading,
        authReady,
        onboardingData,
        hasCompletedOnboarding: onboardingData?.onboardingCompleted || false,
        isRecruitmentRestricted,
        login,
        signup,
        loginWithGoogle,
        loginWithLinkedIn,
        logout,
        updateProfile,
        refreshOnboardingData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
