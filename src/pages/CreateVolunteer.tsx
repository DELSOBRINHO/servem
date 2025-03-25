import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

interface FormData {
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: string;
  address: string;
  birthdate: string;
  joinDate: string;
  skills: string;
  availability: string[];
  notes: string;
}

const CreateVolunteer: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    department: '',
    role: '',
    status: 'Ativo',
    address: '',
    birthdate: '',
    joinDate: '',
    skills: '',
    availability: [],
    notes: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    setFormData(prev => {
      if (checked) {
        return {
          ...prev,
          availability: [...prev.availability, value]
        };
      } else {
        return {
          ...prev,
          availability: prev.availability.filter(item => item !== value)
        };
      }
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'O nome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'O email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'O telefone é obrigatório';
    }
    
    if (!formData.department) {
      newErrors.department = 'O departamento é obrigatório';
    }
    
    if (!formData.role.trim()) {
      newErrors.role = 'A função é obrigatória';
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
      
      // Transformar a string de habilidades em um array
      const formattedData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean)
      };
      
      console.log('Dados do voluntário enviados:', formattedData);
      
      // Redirecionar para a lista de voluntários após o sucesso
      navigate('/volunteers');
    } catch (error) {
      console.error('Erro ao criar voluntário:', error);
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
            <h1 className="text-3xl font-bold text-servem-primary">Adicionar Novo Voluntário</h1>
            <Link to="/volunteers">
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
                    <div className="sm:col-span-3">
                      <label htmlFor="name" className="block text-sm font-medium text-servem-neutral">
                        Nome Completo
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`shadow-sm focus:ring-servem-primary focus:border-servem-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                            errors.name ? 'border-red-500' : ''
                          }`}
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="email" className="block text-sm font-medium text-servem-neutral">
                        Email
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`shadow-sm focus:ring-servem-primary focus:border-servem-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                            errors.email ? 'border-red-500' : ''
                          }`}
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="phone" className="block text-sm font-medium text-servem-neutral">
                        Telefone
                      </label>
                      <div className="mt-1">
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`shadow-sm focus:ring-servem-primary focus:border-servem-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                            errors.phone ? 'border-red-500' : ''
                          }`}
                        />
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="birthdate" className="block text-sm font-medium text-servem-neutral">
                        Data de Nascimento
                      </label>
                      <div className="mt-1">
                        <input
                          type="date"
                          name="birthdate"
                          id="birthdate"
                          value={formData.birthdate}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-servem-primary focus:border-servem-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        />
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
                      <label htmlFor="role" className="block text-sm font-medium text-servem-neutral">
                        Função
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="role"
                          id="role"
                          value={formData.role}
                          onChange={handleChange}
                          className={`shadow-sm focus:ring-servem-primary focus:border-servem-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                            errors.role ? 'border-red-500' : ''
                          }`}
                        />
                        {errors.role && (
                          <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="joinDate" className="block text-sm font-medium text-servem-neutral">
                        Data de Início
                      </label>
                      <div className="mt-1">
                        <input
                          type="date"
                          name="joinDate"
                          id="joinDate"
                          value={formData.joinDate}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-servem-primary focus:border-servem-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
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
                          <option value="Ativo">Ativo</option>
                          <option value="Inativo">Inativo</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="address" className="block text-sm font-medium text-servem-neutral">
                        Endereço
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="address"
                          id="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-servem-primary focus:border-servem-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="skills" className="block text-sm font-medium text-servem-neutral">
                        Habilidades
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="skills"
                          id="skills"
                          value={formData.skills}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-servem-primary focus:border-servem-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <p className="mt-2 text-sm text-servem-neutral">
                        Separe as habilidades por vírgula (ex: Piano, Violão, Canto)
                      </p>
                    </div>

                    <div className="sm:col-span-6">
                      <fieldset>
                        <legend className="text-sm font-medium text-servem-neutral">Disponibilidade</legend>
                        <div className="mt-4 space-y-4">
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="availability-sabado-manha"
                                name="availability"
                                type="checkbox"
                                value="Sábado - Manhã"
                                checked={formData.availability.includes('Sábado - Manhã')}
                                onChange={handleCheckboxChange}
                                className="focus:ring-servem-primary h-4 w-4 text-servem-primary border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="availability-sabado-manha" className="font-medium text-servem-neutral">
                                Sábado - Manhã
                              </label>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="availability-sabado-tarde"
                                name="availability"
                                type="checkbox"
                                value="Sábado - Tarde"
                                checked={formData.availability.includes('Sábado - Tarde')}
                                onChange={handleCheckboxChange}
                                className="focus:ring-servem-primary h-4 w-4 text-servem-primary border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="availability-sabado-tarde" className="font-medium text-servem-neutral">
                                Sábado - Tarde
                              </label>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="availability-domingo"
                                name="availability"
                                type="checkbox"
                                value="Domingo"
                                checked={formData.availability.includes('Domingo')}
                                onChange={handleCheckboxChange}
                                className="focus:ring-servem-primary h-4 w-4 text-servem-primary border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="availability-domingo" className="font-medium text-servem-neutral">
                                Domingo
                              </label>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="availability-quarta"
                                name="availability"
                                type="checkbox"
                                value="Quarta - Noite"
                                checked={formData.availability.includes('Quarta - Noite')}
                                onChange={handleCheckboxChange}
                                className="focus:ring-servem-primary h-4 w-4 text-servem-primary border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="availability-quarta" className="font-medium text-servem-neutral">
                                Quarta - Noite
                              </label>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="availability-sexta"
                                name="availability"
                                type="checkbox"
                                value="Sexta - Noite"
                                checked={formData.availability.includes('Sexta - Noite')}
                                onChange={handleCheckboxChange}
                                className="focus:ring-servem-primary h-4 w-4 text-servem-primary border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="availability-sexta" className="font-medium text-servem-neutral">
                                Sexta - Noite
                              </label>
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="notes" className="block text-sm font-medium text-servem-neutral">
                        Observações
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="notes"
                          name="notes"
                          rows={3}
                          value={formData.notes}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-servem-primary focus:border-servem-primary block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <p className="mt-2 text-sm text-servem-neutral">
                        Informações adicionais sobre o voluntário, experiências, formação, etc.
                      </p>
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
                      'Adicionar Voluntário'
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

export default CreateVolunteer;
