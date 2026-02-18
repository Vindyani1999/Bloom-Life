/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./Products.css";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  images?: string[];
  category: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
};

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Predefined categories
  const categoryOptions = [
    "Notebooks",
    "Planners",
    "Journals",
    "Writing Pads",
    "Calendar",
    "Other",
  ];

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

  useEffect(() => {
    // Update search term when URL params change
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = `${apiBaseUrl.replace(/\/$/, "")}/api/products`;
        const response = await axios.get(apiUrl, {
          params: {
            isActive: "true",
            limit: 100,
          },
        });

        if (response.data.products) {
          const fetchedProducts = response.data.products;
          setProducts(fetchedProducts);

          // Calculate max price
          const maxPrice = Math.max(
            ...fetchedProducts.map((p: Product) => p.price),
          );
          setPriceRange({ min: 0, max: Math.ceil(maxPrice / 1000) * 1000 });
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [apiBaseUrl]);

  // Filter products based on search, category, and price using useMemo
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Category filter - multiple selection
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.some(
          (cat) => product.category.toLowerCase() === cat.toLowerCase(),
        ),
      );
    }

    // Price filter
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange.min && product.price <= priceRange.max,
    );

    return filtered;
  }, [searchTerm, selectedCategories, priceRange, products]);

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "min" | "max",
  ) => {
    const value = parseInt(e.target.value);
    setPriceRange((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category],
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    const maxPrice = Math.max(...products.map((p) => p.price));
    setPriceRange({ min: 0, max: Math.ceil(maxPrice / 1000) * 1000 });
  };

  return (
    <div className="products-page">
      {/* <div className="products-search-section">
        <h1 className="products-title">
          <span className="title-icon">🛍️</span>
          Our Products
        </h1>
      </div> */}

      {/* Main Content with Grid and Filters */}
      <div className="products-main-wrapper">
        {/* Products Grid - Left Side */}
        <main className="products-grid-section">
          {loading ? (
            <div className="products-loading">
              <div className="loading-spinner"></div>
              <p>Loading amazing products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-products">
              <span className="no-products-icon">😢</span>
              <h3>No products found</h3>
              <p>Try adjusting your filters to see more results</p>
              <button onClick={clearFilters} className="reset-btn">
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <Link
                    key={product._id}
                    to={`/products/${product._id}`}
                    className="product-card-link"
                  >
                    <article className="product-card">
                      <div className="product-image">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            loading="lazy"
                          />
                        ) : (
                          <div className="product-placeholder">
                            <span>📦</span>
                          </div>
                        )}
                      </div>

                      <div className="product-content">
                        <h3 className="product-title">{product.name}</h3>
                        <div className="product-price">
                          {typeof product.discountedPrice === "number" &&
                          product.discountedPrice > 0 &&
                          product.discountedPrice < product.price ? (
                            <div className="price-with-discount">
                              <div className="price-stack">
                                <span className="price-value discounted">
                                  Rs. {product.discountedPrice.toLocaleString()}
                                </span>
                                <span className="price-value original">
                                  Rs. {product.price.toLocaleString()}
                                </span>
                              </div>
                              <span className="discount-badge">
                                {Math.round(
                                  ((product.price - product.discountedPrice) /
                                    product.price) *
                                    100,
                                )}
                                % OFF
                              </span>
                            </div>
                          ) : (
                            <span className="price-value">
                              Rs. {product.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </>
          )}
        </main>

        {/* Filter Toggle Button */}
        <button
          className={`filter-toggle ${isFiltersOpen ? "active" : ""}`}
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          title={isFiltersOpen ? "Hide filters" : "Show filters"}
          aria-expanded={isFiltersOpen}
          aria-controls="products-filters"
        >
          {isFiltersOpen ? (
            <img
              src="https://res.cloudinary.com/dlago1qei/image/upload/v1771071428/Bloom_16_xerbgp.png"
              alt="Close filters"
              className="filter-toggle-icon"
            />
          ) : (
            <img
              src="https://res.cloudinary.com/dlago1qei/image/upload/v1771071428/Bloom_16_xerbgp.png"
              alt="Open filters"
              className="filter-toggle-icon"
            />
          )}
          {/* <span className="filter-toggle-icon">⚙️</span> */}
          {/* <span className="filter-toggle-text">
            {isFiltersOpen ? "Hide" : "Filters"}
          </span> */}
        </button>

        {/* Filters Modal Popup */}
        {isFiltersOpen && (
          <div
            className="filters-backdrop"
            onClick={() => setIsFiltersOpen(false)}
          ></div>
        )}
        <div
          id="products-filters"
          className={`products-filters-modal ${isFiltersOpen ? "open" : "closed"}`}
        >
          <div className="filters-content">
            {/* Category Filter */}
            <div className="filter-section">
              <label className="filter-label">Category</label>
              <div className="category-filters">
                {categoryOptions.map((category) => (
                  <label key={category} className="category-checkbox">
                    <input
                      type="checkbox"
                      value={category}
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="filter-section">
              <label className="filter-label">Price Range</label>
              <div className="price-range">
                <div className="price-inputs">
                  {/* <div className="price-input-group">
                    <label>Minimum</label>
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => handlePriceChange(e, "min")}
                      className="price-input"
                      min="0"
                    />
                  </div> */}
                  {/* <div className="price-input-group">
                    <label>Maximum</label>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => handlePriceChange(e, "max")}
                      className="price-input"
                      min={priceRange.min}
                    />
                  </div> */}
                </div>
                <div className="price-slider">
                  <input
                    type="range"
                    min="0"
                    max={Math.max(...products.map((p) => p.price))}
                    value={priceRange.max}
                    onChange={(e) => handlePriceChange(e, "max")}
                    className="slider"
                  />
                </div>
                <div className="price-display">
                  Rs. {priceRange.min.toLocaleString()} — Rs.{" "}
                  {priceRange.max.toLocaleString()}
                </div>
              </div>
            </div>

            <button onClick={clearFilters} className="clear-all-btn">
              Clear All Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
