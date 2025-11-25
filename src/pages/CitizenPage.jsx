import React, { useEffect, useState } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import { getCitizens, addCitizen, updateCitizen, deleteCitizen } from "../services/citizenService";
import toast, { Toaster } from "react-hot-toast";

export default function CitizenPage() {
    const [citizens, setCitizens] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCitizen, setEditingCitizen] = useState(null);

    const [formData, setFormData] = useState({
        fullName: "",
        age: "",
        gender: "",
        address: "",
        aadhaarNo: ""
    });

    const fetchCitizens = async () => {
        setLoading(true);
        try {
            const res = await getCitizens();
            setCitizens(res.data.data);
        } catch {
            toast.error("Failed to fetch citizen data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCitizens();
    }, []);

    const handleAdd = () => {
        setEditingCitizen(null);
        setFormData({
            fullName: "",
            age: "",
            gender: "",
            address: "",
            aadhaarNo: ""
        });
        setIsModalOpen(true);
    };

    const handleEdit = (citizen) => {
        setEditingCitizen(citizen);
        setFormData({
            fullName: citizen.fullName,
            age: citizen.age,
            gender: citizen.gender,
            address: citizen.address,
            aadhaarNo: citizen.aadhaarNo
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this citizen?")) return;

        try {
            await deleteCitizen(id);
            toast.success("Citizen deleted successfully!");
            fetchCitizens();
        } catch {
            toast.error("Failed to delete citizen");
        }
    };

    const handleSave = async () => {
        if (!formData.fullName || !formData.aadhaarNo) {
            toast.error("Full Name and Aadhaar No are mandatory!");
            return;
        }

        try {
            if (editingCitizen) {
                await updateCitizen(editingCitizen.id, formData);
                toast.success("Citizen updated successfully!");
            } else {
                await addCitizen(formData);
                toast.success("Citizen added successfully!");
            }
            setIsModalOpen(false);
            fetchCitizens();
        } catch {
            toast.error("Failed to save citizen");
        }
    };

    const columns = [
        { header: "Citizen ID", accessor: "id" },
        { header: "Full Name", accessor: "fullName" },
        { header: "Age", accessor: "age" },
        { header: "Gender", accessor: "gender" },
        { header: "Aadhaar No", accessor: "aadhaarNo" },
        { header: "Address", accessor: "address" },
    ];

    return (
        <div className="p-8 space-y-6">
            <Toaster position="top-center" />

            <SmartDataTable
                title="Citizen Management"
                columns={columns}
                data={citizens}
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

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-[450px] p-6">
                        <h2 className="text-lg font-bold mb-4">{editingCitizen ? "Edit Citizen" : "Add Citizen"}</h2>

                        <div className="space-y-4">
                            {Object.keys(formData).map((field) => (
                                <div key={field}>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        {field.replace(/([A-Z])/g, " $1")}
                                    </label>
                                    <input
                                        type={field === "age" ? "number" : "text"}
                                        value={formData[field]}
                                        onChange={(e) =>
                                            setFormData({ ...formData, [field]: e.target.value })
                                        }
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button onClick={() => setIsModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                                Cancel
                            </button>
                            <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded-lg">
                                {editingCitizen ? "Update" : "Add"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
