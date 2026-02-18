import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import "./FeaturedProducts.css";

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

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { t } = useTranslation();

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        const apiUrl = `${apiBaseUrl.replace(/\/$/, "")}/api/products`;
        const response = await axios.get(apiUrl, {
          params: {
            limit: 5,
            sort: "-createdAt",
            isActive: "true",
          },
        });

        if (response.data.products) {
          setProducts(response.data.products);
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Unable to load products");
        setLoading(false);
      }
    };

    fetchRecentProducts();
  }, [apiBaseUrl]);

  if (loading) {
    return (
      <section className="featured-products" id="new-arrivals">
        <div className="featured-container">
          <div className="featured-header">
            <p className="eyebrow">{t("featuredProducts.eyebrow")}</p>
            <h2>{t("featuredProducts.title")}</h2>
          </div>
          <div className="loading-state">{t("featuredProducts.loading")}</div>
        </div>
      </section>
    );
  }

  if (error || products.length === 0) {
    return null;
  }

  return (
    <section className="featured-products" id="new-arrivals">
      <div className="featured-container">
        <div className="featured-header">
          <div>
            <p className="eyebrow">{t("featuredProducts.eyebrow")}</p>
            <h2>{t("featuredProducts.title")}</h2>
            <p className="featured-subtitle">
              {t("featuredProducts.subtitle")}
            </p>
          </div>
          <Link to="/products" className="view-all-link">
            {t("featuredProducts.viewAll")}
          </Link>
        </div>

        <div className="featured-grid">
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/products/${product._id}`}
              className="featured-card-link"
            >
              <article className="featured-card">
                <div className="featured-image">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      loading="lazy"
                    />
                  ) : (
                    <div className="featured-placeholder">
                      <span>📦</span>
                    </div>
                  )}
                </div>

                <div className="featured-content">
                  <h3 className="featured-title">{product.name}</h3>
                  <div className="featured-price">
                    {typeof product.discountedPrice === "number" &&
                    product.discountedPrice > 0 &&
                    product.discountedPrice < product.price ? (
                      <div className="price-with-discount">
                        <div className="price-stack">
                          <span className="price-value discounted">
                            {t("common.currency")}{" "}
                            {product.discountedPrice.toLocaleString()}
                          </span>
                          <span className="price-value original">
                            {t("common.currency")}{" "}
                            {product.price.toLocaleString()}
                          </span>
                        </div>
                        <span className="discount-badge">
                          -
                          {Math.round(
                            ((product.price - product.discountedPrice) /
                              product.price) *
                              100,
                          )}
                          {t("featuredProducts.off")}
                        </span>
                      </div>
                    ) : (
                      <span className="price-value">
                        {t("common.currency")} {product.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
