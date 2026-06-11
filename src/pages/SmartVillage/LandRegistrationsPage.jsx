import React, { useEffect, useState } from "react";
import SmartDataTable from "../../components/tables/SmartDataTable";
import SmartModal from "../../components/ui/SmartModal";
import SmartFormField from "../../components/ui/SmartFormField";
import { getLandRegistrations, createLandRegistration, updateLandRegistration, deleteLandRegistration } from "../../services/smartVillageService";
import { toast } from "react-toastify";

export default function LandRegistrationsPage() {
    const [lands, setLands] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLand, setEditingLand] = useState(null);
    const [formData, setFormData] = useState({
        survey_number: "",
        land_area: "",
        crop_type: "",
        status: "Pending"
    });

    const fetchLands = async () => {
        setLoading(true);
        try {
            const res = await getLandRegistrations();
            setLands(res.data.data || []);
        } catch {
            toast.error("Failed to fetch land registrations");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLands();
    }, []);

    const handleAdd = () => {
        setEditingLand(null);
        setFormData({
            survey_number: "",
            land_area: "",
            crop_type: "",
            status: "Pending"
        });
        setIsModalOpen(true);
    };

    const handleEdit = (land) => {
        setEditingLand(land);
        setFormData({
            survey_number: land.survey_number,
            land_area: land.land_area,
            crop_type: land.crop_type,
            status: land.status
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this land registration?")) return;
        try {
            await deleteLandRegistration(id);
            toast.success("Land registration deleted successfully");
            fetchLands();
        } catch {
            toast.error("Failed to delete land registration");
        }
    };

    const handleSave = async () => {
        if (!formData.survey_number || !formData.land_area) {
            return toast.error("Survey number and land area are required");
        }
        try {
            if (editingLand) {
                await updateLandRegistration(editingLand.id, formData);
                toast.success("Land registration updated successfully");
            } else {
                await createLandRegistration(formData);
                toast.success("Land registration added successfully");
            }
            setIsModalOpen(false);
            fetchLands();
        } catch {
            toast.error("Failed to save land registration");
        }
    };

    const columns = [
        { header: "ID", accessor: "id" },
        { header: "User", accessor: "full_name" },
        { header: "Survey Number", accessor: "survey_number" },
        { header: "Land Area", accessor: "land_area" },
        { header: "Crop Type", accessor: "crop_type" },
        { header: "Status", accessor: "status" }
    ];

    return (
        <div className="p-8 space-y-6">


            <SmartDataTable
                title="Land & Crop Registrations"
                columns={columns}
                data={lands}
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
                title={editingLand ? "Edit Land Registration" : "Add Land Registration"}
                onSave={handleSave}
            >
                <div className="space-y-6">

                    {/* Header */}
                    <div className="pb-3 border-b border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-800">
                            Land Information
                        </h3>
                        <p className="text-sm text-slate-500">
                            Enter land survey details and agricultural information.
                        </p>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <SmartFormField
                            label="Survey Number"
                            placeholder="Enter Survey Number"
                            value={formData.survey_number}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    survey_number: e.target.value
                                })
                            }
                            required
                        />

                        <SmartFormField
                            label="Land Area"
                            placeholder="e.g. 5 Acres"
                            value={formData.land_area}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    land_area: e.target.value
                                })
                            }
                            required
                        />

                        <SmartFormField
                            label="Crop Type"
                            placeholder="e.g. Sugarcane, Wheat, Rice"
                            value={formData.crop_type}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    crop_type: e.target.value
                                })
                            }
                        />

                        {editingLand && (
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

                    {/* Information Card */}
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                        <h4 className="text-sm font-semibold text-emerald-800 mb-2">
                            Land Registration Details
                        </h4>
                        <p className="text-sm text-emerald-700">
                            Record survey numbers, land area, and crop information for
                            accurate land management and agricultural planning within the village.
                        </p>
                    </div>

                </div>
            </SmartModal>
        </div>
    );
}
