import React from 'react';
import type { ActiveView } from '../../types/cultural';

interface CreateMenuProps {
  onSelectOption: (view: ActiveView) => void;
}

export const CreateMenu: React.FC<CreateMenuProps> = ({ onSelectOption }) => {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Crear Nuevo</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          onClick={() => onSelectOption('nuevo-evento')}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
        >
          <h3 className="font-medium text-lg text-cultural-escenicas mb-2">Evento Cultural</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Crear un nuevo evento cultural</p>
        </button>

        <button 
          onClick={() => onSelectOption('nuevo-cumpleanos')}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
        >
          <h3 className="font-medium text-lg text-cultural-visuales mb-2">Cumpleaños</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Registrar un nuevo cumpleaños</p>
        </button>

        <button 
          onClick={() => onSelectOption('nueva-tarea')}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
        >
          <h3 className="font-medium text-lg text-cultural-musicales mb-2">Tarea</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Crear una nueva tarea</p>
        </button>

        <button 
          onClick={() => onSelectOption('nuevo-articulo')}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
        >
          <h3 className="font-medium text-lg text-cultural-escenicas mb-2">Artículo de Prensa</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Publicar un nuevo artículo de prensa</p>
        </button>
      </div>
    </div>
  );
};