import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-servem-light flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <h2 className="text-6xl font-extrabold text-servem-primary mb-2">404</h2>
          <p className="text-2xl font-bold text-servem-neutral mb-6">Página não encontrada</p>
          <p className="text-servem-neutral mb-8">
            A página que você está procurando não existe ou foi movida.
          </p>
          <Link to="/">
            <Button variant="primary" className="w-full">
              Voltar para o Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
