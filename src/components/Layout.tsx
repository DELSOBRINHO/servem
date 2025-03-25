import React from 'react';
import Navbar from './Navbar';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();

  // Se não houver usuário autenticado, não renderiza o layout com navbar
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-servem-light">
      <Navbar />
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
