import React, { useEffect, useState } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import {
    getTalukas,
    createTaluka,
    updateTaluka,
    deleteTaluka,
} from "../services/talukaService";
import { getDistricts } from "../services/districtService";
import toast, { Toaster } from "react-hot-toast";
import SmartModal from "../components/ui/SmartModal";
import SmartFormField from "../components/ui/SmartFormField";

export default function TalukaPage() {
    const [talukas, setTalukas] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTaluka, setEditingTaluka] = useState(null);

    const [formData, setFormData] = useState({
        taluka_code: "",
        taluka_name: "",
        district_id: "",
        is_active: 1,
    });

    // Fetch Talukas
    const fetchTalukas = async () => {
        setLoading(true);
        try {
            const res = await getTalukas();
            setTalukas(res.data.data);
        } catch {
            toast.error("Failed to fetch taluka records");
        } finally {
            setLoading(false);
        }
    };

    // Fetch Districts for dropdown
    const fetchDistricts = async () => {
        try {
            const res = await getDistricts();
            setDistricts(res.data.data);
        } catch {
            toast.error("Failed to load districts");
        }
    };

    useEffect(() => {
        fetchTalukas();
        fetchDistricts();
    }, []);

    // Open Add Modal
    const handleAdd = () => {
        setEditingTaluka(null);
        setFormData({
            taluka_code: "",
            taluka_name: "",
            district_id: "",
            is_active: 1,
        });
        setIsModalOpen(true);
    };

    // Edit
    const handleEdit = (item) => {
        setEditingTaluka(item);
        setFormData({
            taluka_code: item.taluka_code,
            taluka_name: item.taluka_name,
            district_id: item.district_id,
            is_active: item.is_active,
        });
        setIsModalOpen(true);
    };

    // Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this taluka?")) return;

        try {
            await deleteTaluka(id);
            toast.success("Taluka deleted successfully!");
            fetchTalukas();
        } catch {
            toast.error("Failed to delete taluka");
        }
    };

    // Save or Update
    const handleSave = async () => {
        if (!formData.taluka_code || !formData.taluka_name || !formData.district_id) {
            toast.error("All fields are required!");
            return;
        }

        try {
            if (editingTaluka) {
                await updateTaluka(editingTaluka.id, formData);
                toast.success("Taluka updated successfully!");
            } else {
                await createTaluka(formData);
                toast.success("Taluka added successfully!");
            }
            setIsModalOpen(false);
            fetchTalukas();
        } catch {
            toast.error("Failed to save taluka");
        }
    };

    const columns = [
        { header: "ID", accessor: "id" },
        { header: "Taluka Code", accessor: "taluka_code" },
        { header: "Taluka Name", accessor: "taluka_name" },
        { header: "District", accessor: "district_name" },
        { header: "Active", accessor: "is_active" },
    ];

    return (
        <div className="p-8 space-y-6">
            <Toaster position="top-center" />

            <SmartDataTable
                title="Taluka Management"
                columns={columns}
                data={talukas}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showSerial={true}
            />

            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
                    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* Modal */}
            <SmartModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingTaluka ? "Edit Taluka" : "Add Taluka"}
                onSave={handleSave}
            >
                <SmartFormField 
                    label="Taluka Code" 
                    value={formData.taluka_code} 
                    onChange={(e) => setFormData({ ...formData, taluka_code: e.target.value })} 
                    required 
                />
                
                <SmartFormField 
                    label="Taluka Name" 
                    value={formData.taluka_name} 
                    onChange={(e) => setFormData({ ...formData, taluka_name: e.target.value })} 
                    required 
                />

                <SmartFormField 
                    label="Select District" 
                    type="select"
                    value={formData.district_id} 
                    onChange={(e) => setFormData({ ...formData, district_id: Number(e.target.value) })} 
                    options={districts.map(d => ({ label: d.district_name, value: d.id }))}
                    required
                />
                
                <SmartFormField 
                    label="Active Status" 
                    type="select"
                    value={formData.is_active} 
                    onChange={(e) => setFormData({ ...formData, is_active: Number(e.target.value) })} 
                    options={[
                        { label: 'Active', value: 1 },
                        { label: 'Inactive', value: 0 }
                    ]}
                />
            </SmartModal>
        </div>
    );
}
