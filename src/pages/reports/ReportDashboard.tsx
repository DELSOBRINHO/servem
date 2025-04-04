import React, { useState, useEffect } from 'react';
import { eventService } from '../../services/eventService';
import { volunteerService } from '../../services/volunteerService';
import { useLoading } from '../../hooks/useLoading';
import { useNotificationContext } from '../../contexts/NotificationContext';
import { Event } from '../../types/Event';
import { Volunteer } from '../../types/Volunteer';
import { 
  ChartBarIcon, 
  UsersIcon, 
  CalendarIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

const ReportDashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalVolunteers: 0,
    activeVolunteers: 0,
    departmentStats: [] as { department: string; count: number }[],
    volunteersByEvent: [] as { eventTitle: string; count: number }[]
  });
  const { isLoading, withLoading } = useLoading(true);
  const { error } = useNotificationContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await withLoading(Promise.all([
          eventService.getEvents(),
          volunteerService.getVolunteers()
        ]).then(([eventsData, volunteersData]) => {
          setEvents(eventsData);
          setVolunteers(volunteersData);
          
          // Calculate statistics
          const now = new Date();
          const upcomingEvents = eventsData.filter(e => new Date(e.event_date) >= now);
          const activeVolunteers = volunteersData.filter(v => v.status === 'Ativo');
          
          // Department statistics
          const departments = volunteersData.reduce((acc, volunteer) => {
            if (volunteer.department) {
              if (!acc[volunteer.department]) {
                acc[volunteer.department] = 0;
              }
              acc[volunteer.department]++;
            }
            return acc;
          }, {} as Record<string, number>);
          
          const departmentStats = Object.entries(departments)
            .map(([department, count]) => ({ department, count }))
            .sort((a, b) => b.count - a.count);
          
          // Volunteers by event (placeholder - would need actual event participation data)
          const volunteersByEvent = eventsData.slice(0, 5).map(event => ({
            eventTitle: event.title,
            count: Math.floor(Math.random() * 10) // Placeholder random data
          }));
          
          setStats({
            totalEvents: eventsData.length,
            upcomingEvents: upcomingEvents.length,
            totalVolunteers: volunteersData.length,
            activeVolunteers: activeVolunteers.length,
            departmentStats,
            volunteersByEvent
          });
        }));
      } catch (err) {
        console.error('Error fetching report data:', err);
        error('Erro ao carregar os dados para relatórios');
      }
    };

    fetchData();
  }, []);

  const handleExportData = () => {
    // This would be implemented to export all data to CSV/Excel
    alert('Funcionalidade de exportação de relatórios será implementada em breve!');
  };

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Relatórios</h1>
          <p className="mt-1 text-sm text-gray-500">
            Estatísticas e relatórios da igreja
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            onClick={handleExportData}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-servem-primary"
          >
            <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
            Exportar Dados
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-servem-primary"></div>
        </div>
      ) : (
        <div>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            {/* Total Volunteers */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UsersIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total de Voluntários</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{stats.totalVolunteers}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <span className="font-medium text-servem-primary">
                    {stats.activeVolunteers} ativos
                  </span>
                  <span className="text-gray-500"> ({Math.round((stats.activeVolunteers / stats.totalVolunteers) * 100) || 0}%)</span>
                </div>
              </div>
            </div>

            {/* Total Events */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CalendarIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total de Eventos</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{stats.totalEvents}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <span className="font-medium text-servem-primary">
                    {stats.upcomingEvents} próximos
                  </span>
                  <span className="text-gray-500"> eventos agendados</span>
                </div>
              </div>
            </div>

            {/* Volunteers by Department */}
            <div className="bg-white overflow-hidden shadow rounded-lg sm:col-span-2">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChartBarIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Voluntários por Departamento</dt>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  {stats.departmentStats.length > 0 ? (
                    <div className="space-y-2">
                      {stats.departmentStats.slice(0, 5).map((dept, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-servem-accent h-2.5 rounded-full" 
                              style={{ width: `${(dept.count / stats.totalVolunteers) * 100}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-500">{dept.department}: {dept.count}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Nenhum departamento cadastrado</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Reports */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Volunteers List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Voluntários Recentes</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Últimos voluntários cadastrados</p>
              </div>
              <div className="border-t border-gray-200">
                <ul role="list" className="divide-y divide-gray-200">
                  {volunteers.slice(0, 5).map((volunteer) => (
                    <li key={volunteer.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-servem-primary flex items-center justify-center text-white">
                          <span className="text-sm font-medium">
                            {volunteer.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{volunteer.name}</div>
                          <div className="text-sm text-gray-500">
                            {volunteer.department || 'Sem departamento'} • {volunteer.role || 'Sem função'}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Events List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Próximos Eventos</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Eventos agendados</p>
              </div>
              <div className="border-t border-gray-200">
                <ul role="list" className="divide-y divide-gray-200">
                  {events
                    .filter(e => new Date(e.event_date) >= new Date())
                    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
                    .slice(0, 5)
                    .map((event) => (
                      <li key={event.id} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-servem-accent flex items-center justify-center text-white">
                            <span className="text-sm font-medium">
                              {new Date(event.event_date).getDate()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{event.title}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(event.event_date).toLocaleDateString()} • {event.start_time.substring(0, 5)} - {event.end_time.substring(0, 5)}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportDashboard;
