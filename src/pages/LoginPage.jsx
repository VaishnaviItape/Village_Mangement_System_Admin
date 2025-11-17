import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import iconLogin from "../assets/iconLogin.png"; // path adjust kare


export default function LoginPage({ onLogin }) {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!formData.username || !formData.password) {
            toast.error("Username and Password required!");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(
                "https://sales-booster-api.tmkcomputers.in/api/Auth/login",
                {
                    username: formData.username,
                    password: formData.password,
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            toast.success("Login successful!");
            console.log("Token / Data:", res.data);

            // ✅ Save token in localStorage
            const token = res.data.accessToken; // ya API ka jo actual token field hai
            localStorage.setItem("authToken", token);

            // ✅ call onLogin with token/data if needed
            onLogin?.(res.data);
            navigate("/dashboard", { replace: true });
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex relative bg-gray-50 overflow-hidden">
            <Toaster
                position="top-center"
                toastOptions={{
                    style: { minWidth: "400px", fontSize: "18px", padding: "16px 24px" },
                }}
            />

            {/* Animated Background Shapes */}
            <div className="absolute top-[-100px] left-[-100px] w-72 h-72 bg-purple-300 rounded-full opacity-30 animate-ping-slow"></div>
            <div className="absolute bottom-[-120px] right-[-100px] w-96 h-96 bg-indigo-400 rounded-full opacity-20 animate-spin-slow"></div>
            <div className="absolute top-[150px] right-[-80px] w-56 h-56 bg-pink-300 rounded-full opacity-20 animate-bounce-slow"></div>

            {/* Left Side Image */}
            <div
                className="hidden md:flex w-1/2 bg-cover bg-center relative z-10 transition-transform duration-500 hover:scale-105 rounded-l-2xl overflow-hidden"
                style={{ backgroundImage: `url(${iconLogin})` }}
            ></div>

            {/* Right Side Form */}
            <div className="flex-1 flex flex-col justify-center items-center z-10 relative p-10">
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-gray-200 transform transition-transform hover:scale-105 relative">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        Welcome Back
                    </h2>

                    {/* Username */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={formData.username}
                            onChange={(e) =>
                                setFormData({ ...formData, username: e.target.value })
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-300"
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-300"
                        />
                    </div>

                    {/* Forgot password */}
                    {/* <div 
                     onClick={() => navigate("/reset-password")}
                     className="flex justify-end mb-4">
                        <a href="#" className="text-sm text-indigo-600 hover:underline">
                            Forgot password?
                        </a>
                    </div> */}
                    <div
                        onClick={() => navigate("/forgot-password")}
                        className="flex justify-end mb-4 cursor-pointer"
                    >
                        <span className="text-sm text-indigo-600 hover:underline">
                            Forgot password?
                        </span>
                    </div>

                    {/* Login Button */}
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all transform active:scale-95"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </div>

                {/* Optional Footer */}
                <p className="mt-6 text-sm text-gray-500">
                    Don’t have an account?{" "}
                    <a href="#" className="text-indigo-600 hover:underline">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
}
