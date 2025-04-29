import React from 'react';
import { useCultural } from '../../context/CulturalContext';
import { EventCard } from './EventCard';
import { BirthdayCulturalCard } from './BirthdayCulturalCard';
import { TaskCulturalKanban } from './TaskCulturalKanban';

export const Favorites: React.FC = () => {
  const { state } = useCultural();
  
  const favoriteEvents = state.events.filter(e => e.isFavorite);
  const favoriteBirthdays = state.birthdays.filter(b => b.isFavorite);
  const favoriteTasks = state.tasks.filter(t => t.isFavorite);

  return (
    <div className="p-4 space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Favoritos</h2>
      
      <section>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Eventos Favoritos</h3>
        {favoriteEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No hay eventos favoritos</p>
        )}
      </section>

      <section>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Cumpleaños Favoritos</h3>
        {favoriteBirthdays.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteBirthdays.map(birthday => (
              <BirthdayCulturalCard key={birthday.id} birthday={birthday} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No hay cumpleaños favoritos</p>
        )}
      </section>

      <section>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Tareas Favoritas</h3>
        {favoriteTasks.length > 0 ? (
          <div className="space-y-4">
            <TaskCulturalKanban tasks={favoriteTasks} />
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No hay tareas favoritas</p>
        )}
      </section>
    </div>
  );
};