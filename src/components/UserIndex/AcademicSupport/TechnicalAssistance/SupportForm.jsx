// Components/TechnicalAssistance/SupportForm.jsx

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SupportForm.module.css';
import { Form, Button } from 'react-bootstrap';

const SupportForm = () => {
  const { t } = useTranslation('UserIndex/AcademicSupport/TechnicalAssistance');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    issue: '',
    description: '',
    screenshot: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to submit the form
    alert(t('supportRequestSubmitted'));
    setFormData({
      name: '',
      email: '',
      issue: '',
      description: '',
      screenshot: null,
    });
  };

  return (
    <div className={styles.supportForm}>
      <h3>{t('supportForm')}</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formName">
          <Form.Label>{t('name')}</Form.Label>
          <Form.Control
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />
        </Form.Group>
        <Form.Group controlId="formEmail">
          <Form.Label>{t('email')}</Form.Label>
          <Form.Control
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </Form.Group>
        <Form.Group controlId="formIssue">
          <Form.Label>{t('issue')}</Form.Label>
          <Form.Control
            type="text"
            value={formData.issue}
            onChange={(e) =>
              setFormData({ ...formData, issue: e.target.value })
            }
            required
          />
        </Form.Group>
        <Form.Group controlId="formDescription">
          <Form.Label>{t('description')}</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />
        </Form.Group>
        <Form.Group controlId="formScreenshot">
          <Form.Label>{t('screenshot')}</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) =>
              setFormData({ ...formData, screenshot: e.target.files[0] })
            }
          />
        </Form.Group>
        <Button variant="success" type="submit">
          {t('submit')}
        </Button>
      </Form>
    </div>
  );
};

export default SupportForm;
