import React from 'react';
import styles from './BelowVideoMenu.module.css';
import { FaSearch } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const BelowVideoMenu = ({ selectedTab, handleSelectTab }) => {
  const { t } = useTranslation('OnlineCourse');

  const tabs = [
    { key: 'search', label: <FaSearch /> },
    { key: 'description', label: t('description') },
    { key: 'qa', label: t('qa') },
    { key: 'notes', label: t('notes') },
    { key: 'announcements', label: t('announcements') },
    { key: 'ratings', label: t('ratings') },
    { key: 'learningTools', label: t('learningTools') },
  ];

  return (
    <div className={styles.belowVideoMenu}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => handleSelectTab(tab.key)}
          className={`${styles.tabButton} ${
            selectedTab === tab.key ? styles.activeTab : ''
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default BelowVideoMenu;
