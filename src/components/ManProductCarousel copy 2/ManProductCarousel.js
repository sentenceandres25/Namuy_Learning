import React from "react";
import ProductCarouselGeneric from "../ProductCarouselGeneric/ProductCarouselGeneric"; // Importa el componente genérico

const manProducts = [
  { id: 1, name: "Producto Hombre 1", price: "$100", img: "https://via.placeholder.com/150" },
  { id: 2, name: "Producto Hombre 2", price: "$150", img: "https://via.placeholder.com/150" },
  { id: 3, name: "Producto Hombre 3", price: "$200", img: "https://via.placeholder.com/150" },
  { id: 4, name: "Producto Hombre 4", price: "$250", img: "https://via.placeholder.com/150" },
  { id: 5, name: "Producto Hombre 5", price: "$300", img: "https://via.placeholder.com/150" },
  { id: 6, name: "Producto Hombre 6", price: "$300", img: "https://via.placeholder.com/150" },
  { id: 7, name: "Producto Hombre 7", price: "$300", img: "https://via.placeholder.com/150" },
  { id: 8, name: "Producto Hombre 8", price: "$300", img: "https://via.placeholder.com/150" },
  { id: 9, name: "Producto Hombre 9", price: "$300", img: "https://via.placeholder.com/150" },
  { id: 10, name: "Producto Hombre 10", price: "$300", img: "https://via.placeholder.com/150" },
  // Puedes agregar más productos aquí
];

const ManProductCarousel = () => {
  return <ProductCarouselGeneric title="Hombre" products={manProducts} className="man" />;
};

export default ManProductCarousel;
