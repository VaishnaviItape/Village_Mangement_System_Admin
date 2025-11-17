

import React from "react";
import { MoreHorizontal, TrendingUp } from "lucide-react";

const recentOrders = [
    {
        id: "#3456",
        customer: "John Smith",
        plan: "Basic",
        amount: "₹2599",
        status: "Completed",
        date: "2025-09-01",
    },
    {
        id: "#3457",
        customer: "Jay Mali",
        plan: "Basic",
        amount: "₹2599",
        status: "Pending",
        date: "2025-09-02",
    },
    {
        id: "#3458",
        customer: "Ravi Jadhav",
        plan: "Basic",
        amount: "₹2599",
        status: "Completed",
        date: "2025-09-03",
    },
    {
        id: "#3459",
        customer: "Hari Patil",
        plan: "Advance",
        amount: "₹9999",
        status: "Completed",
        date: "2025-09-04",
    },
];

const topProducts = [
    { name: "Basic Plan", sold: "250 Units", revenue: "₹2.5L", growth: "+8%", color: "from-blue-500 to-blue-400" },
    { name: "Advance Plan", sold: "180 Units", revenue: "₹1.8L", growth: "+6%", color: "from-purple-500 to-purple-400" },
    { name: "Premium Plan", sold: "340 Units", revenue: "₹3.4L", growth: "+12%", color: "from-emerald-500 to-emerald-400" },
];

function TableSection() {
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "completed":
                return "bg-emerald-100 text-emerald-700";
            case "pending":
                return "bg-yellow-100 text-yellow-700";
            case "cancelled":
                return "bg-red-100 text-red-700";
            default:
                return "bg-slate-100 text-slate-700";
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-lg overflow-hidden ">
                {/* Header */}
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Recent Orders</h3>
                            <p className="text-sm text-slate-500">Latest Customer Orders</p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            View All
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="text-left p-4 text-sm font-semibold text-slate-600">
                                    Order ID
                                </th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-600">
                                    Customer
                                </th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-600">
                                    Plan
                                </th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-600">
                                    Amount
                                </th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-600">
                                    Status
                                </th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-600">
                                    Date
                                </th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-600"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                                >
                                    <td className="p-4 text-sm font-medium text-blue-600"> {order.id} </td>
                                    <td className="p-4 text-sm text-slate-800">{order.customer}</td>
                                    <td className="p-4 text-sm text-slate-800">{order.plan}</td>
                                    <td className="p-4 text-sm text-slate-800">{order.amount}</td>
                                    <td className="p-4">
                                        <span
                                            className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                                order.status
                                            )}`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600">{order.date}</td>
                                    <td className="p-4 text-slate-400">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Top Products Section */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-lg p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-slate-800">Top Products</h3>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                    {topProducts.map((product, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-xl bg-gradient-to-r ${product.color} text-white shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1`}
                        >
                            <h4 className="text-sm font-semibold">{product.name}</h4>
                            <p className="text-xs opacity-90">{product.sold}</p>
                            <div className="mt-2 flex items-center justify-between">
                                <p className="text-sm font-semibold">{product.revenue}</p>
                                <div className="flex items-center text-xs font-medium">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    {product.growth}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default TableSection;
