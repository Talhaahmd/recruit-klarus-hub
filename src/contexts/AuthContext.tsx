import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

  const fetchProfile = async (userId: string) => {
    try {
      console.log('🔍 Fetching profile for user:', userId);
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

      if (error || !data) {
        console.warn('ℹ️ No profile found, attempting to create...');
        const userMeta = session?.user?.user_metadata || {};
        const { error: insertError } = await supabase.from('profiles').insert({
          id: userId,
          full_name: userMeta.full_name ?? '',
          avatar_url: userMeta.avatar_url ?? '',
          company: null,
        });
        if (insertError) {
          console.error('❌ Profile creation failed:', insertError);
        } else {
          const { data: newProfile } = await supabase.from('profiles').select('*').eq('id', userId).single();
          if (newProfile) setProfile(newProfile);
        }
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('❌ Unexpected error fetching profile:', error);
    }
  };

  useEffect(() => {
    console.log('🔄 AuthContext initialized');

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('🔔 Auth state change:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          fetchProfile(currentSession.user.id).finally(() => setIsLoading(false));
          if (event === 'SIGNED_IN') toast.success('Successfully signed in');
        } else {
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('🔍 Checking for existing session...');
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
        },
      });
      if (error) throw error;
      toast.success('Registration successful! Check your email to verify.');
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: REDIRECT_TO },
      });
    } catch (error: any) {
      toast.error(error.message || 'Google login failed');
    }
  };

  const loginWithLinkedIn = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: { redirectTo: REDIRECT_TO },
      });
    } catch (error: any) {
      toast.error(error.message || 'LinkedIn login failed');
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
      toast.error(error.message || 'Logout failed');
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) return;
    try {
      const { error } = await supabase.from('profiles').update(data).eq('id', user.id);
      if (error) throw error;
      setProfile((prev) => (prev ? { ...prev, ...data } : null));
      toast.success('Profile updated');
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
