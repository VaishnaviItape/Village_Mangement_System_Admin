import React, { useEffect, useState } from "react";
import {
  IndianRupee,
  Users,
  Map,
  FileText,
  AlertCircle,
  Building2
} from "lucide-react";
// import { getDashboardData } from "../../services/dashboardService"; // Uncomment when connecting

function StatsGrid() {
  // Default state matching your API structure for safety
  const [data, setData] = useState({
    citizens: 0,
    villages: 0,
    complaints: 0,
    totalGharPattiAmount: "0",
    totalPaniPattiAmount: "0",
  });

  useEffect(() => {
    // Mocking the API call with the data you provided
    // In real app: const res = await getDashboardData(); setData(res.data);
    const mockApiData = {
      citizens: 1250, // Updated for visual effect
      complaints: 5,  // Updated for visual effect
      villages: 19,
      totalGharPattiAmount: "9250.00",
      totalPaniPattiAmount: "1600.00",
    };
    setData(mockApiData);
  }, []);

  // Calculate Total Tax correctly (Fixing the API concatenation string issue)
  const gharPatti = parseFloat(data.totalGharPattiAmount) || 0;
  const paniPatti = parseFloat(data.totalPaniPattiAmount) || 0;
  const totalRevenue = gharPatti + paniPatti;

  const stats = [
    {
      title: "Total Tax Collected",
      value: `₹${totalRevenue.toLocaleString()}`,
      subtext: "Ghar Patti + Pani Patti",
      icon: IndianRupee,
      color: "from-emerald-400 to-emerald-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      title: "Total Population",
      value: data.citizens,
      subtext: "Registered Citizens",
      icon: Users,
      color: "from-blue-400 to-indigo-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Villages Covered",
      value: data.villages,
      subtext: "Under Jurisdiction",
      icon: Map,
      color: "from-purple-400 to-pink-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Active Complaints",
      value: data.complaints,
      subtext: "Needs Attention",
      icon: AlertCircle,
      color: "from-orange-400 to-red-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{item.title}</p>
              <h3 className="text-2xl font-bold text-slate-800">{item.value}</h3>
              <p className="text-xs text-slate-400 mt-1">{item.subtext}</p>
            </div>
            <div className={`p-3 rounded-xl ${item.bgColor}`}>
              <item.icon className={`w-6 h-6 ${item.textColor}`} />
            </div>
          </div>
          {/* Decorative Bar */}
          <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${item.color} w-3/4 rounded-full`} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsGrid;