import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

function TaxDistributionChart({ data }) {
    if (!data) return null;

    const chartData = data.map(item => ({
        ...item,
        color: item.name === "Ghar Patti" ? "#0ea5e9" : "#6366f1"
    }));

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
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
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