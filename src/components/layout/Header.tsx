import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'
import LanguageSelector from '../common/LanguageSelector'

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const { t } = useTranslation()
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)

  return (
    <div className="sticky top-0 z-20 flex-shrink-0 flex h-16 bg-white shadow">
      {/* Botão de menu para mobile */}
      <button
        type="button"
        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-servem-primary md:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Abrir menu</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>
      
      {/* Conteúdo do cabeçalho */}
      <div className="flex-1 px-4 flex items-center justify-between">
        {/* Título da aplicação */}
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-servem-primary">{t('app.title')}</h1>
        </div>
        
        {/* Ícones de ação */}
        <div className="flex items-center space-x-4">
          {/* Seletor de idioma */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="relative inline-flex items-center p-2 rounded-full bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-servem-primary"
              aria-expanded={showLanguageMenu}
            >
              <span className="sr-only">Selecionar idioma</span>
              <LanguageSelector />
            </button>
            
            {/* Menu de idiomas */}
            {showLanguageMenu && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-30">
                <div className="py-1">
                  <div
                    onClick={() => {
                      // Lógica para mudar o idioma para pt-BR
                      setShowLanguageMenu(false)
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Português (Brasil)
                  </div>
                  <div
                    onClick={() => {
                      // Lógica para mudar o idioma para en-US
                      setShowLanguageMenu(false)
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    English (United States)
                  </div>
                  <div
                    onClick={() => {
                      // Lógica para mudar o idioma para es
                      setShowLanguageMenu(false)
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Español
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botão de notificações */}
          <button
            type="button"
            className="bg-white p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-servem-primary"
          >
            <span className="sr-only">Ver notificações</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Perfil do usuário */}
          <div className="relative ml-3">
            <button
              type="button"
              className="flex items-center max-w-xs rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-servem-primary"
              id="user-menu-button"
              aria-expanded="false"
              aria-haspopup="true"
            >
              <span className="sr-only">Abrir menu do usuário</span>
              <div className="h-8 w-8 rounded-full bg-servem-primary text-white flex items-center justify-center">
                <span className="font-medium">U</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header