import React, { useEffect, useState } from "react";
import SmartDataTable from "../../components/tables/SmartDataTable";
import SmartModal from "../../components/ui/SmartModal";
import SmartFormField from "../../components/ui/SmartFormField";
import { getVendors, createVendor, updateVendor, deleteVendor } from "../../services/smartVillageService";
import { toast } from "react-toastify";

export default function VendorManagementPage() {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVendor, setEditingVendor] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        contact: "",
        service_type: ""
    });

    const fetchVendors = async () => {
        setLoading(true);
        try {
            const res = await getVendors();
            setVendors(res.data.data || []);
        } catch {
            toast.error("Failed to fetch vendors");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const handleAdd = () => {
        setEditingVendor(null);
        setFormData({
            name: "",
            contact: "",
            service_type: ""
        });
        setIsModalOpen(true);
    };

    const handleEdit = (vendor) => {
        setEditingVendor(vendor);
        setFormData({
            name: vendor.name,
            contact: vendor.contact,
            service_type: vendor.service_type
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this vendor?")) return;
        try {
            await deleteVendor(id);
            toast.success("Vendor deleted successfully");
            fetchVendors();
        } catch {
            toast.error("Failed to delete vendor");
        }
    };

    const handleSave = async () => {
        if (!formData.name || !formData.contact || !formData.service_type) {
            return toast.error("All fields are required");
        }
        try {
            if (editingVendor) {
                await updateVendor(editingVendor.id, formData);
                toast.success("Vendor updated successfully");
            } else {
                await createVendor(formData);
                toast.success("Vendor added successfully");
            }
            setIsModalOpen(false);
            fetchVendors();
        } catch {
            toast.error("Failed to save vendor");
        }
    };

    const columns = [
        { header: "ID", accessor: "id" },
        { header: "Vendor Name", accessor: "name", cell: (row) => <span className="font-bold">{row.name}</span> },
        { header: "Contact Info", accessor: "contact" },
        { header: "Service Type", accessor: "service_type" }
    ];

    return (
        <div className="p-8 space-y-6">


            <SmartDataTable
                title="Vendor & Contractor Management"
                columns={columns}
                data={vendors}
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
                title={editingVendor ? "Edit Vendor" : "Add Vendor"}
                onSave={handleSave}
            >
                <div className="space-y-6">

                    {/* Header Section */}
                    <div className="pb-3 border-b border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-800">
                            Vendor Details
                        </h3>
                        <p className="text-sm text-slate-500">
                            Enter vendor information and service details.
                        </p>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <SmartFormField
                            label="Vendor Name"
                            placeholder="Enter Vendor Name"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value
                                })
                            }
                            required
                        />

                        <SmartFormField
                            label="Contact Information"
                            placeholder="Phone Number / Email"
                            value={formData.contact}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    contact: e.target.value
                                })
                            }
                            required
                        />

                        <div className="md:col-span-2">
                            <SmartFormField
                                label="Service Type"
                                placeholder="Construction, Electrical, Water Supply, Cleaning, etc."
                                value={formData.service_type}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        service_type: e.target.value
                                    })
                                }
                                required
                            />
                        </div>

                    </div>

                    {/* Info Card */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <h4 className="text-sm font-semibold text-slate-700 mb-2">
                            Vendor Information
                        </h4>
                        <p className="text-sm text-slate-500">
                            Vendors can provide services such as construction,
                            electrical work, water supply maintenance, sanitation,
                            equipment rental, and other Panchayat-related services.
                        </p>
                    </div>

                </div>
            </SmartModal>
        </div>
    );
}
