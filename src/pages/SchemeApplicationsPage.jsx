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

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-[500px] p-6 shadow-lg">
                        <h2 className="text-lg font-bold mb-4">
                            {editingApp ? "Edit Application" : "Add Application"}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Select Citizen</label>
                                <select
                                    value={formData.user_id}
                                    onChange={(e) => setFormData({ ...formData, user_id: parseInt(e.target.value) || e.target.value })}
                                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                >
                                    <option value="">Select Citizen</option>
                                    {citizens.map(c => (
                                        <option key={c.id} value={c.id}>{c.full_name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Select Scheme</label>
                                <select
                                    value={formData.scheme_id}
                                    onChange={(e) => setFormData({ ...formData, scheme_id: parseInt(e.target.value) || e.target.value })}
                                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                >
                                    <option value="">Select Scheme</option>
                                    {schemes.map(s => (
                                        <option key={s.scheme_id} value={s.scheme_id}>{s.scheme_name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Eligibility Score</label>
                                <input
                                    type="number"
                                    value={formData.eligibility_score}
                                    onChange={(e) => setFormData({ ...formData, eligibility_score: e.target.value })}
                                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Submitted At</label>
                                    <input
                                        type="date"
                                        value={formData.submitted_at}
                                        onChange={(e) => setFormData({ ...formData, submitted_at: e.target.value })}
                                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Approved At</label>
                                    <input
                                        type="date"
                                        value={formData.approved_at}
                                        onChange={(e) => setFormData({ ...formData, approved_at: e.target.value })}
                                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setIsModalOpen(false)} className="bg-stone-500 hover:bg-stone-600 text-white px-4 py-2 rounded-lg shadow-sm transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors">
                                {editingApp ? "Update" : "Add"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
