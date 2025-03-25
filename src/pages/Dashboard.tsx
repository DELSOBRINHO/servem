import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLoading } from '../hooks/useLoading';
import { useNotificationContext } from '../contexts/NotificationContext';
import { volunteerService } from '../services/volunteerService';
import { eventService } from '../services/eventService';
import { Volunteer } from '../types/Volunteer';
import { Event } from '../types/Event';
import { CalendarIcon, UserGroupIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Dashboard: React.FC = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState({
    totalVolunteers: 0,
    activeVolunteers: 0,
    upcomingEvents: 0,
    departmentsCount: 0,
  });
  const { isLoading, withLoading } = useLoading(true);
  const { error } = useNotificationContext();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        await withLoading(Promise.all([
          fetchVolunteers(),
          fetchUpcomingEvents(),
        ]));
      } catch (err) {
        error('Erro ao carregar dados do dashboard');
        console.error(err);
      }
    };

    fetchDashboardData();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const allVolunteers = await volunteerService.getVolunteers();
      const activeVolunteers = allVolunteers.filter(v => v.status === 'Ativo');
      const departments = new Set(allVolunteers.map(v => v.department).filter(Boolean));
      
      setVolunteers(allVolunteers.slice(0, 5));
      setStats(prev => ({
        ...prev,
        totalVolunteers: allVolunteers.length,
        activeVolunteers: activeVolunteers.length,
        departmentsCount: departments.size,
      }));
    } catch (err) {
      console.error('Erro ao buscar voluntários:', err);
      throw err;
    }
  };

  const fetchUpcomingEvents = async () => {
    try {
      const events = await eventService.getUpcomingEvents(5);
      setUpcomingEvents(events);
      setStats(prev => ({
        ...prev,
        upcomingEvents: events.length,
      }));
    } catch (err) {
      console.error('Erro ao buscar eventos:', err);
      throw err;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: ptBR });
    } catch (err) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-servem-neutral">Dashboard</h1>
        <p className="text-gray-500">Bem-vindo ao SerVem, seu sistema de gestão de voluntários.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-servem-primary"></div>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-servem-primary rounded-md p-3">
                    <UserGroupIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total de Voluntários</dt>
                      <dd>
                        <div className="text-lg font-medium text-servem-neutral">{stats.totalVolunteers}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <Link to="/volunteers" className="font-medium text-servem-primary hover:text-indigo-500">
                    Ver todos
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-servem-secondary rounded-md p-3">
                    <UserGroupIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Voluntários Ativos</dt>
                      <dd>
                        <div className="text-lg font-medium text-servem-neutral">{stats.activeVolunteers}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <Link to="/volunteers?status=Ativo" className="font-medium text-servem-primary hover:text-indigo-500">
                    Ver ativos
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                    <CalendarIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Próximos Eventos</dt>
                      <dd>
                        <div className="text-lg font-medium text-servem-neutral">{stats.upcomingEvents}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <Link to="/events" className="font-medium text-servem-primary hover:text-indigo-500">
                    Ver todos
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Departamentos</dt>
                      <dd>
                        <div className="text-lg font-medium text-servem-neutral">{stats.departmentsCount}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <Link to="/settings" className="font-medium text-servem-primary hover:text-indigo-500">
                    Configurações
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Volunteers and Upcoming Events */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Recent Volunteers */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-servem-neutral">Voluntários Recentes</h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {volunteers.length > 0 ? (
                  volunteers.map((volunteer) => (
                    <li key={volunteer.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-servem-primary flex items-center justify-center text-white">
                            {volunteer.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-servem-neutral">{volunteer.name}</div>
                            <div className="text-sm text-gray-500">{volunteer.department || 'Sem departamento'}</div>
                          </div>
                        </div>
                        <div>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            volunteer.status === 'Ativo' ? 'bg-green-100 text-green-800' : 
                            volunteer.status === 'Inativo' ? 'bg-red-100 text-red-800' : 
                            volunteer.status === 'Afastado' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {volunteer.status}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-5 sm:px-6 text-center text-gray-500">
                    Nenhum voluntário cadastrado
                  </li>
                )}
              </ul>
              {volunteers.length > 0 && (
                <div className="bg-gray-50 px-4 py-4 sm:px-6 rounded-b-lg">
                  <div className="text-sm">
                    <Link to="/volunteers" className="font-medium text-servem-primary hover:text-indigo-500">
                      Ver todos os voluntários
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Upcoming Events */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-servem-neutral">Próximos Eventos</h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <li key={event.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-servem-secondary flex items-center justify-center text-white">
                            <CalendarIcon className="h-5 w-5" aria-hidden="true" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-servem-neutral">{event.title}</div>
                            <div className="text-sm text-gray-500">{event.department || 'Sem departamento'}</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(event.event_date)}
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                          <span>{event.start_time} - {event.end_time}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center mt-1">
                            <MapPinIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-5 sm:px-6 text-center text-gray-500">
                    Nenhum evento próximo
                  </li>
                )}
              </ul>
              {upcomingEvents.length > 0 && (
                <div className="bg-gray-50 px-4 py-4 sm:px-6 rounded-b-lg">
                  <div className="text-sm">
                    <Link to="/events" className="font-medium text-servem-primary hover:text-indigo-500">
                      Ver todos os eventos
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
