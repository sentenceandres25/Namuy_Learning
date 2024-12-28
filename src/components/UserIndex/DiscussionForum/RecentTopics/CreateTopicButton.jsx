// Components/RecentTopics/CreateTopicButton.jsx

import React from 'react';
import styles from './CreateTopicButton.module.css';
import { FaPlusCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const CreateTopicButton = () => {
  const { t } = useTranslation('UserIndex/DiscussionForum/RecentTopics');

  const handleCreateTopic = () => {
    // Logic to navigate to create topic page
    alert(t('navigateToCreateTopic'));
  };

  return (
    <button className={styles.createButton} onClick={handleCreateTopic}>
      <FaPlusCircle /> {t('createNewTopic')}
    </button>
  );
};

export default CreateTopicButton;
