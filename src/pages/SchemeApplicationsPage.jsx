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
import { toast } from "react-toastify";
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
        approved_at: "",
        documents: null
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
        let docs = null;
        try {
            if (app.documents) {
                docs = typeof app.documents === 'string' ? JSON.parse(app.documents) : app.documents;
            }
        } catch (e) {
            console.error("Error parsing documents", e);
        }

        setFormData({
            user_id: app.user_id || "",
            scheme_id: app.scheme_id || "",
            status: app.status || "Pending",
            eligibility_score: app.eligibility_score || "",
            submitted_at: app.submitted_at ? app.submitted_at.split("T")[0] : "",
            approved_at: app.approved_at ? app.approved_at.split("T")[0] : "",
            documents: docs
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
            

            <SmartDataTable
                title="Scheme Applications"
                columns={columns}
                data={displayApplications}
                showSerial={true}
                showAddButton={false}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white/60 z-50">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* Modal */}
            <SmartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingApp ? "Review Application" : "Add Application"} onSave={handleSave}>
                <div className="space-y-4">
                    {editingApp && (
                        <div className="bg-blue-50 p-4 rounded-lg mb-4">
                            <h3 className="font-semibold text-blue-800 mb-2">Review Mode</h3>
                            <p className="text-sm text-blue-600">Please review the applicant's details and documents before approving.</p>
                        </div>
                    )}
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
                    
                    {formData.documents && (
                        <div className="mt-4 border-t pt-4">
                            <h4 className="font-medium text-gray-800 mb-3">Submitted Documents</h4>
                            <div className="space-y-2">
                                {Object.entries(formData.documents).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        <span className="capitalize text-sm font-medium text-gray-700">{key}</span>
                                        <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center gap-1" onClick={(e) => { e.preventDefault(); alert(`Viewing ${value}`); }}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                            View Document
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {editingApp && (
                        <div className="flex gap-3 pt-4 border-t mt-4">
                            <button onClick={() => setFormData({...formData, status: 'Approved', approved_at: new Date().toISOString().split("T")[0]})} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors">
                                Approve Application
                            </button>
                            <button onClick={() => setFormData({...formData, status: 'Rejected'})} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-colors">
                                Reject Application
                            </button>
                        </div>
                    )}
                </div>
            </SmartModal>
        </div>
    );
}
