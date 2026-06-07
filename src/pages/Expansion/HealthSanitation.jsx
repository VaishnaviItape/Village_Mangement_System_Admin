import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosInstance';
import toast from 'react-hot-toast';

export default function HealthSanitation() {
    const [records, setRecords] = useState([]);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const res = await axiosInstance.get('/api/sv/health');
                setRecords(res.data.data);
            } catch (err) {
                toast.error("Failed to load health records");
            }
        };
        fetchRecords();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Health & Sanitation</h2>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-slate-600">ID</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Type</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Details</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Reported By</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((r) => (
                            <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
                                <td className="p-4 text-sm text-slate-700">#{r.id}</td>
                                <td className="p-4 text-sm text-slate-700 capitalize">{r.type.replace('_', ' ')}</td>
                                <td className="p-4 text-sm text-slate-700">{r.details}</td>
                                <td className="p-4 text-sm text-slate-700">{r.reported_by}</td>
                                <td className="p-4 text-sm">
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">{r.status}</span>
                                </td>
                            </tr>
                        ))}
                        {records.length === 0 && (
                            <tr><td colSpan="5" className="p-4 text-center text-slate-500">No records found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
