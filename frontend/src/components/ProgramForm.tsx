import { useState } from "react";
import { supabase } from "../supabaseClient";

interface ProgramFormProps {
  userId: string;
}

const ProgramForm = ({ userId }: ProgramFormProps) => {
  const [loading, setLoading] = useState(false);
  const [program, setProgram] = useState({
    name: "",
    category: "Programas da Igreja",
    description: "",
    day_of_week: "Domingo",
    start_time: "09:00",
    duration: "01:00:00", // 1 hour in HH:MM:SS format
    leader_id: userId
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setProgram({ ...program, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("church_programs")
        .insert([program]);
      
      if (error) throw error;
      
      alert("Programa cadastrado com sucesso!");
      // Reset form
      setProgram({
        ...program,
        name: "",
        description: "",
      });
    } catch (error) {
      console.error("Erro ao cadastrar programa:", error);
      alert(error.message || "Erro ao cadastrar programa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-1">Nome do Programa</label>
        <input
          type="text"
          name="name"
          value={program.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      
      <div>
        <label className="block text-gray-700 mb-1">Categoria</label>
        <select
          name="category"
          value={program.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="Programas da Igreja">Programas da Igreja</option>
          <option value="Programas Comunitários">Programas Comunitários</option>
          <option value="Programas de Treinamento">Programas de Treinamento</option>
        </select>
      </div>
      
      <div>
        <label className="block text-gray-700 mb-1">Descrição</label>
        <textarea
          name="description"
          value={program.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows={3}
        />
      </div>
      
      <div>
        <label className="block text-gray-700 mb-1">Dia da Semana</label>
        <select
          name="day_of_week"
          value={program.day_of_week}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="Domingo">Domingo</option>
          <option value="Segunda-feira">Segunda-feira</option>
          <option value="Terça-feira">Terça-feira</option>
          <option value="Quarta-feira">Quarta-feira</option>
          <option value="Quinta-feira">Quinta-feira</option>
          <option value="Sexta-feira">Sexta-feira</option>
          <option value="Sábado">Sábado</option>
        </select>
      </div>
      
      <div>
        <label className="block text-gray-700 mb-1">Horário de Início</label>
        <input
          type="time"
          name="start_time"
          value={program.start_time}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      
      <div>
        <label className="block text-gray-700 mb-1">Duração (horas)</label>
        <select
          name="duration"
          value={program.duration}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="00:30:00">30 minutos</option>
          <option value="01:00:00">1 hora</option>
          <option value="01:30:00">1 hora e 30 minutos</option>
          <option value="02:00:00">2 horas</option>
          <option value="02:30:00">2 horas e 30 minutos</option>
          <option value="03:00:00">3 horas</option>
        </select>
      </div>
      
      <button
        type="submit"
        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        disabled={loading}
      >
        {loading ? "Cadastrando..." : "Cadastrar Programa"}
      </button>
    </form>
  );
};

export default ProgramForm;
