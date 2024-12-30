// src/index.js

import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Importación de CSS global
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import './i18n'; // Configuración de i18n
import AuthProvider from './contexts/AuthContext';
// Eliminar la importación de ThemeProvider
// import { ThemeProvider } from './contexts/ThemeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <AuthProvider>
          {/* Eliminar ThemeProvider */}
            <App />
      </AuthProvider>
    </Suspense>
  </React.StrictMode>
);

// reportWebVitals();
reportWebVitals();
