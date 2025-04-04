import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  HomeIcon,
  UserGroupIcon,
  CalendarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { t } = useTranslation();

  const navigation = [
    { name: t('navigation.dashboard'), href: '/', icon: HomeIcon },
    { name: t('navigation.volunteers'), href: '/volunteers', icon: UserGroupIcon },
    { name: t('navigation.events'), href: '/events', icon: CalendarIcon },
    { name: t('navigation.reports'), href: '/reports', icon: ChartBarIcon },
    { name: t('navigation.settings'), href: '/settings', icon: Cog6ToothIcon },
  ];

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 flex z-40 md:hidden ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        } transition-opacity ease-linear duration-300`}
      >
        <div
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 ${
            sidebarOpen ? 'opacity-100' : 'opacity-0'
          } transition-opacity ease-linear duration-300`}
          onClick={() => setSidebarOpen(false)}
        ></div>

        <div
          className={`relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-servem-primary transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition ease-in-out duration-300`}
        >
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-shrink-0 flex items-center px-4">
            <img
              className="h-8 w-auto"
              src="/logo.svg"
              alt="ServeM"
            />
            <span className="ml-2 text-white text-xl font-bold">ServeM</span>
          </div>
          <div className="mt-5 flex-1 h-0 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    location.pathname === item.href
                      ? 'bg-servem-primary-dark text-white'
                      : 'text-white hover:bg-servem-primary-light'
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                >
                  <item.icon
                    className="mr-4 flex-shrink-0 h-6 w-6 text-servem-primary-light"
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-servem-primary">
              <img
                className="h-8 w-auto"
                src="/logo.svg"
                alt="ServeM"
              />
              <span className="ml-2 text-white text-xl font-bold">ServeM</span>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto bg-servem-primary">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      location.pathname === item.href
                        ? 'bg-servem-primary-dark text-white'
                        : 'text-white hover:bg-servem-primary-light'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <item.icon
                      className="mr-3 flex-shrink-0 h-6 w-6 text-servem-primary-light"
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
