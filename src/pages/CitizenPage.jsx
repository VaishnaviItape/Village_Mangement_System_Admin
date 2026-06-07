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

import SmartModal from "../components/ui/SmartModal";
import SmartFormField from "../components/ui/SmartFormField";

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
            <SmartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCitizen ? "Edit Citizen" : "Add Citizen"} onSave={handleSave}>
                <SmartFormField
                    label="Full Name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                />

                <SmartFormField
                    label="Father Name"
                    value={formData.father_name}
                    onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                />

                <SmartFormField
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />

                <SmartFormField
                    label="Mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                />

                <SmartFormField
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />

                <SmartFormField
                    label="Role"
                    type="select"
                    options={[{value: '', label: 'Select Role'}, 'SuperAdmin', 'Admin']}
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />

                <SmartFormField
                    label="Gender"
                    type="select"
                    options={[{value: '', label: 'Select Gender'}, 'Male', 'Female', 'Other']}
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                />

                <SmartFormField
                    label="Date of Birth"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                />

                <SmartFormField
                    label="Aadhaar No"
                    value={formData.aadhaar_no}
                    onChange={(e) => setFormData({ ...formData, aadhaar_no: e.target.value })}
                    required
                />

                <div className="md:col-span-2">
                    <SmartFormField
                        label="Address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        fullWidth
                    />
                </div>

                <div className="md:col-span-2">
                    <SmartFormField
                        label="Village"
                        type="select"
                        options={[
                            { value: "", label: "Select Village" },
                            ...villages.map(v => ({ value: v.VillageID, label: v.VillageName }))
                        ]}
                        value={formData.VillageID}
                        onChange={(e) => setFormData({ ...formData, VillageID: e.target.value })}
                        required
                        fullWidth
                    />
                </div>
            </SmartModal>
        </div>
    );
}
