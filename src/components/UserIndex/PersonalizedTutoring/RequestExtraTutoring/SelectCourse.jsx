// Components/RequestExtraTutoring/SelectCourse.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SelectCourse.module.css';
import { Form, Button } from 'react-bootstrap';

const SelectCourse = ({ course, onChange, onNext }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/RequestExtraTutoring');

  // Sample data of available courses
  const availableCourses = ['Mathematics', 'Programming', 'History', 'English'];

  return (
    <div className={styles.selectCourse}>
      <h3>{t('selectCourse')}</h3>
      <Form.Group controlId="formCourse">
        <Form.Label>{t('course')}</Form.Label>
        <Form.Control
          as="select"
          value={course}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">{t('selectCoursePlaceholder')}</option>
          {availableCourses.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <div className={styles.buttons}>
        <Button variant="primary" onClick={onNext} disabled={!course}>
          {t('next')}
        </Button>
      </div>
    </div>
  );
};

export default SelectCourse;
