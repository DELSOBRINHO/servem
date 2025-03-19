import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

interface Volunteer {
  id: string;
  name: string;
  email: string;
  status: string;
  notified_at: string;
}

interface VolunteerManagementProps {
  programId: string;
  programName: string;
}

const VolunteerManagement = ({ programId, programName }: VolunteerManagementProps) => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVolunteers();
  }, [programId]);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("event_volunteers")
        .select(`
          id,
          status,
          notified_at,
          volunteer_id,
          users:volunteer_id (id, name, email)
        `)
        .eq("event_id", programId);
      
      if (error) throw error;
      
      // Transform the data to match our Volunteer interface
      const formattedData = data.map(item => ({
        id: item.id,
        name: item.users.name,
        email: item.users.email,
        status: item.status,
        notified_at: item.notified_at
      }));
      
      setVolunteers(formattedData);
    } catch (error) {
      console.error("Error fetching volunteers:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateVolunteerStatus = async (volunteerId: string, volunteerEmail: string, volunteerName: string, status: string) => {
    try {
      const { error } = await supabase
        .from("event_volunteers")
        .update({ status })
        .eq("id", volunteerId);
      
      if (error) throw error;
      
      // Enviar notificação
      await notifyVolunteer(
        volunteerId,
        volunteerEmail,
        programName,
        status as 'aceito' | 'recusado'
      );
      
      // Refresh the list
      fetchVolunteers();
      
      alert(`Voluntário ${status === 'aceito' ? 'aceito' : 'recusado'} com sucesso!`);
    } catch (error) {
      console.error("Error updating volunteer status:", error);
      alert(error.message || "Erro ao atualizar status do voluntário");
    }
  };

  return (    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">
        Voluntários para: {programName}
      </h2>
      
      {loading ? (
        <div className="text-center py-4">Carregando voluntários...</div>
      ) : volunteers.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          Nenhum voluntário se inscreveu para este programa ainda.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Inscrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {volunteers.map((volunteer) => (
                <tr key={volunteer.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {volunteer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {volunteer.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${volunteer.status === 'aceito' ? 'bg-green-100 text-green-800' : 
                        volunteer.status === 'recusado' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {volunteer.status === 'aceito' ? 'Aceito' : 
                       volunteer.status === 'recusado' ? 'Recusado' : 'Pendente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(volunteer.notified_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {volunteer.status === 'pendente' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateVolunteerStatus(volunteer.id, 'aceito')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Aceitar
                        </button>
                        <button
                          onClick={() => updateVolunteerStatus(volunteer.id, 'recusado')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Recusar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VolunteerManagement;
