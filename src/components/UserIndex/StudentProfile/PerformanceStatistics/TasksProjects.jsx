// components/PerformanceStatistics/TasksProjects.jsx

import React from 'react';
import { motion } from 'framer-motion';
import styles from './TasksProjects.module.css';
import { useTranslation } from 'react-i18next';

const TasksProjects = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/PerformanceStatistics');

  return (
    <motion.div
      className={styles.tasksProjects}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3>{t('tasks_projects')}</h3>
      <div className={styles.dataSection}>
        <p>{t('tasks_completed')}:</p>
        <p className={styles.dataValue}>14</p>
      </div>
    </motion.div>
  );
};

export default TasksProjects;
