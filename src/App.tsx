import React, { useState } from 'react';
import { CulturalProvider } from './context/CulturalContext';
import { Calendar, Heart, Users, Home, PlusCircle, Sun, Moon } from 'lucide-react';
import { EventoCulturalForm } from './components/cultural/EventoCulturalForm';
import { BirthdayForm } from './components/cultural/BirthdayForm';
import { TaskForm } from './components/cultural/TaskForm';
import { EventCard } from './components/cultural/EventCard';
import { BirthdayCulturalCard } from './components/cultural/BirthdayCulturalCard';
import { TaskCulturalKanban } from './components/cultural/TaskCulturalKanban';
import { CalendarView } from './components/cultural/CalendarView';
import { ContactList } from './components/cultural/ContactList';
import { OfflineIndicator } from './components/ui/OfflineIndicator';
import { useTheme } from './hooks/useTheme';
import { useCultural } from './context/CulturalContext';
import type { CulturalEvent } from './types/cultural';

type ActiveView = 'inicio' | 'crear' | 'favoritos' | 'contactos' | 'nuevo-evento' | 'nuevo-cumpleanos' | 'nueva-tarea' | 'calendario';

function Dashboard() {
  const { state } = useCultural();
  const [editingEvent, setEditingEvent] = useState<CulturalEvent | null>(null);
  
  return (
    <div className="space-y-8">
      {editingEvent ? (
        <EventoCulturalForm 
          event={editingEvent} 
          onComplete={() => setEditingEvent(null)} 
        />
      ) : (
        <>
          {/* Eventos Culturales */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Eventos Culturales</h2>
            {state.events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {state.events.map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onEdit={setEditingEvent}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No hay eventos creados</p>
            )}
          </section>

          {/* Próximos Cumpleaños */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Próximos Cumpleaños</h2>
            {state.birthdays.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {state.birthdays.map(birthday => (
                  <BirthdayCulturalCard key={birthday.id} birthday={birthday} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No hay cumpleaños registrados</p>
            )}
          </section>

          {/* Tareas */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Tareas</h2>
            {state.tasks.length > 0 ? (
              <TaskCulturalKanban />
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No hay tareas creadas</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function CreateMenu({ onSelectOption }: { onSelectOption: (view: ActiveView) => void }) {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Crear Nuevo</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          onClick={() => onSelectOption('nuevo-evento')}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
        >
          <h3 className="font-medium text-lg text-cultural-escenicas mb-2">Evento Cultural</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Crear un nuevo evento cultural con todos los detalles</p>
        </button>
        <button 
          onClick={() => onSelectOption('nuevo-cumpleanos')}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
        >
          <h3 className="font-medium text-lg text-cultural-visuales mb-2">Cumpleaños</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Agregar un nuevo cumpleaños al calendario</p>
        </button>
        <button 
          onClick={() => onSelectOption('nueva-tarea')}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
        >
          <h3 className="font-medium text-lg text-cultural-musicales mb-2">Tarea</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Crear una nueva tarea o recordatorio</p>
        </button>
      </div>
    </div>
  );
}

function Favorites() {
  const { state } = useCultural();
  
  const favoriteEvents = state.events.filter(event => event.isFavorite);
  const favoriteBirthdays = state.birthdays.filter(birthday => birthday.isFavorite);
  const favoriteTasks = state.tasks.filter(task => task.isFavorite);
  const favoriteContacts = state.contacts?.filter(contact => contact.isFavorite) || [];
  
  return (
    <div className="p-4 space-y-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Favoritos</h2>
      
      
      {/* Eventos Favoritos */}
      <section>
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Eventos Favoritos</h3>
        {favoriteEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event}
                onEdit={() => {}} 
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No hay eventos favoritos</p>
        )}
      </section>

      {/* Cumpleaños Favoritos */}
      <section>
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Cumpleaños Favoritos</h3>
        {favoriteBirthdays.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteBirthdays.map(birthday => (
              <BirthdayCulturalCard key={birthday.id} birthday={birthday} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No hay cumpleaños favoritos</p>
        )}
      </section>

      {/* Tareas Favoritas */}
      <section>
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Tareas Favoritas</h3>
        {favoriteTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteTasks.map(task => (
              <div key={task.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h4 className="font-medium text-gray-900 dark:text-white">{task.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{task.description}</p>
                <div className="mt-2 text-sm">
                  <span className={`inline-block px-2 py-1 rounded ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No hay tareas favoritas</p>
        )}
      </section>

      {/* Contactos Favoritos */}
      <section>
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Contactos Favoritos</h3>
        {favoriteContacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteContacts.map(contact => (
              <div key={contact.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h4 className="font-medium text-gray-900 dark:text-white">{contact.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{contact.role}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{contact.discipline}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No hay contactos favoritos</p>
        )}
      </section>
    </div>
  );
}

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('inicio');
  const { theme, toggleTheme } = useTheme();

  const renderView = () => {
    switch (activeView) {
      case 'crear':
        return <CreateMenu onSelectOption={setActiveView} />;
      case 'nuevo-evento':
        return <EventoCulturalForm onComplete={() => setActiveView('inicio')} />;
      case 'nuevo-cumpleanos':
        return <BirthdayForm onComplete={() => setActiveView('inicio')} />;
      case 'nueva-tarea':
        return <TaskForm onComplete={() => setActiveView('inicio')} />;
      case 'favoritos':
        return <Favorites />;
      case 'contactos':
        return <ContactList />;
      case 'calendario':
        return <CalendarView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <CulturalProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <OfflineIndicator />
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex-shrink-0 flex items-center">
                <Calendar className="h-8 w-8 text-cultural-escenicas" />
                <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">Gestión Cultural</span>
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8 mb-16">
          <div className="px-4 py-6 sm:px-0">
            {renderView()}
          </div>
        </main>

        <nav className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 fixed bottom-0 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-around h-16">
              <button
                onClick={() => setActiveView('inicio')}
                className={`flex flex-col items-center justify-center w-full hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  activeView === 'inicio' ? 'text-cultural-escenicas' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <Home className="h-6 w-6" />
                <span className="mt-1 text-xs">Inicio</span>
              </button>
              <button
                onClick={() => setActiveView('crear')}
                className={`flex flex-col items-center justify-center w-full hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  activeView === 'crear' ? 'text-cultural-escenicas' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <PlusCircle className="h-6 w-6" />
                <span className="mt-1 text-xs">Crear</span>
              </button>
              <button
                onClick={() => setActiveView('favoritos')}
                className={`flex flex-col items-center justify-center w-full hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  activeView === 'favoritos' ? 'text-cultural-visuales' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <Heart className="h-6 w-6" />
                <span className="mt-1 text-xs">Favoritos</span>
              </button>
              <button
                onClick={() => setActiveView('calendario')}
                className={`flex flex-col items-center justify-center w-full hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  activeView === 'calendario' ? 'text-cultural-musicales' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <Calendar className="h-6 w-6" />
                <span className="mt-1 text-xs">Calendario</span>
              </button>
              <button
                onClick={() => setActiveView('contactos')}
                className={`flex flex-col items-center justify-center w-full hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  activeView === 'contactos' ? 'text-cultural-musicales' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <Users className="h-6 w-6" />
                <span className="mt-1 text-xs">Contactos</span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </CulturalProvider>
  );
}

export default App;