import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  return (
    <>
      <GlobeAltIcon className="h-6 w-6" aria-hidden="true" />
      
      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="language-menu"
        >
          <div className="py-1" role="none">
            <div
              onClick={() => changeLanguage('pt-BR')}
              className={`${
                i18n.language === 'pt-BR' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
              } block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer`}
              role="menuitem"
            >
              Português (Brasil)
            </div>
            <div
              onClick={() => changeLanguage('en-US')}
              className={`${
                i18n.language === 'en-US' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
              } block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer`}
              role="menuitem"
            >
              English (United States)
            </div>
            <div
              onClick={() => changeLanguage('es')}
              className={`${
                i18n.language === 'es' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
              } block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer`}
              role="menuitem"
            >
              Español
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LanguageSelector;
