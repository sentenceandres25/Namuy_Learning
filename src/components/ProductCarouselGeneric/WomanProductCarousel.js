import React from "react";
import { useTranslation } from 'react-i18next'; // Importa el hook useTranslation
import ProductCarouselGeneric from "./ProductCarouselGeneric"; // Importa el componente genérico
import { useParams } from 'react-router-dom'; // Importa useParams desde react-router-dom

const WomanProductCarousel = () => {
  const { t } = useTranslation('categoriesData'); // Hook para la traducción
  const { lang } = useParams(); // Obtener el parámetro lang de la URL

  // Subcategorías para mujeres
  const subcategories = ["Accesorios", "Zapatos", "Ropa de Oficina"];

  // Mapear las subcategorías para obtener los productos de cada una
  const womanProducts = subcategories.flatMap(subcategory => {
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
      title={t('categories.mujeres')} // Traducir el título "Mujer"
      products={womanProducts}
      className="woman"
    />
  );
};

export default WomanProductCarousel;
