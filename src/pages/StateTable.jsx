import React, { useEffect, useState } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import {
    getState,
    addState,
    updateState,
    deleteState
} from "../services/stateService";
import { toast } from "react-toastify";
import SmartModal from "../components/ui/SmartModal";
import SmartFormField from "../components/ui/SmartFormField";

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
                    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* Modal */}
            <SmartModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingState ? "Edit State" : "Add State"}
                onSave={handleSave}
            >
                <SmartFormField 
                    label="State Code" 
                    value={formData.state_code} 
                    onChange={(e) => setFormData({ ...formData, state_code: e.target.value })} 
                    required 
                />
                
                <SmartFormField 
                    label="State Name" 
                    value={formData.state_name} 
                    onChange={(e) => setFormData({ ...formData, state_name: e.target.value })} 
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
                    fullWidth
                />
            </SmartModal>
        </div>
    );
}
