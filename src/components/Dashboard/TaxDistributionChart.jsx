import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

function TaxDistributionChart() {
    const [data, setData] = useState([]);

    useEffect(() => {
        // Mocking API Data from your example
        const apiData = {
            totalGharPattiAmount: "9250.00",
            totalPaniPattiAmount: "1600.00"
        };

        const gharPatti = parseFloat(apiData.totalGharPattiAmount);
        const paniPatti = parseFloat(apiData.totalPaniPattiAmount);

        // Create Chart Data
        const chartData = [
            { name: "Ghar Patti", value: gharPatti, color: "#0ea5e9" }, // Sky Blue
            { name: "Pani Patti", value: paniPatti, color: "#6366f1" }, // Indigo
        ];
        setData(chartData);
    }, []);

    return (
        <div className="bg-white shadow-sm rounded-2xl p-6 border border-slate-200 h-full">
            <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-800">Revenue Source</h3>
                <p className="text-sm text-slate-500">Distribution of Tax Types</p>
            </div>

            <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `₹${value}`} />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Summary Text */}
            <div className="text-center mt-2">
                <p className="text-xs text-slate-400">Total collected amount visualization</p>
            </div>
        </div>
    );
}

export default TaxDistributionChart;