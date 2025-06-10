import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const { worker } = await import('./api/mocks/browser');
  return worker.start();
}

enableMocking().then(() => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <MantineProvider>
        <Notifications />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MantineProvider>
    </React.StrictMode>,
  );
});
