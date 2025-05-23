import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Profile, profilesService } from '@/services/profilesService';

// Profile type
type Profile = {
  id: string;
  full_name: string | null;
  company: string | null;
  avatar_url: string | null;
};

// Context type
type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authReady: boolean; // Added this property
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithLinkedIn: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

const REDIRECT_TO =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:3000/dashboard'
    : `${window.location.origin}/dashboard`;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [initialSessionChecked, setInitialSessionChecked] = useState<boolean>(false);

  // Check if we're in an OAuth redirect scenario
  const isOAuthRedirect = () => {
    // Check for access token in the URL hash or if we were processing OAuth
    return window.location.hash.includes('access_token') || 
           sessionStorage.getItem('processing_oauth_login') === 'true';
  };

  const fetchProfile = async (userId: string) => {
    try {
      const profileData = await profilesService.getProfile();
      
      if (profileData) {
        setProfile(profileData);
      } else {
        // If no profile exists, create one with basic info from auth
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

  useEffect(() => {
    console.log('🔄 AuthProvider initializing auth state...');
    
    // First set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('🔐 Auth state changed:', event, !!currentSession);
        
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);

          if (event === 'SIGNED_IN') {
            console.log('✅ User signed in:', currentSession.user.email);
            
            // Clear OAuth processing flag
            if (sessionStorage.getItem('processing_oauth_login')) {
              console.log('🔄 Processing OAuth redirect...');
              sessionStorage.removeItem('processing_oauth_login');
              toast.success('Signed in successfully');
            }
            
            // Fetch profile after a slight delay to avoid potential deadlocks
            setTimeout(() => {
              fetchProfile(currentSession.user.id);
            }, 0);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out');
          setSession(null);
          setUser(null);
          setProfile(null);
        }

        setIsLoading(false);
        setInitialSessionChecked(true);
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('📝 Initial session check:', !!currentSession);
        
        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Only fetch profile if not in an OAuth redirect
          // This prevents duplicate profile fetches during auth state changes
          if (!isOAuthRedirect()) {
            await fetchProfile(currentSession.user.id);
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
        setInitialSessionChecked(true);
      }
    };

    initializeAuth();

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting to login with email:', email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Login error:', error);
        throw error;
      }
      
      console.log('Login successful, session:', !!data.session);
      toast.success('Login successful');
    } catch (error: any) {
      console.error('Login failed:', error.message);
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting to sign up with email:', email);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      
      if (error) {
        console.error('Signup error:', error);
        throw error;
      }
      
      console.log('Signup successful');
      toast.success('Registration successful! Check your email.');
    } catch (error: any) {
      console.error('Signup failed:', error.message);
      toast.error(error.message || 'Signup failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      console.log('Initiating Google login...');
      sessionStorage.setItem('processing_oauth_login', 'true');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: REDIRECT_TO },
      });
      
      if (error) {
        console.error('Google login error:', error);
        throw error;
      }
      
      console.log('Google login initiated, URL:', data.url);
    } catch (error: any) {
      console.error('Google login failed:', error.message);
      toast.error(error.message || 'Google login failed');
      sessionStorage.removeItem('processing_oauth_login');
    }
  };

  const loginWithLinkedIn = async () => {
    try {
      console.log('Initiating LinkedIn login...');
      sessionStorage.setItem('processing_oauth_login', 'true');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: { redirectTo: REDIRECT_TO },
      });
      
      if (error) {
        console.error('LinkedIn login error:', error);
        throw error;
      }
      
      console.log('LinkedIn login initiated, URL:', data.url);
    } catch (error: any) {
      console.error('LinkedIn login failed:', error.message);
      toast.error(error.message || 'LinkedIn login failed');
      sessionStorage.removeItem('processing_oauth_login');
    }
  };

  const logout = async () => {
    try {
      console.log('Attempting to log out...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
      
      setUser(null);
      setProfile(null);
      setSession(null);
      console.log('Logout successful');
      toast.success('Logged out');
    } catch (error: any) {
      console.error('Logout failed:', error.message);
      toast.error(error.message || 'Logout failed');
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) {
      console.error('No user to update profile for');
      return;
    }
    
    try {
      const updatedProfile = await profilesService.updateProfile(data);
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
    } catch (error: any) {
      console.error('Profile update failed:', error.message);
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
        authReady: initialSessionChecked, // Map initialSessionChecked to authReady
        login,
        signup,
        loginWithGoogle,
        loginWithLinkedIn,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
