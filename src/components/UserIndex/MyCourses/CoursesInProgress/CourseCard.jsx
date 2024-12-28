import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams and useNavigate
import styles from './CourseCard.module.css';

const CourseCard = ({ course }) => {
  const { t } = useTranslation('UserIndex/MyCourses/CoursesInProgress');
  const { lang } = useParams(); // Get the lang parameter from the URL
  const navigate = useNavigate(); // Hook for navigation

  const handleViewDetails = () => {
    navigate(`/user/OnlineCourse/${lang}`); // Dynamic navigation to the URL
  };

  return (
    <Card className={styles.courseCard}>
      <Card.Img
        variant="top"
        src={course.image}
        alt={`${course.name} Image`}
        className={styles.courseImage}
      />
      <Card.Body className={styles.cardBody}>
        <Card.Title className={styles.cardTitle}>{course.name}</Card.Title>
        <Card.Text className={styles.cardText}>{t('course_progress')}: {course.progress}</Card.Text>
        <Card.Text className={styles.cardText}>{t('last_activity')}: {course.lastActivity}</Card.Text>
        <Card.Text className={styles.cardText}>{t('pending_evaluations')}: {course.pendingEvaluations}</Card.Text>
        <Card.Text className={styles.cardText}>{t('total_study_time')}: {course.studyTime}</Card.Text>
        <Button className={styles.btn} onClick={handleViewDetails}>
          {t('view_details')}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default CourseCard;
