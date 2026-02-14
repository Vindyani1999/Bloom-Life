import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const isProductsPage = location.pathname === "/products";

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
            src="/bloom-life-logo.png"
            alt="Bloom Life icon"
            loading="lazy"
          />
          <img
            className="brand-logo-text"
            src="/image.png"
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
            Home
          </a>
          <a href="/#services" onClick={() => setIsMenuOpen(false)}>
            Services
          </a>
          <a href="/#new-arrivals" onClick={() => setIsMenuOpen(false)}>
            New Arrivals
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
                placeholder="Search products..."
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

        <Link to="/products" className="navbar-cta">
          Shop Now
        </Link>
      </div>
    </nav>
  );
}
