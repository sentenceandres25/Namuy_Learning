// Components/TutoringHistory/TutoringDetails.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TutoringDetails.module.css';
import { motion } from 'framer-motion';
import TutoringDuration from './TutoringDuration';
import TutorRating from './TutorRating';
import CourseProgress from './CourseProgress';
import NotesTaken from './NotesTaken';
import FollowUpRecommendations from './FollowUpRecommendations';
import TopicsCoveredSummary from './TopicsCoveredSummary';

const TutoringDetails = ({ tutoring }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/TutoringHistory');

  return (
    <motion.div
      className={styles.tutoringDetails}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3>{tutoring.course}</h3>
      <p><strong>{t('tutor')}:</strong> {tutoring.tutor}</p>
      <p><strong>{t('date')}:</strong> {tutoring.date}</p>
      <p><strong>{t('time')}:</strong> {tutoring.time}</p>

      <TutoringDuration duration={tutoring.duration} />
      <TutorRating rating={tutoring.rating} comments={tutoring.comments} />
      <CourseProgress progress={tutoring.courseProgress} />
      <TopicsCoveredSummary topics={tutoring.topicsCovered} />
      <NotesTaken notes={tutoring.notes} materials={tutoring.materials} />
      <FollowUpRecommendations recommendations={tutoring.recommendations} />
    </motion.div>
  );
};

export default TutoringDetails;
