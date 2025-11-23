import React, { useState, useEffect } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import { getUsers, addUser, updateUser, deleteUser } from "../services/userService";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff, Upload } from "lucide-react"; // <-- install: npm install lucide-react

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        full_name: "",
        username: "",
        email: "",
        password: "",
        role: "admin",
        profile_image: "",
        is_active: 1
    });

    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await getUsers();
            setUsers(res.data.data);
        } catch {
            toast.error("Failed to fetch user data");
        } finally {
            setLoading(false);
        }
    };

    // Handle profile image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, profile_image: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleAdd = () => {
        setEditingUser(null);
        setFormData({
            full_name: "",
            username: "",
            email: "",
            password: "",
            role: "admin",
            profile_image: "",
            is_active: 1
        });
        setPreviewImage(null);
        setIsModalOpen(true);
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            ...user,
            profile_image: null  // Reset so only new upload is sent
        });
        setPreviewImage(user.profile_image);
        setIsModalOpen(true);
    };


    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            await deleteUser(id);
            toast.success("User deleted successfully!");
            fetchUsers();
        } catch {
            toast.error("Failed to delete user");
        }
    };

    const handleSave = async () => {
        if (!formData.full_name || !formData.username || !formData.email) {
            toast.error("Name, Username & Email are required!");
            return;
        }

        try {
            const formattedData = new FormData();
            for (let key in formData) formattedData.append(key, formData[key]);

            if (editingUser) {
                await updateUser(editingUser.id, formattedData);
                toast.success("User updated successfully!");
            } else {
                await addUser(formattedData);
                toast.success("User added successfully!");
            }

            setIsModalOpen(false);
            fetchUsers();
        } catch {
            toast.error("Failed to save user");
        }
    };

    const columns = [
        { header: "ID", accessor: "id" },
        { header: "Profile", accessor: "profile_image", cell: img => img ? <img src={img} className="w-10 h-10 rounded-full" /> : "No Image" },
        { header: "Full Name", accessor: "full_name" },
        { header: "Username", accessor: "username" },
        { header: "Email", accessor: "email" },
        { header: "Role", accessor: "role" },
        { header: "Active", accessor: "is_active", cell: v => v ? "Yes" : "No" },
    ];

    return (
        <div className="p-8 space-y-6">
            <Toaster position="top-center" />

            <SmartDataTable
                title="User Management"
                columns={columns}
                data={users}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showSerial={true}
            />

            {/* Loader */}
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-[460px] max-h-[90vh] overflow-y-auto p-6">

                        <h2 className="text-lg font-bold mb-4">
                            {editingUser ? "Edit User" : "Add User"}
                        </h2>

                        <div className="space-y-4">

                            {/* Image Upload */}
                            <div className="flex flex-col items-center">
                                <label className="cursor-pointer">
                                    {previewImage ? (
                                        <img src={previewImage} alt="Preview" className="w-24 h-24 rounded-full border" />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                                            <Upload size={30} />
                                        </div>
                                    )}
                                    <input type="file" className="hidden" onChange={handleImageChange} />
                                </label>
                                <small className="text-gray-500 mt-1">Click to upload</small>
                            </div>

                            {["full_name", "username", "email", "profile_image"].map(field => (
                                field !== "profile_image" && (
                                    <div key={field}>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            {field.replace("_", " ").toUpperCase()}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData[field]}
                                            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                                            className="w-full border rounded-lg px-3 py-2"
                                        />
                                    </div>
                                )
                            ))}

                            {/* Password with eye toggle */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">PASSWORD</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-2 text-gray-600"
                                    >
                                        {showPassword ? <EyeOff /> : <Eye />}
                                    </button>
                                </div>
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">ROLE</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="superadmin">Superadmin</option>
                                </select>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">STATUS</label>
                                <select
                                    value={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2"
                                >
                                    <option value={1}>Active</option>
                                    <option value={0}>Inactive</option>
                                </select>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end space-x-3 mt-6">
                            <button onClick={() => setIsModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                                Cancel
                            </button>
                            <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded-lg">
                                {editingUser ? "Update" : "Add"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
