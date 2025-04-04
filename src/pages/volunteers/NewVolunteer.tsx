import React from 'react';
import { useNavigate } from 'react-router-dom';
import { volunteerService } from '../../services/volunteerService';
import { useNotificationContext } from '../../contexts/NotificationContext';
import { useLoading } from '../../hooks/useLoading';
import VolunteerForm from '../../components/volunteers/VolunteerForm';
import { Volunteer } from '../../types/Volunteer';

const NewVolunteer: React.FC = () => {
  const navigate = useNavigate();
  const { success, error } = useNotificationContext();
  const { isLoading, withLoading } = useLoading();

  const handleSubmit = async (formData: Partial<Volunteer>) => {
    try {
      await withLoading(
        volunteerService.createVolunteer(formData)
          .then((result) => {
            if (result.error) {
              throw new Error(result.error.message);
            }
            success('Voluntário cadastrado com sucesso!');
            navigate('/volunteers');
          })
      );
    } catch (err) {
      console.error('Error creating volunteer:', err);
      error('Erro ao cadastrar voluntário. Por favor, tente novamente.');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Novo Voluntário</h1>
        <p className="mt-1 text-sm text-gray-500">
          Cadastre um novo voluntário no sistema
        </p>
      </div>

      <VolunteerForm onSubmit={handleSubmit} isSubmitting={isLoading} />
    </div>
  );
};

export default NewVolunteer;
