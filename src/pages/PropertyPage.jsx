import React, { useState, useEffect } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import toast, { Toaster } from "react-hot-toast";
import { Upload } from "lucide-react";
import {
    getProperty,
    addProperty,
    updateProperty,
    deleteProperty,
    bulkUploadProperty
} from "../services/propertyService";

export default function PropertyPage() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProperty, setEditingProperty] = useState(null);
    const [uploadFile, setUploadFile] = useState(null);

    const [formData, setFormData] = useState({
        owner_id: "",
        village_id: "",
        property_no: "",
        property_type: "Residential",
        address: "",
        area_sq_ft: "",
        construction_year: "",
        ownership_type: "Owner"
    });

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const res = await getProperty();
            setProperties(res.data.data);
        } catch {
            toast.error("Failed to fetch property data");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingProperty(null);
        setFormData({
            owner_id: "",
            village_id: "",
            property_no: "",
            property_type: "Residential",
            address: "",
            area_sq_ft: "",
            construction_year: "",
            ownership_type: "Owner"
        });
        setIsModalOpen(true);
    };

    const handleEdit = (property) => {
        setEditingProperty(property);
        setFormData(property);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this property?")) return;

        try {
            await deleteProperty(id);
            toast.success("Property deleted successfully!");
            fetchProperties();
        } catch {
            toast.error("Failed to delete property");
        }
    };

    const handleSave = async () => {
        if (!formData.owner_id || !formData.property_no) {
            toast.error("Owner ID & Property Number are required!");
            return;
        }

        try {
            if (editingProperty) {
                await updateProperty(editingProperty.property_id, formData);
                toast.success("Property updated successfully!");
            } else {
                await addProperty(formData);
                toast.success("Property added successfully!");
            }
            setIsModalOpen(false);
            fetchProperties();
        } catch {
            toast.error("Failed to save property");
        }
    };

    // Bulk Upload handler
    const handleBulkUpload = async () => {
        if (!uploadFile) return toast.error("Please select a file first!");

        const formDataUpload = new FormData();
        formDataUpload.append("file", uploadFile);

        try {
            await bulkUploadProperty(formDataUpload);
            toast.success("Bulk upload completed!");
            fetchProperties();
        } catch {
            toast.error("Bulk upload failed!");
        }
    };

    const columns = [
        { header: "Property No", accessor: "property_no" },
        { header: "Type", accessor: "property_type" },
        { header: "Address", accessor: "address" },
        { header: "Area (Sq Ft)", accessor: "area_sq_ft" },
        { header: "Owner", accessor: "owner_id" },
        { header: "Village", accessor: "village_id" },
        { header: "Ownership", accessor: "ownership_type" },
    ];

    return (
        <div className="p-8 space-y-6">
            <Toaster position="top-center" />

            <div className="flex justify-between items-center">
                <SmartDataTable
                    title="Property Management"
                    columns={columns}
                    data={properties}
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    showSerial={true}
                />

                {/* Bulk Upload */}
                <div className="flex items-center gap-3">
                    <input
                        type="file"
                        onChange={e => setUploadFile(e.target.files[0])}
                        className="border p-2 rounded-lg"
                    />
                    <button
                        onClick={handleBulkUpload}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex gap-2 items-center"
                    >
                        <Upload size={18} /> Upload CSV
                    </button>
                </div>
            </div>

            {/* Loader */}
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-[480px]">
                        <h2 className="text-xl font-bold mb-4">
                            {editingProperty ? "Edit Property" : "Add Property"}
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            {Object.keys(formData).map((field) => (
                                <div key={field} className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        {field.replace("_", " ").toUpperCase()}
                                    </label>

                                    {field === "property_type" || field === "ownership_type" ? (
                                        <select
                                            value={formData[field]}
                                            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                                            className="w-full border rounded-lg px-3 py-2"
                                        >
                                            {field === "property_type" && ["Residential", "Commercial", "Agriculture", "Industrial"].map(option => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                            {field === "ownership_type" && ["Owner", "Tenant", "Lease"].map(option => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            value={formData[field]}
                                            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                                            className="w-full border rounded-lg px-3 py-2"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
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
                                {editingProperty ? "Update" : "Add"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
