import React, { useEffect, useState } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import {
    getExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpenseDocuments,
} from "../services/expenseService";
import toast, { Toaster } from "react-hot-toast";

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [formData, setFormData] = useState({
        expenseType: "",
        amount: "",
        description: "",
        expenseDate: "",
    });
    const [docsModalOpen, setDocsModalOpen] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [isDocLoading, setIsDocLoading] = useState(false);

    // 🔄 Fetch Expenses
    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const res = await getExpenses();
            setExpenses(res.data || []);
        } catch {
            toast.error("Failed to fetch expenses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    // ➕ Add Expense Modal
    const handleAdd = () => {
        setEditingExpense(null);
        setFormData({
            expenseType: "",
            amount: "",
            description: "",
            expenseDate: "",
        });
        setIsModalOpen(true);
    };

    // ✏️ Edit Expense Modal
    const handleEdit = (expense) => {
        setEditingExpense(expense);
        setFormData({
            expenseType: expense.expenseType,
            amount: expense.amount,
            description: expense.description,
            expenseDate: expense.expenseDate,
        });
        setIsModalOpen(true);
    };

    // 🗑 Delete Expense
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this expense?")) return;
        try {
            await deleteExpense(id);
            toast.success("Expense deleted successfully!");
            fetchExpenses();
        } catch {
            toast.error("Failed to delete expense");
        }
    };

    // 💾 Save Expense (Add/Update)
    const handleSave = async () => {
        const { expenseType, amount, description, expenseDate } = formData;
        if (!expenseType || !amount || !expenseDate) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            if (editingExpense) {
                await updateExpense(editingExpense.id, formData);
                toast.success("Expense updated successfully!");
            } else {
                await addExpense(formData);
                toast.success("Expense added successfully!");
            }
            setIsModalOpen(false);
            fetchExpenses();
        } catch {
            toast.error("Failed to save expense");
        }
    };

    const handleViewDocs = async (expenseId) => {
        setDocsModalOpen(true);
        setIsDocLoading(true);
        try {
            const docs = await getExpenseDocuments(expenseId);
            setDocuments(Array.isArray(docs) ? docs : []);
        } catch (err) {
            toast.error("Failed to load documents");
        } finally {
            setIsDocLoading(false);
        }
    };


    // 📊 Table Columns
    const columns = [
        { header: "Expense Type", accessor: "expenseType" },
        { header: "Amount", accessor: "amount" },
        { header: "Description", accessor: "description" },
        { header: "Expense Date", accessor: "expenseDate" },
        {
            header: "Documents",
            accessor: "documents",
            cell: (row) => (
                <button
                    className="text-indigo-600 hover:underline"
                    onClick={() => handleViewDocs(row.id)}
                >
                    View
                </button>
            ),
        },


    ];

    return (
        <div className="p-8 space-y-6">
            <Toaster
                position="top-center"
                toastOptions={{
                    style: { minWidth: "400px", fontSize: "18px", padding: "16px 24px" },
                }}
            />

            {/* Table */}
            <SmartDataTable
                title="Manage Expenses"
                columns={columns}
                data={expenses}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={(row) => handleDelete(row.id)}
                showSerial={true}
            />

            {/* Loader Spinner */}
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white/40 z-50">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* 💬 Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-[450px] p-6">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">
                            {editingExpense ? "Edit Expense" : "Add New Expense"}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">
                                    Expense Type
                                </label>
                                <input
                                    type="text"
                                    value={formData.expenseType}
                                    onChange={(e) =>
                                        setFormData({ ...formData, expenseType: e.target.value })
                                    }
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Enter expense type"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">
                                    Amount
                                </label>
                                <input
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) =>
                                        setFormData({ ...formData, amount: e.target.value })
                                    }
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Enter amount"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Enter description"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">
                                    Expense Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.expenseDate}
                                    onChange={(e) =>
                                        setFormData({ ...formData, expenseDate: e.target.value })
                                    }
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-6 space-x-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
                            >
                                {editingExpense ? "Update" : "Add"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 📂 Documents Modal */}
            {docsModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-[600px] max-h-[80vh] overflow-auto">
                        <div className="flex justify-between items-center border-b pb-2 mb-4">
                            <h3 className="text-lg font-semibold text-indigo-700">
                                Expense Documents
                            </h3>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => setDocsModalOpen(false)}
                            >
                                ✕
                            </button>
                        </div>

                        {isDocLoading ? (
                            <div className="flex justify-center py-8">
                                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : documents.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {documents.map((doc, idx) => (
                                    <div key={idx} className="border rounded-lg p-2 flex flex-col items-center">
                                        {doc.contentType?.startsWith("image") ? (
                                            <img
                                                src={doc.fileUrl}
                                                alt={doc.fileName}
                                                className="h-32 w-full object-cover rounded mb-2"
                                            />
                                        ) : (
                                            <i className="bi bi-file-earmark-text text-indigo-600 text-4xl mb-2"></i>
                                        )}
                                        <p className="text-sm text-center truncate w-full">{doc.fileName}</p>
                                        <a
                                            href={doc.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-600 text-sm mt-1 hover:underline"
                                        >
                                            Open
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                <i className="bi bi-exclamation-circle text-3xl"></i>
                                <p className="mt-2">No documents available for this expense.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isDocLoading ? (
                <div className="flex justify-center py-8">
                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : documents.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {documents.map((doc, idx) => (
                        <div key={idx} className="border rounded-lg p-2 flex flex-col items-center">
                            {doc.contentType?.startsWith("image") ? (
                                <img
                                    src={doc.url}
                                    alt={doc.fileName}
                                    className="h-32 w-full object-cover rounded mb-2"
                                />
                            ) : (
                                <i className="bi bi-file-earmark-text text-indigo-600 text-4xl mb-2"></i>
                            )}
                            <p className="text-sm text-center truncate w-full">{doc.fileName}</p>
                            <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 text-sm mt-1 hover:underline"
                            >
                                Open
                            </a>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 py-8">
                    <i className="bi bi-exclamation-circle text-3xl"></i>
                    <p className="mt-2">No documents available for this expense.</p>
                </div>
            )}

        </div>
    );
}
