import React, { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import styles from './CourseTabs.module.css';

const CourseTabs = () => {
  const { t } = useTranslation('CoursePage');
  const [activeTab, setActiveTab] = useState('learn');

  return (
    <motion.div
      className={styles.motionCourseTabsContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.motionCourseTabs}>
        <Tabs
          id="course-tabs"
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className={`${styles.motionNavTabs} ${styles.customTabContainer}`} // Añadimos clase adicional
        >
          <Tab eventKey="learn" title={<span className={styles.motionNavLink}>{t('what_you_will_learn')}</span>}>
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className={styles.tabContent}
            >
              <p>{t('learn_paragraph')}</p>
            </motion.div>
          </Tab>
          <Tab eventKey="content" title={<span className={styles.motionNavLink}>{t('course_content')}</span>}>
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className={styles.tabContent}
            >
              <p>{t('content_paragraph')}</p>
            </motion.div>
          </Tab>
          <Tab eventKey="reviews" title={<span className={styles.motionNavLink}>{t('reviews')}</span>}>
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className={styles.tabContent}
            >
              <p>{t('reviews_paragraph')}</p>
            </motion.div>
          </Tab>
          <Tab eventKey="instructors" title={<span className={styles.motionNavLink}>{t('instructors')}</span>}>
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className={styles.tabContent}
            >
              <p>{t('instructors_paragraph')}</p>
            </motion.div>
          </Tab>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default CourseTabs;
