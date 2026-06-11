import React, { useState, useEffect } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import { getUsers, addUser, updateUser, deleteUser } from "../services/userService";
import { toast } from "react-toastify";
import { Eye, EyeOff, Upload } from "lucide-react"; // <-- install: npm install lucide-react
import { API_BASE_URL } from "../config/apiConfig";
import SmartModal from "../components/ui/SmartModal";
import SmartFormField from "../components/ui/SmartFormField";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);


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
        
        let imageUrl = user.profile_image;
        if (imageUrl && !imageUrl.startsWith("http") && !imageUrl.startsWith("blob:")) {
            const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
            imageUrl = `${baseUrl}${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
        }
        
        setPreviewImage(imageUrl);
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
        { header: "Profile", accessor: "profile_image", cell: row => {
            const img = row.profile_image;
            const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
            return img ? (
                <img 
                    src={img.startsWith("http") ? img : `${baseUrl}${img.startsWith('/') ? img : `/${img}`}`}
                    alt={`${row.full_name}'s profile`} 
                    style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }} 
                />
            ) : (
                <span>No Image</span>
            );
        } },
        { header: "Full Name", accessor: "full_name" },
        { header: "Username", accessor: "username" },
        { header: "Email", accessor: "email" },
        { header: "Role", accessor: "role" },
        { header: "Active", accessor: "is_active", cell: v => v ? "Yes" : "No" },
    ];

    return (
        <div className="p-8 space-y-6">
            

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
            <SmartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUser ? "Edit User" : "Add User"} onSave={handleSave}>
                {/* Image Upload */}
                <div className="flex flex-col items-center mb-4">
                    <label className="cursor-pointer">
                        {previewImage ? (
                            <img src={previewImage} alt="Preview" className="w-24 h-24 rounded-full border" />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center text-slate-400 border border-dashed border-slate-300">
                                <Upload size={30} />
                            </div>
                        )}
                        <input type="file" className="hidden" onChange={handleImageChange} />
                    </label>
                    <small className="text-gray-500 mt-1">Click to upload</small>
                </div>

                {["full_name", "username", "email"].map(field => (
                    <SmartFormField
                        key={field}
                        label={field.replace("_", " ").toUpperCase()}
                        value={formData[field]}
                        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                        required
                    />
                ))}

                <SmartFormField
                    label="ROLE"
                    type="select"
                    options={[
                        { value: 'admin', label: 'Admin' },
                        { value: 'superadmin', label: 'Superadmin' }
                    ]}
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />

                <SmartFormField
                    label="STATUS"
                    type="select"
                    options={[
                        { value: 1, label: 'Active' },
                        { value: 0, label: 'Inactive' }
                    ]}
                    value={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.value })}
                />
            </SmartModal>
        </div>
    );
}
