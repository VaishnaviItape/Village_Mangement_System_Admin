import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import SmartDataTable from "../components/tables/SmartDataTable";
import { useNavigate, useParams } from "react-router-dom";
import {
  getClientById,
  getClients,
  addClient,
  updateClient,
  deleteClient,
  getRoles
} from "../services/clientService";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [stats, setStats] = useState({ totalActive: 0, totalClients: 0 });
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    roles: "",
    isActive: true,
  });

  // Fetch all clients
  const fetchClients = async (token) => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getClients(token);
      const safeData = Array.isArray(data) ? data : [];
      setClients(safeData);

      const activeCount = safeData.filter((c) => c.isActive).length;
      setStats({ totalActive: activeCount, totalClients: safeData.length });
    } catch (err) {
      toast.error("Failed to fetch clients!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch single client by ID (for edit via route param)
  const fetchClientById = async (clientId) => {
    const token = localStorage.getItem("authToken");
    if (!token || !clientId) return;

    try {
      const client = await getClientById(clientId, token);
      if (client) setFormData(client);
    } catch (err) {
      toast.error("Failed to fetch client details!");
      console.error(err);
    }
  };
  const [roleList, setRoleList] = useState([]);
  const fetchRoles = async (token) => {
    try {
      const data = await getRoles(token);
      setRoleList(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load roles!");
      console.error(err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchClients(token);
    fetchRoles(token);
    if (id) fetchClientById(id);
  }, [id, navigate]);

  // Reset form
  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      roles: "",
      isActive: true,
    });
  };

  // Add
  const handleAdd = () => {
    resetForm();
    setEditingClient(null);
    setShowModal(true);
  };
  const onUpload = () => {
    alert("Upload button clicked!");
    // You can add file input, modal, API upload, etc.
  };

  // Edit
  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData(client);
    setShowModal(true);
  };

  // Save
  const handleSave = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Session expired! Please login again.");
      navigate("/login");
      return;
    }

    if (!formData.fullName || !formData.email) {
      toast.error("Name and Email are required!");
      return;
    }

    try {
      if (editingClient) {
        await updateClient(editingClient.id, formData, token);
        toast.success("Users updated successfully!");
      } else {
        await addClient(formData, token);
        toast.success("Users added successfully!");
      }

      await fetchClients(token);
      setShowModal(false);
      setEditingClient(null);
      resetForm();
    } catch (error) {
      console.error("❌ Save Error:", error);
      toast.error("Failed to save client!");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this client?")) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Session expired! Please login again.");
      navigate("/login");
      return;
    }

    try {
      await deleteClient(id, token);
      toast.success("Users deleted!");
      fetchClients(token);
    } catch {
      toast.error("Failed to delete client!");
    }
  };

  // Table columns
  const columns = [
    { header: "Name", accessor: "fullName" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "roles" },
  ];

  return (
    <div className="p-4">
      <Toaster
        position="top-center"
        toastOptions={{
          style: { minWidth: "400px", fontSize: "18px", padding: "16px" },
        }}
      />

      {/* Stats Section */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-6 mb-5">
        {/* Total Users */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-500 p-6 rounded-2xl shadow-lg text-white">
          <h3 className="text-sm text-white/90">Total Users</h3>
          <p className="text-3xl font-bold">{stats.totalClients}</p>
        </div>

        {/* Active Users */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 rounded-2xl shadow-lg text-white">
          <h3 className="text-sm text-white/90">Active Users</h3>
          <p className="text-3xl font-bold">{stats.totalActive}</p>
        </div>
      </div>

      {/* Data Table */}
      <SmartDataTable
        title="Users"
        columns={columns}
        data={clients}
        onUpload={onUpload}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={(id) => handleDelete(id)}
        showSerial={true}
      />

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[400px] p-6 animate-fade-in">
            <h2 className="text-lg font-bold text-slate-800 mb-5">
              {editingClient ? "Edit User" : "Add User"}
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <select
                value={formData.roles}
                onChange={(e) =>
                  setFormData({ ...formData, roles: e.target.value })
                }
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select Role</option>

                {roleList.map((role) => (
                  <option key={role.id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>


              <select
                value={formData.isActive ? "Active" : "Inactive"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isActive: e.target.value === "Active",
                  })
                }
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl"
              >
                {editingClient ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
