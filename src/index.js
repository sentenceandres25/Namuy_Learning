// index.js
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import './i18n'; // Configuración de i18n
import AuthProvider from './contexts/AuthContext'; // Importar AuthProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Suspense>
  </React.StrictMode>
);

// Si quieres medir el rendimiento, descomenta la siguiente línea
// reportWebVitals(console.log);
reportWebVitals();
