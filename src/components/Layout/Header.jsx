import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  Search,
  Filter,
  Plus,
  Sun,
  Bell,
  Settings,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";
import { logout } from "../../services/authService";
import { getUsers } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance"; // import API instance
import toast from "react-hot-toast";

export default function Header({ sidebarCollapsed, onToggleSidebar }) {
  const [open, setOpen] = useState(false);
  const [inactiveClients, setInactiveClients] = useState([]);
  const [user, setUser] = useState({ fullName: "", role: "" });
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const notifRef = useRef(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleNotifClick = () => {
    setNotifOpen(!notifOpen);
  };

  const handleMessageClick = (msg) => {
    openConversation(msg); // your existing function
    setNotifOpen(false);
  };
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const response = await axiosInstance.get("/Messaging/unread");
        const data = response.data;
        setUnreadMessages(data);
        setUnreadCount(data.length);
      } catch (error) {
        console.error("Error fetching unread messages:", error);
        toast.error("Failed to load unread messages");
      }
    };

    fetchUnreadMessages();
  }, []);



  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch user data
  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/api/auth/me");
        const data = response.data;

        if (data.success && data.user) {
          const userData = data.user;

          setUser({
            fullName: userData.full_name,
            role: userData.role,
          });

          sessionStorage.setItem("userId", userData.id);
          sessionStorage.setItem("fullName", userData.full_name);
          sessionStorage.setItem("role", userData.role);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        toast.error("Failed to load user data");
      }
    };

    fetchUser();
  }, []);



  // Fetch inactive clients
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const fetchClients = async () => {
      try {
        const res = await getUsers(token);

        // Extract actual array safely
        const users = res?.data?.data || [];

        const inactive = users
          .filter((c) => !c.is_active) // Use correct key name
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6);

        setInactiveClients(inactive);

      } catch (err) {
        console.error("Failed to fetch clients:", err);
      }
    };

    fetchClients();
  }, []);


  const handleClientClick = (id) => {
    if (!id) return;
    navigate(`/all-clients/${id}`);
    setNotifOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      alert("Logout failed. Try again.");
    }
  };

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={onToggleSidebar}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden md:block">
            <h1 className="text-2xl font-black text-slate-800">Dashboard</h1>
            <p className="text-slate-500">
              Welcome back! Here's what's happening today
            </p>
          </div>
        </div>

        {/* Center - Search Bar */}
        {/* <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Anything"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5
            text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <Filter />
            </button>
          </div>
        </div> */}

        {/* Right */}
        <div className="flex item-center space-x-3">
          {/* <button className="hidden lg:flex items-center space-x-2 py-2 px-4 bg-gradient-to-r
            from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-a">
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">New</span>
          </button> */}

          {/* <button className="p-2.5 rounded-xl text-slate-600 dark:text-slate-600 hover:bg-slate-100  transition-colors rotate-hover">
            <Sun className="w-5 h-5" />
          </button> */}

          {/* Notification */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={handleNotifClick}
              className="relative p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Bell className="w-5 h-5" />

              {unreadCount > 0 && (
                <span className="absolute -top-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>


            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-2xl border z-50 animate-fadeIn">

                <h4 className="p-3 font-semibold border-b text-slate-700">
                  Unread Messages ({unreadCount})
                </h4>

                <div className="max-h-72 overflow-y-auto">
                  {unreadMessages.length === 0 && (
                    <p className="px-3 py-2 text-sm text-gray-500">No unread messages</p>
                  )}

                  {unreadMessages.map((msg) => (
                    <div
                      key={msg.id}
                      onClick={() => handleMessageClick(msg)}
                      className="flex items-center p-3 cursor-pointer hover:bg-gray-100"
                    >
                      {/* Avatar */}
                      <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
                        {msg.senderName?.charAt(0)}
                      </div>

                      {/* Message Content */}
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">{msg.senderName}</span>
                          {!msg.isRead && (
                            <span className="bg-green-500 text-white px-2 rounded-full text-xs">
                              New
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 truncate">{msg.body}</p>

                        <span className="text-xs text-gray-400">
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          <button className="p-2.5 rounded-xl text-slate-600 dark:text-slate-600 hover:bg-slate-100 
                       rotate-hover">
            <Settings className="w-5 h-5" />
          </button>

          {/* User Profile */}
          <div className="relative ml-3" ref={menuRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 p-2 rounded-xl hover:bg-blue-50 transition-colors"
            >
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.fullName || "User"
                )}&background=3b82f6&color=fff`}

                className="w-8 h-8 rounded-full ring-2 ring-blue-400"
              />
              <div className="hidden md:flex flex-col text-left">
                <span className="text-sm font-semibold text-slate-700">
                  {user.fullName}
                </span>
                <span className="text-xs text-slate-500">{user.role}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 transition-transform ${open ? "rotate-180" : ""
                  }`}
              />
            </button>

            {open && (
              <div
                className="absolute right-0 mt-2 w-52 bg-gradient-to-br from-blue-50 to-violet-100 shadow-lg rounded-2xl border border-blue-200 transform transition-all duration-200 z-50 animate-fadeIn"
              >
                <div className="py-2">
                  <button
                    onClick={() => navigate("/profile")}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-blue-100 rounded-md transition-all hover:translate-x-1"
                  >
                    <User className="w-4 h-4 text-blue-500" />
                    Profile
                  </button>

                  <button
                    onClick={() => navigate("/settings")}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-blue-100 rounded-md transition-all hover:translate-x-1"
                  >
                    <Settings className="w-4 h-4 text-blue-500 rotate-hover" />
                    Settings
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-all hover:translate-x-1"
                  >
                    <LogOut className="w-4 h-4 text-red-500 rotate-hover" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
