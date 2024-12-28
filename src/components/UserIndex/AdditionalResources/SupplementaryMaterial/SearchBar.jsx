// Components/SupplementaryMaterial/SearchBar.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SearchBar.module.css';
import { Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ searchQuery, onSearch }) => {
  const { t } = useTranslation('UserIndex/AdditionalResources/SupplementaryMaterial');

  return (
    <div className={styles.searchBar}>
      <Form.Group controlId="materialSearch">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
          />
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
        </InputGroup>
      </Form.Group>
    </div>
  );
};

export default SearchBar;
