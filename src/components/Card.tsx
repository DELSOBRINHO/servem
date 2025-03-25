import React from 'react';
import { Link } from 'react-router-dom';

interface CardProps {
  title: string;
  date: string;
  description: string;
  status: string;
  link: string;
}

const Card: React.FC<CardProps> = ({ title, date, description, status, link }) => {
  return (
    <Link to={link} className="block">
      <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-servem-primary truncate">
              {title}
            </h3>
            {status === 'Confirmado' ? (
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                Confirmado
              </span>
            ) : (
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                Pendente
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-servem-neutral">
            {date}
          </p>
          <p className="mt-3 text-sm text-servem-neutral line-clamp-2">
            {description}
          </p>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end">
          <span className="text-sm font-medium text-servem-primary">Ver detalhes</span>
        </div>
      </div>
    </Link>
  );
};

export default Card;
