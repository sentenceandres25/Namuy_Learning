import React, { useRef, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { useTranslation } from "react-i18next";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { Link } from 'react-router-dom'; // Importamos el Link de react-router-dom
import './ProductCarouselGeneric.css';

const ProductCarouselGeneric = ({ title, products, className }) => {
  const swiperRef = useRef(null);
  const containerRef = useRef(null);
  const { t } = useTranslation('categoriesData');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (swiperRef.current && swiperRef.current.autoplay) {
            if (entry.isIntersecting) {
              swiperRef.current.autoplay.start();
            } else {
              swiperRef.current.autoplay.stop();
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <Container ref={containerRef} className={`product-carousel ${className} mt-5 mb-5`}>
      <h2 className="text-center mb-4">{title}</h2>
      {products && products.length > 0 ? (
        <div
          onMouseEnter={() => {
            if (swiperRef.current && swiperRef.current.autoplay) {
              swiperRef.current.autoplay.stop();
            }
          }}
          onMouseLeave={() => {
            if (swiperRef.current && swiperRef.current.autoplay) {
              swiperRef.current.autoplay.start();
            }
          }}
        >
          <Swiper
            modules={[Navigation, Autoplay]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            spaceBetween={10}
            slidesPerView={5}
            navigation={true}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            preventInteractionOnTransition={true}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 10 },
              576: { slidesPerView: 2, spaceBetween: 10 },
              768: { slidesPerView: 3, spaceBetween: 10 },
              992: { slidesPerView: 4, spaceBetween: 10 },
              1200: { slidesPerView: 5, spaceBetween: 10 },
            }}
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <div className="product-card text-center">
                  <img
                    src={product.img}
                    alt={t(product.name)}
                    className="img-fluid mb-3"
                  />
                  <h5>{t(product.name)}</h5>
                  <p>{product.price}</p>
                  {/* Usar Link para la navegación */}
                  <Link to={product.link} className="btn btn-dark">
                    {t('verMas')}
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <p className="text-center">{t('noProductosDisponibles')}</p>
      )}
    </Container>
  );
};

export default ProductCarouselGeneric;
