

import React, { useEffect, useState } from "react";
import {
  getSubscriptionPlans,
  addSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
} from "../services/subscriptionPlanService";
import toast, { Toaster } from "react-hot-toast";
import SmartDataTable from "../components/tables/SmartDataTable";

export default function SubscriptionPlanTable() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    billingCycle: "Monthly",
    maxProperties: "",
    maxBuildings: "",
    maxUnits: "",
    maxUsers: "",
    supportIncluded: false,
  });

  // ✅ Fetch Plans
  const fetchPlans = async () => {
    setLoading(true);
    try {
      const data = await getSubscriptionPlans();
      const safeData = Array.isArray(data) ? data : [];
      const formattedPlans = safeData.map((x) => ({
        ...x,
        price: `₹${x.price}`,                     // ₹ add
        //supportIncluded: x.supportIncluded ? "✅ Yes" : "❌ No", // boolean to string
      }));
      setPlans(formattedPlans);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch subscription plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // ✅ Save Plan (Add / Update)
  const handleSave = async () => {
    if (!formData.name || !formData.price) {
      toast.error("All fields required!");
      return;
    }

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
      };

      if (editingPlan) {
        await updateSubscriptionPlan(editingPlan.id, payload);
        toast.success("Plan updated successfully!");
      } else {
        await addSubscriptionPlan(payload);
        toast.success("Plan added successfully!");
      }

      fetchPlans();
      setShowModal(false);
      setEditingPlan(null);
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save plan!");
    }
  };

  // 🗑️ Delete Plan
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this plan?")) return;
    try {
      await deleteSubscriptionPlan(id);
      toast.success("Plan deleted!");
      fetchPlans();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete plan");
    }
  };

  // ♻️ Reset Form
  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      billingCycle: "Monthly",
      maxProperties: "",
      maxBuildings: "",
      maxUnits: "",
      maxUsers: "",
      supportIncluded: false,
    });
  };

  // ✏️ Edit
  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      ...plan,
      price: parseFloat(plan.price.replace("₹", "")), // Remove ₹ for editing
      supportIncluded: plan.supportIncluded === "✅ Yes", // Convert back to boolean
    });
    setShowModal(true);
  };

  // ➕ Add
  const handleAdd = () => {
    setEditingPlan(null);
    resetForm();
    setShowModal(true);
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Price", accessor: "price", cell: (row) => row.price },
    { header: "Billing", accessor: "billingCycle" },
    { header: "Properties", accessor: "maxProperties" },
    { header: "Buildings", accessor: "maxBuildings" },
    { header: "Units", accessor: "maxUnits" },
    { header: "Users", accessor: "maxUsers" },
    {
      header: "Support",
      accessor: "supportIncluded",
      cell: (row) => {
        const isYes =
          row.supportIncluded === true ||
          row.supportIncluded === "✅ Yes" ||
          row.supportIncluded === "Yes";

        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${isYes ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
          >
            {isYes ? "Yes" : "No"}
          </span>
        );
      },
    }
  ];

  return (
    <div>
      <Toaster
        position="top-center"
        toastOptions={{
          style: { minWidth: "400px", fontSize: "20px", padding: "16px 24px" },
        }}
      />

      <SmartDataTable
        title="Subscription Plans"
        columns={columns}
        data={Array.isArray(plans) ? plans : []}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={(row) => handleDelete(row.id)}
        showSerial={true}
      />

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/40 z-50">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-[440px] p-6 animate-fade-in">
            <h2 className="text-lg font-bold text-slate-800 mb-4">
              {editingPlan ? "Edit Plan" : "Add New Plan"}
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Plan Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />

              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />

              <select
                value={formData.billingCycle}
                onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Max Properties"
                  value={formData.maxProperties}
                  onChange={(e) => setFormData({ ...formData, maxProperties: e.target.value })}
                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  placeholder="Max Buildings"
                  value={formData.maxBuildings}
                  onChange={(e) => setFormData({ ...formData, maxBuildings: e.target.value })}
                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  placeholder="Max Units"
                  value={formData.maxUnits}
                  onChange={(e) => setFormData({ ...formData, maxUnits: e.target.value })}
                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  placeholder="Max Users"
                  value={formData.maxUsers}
                  onChange={(e) => setFormData({ ...formData, maxUsers: e.target.value })}
                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.supportIncluded}
                  onChange={(e) => setFormData({ ...formData, supportIncluded: e.target.checked })}
                />
                Include Support
              </label>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex items-center gap-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95"
              >
                {editingPlan ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
