import React, { useEffect, useState } from "react";
import StatsGrid from "./StatsGrid";
import ChartSection from "./ChartSection";
import TableSection from "./TableSection";
import { getDashboardData } from "../../services/dashboardService";
import { toast } from "react-toastify";

function Dashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await getDashboardData();
                if (res.data.success) {
                    setDashboardData(res.data.data);
                }
            } catch (error) {
                console.error("Failed to load dashboard data:", error);
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col space-y-2">
                <h1 className="text-2xl font-bold text-slate-800">Gram Panchayat Overview</h1>
                <p className="text-slate-500">Welcome to the Smart Village Administration Panel</p>
            </div>

            <StatsGrid data={dashboardData} />
            <ChartSection data={dashboardData} />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-3">
                    <TableSection data={dashboardData.recentComplaints} />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;