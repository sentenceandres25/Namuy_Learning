// TabContent.jsx

import React from 'react';
import styles from './TabContent.module.css';
import { useTranslation } from 'react-i18next';

const TabContent = ({ selectedTab }) => {
  const { t } = useTranslation('OnlineCourse');

  return (
    <div className={styles.tabContent}>
      {selectedTab === 'search' && <div>{t('searchContent')}</div>}
      {selectedTab === 'description' && (
        <div>{t('courseDescription')}</div>
      )}
      {selectedTab === 'qa' && <div>{t('qaContent')}</div>}
      {selectedTab === 'notes' && <div>{t('notesContent')}</div>}
      {selectedTab === 'announcements' && (
        <div>{t('announcementsContent')}</div>
      )}
      {selectedTab === 'ratings' && <div>{t('ratingsContent')}</div>}
      {selectedTab === 'learningTools' && (
        <div>{t('learningToolsContent')}</div>
      )}
    </div>
  );
};

export default TabContent;
