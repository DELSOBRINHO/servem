import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { volunteerService } from '../../services/volunteerService';
import { eventService } from '../../services/eventService';
import { useNotificationContext } from '../../contexts/NotificationContext';
import { useLoading } from '../../hooks/useLoading';
import VolunteerForm from '../../components/volunteers/VolunteerForm';
import { Volunteer } from '../../types/Volunteer';
import { Event } from '../../types/Event';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  CalendarIcon,
  TrashIcon,
  PencilSquareIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const VolunteerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error, warning } = useNotificationContext();
  const { isLoading, withLoading } = useLoading(true);
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [volunteerEvents, setVolunteerEvents] = useState<Event[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        await withLoading(Promise.all([
          volunteerService.getVolunteerById(id),
          eventService.getVolunteerEvents(id)
        ]).then(([volunteerData, eventsData]) => {
          if (!volunteerData) {
            error('Voluntário não encontrado');
            navigate('/volunteers');
            return;
          }
          
          setVolunteer(volunteerData);
          setVolunteerEvents(eventsData);
        }));
      } catch (err) {
        console.error('Error fetching volunteer details:', err);
        error('Erro ao carregar os dados do voluntário');
        navigate('/volunteers');
      }
    };

    fetchData();
  }, [id]);

  const handleUpdate = async (formData: Partial<Volunteer>) => {
    if (!id || !volunteer) return;
    
    try {
      await withLoading(
        volunteerService.updateVolunteer(id, formData)
          .then((result) => {
            if (result.error) {
              throw new Error(result.error.message);
            }
            
            setVolunteer({ ...volunteer, ...formData });
            setIsEditing(false);
            success('Voluntário atualizado com sucesso!');
          })
      );
    } catch (err) {
      console.error('Error updating volunteer:', err);
      error('Erro ao atualizar voluntário. Por favor, tente novamente.');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await withLoading(
        volunteerService.deleteVolunteer(id)
          .then((result) => {
            if (result.error) {
              throw new Error(result.error.message);
            }
            
            success('Voluntário excluído com sucesso!');
            navigate('/volunteers');
          })
      );
    } catch (err) {
      console.error('Error deleting volunteer:', err);
      error('Erro ao excluir voluntário. Por favor, tente novamente.');
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Não informado';
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const formatEventDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM", { locale: ptBR });
  };

  if (isLoading && !volunteer) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-servem-primary"></div>
      </div>
    );
  }

  if (!volunteer) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
        <p className="text-gray-500">Voluntário não encontrado</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Editar Voluntário</h1>
          <p className="mt-1 text-sm text-gray-500">
            Atualize as informações do voluntário
          </p>
        </div>

        <VolunteerForm 
          initialData={volunteer} 
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
          <h1 className="text-2xl font-semibold text-gray-900">{volunteer.name}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Detalhes do voluntário
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
                    Excluir voluntário
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Tem certeza que deseja excluir este voluntário? Esta ação não pode ser desfeita.
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

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Informações Pessoais</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Dados do voluntário</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Nome completo</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{volunteer.name}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{volunteer.email}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Telefone</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{volunteer.phone || 'Não informado'}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Data de Nascimento</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(volunteer.birth_date)}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Endereço</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{volunteer.address || 'Não informado'}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Informações do Ministério</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Detalhes sobre a atuação na igreja</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Departamento</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{volunteer.department || 'Não atribuído'}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Função</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{volunteer.role || 'Não atribuída'}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 sm:mt-0 sm:col-span-2">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${volunteer.status === 'Ativo' ? 'bg-green-100 text-green-800' : 
                    volunteer.status === 'Inativo' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'}`}>
                  {volunteer.status}
                </span>
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Observações</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{volunteer.notes || 'Nenhuma observação'}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Volunteer Events */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Eventos Participados</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Histórico de participação em eventos</p>
        </div>
        <div className="border-t border-gray-200">
          {volunteerEvents.length > 0 ? (
            <ul role="list" className="divide-y divide-gray-200">
              {volunteerEvents.map((event) => (
                <li key={event.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-servem-accent flex items-center justify-center">
                        <CalendarIcon className="h-5 w-5 text-white" aria-hidden="true" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                        <div className="text-sm text-gray-500">
                          {formatEventDate(event.event_date)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-500">
                        {event.start_time.substring(0, 5)} - {event.end_time.substring(0, 5)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-5 sm:px-6 text-center text-sm text-gray-500">
              Este voluntário ainda não participou de nenhum evento.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerDetails;
