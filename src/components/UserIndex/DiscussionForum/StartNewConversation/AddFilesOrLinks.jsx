// Components/StartNewConversation/AddFilesOrLinks.jsx

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './AddFilesOrLinks.module.css';
import { Form, Button, InputGroup } from 'react-bootstrap';

const AddFilesOrLinks = ({ filesOrLinks, onChange, onNext, onBack }) => {
  const { t } = useTranslation('UserIndex/DiscussionForum/StartNewConversation');
  const [link, setLink] = useState('');

  const handleAddLink = () => {
    if (link) {
      onChange([...filesOrLinks, { type: 'link', value: link }]);
      setLink('');
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files).map((file) => ({
      type: 'file',
      value: file.name,
    }));
    onChange([...filesOrLinks, ...files]);
  };

  return (
    <div className={styles.addFilesOrLinks}>
      <h3>{t('addFilesOrLinks')}</h3>
      <Form.Group controlId="formAddLinks">
        <Form.Label>{t('addLinks')}</Form.Label>
        <InputGroup>
          <Form.Control
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder={t('enterLink')}
          />
          <Button variant="outline-secondary" onClick={handleAddLink}>
            {t('add')}
          </Button>
        </InputGroup>
      </Form.Group>
      <Form.Group controlId="formAddFiles">
        <Form.Label>{t('addFiles')}</Form.Label>
        <Form.Control type="file" multiple onChange={handleFileUpload} />
      </Form.Group>
      {filesOrLinks.length > 0 && (
        <div className={styles.filesLinksList}>
          <h5>{t('attachedFilesLinks')}</h5>
          <ul>
            {filesOrLinks.map((item, index) => (
              <li key={index}>
                {item.type === 'link' ? t('link') : t('file')}: {item.value}
              </li>
            ))}
          </ul>
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

export default AddFilesOrLinks;
