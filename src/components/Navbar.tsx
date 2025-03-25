import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-servem-primary text-xl font-bold">
                SerVem
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="border-transparent text-servem-neutral hover:border-servem-primary hover:text-servem-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/volunteers"
                className="border-transparent text-servem-neutral hover:border-servem-primary hover:text-servem-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Voluntários
              </Link>
              <Link
                to="/events"
                className="border-transparent text-servem-neutral hover:border-servem-primary hover:text-servem-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Eventos
              </Link>
              <Link
                to="/settings"
                className="border-transparent text-servem-neutral hover:border-servem-primary hover:text-servem-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Configurações
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="ml-3 relative">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-servem-primary flex items-center justify-center text-white">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="ml-2 text-sm text-servem-neutral">{user?.email?.split('@')[0] || 'Usuário'}</span>
                <button
                  onClick={handleSignOut}
                  className="ml-4 text-sm text-servem-neutral hover:text-servem-primary"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-servem-neutral hover:text-servem-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-servem-primary"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Abrir menu principal</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="border-transparent text-servem-neutral hover:bg-gray-50 hover:border-servem-primary hover:text-servem-primary block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/volunteers"
              className="border-transparent text-servem-neutral hover:bg-gray-50 hover:border-servem-primary hover:text-servem-primary block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Voluntários
            </Link>
            <Link
              to="/events"
              className="border-transparent text-servem-neutral hover:bg-gray-50 hover:border-servem-primary hover:text-servem-primary block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Eventos
            </Link>
            <Link
              to="/settings"
              className="border-transparent text-servem-neutral hover:bg-gray-50 hover:border-servem-primary hover:text-servem-primary block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Configurações
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-servem-primary flex items-center justify-center text-white">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-servem-neutral">
                  {user?.email?.split('@')[0] || 'Usuário'}
                </div>
                <div className="text-sm font-medium text-gray-500">{user?.email}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <button
                onClick={() => {
                  handleSignOut();
                  setIsMenuOpen(false);
                }}
                className="block px-4 py-2 text-base font-medium text-servem-neutral hover:text-servem-primary hover:bg-gray-100 w-full text-left"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
