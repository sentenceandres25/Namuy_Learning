// Components/RequestExtraTutoring/PreferredDateTime.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PreferredDateTime.module.css';
import { Form, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PreferredDateTime = ({ date, time, onDateChange, onTimeChange, onNext, onBack }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/RequestExtraTutoring');

  return (
    <div className={styles.preferredDateTime}>
      <h3>{t('preferredDateTime')}</h3>
      <Form.Group controlId="formDate">
        <Form.Label>{t('selectDate')}</Form.Label>
        <DatePicker
          selected={date}
          onChange={(date) => onDateChange(date)}
          dateFormat="dd/MM/yyyy"
          minDate={new Date()}
          className="form-control"
        />
      </Form.Group>
      <Form.Group controlId="formTime">
        <Form.Label>{t('selectTime')}</Form.Label>
        <Form.Control
          type="time"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
        />
      </Form.Group>
      <div className={styles.buttons}>
        <Button variant="secondary" onClick={onBack}>
          {t('back')}
        </Button>
        <Button variant="primary" onClick={onNext} disabled={!date || !time}>
          {t('next')}
        </Button>
      </div>
    </div>
  );
};

export default PreferredDateTime;
