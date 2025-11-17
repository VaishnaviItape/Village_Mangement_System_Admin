import React, { useEffect, useState } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../services/productService";
import toast, { Toaster } from "react-hot-toast";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    defaultTargetTransactionCount: 0,
    defaultTargetTransactionAmount: 0,
  });

  // 🔄 Fetch Products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ➕ Add Product
  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      defaultTargetTransactionCount: 0,
      defaultTargetTransactionAmount: 0,
    });
    setIsModalOpen(true);
  };

  // ✏️ Edit Product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      defaultTargetTransactionCount: product.defaultTargetTransactionCount,
      defaultTargetTransactionAmount: product.defaultTargetTransactionAmount,
    });
    setIsModalOpen(true);
  };

  // 🗑️ Delete Product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      toast.success("Product deleted successfully!");
      fetchProducts();
    } catch {
      toast.error("Failed to delete product");
    }
  };

  // 💾 Save Product (Add or Update)
  const handleSave = async () => {
    if (!formData.name || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        toast.success("Product updated successfully!");
      } else {
        await addProduct(formData);
        toast.success("Product added successfully!");
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch {
      toast.error("Failed to save product");
    }
  };

  // 🧾 Columns for SmartDataTable
  const columns = [
    // { header: "ID", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Description", accessor: "description" },
    { header: "Target Txn Count", accessor: "defaultTargetTransactionCount" },
    { header: "Target Txn Amount", accessor: "defaultTargetTransactionAmount" },
  ];

  return (
    <div className="p-8 space-y-6">
      <Toaster
        position="top-center"
        toastOptions={{
          style: { minWidth: "400px", fontSize: "18px", padding: "14px 22px" },
        }}
      />

      <SmartDataTable
        title="Product Management"
        columns={columns}
        data={products}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showSerial={true}
      />

      {/* Loader Spinner */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/40 z-50">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-[450px] p-6 animate-fade-in">
            <h2 className="text-lg font-bold text-slate-800 mb-4">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Enter product description"
                  rows="3"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Target Txn Count
                  </label>
                  <input
                    type="number"
                    value={formData.defaultTargetTransactionCount}
                    onChange={(e) =>
                      setFormData({ ...formData, defaultTargetTransactionCount: Number(e.target.value) })
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Target Txn Amount
                  </label>
                  <input
                    type="number"
                    value={formData.defaultTargetTransactionAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, defaultTargetTransactionAmount: Number(e.target.value) })
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex items-center gap-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95"
              >
                {editingProduct ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
