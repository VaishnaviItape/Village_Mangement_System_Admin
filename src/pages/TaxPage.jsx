import React, { useEffect, useState } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import { getTaxes, addTax, updateTax, deleteTax } from "../services/taxService";
import { getUsers } from "../services/userService";
import { getVillages } from "../services/villageService";
import { getProperty } from "../services/propertyService";
import toast, { Toaster } from "react-hot-toast";

const Field = ({ label, children, className = "" }) => (
    <div className={className}>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
        {children}
    </div>
);

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

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">

                        {/* Header */}
                        <div className="flex justify-between items-center border-b border-slate-200 px-6 py-4 bg-slate-50 rounded-t-2xl">
                            <h2 className="text-xl font-semibold">
                                {editingTax ? "Edit Tax" : "Add Tax"}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-700 text-2xl"
                            >
                                ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â
                            </button>
                        </div>

                        {/* Scrollable Form */}
                        <div className="p-6 overflow-y-auto max-h-[70vh]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* USER */}
                                <Field label="User">
                                    <select
                                        value={formData.user_id}
                                        onChange={(e) =>
                                            setFormData({ ...formData, user_id: e.target.value })
                                        }
                                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                    >
                                        <option value="">Select User</option>
                                        {users.map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.full_name}
                                            </option>
                                        ))}
                                    </select>
                                </Field>

                                {/* PROPERTY */}
                                <Field label="Property">
                                    <select
                                        value={formData.property_id}
                                        onChange={(e) =>
                                            setFormData({ ...formData, property_id: e.target.value })
                                        }
                                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                    >
                                        <option value="">Select Property</option>
                                        {properties.map((p) => (
                                            <option key={p.property_id} value={p.property_id}>
                                                {p.property_no}
                                            </option>
                                        ))}
                                    </select>
                                </Field>

                                {/* VILLAGE */}
                                <Field label="Village">
                                    <select
                                        value={formData.village_id}
                                        onChange={(e) =>
                                            setFormData({ ...formData, village_id: e.target.value })
                                        }
                                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                    >
                                        <option value="">Select Village</option>
                                        {villages.map((v) => (
                                            <option key={v.VillageID} value={v.VillageID}>
                                                {v.VillageName}
                                            </option>
                                        ))}
                                    </select>
                                </Field>

                                {/* PROPERTY NUMBER */}
                                <Field label="Property No">
                                    <input placeholder="Enter value" 
                                        type="text"
                                        value={formData.property_no}
                                        onChange={(e) =>
                                            setFormData({ ...formData, property_no: e.target.value })
                                        }
                                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                    />
                                </Field>

                                {/* TAX TYPE */}
                                <Field label="Tax Type">
                                    <input placeholder="Enter value" 
                                        type="text"
                                        value={formData.tax_type}
                                        onChange={(e) =>
                                            setFormData({ ...formData, tax_type: e.target.value })
                                        }
                                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                    />
                                </Field>

                                {/* AMOUNT */}
                                <Field label="Amount">
                                    <input placeholder="Enter value" 
                                        type="number"
                                        value={formData.amount}
                                        onChange={(e) =>
                                            setFormData({ ...formData, amount: e.target.value })
                                        }
                                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                    />
                                </Field>

                                {/* DUE DATE */}
                                <Field label="Due Date">
                                    <input placeholder="Enter value" 
                                        type="date"
                                        value={formData.due_date}
                                        onChange={(e) =>
                                            setFormData({ ...formData, due_date: e.target.value })
                                        }
                                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                    />
                                </Field>

                                {/* STATUS */}
                                <Field label="Status">
                                    <select
                                        value={formData.status}
                                        onChange={(e) =>
                                            setFormData({ ...formData, status: e.target.value })
                                        }
                                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Paid">Paid</option>
                                    </select>
                                </Field>

                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-stone-500 hover:bg-stone-600 text-white px-4 py-2 rounded-lg shadow-sm transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors"
                            >
                                {editingTax ? "Update" : "Add"}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
