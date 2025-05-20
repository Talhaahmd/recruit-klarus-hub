
import React, { useState } from 'react';
import { Header } from '@/components/Layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [companyName, setCompanyName] = useState('Klarus HR');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSaveSettings = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Settings saved successfully');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div>
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
                <label className="block text-sm font-medium text-text-100 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-100 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-100 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <h3 className="font-medium mb-4 text-lg">Notifications</h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="email-notifications"
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="h-4 w-4 text-primary-100 border-gray-300 rounded focus:ring-primary-100"
                />
                <label htmlFor="email-notifications" className="ml-2 block text-sm text-text-100">
                  Email Notifications
                </label>
              </div>
              
              <p className="text-sm text-text-200">
                Receive email notifications for new candidate applications, scheduled interviews, and job posting updates.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleSaveSettings}
              disabled={isLoading}
              className="px-4 py-2 bg-primary-100 text-white rounded-lg flex items-center gap-2 hover:bg-primary-100/90 transition-colors shadow-md shadow-primary-100/20 disabled:opacity-70"
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
                <label className="block text-sm text-text-200">
                  Account ID
                </label>
                <div className="font-medium">{user?.id || '-'}</div>
              </div>
              
              <div>
                <label className="block text-sm text-text-200">
                  Account Type
                </label>
                <div className="font-medium">Free Plan</div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <button className="text-primary-100 hover:underline text-sm">
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
