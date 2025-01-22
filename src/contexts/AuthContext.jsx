// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from '../axiosConfig';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      // Inyectamos el token a las cabeceras con un interceptor o manualmente
      axios.get('/auth/me')
        .then(res => {
          setUser(res.data.user);
          setToken(storedToken);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error al restaurar sesión:', err.response ? err.response.data : err.message);
          localStorage.removeItem('token');
          setUser(null);
          setToken(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData, receivedToken) => {
    setUser(userData);
    setToken(receivedToken);
    localStorage.setItem('token', receivedToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
