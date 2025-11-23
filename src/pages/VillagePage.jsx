import React, { useEffect, useState } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import {
    getVillages,
    addVillage,
    updateVillage,
    deleteVillage
} from "../services/villageService";
import toast, { Toaster } from "react-hot-toast";

export default function VillagePage() {
    const [villages, setVillages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVillage, setEditingVillage] = useState(null);
    const [formData, setFormData] = useState({
        VillageName: "",
        District: "",
        State: "",
        Population: "",
        Area: ""
    });

    // Fetch All Villages
    const fetchVillages = async () => {
        setLoading(true);
        try {
            const res = await getVillages();
            setVillages(res.data.data);
        } catch {
            toast.error("Failed to fetch village data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVillages();
    }, []);

    // Add
    const handleAdd = () => {
        setEditingVillage(null);
        setFormData({
            VillageName: "",
            District: "",
            State: "",
            Population: "",
            Area: ""
        });
        setIsModalOpen(true);
    };

    // Edit
    const handleEdit = (village) => {
        setEditingVillage(village);
        setFormData({
            VillageName: village.VillageName,
            District: village.District,
            State: village.State,
            Population: village.Population,
            Area: village.Area
        });
        setIsModalOpen(true);
    };

    // Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this village?")) return;

        try {
            await deleteVillage(id);
            toast.success("Village deleted successfully!");
            fetchVillages();
        } catch {
            toast.error("Failed to delete village");
        }
    };

    // Save (Add or Update)
    const handleSave = async () => {
        if (!formData.VillageName || !formData.State) {
            toast.error("Village Name and State are required!");
            return;
        }

        try {
            if (editingVillage) {
                await updateVillage(editingVillage.VillageID, formData);
                toast.success("Village updated successfully!");
            } else {
                await addVillage(formData);
                toast.success("Village added successfully!");
            }
            setIsModalOpen(false);
            fetchVillages();
        } catch {
            toast.error("Failed to save village");
        }
    };

    // Table Columns
    const columns = [
        { header: "Village ID", accessor: "VillageID" },
        { header: "Village Name", accessor: "VillageName" },
        { header: "District", accessor: "District" },
        { header: "State", accessor: "State" },
        { header: "Population", accessor: "Population" },
        { header: "Area (sq/km)", accessor: "Area" },
    ];

    return (
        <div className="p-8 space-y-6">
            <Toaster position="top-center" />

            <SmartDataTable
                title="Village Management"
                columns={columns}
                data={villages}
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
                            {editingVillage ? "Edit Village" : "Add Village"}
                        </h2>

                        <div className="space-y-4">
                            {["VillageName", "District", "State", "Population", "Area"].map(
                                (field) => (
                                    <div key={field}>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            {field.replace(/([A-Z])/g, " $1")}
                                        </label>
                                        <input
                                            type={field === "Population" || field === "Area" ? "number" : "text"}
                                            value={formData[field]}
                                            onChange={(e) =>
                                                setFormData({ ...formData, [field]: e.target.value })
                                            }
                                            className="w-full border rounded-lg px-3 py-2"
                                        />
                                    </div>
                                )
                            )}
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
                                {editingVillage ? "Update" : "Add"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
