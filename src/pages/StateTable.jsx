import React, { useEffect, useState } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import {
    getState,
    addState,
    updateState,
    deleteState
} from "../services/stateService";
import toast, { Toaster } from "react-hot-toast";

export default function StatePage() {
    const [states, setStates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingState, setEditingState] = useState(null);
    const [formData, setFormData] = useState({
        state_code: "",
        state_name: "",
        is_active: 1
    });

    // Fetch All States
    const fetchStates = async () => {
        setLoading(true);
        try {
            const res = await getState();
            setStates(res.data.data);
        } catch {
            toast.error("Failed to fetch state records");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStates();
    }, []);

    // Add
    const handleAdd = () => {
        setEditingState(null);
        setFormData({
            state_code: "",
            state_name: "",
            is_active: 1
        });
        setIsModalOpen(true);
    };

    // Edit
    const handleEdit = (state) => {
        setEditingState(state);
        setFormData({
            state_code: state.state_code,
            state_name: state.state_name,
            is_active: state.is_active
        });
        setIsModalOpen(true);
    };

    // Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this state?")) return;

        try {
            await deleteState(id);
            toast.success("State deleted successfully!");
            fetchStates();
        } catch {
            toast.error("Failed to delete state");
        }
    };

    // Save (Add or Update)
    const handleSave = async () => {
        if (!formData.state_code || !formData.state_name) {
            toast.error("State Code and State Name are required!");
            return;
        }

        try {
            if (editingState) {
                await updateState(editingState.id, formData);
                toast.success("State updated successfully!");
            } else {
                await addState(formData);
                toast.success("State added successfully!");
            }

            setIsModalOpen(false);
            fetchStates();
        } catch {
            toast.error("Failed to save state");
        }
    };

    // Table Columns
    const columns = [
        { header: "ID", accessor: "id" },
        { header: "State Code", accessor: "state_code" },
        { header: "State Name", accessor: "state_name" },
        { header: "Active", accessor: "is_active" }
    ];

    return (
        <div className="p-8 space-y-6">
            <Toaster position="top-center" />

            <SmartDataTable
                title="State Management"
                columns={columns}
                data={states}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showSerial={true}
            />

            {/* Loader */}
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
                            {editingState ? "Edit State" : "Add State"}
                        </h2>

                        <div className="space-y-4">
                            {/* State Code */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    State Code
                                </label>
                                <input
                                    type="text"
                                    value={formData.state_code}
                                    onChange={(e) =>
                                        setFormData({ ...formData, state_code: e.target.value })
                                    }
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>

                            {/* State Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    State Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.state_name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, state_name: e.target.value })
                                    }
                                    className="w-full border rounded-lg px-3 py-2"
                                />
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
                                {editingState ? "Update" : "Add"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
