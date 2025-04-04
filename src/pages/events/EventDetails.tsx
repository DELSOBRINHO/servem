import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { volunteerService } from '../../services/volunteerService';
import { useNotificationContext } from '../../contexts/NotificationContext';
import { useLoading } from '../../hooks/useLoading';
import EventForm from '../../components/events/EventForm';
import { Event } from '../../types/Event';
import { Volunteer } from '../../types/Volunteer';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  UserPlusIcon,
  TrashIcon,
  PencilSquareIcon,
  UserMinusIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error, warning } = useNotificationContext();
  const { isLoading, withLoading } = useLoading(true);
  const [event, setEvent] = useState<Event | null>(null);
  const [eventVolunteers, setEventVolunteers] = useState<Volunteer[]>([]);
  const [availableVolunteers, setAvailableVolunteers] = useState<Volunteer[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddingVolunteer, setIsAddingVolunteer] = useState(false);
  const [selectedVolunteerId, setSelectedVolunteerId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        await withLoading(Promise.all([
          eventService.getEventById(id),
          eventService.getEventVolunteers(id),
          volunteerService.getVolunteers()
        ]).then(([eventData, eventVolunteersData, allVolunteers]) => {
          if (!eventData) {
            error('Evento não encontrado');
            navigate('/events');
            return;
          }
          
          setEvent(eventData);
          setEventVolunteers(eventVolunteersData);
          
          // Filter out volunteers already assigned to this event
          const eventVolunteerIds = eventVolunteersData.map(v => v.id);
          const available = allVolunteers.filter(v => 
            !eventVolunteerIds.includes(v.id) && v.status === 'Ativo'
          );
          setAvailableVolunteers(available);
        }));
      } catch (err) {
        console.error('Error fetching event details:', err);
        error('Erro ao carregar os dados do evento');
        navigate('/events');
      }
    };

    fetchData();
  }, [id]);

  const handleUpdate = async (formData: Partial<Event>) => {
    if (!id || !event) return;
    
    try {
      await withLoading(
        eventService.updateEvent(id, formData)
          .then((result) => {
            if (result.error) {
              throw new Error(result.error.message);
            }
            
            setEvent({ ...event, ...formData });
            setIsEditing(false);
            success('Evento atualizado com sucesso!');
          })
      );
    } catch (err) {
      console.error('Error updating event:', err);
      error('Erro ao atualizar evento. Por favor, tente novamente.');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await withLoading(
        eventService.deleteEvent(id)
          .then((result) => {
            if (result.error) {
              throw new Error(result.error.message);
            }
            
            success('Evento excluído com sucesso!');
            navigate('/events');
          })
      );
    } catch (err) {
      console.error('Error deleting event:', err);
      error('Erro ao excluir evento. Por favor, tente novamente.');
    }
  };

  const handleAddVolunteer = async () => {
    if (!selectedVolunteerId) return;

    try {
      await withLoading(async () => {
        // Adicionar voluntário ao evento
        const { error: addError } = await supabase
          .from('event_volunteers')
          .insert([
            { event_id: event.id, volunteer_id: selectedVolunteerId }
          ]);

        if (addError) throw new Error(addError.message);

        // Buscar os dados do voluntário para o e-mail
        const { data: volunteerData, error: volunteerError } = await supabase
          .from('volunteers')
          .select('*')
          .eq('id', selectedVolunteerId)
          .single();

        if (!volunteerError && volunteerData && volunteerData.email) {
          // Enviar e-mail de notificação
          const formattedDate = format(new Date(event.event_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
          const formattedTime = `${event.start_time.substring(0, 5)} - ${event.end_time.substring(0, 5)}`;
          
          await emailService.sendEventNotification(
            volunteerData.email,
            volunteerData.name,
            event.title,
            formattedDate,
            formattedTime,
            event.location || 'Local não informado'
          );
        }

        // Atualizar a lista de voluntários
        const { data: updatedVolunteers, error: fetchError } = await supabase
          .from('volunteers')
          .select(`
            id,
            name,
            email,
            phone,
            department,
            role,
            status
          `)
          .eq('id', selectedVolunteerId);

        if (fetchError) throw new Error(fetchError.message);

        setEventVolunteers([...eventVolunteers, ...(updatedVolunteers || [])]);
        setSelectedVolunteerId('');
        setIsAddingVolunteer(false);
      });
    } catch (err) {
      console.error('Error adding volunteer to event:', err);
      error('Erro ao adicionar voluntário ao evento. Por favor, tente novamente.');
    }
  };

  const handleRemoveVolunteer = async (volunteerId: string) => {
    if (!id) return;
    
    try {
      await withLoading(
        eventService.removeVolunteerFromEvent(id, volunteerId)
          .then((result) => {
            if (result.error) {
              throw new Error(result.error.message);
            }
            
            // Find the volunteer that was removed
            const removedVolunteer = eventVolunteers.find(v => v.id === volunteerId);
            if (removedVolunteer && removedVolunteer.status === 'Ativo') {
              // Only add back to available if they're active
              setAvailableVolunteers([...availableVolunteers, removedVolunteer]);
            }
            
            // Remove from event volunteers
            setEventVolunteers(eventVolunteers.filter(v => v.id !== volunteerId));
            success('Voluntário removido com sucesso!');
          })
      );
    } catch (err) {
      console.error('Error removing volunteer from event:', err);
      error('Erro ao remover voluntário do evento. Por favor, tente novamente.');
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  if (isLoading && !event) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-servem-primary"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
        <p className="text-gray-500">Evento não encontrado</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Editar Evento</h1>
          <p className="mt-1 text-sm text-gray-500">
            Atualize as informações do evento
          </p>
        </div>

        <EventForm 
          initialData={event} 
          onSubmit={handleUpdate} 
          isSubmitting={isLoading} 
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{event.title}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Detalhes do evento
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-servem-primary"
          >
            <PencilSquareIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
            Editar
          </button>
          <button
            type="button"
            onClick={() => setIsDeleting(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <TrashIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
            Excluir
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {isDeleting && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <TrashIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Excluir evento
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDelete}
                >
                  Excluir
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-servem-primary sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setIsDeleting(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Volunteer Dialog */}
      {isAddingVolunteer && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-servem-accent bg-opacity-20 sm:mx-0 sm:h-10 sm:w-10">
                  <UserPlusIcon className="h-6 w-6 text-servem-accent" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Adicionar Voluntário
                  </h3>
                  <div className="mt-4">
                    {availableVolunteers.length > 0 ? (
                      <div>
                        <label htmlFor="volunteer" className="block text-sm font-medium text-gray-700">
                          Selecione um voluntário
                        </label>
                        <select
                          id="volunteer"
                          name="volunteer"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-servem-primary focus:border-servem-primary sm:text-sm rounded-md"
                          value={selectedVolunteerId}
                          onChange={(e) => setSelectedVolunteerId(e.target.value)}
                        >
                          <option value="">Selecione um voluntário</option>
                          {availableVolunteers.map((volunteer) => (
                            <option key={volunteer.id} value={volunteer.id}>
                              {volunteer.name} - {volunteer.department || 'Sem departamento'}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Não há voluntários ativos disponíveis para adicionar a este evento.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-servem-accent text-base font-medium text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-servem-accent sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleAddVolunteer}
                  disabled={!selectedVolunteerId || availableVolunteers.length === 0}
                >
                  Adicionar
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-servem-primary sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setIsAddingVolunteer(false);
                    setSelectedVolunteerId('');
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Informações do Evento</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Detalhes do evento</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Título</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{event.title}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Data</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(event.event_date)}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Horário</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                {event.start_time.substring(0, 5)} - {event.end_time.substring(0, 5)}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Local</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                <MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
                {event.location || 'Não informado'}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Voluntários Necessários</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                <UsersIcon className="h-4 w-4 text-gray-400 mr-1" />
                {event.volunteers_needed || 0}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Descrição</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{event.description || 'Sem descrição'}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Volunteers Section */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Voluntários</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Voluntários escalados para este evento ({eventVolunteers.length}/{event.volunteers_needed || 'ilimitado'})
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddingVolunteer(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-servem-accent hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-servem-accent"
          >
            <UserPlusIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
            Adicionar
          </button>
        </div>
        <div className="border-t border-gray-200">
          {eventVolunteers.length > 0 ? (
            <ul role="list" className="divide-y divide-gray-200">
              {eventVolunteers.map((volunteer) => (
                <li key={volunteer.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
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
                    <button
                      type="button"
                      onClick={() => handleRemoveVolunteer(volunteer.id)}
                      className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <UserMinusIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-5 sm:px-6 text-center text-sm text-gray-500">
              Nenhum voluntário escalado para este evento.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
