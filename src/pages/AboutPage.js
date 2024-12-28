import React, { useEffect } from 'react';
import PageTitle from '../components/PageTitle/PageTitle';
import HeaderComponent from '../components/Header/Header';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

const AboutPage = () => {
  const { t, i18n } = useTranslation();
  const { lang } = useParams(); // Obtén el parámetro de idioma de la URL

  useEffect(() => {
    if (lang) {
      i18n.changeLanguage(lang); // Cambia el idioma basado en la URL
    }
  }, [lang, i18n]);

  return (
    <>
      <PageTitle title={t('hometitle')} />
      <HeaderComponent />
      <div className="content">
        {/* Otros componentes y contenido pueden ir aquí */}
      </div>
    </>
  );
};
export default AboutPage;