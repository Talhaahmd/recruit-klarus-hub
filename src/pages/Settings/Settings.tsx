
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Save, Moon, Sun } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/contexts/ThemeContext';
import { Switch } from '@/components/ui/switch';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyContact, setCompanyContact] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  
  useEffect(() => {
    if (user) {
      // Use metadata to get the name if available
      const userName = user.user_metadata?.full_name || user.user_metadata?.name || '';
      setName(userName);
      setEmail(user.email || '');
      loadUserProfile();
    }
  }, [user]);
  
  const loadUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error('Error loading profile:', error);
        return;
      }
      
      if (data) {
        setProfileId(data.id);
        setName(data.full_name || name);
        setCompanyName(data.company || '');
        setPhone(data.phone || '');
        setCompanyContact(data.company_contact || '');
      }
    } catch (err) {
      console.error('Unexpected error loading profile:', err);
    }
  };
  
  const handleSaveSettings = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Update user metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { full_name: name }
      });
      
      if (metadataError) {
        console.error('Error updating user metadata:', metadataError);
        toast.error('Failed to update user information');
        setIsLoading(false);
        return;
      }
      
      // Update or insert profile
      const profileData = {
        id: user.id,
        full_name: name,
        company: companyName,
        phone,
        company_contact: companyContact,
        updated_at: new Date().toISOString()
      };
      
      let error;
      
      if (profileId) {
        // Update existing profile
        const result = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', profileId);
          
        error = result.error;
      } else {
        // Insert new profile
        const result = await supabase
          .from('profiles')
          .insert([profileData]);
          
        error = result.error;
      }
      
      if (error) {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile information');
      } else {
        toast.success('Settings saved successfully');
        loadUserProfile(); // Reload profile data
      }
    } catch (err) {
      console.error('Unexpected error saving settings:', err);
      toast.error('An unexpected error occurred');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="transition-colors">
      <Header 
        title="Settings" 
        subtitle="Manage your account and preferences."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="glass-card p-6">
            <h3 className="font-medium mb-4 text-lg">Account Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:bg-dark-bg-300 dark:border-dark-bg-300 dark:text-dark-text-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 dark:bg-dark-bg-300 dark:border-dark-bg-300 dark:text-dark-text-100"
                />
                <p className="text-xs text-gray-500 mt-1 dark:text-dark-text-200">Email cannot be changed</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:bg-dark-bg-300 dark:border-dark-bg-300 dark:text-dark-text-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:bg-dark-bg-300 dark:border-dark-bg-300 dark:text-dark-text-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Company Contact
                </label>
                <input
                  type="text"
                  value={companyContact}
                  onChange={(e) => setCompanyContact(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:bg-dark-bg-300 dark:border-dark-bg-300 dark:text-dark-text-100"
                  placeholder="Company website or contact email"
                />
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <h3 className="font-medium mb-4 text-lg">Appearance</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Dark Mode</h4>
                  <p className="text-sm text-gray-500 dark:text-dark-text-200">
                    Toggle between light and dark theme
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4 text-amber-500" />
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                    className="data-[state=checked]:bg-dark-primary-100"
                  />
                  <Moon className="h-4 w-4 text-indigo-400" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleSaveSettings}
              disabled={isLoading}
              className="px-4 py-2 bg-primary-100 dark:bg-dark-primary-100 text-white rounded-lg flex items-center gap-2 hover:bg-primary-100/90 dark:hover:bg-dark-primary-100/90 transition-colors shadow-md shadow-primary-100/20 dark:shadow-dark-primary-100/20 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        <div>
          <div className="glass-card p-6">
            <h3 className="font-medium mb-4 text-lg">Account Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 dark:text-dark-text-200">
                  Account ID
                </label>
                <div className="font-medium dark:text-dark-text-100">{user?.id || '-'}</div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-500 dark:text-dark-text-200">
                  Account Type
                </label>
                <div className="font-medium dark:text-dark-text-100">Free Plan</div>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-dark-bg-300">
                <button className="text-primary-100 dark:text-dark-accent-200 hover:underline text-sm">
                  Upgrade to Premium
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
