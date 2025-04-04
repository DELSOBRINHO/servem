import React from 'react';
import { useTranslation } from 'react-i18next';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex items-center justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-servem-primary"
          id="language-menu"
          aria-expanded="true"
          aria-haspopup="true"
        >
          <GlobeAltIcon className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
          {i18n.language === 'pt-BR' && 'Português'}
          {i18n.language === 'en-US' && 'English'}
          {i18n.language === 'es' && 'Español'}
        </button>
      </div>

      <div
        className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="language-menu"
      >
        <div className="py-1" role="none">
          <button
            onClick={() => changeLanguage('pt-BR')}
            className={`${
              i18n.language === 'pt-BR' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
            } block w-full text-left px-4 py-2 text-sm hover:bg-gray-100`}
            role="menuitem"
          >
            Português (Brasil)
          </button>
          <button
            onClick={() => changeLanguage('en-US')}
            className={`${
              i18n.language === 'en-US' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
            } block w-full text-left px-4 py-2 text-sm hover:bg-gray-100`}
            role="menuitem"
          >
            English (United States)
          </button>
          <button
            onClick={() => changeLanguage('es')}
            className={`${
              i18n.language === 'es' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
            } block w-full text-left px-4 py-2 text-sm hover:bg-gray-100`}
            role="menuitem"
          >
            Español
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
