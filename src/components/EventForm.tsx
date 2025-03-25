import React, { useState } from 'react';
import Button from './Button';

interface EventData {
  title?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  description?: string;
  department?: string;
  [key: string]: any;
}

interface EventFormProps {
  onSubmit: (data: EventData) => void;
  initialData?: EventData;
  isEditing?: boolean;
}

const EventForm: React.FC<EventFormProps> = ({ onSubmit, initialData = {}, isEditing = false }) => {
  const [formData, setFormData] = useState<EventData>({
    title: initialData.title || '',
    date: initialData.date || '',
    startTime: initialData.startTime || '',
    endTime: initialData.endTime || '',
    location: initialData.location || '',
    description: initialData.description || '',
    department: initialData.department || '',
    ...initialData
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
            <h3 className="text-lg font-medium leading-6 text-servem-primary">
              {isEditing ? 'Editar Evento' : 'Criar Novo Evento'}
            </h3>
            <p className="mt-1 text-sm text-servem-neutral">
              Preencha as informações para {isEditing ? 'atualizar o' : 'criar um novo'} evento.
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-4">
                <label htmlFor="title" className="block text-sm font-medium text-servem-neutral">
                  Título do Evento
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="mt-1 focus:ring-servem-primary focus:border-servem-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="date" className="block text-sm font-medium text-servem-neutral">
                  Data
                </label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="mt-1 focus:ring-servem-primary focus:border-servem-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="department" className="block text-sm font-medium text-servem-neutral">
                  Departamento
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-servem-primary focus:border-servem-primary sm:text-sm"
                >
                  <option value="">Selecione um departamento</option>
                  <option value="musica">Música</option>
                  <option value="escola-sabatina">Escola Sabatina</option>
                  <option value="jovens">Jovens</option>
                  <option value="criancas">Ministério da Criança</option>
                  <option value="evangelismo">Evangelismo</option>
                  <option value="mordomia">Mordomia</option>
                </select>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="startTime" className="block text-sm font-medium text-servem-neutral">
                  Hora de Início
                </label>
                <input
                  type="time"
                  name="startTime"
                  id="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className="mt-1 focus:ring-servem-primary focus:border-servem-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="endTime" className="block text-sm font-medium text-servem-neutral">
                  Hora de Término
                </label>
                <input
                  type="time"
                  name="endTime"
                  id="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  className="mt-1 focus:ring-servem-primary focus:border-servem-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="location" className="block text-sm font-medium text-servem-neutral">
                  Local
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="mt-1 focus:ring-servem-primary focus:border-servem-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-servem-neutral">
                  Descrição
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 focus:ring-servem-primary focus:border-servem-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="button" variant="outline" className="mr-3">
          Cancelar
        </Button>
        <Button type="submit" variant="primary">
          {isEditing ? 'Atualizar Evento' : 'Criar Evento'}
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
