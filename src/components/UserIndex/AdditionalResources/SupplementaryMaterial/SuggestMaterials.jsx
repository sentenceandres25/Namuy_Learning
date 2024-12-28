// Components/SupplementaryMaterial/SuggestMaterials.jsx

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SuggestMaterials.module.css';
import { Form, Button } from 'react-bootstrap';

const SuggestMaterials = () => {
  const { t } = useTranslation('UserIndex/AdditionalResources/SupplementaryMaterial');
  const [suggestion, setSuggestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to submit the suggestion
    alert(t('materialSuggestionSubmitted'));
    setSuggestion('');
  };

  return (
    <div className={styles.suggestMaterials}>
      <h4>{t('suggestMaterials')}</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formMaterialSuggestion">
          <Form.Label>{t('enterSuggestionDetails')}</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            placeholder={t('suggestionPlaceholder')}
          />
        </Form.Group>
        <Button variant="success" type="submit" disabled={!suggestion}>
          {t('submitSuggestion')}
        </Button>
      </Form>
    </div>
  );
};

export default SuggestMaterials;
