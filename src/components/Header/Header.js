import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import CombinedNavbar from '../CombinedNavbar/CombinedNavbar';
import './Header.css';

const HeaderComponent = ({ className }) => {
  const { i18n } = useTranslation();
  const { lang } = useParams();

  useEffect(() => {
    if (lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  return (
    <div className={`header-component ${className}`}>
      <CombinedNavbar />
    </div>
  );
};

export default HeaderComponent;
