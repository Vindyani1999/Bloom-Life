import { useState, useRef } from "react";
import type { Product } from "./Products";
import "./ProductCard.css";

type ProductCardProps = {
  product: Product;
  onClick: () => void;
};

function ProductCard({ product, onClick }: ProductCardProps) {
  // Get all images - use images array if available, otherwise use single imageUrl
  const allImages =
    product.images && product.images.length > 0
      ? product.images
      : product.imageUrl
        ? [product.imageUrl]
        : [];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1,
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1,
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left - show next image
        setCurrentImageIndex((prev) =>
          prev === allImages.length - 1 ? 0 : prev + 1,
        );
      } else {
        // Swiped right - show previous image
        setCurrentImageIndex((prev) =>
          prev === 0 ? allImages.length - 1 : prev - 1,
        );
      }
    }
  };

  const currentImage = allImages[currentImageIndex];
  const hasMultipleImages = allImages.length > 1;
  const hasDiscount =
    typeof product.discountedPrice === "number" &&
    product.discountedPrice > 0 &&
    product.discountedPrice < product.price;

  return (
    <div className="product-card" onClick={onClick}>
      {currentImage && (
        <div
          className="product-image"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img src={currentImage} alt={product.name} />

          {hasMultipleImages && (
            <>
              <button
                className="image-nav-button prev"
                onClick={handlePrevImage}
                aria-label="Previous image"
              >
                ❮
              </button>
              <button
                className="image-nav-button next"
                onClick={handleNextImage}
                aria-label="Next image"
              >
                ❯
              </button>

              <div className="image-indicators">
                {allImages.map((_, index) => (
                  <button
                    key={index}
                    className={`indicator ${index === currentImageIndex ? "active" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>

              <div className="image-counter">
                {currentImageIndex + 1} / {allImages.length}
              </div>
            </>
          )}
        </div>
      )}

      <div className="product-card-content">
        <div className="product-card-header">
          <h3 className="product-name">{product.name}</h3>
          {product.tag && <span className="product-tag">{product.tag}</span>}
        </div>

        {hasDiscount ? (
          <div className="product-price-group">
            <p className="product-price discounted">
              Rs. {product.discountedPrice?.toFixed(2)}
            </p>
            <p className="product-price-original">
              Rs. {product.price.toFixed(2)}
            </p>
          </div>
        ) : (
          <p className="product-price">Rs. {product.price.toFixed(2)}</p>
        )}

        <div className="product-card-footer">
          <span className="product-category">{product.category}</span>
          <span
            className={`product-stock ${product.stock === 0 ? "out-of-stock" : ""}`}
          >
            Stock: {product.stock}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
