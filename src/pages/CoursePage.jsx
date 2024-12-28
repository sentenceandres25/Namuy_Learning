import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import HeaderComponent from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import PageTitle from '../components/PageTitle/PageTitle';
import CoursePreview from '../components/CoursePage/CoursePreview';
import CourseInfo from '../components/CoursePage/CourseInfo';
import CourseTabs from '../components/CoursePage/CourseTabs';
import CourseComparison from '../components/CoursePage/CourseComparison'; 
import RecommendedCoursesCarousel from '../components/UserIndex/MyCourses/CoursesInProgress/RecommendedCoursesCarousel'; // Importar el carrusel recomendado
import styles from './CoursePage.module.css';

const CoursePage = () => {
  const { lang } = useParams(); 
  const { t, i18n } = useTranslation('CoursePage');
  const headerHeight = '125px';

  useEffect(() => {
    if (lang) {
      i18n.changeLanguage(lang); 
    }
  }, [lang, i18n]);

  return (
    <>
      <PageTitle titleKey="coursePageTitle" />
      <HeaderComponent headerHeight={headerHeight} className="header-user-index" />
      <motion.div
        className={styles.coursePage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Container fluid className="course-content" style={{ marginTop: headerHeight }}>
          <Row>
            <Col md={8}>
              <CoursePreview /> 
            </Col>
            <Col md={4}>
              <CourseInfo /> 
            </Col>
          </Row>

          <CourseTabs /> 
          <CourseComparison /> 

          {/* Agregar el carrusel de cursos recomendados */}
          <RecommendedCoursesCarousel /> 
          
        </Container>
      </motion.div>
      <Footer />
    </>
  );
};

export default CoursePage;
