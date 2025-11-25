import React, { useEffect, useState } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import { getTaxes, addTax, updateTax, deleteTax } from "../services/taxService";
import toast, { Toaster } from "react-hot-toast";

export default function TaxPage() {
    const [taxes, setTaxes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTax, setEditingTax] = useState(null);

    const [formData, setFormData] = useState({
        tax_name: "",
        rate: "",
        status: "Active",
    });

    const fetchTaxes = async () => {
        setLoading(true);
        try {
            const res = await getTaxes();
            setTaxes(res.data.data);
        } catch {
            toast.error("Failed to load taxes!");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTaxes();
    }, []);

    const handleAdd = () => {
        setEditingTax(null);
        setFormData({ tax_name: "", rate: "", status: "Active" });
        setModalOpen(true);
    };

    const handleEdit = (tax) => {
        setEditingTax(tax);
        setFormData(tax);
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        await deleteTax(id);
        toast.success("Tax deleted!");
        fetchTaxes();
    };

    const handleSave = async () => {
        if (!formData.tax_name || !formData.rate) {
            return toast.error("Fields required!");
        }

        if (editingTax) {
            await updateTax(editingTax.tax_id, formData);
            toast.success("Updated!");
        } else {
            await addTax(formData);
            toast.success("Added!");
        }

        setModalOpen(false);
        fetchTaxes();
    };

    const columns = [
        { header: "Tax Name", accessor: "tax_name" },
        { header: "Rate (%)", accessor: "rate" },
        { header: "Status", accessor: "status" },
    ];

    return (
        <div className="p-8">
            <Toaster />

            <SmartDataTable
                title="Tax Management"
                columns={columns}
                data={taxes}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={(row) => handleDelete(row.tax_id)}
            />

            {modalOpen && (
                <div className="fixed inset-0 bg-black/30 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-[400px]">
                        <h2 className="text-lg font-bold mb-3">
                            {editingTax ? "Edit Tax" : "Add Tax"}
                        </h2>

                        {["tax_name", "rate", "status"].map((field) => (
                            <div key={field} className="mb-3">
                                <label className="text-sm">{field.replace("_", " ").toUpperCase()}</label>
                                <input
                                    type={field === "rate" ? "number" : "text"}
                                    value={formData[field]}
                                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                                    className="border px-3 py-2 rounded w-full"
                                />
                            </div>
                        ))}

                        <div className="flex justify-end gap-2">
                            <button className="px-4 py-2 bg-gray-500 text-white" onClick={() => setModalOpen(false)}>Cancel</button>
                            <button className="px-4 py-2 bg-green-600 text-white" onClick={handleSave}>
                                {editingTax ? "Update" : "Add"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {loading && (
                <div className="fixed inset-0 bg-white/50 flex justify-center items-center">
                    <div className="animate-spin border-4 border-indigo-500 border-t-transparent w-10 h-10 rounded-full"></div>
                </div>
            )}
        </div>
    );
}
