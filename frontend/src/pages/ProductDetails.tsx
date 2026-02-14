import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { MdCheckCircleOutline, MdEdit } from "react-icons/md";
import "./ProductDetails.css";

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
  size?: string;
  tag?: string;
};

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) {
          setError("Product not found");
          setLoading(false);
          return;
        }

        const apiUrl = `${apiBaseUrl.replace(/\/$/, "")}/api/products/${id}`;
        const response = await axios.get(apiUrl);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Unable to load product details");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [apiBaseUrl, id]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/products");
  };

  const handleAskAboutProduct = () => {
    if (!product) return;
    const whatsappNumber = "07041246666"; // Bloom Life WhatsApp number

    // Construct detailed message
    let message = `Hello! I'm interested in the following product:\n\n`;
    message += `📦 *Product:* ${product.name}\n`;

    // Price information
    if (hasDiscount) {
      const discountPercent = Math.round(
        ((product.price - product.discountedPrice!) / product.price) * 100,
      );
      message += `💰 *Price:* Rs. ${product.discountedPrice!.toLocaleString()} (was Rs. ${product.price.toLocaleString()}) - ${discountPercent}% OFF\n`;
    } else {
      message += `💰 *Price:* Rs. ${product.price.toLocaleString()}\n`;
    }

    // Quantity
    message += `📊 *Quantity:* ${quantity}\n`;

    // Design preference
    if (selectedDesign) {
      const designType =
        selectedDesign === "available"
          ? "Use Existing Design"
          : "Request Custom Design";
      message += `🎨 *Design Option:* ${designType}\n`;
    }

    message += `\nPlease let me know more details or confirm this order.`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && (!product || newQuantity <= product.stock)) {
      setQuantity(newQuantity);
    }
  };

  const hasDiscount =
    typeof product?.discountedPrice === "number" &&
    product.discountedPrice > 0 &&
    product.discountedPrice < product.price;

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="error-container">
          <p>{error || "Product not found"}</p>
          <button className="back-button" onClick={handleBack}>
            ← Back to products
          </button>
        </div>
      </div>
    );
  }

  const images =
    product.images && product.images.length > 0 ? product.images : [];

  return (
    <div className="product-detail-page">
      <div className="detail-container">
        <button className="back-button" onClick={handleBack}>
          ← Back
        </button>

        <div className="detail-content">
          {/* Left Side - Image Gallery */}
          <div className="detail-gallery">
            <div className="main-image-container">
              {images.length > 0 ? (
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="main-image"
                />
              ) : (
                <div className="no-image">
                  <span>📦</span>
                  <p>No image available</p>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="thumbnail-gallery">
                {images.map((image, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${selectedImage === index ? "active" : ""}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Product Info */}
          <div className="detail-info">
            {/* Name and Stock Status */}
            <div className="name-stock-header">
              <h1 className="product-name">{product.name}</h1>
              {product.stock === 0 ? (
                <span className="stock-badge out">Out of Stock</span>
              ) : product.stock <= 5 ? (
                <span className="stock-badge low">Low Stock</span>
              ) : (
                <span className="stock-badge in">In Stock</span>
              )}
            </div>

            {/* Price Section */}
            <div className="price-container">
              <div className="price-section">
                {hasDiscount ? (
                  <>
                    <span className="current-price">
                      Rs. {product.discountedPrice!.toLocaleString()}
                    </span>
                    <span className="original-price">
                      Rs. {product.price.toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span className="current-price">
                    Rs. {product.price.toLocaleString()}
                  </span>
                )}
              </div>
              {hasDiscount && (
                <div className="discount-section">
                  <span className="discount-badge-inline">
                    {Math.round(
                      ((product.price - product.discountedPrice!) /
                        product.price) *
                        100,
                    )}
                    %
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            {/* Design Selection Section */}
            <div className="design-section">
              <h3>How Would You Like Your Design?</h3>
              <div className="design-options">
                <button
                  className={`design-option ${selectedDesign === "available" ? "selected" : ""}`}
                  onClick={() => setSelectedDesign("available")}
                >
                  <span className="design-icon">
                    <MdCheckCircleOutline />
                  </span>
                  <span className="design-label">Use Existing Design</span>
                </button>
                <button
                  className={`design-option ${selectedDesign === "customize" ? "selected" : ""}`}
                  onClick={() => setSelectedDesign("customize")}
                >
                  <span className="design-icon">
                    <MdEdit />
                  </span>
                  <span className="design-label">Request Custom Design</span>
                </button>
              </div>
              {selectedDesign && (
                <div className="design-selection-info">
                  {selectedDesign === "available" ? (
                    <p>
                      Your item will be prepared with the available cover page
                      and existing inside pages
                    </p>
                  ) : (
                    <p>
                      Dear cutie, with the limited time that we have, we can
                      customize the cover pages only 💕
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* {product.size && (
              <div className="product-specs">
                <h3>Specifications</h3>
                <div className="spec-item">
                  <span className="spec-label">Size:</span>
                  <span className="spec-value">{product.size}</span>
                </div>
              </div>
            )} */}

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="quantity-section">
                <label className="quantity-label">Quantity:</label>
                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="quantity-value">{quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
                <span className="stock-available">
                  {product.stock} available
                </span>
              </div>
            )}

            {/* Ask Button */}
            <button
              className="ask-button"
              onClick={handleAskAboutProduct}
              disabled={product.stock === 0}
            >
              {/* <span className="button-icon">
                <IoLogoWhatsapp />
              </span> */}
              {product.stock === 0 ? "Out of Stock" : "Ask This Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
