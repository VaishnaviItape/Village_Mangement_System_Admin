import React, { useEffect, useState } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import {
    getDistricts,
    addDistrict,
    updateDistrict,
    deleteDistrict,
} from "../services/districtService";
import { getState } from "../services/stateService";
import toast, { Toaster } from "react-hot-toast";

export default function DistrictPage() {
    const [districts, setDistricts] = useState([]);
    const [states, setStates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDistrict, setEditingDistrict] = useState(null);

    const [formData, setFormData] = useState({
        district_code: "",
        district_name: "",
        state_id: "",
        is_active: 1,
    });

    // Fetch Districts
    const fetchDistricts = async () => {
        setLoading(true);
        try {
            const res = await getDistricts();
            setDistricts(res.data.data);
        } catch {
            toast.error("Failed to fetch district records");
        } finally {
            setLoading(false);
        }
    };

    // Fetch States for dropdown
    const fetchStates = async () => {
        try {
            const res = await getState();
            setStates(res.data.data);
        } catch {
            toast.error("Failed to load states");
        }
    };

    useEffect(() => {
        fetchDistricts();
        fetchStates();
    }, []);

    // Open Add Modal
    const handleAdd = () => {
        setEditingDistrict(null);
        setFormData({
            district_code: "",
            district_name: "",
            state_id: "",
            is_active: 1,
        });
        setIsModalOpen(true);
    };

    // Edit
    const handleEdit = (item) => {
        setEditingDistrict(item);
        setFormData({
            district_code: item.district_code,
            district_name: item.district_name,
            state_id: item.state_id,
            is_active: item.is_active,
        });
        setIsModalOpen(true);
    };

    // Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this district?")) return;

        try {
            await deleteDistrict(id);
            toast.success("District deleted successfully!");
            fetchDistricts();
        } catch {
            toast.error("Failed to delete district");
        }
    };

    // Save or Update
    const handleSave = async () => {
        if (!formData.district_code || !formData.district_name || !formData.state_id) {
            toast.error("All fields are required!");
            return;
        }

        try {
            if (editingDistrict) {
                await updateDistrict(editingDistrict.id, formData);
                toast.success("District updated successfully!");
            } else {
                await addDistrict(formData);
                toast.success("District added successfully!");
            }
            setIsModalOpen(false);
            fetchDistricts();
        } catch {
            toast.error("Failed to save district");
        }
    };

    const columns = [
        { header: "ID", accessor: "id" },
        { header: "District Code", accessor: "district_code" },
        { header: "District Name", accessor: "district_name" },
        { header: "State", accessor: "state_name" },
        { header: "Active", accessor: "is_active" },
    ];

    return (
        <div className="p-8 space-y-6">
            <Toaster position="top-center" />

            <SmartDataTable
                title="District Management"
                columns={columns}
                data={districts}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showSerial={true}
            />

            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-[450px] p-6">
                        <h2 className="text-lg font-bold mb-4">
                            {editingDistrict ? "Edit District" : "Add District"}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    District Code
                                </label>
                                <input
                                    type="text"
                                    value={formData.district_code}
                                    onChange={(e) =>
                                        setFormData({ ...formData, district_code: e.target.value })
                                    }
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    District Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.district_name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, district_name: e.target.value })
                                    }
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>

                            {/* State Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Select State
                                </label>
                                <select
                                    value={formData.state_id}
                                    onChange={(e) =>
                                        setFormData({ ...formData, state_id: Number(e.target.value) })
                                    }
                                    className="w-full border rounded-lg px-3 py-2"
                                >
                                    <option value="">-- Select State --</option>
                                    {states.map((state) => (
                                        <option key={state.id} value={state.id}>
                                            {state.state_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Active Toggle */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Active Status
                                </label>
                                <select
                                    value={formData.is_active}
                                    onChange={(e) =>
                                        setFormData({ ...formData, is_active: Number(e.target.value) })
                                    }
                                    className="w-full border rounded-lg px-3 py-2"
                                >
                                    <option value={1}>Active</option>
                                    <option value={0}>Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg"
                            >
                                {editingDistrict ? "Update" : "Add"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
