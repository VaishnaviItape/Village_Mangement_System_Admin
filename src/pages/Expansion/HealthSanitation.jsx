import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosInstance';
import SmartDataTable from "../../components/tables/SmartDataTable";
import { toast } from "react-toastify";

export default function HealthSanitation() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/api/sv/health');
            setRecords(res.data.data || []);
        } catch (err) {
            toast.error("Failed to load health records");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const columns = [
        { header: "ID", accessor: "id" },
        { header: "Type", cell: (row) => <span className="capitalize">{row.type.replace('_', ' ')}</span> },
        { header: "Details", accessor: "details" },
        { header: "Reported By", accessor: "reported_by" },
        {
            header: "Status", cell: (row) => (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">{row.status}</span>
            )
        }
    ];

    return (
        <div className="p-8 space-y-6">


            <SmartDataTable
                title="Health & Sanitation Records"
                columns={columns}
                data={records}
                showSerial={true}
                showAddButton={false}
            />

            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
                    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
}
