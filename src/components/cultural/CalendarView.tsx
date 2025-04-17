import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useCultural } from '../context/CulturalContext';
import 'react-day-picker/dist/style.css';

export const CalendarView = () => {
  const { state } = useCultural();

  // Combinar todas las fechas relevantes
  const eventDates = state.events.map(event => event.date);
  const birthdayDates = state.birthdays.map(birthday => birthday.birthDate);
  const taskDates = state.tasks.map(task => task.dueDate);
  const allDates = [...eventDates, ...birthdayDates, ...taskDates];

  // Obtener elementos para una fecha específica
  const getItemsForDate = (date: Date) => {
    return {
      events: state.events.filter(e => format(e.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')),
      birthdays: state.birthdays.filter(b => format(b.birthDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')),
      tasks: state.tasks.filter(t => format(t.dueDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
    };
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Calendario de Actividades</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <DayPicker
          mode="single"
          locale={es}
          modifiers={{
            hasItems: (date) => allDates.some(d => 
              format(d, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
            )
          }}
          modifiersStyles={{
            hasItems: { 
              backgroundColor: 'rgba(229, 231, 235, 0.5)',
              border: '2px solid #3B82F6'
            }
          }}
          onDayClick={(date) => {
            const items = getItemsForDate(date);
            console.log('Actividades para', format(date, 'PP', { locale: es }), items);
          }}
          className="dark:bg-gray-800 dark:text-white"
          styles={{
            head_cell: { color: '#6B7280' },
            day: { color: '#1F2937' },
            caption: { color: '#111827' },
            nav_button: { backgroundColor: '#E5E7EB' }
          }}
        />
      </div>

      {/* Panel de Detalles */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Detalles de la Fecha Seleccionada</h3>
        <p className="text-gray-500 dark:text-gray-400">
          Haz clic en cualquier fecha con actividades para ver los detalles aquí.
        </p>
      </div>
    </div>
  );
};
