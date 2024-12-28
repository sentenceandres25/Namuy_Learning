// Components/MyContributions/EditDeleteOptions.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './EditDeleteOptions.module.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

const EditDeleteOptions = ({ messageId }) => {
  const { t } = useTranslation('UserIndex/DiscussionForum/MyContributions');

  const handleEdit = () => {
    // Logic to edit the message
    alert(`${t('editingMessage')} ${messageId}`);
  };

  const handleDelete = () => {
    // Logic to delete the message
    alert(`${t('deletingMessage')} ${messageId}`);
    // Here you could add a confirmation dialog before deletion
  };

  return (
    <div className={styles.editDeleteOptions}>
      <button className={styles.editButton} onClick={handleEdit}>
        <FaEdit /> {t('edit')}
      </button>
      <button className={styles.deleteButton} onClick={handleDelete}>
        <FaTrash /> {t('delete')}
      </button>
    </div>
  );
};

export default EditDeleteOptions;
