import React, { useEffect, useRef, useCallback } from 'react';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CarouselComponent.css';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import Menu1 from '../../assets/images/Gran sorteo.jpg';
import { useTranslation } from 'react-i18next'; // Importar useTranslation

const CarouselComponent = ({ setHeaderHeight }) => {
  const { t } = useTranslation('mainCarousel'); // Usar el namespace 'mainCarousel'
  const carouselRef = useRef(null);

  const adjustCarouselHeight = useCallback(() => {
    if (carouselRef.current) {
      const activeItem = carouselRef.current.querySelector('.carousel-item.active');
      if (activeItem) {
        const newHeight = activeItem.offsetHeight;
        setHeaderHeight(`${newHeight}px`);
      }
    }
  }, [setHeaderHeight]);

  useEffect(() => {
    // Solo ajustar la altura si el carrusel está visible en el viewport
    const handleScroll = () => {
      if (carouselRef.current) {
        const bounding = carouselRef.current.getBoundingClientRect();
        if (
          bounding.top >= 0 &&
          bounding.left >= 0 &&
          bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
        ) {
          adjustCarouselHeight(); // Solo ajustar la altura si está en el viewport
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', adjustCarouselHeight);

    // Ajustar altura inicial si las imágenes ya están cargadas
    adjustCarouselHeight();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', adjustCarouselHeight);
    };
  }, [adjustCarouselHeight]);

  useEffect(() => {
    const images = carouselRef.current.querySelectorAll('img');
    images.forEach(image => {
      image.onload = adjustCarouselHeight;
    });
  }, [adjustCarouselHeight]);

  const items = [
    {
      img: Menu1,
      title: t('carousel.title1'), // Traducción dinámica del título desde 'mainCarousel'
      description: t('carousel.description1'), // Traducción dinámica de la descripción
      link: 'https://sitio1.com',
    },
    {
      img: Menu1,
      title: t('carousel.title2'),
      description: t('carousel.description2'),
      link: 'https://sitio2.com',
    },
    {
      img: Menu1,
      title: t('carousel.title3'),
      description: t('carousel.description3'),
      link: 'https://sitio3.com',
    },
  ];

  return (
    <div ref={carouselRef} className="tv-screen">
      <Carousel controls={false} interval={3000} pause={false} fade={false} onSlid={adjustCarouselHeight}>
        {items.map((item, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100"
              src={item.img}
              alt={`Slide ${index + 1}`}
            />
            <Carousel.Caption>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <ButtonComponent text={t('carousel.moreInfo')} link={item.link} /> {/* Traducción del botón */}
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default CarouselComponent;
