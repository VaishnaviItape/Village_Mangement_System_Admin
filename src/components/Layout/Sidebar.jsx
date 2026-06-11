import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, MapPin, Database, ChevronDown, Zap, FileText, UserCircle, Bell, Home, FileCheck, Ticket, Landmark, Percent, MessageSquare, Building2, Tractor, IndianRupee, Wrench, Map, FileBarChart
} from "lucide-react";
import iconLogin from "../../assets/favicon.png";
import axiosInstance from "../../services/axiosInstance";

const allMenuItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", active: true, badge: "New" },
  { id: "village", icon: MapPin, label: "Village Overview" },
  {
    id: "citizen-section", icon: UserCircle, label: "Citizen Management",
    submenu: [
      { id: "citizen", label: "Citizen Records", icon: Zap },
      { id: "civic-registrations", label: "Civic Registrations", icon: FileCheck },
      { id: "utility-requests", label: "Utility & Infrastructure", icon: FileText },
      { id: "applications", label: "Applications", icon: FileText },
      { id: "complaints", label: "Complaints", icon: FileCheck },
    ],
  },
  {
    id: "property-section", icon: Home, label: "Property & Tax",
    submenu: [
      { id: "property", label: "Property Records", icon: Ticket },
      { id: "tax", label: "Tax Collection", icon: Percent },
      { id: "sv/payments", label: "Digital Payments", icon: Zap },
    ],
  },
  {
    id: "business-section", icon: Building2, label: "Business & Economy",
    submenu: [
      { id: "sv/trade", label: "Trade Licenses", icon: FileCheck },
      { id: "sv/vendors", label: "Vendors & Contractors", icon: Users },
      { id: "sv/marketplace", label: "E-Marketplace", icon: Database },
    ],
  },
  {
    id: "agri-section", icon: Tractor, label: "Agriculture & Land",
    submenu: [
      { id: "sv/land", label: "Land Registrations", icon: Map },
    ],
  },
  {
    id: "admin-section", icon: Landmark, label: "Administration",
    submenu: [
      { id: "sv/sabha", label: "Gram Sabha", icon: FileText },
      { id: "sv/expenses", label: "Panchayat Expenses", icon: IndianRupee },
      { id: "sv/maintenance", label: "Asset Maintenance", icon: Wrench },
      { id: "sv/health", label: "Health & Sanitation", icon: FileCheck },
    ],
  },
  {
    id: "reports", icon: FileBarChart, label: "Government Schemes", restrictTo: ['superadmin'],
    submenu: [
      { id: "scheme", label: "Scheme Master", icon: Zap },
      { id: "schemeapplications", label: "Scheme Applications", icon: FileCheck },
    ],
  },
  {
    id: "reports-section", icon: FileText, label: "Reports",
    submenu: [
      { id: "reports/taxes", label: "Tax Reports", icon: Percent },
      { id: "reports/complaints", label: "Complaint Reports", icon: FileCheck },
      { id: "reports/users", label: "User Reports", icon: Users },
      { id: "sv/audit", label: "Advanced Audit", icon: FileBarChart },
    ],
  },
  { id: "notification", icon: Bell, label: "Notifications" },
  // { id: "chatbot", icon: MessageSquare, label: "Chatbot Support" },
  { id: "users", label: "User Management", icon: Users, restrictTo: ['superadmin'] },
  {
    id: "master", icon: Database, label: "Master Settings", restrictTo: ['superadmin'],
    submenu: [
      { id: "state", label: "State Master", icon: Zap },
      { id: "district", label: "District Master", icon: Zap },
      { id: "taluka", label: "Taluka Master", icon: Zap },
      { id: "panchayat-members", label: "Panchayat Members", icon: Zap },
      { id: "infrastructure", label: "Infrastructure", icon: Zap },
    ],
  },
];

