import React, { useEffect, useState } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import { getTaxes, addTax, updateTax, deleteTax } from "../services/taxService";
import { getUsers } from "../services/userService";
import { getVillages } from "../services/villageService";
import { getProperty } from "../services/propertyService";
import toast, { Toaster } from "react-hot-toast";

import SmartModal from "../components/ui/SmartModal";
import SmartFormField from "../components/ui/SmartFormField";

export default function TaxPage() {
    const [taxes, setTaxes] = useState([]);
    const [users, setUsers] = useState([]);
    const [villages, setVillages] = useState([]);
    const [properties, setProperties] = useState([]);

    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTax, setEditingTax] = useState(null);

    const [formData, setFormData] = useState({
        user_id: "",
        property_id: "",
        village_id: "",
        property_no: "",
        tax_type: "",
        amount: "",
        due_date: "",
        status: "Active",
    });

    const fetchTaxes = async () => {
        setLoading(true);
        try {
            const res = await getTaxes();
            setTaxes(res.data.data || []);
        } catch {
            toast.error("Failed to load tax records");
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await getUsers();
            setUsers(res.data.data || []);
        } catch {
            toast.error("Failed to load users");
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

    const fetchProperties = async () => {
        try {
            const res = await getProperty();
            setProperties(res.data.data || []);
        } catch {
            toast.error("Failed to load properties");
        }
    };

    useEffect(() => {
        fetchTaxes();
        fetchUsers();
        fetchVillages();
        fetchProperties();
    }, []);

    const handleAdd = () => {
        setEditingTax(null);
        setFormData({
            user_id: "",
            property_id: "",
            village_id: "",
            property_no: "",
            tax_type: "",
            amount: "",
            due_date: "",
            status: "Active",
        });
        setIsModalOpen(true);
    };

    const handleEdit = (tax) => {
        setEditingTax(tax);
        setFormData({ ...tax });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this tax?")) return;

        try {
            await deleteTax(id);
            toast.success("Tax deleted");
            fetchTaxes();
        } catch {
            toast.error("Failed to delete tax");
        }
    };

    const handleSave = async () => {
        if (!formData.user_id || !formData.property_id || !formData.village_id) {
            toast.error("User, Property & Village are required");
            return;
        }

        try {
            if (editingTax) {
                await updateTax(editingTax.tax_id, formData);
                toast.success("Tax updated");
            } else {
                await addTax(formData);
                toast.success("Tax added");
            }
            setIsModalOpen(false);
            fetchTaxes();
        } catch {
            toast.error("Failed to save tax");
        }
    };

    const columns = [
        { header: "Tax Type", accessor: "tax_type" },
        { header: "Amount", accessor: "amount" },
        { header: "Due Date", accessor: "due_date" },
        { header: "Status", accessor: "status" },
    ];

    return (
        <div className="p-8 space-y-6">
            <Toaster />

            <SmartDataTable
                title="Tax Management"
                columns={columns}
                data={taxes}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={(row) => handleDelete(row.tax_id)}
                showSerial={true}
            />

            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white/60 z-50">
                    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* Modal */}
            <SmartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTax ? "Edit Tax" : "Add Tax"} onSave={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SmartFormField
                        label="User"
                        type="select"
                        options={[
                            { value: "", label: "Select User" },
                            ...users.map(u => ({ value: u.id, label: u.full_name }))
                        ]}
                        value={formData.user_id}
                        onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                        required
                    />

                    <SmartFormField
                        label="Property"
                        type="select"
                        options={[
                            { value: "", label: "Select Property" },
                            ...properties.map(p => ({ value: p.property_id, label: p.property_no }))
                        ]}
                        value={formData.property_id}
                        onChange={(e) => setFormData({ ...formData, property_id: e.target.value })}
                        required
                    />

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
                    />

                    <SmartFormField
                        label="Property No"
                        value={formData.property_no}
                        onChange={(e) => setFormData({ ...formData, property_no: e.target.value })}
                    />

                    <SmartFormField
                        label="Tax Type"
                        value={formData.tax_type}
                        onChange={(e) => setFormData({ ...formData, tax_type: e.target.value })}
                    />

                    <SmartFormField
                        label="Amount"
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />

                    <SmartFormField
                        label="Due Date"
                        type="date"
                        value={formData.due_date}
                        onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    />

                    <SmartFormField
                        label="Status"
                        type="select"
                        options={["Active", "Pending", "Paid"]}
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    />
                </div>
            </SmartModal>
        </div>
    );
}
