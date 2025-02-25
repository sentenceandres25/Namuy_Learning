// src/pages/CoursePage.jsx
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
import RecommendedCoursesCarousel from '../components/UserIndex/MyCourses/CoursesInProgress/RecommendedCoursesCarousel';
import styles from './CoursePage.module.css';

const CoursePage = () => {
  const { lang } = useParams(); 
  const { t, i18n } = useTranslation('CoursePage');
  const headerHeight = '125px';
  
  // Estado para almacenar el curso obtenido de la API
  const [course, setCourse] = useState(null);

  useEffect(() => {
    if (lang) {
      i18n.changeLanguage(lang); 
    }
    // Realiza la petición a la API para obtener el curso (se asume que el ID es 2)
    fetch(`http://localhost:3001/api/products/2?lang=${lang}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched course:', data);
        setCourse(data);
      })
      .catch((err) => console.error('Error fetching course:', err));
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
              {course ? (
                <CourseInfo course={course} />
              ) : (
                <p>Cargando información del curso...</p>
              )}
            </Col>
          </Row>

          <CourseTabs /> 
          <CourseComparison /> 

          {/* Carrusel de cursos recomendados */}
          <RecommendedCoursesCarousel /> 
          
        </Container>
      </motion.div>
      <Footer />
    </>
  );
};

export default CoursePage;