export default function Sidebar({ collapsed }) {
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [hovered, setHovered] = useState(false);
  const [user, setUser] = useState({ full_name: "", role: "" });
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const sidebarWidth = collapsed ? (hovered ? 288 : 80) : 288;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/api/auth/me");
        if (response.data.success && response.data.user) {
          setUser({
            full_name: response.data.user.full_name,
            role: response.data.user.role,
          });
        }
      } catch (err) { console.error("Failed to fetch user:", err); }
    };
    fetchUser();
  }, []);

  const handleMenuClick = (item) => {
    setActiveMenu(item.id);
    if (item.submenu) {
      setExpandedItems((prev) => {
        const newSet = new Set();
        if (!prev.has(item.id)) newSet.add(item.id);
        return newSet;
      });
    } else {
      setExpandedItems(new Set());
      navigate(`/${item.id}`);
    }
  };

  // Filter menu items based on Role (RBAC)
  const visibleMenuItems = allMenuItems.filter((item) => {
    if (item.restrictTo && !item.restrictTo.includes(user.role)) {
      return false;
    }
    return true;
  });

  return (
    <div
      className="flex flex-col h-screen bg-indigo-950 border-r border-indigo-900 shadow-xl transition-all duration-500 ease-in-out overflow-hidden"
      style={{ width: sidebarWidth }}
      onMouseEnter={() => collapsed && setHovered(true)}
      onMouseLeave={() => collapsed && setHovered(false)}
    >
      <div className="p-6 border-b border-indigo-900 flex items-center space-x-3">
        <img src={iconLogin} alt="logo" className="w-12 h-12" />
        {sidebarWidth > 80 && (
          <div>
            <h1 className="text-xl font-bold text-white">Smart Village</h1>
            <p className="text-xs text-indigo-300">Admin Panel</p>
          </div>
        )}
      </div>

      <div className="flex-1 p-4 space-y-1 overflow-y-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        {visibleMenuItems.map((item) => {
          const isExpanded = expandedItems.has(item.id);
          return (
            <div key={item.id}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() => handleMenuClick(item)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${activeMenu === item.id || isExpanded
                      ? "bg-indigo-700 text-white shadow-md shadow-indigo-900/50"
                      : "text-indigo-200 hover:bg-indigo-800 hover:text-white"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      {sidebarWidth > 80 && <span>{item.label}</span>}
                    </div>
                    {sidebarWidth > 80 && <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />}
                  </button>
                  {sidebarWidth > 80 && (
                    <div className={`ml-5 pl-3 mt-1 space-y-1 border-l-2 border-indigo-800/50 overflow-hidden transition-all duration-500 ${isExpanded ? "max-h-96 py-1" : "max-h-0"}`}>
                      {item.submenu.map((sub) => (
                        <NavLink
                          key={sub.id}
                          to={`/${sub.id}`}
                          className={({ isActive }) => `flex items-center gap-3 px-3 py-2 text-sm rounded-xl transition-all duration-300 ${isActive ? "bg-indigo-800 text-white font-medium shadow-sm translate-x-1" : "text-indigo-300 hover:bg-indigo-800/40 hover:text-white hover:translate-x-1"}`}
                        >
                          <sub.icon className={`w-4 h-4 ${activeMenu === sub.id ? 'opacity-100 text-indigo-400' : 'opacity-70'}`} />
                          <span>{sub.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <NavLink
                  to={`/${item.id}`}
                  className={({ isActive }) => `flex items-center p-3 rounded-xl transition-all duration-200 ${isActive ? "bg-indigo-700 text-white shadow-md shadow-indigo-900/50" : "text-indigo-200 hover:bg-indigo-800 hover:text-white"}`}
                >
                  <item.icon className="w-5 h-5" />
                  {sidebarWidth > 80 && <span className="ml-2">{item.label}</span>}
                </NavLink>
              )}
            </div>
          );
        })}
      </div>

      {sidebarWidth > 80 && (
        <div className="p-4 border-t border-indigo-900">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-indigo-900">
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=4f46e5&color=fff`} alt={user.full_name} className="w-10 h-10 rounded-full" />
            <div>
              <p className="text-sm font-bold text-white">{user.full_name}</p>
              <p className="text-xs text-indigo-300">{user.role}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
