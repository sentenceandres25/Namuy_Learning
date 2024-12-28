import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import HeaderComponent from '../../../components/Header/Header';
import PersonalCenter from '../../../components/UserIndex/PersonalCenter';
import Footer from '../../../components/Footer/Footer';
import PageTitle from '../../../components/PageTitle/PageTitle';
import CourseList from '../../../components/UserIndex/MyCourses/CoursesInProgress/CourseList';
import RecommendedCoursesCarousel from '../../../components/UserIndex/MyCourses/CoursesInProgress/RecommendedCoursesCarousel'; // Import the recommended courses carousel
import styles from './CoursesInProgress.module.css';

const CoursesInProgress = () => {
  const { lang } = useParams();
  const { t } = useTranslation('UserIndex/MyCourses/CoursesInProgress');
  const headerHeight = '125px';

  return (
    <>
      <PageTitle titleKey="coursesInProgressTitle" />
      <HeaderComponent headerHeight={headerHeight} className="header-user-index" />
      <motion.div
        className={styles.coursesPage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Container fluid className="user-index" style={{ marginTop: headerHeight }}>
          <Row>
            <Col md={3}>
              <PersonalCenter />
            </Col>
            <Col md={9}>
              <h2 className={styles.titleCoursesInProgress}>{t('courses_in_progress')}</h2>
              <CourseList /> {/* Component for courses in progress */}
              <RecommendedCoursesCarousel /> {/* Component for recommendations */}
            </Col>
          </Row>
        </Container>
      </motion.div>
      <Footer />
    </>
  );
};

export default CoursesInProgress;
