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
  authReady: boolean; // Add this new property
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
    let mounted = true;
    
    // First set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return;
        
        console.log('🔔 Auth state change:', event);
        
        // Update state immediately with synchronous operations
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          console.log('✅ Session updated from auth state change:', currentSession.user.email);
          
          // Check for OAuth redirect completion
          const oauthRedirectProcessed = sessionStorage.getItem('oauth_redirect_processed');
          if (oauthRedirectProcessed && event === 'SIGNED_IN') {
            console.log('🎉 OAuth sign-in completed successfully');
            toast.success('Successfully signed in with ' + (currentSession.user?.app_metadata?.provider || 'OAuth'));
          }
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setProfile(null);
          console.log('👋 User signed out');
        }
        
        // Use setTimeout to avoid potential auth state deadlocks
        if (currentSession?.user && event === 'SIGNED_IN') {
          setTimeout(() => {
            if (mounted) {
              fetchProfile(currentSession.user.id).finally(() => {
                if (mounted) {
                  setIsLoading(false);
                  setInitialSessionChecked(true);
                }
              });
            }
          }, 0);
        } else {
          if (mounted) {
            setIsLoading(false);
            setInitialSessionChecked(true);
          }
        }
      }
    );

    // Then check for an existing session
    const checkForExistingSession = async () => {
      try {
        console.log('🔍 Checking for existing session...');
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession?.user) {
          console.log('✅ Found existing session for:', currentSession.user.email);
          if (mounted) {
            setSession(currentSession);
            setUser(currentSession.user);
            
            // Fetch profile after obtaining session
            fetchProfile(currentSession.user.id).finally(() => {
              if (mounted) {
                setIsLoading(false);
                setInitialSessionChecked(true);
              }
            });
          }
        } else {
          console.log('ℹ️ No existing session found');
          if (mounted) {
            setIsLoading(false);
            setInitialSessionChecked(true);
          }
        }
      } catch (error) {
        console.error('❌ Error checking session:', error);
        if (mounted) {
          setIsLoading(false);
          setInitialSessionChecked(true);
        }
      }
    };
    
    // Check for existing session with a slight delay to ensure
    // onAuthStateChange is registered first
    setTimeout(() => {
      checkForExistingSession();
    }, 10);

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Check for access_token in URL hash on initial load and session refresh
  useEffect(() => {
    if (initialSessionChecked) {
      const hash = window.location.hash;
      
      // If we have an access_token but no user yet, try refreshing the session
      if (hash && hash.includes('access_token') && !user) {
        console.log('🔄 Found access_token in URL, refreshing session state...');
        
        // Give supabase time to process the token
        setTimeout(() => {
          supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
            if (currentSession?.user) {
              console.log('✅ Session refreshed after access_token detected');
              setSession(currentSession);
              setUser(currentSession.user);
              fetchProfile(currentSession.user.id);
              
              // OAuth login completed
              toast.success('Successfully signed in!');
            }
          });
        }, 100);
      }
    }
  }, [initialSessionChecked, user]);

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
      console.log('🔄 Starting Google login...');
      sessionStorage.setItem('processing_oauth_login', 'true');
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { 
          redirectTo: REDIRECT_TO,
          skipBrowserRedirect: false,
        },
      });
    } catch (error: any) {
      console.error('❌ Google login error:', error);
      sessionStorage.removeItem('processing_oauth_login');
      toast.error(error.message || 'Google login failed');
    }
  };

  const loginWithLinkedIn = async () => {
    try {
      console.log('🔄 Starting LinkedIn login...');
      sessionStorage.setItem('processing_oauth_login', 'true');
      await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: { 
          redirectTo: REDIRECT_TO,
          skipBrowserRedirect: false,
        },
      });
    } catch (error: any) {
      console.error('❌ LinkedIn login error:', error);
      sessionStorage.removeItem('processing_oauth_login');
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
