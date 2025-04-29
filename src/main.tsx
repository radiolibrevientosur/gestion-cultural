import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { CulturalProvider } from './context/CulturalContext';
import App from './App.tsx';
import './index.css';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-lg w-full">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
          ¡Algo salió mal!
        </h2>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-4">
          <p className="text-red-700 dark:text-red-300 font-mono text-sm break-words">
            {error.message}
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-cultural-escenicas text-white py-2 px-4 rounded-lg hover:bg-cultural-escenicas/90 transition-colors"
        >
          Recargar aplicación
        </button>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CulturalProvider>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <App />
      </ErrorBoundary>
    </CulturalProvider>
  </StrictMode>
);