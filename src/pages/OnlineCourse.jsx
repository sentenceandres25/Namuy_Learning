// OnlineCourse.jsx
import React, { useState, useEffect, useRef, Suspense } from 'react';
import styles from './OnlineCourse.module.css';
import OnlineCourseHeader from '../components/OnlineCourse/OnlineCourseHeader';
import VideoArea from '../components/OnlineCourse/VideoArea';
import CourseContent from '../components/OnlineCourse/CourseContent';
import BelowVideoMenu from '../components/OnlineCourse/BelowVideoMenu';
import TabContent from '../components/OnlineCourse/TabContent';
import Footer from '../components/Footer/Footer';
import videoFile1 from '../assets/videos/Behind Scenes.mp4';
import PageTitle from '../components/PageTitle/PageTitle';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars } from 'react-icons/fa';

const OnlineCourse = () => {
  const { t, i18n } = useTranslation('OnlineCourse');
  const { lang } = useParams();
  const [selectedTab, setSelectedTab] = useState('description');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showContent, setShowContent] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);
  const [selectedPart, setSelectedPart] = useState(null);
  const isInitialLoad = useRef(true); // Control de carga inicial

  const videoRef = useRef(null); // Añadido: Referencia al elemento de video

  useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    
    if (isSmallScreen) {
      setShowContent(true);
    }

    return () => window.removeEventListener('resize', handleResize);
  }, [isSmallScreen]);

  const course = {
    logo: '/ruta/al/logo.png',
    title: t('courseTitle'),
    isRefundable: true,
    progress: 50,
    sections: [
      {
        title: t('section1Title'),
        duration: '30 min',
        parts: [
          { title: t('part1Title'), duration: '10 min', resources: true, src: videoFile1 },
          { title: t('part2Title'), duration: '20 min', resources: false, src: videoFile1 },
        ],
      },
      {
        title: t('section2Title'),
        duration: '25 min',
        parts: [
          { title: t('part3Title'), duration: '15 min', resources: true, src: videoFile1 },
          { title: t('part4Title'), duration: '10 min', resources: false, src: videoFile1 },
        ],
      },
      {
        title: t('section3ReadingTitle'),
        duration: '15 min',
        parts: [
          { title: t('reading1Title'), duration: '7 min', type: 'reading', resources: true },
          { title: t('reading2Title'), duration: '8 min', type: 'reading', resources: true },
        ],
      },
      {
        title: t('section4ReadingTitle'),
        duration: '20 min',
        parts: [
          { title: t('reading3Title'), duration: '10 min', type: 'reading', resources: true },
          { title: t('reading4Title'), duration: '10 min', type: 'reading', resources: false },
        ],
      },
    ],
  };

  useEffect(() => {
    if (isInitialLoad.current) {
      const lastSectionIndex = parseInt(localStorage.getItem('last-section-index'), 10);
      const lastPartIndex = parseInt(localStorage.getItem('last-part-index'), 10);

      if (
        !isNaN(lastSectionIndex) &&
        !isNaN(lastPartIndex) &&
        course.sections[lastSectionIndex] &&
        course.sections[lastSectionIndex].parts[lastPartIndex]
      ) {
        const part = course.sections[lastSectionIndex].parts[lastPartIndex];
        setSelectedVideo(part);
        setSelectedPart(part);
      } else {
        setSelectedVideo(course.sections[0].parts[0]);
        setSelectedPart(course.sections[0].parts[0]);
      }
      isInitialLoad.current = false;
    }
  }, [course.sections]);

  // Modificado: Guardar el tiempo actual del video antes de cambiar de parte
  const handleSelectVideo = (video, sectionIndex, partIndex) => {
    // Guarda el tiempo actual del video antes de cambiar
    if (videoRef.current && selectedVideo && selectedVideo.type !== 'reading') {
      const currentTime = videoRef.current.currentTime;
      localStorage.setItem(`video-${selectedVideo.src}-time`, currentTime);
    }

    setSelectedVideo(video);
    setSelectedPart(video);

    localStorage.setItem('last-section-index', sectionIndex);
    localStorage.setItem('last-part-index', partIndex);
  };

  const handleToggleContent = () => setShowContent((prev) => !prev);
  const handleSelectTab = (tab) => setSelectedTab(tab);

  return (
    <Suspense fallback={<div>{t('loading')}</div>}>
      <PageTitle titleKey="onlineCourseTitle" />
      <div className={styles.onlineCourse}>
        <OnlineCourseHeader course={course} />
        <div className={styles.contentArea}>
          <motion.div
            className={`${styles.leftContent} ${!showContent ? styles.fullScreenVideo : ''}`}
            animate={{ width: showContent ? '66.66%' : '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <VideoArea selectedVideo={selectedVideo} videoRef={videoRef} /> {/* Pasamos videoRef */}
            <BelowVideoMenu selectedTab={selectedTab} handleSelectTab={handleSelectTab} />
            <TabContent selectedTab={selectedTab} />
          </motion.div>
          <AnimatePresence>
            {showContent && (
              <motion.div
                className={styles.rightContent}
                initial={{ width: 0 }}
                animate={{ width: isSmallScreen ? '100%' : '33.33%' }}
                exit={{ width: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <CourseContent
                  course={course}
                  handleSelectVideo={(video, sectionIndex, partIndex) => 
                    handleSelectVideo(video, sectionIndex, partIndex)
                  }
                  handleToggleContent={handleToggleContent}
                  selectedPart={selectedPart}
                />
              </motion.div>
            )}
          </AnimatePresence>
          {!showContent && !isSmallScreen && (
            <div
              className={styles.showContentButton}
              onClick={handleToggleContent}
              title={t('courseContent')}
            >
              <FaBars />
            </div>
          )}
        </div>
        <Footer />
      </div>
    </Suspense>
  );
};

export default OnlineCourse;
