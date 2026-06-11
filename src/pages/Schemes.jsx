import React, { useState, useEffect } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import { getSchemes, addScheme, updateScheme, deleteScheme } from "../services/schemeService";
import { toast } from "react-toastify";
import SmartModal from "../components/ui/SmartModal";
import SmartFormField from "../components/ui/SmartFormField";

export default function Schemes() {
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingScheme, setEditingScheme] = useState(null);

    const [formData, setFormData] = useState({
        scheme_name: "",
        eligibility_criteria: "",
        description: "",
        start_date: "",
        end_date: "",
        status: "Active"
    });

    useEffect(() => {
        fetchSchemes();
    }, []);

    const fetchSchemes = async () => {
        setLoading(true);
        try {
            const res = await getSchemes();
            setSchemes(res.data);
        } catch {
            toast.error("Failed to fetch scheme data");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingScheme(null);
        setFormData({
            scheme_name: "",
            eligibility_criteria: "",
            description: "",
            start_date: "",
            end_date: "",
            status: "Active"
        });
        setIsModalOpen(true);
    };

    const handleEdit = (scheme) => {
        setEditingScheme(scheme);
        setFormData({
            ...scheme,
            eligibility_criteria: JSON.stringify(scheme.eligibility_criteria, null, 2)
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this scheme?")) return;

        try {
            await deleteScheme(id);
            toast.success("Scheme deleted successfully!");
            fetchSchemes();
        } catch {
            toast.error("Failed to delete scheme");
        }
    };

    const handleSave = async () => {
        if (!formData.scheme_name) return toast.error("Scheme name is required!");

        try {
            const payload = {
                ...formData,
                eligibility_criteria: JSON.parse(formData.eligibility_criteria || "{}")
            };

            if (editingScheme) {
                await updateScheme(editingScheme.scheme_id, payload);
                toast.success("Scheme updated successfully!");
            } else {
                await addScheme(payload);
                toast.success("Scheme added successfully!");
            }

            setIsModalOpen(false);
            fetchSchemes();
        } catch {
            toast.error("Invalid JSON in eligibility criteria!");
        }
    };

    const columns = [
        { header: "ID", accessor: "scheme_id" },
        { header: "Scheme", accessor: "scheme_name" },
        { header: "Status", accessor: "status" },
        { header: "Start Date", accessor: "start_date" },
        { header: "End Date", accessor: "end_date" },
    ];

    return (
        <div className="p-8 space-y-6">
            

            <SmartDataTable
                title="Scheme Management"
                columns={columns}
                data={schemes}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showSerial={true}
            />

            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* Modal */}
            <SmartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingScheme ? "Edit Scheme" : "Add Scheme"} onSave={handleSave}>
                <div className="space-y-4">
                    <SmartFormField
                        label="Scheme Name"
                        value={formData.scheme_name}
                        onChange={(e) => setFormData({ ...formData, scheme_name: e.target.value })}
                        required
                    />

                    <SmartFormField
                        label="Eligibility Criteria (JSON)"
                        type="textarea"
                        value={formData.eligibility_criteria}
                        onChange={(e) => setFormData({ ...formData, eligibility_criteria: e.target.value })}
                        fullWidth
                    />

                    <SmartFormField
                        label="Description"
                        type="textarea"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        fullWidth
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <SmartFormField
                            label="Start Date"
                            type="date"
                            value={formData.start_date}
                            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                        />
                        <SmartFormField
                            label="End Date"
                            type="date"
                            value={formData.end_date}
                            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                        />
                    </div>

                    <SmartFormField
                        label="Status"
                        type="select"
                        options={["Active", "Inactive"]}
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    />
                </div>
            </SmartModal>
        </div>
    );
}
