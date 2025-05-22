
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Profile = {
  id: string;
  full_name: string | null;
  company: string | null;
  avatar_url: string | null;
};

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
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
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Use full URL for OAuth redirects
const REDIRECT_TO =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:3000/dashboard'
    : 'https://klarushr.com/dashboard';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch or create user profile
  const fetchProfile = async (userId: string) => {
    try {
      console.log('🔍 Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Error fetching profile:', error);
        return;
      }

      if (!data) {
        console.log('🆕 No profile found, creating...');
        const userMeta = session?.user?.user_metadata || {};
        const { error: insertError } = await supabase.from('profiles').insert({
          id: userId,
          full_name: userMeta.full_name ?? '',
          avatar_url: userMeta.avatar_url ?? '',
          company: null
        });

        if (insertError) {
          console.error('❌ Failed to auto-insert profile:', insertError);
        } else {
          console.log('✅ New profile created.');
        }
      } else {
        console.log('✅ Profile fetched successfully:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('❌ Unexpected error fetching profile:', error);
    }
  };

  useEffect(() => {
    console.log('🔄 AuthContext initialized');

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('🔔 Auth state change:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          console.log('👤 User authenticated:', currentSession.user.email);
          // Use setTimeout to prevent potential deadlocks with Supabase client
          setTimeout(() => {
            fetchProfile(currentSession.user.id);
          }, 0);
          
          // Show success toast for login events
          if (event === 'SIGNED_IN') {
            toast.success('Successfully signed in');
          }
        } else {
          console.warn('⚠️ Auth event occurred but no user found.');
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('🔍 Supabase getSession result:', currentSession ? 'Session found' : 'No session');
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        console.log('👤 Session found for:', currentSession.user.email);
        fetchProfile(currentSession.user.id);
      } else {
        console.log('⚠️ No session found on load.');
      }

      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Login successful');
    } catch (error: any) {
      console.error('❌ Login failed:', error.message);
      toast.error(error.message || 'Failed to login');
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
          data: { name }
        }
      });
      if (error) throw error;
      toast.success('Registration successful! Please verify your email.');
    } catch (error: any) {
      console.error('❌ Signup failed:', error.message);
      toast.error(error.message || 'Failed to sign up');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      console.log('🌐 Initiating Google login');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: REDIRECT_TO
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('❌ Google login failed:', error.message);
      toast.error(error.message || 'Failed to login with Google');
    }
  };

  const loginWithLinkedIn = async () => {
    try {
      console.log('🌐 Initiating LinkedIn login');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: REDIRECT_TO
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('❌ LinkedIn login failed:', error.message);
      toast.error(error.message || 'Failed to login with LinkedIn');
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
      setSession(null);
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('❌ Logout failed:', error.message);
      toast.error(error.message || 'Failed to logout');
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);
      if (error) throw error;
      setProfile(prev => (prev ? { ...prev, ...data } : null));
      toast.success('Profile updated');
    } catch (error: any) {
      console.error('❌ Profile update failed:', error.message);
      toast.error(error.message || 'Failed to update profile');
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
