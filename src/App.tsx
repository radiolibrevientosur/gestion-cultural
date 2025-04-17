function App() {
  const [activeView, setActiveView] = useState<ActiveView>('inicio');

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
      case 'perfil':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <CulturalProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Encabezado */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex-shrink-0 flex items-center">
                <Calendar className="h-8 w-8 text-cultural-escenicas" />
                <span className="ml-2 text-xl font-semibold">Gestión Cultural</span>
              </div>
            </div>
          </div>
        </header>

        {/* Contenido Principal */}
        <main className="flex-1 max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8 mb-16">
          <div className="px-4 py-6 sm:px-0">
            {renderView()}
          </div>
        </main>

        {/* Pie de Página */}
        <nav className="bg-white border-t border-gray-200 fixed bottom-0 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-around h-16">
              <button
                onClick={() => setActiveView('inicio')}
                className={`flex flex-col items-center justify-center w-full hover:bg-gray-50 ${
                  activeView === 'inicio' ? 'text-cultural-escenicas' : 'text-gray-500'
                }`}
              >
                <Home className="h-6 w-6" />
                <span className="mt-1 text-xs">Inicio</span>
              </button>
              <button
                onClick={() => setActiveView('crear')}
                className={`flex flex-col items-center justify-center w-full hover:bg-gray-50 ${
                  activeView === 'crear' ? 'text-cultural-escenicas' : 'text-gray-500'
                }`}
              >
                <PlusCircle className="h-6 w-6" />
                <span className="mt-1 text-xs">Crear</span>
              </button>
              <button
                onClick={() => setActiveView('favoritos')}
                className={`flex flex-col items-center justify-center w-full hover:bg-gray-50 ${
                  activeView === 'favoritos' ? 'text-cultural-visuales' : 'text-gray-500'
                }`}
              >
                <Heart className="h-6 w-6" />
                <span className="mt-1 text-xs">Favoritos</span>
              </button>
              {/* Botón de Calendario */}
              <CalendarButton
                onCreateEvent={() => setActiveView('nuevo-evento')}
                onCreateBirthday={() => setActiveView('nuevo-cumpleanos')}
                onCreateTask={() => setActiveView('nueva-tarea')}
              />
              <button
                onClick={() => setActiveView('perfil')}
                className={`flex flex-col items-center justify-center w-full hover:bg-gray-50 ${
                  activeView === 'perfil' ? 'text-cultural-musicales' : 'text-gray-500'
                }`}
              >
                <UserCircle className="h-6 w-6" />
                <span className="mt-1 text-xs">Perfil</span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </CulturalProvider>
  );
}

export default App;
