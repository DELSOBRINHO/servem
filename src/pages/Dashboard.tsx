import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { volunteerService } from '../services/volunteerService';
import { useLoading } from '../hooks/useLoading';
import { useNotificationContext } from '../contexts/NotificationContext';
import { Event } from '../types/Event';
import { Volunteer } from '../types/Volunteer';
import { format, isToday, isAfter, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  CalendarIcon, 
  UsersIcon, 
  ClockIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [volunteerStats, setVolunteerStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });
  const { isLoading, withLoading } = useLoading(true);
  const { error } = useNotificationContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await withLoading(Promise.all([
          eventService.getEvents(),
          volunteerService.getVolunteers()
        ]).then(([events, volunteers]) => {
          // Filter upcoming events
          const now = new Date();
          const upcoming = events
            .filter(event => isAfter(new Date(event.event_date), now) || isToday(new Date(event.event_date)))
            .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
            .slice(0, 5);
          
          setUpcomingEvents(upcoming);
          
          // Calculate volunteer stats
          const active = volunteers.filter(v => v.status === 'Ativo').length;
          const inactive = volunteers.filter(v => v.status === 'Inativo').length;
          
          setVolunteerStats({
            total: volunteers.length,
            active,
            inactive
          });
        }));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        error('Erro ao carregar os dados do dashboard');
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM", { locale: ptBR });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Bem-vindo ao sistema de gerenciamento de voluntários da igreja
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-servem-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Stats Section */}
          <div className="bg-white shadow rounded-lg p-6 lg:col-span-1">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Estatísticas</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center">
                  <UsersIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-500">Total de Voluntários</span>
                </div>
                <div className="mt-1">
                  <div className="text-2xl font-semibold text-gray-900">{volunteerStats.total}</div>
                  <div className="mt-1 flex items-baseline text-sm">
                    <span className="text-green-600 font-semibold">{volunteerStats.active} ativos</span>
                    <span className="ml-2 text-gray-500">({Math.round((volunteerStats.active / volunteerStats.total) * 100) || 0}%)</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-500">Próximos Eventos</span>
                </div>
                <div className="mt-1">
                  <div className="text-2xl font-semibold text-gray-900">{upcomingEvents.length}</div>
                  <div className="mt-1 text-sm text-gray-500">
                    eventos agendados
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Link
                  to="/reports"
                  className="inline-flex items-center text-sm font-medium text-servem-primary hover:text-servem-accent"
                >
                  Ver relatórios completos
                  <svg className="ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Upcoming Events Section */}
          <div className="bg-white shadow rounded-lg p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Próximos Eventos</h2>
              <Link
                to="/events"
                className="text-sm font-medium text-servem-primary hover:text-servem-accent"
              >
                Ver todos
              </Link>
            </div>
            
            {upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <Link
                    key={event.id}
                    to={`/events/${event.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-servem-accent bg-opacity-20 flex items-center justify-center text-servem-accent">
                        <CalendarIcon className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-base font-medium text-gray-900">{event.title}</h3>
                        <div className="mt-1 flex flex-wrap gap-y-1 gap-x-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {formatDate(event.event_date)}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {event.start_time.substring(0, 5)} - {event.end_time.substring(0, 5)}
                          </div>
                          {event.location && (
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPinIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              {event.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum evento próximo</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Não há eventos agendados para os próximos dias.
                </p>
                <div className="mt-6">
                  <Link
                    to="/events/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-servem-accent hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-servem-accent"
                  >
                    <CalendarIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Criar novo evento
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
