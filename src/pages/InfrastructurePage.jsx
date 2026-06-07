import React, { useEffect, useState } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import {
    getInfrastructure,
    createInfrastructure,
    updateInfrastructure,
    deleteInfrastructure,
} from "../services/infrastructureService";
import toast, { Toaster } from "react-hot-toast";
import SmartModal from "../components/ui/SmartModal";
import SmartFormField from "../components/ui/SmartFormField";

export default function InfrastructurePage() {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        type: "",
        status: "Good",
        maintained_by: "",
    });

    const fetchAssets = async () => {
        setLoading(true);
        try {
            const res = await getInfrastructure();
            setAssets(res.data.data || res.data);
        } catch {
            toast.error("Failed to fetch infrastructure assets");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    const handleAdd = () => {
        setEditingAsset(null);
        setFormData({
            name: "",
            type: "",
            status: "Good",
            maintained_by: "",
        });
        setIsModalOpen(true);
    };

    const handleEdit = (item) => {
        setEditingAsset(item);
        setFormData({
            name: item.name || "",
            type: item.type || "",
            status: item.status || "Good",
            maintained_by: item.maintained_by || "",
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this asset?")) return;

        try {
            await deleteInfrastructure(id);
            toast.success("Asset deleted successfully!");
            fetchAssets();
        } catch {
            toast.error("Failed to delete asset");
        }
    };

    const handleSave = async () => {
        if (!formData.name || !formData.type) {
            toast.error("Name and Type are required!");
            return;
        }

        try {
            if (editingAsset) {
                await updateInfrastructure(editingAsset.id, formData);
                toast.success("Asset updated successfully!");
            } else {
                await createInfrastructure(formData);
                toast.success("Asset added successfully!");
            }
            setIsModalOpen(false);
            fetchAssets();
        } catch {
            toast.error("Failed to save asset");
        }
    };

    const columns = [
        { header: "ID", accessor: "id" },
        { header: "Asset Name", accessor: "name" },
        { header: "Type", accessor: "type" },
        { header: "Status", accessor: "status" },
        { header: "Maintained By", accessor: "maintained_by" },
    ];

    return (
        <div className="p-8 space-y-6">
            <Toaster position="top-center" />

            <SmartDataTable
                title="Infrastructure & Assets"
                columns={columns}
                data={assets}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={(item) => handleDelete(item.id)}
                showSerial={true}
            />

            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
                    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {isModalOpen && (
                <SmartModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={editingAsset ? "Edit Asset" : "Add Asset"}
                    onSave={handleSave}
                >
                    <SmartFormField 
                        label="Asset Name" 
                        value={formData.name} 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                        placeholder="e.g. Submersible Water Pump"
                        required 
                    />
                    
                    <SmartFormField 
                        label="Asset Type" 
                        value={formData.type} 
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })} 
                        placeholder="e.g. Water Supply, Road, Vehicle"
                        required 
                    />

                    <SmartFormField 
                        label="Status" 
                        type="select"
                        value={formData.status} 
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })} 
                        options={['Good', 'Needs Repair', 'Broken', 'Under Maintenance']}
                    />

                    <SmartFormField 
                        label="Maintained By" 
                        value={formData.maintained_by} 
                        onChange={(e) => setFormData({ ...formData, maintained_by: e.target.value })} 
                        placeholder="e.g. Gram Panchayat, Zilla Parishad"
                    />
                </SmartModal>
            )}
        </div>
    );
}
