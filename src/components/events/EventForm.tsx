import React, { useState } from 'react';
import { Event } from '../../types/Event';

interface EventFormProps {
  initialData?: Partial<Event>;
  onSubmit: (data: Partial<Event>) => void;
  isSubmitting: boolean;
}

const EventForm: React.FC<EventFormProps> = ({ initialData = {}, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    event_date: '',
    start_time: '',
    end_time: '',
    location: '',
    description: '',
    volunteers_needed: 0,
    ...initialData
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric values
    if (name === 'volunteers_needed') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Informações do Evento</h3>
            <p className="mt-1 text-sm text-gray-500">
              Detalhes básicos sobre o evento.
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Título do Evento
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 focus:ring-servem-primary focus:border-servem-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="event_date" className="block text-sm font-medium text-gray-700">
                  Data
                </label>
                <input
                  type="date"
                  name="event_date"
                  id="event_date"
                  required
                  value={formData.event_date}
                  onChange={handleChange}
                  className="mt-1 focus:ring-servem-primary focus:border-servem-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Local
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={formData.location || ''}
                  onChange={handleChange}
                  className="mt-1 focus:ring-servem-primary focus:border-servem-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">
                  Horário de Início
                </label>
                <input
                  type="time"
                  name="start_time"
                  id="start_time"
                  required
                  value={formData.start_time}
                  onChange={handleChange}
                  className="mt-1 focus:ring-servem-primary focus:border-servem-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">
                  Horário de Término
                </label>
                <input
                  type="time"
                  name="end_time"
                  id="end_time"
                  required
                  value={formData.end_time}
                  onChange={handleChange}
                  className="mt-1 focus:ring-servem-primary focus:border-servem-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description || ''}
                  onChange={handleChange}
                  className="mt-1 focus:ring-servem-primary focus:border-servem-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="volunteers_needed" className="block text-sm font-medium text-gray-700">
                  Voluntários Necessários
                </label>
                <input
                  type="number"
                  name="volunteers_needed"
                  id="volunteers_needed"
                  min="0"
                  value={formData.volunteers_needed || 0}
                  onChange={handleChange}
                  className="mt-1 focus:ring-servem-primary focus:border-servem-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-servem-primary"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-servem-accent hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-servem-accent disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Salvando...
            </>
          ) : (
            'Salvar'
          )}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
