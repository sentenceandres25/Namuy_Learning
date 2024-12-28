// VideoArea.jsx
import React, { useEffect, useRef, useState } from 'react';
import styles from './VideoArea.module.css';
import { useTranslation } from 'react-i18next';
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaForward,
  FaBackward,
  FaCog,
  FaExpand,
  FaCompress,
  FaRegStickyNote,
} from 'react-icons/fa';

const VideoArea = ({ selectedVideo, videoRef }) => { // Añadido: videoRef como prop
  const { t } = useTranslation('OnlineCourse');
  const videoContainerRef = useRef(null);
  const progressBarContainerRef = useRef(null);
  const hiddenVideoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverProgress, setHoverProgress] = useState(null);
  const [thumbnailSrc, setThumbnailSrc] = useState(null);
  const [isHandleVisible, setIsHandleVisible] = useState(false);

  const hideControlsTimeout = useRef(null);

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }
    hideControlsTimeout.current = setTimeout(() => setShowControls(false), 2000);
  };

  useEffect(() => {
    const containerElement = videoContainerRef.current;

    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerElement);
      setShowControls(true);
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
      hideControlsTimeout.current = setTimeout(() => setShowControls(false), 2000);
    };

    if (containerElement) {
      containerElement.addEventListener('mousemove', handleMouseMove);
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      if (containerElement) {
        containerElement.removeEventListener('mousemove', handleMouseMove);
      }
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && selectedVideo && selectedVideo.type !== 'reading') {
      videoRef.current.load();

      const savedTime = localStorage.getItem(`video-${selectedVideo.src}-time`);
      if (savedTime) {
        videoRef.current.currentTime = parseFloat(savedTime);
      }
      videoRef.current.load();
    }
  }, [selectedVideo, videoRef]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && selectedVideo && selectedVideo.type !== 'reading' && !isDragging) {
      const currentTime = videoRef.current.currentTime;
      setProgress((currentTime / duration) * 100);
      localStorage.setItem(`video-${selectedVideo.src}-time`, currentTime);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current && selectedVideo && selectedVideo.type !== 'reading') {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const adjustSpeed = (newSpeed) => {
    if (videoRef.current && selectedVideo && selectedVideo.type !== 'reading') {
      setSpeed(newSpeed);
      videoRef.current.playbackRate = newSpeed;
    }
  };

  const skipTime = (seconds) => {
    if (videoRef.current && selectedVideo && selectedVideo.type !== 'reading') {
      videoRef.current.currentTime += seconds;
    }
  };

  const toggleMute = () => {
    if (videoRef.current && selectedVideo && selectedVideo.type !== 'reading') {
      setVolume(videoRef.current.volume > 0 ? 0 : 1);
      videoRef.current.volume = videoRef.current.volume > 0 ? 0 : 1;
    }
  };

  const toggleFullscreen = () => {
    if (videoContainerRef.current) {
      if (!isFullscreen) {
        videoContainerRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleProgressClick = (clientX) => {
    if (videoRef.current && duration && progressBarContainerRef.current) {
      const rect = progressBarContainerRef.current.getBoundingClientRect();
      const clickX = clientX - rect.left;
      let newTime = (clickX / rect.width) * duration;
      newTime = Math.max(0, Math.min(newTime, duration));
      videoRef.current.currentTime = newTime;
      setProgress((newTime / duration) * 100);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    handleProgressClick(e.clientX);
  };

  const handleMouseMoveProgress = (e) => {
    if (isDragging && videoRef.current && duration) {
      handleProgressClick(e.clientX);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const handleMouseMoveProgressBar = (e) => {
    if (progressBarContainerRef.current && duration) {
      const rect = progressBarContainerRef.current.getBoundingClientRect();
      const hoverX = e.clientX - rect.left;
      const hoverTime = (hoverX / rect.width) * duration;
      setHoverProgress((hoverX / rect.width) * 100);
      generateThumbnail(hoverTime);
    }
  };

  const handleMouseEnterProgressBar = () => {
    setIsHandleVisible(true);
  };

  const handleMouseLeaveProgressBar = () => {
    setIsHandleVisible(false);
    setHoverProgress(null);
    setThumbnailSrc(null);
  };

  const generateThumbnail = (time) => {
    if (hiddenVideoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 160;
      canvas.height = 90;
      const ctx = canvas.getContext('2d');
      hiddenVideoRef.current.currentTime = time;

      hiddenVideoRef.current.addEventListener(
        'seeked',
        function () {
          ctx.drawImage(hiddenVideoRef.current, 0, 0, canvas.width, canvas.height);
          setThumbnailSrc(canvas.toDataURL());
        },
        { once: true }
      );
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMoveProgress);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMoveProgress);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMoveProgress);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={videoContainerRef}
      className={`${styles.videoArea} ${
        showControls ? styles.showControls : styles.hideControls
      }`}
    >
      {selectedVideo ? (
        selectedVideo.type === 'reading' ? (
          // Mostrar contenido de lectura
          <div className={styles.readingContent}>
            <h3>{selectedVideo.title}</h3>
            <p>{t(`readingContent.${selectedVideo.title}`)}</p>
          </div>
        ) : (
          <>
            {/* Video oculto para generar miniaturas */}
            <video
              ref={hiddenVideoRef}
              src={selectedVideo.src}
              style={{ display: 'none' }}
              muted
            />

            <div
              ref={progressBarContainerRef}
              className={styles.progressBarContainer}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMoveProgressBar}
              onMouseEnter={handleMouseEnterProgressBar}
              onMouseLeave={handleMouseLeaveProgressBar}
            >
              <div className={styles.progressBar} style={{ width: `${progress}%` }} />
              {/* Mostrar la "bolita" solo si isHandleVisible es true */}
              {isHandleVisible && (
                <div
                  className={styles.handle}
                  style={{ left: `${progress}%` }}
                  onMouseDown={handleMouseDown}
                />
              )}
              {/* Mostrar miniatura si está disponible */}
              {hoverProgress !== null && thumbnailSrc && (
                <div className={styles.thumbnail} style={{ left: `${hoverProgress}%` }}>
                  <img src={thumbnailSrc} alt="Thumbnail" />
                </div>
              )}
            </div>
            <video
              ref={videoRef}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              className={styles.video}
              onClick={togglePlayPause}
            >
              <source src={selectedVideo.src} type="video/mp4" />
              {t('videoNotSupported')}
            </video>

            <div className={styles.controls}>
              <div className={styles.leftControls}>
                <div className={styles.tooltipContainer}>
                  <button onClick={togglePlayPause} className={styles.controlButton}>
                    {isPlaying ? <FaPause /> : <FaPlay />}
                  </button>
                  <span className={styles.tooltipplay}>{t('playPause')}</span>
                </div>
                <div className={styles.tooltipContainer}>
                  <button onClick={() => skipTime(-10)} className={styles.controlButton}>
                    <FaBackward />
                  </button>
                  <span className={styles.tooltipback}>{t('rewind')}</span>
                </div>
                <div className={styles.tooltipContainer}>
                  <button
                    onClick={() => adjustSpeed(speed === 1 ? 1.5 : 1)}
                    className={styles.controlButton}
                  >
                    {speed}x
                  </button>
                  <span className={styles.tooltip}>{t('playbackSpeed')}</span>
                </div>
                <div className={styles.tooltipContainer}>
                  <button onClick={() => skipTime(10)} className={styles.controlButton}>
                    <FaForward />
                  </button>
                  <span className={styles.tooltip}>{t('fastForward')}</span>
                </div>
                <div className={styles.tooltipContainer}>
                  <button
                    className={styles.controlButton}
                    onClick={() => alert(t('addNote'))}
                  >
                    <FaRegStickyNote />
                  </button>
                  <span className={styles.tooltip}>{t('addNote')}</span>
                </div>
              </div>

              <div className={styles.rightControls}>
                <div className={styles.tooltipContainer}>
                  <button onClick={toggleMute} className={styles.controlButton}>
                    {volume > 0 ? <FaVolumeUp /> : <FaVolumeMute />}
                  </button>
                  <span className={styles.tooltip}>{t('volume')}</span>
                </div>
                <div className={styles.tooltipContainer}>
                  <button className={styles.controlButton}>CC</button>
                  <span className={styles.tooltip}>{t('subtitles')}</span>
                </div>
                <div className={styles.tooltipContainer}>
                  <button className={styles.controlButton}>
                    <FaCog />
                  </button>
                  <span className={styles.tooltipsettings}>{t('settings')}</span>
                </div>
                <div className={styles.tooltipContainer}>
                  <button onClick={toggleFullscreen} className={styles.controlButton}>
                    {isFullscreen ? <FaCompress /> : <FaExpand />}
                  </button>
                  <span className={styles.tooltipfullscreen}>{isFullscreen ? t('exitFullscreen') : t('fullscreen')}</span>
                </div>
              </div>
            </div>
          </>
        )
      ) : (
        <div className={styles.placeholder}>{t('selectVideo')}</div>
      )}
    </div>
  );
};

export default VideoArea;
