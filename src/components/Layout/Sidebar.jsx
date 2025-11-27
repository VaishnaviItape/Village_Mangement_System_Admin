import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  MapPin,
  Database,
  ChevronDown,
  Zap,
  FileText,
  UserCircle,
  Bell,
  Home,
  FileCheck,
  Ticket,
  Landmark,
  Percent
} from "lucide-react";
import iconLogin from "../../assets/favicon.png";
import axiosInstance from "../../services/axiosInstance";

const menuItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", active: true, badge: "New" },

  // Basic Modules
  { id: "users", label: "Users", icon: Users },
  { id: "village", icon: MapPin, label: "Village" },
  { id: "chatbot", icon: MapPin, label: "chatbot" },
  // Citizen & Applications
  {
    id: "citizen-section",
    icon: UserCircle,
    label: "Citizen Management",
    submenu: [
      { id: "citizen", label: "Citizen Records", icon: Zap },
      { id: "applications", label: "Applications", icon: FileText },
      { id: "complaints", label: "Complaints", icon: FileCheck },
    ],
  },

  // Property / Taxation
  {
    id: "property-section",
    icon: Home,
    label: "Property & Tax",
    submenu: [
      { id: "property", label: "Property Records", icon: Ticket },
      { id: "tax", label: "Tax Collection", icon: Percent },
    ],
  },

  // Schemes & Grants
  {
    id: "schemes",
    icon: Landmark,
    label: "Government Schemes",
    submenu: [
      { id: "scheme", label: "Scheme Master", icon: Zap },
      { id: "schemeapplications", label: "Scheme Applications", icon: FileCheck },
    ],
  },

  // Notifications
  {
    id: "notification",
    icon: Bell,
    label: "Notifications",
  },

  // Master Section
  {
    id: "master",
    icon: Database,
    label: "Master",
    submenu: [
      { id: "state", label: "State Master", icon: Zap },
      { id: "district", label: "District Master", icon: Zap },
    ],
  },

  // Messages
  // {
  //   id: "messages",
  //   icon: Database,
  //   label: "Messages",
  //   submenu: [{ id: "mymessages", label: "My Messages", icon: Zap }],
  // },
];

export default function Sidebar({ collapsed }) {
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [hovered, setHovered] = useState(false);

  // ⭐ Updated user object
  const [user, setUser] = useState({ full_name: "", role: "" });

  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState("dashboard");

  const sidebarWidth = collapsed ? (hovered ? 288 : 80) : 288;

  // 🔹 Fetch logged-in user from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/api/auth/me");
        const result = response.data;

        if (result.success && result.user) {
          setUser({
            full_name: result.user.full_name,
            role: result.user.role,
          });
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
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

  return (
    <div
      className="flex flex-col h-screen bg-white border-r border-slate-200 shadow-md transition-all duration-500 ease-in-out"
      style={{ width: sidebarWidth }}
      onMouseEnter={() => collapsed && setHovered(true)}
      onMouseLeave={() => collapsed && setHovered(false)}
    >
      {/* Logo */}
      <div className="p-6 border-b border-slate-200 flex items-center space-x-3">
        <img src={iconLogin} alt="logo" className="w-12 h-12" />
        {sidebarWidth > 80 && (
          <div>
            <h1 className="text-xl font-bold text-slate-800">Smart Village</h1>
            <p className="text-xs text-slate-500">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <div className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isExpanded = expandedItems.has(item.id);

          return (
            <div key={item.id}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() => handleMenuClick(item)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${activeMenu === item.id || isExpanded
                      ? "bg-blue-500 text-white"
                      : "text-slate-700 hover:bg-blue-100"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      {sidebarWidth > 80 && <span>{item.label}</span>}
                    </div>
                    {sidebarWidth > 80 && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""
                          }`}
                      />
                    )}
                  </button>

                  {/* Submenu */}
                  {sidebarWidth > 80 && (
                    <div
                      className={`ml-6 mt-1 space-y-1 overflow-hidden transition-all duration-500 ${isExpanded ? "max-h-96" : "max-h-0"
                        }`}
                    >
                      {item.submenu.map((sub) => (
                        <NavLink
                          key={sub.id}
                          to={`/${sub.id}`}
                          className={({ isActive }) =>
                            `flex items-center gap-2 p-2 text-sm rounded-lg ${isActive ? "bg-blue-500 text-white" : "hover:bg-blue-100"
                            }`
                          }
                        >
                          <sub.icon className="w-4 h-4" />
                          <span>{sub.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <NavLink
                  to={`/${item.id}`}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-xl ${isActive ? "bg-blue-500 text-white" : "text-slate-700 hover:bg-blue-100"
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  {sidebarWidth > 80 && <span className="ml-2">{item.label}</span>}
                </NavLink>
              )}
            </div>
          );
        })}
      </div>

      {/* 🔹 User Section */}
      {sidebarWidth > 80 && (
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-100">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.full_name
              )}&background=6366f1&color=fff`}
              alt={user.full_name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-sm font-bold">{user.full_name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
