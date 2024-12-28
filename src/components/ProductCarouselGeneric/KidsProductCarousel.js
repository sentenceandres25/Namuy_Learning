import React from "react";
import { useTranslation } from 'react-i18next'; // Importa el hook de traducción
import ProductCarouselGeneric from "../ProductCarouselGeneric/ProductCarouselGeneric"; // Importa el componente del carrusel
import { useParams } from 'react-router-dom'; // Importa useParams desde react-router-dom

const KidsProductCarousel = () => {
  const { t } = useTranslation('categoriesData'); // Hook para traducción
  const { lang } = useParams(); // Obtener el parámetro lang de la URL

  // Obtener las subcategorías de la categoría 'ninos' (niños)
  const subcategories = ["Juguetes", "Libros", "Ropa"];
  
  // Mapear las subcategorías para obtener los productos de cada una
  const kidsProducts = subcategories.flatMap(subcategory => {
    const translatedSubcategory = t(`subcategories.${subcategory}`); // Traducir la subcategoría
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
      title={t('categories.ninos')} // Traducir el título "Niños"
      products={kidsProducts}
      className="kids"
    />
  );
};

export default KidsProductCarousel;
