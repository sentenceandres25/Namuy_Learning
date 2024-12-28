// Components/RecentTopics/TopicSearch.jsx

import React from 'react';
import styles from './TopicSearch.module.css';
import { Form, FormControl, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const TopicSearch = () => {
  const { t } = useTranslation('UserIndex/DiscussionForum/RecentTopics');

  const handleSearch = (e) => {
    e.preventDefault();
    // Logic to search topics
  };

  return (
    <Form className={styles.topicSearch} onSubmit={handleSearch}>
      <FormControl type="text" placeholder={t('searchRecentTopics')} />
      <Button variant="primary" type="submit">
        {t('search')}
      </Button>
    </Form>
  );
};

export default TopicSearch;
