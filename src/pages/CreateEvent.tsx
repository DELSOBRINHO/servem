import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

interface FormData {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  department: string;
  status: string;
}

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    department: '',
    status: 'Pendente'
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro do campo quando o usuário começa a digitar
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'O título é obrigatório';
    }
    
    if (!formData.date) {
      newErrors.date = 'A data é obrigatória';
    }
    
    if (!formData.startTime) {
      newErrors.startTime = 'O horário de início é obrigatório';
    }
    
    if (!formData.endTime) {
      newErrors.endTime = 'O horário de término é obrigatório';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'O local é obrigatório';
    }
    
    if (!formData.department) {
      newErrors.department = 'O departamento é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulação de envio para API - em uma aplicação real, você faria uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Dados do evento enviados:', formData);
      
      // Redirecionar para a lista de eventos após o sucesso
      navigate('/events');
    } catch (error) {
      console.error('Erro ao criar evento:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-servem-light">
      <Navbar />
      
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-servem-primary">Criar Novo Evento</h1>
            <Link to="/events">
              <Button variant="outline">
                Cancelar
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <form onSubmit={handleSubmit}>
                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label htmlFor="title" className="block text-sm font-medium text-servem-neutral">
                        Título do Evento
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="title"
                          id="title"
                          value={formData.title}
                          onChange={handleChange}
                          className={`shadow-sm focus:ring-servem-primary focus:border-servem-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                            errors.title ? 'border-red-500' : ''
                          }`}
                        />
                        {errors.title && (
                          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="date" className="block text-sm font-medium text-servem-neutral">
                        Data
                      </label>
                      <div className="mt-1">
                        <input
                          type="date"
                          name="date"
                          id="date"
                          value={formData.date}
                          onChange={handleChange}
                          className={`shadow-sm focus:ring-servem-primary focus:border-servem-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                            errors.date ? 'border-red-500' : ''
                          }`}
                        />
                        {errors.date && (
                          <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="department" className="block text-sm font-medium text-servem-neutral">
                        Departamento
                      </label>
                      <div className="mt-1">
                        <select
                          id="department"
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          className={`shadow-sm focus:ring-servem-primary focus:border-servem-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                            errors.department ? 'border-red-500' : ''
                          }`}
                        >
                          <option value="">Selecione um departamento</option>
                          <option value="musica">Música</option>
                          <option value="escola-sabatina">Escola Sabatina</option>
                          <option value="jovens">Jovens</option>
                          <option value="criancas">Ministério da Criança</option>
                          <option value="evangelismo">Evangelismo</option>
                          <option value="mordomia">Mordomia</option>
                        </select>
                        {errors.department && (
                          <p className="mt-1 text-sm text-red-600">{errors.department}</p>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="startTime" className="block text-sm font-medium text-servem-neutral">
                        Horário de Início
                      </label>
                      <div className="mt-1">
                        <input
                          type="time"
                          name="startTime"
                          id="startTime"
                          value={formData.startTime}
                          onChange={handleChange}
                          className={`shadow-sm focus:ring-servem-primary focus:border-servem-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                            errors.startTime ? 'border-red-500' : ''
                          }`}
                        />
                        {errors.startTime && (
                          <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="endTime" className="block text-sm font-medium text-servem-neutral">
                        Horário de Término
                      </label>
                      <div className="mt-1">
                        <input
                          type="time"
                          name="endTime"
                          id="endTime"
                          value={formData.endTime}
                          onChange={handleChange}
                          className={`shadow-sm focus:ring-servem-primary focus:border-servem-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                            errors.endTime ? 'border-red-500' : ''
                          }`}
                        />
                        {errors.endTime && (
                          <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="location" className="block text-sm font-medium text-servem-neutral">
                        Local
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="location"
                          id="location"
                          value={formData.location}
                          onChange={handleChange}
                          className={`shadow-sm focus:ring-servem-primary focus:border-servem-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                            errors.location ? 'border-red-500' : ''
                          }`}
                        />
                        {errors.location && (
                          <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="description" className="block text-sm font-medium text-servem-neutral">
                        Descrição
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="description"
                          name="description"
                          rows={3}
                          value={formData.description}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-servem-primary focus:border-servem-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <p className="mt-2 text-sm text-servem-neutral">
                        Breve descrição do evento e informações adicionais.
                      </p>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="status" className="block text-sm font-medium text-servem-neutral">
                        Status
                      </label>
                      <div className="mt-1">
                        <select
                          id="status"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-servem-primary focus:border-servem-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="Pendente">Pendente</option>
                          <option value="Confirmado">Confirmado</option>
                        </select>
                      </div>
                    </div>
                  </div>
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
                      'Criar Evento'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateEvent;
