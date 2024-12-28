// Components/MyContributions/MyMessagesList.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MyMessagesList.module.css';
import { FaEnvelopeOpenText } from 'react-icons/fa';
import EditDeleteOptions from './EditDeleteOptions';

const MyMessagesList = ({ messages }) => {
  const { t } = useTranslation('UserIndex/DiscussionForum/MyContributions');

  return (
    <div className={styles.myMessagesList}>
      <h3>
        <FaEnvelopeOpenText /> {t('myMessages')}
      </h3>
      {messages.length > 0 ? (
        messages.map((message) => (
          <div key={message.id} className={styles.messageItem}>
            <h4>{message.topicTitle}</h4>
            <p>
              <strong>{t('date')}:</strong> {message.date}
            </p>
            <p>{message.content}</p>
            <EditDeleteOptions messageId={message.id} />
          </div>
        ))
      ) : (
        <p>{t('noMessages')}</p>
      )}
    </div>
  );
};

export default MyMessagesList;
