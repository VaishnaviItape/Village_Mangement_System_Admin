
import React, { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance"; // Make sure path is correct
import toast from "react-hot-toast";

export default function ProfilePage() {
    const [user, setUser] = useState({
        fullName: "",
        email: "",
        phone: "",
        role: "",
        photoUrl: "",
        about: "",
    });
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    // Fetch user data from API
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get("/auth/me");
                const data = response.data;

                setUser({
                    fullName: data.fullName || "",
                    email: data.email || "",
                    phone: data.phoneNumber || "",
                    role: data.roles ? data.roles[0] : "",
                    photoUrl: "", // Set default empty, user can upload
                    about: "", // optional field
                });
                setPreview(""); // If photoUrl exists, can set preview = data.photoUrl
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user data:", error);
                toast.error("Failed to load user data");
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
            setUser((prev) => ({ ...prev, photoUrl: url }));
        }
    };

    if (loading) {
        return <div className="p-6 text-center">Loading...</div>;
    }

    return (
        <div className="p-6 max-w-6xl mx-auto font-bahnschrift">
            <div className="bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
                {/* Top Section */}
                <div className="flex flex-col md:flex-row gap-6 p-6 border-b border-gray-200">
                    {/* Profile Picture */}
                    <div className="relative w-40 h-40 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center group">
                        {preview ? (
                            <img
                                src={preview}
                                alt="User"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <Camera className="w-10 h-10 text-gray-400" />
                        )}
                        {/* Hover overlay */}
                        <label className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity rounded-xl">
                            <Camera className="w-6 h-6 text-white" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 flex flex-col justify-between gap-2">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 font-semibold">{user.fullName}</h3>
                                <p className="text-gray-500 mt-1">Email: {user.email}</p>
                                {user.phone && <p className="text-gray-500 mt-1">Phone: {user.phone}</p>}
                            </div>
                            <div className="flex flex-col sm:items-end gap-1">
                                <span className="bg-gradient-to-r from-blue-500 via-violet-600 to-indigo-700 text-white px-3 py-1 rounded-full font-medium shadow-lg text-sm">
                                    {user.role}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                        <label className="block text-gray-600 font-semibold mb-1">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={user.fullName}
                            onChange={handleChange}
                            placeholder="Full Name"
                            className="pl-3 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-gray-600 font-semibold mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="pl-3 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-gray-600 font-semibold mb-1">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={user.phone}
                            onChange={handleChange}
                            placeholder="Phone"
                            className="pl-3 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    {/* About Field */}
                    <div className="relative col-span-2">
                        <label className="block text-gray-600 font-semibold mb-1">About</label>
                        <textarea
                            name="about"
                            value={user.about}
                            onChange={handleChange}
                            placeholder="About user"
                            className="pl-3 pr-4 py-2 border border-gray-300 rounded-lg w-full h-24 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    <div className="col-span-2 flex justify-between">
                        <button className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95">
                            Save Changes
                        </button>

                        <button
                            onClick={() => navigate("/change-password")}
                            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                            Change Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
