import React, { useState, useEffect } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import toast, { Toaster } from "react-hot-toast";
import { Upload } from "lucide-react";
import {
    getProperty,
    addProperty,
    updateProperty,
    deleteProperty,
    bulkUploadProperty,
} from "../services/propertyService";
import { getVillages } from "../services/villageService";

import SmartModal from "../components/ui/SmartModal";
import SmartFormField from "../components/ui/SmartFormField";

export default function PropertyPage() {
    const [properties, setProperties] = useState([]);
    const [villages, setVillages] = useState([]);

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
        ownership_type: "Owner",
    });

    useEffect(() => {
        fetchProperties();
        fetchVillages();
    }, []);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const res = await getProperty();
            setProperties(res.data.data || []);
        } catch {
            toast.error("Failed to fetch properties");
        } finally {
            setLoading(false);
        }
    };

    const fetchVillages = async () => {
        try {
            const res = await getVillages();
            setVillages(res.data.data || []);
        } catch {
            toast.error("Failed to load villages");
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
            ownership_type: "Owner",
        });
        setIsModalOpen(true);
    };

    const handleEdit = (property) => {
        setEditingProperty(property);
        setFormData({
            owner_id: property.owner_id,
            village_id: property.village_id,
            property_no: property.property_no,
            property_type: property.property_type,
            address: property.address,
            area_sq_ft: property.area_sq_ft,
            construction_year: property.construction_year,
            ownership_type: property.ownership_type,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this property?")) return;

        try {
            await deleteProperty(id);
            toast.success("Property deleted");
            fetchProperties();
        } catch {
            toast.error("Failed to delete property");
        }
    };

    const handleSave = async () => {
        const formattedData = {
            ...formData,
            owner_id: Number(formData.owner_id),
            village_id: Number(formData.village_id),
            area_sq_ft: Number(formData.area_sq_ft),
            construction_year: Number(formData.construction_year),
        };

        try {
            if (editingProperty) {
                await updateProperty(editingProperty.property_id, formattedData);
                toast.success("Property updated");
            } else {
                await addProperty(formattedData);
                toast.success("Property added");
            }
            setIsModalOpen(false);
            fetchProperties();
        } catch {
            toast.error("Failed to save property");
        }
    };

    // BULK CSV UPLOAD
    const handleBulkUpload = async () => {
        if (!uploadFile) return toast.error("Please select a CSV file first!");

        const form = new FormData();
        form.append("file", uploadFile);

        try {
            await bulkUploadProperty(form);
            toast.success("Bulk Upload Completed");
            fetchProperties();
        } catch {
            toast.error("Bulk Upload Failed");
        }
    };

    // Add villageName to table
    const displayedProperties = properties.map((p) => {
        const village = villages.find((v) => v.VillageID === p.village_id);
        return {
            ...p,
            villageName: village ? village.VillageName : "",
        };
    });

    const columns = [
        { header: "Property No", accessor: "property_no" },
        { header: "Type", accessor: "property_type" },
        { header: "Address", accessor: "address" },
        { header: "Area Sq Ft", accessor: "area_sq_ft" },
        { header: "Owner ID", accessor: "owner_id" },
        { header: "Village", accessor: "villageName" },
        { header: "Ownership", accessor: "ownership_type" },
    ];

    return (
        <div className="p-8 space-y-6">
            <Toaster position="top-center" />

            {/* TABLE + BULK UPLOAD */}
            <div className="flex justify-between items-center">
                <SmartDataTable
                    title="Property Management"
                    columns={columns}
                    data={displayedProperties}
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    showSerial={true}
                />

                {/* BULK UPLOAD */}
                {/* <div className="flex items-center gap-3">
                    <input
                        type="file"
                        onChange={(e) => setUploadFile(e.target.files[0])}
                        className="border p-2 rounded-lg"
                    />
                    <button
                        onClick={handleBulkUpload}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-2"
                    >
                        <Upload size={18} /> Upload CSV
                    </button>
                </div> */}
            </div>

            {/* LOADING */}
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* MODAL */}
            <SmartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProperty ? "Edit Property" : "Add Property"} onSave={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SmartFormField
                        label="Owner ID"
                        value={formData.owner_id}
                        onChange={(e) => setFormData({ ...formData, owner_id: e.target.value })}
                        required
                    />

                    <SmartFormField
                        label="Property Number"
                        value={formData.property_no}
                        onChange={(e) => setFormData({ ...formData, property_no: e.target.value })}
                        required
                    />

                    <SmartFormField
                        label="Property Type"
                        type="select"
                        options={["Residential", "Commercial", "Agriculture", "Industrial"]}
                        value={formData.property_type}
                        onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                    />

                    <SmartFormField
                        label="Area (sq ft)"
                        type="number"
                        value={formData.area_sq_ft}
                        onChange={(e) => setFormData({ ...formData, area_sq_ft: e.target.value })}
                        required
                    />

                    <SmartFormField
                        label="Construction Year"
                        type="number"
                        value={formData.construction_year}
                        onChange={(e) => setFormData({ ...formData, construction_year: e.target.value })}
                    />

                    <SmartFormField
                        label="Ownership Type"
                        type="select"
                        options={["Owner", "Tenant", "Lease"]}
                        value={formData.ownership_type}
                        onChange={(e) => setFormData({ ...formData, ownership_type: e.target.value })}
                    />

                    <div className="md:col-span-2">
                        <SmartFormField
                            label="Address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            fullWidth
                        />
                    </div>

                    <div className="md:col-span-2">
                        <SmartFormField
                            label="Village"
                            type="select"
                            options={[
                                { value: "", label: "Select Village" },
                                ...villages.map(v => ({ value: v.VillageID, label: v.VillageName }))
                            ]}
                            value={formData.village_id}
                            onChange={(e) => setFormData({ ...formData, village_id: e.target.value })}
                            required
                            fullWidth
                        />
                    </div>
                </div>
            </SmartModal>
        </div>
    );
}
