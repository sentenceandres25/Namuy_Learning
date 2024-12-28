import React from 'react';
import './Categories.css'; // Importa el archivo CSS para los estilos
import { useTranslation } from 'react-i18next'; // Importa el hook useTranslation
import { categories } from '../data/categories'; // Importa las categorías desde el archivo data/categories
import { categoryImages } from './CategoryImages'; // Importa las imágenes

const Categories = () => {
  const { t } = useTranslation('categoriesData'); // Hook para traducción

  // Generar una lista con las claves principales de las categorías
  const categoryList = Object.keys(categories);

  return (
    <div className="categories-container">
      {categoryList.map((categoryKey, index) => (
        <div key={index} className="category-box">
          <img src={categoryImages[categoryKey]} alt={t(`categories.${categoryKey}`)} />
          <h3>{t(`categories.${categoryKey}`)}</h3> {/* Traducción del nombre de la categoría */}
        </div>
      ))}
    </div>
  );
};

export default Categories;
