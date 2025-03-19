import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { supabase } from '../supabaseClient';

// Configurar localização para português
moment.locale('pt-br');
const localizer = momentLocalizer(moment);

interface Program {
  id: string;
  name: string;
  category: string;
  description: string;
  day_of_week: string;
  start_time: string;
  duration: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Program;
}

const dayMapping = {
  'Domingo': 0,
  'Segunda-feira': 1,
  'Terça-feira': 2,
  'Quarta-feira': 3,
  'Quinta-feira': 4,
  'Sexta-feira': 5,
  'Sábado': 6
};

const ProgramCalendar = ({ userId, isLeader }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('week');

  useEffect(() => {
    fetchPrograms();
  }, [userId, isLeader]);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      let query = supabase.from("church_programs").select("*");
      
      if (isLeader) {
        query = query.eq("leader_id", userId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Converter programas para eventos do calendário
      const calendarEvents = createCalendarEvents(data || []);
      setEvents(calendarEvents);
    } catch (error) {
      console.error('Erro ao buscar programas:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCalendarEvents = (programs: Program[]): CalendarEvent[] => {
    const today = new Date();
    const startOfWeek = moment(today).startOf('week').toDate();
    
    return programs.flatMap(program => {
      // Obter o dia da semana como número (0 = domingo, 1 = segunda, etc.)
      const dayOfWeek = dayMapping[program.day_of_week];
      
      // Criar data para este programa na semana atual
      const eventDate = moment(startOfWeek).add(dayOfWeek, 'days');
      
      // Definir hora de início
      const [hours, minutes] = program.start_time.split(':');
      eventDate.set({ hours: parseInt(hours), minutes: parseInt(minutes) });
      
      // Calcular hora de término com base na duração
      const durationParts = program.duration.split(':');
      const durationHours = parseInt(durationParts[0]);
      const durationMinutes = parseInt(durationParts[1]);
      
      const endDate = moment(eventDate).add(durationHours, 'hours').add(durationMinutes, 'minutes');
      
      // Criar eventos para as próximas 4 semanas
      const events = [];
      for (let i = 0; i < 4; i++) {
        const weekOffset = i * 7; // 7 dias por semana
        
        events.push({
          id: `${program.id}-${i}`,
          title: program.name,
          start: moment(eventDate).add(weekOffset, 'days').toDate(),
          end: moment(endDate).add(weekOffset, 'days').toDate(),
          resource: program
        });
      }
      
      return events;
    });
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    alert(`
      Programa: ${event.title}
      Categoria: ${event.resource.category}
      Descrição: ${event.resource.description || 'Sem descrição'}
      Horário: ${moment(event.start).format('HH:mm')} - ${moment(event.end).format('HH:mm')}
    `);
  };

  if (loading) {
    return <div className="text-center py-8">Carregando calendário...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Calendário de Programações</h2>
      
      <div className="mb-4">
        <button 
          onClick={() => setView('month')} 
          className={`mr-2 px-3 py-1 rounded ${view === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Mês
        </button>
        <button 
          onClick={() => setView('week')} 
          className={`mr-2 px-3 py-1 rounded ${view === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Semana
        </button>
        <button 
          onClick={() => setView('day')} 
          className={`px-3 py-1 rounded ${view === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Dia
        </button>
      </div>
      
      <div style={{ height: 600 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          onSelectEvent={handleSelectEvent}
          view={view}
          onView={setView}
          messages={{
            week: 'Semana',
            day: 'Dia',
            month: 'Mês',
            previous: 'Anterior',
            next: 'Próximo',
                      today: 'Hoje',
                      agenda: 'Agenda',
                      date: 'Data',
                      time: 'Hora',
                      event: 'Evento',
                      allDay: 'Dia inteiro',
                      noEventsInRange: 'Não há eventos neste período'
                    }}
                    formats={{
                      timeGutterFormat: (date, culture, localizer) => localizer.format(date, 'HH:mm', culture),
                      eventTimeRangeFormat: ({ start, end }, culture, localizer) => {
                        return `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`
                      }
                    }}
                    eventPropGetter={(event) => {
                      // Definir cores diferentes para cada categoria
                      let backgroundColor = '#3174ad'; // Azul padrão
            
                      if (event.resource.category === 'Programas da Igreja') {
                        backgroundColor = '#4CAF50'; // Verde
                      } else if (event.resource.category === 'Programas Comunitários') {
                        backgroundColor = '#FF9800'; // Laranja
                      } else if (event.resource.category === 'Programas de Treinamento') {
                        backgroundColor = '#9C27B0'; // Roxo
                      }
            
                      return { style: { backgroundColor } }
                    }}
                  />
                </div>
              </div>
            )
}

export default ProgramCalendar