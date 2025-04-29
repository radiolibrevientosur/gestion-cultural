import React from 'react';
import { Bell, Shield, Eye } from 'lucide-react';

export const PrivacySettings: React.FC = () => {
  const [notifications, setNotifications] = React.useState(true);
  const [visibility, setVisibility] = React.useState('public');

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Privacidad
      </h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">Notificaciones</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cultural-escenicas/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cultural-escenicas"></div>
          </label>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <Eye className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">Visibilidad del Perfil</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setVisibility('public')}
              className={`px-4 py-2 rounded-md text-sm ${
                visibility === 'public'
                  ? 'bg-cultural-escenicas text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Público
            </button>
            <button
              onClick={() => setVisibility('private')}
              className={`px-4 py-2 rounded-md text-sm ${
                visibility === 'private'
                  ? 'bg-cultural-escenicas text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Privado
            </button>
          </div>
        </div>

        <div>
          <button
            onClick={() => window.open('src/components/ui/PrivacyPolicy.tsx', '_blank')}
            className="flex items-center space-x-2 text-cultural-escenicas hover:underline"
          >
            <Shield className="h-5 w-5" />
            <span>Ver Política de Privacidad</span>
          </button>
        </div>
      </div>
    </div>
  );
};