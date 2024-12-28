// src/contexts/ThemeContext.js
import React, { createContext, useState } from 'react';

// Crear el contexto
export const ThemeContext = createContext();

// Proveedor del contexto
export const ThemeProvider = ({ children }) => {
  // Estado para manejar el tema actual (light/dark)
  const [theme, setTheme] = useState('light');

  // Función para alternar entre los temas
  const toggleTheme = (selectedTheme) => {
    setTheme(selectedTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
