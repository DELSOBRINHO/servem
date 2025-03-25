import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import { Volunteer, Event } from '../types';

interface ScheduleItem {
  eventId: number;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  department: string;
  status: string;
  isAssigned: boolean;
  isConfirmed: boolean;
}

const VolunteerSchedule: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [events, setEvents] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedEvents, setSelectedEvents] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    // Simulação de carregamento de dados - em uma aplicação real, você faria uma chamada à API
    const loadData = async () => {
      // Simular um atraso de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados simulados do voluntário
      const volunteerData: Volunteer = {
        id: Number(id),
        name: 'Ana Silva',
        email: 'ana.silva@email.com',
        phone: '(11) 98765-4321',
        department: 'musica',
        role: 'Pianista',
        status: 'Ativo',
        skills: ['Piano', 'Teclado', 'Regência']
      };
      
      // Dados simulados de eventos
      const eventsData: ScheduleItem[] = [
        {
          eventId: 1,
          eventTitle: 'Culto de Adoração',
          eventDate: '2023-10-15',
          eventTime: '09:00 - 11:30',
          department: 'musica',
          status: 'Confirmado',
          isAssigned: true,
          isConfirmed: true
        },
        {
          eventId: 2,
          eventTitle: 'Ensaio do Coral',
          eventDate: '2023-10-14',
          eventTime: '19:00 - 21:00',
          department: 'musica',
          status: 'Confirmado',
          isAssigned: true,
          isConfirmed: false
        },
        {
          eventId: 3,
          eventTitle: 'Culto Jovem',
          eventDate: '2023-10-21',
          eventTime: '19:00 - 21:00',
          department: 'jovens',
          status: 'Confirmado',
          isAssigned: false,
          isConfirmed: false
        },
        {
          eventId: 4,
          eventTitle: 'Escola Sabatina',
          eventDate: '2023-10-22',
          eventTime: '09:00 - 10:30',
          department: 'escola-sabatina',
          status: 'Confirmado',
          isAssigned: false,
          isConfirmed: false
        },
        {
          eventId: 5,
          eventTitle: 'Culto de Oração',
          eventDate: '2023-10-18',
          eventTime: '19:30 - 21:00',
          department: 'musica',
          status: 'Confirmado',
          isAssigned: false,
          isConfirmed: false
        }
      ];
      
      setVolunteer(volunteerData);
      setEvents(eventsData);
      
      // Inicializar eventos já selecionados
      setSelectedEvents(
        eventsData
          .filter(event => event.isAssigned)
          .map(event => event.eventId)
      );
      
      setIsLoading(false);
    };
    
    loadData();
  }, [id]);

  const handleCheckboxChange = (eventId: number) => {
    setSelectedEvents(prev => {
      if (prev.includes(eventId)) {
        return prev.filter(id => id !== eventId);
      } else {
        return [...prev, eventId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      // Simulação de envio para API - em uma aplicação real, você faria uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Eventos selecionados para o voluntário:', selectedEvents);
      
      // Atualizar a UI para mostrar os eventos selecionados como atribuídos
      setEvents(prev => 
        prev.map(event => ({
          ...event,
          isAssigned: selectedEvents.includes(event.eventId)
        }))
      );
      
      setSuccessMessage('Escala atualizada com sucesso!');
      
      // Limpar a mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Erro ao atualizar escala:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: '2-digit', 
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-servem-light">
      <Navbar />
      
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-servem-primary">Escala de Voluntário</h1>
            <Link to={`/volunteers/${id}`}>
              <Button variant="outline">
                Voltar
              </Button>
            </Link>
          </div>
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
                <p className="mt-2 text-servem-neutral">Carregando dados...</p>
              </div>
            ) : (
              <>
                {volunteer && (
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                    <div className="px-4 py-5 sm:px-6">
                      <h3 className="text-lg leading-6 font-medium text-servem-primary">
                        Informações do Voluntário
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-servem-neutral">
                        Detalhes e escala de eventos.
                      </p>
                    </div>
                    <div className="border-t border-gray-200">
                      <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-servem-neutral">
                            Nome completo
                          </dt>
                          <dd className="mt-1 text-sm text-servem-neutral sm:mt-0 sm:col-span-2">
                            {volunteer.name}
                          </dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-servem-neutral">
                            Departamento
                          </dt>
                          <dd className="mt-1 text-sm text-servem-neutral sm:mt-0 sm:col-span-2">
                            {volunteer.department === 'musica' ? 'Música' : 
                             volunteer.department === 'escola-sabatina' ? 'Escola Sabatina' :
                             volunteer.department === 'jovens' ? 'Jovens' :
                             volunteer.department === 'criancas' ? 'Ministério da Criança' :
                             volunteer.department === 'evangelismo' ? 'Evangelismo' :
                             volunteer.department === 'mordomia' ? 'Mordomia' : volunteer.department}
                          </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-servem-neutral">
                            Função
                          </dt>
                          <dd className="mt-1 text-sm text-servem-neutral sm:mt-0 sm:col-span-2">
                            {volunteer.role}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                )}

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

                <form onSubmit={handleSubmit}>
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                      <h3 className="text-lg leading-6 font-medium text-servem-primary">
                        Eventos Disponíveis
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-servem-neutral">
                        Selecione os eventos para os quais deseja escalar este voluntário.
                      </p>
                    </div>
                    <div className="border-t border-gray-200">
                      <ul className="divide-y divide-gray-200">
                        {events.map((event) => (
                          <li key={event.eventId} className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <input
                                  id={`event-${event.eventId}`}
                                  name="events"
                                  type="checkbox"
                                  className="h-4 w-4 text-servem-primary focus:ring-servem-primary border-gray-300 rounded"
                                  checked={selectedEvents.includes(event.eventId)}
                                  onChange={() => handleCheckboxChange(event.eventId)}
                                  disabled={event.isConfirmed}
                                />
                                <label htmlFor={`event-${event.eventId}`} className="ml-3 block">
                                  <span className="text-sm font-medium text-servem-primary">{event.eventTitle}</span>
                                  <span className="block text-sm text-servem-neutral">
                                    {formatDate(event.eventDate)} • {event.eventTime}
                                  </span>
                                </label>
                              </div>
                              <div>
                                {event.isConfirmed ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Confirmado
                                  </span>
                                ) : event.isAssigned ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Pendente
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    Não Escalado
                                  </span>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
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
                          'Salvar Escala'
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VolunteerSchedule;