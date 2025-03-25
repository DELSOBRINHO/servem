import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

interface Event {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  department: string;
  status: string;
  volunteers: Volunteer[];
}

interface Volunteer {
  id: number;
  name: string;
  role: string;
  confirmed: boolean;
}

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulação de carregamento de dados - em uma aplicação real, você faria chamadas à API
    const loadData = async () => {
      // Simular um atraso de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados simulados
      const eventData: Event = {
        id: Number(id),
        title: 'Culto de Adoração',
        date: '2023-10-15',
        startTime: '09:00',
        endTime: '11:00',
        location: 'Templo Principal',
        description: 'Culto de adoração semanal com participação do coral e orquestra. Tema: "A graça de Deus em nossa vida".',
        department: 'musica',
        status: 'Confirmado',
        volunteers: [
          { id: 1, name: 'Ana Silva', role: 'Pianista', confirmed: true },
          { id: 2, name: 'Carlos Oliveira', role: 'Regente', confirmed: true },
          { id: 3, name: 'Mariana Santos', role: 'Soprano', confirmed: false },
          { id: 4, name: 'Roberto Lima', role: 'Violinista', confirmed: true }
        ]
      };
      
      setEvent(eventData);
      setIsLoading(false);
    };
    
    loadData();
  }, [id]);

  const handleDelete = () => {
    // Simulação de exclusão - em uma aplicação real, você faria uma chamada à API
    console.log(`Deletando evento ${id}`);
    setShowDeleteModal(false);
    
    // Redirecionar para a lista de eventos
    navigate('/events');
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
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-servem-light">
      <Navbar />
      
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-servem-primary">Detalhes do Evento</h1>
              {!isLoading && event && (
                <p className="mt-1 text-sm text-servem-neutral">
                  {formatDate(event.date)}
                </p>
              )}
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Link to="/events">
                <Button variant="outline">
                  Voltar
                </Button>
              </Link>
              {!isLoading && event && (
                <>
                  <Link to={`/events/${id}/edit`}>
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
              <p className="mt-2 text-servem-neutral">Carregando detalhes do evento...</p>
            </div>
          ) : event ? (
            <div className="px-4 py-6 sm:px-0">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-servem-primary">
                    {event.title}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-servem-neutral">
                    {event.status === 'Confirmado' ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Confirmado
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pendente
                      </span>
                    )}
                  </p>
                </div>
                <div className="border-t border-gray-200">
                  <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-servem-neutral">
                        Departamento
                      </dt>
                      <dd className="mt-1 text-sm text-servem-primary sm:mt-0 sm:col-span-2">
                        {getDepartmentName(event.department)}
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-servem-neutral">
                        Data
                      </dt>
                      <dd className="mt-1 text-sm text-servem-primary sm:mt-0 sm:col-span-2">
                        {formatDate(event.date)}
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-servem-neutral">
                        Horário
                      </dt>
                      <dd className="mt-1 text-sm text-servem-primary sm:mt-0 sm:col-span-2">
                        {event.startTime} - {event.endTime}
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-servem-neutral">
                        Local
                      </dt>
                      <dd className="mt-1 text-sm text-servem-primary sm:mt-0 sm:col-span-2">
                        {event.location}
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-servem-neutral">
                        Descrição
                      </dt>
                      <dd className="mt-1 text-sm text-servem-primary sm:mt-0 sm:col-span-2">
                        {event.description}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-servem-primary">
                    Voluntários Escalados
                  </h3>
                  <Link to={`/events/${id}/schedule`}>
                    <Button variant="secondary" className="text-sm">
                      Gerenciar Escala
                    </Button>
                  </Link>
                </div>
                
                {event.volunteers.length > 0 ? (
                  <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                      {event.volunteers.map(volunteer => (
                        <li key={volunteer.id}>
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-servem-primary flex items-center justify-center text-white">
                                  <span>{volunteer.name.split(' ').map(n => n[0]).join('')}</span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-servem-primary">{volunteer.name}</div>
                                  <div className="text-sm text-servem-neutral">{volunteer.role}</div>
                                </div>
                              </div>
                              <div>
                                {volunteer.confirmed ? (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Confirmado
                                  </span>
                                ) : (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                    Aguardando
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-center py-10 bg-white rounded-lg shadow">
                    <svg className="mx-auto h-12 w-12 text-servem-neutral" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-servem-neutral">Nenhum voluntário escalado</h3>
                    <p className="mt-1 text-sm text-servem-neutral">
                      Adicione voluntários à escala deste evento.
                    </p>
                    <div className="mt-6">
                      <Link to={`/events/${id}/schedule`}>
                        <Button variant="primary">
                          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                          Escalar Voluntários
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-servem-neutral">Evento não encontrado</h3>
              <p className="mt-1 text-sm text-servem-neutral">
                O evento que você está procurando não existe ou foi removido.
              </p>
              <div className="mt-6">
                <Link to="/events">
                  <Button variant="primary">
                    Ver Todos os Eventos
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
                      Excluir evento
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita e todos os dados relacionados a este evento serão permanentemente removidos.
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

export default EventDetail;
