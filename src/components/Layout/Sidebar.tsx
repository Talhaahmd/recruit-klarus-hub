
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Calendar, 
  FileEdit, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { logout } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, name: 'Dashboard', path: '/dashboard' },
    { icon: Briefcase, name: 'Active Jobs', path: '/jobs' },
    { icon: Users, name: 'Candidates', path: '/candidates' },
    { icon: Calendar, name: 'Calendar', path: '/calendar' },
    { icon: FileEdit, name: 'Build Profile', path: '/build-profile' },
    { icon: Settings, name: 'Settings', path: '/settings' },
  ];

  return (
    <div className="h-screen w-64 bg-white shadow-md flex flex-col glass-dark border-r border-gray-200">
      <div className="p-5 flex justify-center">
        <img 
          src="/lovable-uploads/67d45eae-154d-4a02-a7a5-1f115188b97b.png" 
          alt="Klarus HR Logo" 
          className="h-12 object-contain" 
        />
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-3">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `sidebar-item ${isActive ? 'active' : ''} glow`
              }
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={logout}
          className="sidebar-item text-red-500 hover:bg-red-50 w-full"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
