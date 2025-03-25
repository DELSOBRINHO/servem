import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Card from '../components/Card';

interface Volunteer {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: string;
  address: string;
  birthdate: string;
  joinDate: string;
  skills: string[];
  availability: string[];
  notes: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
  status: string;
  department: string;
}

const VolunteerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulação de carregamento de dados - em uma aplicação real, você faria chamadas à API
    const loadData = async () => {
      // Simular um atraso de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados simulados
      const volunteerData: Volunteer = {
        id: Number(id),
        name: 'Ana Silva',
        email: 'ana.silva@email.com',
        phone: '(11) 98765-4321',
        department: 'musica',
        role: 'Pianista',
        status: 'Ativo',
        address: 'Rua das Flores, 123 - São Paulo, SP',
        birthdate: '1990-05-15',
        joinDate: '2018-03-10',
        skills: ['Piano', 'Teclado', 'Regência'],
        availability: ['Sábado - Manhã', 'Sábado - Tarde', 'Quarta - Noite'],
        notes: 'Ana é uma pianista talentosa e dedicada. Tem formação em música clássica e experiência com coral.'
      };
      
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
          id: 7,
          title: 'Ensaio do Coral',
          date: '2023-10-12',
          description: 'Ensaio semanal do coral da igreja.',
          status: 'Confirmado',
          department: 'musica'
        },
        {
          id: 9,
          title: 'Concerto de Natal',
          date: '2023-12-20',
          description: 'Concerto especial de Natal com coral e orquestra.',
          status: 'Pendente',
          department: 'musica'
        }
      ];
      
      setVolunteer(volunteerData);
      setEvents(eventsData);
      setIsLoading(false);
    };
    
    loadData();
  }, [id]);

  const handleDelete = () => {
    // Simulação de exclusão - em uma aplicação real, você faria uma chamada à API
    console.log(`Deletando voluntário ${id}`);
    setShowDeleteModal(false);
    
    // Redirecionar para a lista de voluntários
    navigate('/volunteers');
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

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-servem-light">
      <Navbar />
      
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-servem-primary">Perfil do Voluntário</h1>
              {!isLoading && volunteer && (
                <p className="mt-1 text-sm text-servem-neutral">
                  {getDepartmentName(volunteer.department)} • {volunteer.role}
                </p>
              )}
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Link to="/volunteers">
                <Button variant="outline">
                  Voltar
                </Button>
              </Link>
              {!isLoading && volunteer && (
                <>
                  <Link to={`/volunteers/${id}/edit`}>
                    <Button variant="secondary">
                      Editar
                    </Button>
                  </Link>
                  <Button 
                    variant="danger"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Excluir
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-10">
              <svg className="animate-spin h-10 w-10 text-servem-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-servem-neutral">Carregando perfil do voluntário...</p>
            </div>
          ) : volunteer ? (
            <div className="px-4 py-6 sm:px-0">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex items-center">
                  <div className="flex-shrink-0 h-16 w-16 rounded-full bg-servem-primary flex items-center justify-center text-white text-xl">
                    <span>{volunteer.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-servem-primary">
                      {volunteer.name}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-servem-neutral">
                      {volunteer.status === 'Ativo' ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Ativo
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Inativo
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="border-t border-gray-200">
                  <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-servem-neutral">
                        Email
                      </dt>
                      <dd className="mt-1 text-sm text-servem-primary sm:mt-0 sm:col-span-2">
                        {volunteer.email}
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-servem-neutral">
                        Telefone
                      </dt>
                      <dd className="mt-1 text-sm text-servem-primary sm:mt-0 sm:col-span-2">
                        {volunteer.phone}
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-servem-neutral">
                        Endereço
                      </dt>
                      <dd className="mt-1 text-sm text-servem-primary sm:mt-0 sm:col-span-2">
                        {volunteer.address}
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-servem-neutral">
                        Data de Nascimento
                      </dt>
                      <dd className="mt-1 text-sm text-servem-primary sm:mt-0 sm:col-span-2">
                        {formatDate(volunteer.birthdate)}
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-servem-neutral">
                        Data de Início
                      </dt>
                      <dd className="mt-1 text-sm text-servem-primary sm:mt-0 sm:col-span-2">
                        {formatDate(volunteer.joinDate)}
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-servem-neutral">
                        Habilidades
                      </dt>
                      <dd className="mt-1 text-sm text-servem-primary sm:mt-0 sm:col-span-2">
                        <div className="flex flex-wrap gap-2">
                          {volunteer.skills.map((skill, index) => (
                            <span key={index} className="px-2 py-1 rounded-full bg-servem-light text-servem-primary text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-servem-neutral">
                        Disponibilidade
                      </dt>
                      <dd className="mt-1 text-sm text-servem-primary sm:mt-0 sm:col-span-2">
                        <ul className="list-disc pl-5">
                          {volunteer.availability.map((time, index) => (
                            <li key={index}>{time}</li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-servem-neutral">
                        Observações
                      </dt>
                      <dd className="mt-1 text-sm text-servem-primary sm:mt-0 sm:col-span-2">
                        {volunteer.notes}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-servem-primary">
                    Próximos Eventos
                  </h3>
                  <Link to={`/volunteers/${id}/schedule`}>
                    <Button variant="secondary" className="text-sm">
                      Gerenciar Escalas
                    </Button>
                  </Link>
                </div>
                
                {events.length > 0 ? (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {events.map(event => (
                      <Card
                        key={event.id}
                        title={event.title}
                        date={new Date(event.date).toLocaleDateString('pt-BR', { 
                          weekday: 'long', 
                          day: '2-digit', 
                          month: 'long'
                        })}
                        description={event.description}
                        status={event.status}
                        link={`/events/${event.id}`}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-white rounded-lg shadow">
                    <svg className="mx-auto h-12 w-12 text-servem-neutral" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-servem-neutral">Nenhum evento agendado</h3>
                    <p className="mt-1 text-sm text-servem-neutral">
                      Este voluntário não está escalado para nenhum evento próximo.
                    </p>
                    <div className="mt-6">
                      <Link to={`/volunteers/${id}/schedule`}>
                        <Button variant="primary">
                          Escalar para Eventos
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-lg shadow">
              <svg className="mx-auto h-12 w-12 text-servem-neutral" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-servem-neutral">Voluntário não encontrado</h3>
              <p className="mt-1 text-sm text-servem-neutral">
                O voluntário que você está procurando não existe ou foi removido.
              </p>
              <div className="mt-6">
                <Link to="/volunteers">
                  <Button variant="primary">
                    Ver Todos os Voluntários
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal de confirmação de exclusão */}
      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Excluir voluntário
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Tem certeza que deseja excluir este voluntário? Esta ação não pode ser desfeita e todos os dados relacionados a este voluntário serão permanentemente removidos.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  variant="danger"
                  className="w-full sm:w-auto sm:ml-3"
                  onClick={handleDelete}
                >
                  Excluir
                </Button>
                <Button
                  variant="outline"
                  className="mt-3 w-full sm:mt-0 sm:w-auto"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerDetail;
