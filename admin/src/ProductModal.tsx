/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import type { Product } from "./Products";
import "./ProductModal.css";

type ProductModalProps = {
  product: Product;
  onClose: () => void;
  onSave: (product: Product) => Promise<void>;
  onDelete: (productId: string) => void;
};

function ProductModal({
  product,
  onClose,
  onSave,
  onDelete,
}: ProductModalProps) {
  const [editedProduct, setEditedProduct] = useState<Product>(product);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showImageManager, setShowImageManager] = useState(false);

  const handleInputChange = (
    field: keyof Product,
    value: string | number | boolean,
  ) => {
    setEditedProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddImage = () => {
    const images = editedProduct.images || [];
    setEditedProduct((prev) => ({
      ...prev,
      images: [...images, ""],
    }));
  };

  const handleRemoveImage = (index: number) => {
    setEditedProduct((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  const handleImageUrlChange = (index: number, value: string) => {
    setEditedProduct((prev) => ({
      ...prev,
      images: (prev.images || []).map((img, i) => (i === index ? value : img)),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      await onSave(editedProduct);
    } catch (err) {
      setError("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    onDelete(product._id);
  };

  const allImages =
    editedProduct.images && editedProduct.images.length > 0
      ? editedProduct.images
      : editedProduct.imageUrl
        ? [editedProduct.imageUrl]
        : [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Product</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}

          <div className="form-grid">
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                value={editedProduct.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>SKU</label>
              <input
                type="text"
                value={editedProduct.sku || ""}
                onChange={(e) => handleInputChange("sku", e.target.value)}
              />
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                value={editedProduct.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Price (Rs.)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={editedProduct.price}
                onChange={(e) =>
                  handleInputChange("price", parseFloat(e.target.value) || 0)
                }
              />
            </div>

            <div className="form-group">
              <label>Discounted Price (Rs.)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={editedProduct.discountedPrice || 0}
                onChange={(e) =>
                  handleInputChange(
                    "discountedPrice",
                    parseFloat(e.target.value) || 0,
                  )
                }
              />
            </div>

            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                min="0"
                value={editedProduct.stock}
                onChange={(e) =>
                  handleInputChange("stock", parseInt(e.target.value) || 0)
                }
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={editedProduct.category}
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
                value={editedProduct.size || ""}
                onChange={(e) => handleInputChange("size", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Tag</label>
              <input
                type="text"
                value={editedProduct.tag || ""}
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
                  checked={editedProduct.isActive}
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
          <button
            className="button-danger"
            onClick={handleDelete}
            disabled={saving}
          >
            Delete
          </button>
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
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
