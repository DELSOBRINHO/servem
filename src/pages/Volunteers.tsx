import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

interface Volunteer {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: string;
  events: number;
}

const Volunteers: React.FC = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState<Volunteer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    // Simulação de carregamento de dados - em uma aplicação real, você faria chamadas à API
    const loadData = async () => {
      // Simular um atraso de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados simulados
      const volunteersData: Volunteer[] = [
        {
          id: 1,
          name: 'Ana Silva',
          email: 'ana.silva@email.com',
          phone: '(11) 98765-4321',
          department: 'musica',
          role: 'Pianista',
          status: 'Ativo',
          events: 12
        },
        {
          id: 2,
          name: 'Carlos Oliveira',
          email: 'carlos.oliveira@email.com',
          phone: '(11) 91234-5678',
          department: 'musica',
          role: 'Regente',
          status: 'Ativo',
          events: 15
        },
        {
          id: 3,
          name: 'Mariana Santos',
          email: 'mariana.santos@email.com',
          phone: '(11) 99876-5432',
          department: 'escola-sabatina',
          role: 'Professora',
          status: 'Ativo',
          events: 8
        },
        {
          id: 4,
          name: 'Roberto Lima',
          email: 'roberto.lima@email.com',
          phone: '(11) 95555-4444',
          department: 'musica',
          role: 'Violinista',
          status: 'Inativo',
          events: 5
        },
        {
          id: 5,
          name: 'Juliana Costa',
          email: 'juliana.costa@email.com',
          phone: '(11) 94444-3333',
          department: 'jovens',
          role: 'Líder',
          status: 'Ativo',
          events: 10
        },
        {
          id: 6,
          name: 'Pedro Almeida',
          email: 'pedro.almeida@email.com',
          phone: '(11) 93333-2222',
          department: 'criancas',
          role: 'Professor',
          status: 'Ativo',
          events: 7
        },
        {
          id: 7,
          name: 'Fernanda Martins',
          email: 'fernanda.martins@email.com',
          phone: '(11) 92222-1111',
          department: 'evangelismo',
          role: 'Coordenadora',
          status: 'Ativo',
          events: 9
        },
        {
          id: 8,
          name: 'Lucas Ferreira',
          email: 'lucas.ferreira@email.com',
          phone: '(11) 91111-0000',
          department: 'mordomia',
          role: 'Tesoureiro',
          status: 'Inativo',
          events: 3
        }
      ];
      
      setVolunteers(volunteersData);
      setFilteredVolunteers(volunteersData);
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  useEffect(() => {
    // Aplicar filtros quando o filtro ou termo de busca mudar
    let result = [...volunteers];
    
    // Filtrar por departamento
    if (filter !== 'all') {
      result = result.filter(volunteer => volunteer.department === filter);
    }
    
    // Filtrar por termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        volunteer => 
          volunteer.name.toLowerCase().includes(term) || 
          volunteer.email.toLowerCase().includes(term) ||
          volunteer.role.toLowerCase().includes(term)
      );
    }
    
    setFilteredVolunteers(result);
  }, [filter, searchTerm, volunteers]);

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
          <h1 className="text-3xl font-bold text-servem-primary">Voluntários</h1>
        </div>
      </header>
      
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div className="w-full md:w-auto mb-4 md:mb-0">
                <Link to="/volunteers/create">
                  <Button variant="primary">
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Adicionar Voluntário
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
                    placeholder="Buscar voluntários..."
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
                <p className="mt-2 text-servem-neutral">Carregando voluntários...</p>
              </div>
            ) : (
              <>
                {filteredVolunteers.length > 0 ? (
                  <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                      {filteredVolunteers.map(volunteer => (
                        <li key={volunteer.id}>
                          <Link to={`/volunteers/${volunteer.id}`} className="block hover:bg-servem-light">
                            <div className="px-4 py-4 sm:px-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-servem-primary flex items-center justify-center text-white">
                                    <span>{volunteer.name.split(' ').map(n => n[0]).join('')}</span>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-servem-primary">{volunteer.name}</div>
                                    <div className="text-sm text-servem-neutral">{volunteer.email}</div>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <div className="mr-4 flex flex-col items-end">
                                    <div className="text-sm text-servem-primary">{getDepartmentName(volunteer.department)}</div>
                                    <div className="text-sm text-servem-neutral">{volunteer.role}</div>
                                  </div>
                                  <div>
                                    {volunteer.status === 'Ativo' ? (
                                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        Ativo
                                      </span>
                                    ) : (
                                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                        Inativo
                                      </span>
                                    )}
                                  </div>
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
                ) : (
                  <div className="text-center py-10 bg-white rounded-lg shadow">
                    <svg className="mx-auto h-12 w-12 text-servem-neutral" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-servem-neutral">Nenhum voluntário encontrado</h3>
                    <p className="mt-1 text-sm text-servem-neutral">
                      {searchTerm || filter !== 'all' 
                        ? 'Tente ajustar seus filtros de busca.' 
                        : 'Comece adicionando voluntários à sua igreja.'}
                    </p>
                    {!searchTerm && filter === 'all' && (
                      <div className="mt-6">
                        <Link to="/volunteers/create">
                          <Button variant="primary">
                            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Adicionar Voluntário
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

export default Volunteers;
