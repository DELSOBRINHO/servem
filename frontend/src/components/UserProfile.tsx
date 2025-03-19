import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  ministry: string;
  availability: any;
}

interface UserProfileProps {
  userId: string;
}

const UserProfile = ({ userId }: UserProfileProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    ministry: "",
    availability: {}
  });
  
  const daysOfWeek = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();
        
      if (error) throw error;
      
      setUser(data);
      setFormData({
        name: data.name || "",
        ministry: data.ministry || "",
        availability: data.availability || {}
      });
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvailabilityChange = (day: string, available: boolean) => {
    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        [day]: available
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from("users")
        .update({
          name: formData.name,
          ministry: formData.ministry,
          availability: formData.availability
        })
        .eq("id", userId);
        
      if (error) throw error;
      
      alert("Perfil atualizado com sucesso!");
      setEditing(false);
      fetchUserProfile();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert(error.message || "Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return <div className="text-center py-4">Carregando perfil...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Seu Perfil</h2>
      
      {!editing ? (
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-medium">Informações Pessoais</h3>
            <p><strong>Nome:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Função:</strong> {user?.role === "líder" ? "Líder" : "Voluntário"}</p>
            <p><strong>Ministério:</strong> {user?.ministry || "Não informado"}</p>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium">Disponibilidade</h3>
            {daysOfWeek.map(day => (
              <div key={day} className="flex items-center mb-1">
                <span className="w-32">{day}:</span>
                <span className={user?.availability?.[day] ? "text-green-600" : "text-red-600"}>
                  {user?.availability?.[day] ? "Disponível" : "Indisponível"}
                </span>
              </div>
            ))}
          </div>
          
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Editar Perfil
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nome</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Ministério</label>
            <input
              type="text"
              name="ministry"
              value={formData.ministry}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Ex: Louvor, Infantil, Recepção..."
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Disponibilidade</label>
            {daysOfWeek.map(day => (
              <div key={day} className="flex items-center mb-2">
                <span className="w-32">{day}:</span>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={formData.availability?.[day] === true}
                      onChange={() => handleAvailabilityChange(day, true)}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">Disponível</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={formData.availability?.[day] === false}
                      onChange={() => handleAvailabilityChange(day, false)}
                      className="form-radio h-4 w-4 text-red-600"
                    />
                    <span className="ml-2">Indisponível</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserProfile;