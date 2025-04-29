import React, { useState, useRef, useEffect } from 'react';
import { CulturalProvider } from './context/CulturalContext';
import { Calendar, Heart, Users, Home, PlusCircle, Sun, Moon, MoreVertical, Settings, Bell, LogOut, User, Search, Star } from 'lucide-react';
import { EventoCulturalForm } from './components/cultural/EventoCulturalForm';
import { BirthdayForm } from './components/cultural/BirthdayForm';
import { TaskForm } from './components/cultural/TaskForm';
import { CreateMenu } from './components/cultural/CreateMenu';
import { Favorites } from './components/cultural/Favorites';
import { ContactList } from './components/cultural/ContactList';
import { CalendarView } from './components/cultural/CalendarView';
import { OfflineIndicator } from './components/ui/OfflineIndicator';
import { NotificationList } from './components/ui/NotificationList';
import { NotificationSettings } from './components/ui/NotificationSettings';
import { UserProfile } from './components/cultural/UserProfile';
import { LanguageSettings } from './components/ui/LanguageSettings';
import { PrivacySettings } from './components/ui/PrivacySettings';
import { SearchModal } from './components/ui/SearchModal';
import { useTheme } from './hooks/useTheme';
import { useNotifications } from './hooks/useNotifications';
import { useCultural } from './context/CulturalContext';
import type { ActiveView, CulturalEvent } from './types/cultural';
import { EventCard } from './components/cultural/EventCard';
import { BirthdayCulturalCard } from './components/cultural/BirthdayCulturalCard';
import { TaskCulturalKanban } from './components/cultural/TaskCulturalKanban';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
      <h2 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">
        Error en el componente
      </h2>
      <p className="text-red-600 dark:text-red-400 text-sm">
        {error.message}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        Reintentar
      </button>
    </div>
  );
}

function Dashboard() {
  const { state } = useCultural();
  const [editingEvent, setEditingEvent] = useState<CulturalEvent | null>(null);

  const safeEvents = state.events || [];
  const safeBirthdays = state.birthdays || [];
  const safeTasks = state.tasks || [];
  
  return (
    <div className="space-y-8">
      {editingEvent ? (
        <EventoCulturalForm 
          event={editingEvent} 
          onComplete={() => setEditingEvent(null)} 
        />
      ) : (
        <>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Eventos Culturales
            </h2>
            {safeEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {safeEvents.map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onEdit={setEditingEvent}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No hay eventos creados
              </p>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Próximos Cumpleaños
            </h2>
            {safeBirthdays.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {safeBirthdays.map(birthday => (
                  <BirthdayCulturalCard key={birthday.id} birthday={birthday} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No hay cumpleaños registrados
              </p>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Tareas
            </h2>
            {safeTasks.length > 0 ? (
              <TaskCulturalKanban tasks={safeTasks} />
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No hay tareas creadas
              </p>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('inicio');
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLanguageSettings, setShowLanguageSettings] = useState(false);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const configRef = useRef<HTMLDivElement>(null);
  const { unreadCount, isPermissionGranted, requestNotificationPermission } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menu = menuRef.current;
      const config = configRef.current;
      
      if (menu && !menu.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (config && !config.contains(event.target as Node)) {
        setIsConfigOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    console.log('Cerrar sesión');
  };

  const renderView = () => {
    if (showProfile) {
      return <UserProfile />;
    }

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
        {showNotifications && (
          <NotificationList onClose={() => setShowNotifications(false)} />
        )}
        {showSearchModal && (
          <SearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />
        )}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex-shrink-0 flex items-center">
                <Calendar className="h-8 w-8 text-cultural-escenicas" />
                <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Gestión Cultural
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowSearchModal(true)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <Search className="h-6 w-6" />
                </button>
                
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <MoreVertical className="h-6 w-6" />
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50">
                      <button
                        onClick={() => setShowNotifications(true)}
                        className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <Bell className="h-4 w-4 mr-2" />
                          Notificaciones
                        </div>
                        {unreadCount > 0 && (
                          <span className="bg-cultural-escenicas text-white text-xs px-2 py-1 rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </button>

                      <NotificationSettings
                        onChange={(enabled) => {
                          if (enabled && !isPermissionGranted) {
                            requestNotificationPermission();
                          }
                        }}
                      />

                      <button
                        onClick={() => {
                          setShowProfile(true);
                          setIsMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Mi Cuenta
                      </button>

                      <button
                        className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                        onClick={toggleTheme}
                      >
                        {theme === 'dark' ? (
                          <Sun className="h-4 w-4 mr-2" />
                        ) : (
                          <Moon className="h-4 w-4 mr-2" />
                        )}
                        Modo {theme === 'dark' ? 'Claro' : 'Oscuro'}
                      </button>

                      <div className="relative" ref={configRef}>
                        <button
                          className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
                          onClick={() => setIsConfigOpen(!isConfigOpen)}
                        >
                          <div className="flex items-center">
                            <Settings className="h-4 w-4 mr-2" />
                            Configuración
                          </div>
                          <span className="text-xs">▼</span>
                        </button>

                        {isConfigOpen && (
                          <div className="absolute left-0 top-full w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 mt-1 z-50">
                            <button
                              onClick={() => {
                                setShowLanguageSettings(true);
                                setIsMenuOpen(false);
                                setIsConfigOpen(false);
                              }}
                              className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              Idioma
                            </button>
                            <button
                              onClick={() => {
                                setShowPrivacySettings(true);
                                setIsMenuOpen(false);
                                setIsConfigOpen(false);
                              }}
                              className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              Privacidad
                            </button>
                          </div>
                        )}
                      </div>

                      <hr className="my-1 border-gray-200 dark:border-gray-700" />

                      <button
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8 mb-16">
          <div className="px-4 py-6 sm:px-0">
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onReset={() => {
                setActiveView('inicio');
                setShowProfile(false);
                setShowLanguageSettings(false);
                setShowPrivacySettings(false);
              }}
            >
              {showLanguageSettings ? (
                <LanguageSettings />
              ) : showPrivacySettings ? (
                <PrivacySettings />
              ) : (
                renderView()
              )}
            </ErrorBoundary>
          </div>
        </main>

        <nav className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 fixed bottom-0 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-around h-16">
              <button
                onClick={() => {
                  setActiveView('inicio');
                  setShowProfile(false);
                }}
                className={`flex flex-col items-center justify-center w-full hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  activeView === 'inicio' ? 'text-cultural-escenicas' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <Home className="h-6 w-6" />
                <span className="mt-1 text-xs">Inicio</span>
              </button> <button
                onClick={() => {
                  setActiveView('favoritos');
                  setShowProfile(false);
                }}
                className={`flex flex-col items-center justify-center w-full hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  activeView === 'favoritos' ? 'text-cultural-visuales' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <Star className="h-6 w-6" />
                <span className="mt-1 text-xs">Favoritos</span>
              </button>
              <button
                onClick={() => {
                  setActiveView('crear');
                  setShowProfile(false);
                }}
                className={`flex flex-col items-center justify-center w-full hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  activeView === 'crear' ? 'text-cultural-escenicas' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <PlusCircle className="h-6 w-6" />
                <span className="mt-1 text-xs">Crear</span>
              </button>
              <button
                onClick={() => {
                  setActiveView('calendario');
                  setShowProfile(false);
                }}
                className={`flex flex-col items-center justify-center w-full hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  activeView === 'calendario' ? 'text-cultural-musicales' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <Calendar className="h-6 w-6" />
                <span className="mt-1 text-xs">Calendario</span>
              </button>
              <button
                onClick={() => {
                  setActiveView('contactos');
                  setShowProfile(false);
                }}
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