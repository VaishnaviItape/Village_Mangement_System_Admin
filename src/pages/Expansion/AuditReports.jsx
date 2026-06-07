import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosInstance';
import toast from 'react-hot-toast';
import { FileDown, FileText, Download } from 'lucide-react';

export default function AuditReports() {
    const [reportData, setReportData] = useState({ total_income: 0, total_expense: 0, net_balance: 0 });

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await axiosInstance.get('/api/sv/audit');
                setReportData(res.data.data);
            } catch (err) {
                toast.error("Failed to load audit report");
            }
        };
        fetchReport();
    }, []);

    const exportCSV = () => {
        const csvContent = "data:text/csv;charset=utf-8," 
            + "Metric,Amount\n"
            + `Total Income,${reportData.total_income}\n`
            + `Total Expense,${reportData.total_expense}\n`
            + `Net Balance,${reportData.net_balance}\n`;
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "panchayat_audit_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("CSV Downloaded!");
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Advanced Audit Reports</h2>
                <button onClick={exportCSV} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition">
                    <Download className="w-4 h-4"/> Export CSV
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                            <FileDown className="w-6 h-6"/>
                        </div>
                        <h3 className="text-emerald-800 font-semibold text-lg">Total Income (Taxes)</h3>
                    </div>
                    <p className="text-3xl font-black text-emerald-600 mt-4">₹{reportData.total_income}</p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                            <FileText className="w-6 h-6"/>
                        </div>
                        <h3 className="text-red-800 font-semibold text-lg">Total Expenses</h3>
                    </div>
                    <p className="text-3xl font-black text-red-600 mt-4">₹{reportData.total_expense}</p>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                            <FileText className="w-6 h-6"/>
                        </div>
                        <h3 className="text-indigo-800 font-semibold text-lg">Net Balance</h3>
                    </div>
                    <p className="text-3xl font-black text-indigo-600 mt-4">₹{reportData.net_balance}</p>
                </div>
            </div>
            
            <div className="mt-8 bg-white p-6 rounded-xl border border-slate-200 text-center text-slate-500">
                <p>This report automatically calculates the total income from digital payments against all logged Panchayat expenses. Use the Export button for government compliance submissions.</p>
            </div>
        </div>
    );
}
