import React, { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { useCultural } from '../../context/CulturalContext';
import 'react-day-picker/dist/style.css';

interface CalendarButtonProps {
  onCreateEvent: () => void;
  onCreateBirthday: () => void;
  onCreateTask: () => void;
}

export const CalendarButton: React.FC<CalendarButtonProps> = ({
  onCreateEvent,
  onCreateBirthday,
  onCreateTask
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { state } = useCultural();

  // Combine all dates from events, birthdays, and tasks
  const eventDates = state.events.map(event => event.date);
  const birthdayDates = state.birthdays.map(birthday => birthday.birthDate);
  const taskDates = state.tasks.map(task => task.dueDate);

  const allDates = [...eventDates, ...birthdayDates, ...taskDates];

  // Function to get items for a specific date
  const getItemsForDate = (date: Date) => {
    const events = state.events.filter(event => 
      format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    const birthdays = state.birthdays.filter(birthday => 
      format(birthday.birthDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    const tasks = state.tasks.filter(task => 
      format(task.dueDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );

    return { events, birthdays, tasks };
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <CalendarIcon className="h-6 w-6 text-gray-600" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="bg-white rounded-lg shadow-lg p-4 w-auto min-w-[300px]"
          sideOffset={5}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Calendario</h3>
            <div className="flex space-x-2">
              <button
                onClick={onCreateEvent}
                className="p-1 hover:bg-gray-100 rounded text-sm flex items-center text-cultural-escenicas"
              >
                <Plus className="h-4 w-4 mr-1" />
                Evento
              </button>
              <button
                onClick={onCreateBirthday}
                className="p-1 hover:bg-gray-100 rounded text-sm flex items-center text-cultural-visuales"
              >
                <Plus className="h-4 w-4 mr-1" />
                Cumpleaños
              </button>
              <button
                onClick={onCreateTask}
                className="p-1 hover:bg-gray-100 rounded text-sm flex items-center text-cultural-musicales"
              >
                <Plus className="h-4 w-4 mr-1" />
                Tarea
              </button>
            </div>
          </div>

          <DayPicker
            mode="single"
            locale={es}
            modifiers={{
              hasItems: (date) => allDates.some(d => 
                format(d, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
              )
            }}
            modifiersStyles={{
              hasItems: { backgroundColor: '#E5E7EB' }
            }}
            onDayClick={(date) => {
              const items = getItemsForDate(date);
              // You can show a modal or tooltip with the items for this date
              console.log('Items for', format(date, 'PP'), items);
            }}
          />

          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};