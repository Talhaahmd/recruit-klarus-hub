
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  Palette,
  Newspaper,
  Lightbulb,
  CreditCard,
  Pin,
  PinOff,
  UserPlus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  isMobileMenuOpen: boolean;
  isPinned: boolean;
  isDesktop: boolean;
  toggleMobileMenu: () => void;
  togglePinned: () => void;
  closeMobileMenu: () => void;
  isExpanded: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  isMobileMenuOpen,
  isPinned,
  isDesktop,
  toggleMobileMenu,
  togglePinned,
  closeMobileMenu,
  isExpanded
}) => {
  const { logout } = useAuth();

  const sidebarSections = [
    {
      title: 'Main',
      items: [
        { icon: LayoutDashboard, name: 'Dashboard', path: '/dashboard' },
      ]
    },
    {
      title: 'Content',
      items: [
        { icon: Palette, name: 'Theme', path: '/themes' },
        { icon: Lightbulb, name: 'Ideas', path: '/ideas' },
      ]
    },
    {
      title: 'Recruitment',
      items: [
        { icon: Users, name: 'Candidates', path: '/candidates' },
        { icon: Briefcase, name: 'Active Jobs', path: '/jobs' },
        { icon: UserPlus, name: 'Leads', path: '/leads' },
      ]
    },
    {
      title: 'Settings',
      items: [
        { icon: Settings, name: 'Profile settings', path: '/settings' },
        { icon: CreditCard, name: 'Billings', path: '/settings/billing' },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && !isDesktop && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30" 
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`
        h-screen shadow-md flex flex-col glass-dark border-r border-gray-200 dark:border-gray-700
        bg-gray-100 dark:bg-gray-800 
        transition-all duration-300 ease-in-out
        fixed lg:relative z-40 lg:z-auto 
        ${isDesktop ? (isExpanded ? 'w-64' : 'w-20') : 'w-72'}
        ${isMobileMenuOpen && !isDesktop ? 'translate-x-0' : (!isDesktop ? '-translate-x-full' : '')}
      `}>
        {/* Header */}
        <div className={`flex items-center h-16 sm:h-20 border-b border-gray-200 dark:border-gray-700 px-4
                         ${isDesktop ? (isExpanded ? 'justify-between' : 'justify-center') : 'justify-between'}`}>
          {/* Logo */}
          {(isExpanded || !isDesktop) && (
            <img 
              src="https://media.licdn.com/dms/image/v2/D4D0BAQFDM9EHPi7Ytw/company-logo_200_200/B4DZcS5YkIGYAM-/0/1748368723047/klarushr_logo?e=1753920000&v=beta&t=XHn_4UOG1fh73hgQQ9sxGxyoXACiu8PpgDqsjpgvW9w" 
              alt="Klarus HR Logo" 
              className="h-8 sm:h-10 object-contain"
            />
          )}
          
          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Pin Toggle Button - Desktop only */}
            {isDesktop && isExpanded && (
              <button
                onClick={togglePinned}
                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700" 
                aria-label={isPinned ? "Unpin sidebar" : "Pin sidebar"}
              >
                {isPinned ? (
                  <PinOff size={18} className="text-gray-600 dark:text-gray-300" />
                ) : (
                  <Pin size={18} className="text-gray-600 dark:text-gray-300" />
                )}
              </button>
            )}
            
            {/* Close Button - Mobile only */}
            {!isDesktop && (
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 lg:hidden"
                aria-label="Close menu"
              >
                <X size={18} className="text-gray-600 dark:text-gray-300" />
              </button>
            )}
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav className="space-y-1">
            {sidebarSections.map((section) => (
              <div key={section.title} className="mb-4">
                {(isExpanded || !isDesktop) && section.title && (
                  <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {section.title}
                  </h3>
                )}
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={!isDesktop ? closeMobileMenu : undefined}
                    title={item.name}
                    className={({ isActive }) => 
                      `sidebar-item ${isActive ? 'active' : ''} glow ${(!isExpanded && isDesktop) ? 'justify-center px-2' : 'px-3'}`
                    }
                  >
                    <item.icon size={(!isExpanded && isDesktop) ? 20 : 18} />
                    {(isExpanded || !isDesktop) && <span className="text-sm sm:text-base">{item.name}</span>}
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>
        </div>
        
        {/* Footer */}
        <div className={`p-4 border-t border-gray-200 dark:border-gray-700 ${(!isExpanded && isDesktop) ? 'flex justify-center' : ''}`}>
          <button 
            onClick={() => {
              logout();
              if (!isDesktop) closeMobileMenu();
            }}
            title="Logout"
            className={`sidebar-item text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 w-full ${(!isExpanded && isDesktop) ? 'justify-center px-2' : 'px-3'}`}
          >
            <LogOut size={(!isExpanded && isDesktop) ? 20 : 18} />
            {(isExpanded || !isDesktop) && <span className="text-sm sm:text-base">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
