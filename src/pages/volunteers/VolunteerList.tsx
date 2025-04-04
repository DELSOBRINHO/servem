import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { volunteerService } from '../../services/volunteerService';
import { departmentService } from '../../services/departmentService';
import { useLoading } from '../../hooks/useLoading';
import { useNotificationContext } from '../../contexts/NotificationContext';
import { Volunteer } from '../../types/Volunteer';
import { Department } from '../../types/Department';
import { 
  UserPlusIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

const VolunteerList: React.FC = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const { isLoading, withLoading } = useLoading(true);
  const { error } = useNotificationContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await withLoading(Promise.all([
          volunteerService.getVolunteers(),
          departmentService.getDepartments()
        ]).then(([volunteersData, departmentsData]) => {
          setVolunteers(volunteersData);
          setDepartments(departmentsData);
        }));
      } catch (err) {
        console.error('Error fetching data:', err);
        error('Erro ao carregar os dados dos voluntários');
      }
    };

    fetchData();
  }, []);

  const handleExportCSV = async () => {
    try {
      // Get all volunteers for export
      const allVolunteers = await volunteerService.getVolunteers();
      
      // Convert to CSV
      const headers = ['Nome', 'Email', 'Telefone', 'Departamento', 'Status', 'Data de Nascimento', 'Endereço'];
      const csvData = allVolunteers.map(v => [
        v.name,
        v.email,
        v.phone || '',
        v.department || '',
        v.status,
        v.birth_date || '',
        v.address || ''
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
      link.setAttribute('download', `voluntarios_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error exporting volunteers:', err);
      error('Erro ao exportar voluntários');
    }
  };

  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          volunteer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment ? volunteer.department === filterDepartment : true;
    const matchesStatus = filterStatus ? volunteer.status === filterStatus : true;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Voluntários</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerenciamento de voluntários da igreja
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/volunteers/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-servem-primary hover:bg-servem-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-servem-primary"
          >
            <UserPlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Novo Voluntário
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
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
                  placeholder="Buscar por nome ou email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">Departamento</label>
              <select
                id="department"
                name="department"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-servem-primary focus:border-servem-primary sm:text-sm rounded-md"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                <option value="">Todos</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.name}>{dept.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <select
                id="status"
                name="status"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-servem-primary focus:border-servem-primary sm:text-sm rounded-md"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
                <option value="Afastado">Afastado</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-between">
            <div className="text-sm text-gray-500">
              {filteredVolunteers.length} voluntários encontrados
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

      {/* Volunteers List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-servem-primary"></div>
        </div>
      ) : (
        <AnimatedList
          items={filteredVolunteers}
          keyExtractor={(volunteer) => volunteer.id}
          emptyMessage="Nenhum voluntário encontrado"
          renderItem={(volunteer) => (
            <li className="py-4">
              <Link to={`/volunteers/${volunteer.id}`} className="block hover:bg-gray-50 transition duration-150 ease-in-out">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-servem-primary bg-opacity-20 flex items-center justify-center text-servem-primary">
                        <UserIcon className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-servem-primary truncate">{volunteer.name}</p>
                        <p className="text-sm text-gray-500">{volunteer.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        volunteer.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {volunteer.status}
                      </span>
                      <div className="text-sm text-gray-500 mt-1">{volunteer.department}</div>
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

export default VolunteerList;
