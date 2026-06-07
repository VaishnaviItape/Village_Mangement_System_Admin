import React, { useEffect, useState } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import {
    getPanchayatMembers,
    createPanchayatMember,
    updatePanchayatMember,
    deletePanchayatMember,
} from "../services/panchayatMembersService";
import toast, { Toaster } from "react-hot-toast";
import SmartModal from "../components/ui/SmartModal";
import SmartFormField from "../components/ui/SmartFormField";

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

            <SmartModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingMember ? "Edit Member" : "Add Member"}
                onSave={handleSave}
            >
                <SmartFormField 
                    label="Name" 
                    value={formData.member_name} 
                    onChange={(e) => setFormData({ ...formData, member_name: e.target.value })} 
                    placeholder="Enter Name"
                    required 
                />
                
                <SmartFormField 
                    label="Role (e.g. Sarpanch, Ward Member)" 
                    value={formData.role} 
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })} 
                    placeholder="Enter Role"
                    required 
                />

                <SmartFormField 
                    label="Term Start Date" 
                    type="date"
                    value={formData.term_start_date} 
                    onChange={(e) => setFormData({ ...formData, term_start_date: e.target.value })} 
                />

                <SmartFormField 
                    label="Term End Date" 
                    type="date"
                    value={formData.term_end_date} 
                    onChange={(e) => setFormData({ ...formData, term_end_date: e.target.value })} 
                />
                
                <SmartFormField 
                    label="Contact Info" 
                    value={formData.contact_info} 
                    onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })} 
                    placeholder="Enter Contact Details"
                    fullWidth
                />
            </SmartModal>
        </div>
    );
}
