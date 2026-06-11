import React, { useEffect, useState } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import SmartModal from "../components/ui/SmartModal";
import SmartFormField from "../components/ui/SmartFormField";
import { getCivicRegistrations, createCivicRegistration, updateCivicRegistration, deleteCivicRegistration } from "../services/civicService";
import { toast } from "react-toastify";

export default function CivicRegistrationsPage() {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRegistration, setEditingRegistration] = useState(null);
    const [formData, setFormData] = useState({
        type: "Birth",
        applicant_name: "",
        event_date: "",
        location: "",
        status: "Pending"
    });

    const fetchRegistrations = async () => {
        setLoading(true);
        try {
            const res = await getCivicRegistrations();
            setRegistrations(res.data.data || []);
        } catch {
            toast.error("Failed to fetch civic registrations");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const handleAdd = () => {
        setEditingRegistration(null);
        setFormData({
            type: "Birth",
            applicant_name: "",
            event_date: "",
            location: "",
            status: "Pending"
        });
        setIsModalOpen(true);
    };

    const handleEdit = (registration) => {
        setEditingRegistration(registration);
        setFormData({
            type: registration.type,
            applicant_name: registration.applicant_name,
            // Extract YYYY-MM-DD from ISO date
            event_date: registration.event_date ? new Date(registration.event_date).toISOString().split('T')[0] : "",
            location: registration.location,
            status: registration.status
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this registration?")) return;
        try {
            await deleteCivicRegistration(id);
            toast.success("Registration deleted successfully");
            fetchRegistrations();
        } catch {
            toast.error("Failed to delete registration");
        }
    };

    const handleSave = async () => {
        if (!formData.applicant_name || !formData.event_date || !formData.location) {
            return toast.error("Please fill all required fields");
        }
        try {
            if (editingRegistration) {
                await updateCivicRegistration(editingRegistration.id, formData);
                toast.success("Registration updated successfully");
            } else {
                await createCivicRegistration(formData);
                toast.success("Registration added successfully");
            }
            setIsModalOpen(false);
            fetchRegistrations();
        } catch {
            toast.error("Failed to save registration");
        }
    };

    const columns = [
        { header: "ID", accessor: "id" },
        { header: "User", accessor: "user_name" },
        { header: "Type", accessor: "type" },
        { header: "Applicant Name", accessor: "applicant_name" },
        { header: "Event Date", cell: (row) => new Date(row.event_date).toLocaleDateString() },
        { header: "Status", accessor: "status" }
    ];

    return (
        <div className="p-8 space-y-6">


            <SmartDataTable
                title="Civic Registrations Management"
                columns={columns}
                data={registrations}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showSerial={true}
            />

            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            <SmartModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingRegistration ? "Edit Registration" : "Add Registration"}
                onSave={handleSave}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <SmartFormField
                        label="Registration Type"
                        type="select"
                        options={[
                            { value: "", label: "Select Type" },
                            { value: "Birth", label: "Birth" },
                            { value: "Death", label: "Death" },
                            { value: "Marriage", label: "Marriage" }
                        ]}
                        value={formData.type}
                        onChange={(e) =>
                            setFormData({ ...formData, type: e.target.value })
                        }
                        required
                    />

                    <SmartFormField
                        label="Event Date"
                        type="date"
                        value={formData.event_date}
                        onChange={(e) =>
                            setFormData({ ...formData, event_date: e.target.value })
                        }
                        required
                    />

                    <div className="md:col-span-2">
                        <SmartFormField
                            label="Applicant Name"
                            value={formData.applicant_name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    applicant_name: e.target.value
                                })
                            }
                            required
                            fullWidth
                        />
                    </div>

                    <div className="md:col-span-2">
                        <SmartFormField
                            label="Event Location"
                            value={formData.location}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    location: e.target.value
                                })
                            }
                            required
                            fullWidth
                        />
                    </div>

                    {editingRegistration && (
                        <div className="md:col-span-2">
                            <SmartFormField
                                label="Application Status"
                                type="select"
                                options={[
                                    { value: "Pending", label: "Pending" },
                                    { value: "Approved", label: "Approved" },
                                    { value: "Rejected", label: "Rejected" }
                                ]}
                                value={formData.status}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        status: e.target.value
                                    })
                                }
                                fullWidth
                            />
                        </div>
                    )}

                </div>
            </SmartModal>
        </div>
    );
}
