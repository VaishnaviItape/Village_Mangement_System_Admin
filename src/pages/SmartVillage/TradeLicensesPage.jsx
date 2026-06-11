import React, { useEffect, useState } from "react";
import SmartDataTable from "../../components/tables/SmartDataTable";
import SmartModal from "../../components/ui/SmartModal";
import SmartFormField from "../../components/ui/SmartFormField";
import { getTradeLicenses, createTradeLicense, updateTradeLicense, deleteTradeLicense } from "../../services/smartVillageService";
import { toast } from "react-toastify";

export default function TradeLicensesPage() {
    const [licenses, setLicenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLicense, setEditingLicense] = useState(null);
    const [formData, setFormData] = useState({
        business_name: "",
        business_type: "",
        registration_no: "",
        status: "Pending"
    });

    const fetchLicenses = async () => {
        setLoading(true);
        try {
            const res = await getTradeLicenses();
            setLicenses(res.data.data || []);
        } catch {
            toast.error("Failed to fetch trade licenses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLicenses();
    }, []);

    const handleAdd = () => {
        setEditingLicense(null);
        setFormData({
            business_name: "",
            business_type: "",
            registration_no: "",
            status: "Pending"
        });
        setIsModalOpen(true);
    };

    const handleEdit = (license) => {
        setEditingLicense(license);
        setFormData({
            business_name: license.business_name,
            business_type: license.business_type,
            registration_no: license.registration_no,
            status: license.status
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this trade license?")) return;
        try {
            await deleteTradeLicense(id);
            toast.success("Trade license deleted successfully");
            fetchLicenses();
        } catch {
            toast.error("Failed to delete trade license");
        }
    };

    const handleSave = async () => {
        if (!formData.business_name || !formData.business_type) {
            return toast.error("Business name and type are required");
        }
        try {
            if (editingLicense) {
                await updateTradeLicense(editingLicense.id, formData);
                toast.success("Trade license updated successfully");
            } else {
                await createTradeLicense(formData);
                toast.success("Trade license added successfully");
            }
            setIsModalOpen(false);
            fetchLicenses();
        } catch {
            toast.error("Failed to save trade license");
        }
    };

    const columns = [
        { header: "ID", accessor: "id" },
        { header: "Applicant Name", accessor: "full_name" },
        { header: "Business Name", accessor: "business_name" },
        { header: "Business Type", accessor: "business_type" },
        { header: "Registration No", accessor: "registration_no" },
        { header: "Status", accessor: "status" }
    ];

    return (
        <div className="p-8 space-y-6">


            <SmartDataTable
                title="Trade Licenses Management"
                columns={columns}
                data={licenses}
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
                title={editingLicense ? "Edit Trade License" : "Add Trade License"}
                onSave={handleSave}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <SmartFormField
                        label="Business Name"
                        placeholder="Enter Business Name"
                        value={formData.business_name}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                business_name: e.target.value
                            })
                        }
                        required
                    />

                    <SmartFormField
                        label="Business Type"
                        placeholder="Enter Business Type"
                        value={formData.business_type}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                business_type: e.target.value
                            })
                        }
                        required
                    />

                    <SmartFormField
                        label="Registration Number"
                        placeholder="Enter Registration Number"
                        value={formData.registration_no}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                registration_no: e.target.value
                            })
                        }
                    />

                    {editingLicense && (
                        <SmartFormField
                            label="Status"
                            type="select"
                            options={[
                                "Pending",
                                "Approved",
                                "Rejected"
                            ]}
                            value={formData.status}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    status: e.target.value
                                })
                            }
                        />
                    )}
                </div>

                {/* Business Information Card */}
                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">
                        Trade License Information
                    </h4>
                    <p className="text-sm text-slate-500">
                        Enter the business details and registration information.
                        Once approved, the trade license will become active for the business.
                    </p>
                </div>
            </SmartModal>
        </div>
    );
}
