import { useState } from "react";
import "./ProductModal.css";

type NewProduct = {
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  category: string;
  stock: number;
  size?: string;
  imageUrl?: string;
  images?: string[];
  tag?: string;
  isActive: boolean;
  sku?: string;
};

type AddProductModalProps = {
  onClose: () => void;
  onSave: (product: NewProduct) => Promise<void>;
};

const emptyProduct: NewProduct = {
  name: "",
  description: "",
  price: 0,
  discountedPrice: 0,
  category: "writing-pads",
  stock: 0,
  size: "",
  imageUrl: "",
  images: [],
  tag: "",
  isActive: true,
  sku: "",
};

function AddProductModal({ onClose, onSave }: AddProductModalProps) {
  const [newProduct, setNewProduct] = useState<NewProduct>(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showImageManager, setShowImageManager] = useState(false);

  const handleInputChange = (
    field: keyof NewProduct,
    value: string | number | boolean,
  ) => {
    setNewProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddImage = () => {
    const images = newProduct.images || [];
    setNewProduct((prev) => ({
      ...prev,
      images: [...images, ""],
    }));
  };

  const handleRemoveImage = (index: number) => {
    setNewProduct((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  const handleImageUrlChange = (index: number, value: string) => {
    setNewProduct((prev) => ({
      ...prev,
      images: (prev.images || []).map((img, i) => (i === index ? value : img)),
    }));
  };

  const handleSave = async () => {
    // Validation
    if (!newProduct.name.trim()) {
      setError("Product name is required");
      return;
    }

    if (!newProduct.description.trim()) {
      setError("Description is required");
      return;
    }

    if (newProduct.price <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    if (newProduct.stock < 0) {
      setError("Stock cannot be negative");
      return;
    }

    if (
      newProduct.discountedPrice !== undefined &&
      newProduct.discountedPrice > 0 &&
      newProduct.discountedPrice >= newProduct.price
    ) {
      setError("Discounted price must be less than the regular price");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await onSave(newProduct);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to save product:", error.message);
        setError("Failed to save product");
      } else {
        const err = error as { response?: { data?: { message?: string } } };
        console.error("Failed to save product:", err);
        setError(err?.response?.data?.message || "Failed to save product");
      }
    } finally {
      setSaving(false);
    }
  };

  const allImages =
    newProduct.images && newProduct.images.length > 0
      ? newProduct.images
      : newProduct.imageUrl
        ? [newProduct.imageUrl]
        : [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Product</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}

          <div className="form-grid">
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter product name"
              />
            </div>

            <div className="form-group">
              <label>SKU</label>
              <input
                type="text"
                value={newProduct.sku || ""}
                onChange={(e) => handleInputChange("sku", e.target.value)}
                placeholder="Product SKU"
              />
            </div>

            <div className="form-group full-width">
              <label>Description *</label>
              <textarea
                value={newProduct.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={3}
                placeholder="Enter product description"
              />
            </div>

            <div className="form-group">
              <label>Price (Rs.) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={newProduct.price}
                onChange={(e) =>
                  handleInputChange("price", parseFloat(e.target.value) || 0)
                }
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label>Discounted Price (Rs.)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={newProduct.discountedPrice || 0}
                onChange={(e) =>
                  handleInputChange(
                    "discountedPrice",
                    parseFloat(e.target.value) || 0,
                  )
                }
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label>Stock *</label>
              <input
                type="number"
                min="0"
                value={newProduct.stock}
                onChange={(e) =>
                  handleInputChange("stock", parseInt(e.target.value) || 0)
                }
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                value={newProduct.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
              >
                <option value="writing-pads">Writing Pads</option>
                <option value="planners">Planners</option>
                <option value="notebooks">Notebooks</option>
                <option value="accessories">Accessories</option>
                <option value="bundles">Bundles</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Size</label>
              <input
                type="text"
                value={newProduct.size || ""}
                onChange={(e) => handleInputChange("size", e.target.value)}
                placeholder="e.g., A4, Letter"
              />
            </div>

            <div className="form-group">
              <label>Tag</label>
              <input
                type="text"
                value={newProduct.tag || ""}
                onChange={(e) => handleInputChange("tag", e.target.value)}
                placeholder="e.g., bestseller, new"
              />
            </div>

            {/* Image Management Section */}
            <div className="form-group full-width">
              <div className="image-management-header">
                <label>Product Images</label>
                <button
                  type="button"
                  className="button-secondary button-small"
                  onClick={() => setShowImageManager(!showImageManager)}
                >
                  {showImageManager ? "Collapse" : "Manage Images"}
                </button>
              </div>
              {showImageManager && (
                <div className="image-manager">
                  <div className="image-list">
                    {allImages.map((url, index) => (
                      <div key={index} className="image-input-group">
                        <input
                          type="text"
                          value={url}
                          placeholder={`Image URL ${index + 1}`}
                          onChange={(e) =>
                            handleImageUrlChange(index, e.target.value)
                          }
                          className="image-url-input"
                        />
                        <button
                          type="button"
                          className="button-danger button-small"
                          onClick={() => handleRemoveImage(index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="button-primary button-small"
                    onClick={handleAddImage}
                  >
                    + Add Image
                  </button>
                </div>
              )}
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={newProduct.isActive}
                  onChange={(e) =>
                    handleInputChange("isActive", e.target.checked)
                  }
                />
                Active
              </label>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <div></div>
          <div className="modal-actions">
            <button
              className="button-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              className="button-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Creating..." : "Create Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProductModal;
