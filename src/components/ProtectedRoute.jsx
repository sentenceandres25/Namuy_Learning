// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const { lang } = useParams();

  if (!user) {
    // Redirige al login con el idioma actual si no hay usuario
    return <Navigate to={`/login/${lang || 'es'}`} />;
  }
  return children;
};

export default ProtectedRoute;
