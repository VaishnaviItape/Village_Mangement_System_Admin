import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import iconLogin from "../assets/iconLogin.png"; // Adjust path if needed

export default function RegisterPage() {
    const [formData, setFormData] = useState({ 
        full_name: "", 
        username: "", 
        email: "", 
        password: "" 
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!formData.full_name || !formData.username || !formData.email || !formData.password) {
            toast.error("All fields are required!");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(
                "http://localhost:8080/api/auth/register",
                {
                    full_name: formData.full_name,
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    role: "admin" // Hardcoded role for admin registration from this portal
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            toast.success("Registration successful! Please login.");
            
            // Navigate to login after short delay
            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 1500);

        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex relative bg-gray-50 overflow-hidden">
            

            {/* Animated Background Shapes */}
            <div className="absolute top-[-100px] left-[-100px] w-72 h-72 bg-emerald-300 rounded-full opacity-30 animate-ping-slow"></div>
            <div className="absolute bottom-[-120px] right-[-100px] w-96 h-96 bg-stone-400 rounded-full opacity-20 animate-spin-slow"></div>
            <div className="absolute top-[150px] right-[-80px] w-56 h-56 bg-amber-300 rounded-full opacity-20 animate-bounce-slow"></div>

            {/* Left Side Image */}
            <div
                className="hidden md:flex w-1/2 bg-cover bg-center relative z-10 transition-transform duration-500 hover:scale-105 rounded-l-2xl overflow-hidden"
                style={{ backgroundImage: `url(${iconLogin})` }}
            ></div>

            {/* Right Side Form */}
            <div className="flex-1 flex flex-col justify-center items-center z-10 relative p-10">
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-gray-200 transform transition-transform hover:scale-105 relative">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        Create an Account
                    </h2>

                    {/* Full Name */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Full Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.full_name}
                            onChange={(e) =>
                                setFormData({ ...formData, full_name: e.target.value })
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-300"
                        />
                    </div>

                    {/* Username */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Username
                        </label>
                        <input
                            type="text"
                            placeholder="Choose a username"
                            value={formData.username}
                            onChange={(e) =>
                                setFormData({ ...formData, username: e.target.value })
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-300"
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-300"
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-300"
                        />
                    </div>

                    {/* Register Button */}
                    <button
                        onClick={handleRegister}
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-3 mt-4 rounded-xl font-medium hover:bg-indigo-700 transition-all transform active:scale-95 shadow-md"
                    >
                        {loading ? "Registering..." : "Sign Up"}
                    </button>
                </div>

                {/* Optional Footer */}
                <p className="mt-6 text-sm text-gray-500">
                    Already have an account?{" "}
                    <span 
                        onClick={() => navigate("/login")}
                        className="text-indigo-600 hover:underline cursor-pointer"
                    >
                        Log in
                    </span>
                </p>
            </div>
        </div>
    );
}
