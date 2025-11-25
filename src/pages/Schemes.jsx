import React, { useState, useEffect } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import { getSchemes, addScheme, updateScheme, deleteScheme } from "../services/schemeService";
import toast, { Toaster } from "react-hot-toast";

export default function Schemes() {
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingScheme, setEditingScheme] = useState(null);

    const [formData, setFormData] = useState({
        scheme_name: "",
        eligibility_criteria: "",
        description: "",
        start_date: "",
        end_date: "",
        status: "Active"
    });

    useEffect(() => {
        fetchSchemes();
    }, []);

    const fetchSchemes = async () => {
        setLoading(true);
        try {
            const res = await getSchemes();
            setSchemes(res.data);
        } catch {
            toast.error("Failed to fetch scheme data");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingScheme(null);
        setFormData({
            scheme_name: "",
            eligibility_criteria: "",
            description: "",
            start_date: "",
            end_date: "",
            status: "Active"
        });
        setIsModalOpen(true);
    };

    const handleEdit = (scheme) => {
        setEditingScheme(scheme);
        setFormData({
            ...scheme,
            eligibility_criteria: JSON.stringify(scheme.eligibility_criteria, null, 2)
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this scheme?")) return;

        try {
            await deleteScheme(id);
            toast.success("Scheme deleted successfully!");
            fetchSchemes();
        } catch {
            toast.error("Failed to delete scheme");
        }
    };

    const handleSave = async () => {
        if (!formData.scheme_name) return toast.error("Scheme name is required!");

        try {
            const payload = {
                ...formData,
                eligibility_criteria: JSON.parse(formData.eligibility_criteria || "{}")
            };

            if (editingScheme) {
                await updateScheme(editingScheme.scheme_id, payload);
                toast.success("Scheme updated successfully!");
            } else {
                await addScheme(payload);
                toast.success("Scheme added successfully!");
            }

            setIsModalOpen(false);
            fetchSchemes();
        } catch {
            toast.error("Invalid JSON in eligibility criteria!");
        }
    };

    const columns = [
        { header: "ID", accessor: "scheme_id" },
        { header: "Scheme", accessor: "scheme_name" },
        { header: "Status", accessor: "status" },
        { header: "Start Date", accessor: "start_date" },
        { header: "End Date", accessor: "end_date" },
    ];

    return (
        <div className="p-8 space-y-6">
            <Toaster position="top-center" />

            <SmartDataTable
                title="Scheme Management"
                columns={columns}
                data={schemes}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showSerial={true}
            />

            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-[500px] p-6 shadow-lg">
                        <h2 className="text-lg font-bold mb-4">
                            {editingScheme ? "Edit Scheme" : "Add Scheme"}
                        </h2>

                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Scheme Name"
                                value={formData.scheme_name}
                                onChange={(e) => setFormData({ ...formData, scheme_name: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2"
                            />

                            <textarea
                                rows={3}
                                placeholder="Eligibility Criteria (JSON)"
                                value={formData.eligibility_criteria}
                                onChange={(e) => setFormData({ ...formData, eligibility_criteria: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2 font-mono"
                            />

                            <textarea
                                rows={3}
                                placeholder="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2"
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="date"
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                    className="border rounded-lg px-3 py-2"
                                />

                                <input
                                    type="date"
                                    value={formData.end_date}
                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                    className="border rounded-lg px-3 py-2"
                                />
                            </div>

                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setIsModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                                Cancel
                            </button>
                            <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded-lg">
                                {editingScheme ? "Update" : "Add"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
