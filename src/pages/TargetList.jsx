// src/pages/TargetList.jsx
import React, { useEffect, useState, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Chart, registerables } from "chart.js";
import { getTargets } from "../services/targetService";

Chart.register(...registerables);

export default function TargetList() {
    const [pageTitle] = useState("Manage Targets");
    const [subtitle] = useState("Employee Product Target Details");

    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [targetList, setTargetList] = useState([]);
    const [paginatedList, setPaginatedList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().toISOString().slice(0, 7)
    );

    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    // 🧾 Fetch Targets
    const fetchTargets = async (monthValue) => {
        setLoading(true);
        try {
            const [year, month] = monthValue.split("-");
            const res = await getTargets(Number(month), Number(year), false);
            const data = res.data || [];

            setTargetList(data);
            setPaginatedList(data.slice(0, pageSize));
            updateChart(data);

            toast.success("Target data loaded!");
        } catch (err) {
            console.error("Error fetching targets:", err);
            toast.error("Failed to fetch target data");
        } finally {
            setLoading(false);
        }
    };

    // 🧮 Pagination handler
    const refreshPage = (newPage) => {
        const start = (newPage - 1) * pageSize;
        setPaginatedList(targetList.slice(start, start + pageSize));
        setPage(newPage);
    };

    // 📊 Chart rendering
    const updateChart = (data) => {
        if (chartInstance.current) chartInstance.current.destroy();

        const labels = [];
        const targetAmounts = [];

        data.forEach((emp) => {
            emp.productTargets.forEach((prod) => {
                labels.push(`${emp.employeeName} - ${prod.productName}`);
                targetAmounts.push(prod.targetTransactionAmount);
            });
        });

        if (!chartRef.current) return;

        chartInstance.current = new Chart(chartRef.current, {
            type: "bar",
            data: {
                labels,
                datasets: [
                    {
                        label: "Target Transaction Amount",
                        data: targetAmounts,
                        backgroundColor: "rgba(54, 162, 235, 0.6)",
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    x: { title: { display: true, text: "Employee - Product" } },
                    y: {
                        title: { display: true, text: "Transaction Amount" },
                        beginAtZero: true,
                    },
                },
            },
        });
    };

    useEffect(() => {
        fetchTargets(selectedMonth);
    }, []);

    // 📅 Month filter change
    const handleMonthChange = (e) => {
        const newMonth = e.target.value;
        setSelectedMonth(newMonth);
        fetchTargets(newMonth);
    };

    return (
        <div className="p-8 space-y-6">
            <Toaster
                position="top-center"
                toastOptions={{
                    style: { minWidth: "400px", fontSize: "18px", padding: "16px 24px" },
                }}
            />

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">{pageTitle}</h2>
                    <p className="text-slate-500 text-sm">{subtitle}</p>
                </div>

                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-slate-600">
                        Select Month:
                    </label>
                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow border border-slate-200 p-6 overflow-x-auto">
                <table className="min-w-full border border-slate-200 text-sm text-slate-700">
                    <thead className="bg-slate-100 text-center font-semibold">
                        <tr>
                            <th className="p-3 border">#</th>
                            <th className="p-3 border">Employee Name</th>
                            <th className="p-3 border">Product Name</th>
                            <th className="p-3 border">Target Transaction Amount</th>
                            <th className="p-3 border">Target Transaction Count</th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedList.length > 0 ? (
                            paginatedList.map((emp, i) =>
                                emp.productTargets.map((prod, j) => (
                                    <tr key={`${i}-${j}`} className="hover:bg-slate-50">
                                        {j === 0 && (
                                            <td
                                                rowSpan={emp.productTargets.length}
                                                className="text-center border p-3 font-medium"
                                            >
                                                {(page - 1) * pageSize + i + 1}
                                            </td>
                                        )}
                                        {j === 0 && (
                                            <td
                                                rowSpan={emp.productTargets.length}
                                                className="border p-3 font-medium"
                                            >
                                                {emp.employeeName}
                                            </td>
                                        )}
                                        <td className="border p-3">{prod.productName}</td>
                                        <td className="border p-3 text-right">
                                            {prod.targetTransactionAmount.toLocaleString()}
                                        </td>
                                        <td className="border p-3 text-center">
                                            {prod.targetTransactionCount}
                                        </td>
                                    </tr>
                                ))
                            )
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-6">
                                    <img
                                        src="/assets/images/NoData.png"
                                        alt="No Data"
                                        className="mx-auto w-24 mb-3"
                                    />
                                    <p className="text-slate-500">No Target Records Available</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {targetList.length > pageSize && (
                    <div className="flex justify-between items-center mt-4 flex-wrap text-sm text-slate-600">
                        <div className="space-x-2">
                            <button
                                disabled={page === 1}
                                onClick={() => refreshPage(page - 1)}
                                className={`px-3 py-1 rounded ${page === 1
                                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                        : "bg-slate-200 hover:bg-slate-300"
                                    }`}
                            >
                                Prev
                            </button>
                            <span className="font-medium">
                                Page {page} of {Math.ceil(targetList.length / pageSize)}
                            </span>
                            <button
                                disabled={page * pageSize >= targetList.length}
                                onClick={() => refreshPage(page + 1)}
                                className={`px-3 py-1 rounded ${page * pageSize >= targetList.length
                                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                        : "bg-slate-200 hover:bg-slate-300"
                                    }`}
                            >
                                Next
                            </button>
                        </div>

                        <div>
                            Showing{" "}
                            <strong>{(page - 1) * pageSize + 1}</strong> -{" "}
                            <strong>{Math.min(page * pageSize, targetList.length)}</strong> of{" "}
                            <strong>{targetList.length}</strong>
                        </div>
                    </div>
                )}
            </div>

            {/* Chart */}
            {/* <div className="bg-white rounded-2xl shadow border border-slate-200 p-6">
                <canvas ref={chartRef}></canvas>
            </div> */}

            {/* Loader */}
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white/40 z-50">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
}
