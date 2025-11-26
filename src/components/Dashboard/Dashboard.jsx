import React from "react";
import StatsGrid from "./StatsGrid";
import ChartSection from "./ChartSection";
import TableSection from "./TableSection";

function Dashboard() {
    return (
        <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col space-y-2">
                <h1 className="text-2xl font-bold text-slate-800">Gram Panchayat Overview</h1>
                <p className="text-slate-500">Welcome to the Smart Village Administration Panel</p>
            </div>

            <StatsGrid />
            <ChartSection />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-3">
                    <TableSection />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;