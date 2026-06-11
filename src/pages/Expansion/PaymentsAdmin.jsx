import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosInstance';
import SmartDataTable from "../../components/tables/SmartDataTable";
import { toast } from "react-toastify";
import { IndianRupee, CheckCircle, Clock } from 'lucide-react';

export default function PaymentsAdmin() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/api/sv/payments');
            setPayments(res.data.data || []);
        } catch (err) {
            toast.error("Failed to load payments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const columns = [
        { header: "TXN ID", cell: (row) => <span className="font-mono text-slate-500">{row.transaction_id}</span> },
        { header: "User", cell: (row) => <span className="font-medium text-slate-800">{row.user_name}</span> },
        { header: "Type", cell: (row) => <span className="capitalize">{row.payment_type.replace('_', ' ')}</span> },
        {
            header: "Amount", cell: (row) => (
                <span className="font-bold text-green-600 flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" /> {row.amount}
                </span>
            )
        },
        { header: "Date", cell: (row) => new Date(row.payment_date).toLocaleDateString() },
        {
            header: "Status", cell: (row) => (
                row.status === 'Success' ? (
                    <span className="flex items-center gap-1 text-green-600 font-medium text-xs bg-green-50 px-2 py-1 rounded-full w-fit"><CheckCircle className="w-3 h-3" /> {row.status}</span>
                ) : (
                    <span className="flex items-center gap-1 text-yellow-600 font-medium text-xs bg-yellow-50 px-2 py-1 rounded-full w-fit"><Clock className="w-3 h-3" /> {row.status}</span>
                )
            )
        }
    ];

    return (
        <div className="p-8 space-y-6">


            <SmartDataTable
                title="Digital Payments Ledger"
                columns={columns}
                data={payments}
                showSerial={true}
                showAddButton={false}
            />

            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
}
