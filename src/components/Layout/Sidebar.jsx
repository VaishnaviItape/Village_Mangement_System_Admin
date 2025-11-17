import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  CalendarCheck,
  Target,
  Users,
  Settings,
  Database,
  FileText,
  Zap,
  DollarSign,
  UserCheck,
  Activity,
  ChevronDown,
  Logs,
} from "lucide-react";
import iconLogin from "../../assets/iconLogin.png";
import axiosInstance from "../../services/axiosInstance"; // Import API

const menuItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", active: true, badge: "New" },
  { id: "attendance", icon: CalendarCheck, label: "Attendance" },
  { id: "target", icon: Target, label: "Target" },
  { id: "all-clients", label: "Users", icon: Users },
  { id: "leaverequest", label: "Leave Requests", icon: CalendarCheck },
  { id: "salesList", label: "Sales List", icon: BarChart3 },
  { id: "expensesList", label: "Expenses List", icon: BarChart3 },
  {
    id: "master",
    icon: Database,
    label: "Master",
    submenu: [{ id: "product", label: "Product Master", icon: Zap }],
  },
  {
    id: "messages",
    icon: Database,
    label: "Messages",
    submenu: [{ id: "mymessages", label: "My Messages", icon: Zap }],
  },
];

export default function Sidebar({ collapsed, onToggle }) {
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [hovered, setHovered] = useState(false);
  const [user, setUser] = useState({ fullName: "", role: "" }); // 🔹 Dynamic user
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const sidebarWidth = collapsed ? (hovered ? 288 : 80) : 288;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/Auth/me");
        const data = response.data;
        setUser({
          fullName: data.fullName || "User",
          role: data.roles ? data.roles[0] : "User",
        });
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  const toggleExpanded = (itemId) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) newSet.delete(itemId);
      else newSet.add(itemId);
      return newSet;
    });
  };

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
        <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ease-in-out hover:bg-slate-100 hover:shadow-md hover:scale-105">
          <img
            src={iconLogin}
            alt="logo"
            className="w-12 h-12 object-contain transition-transform duration-300 ease-in-out hover:scale-110"
          />
        </div>
        {sidebarWidth > 80 && (
          <div>
            <h1 className="text-xl font-bold text-slate-800">Sales Booster</h1>
            <p className="text-xs text-slate-500">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Menu */}
      <div className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(`/${item.id}`);
          const isExpanded = expandedItems.has(item.id);

          return (
            <div key={item.id}>
              {item.submenu ? (
                <>
                  {/* Main menu with submenu */}
                  <button
                    onClick={() => handleMenuClick(item)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${activeMenu === item.id || expandedItems.has(item.id)
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-slate-600 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 hover:text-slate-800"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-5 h-5 transition-transform duration-500 rotate-hover`} />
                      {sidebarWidth > 80 && <span>{item.label}</span>}
                    </div>
                    {sidebarWidth > 80 && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    )}
                  </button>

                  {/* Submenu */}
                  {sidebarWidth > 80 && (
                    <div
                      className={`ml-6 mt-1 space-y-1 overflow-hidden transition-all duration-500 ${isExpanded ? "max-h-96" : "max-h-0"
                        }`}
                    >
                      {item.submenu.map((subitem) => (
                        <NavLink
                          key={subitem.id}
                          to={subitem.path || `/${subitem.id}`}
                          className={({ isActive }) =>
                            `w-full text-left flex items-center gap-2 p-2 text-sm rounded-lg transition-all ${isActive
                              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                              : "text-slate-600 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 hover:text-slate-800"
                            }`
                          }
                        >
                          {subitem.icon && <subitem.icon className="w-4 h-4" />}
                          <span>{subitem.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                // Non-submenu item
                <NavLink
                  to={`/${item.id}`}
                  end
                  className={({ isActive }) =>
                    `w-full flex items-center p-3 rounded-xl transition-all duration-200 ${isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-slate-600 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 hover:text-slate-800"
                    }`
                  }
                >
                  <item.icon className={`w-5 h-5 transition-transform duration-500 rotate-hover`} />
                  {sidebarWidth > 80 && (
                    <>
                      <span className="font-medium ml-2">{item.label}</span>
                      {item.badge && (
                        <span className="px-3 py-1 text-xs bg-red-400 text-white rounded-full ml-5">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              )}
            </div>
          );
        })}
      </div>

      {/* User Section */}
      {sidebarWidth > 80 && (
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.fullName
              )}&background=6366f1&color=fff`}
              alt={user.fullName}
              className="w-10 h-10 rounded-full ring-2 ring-blue-500/40"
            />
            <div>
              <p className="text-sm font-medium text-slate-800">{user.fullName}</p>
              <p className="text-xs text-slate-500">{user.role}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
