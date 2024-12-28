import React from 'react';
import { useTranslation } from 'react-i18next';
import './SubcategoryMenu.css';

const SubcategoryMenu = ({ categories, activeCategory, subcategoryImages, setActiveSubcategory }) => {
  const { t } = useTranslation('categoriesData'); // Asegúrate de usar el namespace correcto ('categoriesData')

  return (
    <div className="subcategory-menu">
      {categories[activeCategory].map((subcategory) => (
        <div
          key={subcategory}
          className="menu-item"
          onClick={() => setActiveSubcategory(subcategory)}
        >
          <div className="subcategory-image">
            <img src={subcategoryImages[subcategory]} alt={subcategory} />
          </div>
          {/* Aquí se utiliza t() para traducir la subcategoría */}
          <div className="subcategory-name">{t(`subcategories.${subcategory}`)}</div>
        </div>
      ))}
    </div>
  );
};

export default SubcategoryMenu;
