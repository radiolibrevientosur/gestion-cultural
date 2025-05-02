import React, { useState } from 'react';
import { useCultural } from '../../context/CulturalContext';
import { EventCard } from './EventCard';
import { BirthdayCulturalCard } from './BirthdayCulturalCard';
import { TaskCulturalKanban } from './TaskCulturalKanban';
import { PressArticleCard } from './PressArticleCard';
import { QuickPost } from './QuickPost';
import { PostCard } from './PostCard';
import { EventoCulturalForm } from './EventoCulturalForm';

function Dashboard() {
  const { state } = useCultural();
  const [editingEvent, setEditingEvent] = useState<string | null>(null);

  const renderSection = <T extends { id: string }>(
    title: string,
    items: T[],
    Component: React.FC<{ data: T }>,
    emptyMessage: string
  ) => (
    <section>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h2>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <Component key={item.id} data={item} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      )}
    </section>
  );

  return (
    <div className="space-y-8">
      {editingEvent ? (
        <EventoCulturalForm 
          eventId={editingEvent}
          onComplete={() => setEditingEvent(null)} 
        />
      ) : (
        <>
          <QuickPost />

          {renderSection(
            'Publicaciones',
            state.posts,
            ({ data }) => <PostCard post={data} />,
            'No hay publicaciones'
          )}

          {renderSection(
            'Artículos de Prensa',
            state.pressArticles,
            ({ data }) => <PressArticleCard article={data} />,
            'No hay artículos publicados'
          )}

          {renderSection(
            'Eventos Culturales',
            state.events,
            ({ data }) => <EventCard event={data} onEdit={setEditingEvent} />,
            'No hay eventos creados'
          )}

          {renderSection(
            'Próximos Cumpleaños',
            state.birthdays,
            ({ data }) => <BirthdayCulturalCard birthday={data} />,
            'No hay cumpleaños registrados'
          )}

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Tareas
            </h2>
            {state.tasks.length > 0 ? (
              <TaskCulturalKanban tasks={state.tasks} />
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

export default Dashboard;