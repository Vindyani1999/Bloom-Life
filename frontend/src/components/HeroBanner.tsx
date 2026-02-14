import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./HeroBanner.css";

const slides = [
  {
    id: 1,
    title: "Bloom Life Stationery",
    subtitle: "For brighter plans and softer days",
    description:
      "Thoughtful writing pads, planners, and bundles made for students, teams, and creatives.",
    image:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1600&h=800&fit=crop",
    cta: "Shop Categories",
    ctaLink: "#catalog",
  },
  {
    id: 2,
    title: "Premium Planners",
    subtitle: "Organize your life beautifully",
    description:
      "Elegant planners designed to help you stay organized and inspired every day.",
    image:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?w=1600&h=800&fit=crop",
    cta: "View Planners",
    ctaLink: "#catalog",
  },
  {
    id: 3,
    title: "Exclusive Bundles",
    subtitle: "Save more, create more",
    description:
      "Curated bundles with everything you need to make your workspace bloom.",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1600&h=800&fit=crop",
    cta: "Shop Bundles",
    ctaLink: "#bundles",
  },
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left
      nextSlide();
    }

    if (touchStart - touchEnd < -75) {
      // Swipe right
      prevSlide();
    }
  };

  return (
    <div
      id="hero"
      className="hero-banner"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="hero-slides">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide ${index === currentSlide ? "active" : ""} ${
              index < currentSlide ? "prev" : ""
            } ${index > currentSlide ? "next" : ""}`}
          >
            <div className="hero-background">
              <div className="hero-overlay"></div>
              <img src={slide.image} alt={slide.title} className="hero-image" />
            </div>

            <div className="hero-content">
              <p className="hero-eyebrow">{slide.subtitle}</p>
              <h1 className="hero-title">{slide.title}</h1>
              <p className="hero-description">{slide.description}</p>
              <div className="hero-actions">
                <Link to="/products" className="hero-cta primary">
                  Explore More
                </Link>
                <Link to="/products" className="hero-cta secondary">
                  Buy Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        className="hero-nav prev"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <svg
          width="24"
          height="24"
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
        className="hero-nav next"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <svg
          width="24"
          height="24"
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

      {/* Dots Navigation */}
      <div className="hero-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`hero-dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
