import React from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { useNotificationContext } from '../../contexts/NotificationContext';
import { useLoading } from '../../hooks/useLoading';
import EventForm from '../../components/events/EventForm';
import { Event } from '../../types/Event';

const NewEvent: React.FC = () => {
  const navigate = useNavigate();
  const { success, error } = useNotificationContext();
  const { isLoading, withLoading } = useLoading();

  const handleSubmit = async (formData: Partial<Event>) => {
    try {
      await withLoading(
        eventService.createEvent(formData)
          .then((result) => {
            if (result.error) {
              throw new Error(result.error.message);
            }
            success('Evento criado com sucesso!');
            navigate('/events');
          })
      );
    } catch (err) {
      console.error('Error creating event:', err);
      error('Erro ao criar evento. Por favor, tente novamente.');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Novo Evento</h1>
        <p className="mt-1 text-sm text-gray-500">
          Crie um novo evento para a igreja
        </p>
      </div>

      <EventForm onSubmit={handleSubmit} isSubmitting={isLoading} />
    </div>
  );
};

export default NewEvent;
