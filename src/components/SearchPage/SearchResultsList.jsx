// SearchResultsList.jsx
import React from 'react';
import SearchResultCard from './SearchResultCard';
import styles from './SearchResultsList.module.css';

const SearchResultsList = ({ t, results }) => {
  return (
    <div className={styles.resultsList}>
      {results.map(course => (
        <SearchResultCard key={course.id} t={t} course={course} />
      ))}
    </div>
  );
};

export default SearchResultsList;
