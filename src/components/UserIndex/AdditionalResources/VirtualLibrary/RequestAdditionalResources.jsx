// Components/VirtualLibrary/RequestAdditionalResources.jsx

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './RequestAdditionalResources.module.css';
import { Form, Button } from 'react-bootstrap';

const RequestAdditionalResources = () => {
  const { t } = useTranslation('UserIndex/AdditionalResources/VirtualLibrary');
  const [request, setRequest] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to submit the request
    alert(t('resourceRequestSubmitted'));
    setRequest('');
  };

  return (
    <div className={styles.requestAdditionalResources}>
      <h4>{t('requestAdditionalResources')}</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formResourceRequest">
          <Form.Label>{t('enterResourceDetails')}</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            placeholder={t('resourceRequestPlaceholder')}
          />
        </Form.Group>
        <Button variant="success" type="submit" disabled={!request}>
          {t('submitRequest')}
        </Button>
      </Form>
    </div>
  );
};

export default RequestAdditionalResources;
