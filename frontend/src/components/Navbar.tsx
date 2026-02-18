import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Navbar.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isProductsPage = location.pathname === "/products";

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "si" : "en";
    i18n.changeLanguage(newLang);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    // Update URL in real-time with search term
    if (isProductsPage) {
      if (term.trim()) {
        navigate(`/products?search=${encodeURIComponent(term)}`);
      } else {
        navigate("/products");
      }
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() && !isProductsPage) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <img
            className="brand-logo-icon"
            src="https://res.cloudinary.com/dlago1qei/image/upload/f_auto,q_auto,w_900/Bloom_11_ekmyha.png"
            alt="Bloom Life icon"
            loading="lazy"
          />
          <img
            className="brand-logo-text"
            src="https://res.cloudinary.com/dlago1qei/image/upload/v1771070381/Screenshot_2026-02-13_191552_zhagbw.png"
            alt="Bloom Life"
            loading="lazy"
          />
        </div>

        <button
          className={`menu-toggle ${isMenuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-links ${isMenuOpen ? "open" : ""}`}>
          <a href="/#home" onClick={() => setIsMenuOpen(false)}>
            {t("navbar.home")}
          </a>
          <a href="/#services" onClick={() => setIsMenuOpen(false)}>
            {t("navbar.services")}
          </a>
          <a href="/#new-arrivals" onClick={() => setIsMenuOpen(false)}>
            {t("navbar.newArrivals")}
          </a>
        </div>

        {/* Search Bar - Only on Products Page */}
        {isProductsPage && (
          <form className="navbar-search" onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
              <svg
                className="search-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder={t("navbar.searchPlaceholder")}
                value={searchTerm}
                onChange={handleSearchChange}
                className="navbar-search-input"
              />
              {searchTerm && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => {
                    setSearchTerm("");
                    navigate("/products");
                  }}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </form>
        )}

        <button
          className={`navbar-lang-toggle ${i18n.language === "si" ? "is-si" : "is-en"}`}
          onClick={toggleLanguage}
          aria-label="Switch language"
          role="switch"
          aria-checked={i18n.language === "si"}
          type="button"
        >
          <span className="lang-track">
            <span className="lang-label lang-en">EN</span>
            <span className="lang-label lang-si">සිං</span>
            <span className="lang-thumb" aria-hidden="true"></span>
          </span>
        </button>

        <Link to="/products" className="navbar-cta">
          {t("navbar.shopNow")}
        </Link>
      </div>
    </nav>
  );
}
