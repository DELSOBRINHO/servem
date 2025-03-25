import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

interface ChurchSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  notificationEmail: boolean;
  notificationSMS: boolean;
  notificationWhatsApp: boolean;
  defaultReminderTime: number;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<ChurchSettings>({
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    logo: '',
    primaryColor: '#4F46E5',
    secondaryColor: '#10B981',
    notificationEmail: true,
    notificationSMS: false,
    notificationWhatsApp: true,
    defaultReminderTime: 24
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'notifications'>('general');

  useEffect(() => {
    // Simulação de carregamento de dados - em uma aplicação real, você faria uma chamada à API
    const loadSettings = async () => {
      // Simular um atraso de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados simulados
      const settingsData: ChurchSettings = {
        name: 'Igreja Adventista Central',
        address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
        phone: '(11) 3456-7890',
        email: 'contato@iasd-central.org',
        website: 'www.iasd-central.org',
        logo: '/logo.png',
        primaryColor: '#4F46E5',
        secondaryColor: '#10B981',
        notificationEmail: true,
        notificationSMS: false,
        notificationWhatsApp: true,
        defaultReminderTime: 24
      };
      
      setSettings(settingsData);
      setIsLoading(false);
    };
    
    loadSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      // Simulação de envio para API - em uma aplicação real, você faria uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Configurações atualizadas:', settings);
      
      setSuccessMessage('Configurações salvas com sucesso!');
      
      // Limpar a mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-servem-light">
      <Navbar />
      
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-servem-primary">Configurações do Sistema</h1>
        </div>
      </header>
      
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {isLoading ? (
              <div className="text-center py-10">
                <svg className="animate-spin h-10 w-10 text-servem-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-2 text-servem-neutral">Carregando configurações...</p>
              </div>
            ) : (
              <>
                {successMessage && (
                  <div className="rounded-md bg-green-50 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">
                          {successMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="border-b border-gray-200">
                    <nav className="-mb-px flex" aria-label="Tabs">
                      <button
                        onClick={() => setActiveTab('general')}
                        className={`${
                          activeTab === 'general'
                            ? 'border-servem-primary text-servem-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                      >
                        Geral
                      </button>
                      <button
                        onClick={() => setActiveTab('appearance')}
                        className={`${
                          activeTab === 'appearance'
                            ? 'border-servem-primary text-servem-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                      >
                        Aparência
                      </button>
                      <button
                        onClick={() => setActiveTab('notifications')}
                        className={`${
                          activeTab === 'notifications'
                            ? 'border-servem-primary text-servem-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                      >
                        Notificações
                      </button>
                    </nav>
                  </div>

                  <form onSubmit={handleSubmit}>
                    {activeTab === 'general' && (
                      <div className="px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                          <div className="sm:col-span-4">
                            <label htmlFor="name" className="block text-sm font-medium text-servem-neutral">
                              Nome da Igreja
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="name"
                                id="name"
                                value={settings.name}
                                onChange={handleChange}
                                className="shadow-sm focus:ring-servem-primary focus:border-servem-primary block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-6">
                            <label htmlFor="address" className="block text-sm font-medium text-servem-neutral">
                              Endereço
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="address"
                                id="address"
                                value={settings.address}
                                onChange={handleChange}
                                className="shadow-sm focus:ring-servem-primary focus:border-servem-primary block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label htmlFor="phone" className="block text-sm font-medium text-servem-neutral">
                              Telefone
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="phone"
                                id="phone"
                                value={settings.phone}
                                onChange={handleChange}
                                className="shadow-sm focus:ring-servem-primary focus:border-servem-primary block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label htmlFor="email" className="block text-sm font-medium text-servem-neutral">
                              Email
                            </label>
                            <div className="mt-1">
                              <input
                                type="email"
                                name="email"
                                id="email"
                                value={settings.email}
                                onChange={handleChange}
                                className="shadow-sm focus:ring-servem-primary focus:border-servem-primary block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label htmlFor="website" className="block text-sm font-medium text-servem-neutral">
                              Website
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="website"
                                id="website"
                                value={settings.website}
                                onChange={handleChange}
                                className="shadow-sm focus:ring-servem-primary focus:border-servem-primary block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-6">
                            <label htmlFor="logo" className="block text-sm font-medium text-servem-neutral">
                              Logo da Igreja
                            </label>
                            <div className="mt-1 flex items-center">
                              <span className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                                {settings.logo ? (
                                  <img src={settings.logo} alt="Logo da igreja" className="h-full w-full object-cover" />
                                ) : (
                                  <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                  </svg>
                                )}
                              </span>
                              <button
                                type="button"
                                className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-servem-neutral hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-servem-primary"
                              >
                                Alterar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'appearance' && (
                      <div className="px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                          <div className="sm:col-span-3">
                            <label htmlFor="primaryColor" className="block text-sm font-medium text-servem-neutral">
                              Cor Primária
                            </label>
                            <div className="mt-1 flex items-center">
                              <input
                                type="color"
                                name="primaryColor"
                                id="primaryColor"
                                value={settings.primaryColor}
                                onChange={handleChange}
                                className="h-8 w-8 border border-gray-300 rounded-md shadow-sm"
                              />
                              <input
                                type="text"
                                name="primaryColor"
                                value={settings.primaryColor}
                                onChange={handleChange}
                                className="ml-2 shadow-sm focus:ring-servem-primary focus:border-servem-primary block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label htmlFor="secondaryColor" className="block text-sm font-medium text-servem-neutral">
                              Cor Secundária
                            </label>
                            <div className="mt-1 flex items-center">
                              <input
                                type="color"
                                name="secondaryColor"
                                id="secondaryColor"
                                value={settings.secondaryColor}
                                onChange={handleChange}
                                className="h-8 w-8 border border-gray-300 rounded-md shadow-sm"
                              />
                              <input
                                type="text"
                                name="secondaryColor"
                                value={settings.secondaryColor}
                                onChange={handleChange}
                                className="ml-2 shadow-sm focus:ring-servem-primary focus:border-servem-primary block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-6">
                            <p className="text-sm text-servem-neutral mb-4">
                              Visualização das cores selecionadas:
                            </p>
                            <div className="flex space-x-4">
                              <div className="flex flex-col items-center">
                                <div 
                                  className="w-24 h-24 rounded-md shadow-md" 
                                  style={{ backgroundColor: settings.primaryColor }}
                                ></div>
                                <span className="mt-2 text-sm text-servem-neutral">Primária</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <div 
                                  className="w-24 h-24 rounded-md shadow-md" 
                                  style={{ backgroundColor: settings.secondaryColor }}
                                ></div>
                                <span className="mt-2 text-sm text-servem-neutral">Secundária</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <div className="w-24 h-24 rounded-md shadow-md bg-white border border-gray-200 flex items-center justify-center">
                                  <span style={{ color: settings.primaryColor }}>Texto</span>
                                </div>
                                <span className="mt-2 text-sm text-servem-neutral">Texto Primário</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <div 
                                  className="w-24 h-24 rounded-md shadow-md flex items-center justify-center"
                                  style={{ backgroundColor: settings.primaryColor }}
                                >
                                  <span className="text-white">Botão</span>
                                </div>
                                <span className="mt-2 text-sm text-servem-neutral">Botão Primário</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'notifications' && (
                      <div className="px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                          <div className="sm:col-span-6">
                            <fieldset>
                              <legend className="text-base font-medium text-servem-neutral">Métodos de Notificação</legend>
                              <div className="mt-4 space-y-4">
                                <div className="flex items-start">
                                  <div className="flex items-center h-5">
                                    <input
                                      id="notificationEmail"
                                      name="notificationEmail"
                                      type="checkbox"
                                      checked={settings.notificationEmail}
                                      onChange={handleChange}
                                      className="focus:ring-servem-primary h-4 w-4 text-servem-primary border-gray-300 rounded"
                                    />
                                  </div>
                                  <div className="ml-3 text-sm">
                                    <label htmlFor="notificationEmail" className="font-medium text-servem-neutral">
                                      Email
                                    </label>
                                    <p className="text-gray-500">Enviar notificações por email para os voluntários.</p>
                                  </div>
                                </div>
                                <div className="flex items-start">
                                  <div className="flex items-center h-5">
                                    <input
                                      id="notificationSMS"
                                      name="notificationSMS"
                                      type="checkbox"
                                      checked={settings.notificationSMS}
                                      onChange={handleChange}
                                      className="focus:ring-servem-primary h-4 w-4 text-servem-primary border-gray-300 rounded"
                                    />
                                  </div>
                                  <div className="ml-3 text-sm">
                                    <label htmlFor="notificationSMS" className="font-medium text-servem-neutral">
                                      SMS
                                    </label>
                                    <p className="text-gray-500">Enviar notificações por SMS para os voluntários.</p>
                                  </div>
                                </div>
                                <div className="flex items-start">
                                  <div className="flex items-center h-5">
                                    <input
                                      id="notificationWhatsApp"
                                      name="notificationWhatsApp"
                                      type="checkbox"
                                      checked={settings.notificationWhatsApp}
                                      onChange={handleChange}
                                      className="focus:ring-servem-primary h-4 w-4 text-servem-primary border-gray-300 rounded"
                                    />
                                  </div>
                                  <div className="ml-3 text-sm">
                                    <label htmlFor="notificationWhatsApp" className="font-medium text-servem-neutral">
                                      WhatsApp
                                    </label>
                                    <p className="text-gray-500">Enviar notificações por WhatsApp para os voluntários.</p>
                                  </div>
                                </div>
                              </div>
                            </fieldset>
                          </div>

                          <div className="sm:col-span-4">
                            <label htmlFor="defaultReminderTime" className="block text-sm font-medium text-servem-neutral">
                              Tempo Padrão para Lembretes (horas)
                            </label>
                            <div className="mt-1">
                              <input
                                type="number"
                                name="defaultReminderTime"
                                id="defaultReminderTime"
                                min="1"
                                max="72"
                                value={settings.defaultReminderTime}
                                onChange={handleChange}
                                className="shadow-sm focus:ring-servem-primary focus:border-servem-primary block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                            <p className="mt-2 text-sm text-servem-neutral">
                              Quantas horas antes do evento os voluntários devem receber lembretes.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting}
                        className="inline-flex justify-center"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Salvando...
                          </>
                        ) : (
                          'Salvar Configurações'
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
