import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Leaf, 
  Users, 
  Building2, 
  Trophy, 
  Settings,
  FileText
} from 'lucide-react';
import clsx from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Environmental', href: '/environmental', icon: Leaf, color: 'text-env-500' },
  { name: 'Social', href: '/social', icon: Users, color: 'text-social-500' },
  { name: 'Governance', href: '/governance', icon: Building2, color: 'text-gov-500' },
  { name: 'Gamification', href: '/gamification', icon: Trophy, color: 'text-game-500' },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar = () => {
  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 text-white">
      <div className="flex h-16 items-center justify-center border-b border-gray-800 px-4">
        <Leaf className="mr-2 h-8 w-8 text-env-500" />
        <span className="text-xl font-bold">EcoSphere</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                clsx(
                  isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'group flex items-center rounded-md px-2 py-2 text-sm font-medium'
                )
              }
            >
              <item.icon
                className={clsx('mr-3 h-5 w-5 flex-shrink-0', item.color || 'text-gray-400 group-hover:text-gray-300')}
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
