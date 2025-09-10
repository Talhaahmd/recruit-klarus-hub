import React from 'react';
import { User, Users } from 'lucide-react';
import { Button } from './button';
import type { UserRole } from '@/types/onboarding';

interface DashboardTabsProps {
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  className?: string;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ 
  activeRole, 
  onRoleChange, 
  className = '' 
}) => {
  const tabs = [
    {
      id: 'personal' as UserRole,
      label: 'Personal',
      icon: User,
      description: 'Job search & applications'
    },
    {
      id: 'hr' as UserRole,
      label: 'HR',
      icon: Users,
      description: 'Recruitment & management'
    }
  ];

  return (
    <div className={`flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg ${className}`}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeRole === tab.id;
        
        return (
          <Button
            key={tab.id}
            variant={isActive ? "default" : "ghost"}
            onClick={() => onRoleChange(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all duration-200
              ${isActive 
                ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              }
            `}
          >
            <Icon size={18} />
            <div className="flex flex-col items-start">
              <span className="font-medium text-sm">{tab.label}</span>
              <span className="text-xs opacity-75">{tab.description}</span>
            </div>
          </Button>
        );
      })}
    </div>
  );
};

export default DashboardTabs;
