import React from "react";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

// Mock Data representing Village Complaints/Requests
const complaints = [
    { id: "CMP-001", citizen: "Ramesh Patil", type: "Water Leakage", village: "Wadgaon", status: "Pending", date: "2023-10-01" },
    { id: "CMP-002", citizen: "Suresh Deshmukh", type: "Street Light", village: "Palasdeo", status: "Resolved", date: "2023-10-02" },
    { id: "CMP-003", citizen: "Anita Shinde", type: "Drainage", village: "Indapur", status: "In Progress", date: "2023-10-03" },
    { id: "CMP-004", citizen: "Vijay Kale", type: "Property Tax", village: "Bhigwan", status: "Pending", date: "2023-10-04" },
];

function TableSection() {
    const getStatusStyle = (status) => {
        switch (status) {
            case "Resolved": return "bg-emerald-100 text-emerald-700";
            case "Pending": return "bg-red-100 text-red-700";
            case "In Progress": return "bg-blue-100 text-blue-700";
            default: return "bg-slate-100 text-slate-700";
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Recent Complaints</h3>
                    <p className="text-sm text-slate-500">Latest issues reported by citizens</p>
                </div>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-800">View All</button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="text-left p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                            <th className="text-left p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Citizen</th>
                            <th className="text-left p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Issue Type</th>
                            <th className="text-left p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Village</th>
                            <th className="text-left p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="text-left p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {complaints.map((item, index) => (
                            <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-4 text-sm font-medium text-slate-700">{item.id}</td>
                                <td className="p-4 text-sm text-slate-600">{item.citizen}</td>
                                <td className="p-4 text-sm text-slate-800 font-medium">{item.type}</td>
                                <td className="p-4 text-sm text-slate-600">{item.village}</td>
                                <td className="p-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex w-fit items-center gap-1 ${getStatusStyle(item.status)}`}>
                                        {item.status === 'Resolved' && <CheckCircle2 size={12} />}
                                        {item.status === 'Pending' && <AlertCircle size={12} />}
                                        {item.status === 'In Progress' && <Clock size={12} />}
                                        {item.status}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-slate-500">{item.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TableSection;