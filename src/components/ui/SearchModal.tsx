import React, { useState } from 'react';
import { Search, Calendar, Users, CheckSquare, X } from 'lucide-react';
import { useCultural } from '../../context/CulturalContext';

type SearchResult = {
  id: string;
  title: string;
  type: 'event' | 'birthday' | 'task' | 'contact';
  description?: string;
};

export const SearchModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const { state } = useCultural();

  const getResults = (): SearchResult[] => {
    if (!searchTerm) return [];

    const term = searchTerm.toLowerCase();
    let results: SearchResult[] = [];

    if (filter === 'all' || filter === 'events') {
      const eventResults = state.events
        .filter(event => 
          event.title.toLowerCase().includes(term) ||
          event.description.toLowerCase().includes(term)
        )
        .map(event => ({
          id: event.id,
          title: event.title,
          description: event.description,
          type: 'event' as const
        }));
      results = [...results, ...eventResults];
    }

    if (filter === 'all' || filter === 'birthdays') {
      const birthdayResults = state.birthdays
        .filter(birthday => 
          birthday.name.toLowerCase().includes(term)
        )
        .map(birthday => ({
          id: birthday.id,
          title: birthday.name,
          description: birthday.role,
          type: 'birthday' as const
        }));
      results = [...results, ...birthdayResults];
    }

    if (filter === 'all' || filter === 'tasks') {
      const taskResults = state.tasks
        .filter(task => 
          task.title.toLowerCase().includes(term) ||
          task.description.toLowerCase().includes(term)
        )
        .map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          type: 'task' as const
        }));
      results = [...results, ...taskResults];
    }

    if (filter === 'all' || filter === 'contacts') {
      const contactResults = state.contacts
        .filter(contact => 
          contact.name.toLowerCase().includes(term)
        )
        .map(contact => ({
          id: contact.id,
          title: contact.name,
          description: contact.role,
          type: 'contact' as const
        }));
      results = [...results, ...contactResults];
    }

    return results;
  };

  const results = getResults();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 w-full max-w-2xl rounded-xl shadow-2xl">
          <div className="p-3">
            <div className="flex justify-between items-center mb-4">
              <div className="relative flex-1 mr-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cultural-escenicas focus:border-transparent dark:bg-gray-700 dark:text-white"
                  autoFocus
                />
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="flex justify-center md:justify-start space-x-2 mb-4 w-full"> 
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-full text-sm ${
                  filter === 'all'
                    ? 'bg-cultural-escenicas text-white'
                    : 'bg-gray-100 dark:bg-gray-00 text-gray-700 dark:text-gray-300'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilter('events')}
                className={`px-3 py-1 rounded-full text-sm ${
                  filter === 'events'
                    ? 'bg-cultural-escenicas text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Eventos
              </button>
              <button
                onClick={() => setFilter('tasks')}
                className={`px-3 py-1 rounded-full text-sm ${
                  filter === 'tasks'
                    ? 'bg-cultural-escenicas text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Tareas
              </button>
             
            </div>
<div className="flex justify-center md:justify-start space-x-2 mb-4 w-full"> 
              <button
                onClick={() => setFilter('contacts')}
                className={`px-2 py-1 rounded-full text-sm ${
                  filter === 'contacts'
                    ? 'bg-cultural-escenicas text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Contactos
              </button><button
                onClick={() => setFilter('birthdays')}
                className={`px-3 py-1 rounded-full text-sm ${
                  filter === 'birthdays'
                    ? 'bg-cultural-escenicas text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Cumpleaños
              </button></div>
            <div className="max-h-96 overflow-y-auto">
              {results.length > 0 ? (
                <div className="space-y-2">
                  {results.map((result) => (
                    <div
                      key={result.id}
                      className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        {result.type === 'event' && (
                          <Calendar className="h-5 w-5 text-cultural-escenicas" />
                        )}
                        {result.type === 'birthday' && (
                          <Calendar className="h-5 w-5 text-cultural-visuales" />
                        )}
                        {result.type === 'task' && (
                          <CheckSquare className="h-5 w-5 text-cultural-musicales" />
                        )}
                        {result.type === 'contact' && (
                          <Users className="h-5 w-5 text-cultural-escenicas" />
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {result.title}
                          </h3>
                          {result.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {result.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchTerm ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No se encontraron resultados
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Comienza a escribir para buscar
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};