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
      {editing ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Ministério</label>
            <input
              type="text"
              name="ministry"
              value={formData.ministry}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Disponibilidade</label>
            {daysOfWeek.map((day) => (
              <div key={day} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.availability[day] || false}
                  onChange={(e) => handleAvailabilityChange(day, e.target.checked)}
                />
                <span>{day}</span>
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Salvar
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
        </form>
      ) : (
        <>
          <p><strong>Nome:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Função:</strong> {user?.role}</p>
          <p><strong>Ministério:</strong> {user?.ministry}</p>
          <p><strong>Disponibilidade:</strong></p>
          <ul>
            {Object.entries(user?.availability || {}).map(([day, available]) => (
              <li key={day}>
                {day}: {available ? "Disponível" : "Indisponível"}
              </li>
            ))}
          </ul>
          <button
            onClick={() => setEditing(true)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Editar Perfil
          </button>
        </>
      )}
    </div>
  );
};

export default UserProfile;