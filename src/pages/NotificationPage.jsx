import React, { useEffect, useState } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import {
    getNotifications,
    addNotification,
    updateNotification,
    deleteNotification,
} from "../services/notificationService";
import { toast } from "react-toastify";

export default function NotificationPage() {

    const [notifications, setNotifications] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNotification, setEditingNotification] = useState(null);

    const [formData, setFormData] = useState({
        user_id: "",
        message: "",
        type: "App",
        status: "Unread",
    });

    // Fetch Notifications and Users
    const fetchData = async () => {
        setLoading(true);
        try {
            const [notifRes, userRes] = await Promise.all([
                getNotifications(),
                import("../services/userService").then(m => m.getUsers())
            ]);
            setNotifications(notifRes.data.data);
            setUsers(userRes.data.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Add
    const handleAdd = () => {
        setEditingNotification(null);
        setFormData({
            user_id: "",
            message: "",
            type: "App",
            status: "Unread",
        });
        setIsModalOpen(true);
    };

    // Edit
    const handleEdit = (item) => {
        setEditingNotification(item);
        setFormData({
            user_id: item.user_id,
            message: item.message,
            type: item.type,
            status: item.status,
        });
        setIsModalOpen(true);
    };

    // Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this notification?")) return;

        try {
            await deleteNotification(id);
            toast.success("Notification deleted successfully!");
            fetchData();
        } catch {
            toast.error("Failed to delete notification");
        }
    };

    // Save (Add or Update)
    const handleSave = async () => {
        if (!formData.user_id || !formData.message) {
            toast.error("User and Message are required!");
            return;
        }

        try {
            if (editingNotification) {
                await updateNotification(editingNotification.notification_id, formData);
                toast.success("Notification updated successfully!");
            } else {
                await addNotification(formData);
                toast.success("Notification added successfully!");
            }

            setIsModalOpen(false);
            fetchData();
        } catch {
            toast.error("Failed to save notification");
        }
    };

    const enrichedNotifications = notifications.map(n => {
        // notification.user_id is stored as char/varchar but users.id is int
        const user = users.find(u => String(u.id) === String(n.user_id));
        return {
            ...n,
            userName: user ? user.full_name : n.user_id
        };
    });

    // Table Columns
    const columns = [
        { header: "ID", accessor: "notification_id" },
        { header: "User", accessor: "userName" },
        { header: "Message", accessor: "message" },
        { header: "Type", accessor: "type" },
        { header: "Status", accessor: "status" },
        { header: "Created At", accessor: "created_at" },
    ];

    return (
        <div className="p-8 space-y-6">


            <SmartDataTable
                title="Notification Management"
                columns={columns}
                data={enrichedNotifications}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showSerial={true}
            />

            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
                    <div className="bg-white rounded-xl shadow-lg w-[450px] p-6">

                        <h2 className="text-lg font-bold mb-4">
                            {editingNotification ? "Edit Notification" : "Add Notification"}
                        </h2>

                        <div className="space-y-4">

                            <select
                                value={formData.user_id}
                                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                                className="w-full border px-3 py-2 rounded-lg"
                            >
                                <option value="" disabled>Select User</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.full_name}
                                    </option>
                                ))}
                            </select>

                            <textarea
                                placeholder="Notification Message"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full border px-3 py-2 rounded-lg"
                            />

                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full border px-3 py-2 rounded-lg"
                            >
                                <option value="App">App</option>
                                <option value="SMS">SMS</option>
                                <option value="Email">Email</option>
                            </select>

                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full border px-3 py-2 rounded-lg"
                            >
                                <option value="Unread">Unread</option>
                                <option value="Read">Read</option>
                            </select>

                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                                onClick={handleSave}
                            >
                                {editingNotification ? "Update" : "Add"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
