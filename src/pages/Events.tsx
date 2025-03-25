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
  department: string;
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    // Simulação de carregamento de dados - em uma aplicação real, você faria chamadas à API
    const loadData = async () => {
      // Simular um atraso de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados simulados
      const eventsData: Event[] = [
        {
          id: 1,
          title: 'Culto de Adoração',
          date: '2023-10-15',
          description: 'Culto de adoração semanal com participação do coral.',
          status: 'Confirmado',
          department: 'musica'
        },
        {
          id: 2,
          title: 'Escola Sabatina',
          date: '2023-10-15',
          description: 'Estudo bíblico semanal em grupos pequenos.',
          status: 'Confirmado',
          department: 'escola-sabatina'
        },
        {
          id: 3,
          title: 'Reunião de Jovens',
          date: '2023-10-21',
          description: 'Encontro semanal do ministério de jovens.',
          status: 'Pendente',
          department: 'jovens'
        },
        {
          id: 4,
          title: 'Evangelismo',
          date: '2023-10-28',
          description: 'Projeto de evangelismo na comunidade local.',
          status: 'Pendente',
          department: 'evangelismo'
        },
        {
          id: 5,
          title: 'Classe Bíblica',
          date: '2023-10-22',
          description: 'Estudo bíblico para interessados.',
          status: 'Confirmado',
          department: 'evangelismo'
        },
        {
          id: 6,
          title: 'Culto Jovem',
          date: '2023-10-14',
          description: 'Culto especial organizado pelo ministério jovem.',
          status: 'Confirmado',
          department: 'jovens'
        },
        {
          id: 7,
          title: 'Ensaio do Coral',
          date: '2023-10-12',
          description: 'Ensaio semanal do coral da igreja.',
          status: 'Confirmado',
          department: 'musica'
        },
        {
          id: 8,
          title: 'Dia da Criança',
          date: '2023-10-12',
          description: 'Programação especial para o dia das crianças.',
          status: 'Confirmado',
          department: 'criancas'
        }
      ];
      
      setEvents(eventsData);
      setFilteredEvents(eventsData);
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  useEffect(() => {
    // Aplicar filtros quando o filtro ou termo de busca mudar
    let result = [...events];
    
    // Filtrar por departamento
    if (filter !== 'all') {
      result = result.filter(event => event.department === filter);
    }
    
    // Filtrar por termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        event => 
          event.title.toLowerCase().includes(term) || 
          event.description.toLowerCase().includes(term)
      );
    }
    
    setFilteredEvents(result);
  }, [filter, searchTerm, events]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  const getDepartmentName = (departmentCode: string): string => {
    const departments: {[key: string]: string} = {
      'musica': 'Música',
      'escola-sabatina': 'Escola Sabatina',
      'jovens': 'Jovens',
      'criancas': 'Ministério da Criança',
      'evangelismo': 'Evangelismo',
      'mordomia': 'Mordomia'
    };
    
    return departments[departmentCode] || departmentCode;
  };

  return (
    <div className="min-h-screen bg-servem-light">
      <Navbar />
      
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-servem-primary">Eventos</h1>
        </div>
      </header>
      
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div className="w-full md:w-auto mb-4 md:mb-0">
                <Link to="/events/create">
                  <Button variant="primary">
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Criar Novo Evento
                  </Button>
                </Link>
              </div>
              
              <div className="w-full md:w-auto flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="search"
                    id="search"
                    className="focus:ring-servem-primary focus:border-servem-primary block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Buscar eventos..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-servem-neutral" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                <select
                  id="department-filter"
                  name="department-filter"
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-servem-primary focus:border-servem-primary sm:text-sm rounded-md"
                  value={filter}
                  onChange={handleFilterChange}
                >
                  <option value="all">Todos os Departamentos</option>
                  <option value="musica">Música</option>
                  <option value="escola-sabatina">Escola Sabatina</option>
                  <option value="jovens">Jovens</option>
                  <option value="criancas">Ministério da Criança</option>
                  <option value="evangelismo">Evangelismo</option>
                  <option value="mordomia">Mordomia</option>
                </select>
              </div>
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
              <>
                {filteredEvents.length > 0 ? (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredEvents.map(event => (
                      <Card
                        key={event.id}
                        title={event.title}
                        date={new Date(event.date).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        description={event.description}
                        status={event.status}
                        badge={getDepartmentName(event.department)}
                        onClick={() => window.location.href = `/events/${event.id}`}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-white rounded-lg shadow">
                    <svg className="mx-auto h-12 w-12 text-servem-neutral" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-servem-neutral">Nenhum evento encontrado</h3>
                    <p className="mt-1 text-sm text-servem-neutral">
                      {searchTerm || filter !== 'all' 
                        ? 'Tente ajustar seus filtros de busca.' 
                        : 'Comece criando um novo evento para sua igreja.'}
                    </p>
                    {!searchTerm && filter === 'all' && (
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
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Events;
