// import { ArrowRight, DollarSign, Users, Eye, Home, ArrowUpRight, ArrowDownRight } from "lucide-react";
// import React from "react";
// const stats = [
//     {
//         title: "Total Revenue",
//         value: "$124,563",
//         change: "+12.5%",
//         trend: "up",
//         icon: DollarSign,
//         color: "from-emerald-500 to-real-600",
//         bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
//         textColor: "text-emerald-600 dark:text-emerald-400",
//     },
//     {
//         title: "Active Clients",
//         value: "3456",
//         change: "+8.5%",
//         trend: "up",
//         icon: Users,
//         color: "from-blue-500 to-indigo-600",
//         bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
//         textColor: "text-blue-600 dark:text-blue-400",
//     },
//     {
//         title: "Total Properties",
//         value: "8000",
//         change: "+15.3%",
//         trend: "up",
//         icon: Home,
//         color: "from-purple-500 to-pink-600",
//         bgColor: "bg-purple-50 dark:bg-purple-900/20",
//         textColor: "text-purple-600 dark:text-purple-400",
//     },
//     {
//         title: "Page Views",
//         value: "13,458",
//         change: "-2%",
//         trend: "down",
//         icon: Eye,
//         color: "from-orange-500 to-red-600",
//         bgColor: "bg-orange-50 dark:bg-orange-900/20",
//         textColor: "text-orange-600 dark:text-orange-400",
//     },
// ];
// function StatsGrid() {
//     return (
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             {stats.map((stats, index) => {
//                 return (
//                     <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6
//             border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl
//             hower:shadow-slate-200/20 dark:hover:shadow-slate-900/20 transition-all 
//             duration-300 group" key={index}>
//                         <div className="flex items-start justify-between">
//                             <div className="flex-1">
//                                 <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
//                                     {stats.title}
//                                 </p>
//                                 <p className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
//                                     {stats.value}
//                                 </p>
//                                 <div className=" flex item-center space-x-2">
//                                     {stats.trend === "up" ? (
//                                         <ArrowUpRight className="w-4 h-4  text-emerald-500" />
//                                     ) : (
//                                         <ArrowDownRight className="w-4 h-4 text-red-500" />
//                                     )}
//                                     <span className={`text-sm font-semibold ${stats.trend === "up" ?
//                                         "text-emerald-500" : "text-red-500"}`}>{stats.change}</span>
//                                     <span className="text-sm text-slate-500 dark:text-slate-400">
//                                         VS Last month
//                                     </span>
//                                 </div>
//                             </div>
//                             <div
//                                 className={`p-3 rounded-xl ${stats.bgColor} group-hover:scale-110 transition-all duration-200`}
//                             >
//                                 {<stats.icon className={`w-6 h-6 ${stats.textColor}`} />}
//                             </div>
//                         </div>

//                         <div className="mt-4 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
//                             <div
//                                 className={`h-full bg-gradient-to-r ${stats.color} rounded-full 
//                                 transition-all duration-100`} style={{ width: stats.trend === "up" ? "75%" : "45%" }}
//                             ></div>
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// }
// export default StatsGrid;

//--------------------------------------------------------------------------------------------------------------


// export default StatsGrid;

// import {
//   ArrowUpRight,
//   ArrowDownRight,
//   DollarSign,
//   IndianRupeeIcon,
//   Users,
//   Eye,
//   Home,
// } from "lucide-react";
// import React from "react";

// const stats = [
//   {
//     title: "Total Revenue",
//     value: "$124,563",
//     change: "+12.5%",
//     trend: "up",
//     icon: DollarSign,
//     color: "from-emerald-400 to-emerald-600",
//     bgColor: "bg-emerald-50",
//     textColor: "text-emerald-600",
//     progress: "80%",
//   },
//   {
//     title: "Active Clients",
//     value: "3,456",
//     change: "+8.5%",
//     trend: "up",
//     icon: Users,
//     color: "from-blue-400 to-indigo-600",
//     bgColor: "bg-blue-50",
//     textColor: "text-blue-600",
//     progress: "70%",
//   },
//   {
//     title: "Total Properties",
//     value: "8,000",
//     change: "+15.3%",
//     trend: "up",
//     icon: Home,
//     color: "from-purple-400 to-pink-600",
//     bgColor: "bg-purple-50",
//     textColor: "text-purple-600",
//     progress: "90%",
//   },
//   {
//     title: "Page Views",
//     value: "13,458",
//     change: "-2%",
//     trend: "down",
//     icon: Eye,
//     color: "from-orange-400 to-red-500",
//     bgColor: "bg-orange-50",
//     textColor: "text-orange-600",
//     progress: "40%",
//   },
// ];

// function StatsGrid() {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//       {stats.map((item, index) => (
//         <div
//           key={index}
//           className="bg-white backdrop-blur-xl rounded-2xl p-6 border border-slate-200
//           shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
//         >
//           <div className="flex items-start justify-between">
//             <div>
//               <p className="text-sm font-medium text-slate-500 mb-2">
//                 {item.title}
//               </p>
//               <p className="text-3xl font-bold text-slate-900 mb-3">
//                 {item.value}
//               </p>
//               <div className="flex items-center space-x-2">
//                 {item.trend === "up" ? (
//                   <ArrowUpRight className="w-4 h-4 text-emerald-500" />
//                 ) : (
//                   <ArrowDownRight className="w-4 h-4 text-red-500" />
//                 )}
//                 <span
//                   className={`text-sm font-semibold ${
//                     item.trend === "up"
//                       ? "text-emerald-500"
//                       : "text-red-500"
//                   }`}
//                 >
//                   {item.change}
//                 </span>
//                 <span className="text-xs text-slate-400">vs last month</span>
//               </div>
//             </div>

//             <div
//               className={`p-3 rounded-xl ${item.bgColor} transition-transform duration-300 hover:scale-110`}
//             >
//               <item.icon className={`w-6 h-6 ${item.textColor}`} />
//             </div>
//           </div>

//           <div className="mt-5 h-2 bg-slate-100 rounded-full overflow-hidden">
//             <div
//               className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-500`}
//               style={{ width: item.progress }}
//             ></div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default StatsGrid;

import {
  ArrowUpRight, 
  ArrowDownRight,
  DollarSign,
  Users,
  Home,
  Building,
  Eye,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { getDashboardData } from "../../services/dashboardService";
import toast from "react-hot-toast";

function StatsGrid() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const loadDashboard = async () => {
      try {
        const res = await getDashboardData(token);
        const data = res.data;

        const mappedStats = [
          {
            title: "Total Revenue",
            value: `₹${(data.totalRevenue ?? 0).toLocaleString()}`,
            change: "+15.3%",       // Optional: calculate dynamically
            trend: "up",            // Optional: calculate dynamically
            icon: DollarSign,
            color: "from-emerald-400 to-emerald-600",
            bgColor: "bg-emerald-50",
            textColor: "text-emerald-600",
            progress: "90%",
          },
          {
            title: "Total Owners",
            value: data.totalOwners ?? 0,
            change: "+8%",          // Optional
            trend: "up",
            icon: Users,
            color: "from-blue-400 to-indigo-600",
            bgColor: "bg-blue-50",
            textColor: "text-blue-600",
            progress: "70%",
          },
          {
            title: "Total Properties",
            value: data.totalProperties ?? 0,
            change: "+10%",          // Optional
            trend: "up",
            icon: Home,
            color: "from-purple-400 to-pink-600",
            bgColor: "bg-purple-50",
            textColor: "text-purple-600",
            progress: "80%",
          },
          {
            title: "Total Units",
            value: data.totalUnits ?? 0,
            change: "-2%",           // Optional
            trend: "down",
            icon: Building,
            color: "from-orange-400 to-red-500",
            bgColor: "bg-orange-50",
            textColor: "text-orange-600",
            progress: "40%",
          },
        ];

        setStats(mappedStats);
      } catch (error) {
        console.error("Dashboard load error:", error);
        toast.error("Failed to load dashboard data!");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-white backdrop-blur-xl rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-2">{item.title}</p>
              <p className="text-3xl font-bold text-slate-900 mb-3">{item.value}</p>
              <div className="flex items-center space-x-2">
                {item.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-semibold ${item.trend === "up" ? "text-emerald-500" : "text-red-500"}`}>
                  {item.change}
                </span>
                <span className="text-xs text-slate-400">vs last month</span>
              </div>
            </div>
            <div className={`p-3 rounded-xl ${item.bgColor} transition-transform duration-300 hover:scale-110`}>
              <item.icon className={`w-6 h-6 ${item.textColor}`} />
            </div>
          </div>
          <div className="mt-5 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-500`} style={{ width: item.progress }}></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsGrid;
