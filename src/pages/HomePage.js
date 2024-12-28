import React, { useEffect, useState } from 'react';
import PageTitle from '../components/PageTitle/PageTitle';
import { motion } from 'framer-motion';  // Importamos motion
import HeaderComponent from '../components/Header/Header';
import CarouselComponent from '../components/CarouselComponent/CarouselComponent';
import { useTranslation } from 'react-i18next';
import Categories from '../components/Categories/Categories';
import Footer from '../components/Footer/Footer';
import InfoSection from '../components/InfoSection/InfoSection';
import DiscountsAndHighlights from '../components/DiscountsAndHighlights/DiscountsAndHighlights';
import WomanProductCarousel from '../components/ProductCarouselGeneric/WomanProductCarousel';
import KidsProductCarousel from '../components/ProductCarouselGeneric/KidsProductCarousel';
import ManProductCarousel from '../components/ProductCarouselGeneric/ManProductCarousel';
import './HomePage.css';

const RESIZE_THRESHOLD = 767;
const OBSERVER_THRESHOLD = 0.1;
const STORAGE_KEY_BANNER = 'hasSeenBanner';

const AppBanner = ({ onClose, isVisible }) => {
  const { t } = useTranslation('content'); // Usar el namespace 'content' para el banner

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className={`app-banner ${isVisible ? 'visible' : 'hidden'}`}>
      <p>{t('appBannerMessage')}</p>
      <a href="LINK_A_TU_APP">{t('downloadApp')}</a>
      <button className="close-btn" onClick={onClose}>&times;</button>
    </motion.div>
  );
};

const HomePage = ({ currentLanguage }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [headerHeight, setHeaderHeight] = useState('auto');
  
  const { t: tContent } = useTranslation('content');
  const { t: tPageTitles } = useTranslation('pageTitles');  // Obtener las traducciones de los títulos de las páginas

  useEffect(() => {
    const hasSeenBanner = localStorage.getItem(STORAGE_KEY_BANNER);

    if (!hasSeenBanner) {
      setShowBanner(true);
    }

    const handleResize = () => {
      if (window.innerWidth <= RESIZE_THRESHOLD && !hasSeenBanner) {
        setShowBanner(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fadeInSections = document.querySelectorAll('.fade-in-section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: OBSERVER_THRESHOLD });

    fadeInSections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleBannerClose = () => {
    setShowBanner(false);
    localStorage.setItem(STORAGE_KEY_BANNER, 'true');
  };

  return (
    <>
      <PageTitle titleKey="hometitle" /> {/* Usamos 'titleKey' para traducir el título */}
      
      <AppBanner onClose={handleBannerClose} isVisible={showBanner} />

      <div className="content">
        {/* Agregamos motion al Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}  // Empieza fuera de la pantalla
          animate={{ opacity: 1, y: 0 }}   // Aparece suavemente
          transition={{ duration: 0.8 }}   // Duración de la animación
          style={{ zIndex: 1000, position: 'absolute', top: 0, width: '100%' }}  // Estilo fijo para el header
        >
          <HeaderComponent headerHeight={headerHeight} />
        </motion.div>

        {/* Agregamos motion al Carousel */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.7 }}
        >
          <CarouselComponent setHeaderHeight={setHeaderHeight} />
        </motion.div>

        {/* Motion aplicado a InfoSection */}
        <motion.div 
          initial={{ opacity: 0, x: -100 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.8 }}
        >
          <InfoSection />
        </motion.div>

        {/* Motion aplicado a DiscountsAndHighlights */}
        <motion.div 
          initial={{ opacity: 0, x: 100 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.8 }}
        >
          <DiscountsAndHighlights />
        </motion.div>

        {/* Motion aplicado a Categories */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
        >
          <Categories />
        </motion.div>

        {/* Motion aplicado a los carruseles */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.7 }}
        >
          <WomanProductCarousel />
          <KidsProductCarousel />
          <ManProductCarousel />
          <Footer />
        </motion.div>

        
      </div>
    </>
  );
};

export default HomePage;
