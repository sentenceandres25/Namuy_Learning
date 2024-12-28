import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ProductMenu.css';

const ProductMenu = ({ activeSubcategory, products, productImages }) => {
  const { t } = useTranslation('categoriesData'); // Asegúrate de usar el namespace correcto ('categoriesData')

  // Verifica si hay productos para la subcategoría activa
  const currentProducts = products[activeSubcategory] || [];

  return (
    <div className="product-menu">
      {activeSubcategory && currentProducts.length > 0 ? (
        currentProducts.map((product) => (
          <Link to={`/product/${product}`} key={product} className="product-item">
            <div className="product-image">
              {/* Verifica si hay una imagen para el producto y usa una imagen por defecto si no existe */}
              <img
                src={productImages[product] || '/path/to/default-image.jpg'}
                alt={t(`products.${activeSubcategory}.${product}`)}
              />
            </div>
            <div className="product-name">
              {/* Traducción del nombre del producto */}
              {t(`products.${activeSubcategory}.${product}`)}
            </div>
          </Link>
        ))
      ) : (
        <div className="product-item">{t('NoProducts')}</div> // Texto traducido si no hay productos
      )}
    </div>
  );
};

export default ProductMenu;
