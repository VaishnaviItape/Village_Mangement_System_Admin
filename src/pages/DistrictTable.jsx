import React, { useEffect, useState } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import {
    getDistricts,
    addDistrict,
    updateDistrict,
    deleteDistrict,
} from "../services/districtService";
import { getState } from "../services/stateService";
import { toast } from "react-toastify";
import SmartModal from "../components/ui/SmartModal";
import SmartFormField from "../components/ui/SmartFormField";

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
                    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* Modal */}
            <SmartModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingDistrict ? "Edit District" : "Add District"}
                onSave={handleSave}
            >
                <SmartFormField 
                    label="District Code" 
                    value={formData.district_code} 
                    onChange={(e) => setFormData({ ...formData, district_code: e.target.value })} 
                    required 
                />
                
                <SmartFormField 
                    label="District Name" 
                    value={formData.district_name} 
                    onChange={(e) => setFormData({ ...formData, district_name: e.target.value })} 
                    required 
                />

                <SmartFormField 
                    label="Select State" 
                    type="select"
                    value={formData.state_id} 
                    onChange={(e) => setFormData({ ...formData, state_id: Number(e.target.value) })} 
                    options={states.map(state => ({ label: state.state_name, value: state.id }))}
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
