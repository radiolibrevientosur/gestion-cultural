import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useCultural } from '../../context/CulturalContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const CalendarView: React.FC = () => {
  const { state, dispatch } = useCultural();

  // Combine all events, tasks, and birthdays into calendar events
  const calendarEvents = [
    // Cultural Events
    ...state.events.map(event => ({
      id: `event-${event.id}`,
      title: event.title,
      start: event.date,
      backgroundColor: '#FF7F50', // cultural-escenicas
      borderColor: '#FF7F50',
      extendedProps: {
        type: 'event',
        description: event.description,
        location: event.location
      }
    })),
    
    // Birthdays
    ...state.birthdays.map(birthday => ({
      id: `birthday-${birthday.id}`,
      title: `🎂 ${birthday.name}`,
      start: format(birthday.birthDate, 'yyyy-MM-dd'),
      allDay: true,
      backgroundColor: '#4B0082', // cultural-visuales
      borderColor: '#4B0082',
      extendedProps: {
        type: 'birthday',
        role: birthday.role,
        discipline: birthday.discipline
      }
    })),
    
    // Tasks
    ...state.tasks.map(task => ({
      id: `task-${task.id}`,
      title: `📋 ${task.title}`,
      start: task.dueDate,
      backgroundColor: '#1E90FF', // cultural-musicales
      borderColor: '#1E90FF',
      extendedProps: {
        type: 'task',
        status: task.status,
        priority: task.priority
      }
    }))
  ];

  const handleEventClick = (info: any) => {
    const { type, id } = info.event.extendedProps;
    // Handle event click based on type
    console.log('Clicked:', type, id);
  };

  const handleDateClick = (info: any) => {
    const date = new Date(info.dateStr);
    console.log('Date clicked:', date);
  };

  const handleEventDrop = (info: any) => {
    const { type } = info.event.extendedProps;
    const newDate = info.event.start;
    const id = info.event.id.split('-')[1];

    switch (type) {
      case 'event':
        dispatch({
          type: 'UPDATE_EVENT',
          payload: {
            ...state.events.find(e => e.id === id)!,
            date: newDate
          }
        });
        break;
      case 'task':
        dispatch({
          type: 'UPDATE_TASK',
          payload: {
            ...state.tasks.find(t => t.id === id)!,
            dueDate: newDate
          }
        });
        break;
      // Birthdays shouldn't be draggable
    }
  };

  return (
    <div className="h-screen p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        events={calendarEvents}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        eventDrop={handleEventDrop}
        locale="es"
        buttonText={{
          today: 'Hoy',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
          list: 'Lista'
        }}
        firstDay={1}
        height="auto"
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false,
          hour12: false
        }}
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          omitZeroMinute: false,
          meridiem: false
        }}
      />
    </div>
  );
};