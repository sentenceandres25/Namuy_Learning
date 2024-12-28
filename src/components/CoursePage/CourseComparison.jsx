import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next'; // Importar el hook de traducción
import 'bootstrap-icons/font/bootstrap-icons.css'; // Importar Bootstrap Icons CSS
import styles from './CourseComparison.module.css'; // Estilos personalizados

const CourseComparison = () => {
  const { t } = useTranslation('CoursePage'); // Usamos el namespace 'CourseComparison'

  return (
    <motion.div
      className={styles.comparisonSection}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Row className="justify-content-center text-center">
        <Col md={4}>
          <div className={styles.infoBox}>
            <i className="bi bi-info-circle-fill" style={{ fontSize: '30px' }}></i> {/* Icono de información */}
            <p>{t('refundPolicy')}</p>
          </div>
        </Col>
        <Col md={8}>
          <Button variant="outline-dark" className={styles.viewCoursesButton}>
            {t('explorePaidCourses')}
          </Button>
        </Col>
      </Row>

      <Row className={styles.courseComparison}>
        <Col md={6} className={styles.courseType}>
          <h5>{t('freeCoursesTitle')}</h5>
          <ul>
            <li><i className="bi bi-check-circle-fill text-success"></i> {t('onlineVideoContent')}</li>
            <li><i className="bi bi-x-circle-fill text-danger"></i> {t('certificateCompletion')}</li>
            <li><i className="bi bi-x-circle-fill text-danger"></i> {t('instructorQA')}</li>
            <li><i className="bi bi-x-circle-fill text-danger"></i> {t('instructorPrivateMessage')}</li>
          </ul>
        </Col>
        <Col md={6} className={styles.courseType}>
          <h5>{t('paidCoursesTitle')}</h5>
          <ul>
            <li><i className="bi bi-check-circle-fill text-success"></i> {t('onlineVideoContent')}</li>
            <li><i className="bi bi-check-circle-fill text-success"></i> {t('certificateCompletion')}</li>
            <li><i className="bi bi-check-circle-fill text-success"></i> {t('instructorQA')}</li>
            <li><i className="bi bi-check-circle-fill text-success"></i> {t('instructorPrivateMessage')}</li>
          </ul>
        </Col>
      </Row>
    </motion.div>
  );
};

export default CourseComparison;
