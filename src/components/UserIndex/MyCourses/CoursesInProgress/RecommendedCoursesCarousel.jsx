import React from "react";
import ProductCarouselGeneric from "../../../ProductCarouselGeneric/ProductCarouselGeneric"; // Reusing the generic component
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook
import { useParams } from 'react-router-dom'; // Import useParams from react-router-dom

// Recommended courses component
const RecommendedCoursesCarousel = () => {
  const { t } = useTranslation('UserIndex/MyCourses/CoursesInProgress'); // Hook for translation
  const { lang } = useParams(); // Get the lang parameter from the URL

  // Recommended courses (example data, can come from an API or database)
  const recommendedCourses = [
    {
      id: 'course-1',
      name: t('course_1.name'),
      description: t('course_1.description'),
      img: "https://via.placeholder.com/150",
      price: "$200",
      link: "/courses/course-1", // Unique link for course 1
    },
    {
      id: 'course-2',
      name: t('course_2.name'),
      description: t('course_2.description'),
      img: "https://via.placeholder.com/150",
      price: "$150",
      link: "/courses/course-2", // Unique link for course 2
    },
    {
      id: 'course-3',
      name: t('course_3.name'),
      description: t('course_3.description'),
      img: "https://via.placeholder.com/150",
      price: "$180",
      link: "/courses/course-3", // Unique link for course 3
    },
    {
      id: 'course-4',
      name: t('course_4.name'),
      description: t('course_4.description'),
      img: "https://via.placeholder.com/150",
      price: "$220",
      link: `/user/CoursePage/${lang}`, // Unique link for course 4 using dynamic language parameter
    }
  ];

  return (
    <ProductCarouselGeneric
      title={t('recommended_courses')} // Translated carousel title
      products={recommendedCourses} // Pass the recommended courses as products
      className="recommended-courses" // Unique class for styling
    />
  );
};

export default RecommendedCoursesCarousel;
