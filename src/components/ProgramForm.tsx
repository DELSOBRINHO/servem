import { useState } from "react";
import { supabase } from "../supabaseClient";
import Button from "./Button";

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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-servem-primary mb-6">Cadastrar Novo Programa</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-servem-neutral font-medium mb-1">Nome do Programa</label>
          <input
            type="text"
            name="name"
            value={program.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-servem-secondary focus:border-servem-secondary transition-colors"
            required
          />
        </div>
       
        <div>
          <label className="block text-servem-neutral font-medium mb-1">Categoria</label>
          <select
            name="category"
            value={program.category}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-servem-secondary focus:border-servem-secondary transition-colors"
          >
            <option value="Programas da Igreja">Programas da Igreja</option>
            <option value="Programas Comunitários">Programas Comunitários</option>
            <option value="Programas de Treinamento">Programas de Treinamento</option>
          </select>
        </div>
       
        <div>
          <label className="block text-servem-neutral font-medium mb-1">Descrição</label>
          <textarea
            name="description"
            value={program.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-servem-secondary focus:border-servem-secondary transition-colors"
            rows={3}
          />
        </div>
       
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-servem-neutral font-medium mb-1">Dia da Semana</label>
            <select
              name="day_of_week"
              value={program.day_of_week}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-servem-secondary focus:border-servem-secondary transition-colors"
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
            <label className="block text-servem-neutral font-medium mb-1">Horário de Início</label>
            <input
              type="time"
              name="start_time"
              value={program.start_time}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-servem-secondary focus:border-servem-secondary transition-colors"
              required
            />
          </div>
         
          <div>
            <label className="block text-servem-neutral font-medium mb-1">Duração</label>
            <select
              name="duration"
              value={program.duration}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-servem-secondary focus:border-servem-secondary transition-colors"
            >
              <option value="00:30:00">30 minutos</option>
              <option value="01:00:00">1 hora</option>
              <option value="01:30:00">1 hora e 30 minutos</option>
              <option value="02:00:00">2 horas</option>
              <option value="02:30:00">2 horas e 30 minutos</option>
              <option value="03:00:00">3 horas</option>
            </select>
          </div>
        </div>
       
        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Cadastrando...
              </div>
            ) : (
              "Cadastrar Programa"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProgramForm;
