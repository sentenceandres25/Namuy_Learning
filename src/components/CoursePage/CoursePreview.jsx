import React from 'react';
import { motion } from 'framer-motion';
import styles from './CoursePreview.module.css';

const CoursePreview = () => {
  return (
    <motion.div
      className={styles.courseVideoContainer} // Usamos el nuevo contenedor para centrar
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      {/* Video con controles */}
      <video
        src="https://www.w3schools.com/html/mov_bbb.mp4" // Reemplaza con la URL de tu video
        className={styles.courseVideo} // Aplicamos los estilos del video
        controls
      >
        Your browser does not support the video tag.
      </video>
    </motion.div>
  );
};

export default CoursePreview;
