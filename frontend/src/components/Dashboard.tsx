import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ProgramCalendar from "./ProgramCalendar";
import Notifications from "./Notifications";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Program {
  id: string;
  name: string;
  category: string;
  description: string;
  day_of_week: string;
  start_time: string;
  duration: string;
  leader_id: string;
}

interface DashboardProps {
  user: User | null;
}

const Dashboard = ({ user }: DashboardProps) => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [timeFilter, setTimeFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchPrograms();
  }, [user]);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      let query = supabase.from("church_programs").select("*");
      
      // Se o usuário for um líder, mostrar apenas seus programas
      if (user?.role === "líder") {
        query = query.eq("leader_id", user.id);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error("Erro ao buscar programas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVolunteer = async (programId: string) => {
    if (!user) return;
    
    try {
      // Verificar se o usuário já se voluntariou para este programa
      const { data: existingVolunteer, error: checkError } = await supabase
        .from("event_volunteers")
        .select("*")
        .eq("event_id", programId)
        .eq("volunteer_id", user.id)
        .single();
      
      if (checkError && checkError.code !== "PGRST116") { // PGRST116 = not found, que é o que queremos
        throw checkError;
      }
      
      if (existingVolunteer) {
        alert("Você já se voluntariou para este programa!");
        return;
      }
      
      // Buscar informações do programa e do líder
      const { data: program, error: programError } = await supabase
        .from("church_programs")
        .select("*, leader:leader_id(id, email)")
        .eq("id", programId)
        .single();
      
      if (programError) throw programError;
      
      // Inserir novo voluntário
      const { error } = await supabase.from("event_volunteers").insert([
        {
          event_id: programId,
          volunteer_id: user.id,
          status: "pendente"
        }
      ]);
      
      if (error) throw error;
      
      // Notificar o líder
      const { notifyLeader } = await import("../services/notificationService");
      await notifyLeader(
        program.leader.id,
        program.leader.email,
        user.name,
        program.name
      );
      
      alert("Você se voluntariou para este programa! Aguarde a confirmação do líder.");
    } catch (error) {
      console.error("Erro ao se voluntariar:", error);
      alert(error.message || "Erro ao se voluntariar");
    }
  };

  const filteredPrograms = programs.filter(program => {
    // Filtrar por categoria
    if (selectedCategory && program.category !== selectedCategory) return false;
    
    // Filtrar por dia da semana
    if (selectedDay && program.day_of_week !== selectedDay) return false;
    
    // Filtrar por termo de busca (nome ou descrição)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = program.name.toLowerCase().includes(searchLower);
      const descMatch = program.description?.toLowerCase().includes(searchLower) || false;
      if (!nameMatch && !descMatch) return false;
    }
    
    // Filtrar por horário
    if (timeFilter) {
      const [filterHour] = timeFilter.split(':');
      const [programHour] = program.start_time.split(':');
      if (filterHour !== programHour) return false;
    }
    
    return true;
  });

  const categories = ["Programas da Igreja", "Programas Comunitários", "Programas de Treinamento"];
  const days = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  const timeOptions = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", 
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">
          {user?.role === "líder" ? "Seus Programas" : "Programas Disponíveis"}
        </h2>
        
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <button 
              onClick={() => setViewMode("list")} 
              className={`px-3 py-1 rounded ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              Lista
            </button>
            <button 
              onClick={() => setViewMode("calendar")} 
              className={`px-3 py-1 rounded ${viewMode === "calendar" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              Calendário
            </button>
          </div>
          
          {user && <Notifications userId={user.id} />}
        </div>
      </div>
      
      {viewMode === "list" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Buscar</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Nome ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Categoria</label>
              <select
                className="w-full p-2 border rounded"
                value={selectedCategory || ""}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
              >
                <option value="">Todas as categorias</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Dia da Semana</label>
              <select
                className="w-full p-2 border rounded"
                value={selectedDay || ""}
                onChange={(e) => setSelectedDay(e.target.value || null)}
              >
                <option value="">Todos os dias</option>
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Horário</label>
              <select
                className="w-full p-2 border rounded"
                value={timeFilter || ""}
                onChange={(e) => setTimeFilter(e.target.value || null)}
              >
                <option value="">Todos os horários</option>
                {timeOptions.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedDay(null);
                setSearchTerm("");
                setTimeFilter(null);
              }}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Limpar filtros
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-4">Carregando programas...</div>
          ) : filteredPrograms.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              Nenhum programa encontrado com os filtros selecionados.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPrograms.map((program) => (
                <div key={program.id} className="border p-4 rounded hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{program.name}</h3>
                      <p className="text-sm text-gray-500">{program.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{program.day_of_week}</p>
                      <p className="text-sm text-gray-600">
                        {program.start_time.substring(0, 5)} 
                      </p>
                    </div>
                  </div>
                  
                  {program.description && (
                    <p className="mt-2 text-gray-700">{program.description}</p>
                  )}
                  
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Duração: {formatDuration(program.duration)}
                    </span>
                    
                    {user?.role === "voluntário" && (
                      <button
                        onClick={() => handleVolunteer(program.id)}
                        className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Voluntariar-se
                      </button>
                    )}
                    
                    {user?.role === "líder" && user.id === program.leader_id && (
                      <button
                        onClick={() => navigateToVolunteers(program.id)}
                        className="bg-green-600 text-white px-4 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                      >
                        Ver Voluntários
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      
      {viewMode === "calendar" && (
        <ProgramCalendar 
          userId={user?.id} 
          isLeader={user?.role === "líder"} 
        />
      )}
    </div>
  );
};

// Função auxiliar para formatar duração
const formatDuration = (duration: string) => {
  // Formato esperado: "HH:MM:SS"
  const parts = duration.split(':');
  const hours = parseInt(parts[0]);
  const minutes = parseInt(parts[1]);
  
  if (hours === 0) {
    return `${minutes} minutos`;
  } else if (hours === 1 && minutes === 0) {
    return `1 hora`;
  } else if (minutes === 0) {
    return `${hours} horas`;
  } else {
    return `${hours}h ${minutes}min`;
  }
};

// Função auxiliar para navegar para a página de voluntários
const navigateToVolunteers = (programId: string) => {
  // Em uma aplicação completa, isso seria implementado com React Router
  window.location.href = `/programas/${programId}/voluntarios`;
};

export default Dashboard;