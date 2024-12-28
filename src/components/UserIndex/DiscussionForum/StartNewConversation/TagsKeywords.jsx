// Components/StartNewConversation/TagsKeywords.jsx

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TagsKeywords.module.css';
import { Form, Button, InputGroup } from 'react-bootstrap';

const TagsKeywords = ({ tags, onChange, onNext, onBack }) => {
  const { t } = useTranslation('UserIndex/DiscussionForum/StartNewConversation');
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    if (tagInput) {
      onChange([...tags, tagInput]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className={styles.tagsKeywords}>
      <h3>{t('tagsKeywords')}</h3>
      <Form.Group controlId="formTags">
        <Form.Label>{t('addTags')}</Form.Label>
        <InputGroup>
          <Form.Control
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder={t('enterTag')}
          />
          <Button variant="outline-secondary" onClick={handleAddTag}>
            {t('add')}
          </Button>
        </InputGroup>
      </Form.Group>
      {tags.length > 0 && (
        <div className={styles.tagsList}>
          {tags.map((tag, index) => (
            <span key={index} className={styles.tagItem}>
              {tag}
              <Button variant="link" onClick={() => handleRemoveTag(tag)}>
                &times;
              </Button>
            </span>
          ))}
        </div>
      )}
      <div className={styles.buttons}>
        <Button variant="secondary" onClick={onBack}>
          {t('back')}
        </Button>
        <Button variant="primary" onClick={onNext}>
          {t('next')}
        </Button>
      </div>
    </div>
  );
};

export default TagsKeywords;
