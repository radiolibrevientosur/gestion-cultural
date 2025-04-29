import React from 'react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 print:p-0">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 print:shadow-none">
        <header className="mb-8">
          <h1 
            className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
            role="heading" 
            aria-level="1"
          >
            Política de Privacidad
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </p>
        </header>

        {/* ... Resto del contenido ... */}

        <section>
          <h2 className="text-xl font-semibold...">5. Contacto</h2>
          <p className="mt-2">
            Para ejercer tus derechos o consultas sobre privacidad:
            <br />
            <a 
              href="mailto:douglasdonaire@gmail.com?subject=Consulta%20sobre%20Política%20de%20Privacidad"
              className="text-cultural-escenicas hover:underline font-medium"
              aria-label="Contactar vía email"
            >
              douglasdonaire@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};