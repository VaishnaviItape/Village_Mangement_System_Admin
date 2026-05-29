import React, { useEffect, useState } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import {
    getPanchayatMembers,
    createPanchayatMember,
    updatePanchayatMember,
    deletePanchayatMember,
} from "../services/panchayatMembersService";
import toast, { Toaster } from "react-hot-toast";

export default function PanchayatMembersPage() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);

    const [formData, setFormData] = useState({
        member_name: "",
        role: "",
        term_start_date: "",
        term_end_date: "",
        contact_info: "",
    });

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const res = await getPanchayatMembers();
            // Assuming the backend sends { data: [...] }
            setMembers(res.data.data || res.data);
        } catch {
            toast.error("Failed to fetch panchayat members");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const handleAdd = () => {
        setEditingMember(null);
        setFormData({
            member_name: "",
            role: "",
            term_start_date: "",
            term_end_date: "",
            contact_info: "",
        });
        setIsModalOpen(true);
    };

    const handleEdit = (item) => {
        setEditingMember(item);
        setFormData({
            member_name: item.member_name || "",
            role: item.role || "",
            term_start_date: item.term_start_date ? item.term_start_date.split("T")[0] : "",
            term_end_date: item.term_end_date ? item.term_end_date.split("T")[0] : "",
            contact_info: item.contact_info || "",
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this member?")) return;

        try {
            await deletePanchayatMember(id);
            toast.success("Member deleted successfully!");
            fetchMembers();
        } catch {
            toast.error("Failed to delete member");
        }
    };

    const handleSave = async () => {
        if (!formData.member_name || !formData.role) {
            toast.error("Member Name and Role are required!");
            return;
        }

        try {
            if (editingMember) {
                await updatePanchayatMember(editingMember.member_id, formData);
                toast.success("Member updated successfully!");
            } else {
                await createPanchayatMember(formData);
                toast.success("Member added successfully!");
            }
            setIsModalOpen(false);
            fetchMembers();
        } catch {
            toast.error("Failed to save member");
        }
    };

    const columns = [
        { header: "ID", accessor: "member_id" },
        { header: "Name", accessor: "member_name" },
        { header: "Role", accessor: "role" },
        { header: "Start Date", accessor: (row) => row.term_start_date ? row.term_start_date.split("T")[0] : "-" },
        { header: "End Date", accessor: (row) => row.term_end_date ? row.term_end_date.split("T")[0] : "-" },
        { header: "Contact", accessor: "contact_info" },
    ];

    return (
        <div className="p-8 space-y-6">
            <Toaster position="top-center" />

            <SmartDataTable
                title="Panchayat Members Management"
                columns={columns}
                data={members}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={(item) => handleDelete(item.member_id)}
                showSerial={true}
            />

            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
                    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-[450px] p-6">
                        <h2 className="text-lg font-bold mb-4">
                            {editingMember ? "Edit Member" : "Add Member"}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Name
                                </label>
                                <input
                                    placeholder="Enter Name"
                                    type="text"
                                    value={formData.member_name}
                                    onChange={(e) => setFormData({ ...formData, member_name: e.target.value })}
                                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Role (e.g. Sarpanch, Ward Member)
                                </label>
                                <input
                                    placeholder="Enter Role"
                                    type="text"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        Term Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.term_start_date}
                                        onChange={(e) => setFormData({ ...formData, term_start_date: e.target.value })}
                                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        Term End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.term_end_date}
                                        onChange={(e) => setFormData({ ...formData, term_end_date: e.target.value })}
                                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Contact Info
                                </label>
                                <input
                                    placeholder="Enter Contact Details"
                                    type="text"
                                    value={formData.contact_info}
                                    onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
                                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-stone-500 hover:bg-stone-600 text-white px-4 py-2 rounded-lg shadow-sm transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors"
                            >
                                {editingMember ? "Update" : "Add"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
