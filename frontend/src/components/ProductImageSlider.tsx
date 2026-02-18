import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./ProductImageSlider.css";

type ProductImageSliderProps = {
  images: string[];
  productName: string;
};

export default function ProductImageSlider({
  images,
  productName,
}: ProductImageSliderProps) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  if (images.length === 0) {
    return (
      <div className="product-image-placeholder">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="2"
            ry="2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
          <polyline
            points="21 15 16 10 5 21"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <img
        src={images[0]}
        alt={productName}
        className="product-single-image"
        loading="lazy"
      />
    );
  }

  return (
    <div className="product-slider">
      <div className="slider-track">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={t("productImageSlider.imageAlt", {
              productName,
              index: index + 1,
            })}
            className={`slider-image ${index === currentIndex ? "active" : ""}`}
            loading="lazy"
          />
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            className="slider-nav prev"
            onClick={prevSlide}
            aria-label={t("productImageSlider.previous")}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M15 18l-6-6 6-6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            className="slider-nav next"
            onClick={nextSlide}
            aria-label={t("productImageSlider.next")}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M9 18l6-6-6-6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="slider-dots">
            {images.map((_, index) => (
              <button
                key={index}
                className={`slider-dot ${index === currentIndex ? "active" : ""}`}
                onClick={() => goToSlide(index)}
                aria-label={t("productImageSlider.goToImage", {
                  index: index + 1,
                })}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
