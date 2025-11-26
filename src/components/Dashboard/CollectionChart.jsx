import React from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend
} from "recharts";

function CollectionChart() {
    // Mock monthly data (Since your API only gave totals, you need an endpoint for monthly history)
    // Backend Advice: Create an endpoint /api/tax-history
    const data = [
        { month: "Jan", gharPatti: 4000, paniPatti: 2400 },
        { month: "Feb", gharPatti: 3000, paniPatti: 1398 },
        { month: "Mar", gharPatti: 2000, paniPatti: 9800 },
        { month: "Apr", gharPatti: 2780, paniPatti: 3908 },
        { month: "May", gharPatti: 1890, paniPatti: 4800 },
        { month: "Jun", gharPatti: 2390, paniPatti: 3800 },
    ];

    return (
        <div className="bg-white shadow-sm rounded-2xl border border-slate-200 p-6 h-full">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-800">Tax Collection Trends</h3>
                <p className="text-sm text-slate-500">Monthly breakdown of Ghar Patti vs Pani Patti</p>
            </div>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                        <Tooltip
                            cursor={{ fill: '#f1f5f9' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar dataKey="gharPatti" name="Ghar Patti" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={30} />
                        <Bar dataKey="paniPatti" name="Pani Patti" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default CollectionChart;