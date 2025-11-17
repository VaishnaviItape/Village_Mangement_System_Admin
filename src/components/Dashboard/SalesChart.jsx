// import React from "react";
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
// const data = [
//     { name: "Clients", value: 45, color: "#3b82f6" },
//     { name: "Properties", value: 25, color: "#8b5cf6" },
//     { name: "Units", value: 20, color: "#10b981" },
//     { name: "Other", value: 10, color: "#f59e0b" }
// ];

// function SalesChart() {
//     return (
//         <div className="bg-white shadow-xl backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 "> {/* dark:bg-slate-900 dark:border-slate-700/50 */}
//             <div className="mb-4">
//                 <h3 className="text-lg font-bold text-slate-800">   
//                     Sales by Category                  {/*   dark:text-white */}
//                 </h3>
//                 <p className="text-sm text-slate-500 dark:text-slate-550"> Production Distribution </p>
//             </div>
//             <div className="h-47 ">
//                 <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                         <Pie
//                             data={data}
//                             cx="50%"
//                             cy='50%'
//                             innerRadius={50}
//                             outerRadius={80}
//                             paddingAngle={5}
//                             dataKey="value"
//                         >
//                             {data.map((entry, index) => (
//                                 <Cell key={`cell -${index}`} fill={entry.color} />
//                             ))}
//                         </Pie>
//                         <Tooltip
//                             contentStyle={{
//                                 backgroundColor: "rgba(255, 255, 255, 0.95)",
//                                 border: "none",
//                                 borderRadius: "12px",
//                                 boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
//                             }}
                            
//                         />
//                     </PieChart>
//                 </ResponsiveContainer>
//             </div>
//             <div className=" mt-6 space-y-3">
//                 {data.map((item, index) => {
//                     return (
//                         <div className="flex items-center justify-between" key={index}>
//                             <div className="flex item-sce space-x-3">
//                                 <div className="w-3 h-3 rounded-full"
//                                     style={{ backgroundColor: item.color }}
//                                 />
//                                 <span className="text-sm text-slate-600 dark:text-slate-550">
//                                     {item.name}
//                                 </span>
//                             </div>
//                             <div className="text-sm font-semibold text-slate-800 ">
//                                 {item.value}%
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// }
// export default SalesChart 

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from "recharts";
import { getClients } from "../../services/clientService";

function SalesChart() {
  const [data, setData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const fetchData = async () => {
      try {
        const clients = await getClients(token);
        const safeClients = Array.isArray(clients) ? clients : [];
        const total = safeClients.length || 1; // avoid divide by zero

        const basic = safeClients.filter(c => c.subscriptionPlanName === "Basic").length;
        const pro = safeClients.filter(c => c.subscriptionPlanName === "Pro").length;
        const advance = safeClients.filter(c => c.subscriptionPlanName === "Advanced").length;

        const chartData = [
          { name: "Basic", value: parseFloat(((basic / total) * 100).toFixed(1)), color: "#3b82f6" },
          { name: "Pro", value: parseFloat(((pro / total) * 100).toFixed(1)), color: "#10b981" },
          { name: "Advance", value: parseFloat(((advance / total) * 100).toFixed(1)), color: "#8b5cf6" },
        ];

        setData(chartData);
      } catch (error) {
        console.error("Failed to load plan data:", error);
      }
    };

    fetchData();
  }, []);

  const handleClick = (_, index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, value
    } = props;

    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    // const mx = cx + (outerRadius + 30) * cos;
    // const my = cy + (outerRadius + 30) * sin;

    return (
      <g className="transition-transform duration-500 ease-out">
        {/* outer highlight sector */}
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        {/* Center text */}
        <text x={cx} y={cy - 10} textAnchor="middle" fill="#111827" className="font-semibold">
          {payload.name}
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="#6b7280" className="text-sm">
          {value}%
        </text>
      </g>
    );
  };

  return (
    <div className="bg-white shadow-xl backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-800">Plan Distribution</h3>
        <p className="text-sm text-slate-500">Client Plan Percentage</p>
      </div>

      <div className="h-55">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              dataKey="value"
              onClick={handleClick}
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={500}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  cursor="pointer"
                  stroke={index === activeIndex ? "#374151" : "#fff"}
                  strokeWidth={index === activeIndex ? 2 : 1}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value}%`, name]}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 space-y-1.5">
        {data.map((item, index) => (
          <div
            key={index}
            onClick={() => handleClick(null, index)}
            className={`flex items-center justify-between px-1.5 py-0.5 rounded-lg transition-all cursor-pointer ${
              activeIndex === index ? "bg-blue-100 scale-105" : "hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-slate-700">{item.name}</span>
            </div>
            <div className="text-sm font-semibold text-slate-800">
              {item.value}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SalesChart;


