import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';

interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
  status: string;
}

interface Volunteer {
  id: number;
  name: string;
  department: string;
  events: number;
}

const Dashboard: React.FC = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [activeVolunteers, setActiveVolunteers] = useState<Volunteer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulação de carregamento de dados - em uma aplicação real, você faria chamadas à API
    const loadData = async () => {
      // Simular um atraso de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados simulados
      const events: Event[] = [
        {
          id: 1,
          title: 'Culto de Adoração',
          date: '2023-10-15',
          description: 'Culto de adoração semanal com participação do coral.',
          status: 'Confirmado'
        },
        {
          id: 2,
          title: 'Escola Sabatina',
          date: '2023-10-15',
          description: 'Estudo bíblico semanal em grupos pequenos.',
          status: 'Confirmado'
        },
        {
          id: 3,
          title: 'Reunião de Jovens',
          date: '2023-10-21',
          description: 'Encontro semanal do ministério de jovens.',
          status: 'Pendente'
        },
        {
          id: 4,
          title: 'Evangelismo',
          date: '2023-10-28',
          description: 'Projeto de evangelismo na comunidade local.',
          status: 'Pendente'
        }
      ];
      
      const volunteers: Volunteer[] = [
        { id: 1, name: 'Ana Silva', department: 'Música', events: 12 },
        { id: 2, name: 'Carlos Oliveira', department: 'Jovens', events: 8 },
        { id: 3, name: 'Mariana Santos', department: 'Escola Sabatina', events: 15 },
        { id: 4, name: 'Roberto Lima', department: 'Evangelismo', events: 6 }
      ];
      
      setUpcomingEvents(events);
      setActiveVolunteers(volunteers);
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-servem-light">
      <Navbar />
      
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-servem-primary">Dashboard</h1>
        </div>
      </header>
      
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Estatísticas Rápidas */}
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-servem-primary rounded-md p-3">
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-servem-neutral truncate">
                          Total de Voluntários
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-servem-primary">42</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <Link to="/volunteers" className="font-medium text-servem-secondary hover:text-servem-primary">
                      Ver todos
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-servem-secondary rounded-md p-3">
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-servem-neutral truncate">
                          Eventos Ativos
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-servem-primary">12</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <Link to="/events" className="font-medium text-servem-secondary hover:text-servem-primary">
                      Ver todos
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-servem-accent rounded-md p-3">
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-servem-neutral truncate">
                          Escalas Pendentes
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-servem-primary">5</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <Link to="/schedules" className="font-medium text-servem-secondary hover:text-servem-primary">
                      Ver todas
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-servem-neutral rounded-md p-3">
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-servem-neutral truncate">
                          Notificações
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-servem-primary">8</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <Link to="/notifications" className="font-medium text-servem-secondary hover:text-servem-primary">
                      Ver todas
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Próximos Eventos */}
          <div className="px-4 sm:px-0 mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-servem-primary">Próximos Eventos</h2>
              <Link to="/events/create">
                <Button variant="primary" className="text-sm">
                  Criar Evento
                </Button>
              </Link>
            </div>
            
            {isLoading ? (
              <div className="text-center py-10">
                <svg className="animate-spin h-10 w-10 text-servem-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-2 text-servem-neutral">Carregando eventos...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map(event => (
                  <Card
                    key={event.id}
                    title={event.title}
                    date={new Date(event.date).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    description={event.description}
                    status={event.status}
                    onClick={() => window.location.href = `/events/${event.id}`}
                  />
                ))}
              </div>
            )}
            
            {!isLoading && upcomingEvents.length === 0 && (
              <div className="text-center py-10 bg-white rounded-lg shadow">
                <svg className="mx-auto h-12 w-12 text-servem-neutral" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-servem-neutral">Sem eventos</h3>
                <p className="mt-1 text-sm text-servem-neutral">Comece criando um novo evento para sua igreja.</p>
                <div className="mt-6">
                  <Link to="/events/create">
                    <Button variant="primary">
                      <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Novo Evento
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Voluntários Ativos */}
          <div className="px-4 sm:px-0 mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-servem-primary">Voluntários Mais Ativos</h2>
              <Link to="/volunteers">
                <Button variant="outline" className="text-sm">
                  Ver Todos
                </Button>
              </Link>
            </div>
            
            {isLoading ? (
              <div className="text-center py-10">
                <svg className="animate-spin h-10 w-10 text-servem-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-2 text-servem-neutral">Carregando voluntários...</p>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {activeVolunteers.map(volunteer => (
                    <li key={volunteer.id}>
                      <Link to={`/volunteers/${volunteer.id}`} className="block hover:bg-servem-light">
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-servem-primary flex items-center justify-center text-white">
                                <span>{volunteer.name.split(' ').map(n => n[0]).join('')}</span>
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium text-servem-primary">{volunteer.name}</p>
                                <p className="text-sm text-servem-neutral">{volunteer.department}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-servem-light text-servem-primary">
                                {volunteer.events} eventos
                              </span>
                              <svg className="ml-2 h-5 w-5 text-servem-neutral" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {!isLoading && activeVolunteers.length === 0 && (
              <div className="text-center py-10 bg-white rounded-lg shadow">
                <svg className="mx-auto h-12 w-12 text-servem-neutral" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-servem-neutral">Sem voluntários</h3>
                <p className="mt-1 text-sm text-servem-neutral">Comece adicionando voluntários à sua igreja.</p>
                <div className="mt-6">
                  <Link to="/volunteers/create">
                    <Button variant="primary">
                      <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Novo Voluntário
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* Atividades Recentes */}
          <div className="px-4 sm:px-0 mt-8 mb-8">
            <h2 className="text-xl font-semibold text-servem-primary mb-4">Atividades Recentes</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                <li>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center">
                      <div className="min-w-0 flex-1 flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-servem-secondary flex items-center justify-center text-white">
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1 px-4">
                          <div>
                            <p className="text-sm font-medium text-servem-primary truncate">
                              Novo evento criado: Culto de Adoração
                            </p>
                            <p className="text-sm text-servem-neutral">
                              <span>Criado por: Admin</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-servem-neutral">Hoje</p>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center">
                      <div className="min-w-0 flex-1 flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-servem-primary flex items-center justify-center text-white">
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1 px-4">
                          <div>
                            <p className="text-sm font-medium text-servem-primary truncate">
                              Novo voluntário adicionado: Mariana Santos
                            </p>
                            <p className="text-sm text-servem-neutral">
                              <span>Departamento: Escola Sabatina</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-servem-neutral">Ontem</p>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center">
                      <div className="min-w-0 flex-1 flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-servem-accent flex items-center justify-center text-white">
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1 px-4">
                          <div>
                            <p className="text-sm font-medium text-servem-primary truncate">
                              Nova escala criada: Música - Outubro
                            </p>
                            <p className="text-sm text-servem-neutral">
                              <span>5 voluntários escalados</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-servem-neutral">2 dias atrás</p>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
