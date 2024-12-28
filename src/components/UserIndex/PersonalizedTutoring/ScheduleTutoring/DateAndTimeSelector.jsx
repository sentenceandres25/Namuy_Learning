// Components/ScheduleTutoring/DateAndTimeSelector.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DateAndTimeSelector.module.css';
import { Form, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateAndTimeSelector = ({ date, time, onDateChange, onTimeChange, onNext, onBack }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/ScheduleTutoring');

  return (
    <div className={styles.dateAndTimeSelector}>
      <h3>{t('dateTime')}</h3>
      <Form.Group controlId="formDate">
        <Form.Label>{t('selectDate')}</Form.Label>
        <DatePicker
          selected={date}
          onChange={(selectedDate) => onDateChange(selectedDate)}
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

export default DateAndTimeSelector;
