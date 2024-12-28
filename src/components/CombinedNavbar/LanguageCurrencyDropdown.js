import React from 'react';
import { Navbar, NavDropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './LanguageCurrencyDropdown.css';

const LanguageCurrencyDropdown = ({ currentLanguage, handleLanguageChange, handleCurrencyChange }) => {
  const { t } = useTranslation('LanguageCurrencyDropdown');

  return (
    <Navbar className="custom-navbar-language">
      <NavDropdown
        title={currentLanguage.toUpperCase()}
        id="nav-dropdown-options"
        className="language-dropdown"
      >
        {/* Sección para cambiar idioma */}
        <NavDropdown.Header>{t('Language')}</NavDropdown.Header>
        <NavDropdown.Item onClick={() => handleLanguageChange('en')}>{t('English')}</NavDropdown.Item>
        <NavDropdown.Item onClick={() => handleLanguageChange('es')}>{t('Spanish')}</NavDropdown.Item>
        
        <NavDropdown.Divider /> {/* Separador entre secciones */}
        
        {/* Sección para cambiar moneda */}
        <NavDropdown.Header>{t('Currency')}</NavDropdown.Header>
        <NavDropdown.Item onClick={() => handleCurrencyChange('USD')}>USD</NavDropdown.Item>
        <NavDropdown.Item onClick={() => handleCurrencyChange('EUR')}>EUR</NavDropdown.Item>
      </NavDropdown>
    </Navbar>
  );
};

export default LanguageCurrencyDropdown;
