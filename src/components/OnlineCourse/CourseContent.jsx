import React from 'react';
import styles from './CourseContent.module.css';
import { useTranslation } from 'react-i18next';
import { FaDownload, FaPlayCircle, FaBook } from 'react-icons/fa';

const CourseContent = ({ course, handleSelectVideo, handleToggleContent, selectedPart }) => {
  const { t } = useTranslation('OnlineCourse');

  const selectPart = (part, sectionIndex, partIndex) => {
    handleSelectVideo(part, sectionIndex, partIndex); // Cambiar la parte seleccionada en el estado del componente padre

    // Guardar la última sección y parte seleccionada en localStorage
    localStorage.setItem('last-section-index', sectionIndex);
    localStorage.setItem('last-part-index', partIndex);
  };

  return (
    <div className={styles.container}>
      <button onClick={handleToggleContent} className={styles.toggleContentButton}>
        {t('hideContent')}
      </button>
      <h2 className={styles.courseTitle}>{t('courseOutline')}</h2>
      {course.sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>{section.title}</h3>
            <span className={styles.sectionDuration}>{section.duration}</span>
          </div>
          <div className={styles.partsList}>
            {section.parts.map((part, partIndex) => (
              <div
                key={partIndex}
                className={`${styles.part} ${selectedPart && selectedPart.title === part.title ? styles.selectedPart : ''}`}
                onClick={() => selectPart(part, sectionIndex, partIndex)} // Seleccionar la parte al hacer clic
              >
                {part.type === 'reading' ? (
                  <button className={styles.partButton}>
                    <FaBook className={styles.readingIcon} /> {part.title} ({part.duration})
                  </button>
                ) : (
                  <button className={styles.partButton}>
                    <FaPlayCircle className={styles.playIcon} /> {part.title} ({part.duration})
                  </button>
                )}
                {part.resources && (
                  <button className={styles.downloadButton}>
                    <FaDownload className={styles.downloadIcon} /> {t('downloadResources')}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseContent;
