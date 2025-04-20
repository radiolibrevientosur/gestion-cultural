import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Plus, Calendar as CalendarIcon, Clock, MapPin, Users } from 'lucide-react';
import { useCultural } from '../../context/CulturalContext';
import { EventoCulturalForm } from './EventoCulturalForm';
import 'react-day-picker/dist/style.css';

export const CalendarView: React.FC = () => {
  const { state } = useCultural();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState<string | null>(null);

  const getEventsForDate = (date: Date) => {
    return state.events.filter(event => 
      format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const getBirthdaysForDate = (date: Date) => {
    return state.birthdays.filter(birthday => 
      format(birthday.birthDate, 'MM-dd') === format(date, 'MM-dd')
    );
  };

  const getTasksForDate = (date: Date) => {
    return state.tasks.filter(task => 
      format(task.dueDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  const selectedDateBirthdays = selectedDate ? getBirthdaysForDate(selectedDate) : [];
  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  if (isCreatingEvent) {
    return (
      <EventoCulturalForm
        onComplete={() => setIsCreatingEvent(false)}
        initialDate={selectedDate}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Calendario Cultural</h2>
        <button
          onClick={() => setIsCreatingEvent(true)}
          className="flex items-center px-4 py-2 bg-cultural-escenicas text-white rounded-lg hover:bg-cultural-escenicas/90 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Evento
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md overflow-x-auto">
          <div className="min-w-[280px] w-full flex justify-center">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={es}
              modifiers={{
                hasEvents: (date) => 
                  getEventsForDate(date).length > 0 ||
                  getBirthdaysForDate(date).length > 0 ||
                  getTasksForDate(date).length > 0
              }}
              modifiersStyles={{
                hasEvents: { 
                  backgroundColor: '#FF7F50',
                  color: 'white'
                }
              }}
              styles={{
                caption: { color: 'inherit' },
                head_cell: { color: 'inherit' },
                cell: { color: 'inherit' },
                day: { color: 'inherit' }
              }}
              className="rdp-custom max-w-full"
            />
          </div>
        </div>

        <div className="space-y-6">
          {selectedDate && (
            <>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {format(selectedDate, "d 'de' MMMM, yyyy", { locale: es })}
                </h3>

                {selectedDateEvents.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Eventos</h4>
                    <div className="space-y-4">
                      {selectedDateEvents.map(event => (
                        <div
                          key={event.id}
                          className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          onClick={() => setShowEventDetails(event.id)}
                        >
                          <h5 className="font-medium text-gray-900 dark:text-white">{event.title}</h5>
                          <div className="mt-2 space-y-1 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              <span>{format(event.date, 'HH:mm')}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-2" />
                              <span>{event.targetAudience}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDateBirthdays.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Cumpleaños</h4>
                    <div className="space-y-2">
                      {selectedDateBirthdays.map(birthday => (
                        <div key={birthday.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                          <p className="text-gray-900 dark:text-white">🎂 {birthday.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{birthday.role}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDateTasks.length > 0 && (
                  <div>
                    <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Tareas</h4>
                    <div className="space-y-2">
                      {selectedDateTasks.map(task => (
                        <div key={task.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                          <p className="text-gray-900 dark:text-white">📋 {task.title}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{task.status}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDateEvents.length === 0 && 
                 selectedDateBirthdays.length === 0 && 
                 selectedDateTasks.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No hay eventos programados para este día
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};