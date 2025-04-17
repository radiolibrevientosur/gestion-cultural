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
    case 'calendario':
      return <CalendarView />;
    case 'perfil':
      return <Profile />;
    default:
      return <Dashboard />;
  }
};
