import React, { useEffect, useState } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import {
    getCitizens,
    addCitizen,
    updateCitizen,
    deleteCitizen,
} from "../services/citizenService";
import { getVillages } from "../services/villageService";
import toast, { Toaster } from "react-hot-toast";

/**
 * Very small reusable Field component so we don't get "Field is not defined".
 * Keeps label + input markup consistent.
 */
const Field = ({ label, children, className = "" }) => (
    <div className={className}>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
        {children}
    </div>
);

export default function CitizenPage() {
    const [citizens, setCitizens] = useState([]);
    const [villages, setVillages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCitizen, setEditingCitizen] = useState(null);

    // using snake_case fields because your backend expects them
    const [formData, setFormData] = useState({
        full_name: "",
        father_name: "",
        email: "",
        mobile: "",
        password: "",
        role: "",
        address: "",
        dob: "",
        gender: "",
        aadhaar_no: "",
        VillageID: "",
    });

    const fetchCitizens = async () => {
        setLoading(true);
        try {
            const res = await getCitizens();
            // defensive: ensure array
            setCitizens((res && res.data && res.data.data) || []);
        } catch {
            toast.error("Failed to fetch citizens");
        } finally {
            setLoading(false);
        }
    };

    const fetchVillages = async () => {
        try {
            const res = await getVillages();
            setVillages((res && res.data && res.data.data) || []);
        } catch {
            toast.error("Failed to load villages");
        }
    };

    useEffect(() => {
        fetchCitizens();
        fetchVillages();
    }, []);

    const handleAdd = () => {
        setEditingCitizen(null);
        setFormData({
            full_name: "",
            father_name: "",
            email: "",
            mobile: "",
            password: "",
            role: "",
            address: "",
            dob: "",
            gender: "",
            aadhaar_no: "",
            VillageID: "",
        });
        setIsModalOpen(true);
    };

    const handleEdit = (citizen) => {
        setEditingCitizen(citizen || null);
        setFormData({
            full_name: citizen?.full_name || "",
            father_name: citizen?.father_name || "",
            email: citizen?.email || "",
            mobile: citizen?.mobile || "",
            password: "", // don't prefill password
            role: citizen?.role || "",
            address: citizen?.address || "",
            dob: citizen?.dob || "",
            gender: citizen?.gender || "",
            aadhaar_no: citizen?.aadhaar_no || "",
            VillageID: citizen?.VillageID || "",
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this citizen?")) return;

        try {
            await deleteCitizen(id);
            toast.success("Citizen deleted successfully");
            fetchCitizens();
        } catch {
            toast.error("Failed to delete citizen");
        }
    };

    const handleSave = async () => {
        if (!formData.full_name || !formData.aadhaar_no) {
            toast.error("Full Name & Aadhaar No are required");
            return;
        }
        if (!formData.VillageID) {
            toast.error("Please select a village");
            return;
        }

        try {
            if (editingCitizen) {
                await updateCitizen(editingCitizen.id, formData);
                toast.success("Citizen updated");
            } else {
                await addCitizen(formData);
                toast.success("Citizen added");
            }
            setIsModalOpen(false);
            fetchCitizens();
        } catch {
            toast.error("Failed to save citizen");
        }
    };

    // If your SmartDataTable expects a flat field for village name, we can add one:
    const displayedCitizens = citizens.map((c) => {
        const village = villages.find((v) => v.id === c.VillageID);
        return {
            ...c,
            villageName: village ? village.name : "", // used in columns below
        };
    });

    const columns = [
        { header: "ID", accessor: "id" },
        { header: "Full Name", accessor: "full_name" },
        { header: "Father Name", accessor: "father_name" },
        { header: "Email", accessor: "email" },
        { header: "Mobile", accessor: "mobile" },
        { header: "Gender", accessor: "gender" },
        { header: "Aadhaar", accessor: "aadhaar_no" },
        { header: "Village", accessor: "villageName" }, // using our computed villageName
    ];

    return (
        <div className="p-8 space-y-6">
            <Toaster position="top-center" />

            <SmartDataTable
                title="Citizen Management"
                columns={columns}
                data={displayedCitizens}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showSerial={true}
            />

            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
                    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full border border-slate-100 max-w-2xl max-h-[90vh] overflow-hidden">
                        {/* HEADER */}
                        <div className="flex justify-between items-center border-b border-slate-200 px-6 py-4 bg-slate-50 rounded-t-2xl">
                            <h2 className="text-xl font-semibold">
                                {editingCitizen ? "Edit Citizen" : "Add Citizen"}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-600 hover:text-black text-2xl"
                                aria-label="Close"
                            >
                                &times;
                            </button>
                        </div>

                        {/* SCROLLABLE FORM */}
                        <div className="p-6 overflow-y-auto max-h-[70vh]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* FULL NAME */}
                                <Field label="Full Name">
                                    <input
                                        type="text"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                    />
                                </Field>

                                {/* FATHER NAME */}
                                <Field label="Father Name">
                                    <input
                                        type="text"
                                        value={formData.father_name}
                                        onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                    />
                                </Field>

                                {/* EMAIL */}
                                <Field label="Email">
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                    />
                                </Field>

                                {/* MOBILE */}
                                <Field label="Mobile">
                                    <input
                                        type="tel"
                                        value={formData.mobile}
                                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                    />
                                </Field>

                                {/* PASSWORD */}
                                <Field label="Password">
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                    />
                                </Field>

                                {/* ROLE DROPDOWN */}
                                <Field label="Role">
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                    >
                                        <option value="">Select Role</option>
                                        <option value="SuperAdmin">SuperAdmin</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </Field>

                                {/* GENDER DROPDOWN */}
                                <Field label="Gender">
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </Field>

                                {/* DOB */}
                                <Field label="Date of Birth">
                                    <input
                                        type="date"
                                        value={formData.dob}
                                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                    />
                                </Field>

                                {/* AADHAAR */}
                                <Field label="Aadhaar No">
                                    <input
                                        type="text"
                                        value={formData.aadhaar_no}
                                        onChange={(e) => setFormData({ ...formData, aadhaar_no: e.target.value })}
                                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                    />
                                </Field>

                                {/* ADDRESS (full width) */}
                                <div className="md:col-span-2">
                                    <Field label="Address">
                                        <input
                                            type="text"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                        />
                                    </Field>
                                </div>

                                {/* VILLAGE DROPDOWN (full width) */}
                                <div className="md:col-span-2">
                                    <Field label="Village">
                                        <select
                                            value={formData.VillageID}
                                            onChange={(e) => setFormData({ ...formData, VillageID: e.target.value })}
                                            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                                        >
                                            <option value="">Select Village</option>
                                            {villages && villages.length > 0 ? (
                                                villages.map((v) => (
                                                    <option key={v.VillageID} value={v.VillageID}>
                                                        {/* Ensure village name display isn't cut off */}
                                                        {v.VillageName}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="" disabled>
                                                    Loading villages...
                                                </option>
                                            )}
                                        </select>
                                    </Field>
                                </div>
                            </div>
                        </div>

                        {/* FOOTER */}
                        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
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
                                {editingCitizen ? "Update" : "Add"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
