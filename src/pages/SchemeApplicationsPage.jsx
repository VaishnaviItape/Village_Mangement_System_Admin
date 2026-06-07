import React, { useEffect, useState } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import { 
    getSchemeApplications, 
    addSchemeApplication, 
    updateSchemeApplication, 
    deleteSchemeApplication 
} from "../services/schemeApplicationService";
import { getCitizens } from "../services/citizenService";
import { getSchemes } from "../services/schemeService";
import toast, { Toaster } from "react-hot-toast";
import SmartModal from "../components/ui/SmartModal";
import SmartFormField from "../components/ui/SmartFormField";

export default function SchemeApplicationsPage() {
    const [applications, setApplications] = useState([]);
    const [citizens, setCitizens] = useState([]);
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingApp, setEditingApp] = useState(null);
    const [formData, setFormData] = useState({
        user_id: "",
        scheme_id: "",
        status: "Pending",
        eligibility_score: "",
        submitted_at: "",
        approved_at: ""
    });

    useEffect(() => {
        fetchApplications();
        fetchCitizensAndSchemes();
    }, []);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const res = await getSchemeApplications();
            setApplications(res.data || []);
        } catch {
            toast.error("Failed to load scheme applications");
        } finally {
            setLoading(false);
        }
    };

    const fetchCitizensAndSchemes = async () => {
        try {
            const [citizenRes, schemeRes] = await Promise.all([
                getCitizens(),
                getSchemes()
            ]);
            setCitizens(citizenRes?.data?.data || []);
            setSchemes(schemeRes?.data || []);
        } catch (error) {
            console.error("Failed to fetch relational data", error);
        }
    };

    const handleAdd = () => {
        setEditingApp(null);
        setFormData({
            user_id: "",
            scheme_id: "",
            status: "Pending",
            eligibility_score: "",
            submitted_at: new Date().toISOString().split("T")[0],
            approved_at: ""
        });
        setIsModalOpen(true);
    };

    const handleEdit = (app) => {
        setEditingApp(app);
        setFormData({
            user_id: app.user_id || "",
            scheme_id: app.scheme_id || "",
            status: app.status || "Pending",
            eligibility_score: app.eligibility_score || "",
            submitted_at: app.submitted_at ? app.submitted_at.split("T")[0] : "",
            approved_at: app.approved_at ? app.approved_at.split("T")[0] : ""
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this application?")) return;
        try {
            await deleteSchemeApplication(id);
            toast.success("Application deleted successfully!");
            fetchApplications();
        } catch {
            toast.error("Failed to delete application");
        }
    };

    const handleSave = async () => {
        if (!formData.user_id || !formData.scheme_id) {
            return toast.error("User and Scheme are required!");
        }

        try {
            const payload = {
                ...formData,
                eligibility_score: formData.eligibility_score ? Number(formData.eligibility_score) : 0
            };

            if (editingApp) {
                await updateSchemeApplication(editingApp.scheme_application_id, payload);
                toast.success("Application updated successfully!");
            } else {
                await addSchemeApplication(payload);
                toast.success("Application added successfully!");
            }

            setIsModalOpen(false);
            fetchApplications();
        } catch {
            toast.error("Failed to save application");
        }
    };

    const displayApplications = applications.map(app => {
        const citizen = citizens.find(c => c.id === app.user_id);
        const scheme = schemes.find(s => s.scheme_id === app.scheme_id);
        return {
            ...app,
            citizenName: citizen ? citizen.full_name : app.user_id,
            schemeName: scheme ? scheme.scheme_name : app.scheme_id
        };
    });

    const columns = [
        { header: "ID", accessor: "scheme_application_id" },
        { header: "Citizen", accessor: "citizenName" },
        { header: "Scheme", accessor: "schemeName" },
        { header: "Status", accessor: "status" },
        { header: "Eligibility Score", accessor: "eligibility_score" },
        { header: "Submitted At", accessor: "submitted_at" },
    ];

    return (
        <div className="p-8 space-y-6">
            <Toaster position="top-center" />

            <SmartDataTable
                title="Scheme Applications"
                columns={columns}
                data={displayApplications}
                showSerial={true}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white/60 z-50">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* Modal */}
            <SmartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingApp ? "Edit Application" : "Add Application"} onSave={handleSave}>
                <div className="space-y-4">
                    <SmartFormField
                        label="Select Citizen"
                        type="select"
                        options={[
                            { value: "", label: "Select Citizen" },
                            ...citizens.map(c => ({ value: c.id, label: c.full_name }))
                        ]}
                        value={formData.user_id}
                        onChange={(e) => setFormData({ ...formData, user_id: parseInt(e.target.value) || e.target.value })}
                        required
                    />

                    <SmartFormField
                        label="Select Scheme"
                        type="select"
                        options={[
                            { value: "", label: "Select Scheme" },
                            ...schemes.map(s => ({ value: s.scheme_id, label: s.scheme_name }))
                        ]}
                        value={formData.scheme_id}
                        onChange={(e) => setFormData({ ...formData, scheme_id: parseInt(e.target.value) || e.target.value })}
                        required
                    />

                    <SmartFormField
                        label="Status"
                        type="select"
                        options={["Pending", "Approved", "Rejected"]}
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    />

                    <SmartFormField
                        label="Eligibility Score"
                        type="number"
                        value={formData.eligibility_score}
                        onChange={(e) => setFormData({ ...formData, eligibility_score: e.target.value })}
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <SmartFormField
                            label="Submitted At"
                            type="date"
                            value={formData.submitted_at}
                            onChange={(e) => setFormData({ ...formData, submitted_at: e.target.value })}
                        />
                        <SmartFormField
                            label="Approved At"
                            type="date"
                            value={formData.approved_at}
                            onChange={(e) => setFormData({ ...formData, approved_at: e.target.value })}
                        />
                    </div>
                </div>
            </SmartModal>
        </div>
    );
}
