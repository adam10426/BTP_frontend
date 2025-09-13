import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { ErrorBoundary } from 'react-error-boundary';
import './index.css';
import App from './App';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" className="p-4">
      <h2 className="text-lg font-semibold text-red-600">Something went wrong:</h2>
      <pre className="mt-2 text-sm text-red-500">{error.message}</pre>
      <button 
        onClick={resetErrorBoundary}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try again
      </button>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <MantineProvider defaultColorScheme="dark">
      {/* <Notifications position="top-right" /> */}
      {/* <ErrorBoundary FallbackComponent={ErrorFallback}> */}
        <App />
      {/* </ErrorBoundary> */}
    </MantineProvider>
  </StrictMode>
);
