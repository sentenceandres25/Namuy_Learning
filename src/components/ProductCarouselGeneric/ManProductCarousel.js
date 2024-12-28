import React from "react";
import ProductCarouselGeneric from "./ProductCarouselGeneric"; // Importa el componente genérico
import { useTranslation } from 'react-i18next'; // Importa el hook useTranslation
import { useParams } from 'react-router-dom'; // Importa useParams desde react-router-dom

// Filtrar productos de la categoría "hombres"
const ManProductCarousel = () => {
  const { t } = useTranslation('categoriesData'); // Hook para la traducción
  const { lang } = useParams(); // Obtener el parámetro lang de la URL

  // Subcategorías para hombres
  const subcategories = ["Corbatas", "Relojes", "Calzado"];

  // Mapear las subcategorías para obtener los productos de cada una
  const manProducts = subcategories.flatMap(subcategory => {
    const products = t(`products.${subcategory}`, { returnObjects: true }); // Obtener los productos de la subcategoría

    // Mapear los productos traducidos
    return Object.keys(products).map((productKey, index) => ({
      id: `${subcategory}-${index + 1}`, // Generar un id único combinando la subcategoría y el índice
      name: t(`products.${subcategory}.${productKey}`), // Traducir el nombre del producto
      price: "$100", // Precio fijo para ejemplo, puede ser dinámico
      img: "https://via.placeholder.com/150", // Imagen de ejemplo, puede ser dinámico
      link: `/user/CoursePage/${lang}`
    }));
  });

  return (
    <ProductCarouselGeneric
      title={t('categories.hombres')} // Traducir el título "Hombres"
      products={manProducts}
      className="man"
    />
  );
};

export default ManProductCarousel;
