import React, { createContext, useState, useEffect } from 'react';
import axios from '../axiosConfig';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let storedToken = localStorage.getItem('token');
    // Verifica que el token almacenado sea válido (no sea "undefined" ni cadena vacía)
    if (storedToken && storedToken !== "undefined" && storedToken.trim() !== "") {
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      axios.get('/auth/me')
        .then(res => {
          setUser(res.data.user);
          setToken(storedToken);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error restoring session:', err.response ? err.response.data : err.message);
          localStorage.removeItem('token');
          setUser(null);
          setToken(null);
          setLoading(false);
        });
    } else {
      localStorage.removeItem('token'); // Asegurarse de limpiar si es inválido
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token && token !== "undefined" && token.trim() !== "") {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = (userData, receivedToken) => {
    if (!receivedToken || receivedToken === "undefined" || receivedToken.trim() === "") {
      console.error("Invalid token received during login.");
      return;
    }
    setUser(userData);
    setToken(receivedToken);
    localStorage.setItem('token', receivedToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post('/auth/refresh');
      if (response.status === 200 && response.data.token) {
        const newToken = response.data.token;
        setToken(newToken);
        localStorage.setItem('token', newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        return newToken;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, logout, refreshToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
