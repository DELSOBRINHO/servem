import React, { useState, useEffect } from 'react';
import { useNotificationContext } from '../../contexts/NotificationContext';
import { useLoading } from '../../hooks/useLoading';
import { supabase } from '/src/services/supabase.ts';
import { 
  Cog6ToothIcon, 
  UserGroupIcon, 
  BellIcon, 
  GlobeAltIcon,
  PaintBrushIcon
} from '@heroicons/react/24/outline';

// Tipos para as configurações
interface AppSettings {
  churchName: string;
  churchLogo: string | null;
  primaryColor: string;
  accentColor: string;
  defaultLanguage: string;
  emailNotifications: boolean;
  departments: string[];
  roles: string[];
}

const defaultSettings: AppSettings = {
  churchName: 'Igreja',
  churchLogo: null,
  primaryColor: '#1F2937',
  accentColor: '#F59E0B',
  defaultLanguage: 'pt-BR',
  emailNotifications: false,
  departments: ['Louvor', 'Mídia', 'Recepção', 'Infantil', 'Limpeza'],
  roles: ['Líder', 'Auxiliar', 'Voluntário']
};

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [newDepartment, setNewDepartment] = useState('');
  const [newRole, setNewRole] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const { success, error } = useNotificationContext();
  const { isLoading, withLoading } = useLoading(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        await withLoading(async () => {
          const { data, error: fetchError } = await supabase
            .from('settings')
            .select('*')
            .single();

          if (fetchError) {
            console.error('Error fetching settings:', fetchError);
            // If no settings exist yet, we'll use the defaults
            return;
          }

          if (data) {
            setSettings({
              ...defaultSettings,
              ...data
            });
          }
        });
      } catch (err) {
        console.error('Error in settings fetch:', err);
        error('Erro ao carregar configurações');
      }
    };

    fetchSettings();
  }, []);

  const saveSettings = async () => {
    try {
      await withLoading(async () => {
        // Check if settings record exists
        const { data: existingSettings } = await supabase
          .from('settings')
          .select('id')
          .single();

        let result;
        
        if (existingSettings) {
          // Update existing settings
          result = await supabase
            .from('settings')
            .update(settings)
            .eq('id', existingSettings.id);
        } else {
          // Insert new settings
          result = await supabase
            .from('settings')
            .insert([settings]);
        }

        if (result.error) {
          throw new Error(result.error.message);
        }

        success('Configurações salvas com sucesso!');
      });
    } catch (err) {
      console.error('Error saving settings:', err);
      error('Erro ao salvar configurações');
    }
  };

  const handleAddDepartment = () => {
    if (newDepartment.trim() && !settings.departments.includes(newDepartment.trim())) {
      setSettings({
        ...settings,
        departments: [...settings.departments, newDepartment.trim()]
      });
      setNewDepartment('');
    }
  };

  const handleRemoveDepartment = (dept: string) => {
    setSettings({
      ...settings,
      departments: settings.departments.filter(d => d !== dept)
    });
  };

  const handleAddRole = () => {
    if (newRole.trim() && !settings.roles.includes(newRole.trim())) {
      setSettings({
        ...settings,
        roles: [...settings.roles, newRole.trim()]
      });
      setNewRole('');
    }
  };

  const handleRemoveRole = (role: string) => {
    setSettings({
      ...settings,
      roles: settings.roles.filter(r => r !== role)
    });
  };

  const tabs = [
    { id: 'general', name: 'Geral', icon: Cog6ToothIcon },
    { id: 'appearance', name: 'Aparência', icon: PaintBrushIcon },
    { id: 'departments', name: 'Departamentos', icon: UserGroupIcon },
    { id: 'notifications', name: 'Notificações', icon: BellIcon },
    { id: 'language', name: 'Idioma', icon: GlobeAltIcon },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Configurações</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gerencie as configurações do sistema
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-servem-primary"></div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-servem-accent text-servem-accent'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <tab.icon className="h-5 w-5 inline-block mr-2 -mt-0.5" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="churchName" className="block text-sm font-medium text-gray-700">
                    Nome da Igreja
                  </label>
                  <input
                    type="text"
                    name="churchName"
                    id="churchName"
                    value={settings.churchName}
                    onChange={(e) => setSettings({ ...settings, churchName: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-servem-primary focus:border-servem-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="churchLogo" className="block text-sm font-medium text-gray-700">
                    Logo da Igreja
                  </label>
                  <div className="mt-1 flex items-center">
                    {settings.churchLogo ? (
                      <div className="mr-3 h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                        <img src={settings.churchLogo} alt="Logo" className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="mr-3 h-12 w-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                        <Cog6ToothIcon className="h-8 w-8 text-gray-300" />
                      </div>
                    )}
                    <button
                      type="button"
                      className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-servem-primary"
                    >
                      Alterar
                    </button>
                    {settings.churchLogo && (
                      <button
                        type="button"
                        onClick={() => setSettings({ ...settings, churchLogo: null })}
                        className="ml-2 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-red-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
                    Cor Primária
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="color"
                      name="primaryColor"
                      id="primaryColor"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="h-8 w-8 border border-gray-300 rounded-md shadow-sm"
                    />
                    <input
                      type="text"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="ml-2 block w-full max-w-xs border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-servem-primary focus:border-servem-primary sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="accentColor" className="block text-sm font-medium text-gray-700">
                    Cor de Destaque
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="color"
                      name="accentColor"
                      id="accentColor"
                      value={settings.accentColor}
                      onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                      className="h-8 w-8 border border-gray-300 rounded-md shadow-sm"
                    />
                    <input
                      type="text"
                      value={settings.accentColor}
                      onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                      className="ml-2 block w-full max-w-xs border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-servem-primary focus:border-servem-primary sm:text-sm"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Pré-visualização</h3>
                  <div className="p-4 border border-gray-200 rounded-md">
                    <div className="flex space-x-4">
                      <div 
                        className="h-12 w-24 rounded-md flex items-center justify-center text-white text-sm font-medium"
                        style={{ backgroundColor: settings.primaryColor }}
                      >
                        Primária
                      </div>
                      <div 
                        className="h-12 w-24 rounded-md flex items-center justify-center text-white text-sm font-medium"
                        style={{ backgroundColor: settings.accentColor }}
                      >
                        Destaque
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Departments Settings */}
            {activeTab === 'departments' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Departamentos</h3>
                  <div className="mt-1 border border-gray-200 rounded-md overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                      {settings.departments.map((dept, index) => (
                        <li key={index} className="px-4 py-3 flex items-center justify-between">
                          <span className="text-sm text-gray-900">{dept}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDepartment(dept)}
                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                          >
                            Remover
                          </button>
                        </li>
                      ))}
                      {settings.departments.length === 0 && (
                        <li className="px-4 py-3 text-sm text-gray-500 text-center">
                          Nenhum departamento cadastrado
                        </li>
                      )}
                    </ul>
                  </div>
                  <div className="mt-3 flex">
                    <input
                      type="text"
                      value={newDepartment}
                      onChange={(e) => setNewDepartment(e.target.value)}
                      placeholder="Novo departamento"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-servem-primary focus:border-servem-primary sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleAddDepartment}
                      className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-servem-primary hover:bg-servem-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-servem-primary"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Funções</h3>
                  <div className="mt-1 border border-gray-200 rounded-md overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                      {settings.roles.map((role, index) => (
                        <li key={index} className="px-4 py-3 flex items-center justify-between">
                          <span className="text-sm text-gray-900">{role}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveRole(role)}
                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                          >
                            Remover
                          </button>
                        </li>
                      ))}
                      {settings.roles.length === 0 && (
                        <li className="px-4 py-3 text-sm text-gray-500 text-center">
                          Nenhuma função cadastrada
                        </li>
                      )}
                    </ul>
                  </div>
                  <div className="mt-3 flex">
                    <input
                      type="text"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      placeholder="Nova função"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-servem-primary focus:border-servem-primary sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleAddRole}
                      className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-servem-primary hover:bg-servem-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-servem-primary"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="flex items-center">
                  <input
                    id="emailNotifications"
                    name="emailNotifications"
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                    className="h-4 w-4 text-servem-primary focus:ring-servem-primary border-gray-300 rounded"
                  />
                  <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-900">
                    Ativar notificações por e-mail
                  </label>
                </div>
                <div className="text-sm text-gray-500 pl-6">
                  Quando ativado, o sistema enviará e-mails para os voluntários sobre novos eventos e escalas.
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Configurações de E-mail</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Estas configurações serão usadas apenas se as notificações por e-mail estiverem ativadas.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="emailFrom" className="block text-sm font-medium text-gray-700">
                        E-mail de Origem
                      </label>
                      <input
                        type="email"
                        id="emailFrom"
                        placeholder="igreja@exemplo.com"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-servem-primary focus:border-servem-primary sm:text-sm"
                        disabled={!settings.emailNotifications}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="emailSubject" className="block text-sm font-medium text-gray-700">
                        Assunto Padrão
                      </label>
                      <input
                        type="text"
                        id="emailSubject"
                        placeholder="Notificação de Evento - {nome_evento}"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-servem-primary focus:border-servem-primary sm:text-sm"
                        disabled={!settings.emailNotifications}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Language Settings */}
            {activeTab === 'language' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                    Idioma Padrão
                  </label>
                  <select
                    id="language"
                    name="language"
                    value={settings.defaultLanguage}
                    onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value })}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-servem-primary focus:border-servem-primary sm:text-sm rounded-md"
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">English (United States)</option>
                    <option value="es">Español</option>
                  </select>
                </div>
                
                <div className="pt-4 text-sm text-gray-500">
                  <p>
                    O idioma selecionado será usado como padrão para todos os usuários do sistema.
                    Cada usuário poderá alterar o idioma nas suas configurações pessoais.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 pt-5 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={saveSettings}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-servem-primary hover:bg-servem-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-servem-primary"
              >
                Salvar Configurações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
