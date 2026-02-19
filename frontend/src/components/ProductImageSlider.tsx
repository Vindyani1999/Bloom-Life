import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./ProductImageSlider.css";

interface ProductImageSliderProps {
  images: string[];
  productName: string;
}

export default function ProductImageSlider({
  images,
  productName,
}: ProductImageSliderProps) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsAutoPlaying(false);
  };

  const openLightbox = () => {
    setIsLightboxOpen(true);
    setZoomLevel(150);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setZoomLevel(100);
  };

  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 20, 300));
  };

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 20, 100));
  };

  const resetZoom = () => {
    setZoomLevel(100);
  };

  if (images.length === 0) {
    return (
      <div className="product-slider empty">
        <svg
          width="100"
          height="100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="3" y="3" width="18" height="18" rx="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <path d="M21 15l-5-5L5 21"></path>
        </svg>
        <p>{t("productImageSlider.noImages")}</p>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <>
        <div className="product-slider" onClick={openLightbox}>
          <img
            src={images[0]}
            alt={productName}
            className="slider-image"
            loading="lazy"
          />
          <div className="zoom-button-overlay">
            <button
              className="zoom-icon-button"
              aria-label="Zoom"
              onClick={(e) => {
                e.stopPropagation();
                openLightbox();
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
            </button>
          </div>
        </div>

        {isLightboxOpen && (
          <div className="lightbox-overlay" onClick={closeLightbox}>
            <div
              className="lightbox-container"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="lightbox-close"
                onClick={closeLightbox}
                aria-label="Close"
              >
                ×
              </button>
              <div className="lightbox-image-wrapper">
                <img
                  src={images[0]}
                  alt={productName}
                  className="lightbox-image"
                  style={{ transform: `scale(${zoomLevel / 100})` }}
                />
              </div>
              <div className="lightbox-controls">
                <button
                  onClick={zoomOut}
                  className="zoom-btn"
                  disabled={zoomLevel === 100}
                  title="Zoom Out"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                </button>
                <span className="zoom-level">{zoomLevel}%</span>
                <button
                  onClick={zoomIn}
                  className="zoom-btn"
                  disabled={zoomLevel === 300}
                  title="Zoom In"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                    <line x1="11" y1="8" x2="11" y2="14"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                </button>
                <button
                  onClick={resetZoom}
                  className="zoom-btn reset-btn"
                  title="Reset"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="product-slider-wrapper">
        <div className="product-slider" onClick={openLightbox}>
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

        <div className="zoom-button-overlay">
          <button
            className="zoom-icon-button"
            aria-label="Zoom"
            onClick={(e) => {
              e.stopPropagation();
              openLightbox();
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </button>
        </div>
      </div>

      {isLightboxOpen && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div
            className="lightbox-container"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="lightbox-close"
              onClick={closeLightbox}
              aria-label="Close"
            >
              ×
            </button>
            <div className="lightbox-image-wrapper">
              <img
                src={images[currentIndex]}
                alt={productName}
                className="lightbox-image"
                style={{ transform: `scale(${zoomLevel / 100})` }}
              />
            </div>

            {images.length > 1 && (
              <>
                <button
                  className="lightbox-nav prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(
                      (prev) => (prev - 1 + images.length) % images.length,
                    );
                  }}
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  className="lightbox-nav next"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex((prev) => (prev + 1) % images.length);
                  }}
                  aria-label="Next image"
                >
                  ›
                </button>
              </>
            )}

            <div className="lightbox-controls">
              <button
                onClick={zoomOut}
                className="zoom-btn"
                disabled={zoomLevel === 100}
                title="Zoom Out"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
              </button>
              <span className="zoom-level">{zoomLevel}%</span>
              <button
                onClick={zoomIn}
                className="zoom-btn"
                disabled={zoomLevel === 300}
                title="Zoom In"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                  <line x1="11" y1="8" x2="11" y2="14"></line>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
              </button>
              <button
                onClick={resetZoom}
                className="zoom-btn reset-btn"
                title="Reset"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
