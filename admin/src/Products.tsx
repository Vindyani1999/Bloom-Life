import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import AddProductModal from "./AddProductModal";
import "./Products.css";

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

export type Product = {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
};

type ProductsProps = {
  apiBaseUrl: string;
  token: string;
};

function Products({ apiBaseUrl, token }: ProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewType, setViewType] = useState<"tile" | "table">("tile");

  const apiUrl = useMemo(
    () => (path: string) => `${apiBaseUrl.replace(/\/$/, "")}${path}`,
    [apiBaseUrl],
  );

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }),
    [token],
  );

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "writing-pads", label: "Writing Pads" },
    { value: "planners", label: "Planners" },
    { value: "notebooks", label: "Notebooks" },
    { value: "accessories", label: "Accessories" },
    { value: "bundles", label: "Bundles" },
    { value: "other", label: "Other" },
  ];

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get<{ products: Product[] }>(
        apiUrl("/api/products?limit=100"),
        { headers },
      );
      setProducts(response.data.products);
    } catch (err) {
      setError("Failed to load products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, headers]);

  const filterProducts = useCallback(() => {
    let filtered = [...products];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.sku?.toLowerCase().includes(query),
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, categoryFilter]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = async (updatedProduct: Product) => {
    try {
      await axios.put(
        apiUrl(`/api/products/${updatedProduct._id}`),
        updatedProduct,
        { headers },
      );

      // Update local state
      setProducts((prev) =>
        prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)),
      );

      handleCloseModal();
    } catch (err) {
      console.error("Failed to update product:", err);
      throw err;
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await axios.delete(apiUrl(`/api/products/${productId}`), { headers });

      // Remove from local state
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      handleCloseModal();
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product");
    }
  };

  const handleAddProduct = async (newProduct: NewProduct) => {
    try {
      await axios.post(apiUrl("/api/products"), newProduct, { headers });

      // Refresh product list to show the new product
      await loadProducts();
      setShowAddModal(false);
    } catch (err) {
      console.error("Failed to add product:", err);
      throw err;
    }
  };

  return (
    <div className="products-container">
      <div className="products-toolbar">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name, description, or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-bar">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <button
          className="add-product-btn"
          onClick={() => setShowAddModal(true)}
        >
          + Add Product
        </button>

        <div className="view-toggle">
          <button
            className={`view-btn ${viewType === "tile" ? "active" : ""}`}
            onClick={() => setViewType("tile")}
            title="Tile view"
          >
            ⊞
          </button>
          <button
            className={`view-btn ${viewType === "table" ? "active" : ""}`}
            onClick={() => setViewType("table")}
            title="Table view"
          >
            ≡
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <>
          <div className="products-count">
            Showing {filteredProducts.length} of {products.length} products
          </div>

          {viewType === "tile" ? (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onClick={() => handleProductClick(product)}
                />
              ))}
            </div>
          ) : (
            <div className="products-table-wrapper">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>SKU</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product._id}>
                      <td>{product.name}</td>
                      <td>{product.sku || "-"}</td>
                      <td>{product.category}</td>
                      <td>Rs. {product.price.toFixed(2)}</td>
                      <td>{product.stock}</td>
                      <td>
                        <span
                          className={`status-badge ${product.isActive ? "active" : "inactive"}`}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="table-action-btn"
                          onClick={() => handleProductClick(product)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredProducts.length === 0 && !loading && (
            <div className="no-products">
              No products found. Try adjusting your search or filters.
            </div>
          )}
        </>
      )}

      {showModal && selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={handleCloseModal}
          onSave={handleSaveProduct}
          onDelete={handleDeleteProduct}
        />
      )}

      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddProduct}
        />
      )}
    </div>
  );
}

export default Products;
