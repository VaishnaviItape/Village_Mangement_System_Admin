import React, { useEffect, useState } from "react";
import SmartDataTable from "../../components/tables/SmartDataTable";
import SmartModal from "../../components/ui/SmartModal";
import SmartFormField from "../../components/ui/SmartFormField";
import { getExpenses, createExpense, updateExpense, deleteExpense } from "../../services/smartVillageService";
import { toast } from "react-toastify";

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [formData, setFormData] = useState({
        category: "Road Repair",
        amount: "",
        expense_date: "",
        description: ""
    });

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const res = await getExpenses();
            setExpenses(res.data.data || []);
        } catch {
            toast.error("Failed to fetch expenses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleAdd = () => {
        setEditingExpense(null);
        setFormData({
            category: "Road Repair",
            amount: "",
            expense_date: "",
            description: ""
        });
        setIsModalOpen(true);
    };

    const handleEdit = (expense) => {
        setEditingExpense(expense);
        setFormData({
            category: expense.category,
            amount: expense.amount,
            expense_date: expense.expense_date ? new Date(expense.expense_date).toISOString().split('T')[0] : "",
            description: expense.description
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this expense?")) return;
        try {
            await deleteExpense(id);
            toast.success("Expense deleted successfully");
            fetchExpenses();
        } catch {
            toast.error("Failed to delete expense");
        }
    };

    const handleSave = async () => {
        if (!formData.category || !formData.amount || !formData.expense_date) {
            return toast.error("Category, amount, and date are required");
        }
        try {
            if (editingExpense) {
                await updateExpense(editingExpense.id, formData);
                toast.success("Expense updated successfully");
            } else {
                await createExpense(formData);
                toast.success("Expense added successfully");
            }
            setIsModalOpen(false);
            fetchExpenses();
        } catch {
            toast.error("Failed to save expense");
        }
    };

    const columns = [
        { header: "ID", accessor: "id" },
        { header: "Date", cell: (row) => new Date(row.expense_date).toLocaleDateString() },
        { header: "Category", accessor: "category" },
        { header: "Description", accessor: "description" },
        { header: "Amount", cell: (row) => <span className="text-red-600 font-bold">₹{row.amount}</span> }
    ];

    return (
        <div className="p-8 space-y-6">


            <SmartDataTable
                title="Panchayat Expenses Management"
                columns={columns}
                data={expenses}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showSerial={true}
            />

            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            <SmartModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingExpense ? "Edit Expense" : "Log Expense"}
                onSave={handleSave}
            >
                <div className="space-y-6">

                    {/* Header */}
                    <div className="pb-3 border-b border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-800">
                            Expense Details
                        </h3>
                        <p className="text-sm text-slate-500">
                            Record and manage Gram Panchayat expenses for transparency and tracking.
                        </p>
                    </div>

                    {/* Main Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <SmartFormField
                            label="Expense Category"
                            type="select"
                            options={[
                                "Road Repair",
                                "Water Maintenance",
                                "Events",
                                "Electricity",
                                "Sanitation",
                                "Office Supplies",
                                "Other"
                            ]}
                            value={formData.category}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    category: e.target.value
                                })
                            }
                            required
                        />

                        <SmartFormField
                            label="Amount (₹)"
                            type="number"
                            placeholder="Enter Amount"
                            value={formData.amount}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    amount: e.target.value
                                })
                            }
                            required
                        />

                        <SmartFormField
                            label="Expense Date"
                            type="date"
                            value={formData.expense_date}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    expense_date: e.target.value
                                })
                            }
                            required
                        />

                    </div>

                    {/* Description */}
                    <div>
                        <SmartFormField
                            label="Expense Description"
                            type="textarea"
                            rows={4}
                            placeholder="Describe the purpose of this expense..."
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value
                                })
                            }
                            required
                            fullWidth
                        />
                    </div>

                    {/* Information Card */}
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                        <h4 className="text-sm font-semibold text-amber-800 mb-2">
                            Expense Tracking
                        </h4>
                        <p className="text-sm text-amber-700">
                            Maintain accurate records of village expenditures for audits,
                            budgeting, and financial transparency. Include clear descriptions
                            for every expense entry.
                        </p>
                    </div>

                </div>
            </SmartModal>
        </div>
    );
}
