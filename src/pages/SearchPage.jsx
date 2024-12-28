// SearchPage.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import HeaderComponent from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import PageTitle from '../components/PageTitle/PageTitle';
import FilterSidebar from '../components/SearchPage/FilterSidebar';
import SearchResultsList from '../components/SearchPage/SearchResultsList';
import RelatedSearches from '../components/SearchPage/RelatedSearches';
import Pagination from '../components/SearchPage/Pagination';
import styles from './SearchPage.module.css';

const SearchPage = () => {
  const { lang } = useParams(); 
  const headerHeight = '125px';
  const { t, i18n } = useTranslation('SearchPage/SearchPage');

  const [showFilters, setShowFilters] = useState(true);

  // Simulación de resultados
  const results = [
    {
      id: 1,
      name: 'Introduction to Full Stack Development',
      instructor: 'John Doe',
      rating: 4.5,
      peopleRated: 1200,
      hours: 40,
      classes: 50,
      levels: ['Beginner', 'Intermediate'],
      bestSeller: true,
      price: 199.99,
      image: 'https://via.placeholder.com/150'
    },
    {
      id: 2,
      name: 'Advanced Data Science with Python',
      instructor: 'Jane Smith',
      rating: 4.7,
      peopleRated: 800,
      hours: 60,
      classes: 70,
      levels: ['Intermediate', 'Advanced'],
      bestSeller: false,
      price: 299.99,
      image: 'https://via.placeholder.com/150'
    }
  ];

  const resultsCount = results.length;

  useEffect(() => {
    if (lang) {
      i18n.changeLanguage(lang); 
    }
  }, [lang, i18n]);

  return (
    <>
      <PageTitle titleKey="searchTitle" />
      <HeaderComponent headerHeight={headerHeight} className="header-user-index" />

      <div className={styles.searchPageContainer}>
        <Container fluid>
          <Row>
            {/* Columna Izquierda */}
            <Col xs={12} md={3} className={styles.leftColumn}>
              <div className={styles.resultsInfo}>
                <span>{t('resultsCount', { count: resultsCount })}</span>
              </div>
              <button 
                className={styles.filterButton} 
                onClick={() => setShowFilters(!showFilters)}
              >
                {t('filterButton')}
              </button>
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    className={styles.filterContainer}
                    initial={{ x: -300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <FilterSidebar t={t} />
                  </motion.div>
                )}
              </AnimatePresence>
            </Col>

            {/* Columna Derecha */}
            <Col xs={12} md={9} className={styles.resultsColumn}>
              <SearchResultsList t={t} results={results} />
              <RelatedSearches t={t} />
              <Pagination t={t} currentPage={1} totalPages={5} />
            </Col>
          </Row>
        </Container>
      </div>

      <Footer />
    </>
  );
};

export default SearchPage;
