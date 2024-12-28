// CourseList.jsx

import React from 'react';
import { Row, Col } from 'react-bootstrap';
import CourseCard from './CourseCard'; // Import the course card component
import styles from './CourseListStyles.module.css';

const CourseList = () => {
  const courses = [
    {
      name: 'Course 1',
      progress: '75%',
      lastActivity: 'October 20, 2024',
      pendingEvaluations: 2,
      studyTime: '15 hours'
    },
    {
      name: 'Course 2',
      progress: '50%',
      lastActivity: 'October 18, 2024',
      pendingEvaluations: 1,
      studyTime: '10 hours'
    },
    {
      name: 'Course 3',
      progress: '90%',
      lastActivity: 'October 22, 2024',
      pendingEvaluations: 0,
      studyTime: '20 hours'
    }
  ];

  return (
    <div className={styles.courseListContainer}>
      <Row>
        {courses.map((course, index) => (
          <Col md={4} key={index} className={styles.courseCardCol}>
            <CourseCard course={course} /> {/* Pass course data to the card */}
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CourseList;
