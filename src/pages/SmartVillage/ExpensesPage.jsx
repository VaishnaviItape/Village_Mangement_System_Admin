import React, { useEffect, useState } from "react";
import axios from "axios";
import SmartModal from "../../components/ui/SmartModal";
import SmartFormField from "../../components/ui/SmartFormField";

const API_URL = "http://localhost:8080/api/sv/expenses";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState("Road Repair");
  const [amt, setAmt] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => { fetchExpenses(); }, []);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) setExpenses(res.data.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(API_URL, { category: cat, amount: amt, description: desc, expense_date: date }, { headers: { Authorization: `Bearer ${token}` } });
      fetchExpenses();
      setAmt(""); setDesc(""); setDate("");
      setIsModalOpen(false);
    } catch (e) { alert("Failed"); }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Panchayat Expenses</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Log Expense</button>
      </div>
      
      <SmartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Expense" onSave={handleCreate}>
        <SmartFormField label="Category" type="select" options={["Road Repair", "Water Maintenance", "Events", "Other"]} value={cat} onChange={e => setCat(e.target.value)} required />
        <SmartFormField label="Amount (₹)" type="number" value={amt} onChange={e => setAmt(e.target.value)} required />
        <SmartFormField label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
        <SmartFormField label="Description" type="textarea" value={desc} onChange={e => setDesc(e.target.value)} required fullWidth />
      </SmartModal>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-50 border-b"><th className="p-4">Date</th><th className="p-4">Category</th><th className="p-4">Description</th><th className="p-4">Amount</th></tr>
          </thead>
          <tbody>
            {expenses.map(e => (
              <tr key={e.id} className="border-b">
                <td className="p-4">{new Date(e.expense_date).toLocaleDateString()}</td>
                <td className="p-4">{e.category}</td>
                <td className="p-4">{e.description}</td>
                <td className="p-4 text-red-600 font-bold">₹{e.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
