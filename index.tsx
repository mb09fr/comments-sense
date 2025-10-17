import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './hooks/useTranslation';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("L'élément racine est introuvable pour le montage");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);
