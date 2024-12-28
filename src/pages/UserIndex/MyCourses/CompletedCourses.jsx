// Pages/CompletedCourses.jsx

import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import HeaderComponent from '../../../components/Header/Header';
import CentroPersonal from '../../../components/UserIndex/PersonalCenter';
import Footer from '../../../components/Footer/Footer';
import PageTitle from '../../../components/PageTitle/PageTitle';
import CourseList from '../../../components/UserIndex/MyCourses/CompletedCourses/CourseList';
import CourseDetails from '../../../components/UserIndex/MyCourses/CompletedCourses/CourseDetails';
import Certifications from '../../../components/UserIndex/MyCourses/CompletedCourses/Certifications';
import CommentsAndReviews from '../../../components/UserIndex/MyCourses/CompletedCourses/CommentsAndReviews';
import RecommendedCoursesCarousel from '../../../components/UserIndex/MyCourses/CoursesInProgress/RecommendedCoursesCarousel';
import StudyMaterials from '../../../components/UserIndex/MyCourses/CompletedCourses/StudyMaterials';
import PerformanceStats from '../../../components/UserIndex/MyCourses/CompletedCourses/PerformanceStats';
import styles from './CompletedCourses.module.css';

const CompletedCourses = () => {
  const { lang } = useParams();
  const { t } = useTranslation('UserIndex/MyCourses/CompletedCourses');
  const headerHeight = '125px';
  const [selectedCourse, setSelectedCourse] = useState(null);

  const completedCourses = [
    {
      id: 1,
      title: 'Curso de React Avanzado',
      description: 'Aprende patrones avanzados de React y optimización.',
      instructor: 'Juan Pérez',
      duration: '15 horas',
      startDate: '2023-01-10',
      endDate: '2023-02-15',
      progress: 100,
    },
    {
      id: 2,
      title: 'Curso de Node.js',
      description: 'Desarrolla aplicaciones backend con Node.js.',
      instructor: 'María García',
      duration: '20 horas',
      startDate: '2023-03-01',
      endDate: '2023-04-05',
      progress: 100,
    },
    {
      id: 3,
      title: 'Curso de Diseño UX/UI',
      description: 'Domina los principios del diseño centrado en el usuario.',
      instructor: 'Carlos López',
      duration: '12 horas',
      startDate: '2023-05-10',
      endDate: '2023-06-15',
      progress: 100,
    },
  ];

  const recommendedCourses = [
    {
      id: 4,
      title: 'Curso de TypeScript',
      description: 'Aprende TypeScript desde cero.',
      image: '/images/typescript-course.jpg',
    },
    {
      id: 5,
      title: 'Curso de GraphQL',
      description: 'Construye APIs modernas con GraphQL.',
      image: '/images/graphql-course.jpg',
    },
    {
      id: 6,
      title: 'Curso de Docker',
      description: 'Containeriza tus aplicaciones con Docker.',
      image: '/images/docker-course.jpg',
    },
  ];

  const handleSelectCourse = (course) => {
    if (selectedCourse && selectedCourse.id === course.id) {
      setSelectedCourse(null);
    } else {
      setSelectedCourse(course);
    }
  };

  return (
    <>
      <PageTitle titleKey="completedCoursesTitle" />

      <HeaderComponent headerHeight={headerHeight} className="header-user-index" />

      <motion.div
        className={`${styles.completedCoursesPage} main-container`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ marginTop: headerHeight }}
      >
        <Row className="mx-0">
          <Col md={3}>
            <CentroPersonal />
          </Col>

          <Col md={9}>
            <Row>
              <Col md={12}>
                <h2 className={styles['page-title']}>{t('completedCourses')}</h2>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <CourseList
                  courses={completedCourses}
                  selectedCourse={selectedCourse}
                  onSelectCourse={handleSelectCourse}
                />
              </Col>
              <Col md={8}>
                {selectedCourse ? (
                  <CourseDetails course={selectedCourse} />
                ) : (
                  <div className={styles.placeholder}>{t('selectCourse')}</div>
                )}
              </Col>
            </Row>
            
            {selectedCourse && (
              <Row className={styles.cardRow}>
                <Col md={3} sm={6} className={styles.cardCol}>
                  <Certifications course={selectedCourse} />
                </Col>
                <Col md={3} sm={6} className={styles.cardCol}>
                  <CommentsAndReviews course={selectedCourse} />
                </Col>
                <Col md={3} sm={6} className={styles.cardCol}>
                  <StudyMaterials course={selectedCourse} />
                </Col>
                <Col md={3} sm={6} className={styles.cardCol}>
                  <PerformanceStats course={selectedCourse} />
                </Col>
              </Row>
            )}
            
            <Row>
              <Col md={12}>
                <RecommendedCoursesCarousel recommendedCourses={recommendedCourses} />
              </Col>
            </Row>
          </Col>
        </Row>
      </motion.div>

      <Footer />
    </>
  );
};

export default CompletedCourses;
