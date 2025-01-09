// src/components/LanguageCurrencyDropdown/LanguageCurrencyDropdown.jsx

import React from 'react';
import { Navbar, NavDropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useLanguageCurrency } from './hooks/useLanguageCurrency'; // Ruta corregida
import './LanguageCurrencyDropdown.css';

const LanguageCurrencyDropdown = () => {
  const { t } = useTranslation('LanguageCurrencyDropdown');
  const {
    currentLanguage,
    handleLanguageChange,
    currency,
    handleCurrencyChange,
  } = useLanguageCurrency();

  return (
    <Navbar className="custom-navbar-language">
      <NavDropdown
        // Muestra el idioma actual (en mayúsculas) o '...' si está indefinido
        title={currentLanguage ? currentLanguage.toUpperCase() : '...'}
        id="nav-dropdown-options"
        className="language-dropdown"
      >
        {/* Sección para cambiar idioma */}
        <NavDropdown.Header>{t('Language')}</NavDropdown.Header>
        <NavDropdown.Item onClick={() => handleLanguageChange('en')}>
          {t('English')}
        </NavDropdown.Item>
        <NavDropdown.Item onClick={() => handleLanguageChange('es')}>
          {t('Spanish')}
        </NavDropdown.Item>

        <NavDropdown.Divider />

        {/* Sección para cambiar moneda (opcional) */}
        <NavDropdown.Header>{t('Currency')}</NavDropdown.Header>
        <NavDropdown.Item onClick={() => handleCurrencyChange('USD')}>
          USD
        </NavDropdown.Item>
        <NavDropdown.Item onClick={() => handleCurrencyChange('EUR')}>
          EUR
        </NavDropdown.Item>
      </NavDropdown>
    </Navbar>
  );
};

export default LanguageCurrencyDropdown;
