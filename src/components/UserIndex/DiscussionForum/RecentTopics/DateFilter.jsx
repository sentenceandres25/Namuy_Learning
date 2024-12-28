// Components/RecentTopics/DateFilter.jsx

import React from 'react';
import styles from './DateFilter.module.css';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const DateFilter = () => {
  const { t } = useTranslation('UserIndex/DiscussionForum/RecentTopics');

  const handleDateFilterChange = (e) => {
    // Logic to filter topics by date
  };

  return (
    <div className={styles.dateFilter}>
      <Form.Group controlId="dateFilter">
        <Form.Label>{t('filterTopicsByDate')}</Form.Label>
        <Form.Control as="select" onChange={handleDateFilterChange}>
          <option value="today">{t('today')}</option>
          <option value="thisWeek">{t('thisWeek')}</option>
          <option value="thisMonth">{t('thisMonth')}</option>
        </Form.Control>
      </Form.Group>
    </div>
  );
};

export default DateFilter;
