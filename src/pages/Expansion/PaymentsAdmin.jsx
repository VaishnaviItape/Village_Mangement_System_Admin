import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosInstance';
import toast from 'react-hot-toast';
import { IndianRupee, CheckCircle, Clock } from 'lucide-react';

export default function PaymentsAdmin() {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const res = await axiosInstance.get('/api/sv/payments');
                setPayments(res.data.data);
            } catch (err) {
                toast.error("Failed to load payments");
            }
        };
        fetchPayments();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Digital Payments Ledger</h2>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-slate-600">TXN ID</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">User</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Type</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Amount</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Date</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((p) => (
                            <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                                <td className="p-4 text-sm font-mono text-slate-500">{p.transaction_id}</td>
                                <td className="p-4 text-sm font-medium text-slate-800">{p.user_name}</td>
                                <td className="p-4 text-sm text-slate-600 capitalize">{p.payment_type.replace('_', ' ')}</td>
                                <td className="p-4 text-sm font-bold text-green-600 flex items-center gap-1">
                                    <IndianRupee className="w-4 h-4"/> {p.amount}
                                </td>
                                <td className="p-4 text-sm text-slate-500">{new Date(p.payment_date).toLocaleDateString()}</td>
                                <td className="p-4 text-sm">
                                    {p.status === 'Success' ? (
                                        <span className="flex items-center gap-1 text-green-600 font-medium text-xs bg-green-50 px-2 py-1 rounded-full w-fit"><CheckCircle className="w-3 h-3"/> {p.status}</span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-yellow-600 font-medium text-xs bg-yellow-50 px-2 py-1 rounded-full w-fit"><Clock className="w-3 h-3"/> {p.status}</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {payments.length === 0 && (
                            <tr><td colSpan="6" className="p-4 text-center text-slate-500">No transactions recorded.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
