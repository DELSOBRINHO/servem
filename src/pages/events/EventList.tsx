import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { useLoading } from '../../hooks/useLoading';
import { useNotificationContext } from '../../contexts/NotificationContext';
import { Event } from '../../types/Event';
import { 
  CalendarIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { format, isAfter, isBefore, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, upcoming, past
  const { isLoading, withLoading } = useLoading(true);
  const { error } = useNotificationContext();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        await withLoading(
          eventService.getEvents()
            .then((data) => {
              setEvents(data);
            })
        );
      } catch (err) {
        console.error('Error fetching events:', err);
        error('Erro ao carregar os eventos');
      }
    };

    fetchEvents();
  }, []);

  const handleExportCSV = async () => {
    try {
      // Get all events for export
      const allEvents = await eventService.getEvents();
      
      // Convert to CSV
      const headers = ['Título', 'Data', 'Horário Início', 'Horário Fim', 'Local', 'Descrição', 'Voluntários Necessários'];
      const csvData = allEvents.map(e => [
        e.title,
        format(new Date(e.event_date), 'dd/MM/yyyy'),
        e.start_time,
        e.end_time,
        e.location || '',
        e.description || '',
        e.volunteers_needed?.toString() || '0'
      ]);
      
      // Add headers
      csvData.unshift(headers);
      
      // Convert to CSV string
      const csvContent = csvData.map(row => row.join(',')).join('\n');
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `eventos_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error exporting events:', err);
      error('Erro ao exportar eventos');
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const getEventStatus = (event: Event) => {
    const eventDate = new Date(event.event_date);
    
    if (isToday(eventDate)) {
      return { label: 'Hoje', className: 'bg-green-100 text-green-800' };
    } else if (isAfter(eventDate, new Date())) {
      return { label: 'Próximo', className: 'bg-blue-100 text-blue-800' };
    } else {
      return { label: 'Passado', className: 'bg-gray-100 text-gray-800' };
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const eventDate = new Date(event.event_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let matchesFilter = true;
    if (filterType === 'upcoming') {
      matchesFilter = isAfter(eventDate, today) || isToday(eventDate);
    } else if (filterType === 'past') {
      matchesFilter = isBefore(eventDate, today) && !isToday(eventDate);
    }
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Eventos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerenciamento de eventos da igreja
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/events/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-servem-accent hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-servem-accent"
          >
            <CalendarPlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Novo Evento
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">Pesquisar</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="focus:ring-servem-primary focus:border-servem-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Buscar por título ou descrição"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="filter" className="block text-sm font-medium text-gray-700">Filtrar por</label>
              <select
                id="filter"
                name="filter"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-servem-primary focus:border-servem-primary sm:text-sm rounded-md"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">Todos os eventos</option>
                <option value="upcoming">Próximos eventos</option>
                <option value="past">Eventos passados</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-between">
            <div className="text-sm text-gray-500">
              {filteredEvents.length} eventos encontrados
            </div>
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-servem-primary"
            >
              <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
              Exportar CSV
            </button>
          </div>
        </div>
      </div>

      {/* Events List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-servem-primary"></div>
        </div>
      ) : (
        <AnimatedList
          items={filteredEvents}
          keyExtractor={(event) => event.id}
          emptyMessage="Nenhum evento encontrado"
          renderItem={(event) => (
            <li className="py-4">
              <Link to={`/events/${event.id}`} className="block hover:bg-gray-50 transition duration-150 ease-in-out">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-servem-accent bg-opacity-20 flex items-center justify-center text-servem-accent">
                        <CalendarIcon className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-servem-primary truncate">{event.title}</p>
                        <div className="mt-1 flex flex-wrap gap-y-1 gap-x-4">
                          <div className="flex items-center text-xs text-gray-500">
                            <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {formatDate(event.event_date)}
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {event.start_time.substring(0, 5)} - {event.end_time.substring(0, 5)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        isEventUpcoming(event) ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {isEventUpcoming(event) ? 'Próximo' : 'Passado'}
                      </span>
                      {event.location && (
                        <div className="text-sm text-gray-500 mt-1 flex items-center">
                          <MapPinIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          )}
        />
      )}
    </div>
  );
};

export default EventList;
