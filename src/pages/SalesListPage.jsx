import React, { useEffect, useState } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import toast, { Toaster } from "react-hot-toast";
import { getSalesByMonth } from "../services/salesService";

export default function SalesListPage() {
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    });

    // 🧾 Fetch sales for a given month
    const fetchSales = async (month) => {
        setLoading(true);
        try {
            const [year, monthNum] = month.split("-");
            const res = await getSalesByMonth(monthNum, year);
            const formattedData = [];

            // Flatten employee sales data
            res.data.forEach((employee) => {
                if (employee.productSales && employee.productSales.length > 0) {
                    employee.productSales.forEach((productSale) => {
                        formattedData.push({
                            ...productSale,
                            employeeName: employee.employeeName,
                            saleDate: new Date(employee.year, employee.month - 1)
                                .toLocaleString("default", { month: "short", year: "numeric" }),
                        });
                    });
                }
            });

            setSalesData(formattedData);
            toast.success("Sales data loaded!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch sales data");
        } finally {
            setLoading(false);
        }
    };

    // Load default month data
    useEffect(() => {
        fetchSales(selectedMonth);
    }, []);

    // Handle month change
    const handleMonthChange = (e) => {
        const month = e.target.value;
        setSelectedMonth(month);
        fetchSales(month);
    };

    // Define table columns
    const columns = [
        { header: "Product Name", accessor: "productName" },
        { header: "Employee Name", accessor: "employeeName" },
        { header: "Date", accessor: "saleDate" },
        { header: "Amount", accessor: "transactionAmount" },
        { header: "Count", accessor: "transactionCount" },
    ];

    return (
        <div className="p-8 space-y-6">
            <Toaster
                position="top-center"
                toastOptions={{
                    style: { minWidth: "400px", fontSize: "18px", padding: "16px 24px" },
                }}
            />

            {/* Header with month picker */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-slate-800">
                    Manage Sales
                </h2>

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

            {/* Sales Table */}
            <SmartDataTable
                title={`Sales List for ${selectedMonth}`}
                columns={columns}
                data={salesData}
                showSerial={true}
                hideActions={true}
                showAddButton={false}
            />

            {/* Loader */}
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white/40 z-50">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
}
