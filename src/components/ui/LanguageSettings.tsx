import React from 'react';
import { Check } from 'lucide-react';

const languages = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'pt', name: 'Português' },
  { code: 'fr', name: 'Français' }
];

export const LanguageSettings: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = React.useState('es');

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Idioma
      </h2>
      <div className="space-y-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setSelectedLanguage(lang.code)}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <span className="text-gray-700 dark:text-gray-300">{lang.name}</span>
            {selectedLanguage === lang.code && (
              <Check className="h-5 w-5 text-cultural-escenicas" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};