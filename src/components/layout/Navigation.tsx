import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  UserGroupIcon, 
  CalendarIcon,
  ChartBarIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Voluntários', href: '/volunteers', icon: UserGroupIcon },
  { name: 'Eventos', href: '/events', icon: CalendarIcon },
  { name: 'Relatórios', href: '/reports', icon: ChartBarIcon },
  { name: 'Configurações', href: '/settings', icon: Cog6ToothIcon },
];

const Navigation: React.FC = () => {
  return (
    <nav className="flex-1 px-2 py-4 space-y-1">
      {navigation.map((item) => (
        <NavLink
          key={item.name}
          to={item.href}
          className={({ isActive }) =>
            isActive
              ? 'bg-servem-primary text-white group flex items-center px-3 py-2 text-sm font-medium rounded-md'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-3 py-2 text-sm font-medium rounded-md'
          }
          end={item.href === '/'}
        >
          {({ isActive }) => (
            <>
              <item.icon
                className={`${
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                } mr-3 flex-shrink-0 h-5 w-5`}
                aria-hidden="true"
              />
              {item.name}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;
