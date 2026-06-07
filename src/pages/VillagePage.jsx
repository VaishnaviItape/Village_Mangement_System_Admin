import React, { useEffect, useState } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import {
    getVillages,
    addVillage,
    updateVillage,
    deleteVillage,
    getStates,
    getDistricts
} from "../services/villageService";
import toast, { Toaster } from "react-hot-toast";
import SmartModal from "../components/ui/SmartModal";
import SmartFormField from "../components/ui/SmartFormField";

export default function VillagePage() {
    const [villages, setVillages] = useState([]);
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVillage, setEditingVillage] = useState(null);
    const [formData, setFormData] = useState({
        VillageName: "",
        District: "",
        State: "",
        Population: "",
        Area: ""
    });

    // Fetch All Villages
    const fetchVillages = async () => {
        setLoading(true);
        try {
            const res = await getVillages();
            setVillages(res.data.data || []);
        } catch {
            toast.error("Failed to fetch village data");
        } finally {
            setLoading(false);
        }
    };

    const fetchDropdownData = async () => {
        try {
            const [stateRes, distRes] = await Promise.all([
                getStates(),
                getDistricts()
            ]);
            setStates(stateRes.data.data || []);
            setDistricts(distRes.data.data || []);
        } catch {
            console.error("Failed to fetch dropdown data");
        }
    };

    useEffect(() => {
        fetchVillages();
        fetchDropdownData();
    }, []);

    // Add
    const handleAdd = () => {
        setEditingVillage(null);
        setFormData({
            VillageName: "",
            District: "",
            State: "",
            Population: "",
            Area: ""
        });
        setIsModalOpen(true);
    };

    // Edit
    const handleEdit = (village) => {
        setEditingVillage(village);

        // Fallback for legacy data: map string names to IDs if explicit ID is missing
        let mappedStateId = village.StateID || village.State;
        if (!village.StateID && village.State) {
            const matchedState = states.find(s => 
                s.state_name === village.State || 
                s.id?.toString() === village.State?.toString() ||
                (typeof village.State === 'string' && s.state_name.toLowerCase().startsWith(village.State.substring(0, 4).toLowerCase()))
            );
            if (matchedState) mappedStateId = matchedState.id;
        }

        let mappedDistrictId = village.DistrictID || village.District;
        if (!village.DistrictID && village.District) {
            const matchedDistrict = districts.find(d => 
                d.district_name === village.District || 
                d.id?.toString() === village.District?.toString() ||
                (typeof village.District === 'string' && d.district_name.toLowerCase().startsWith(village.District.substring(0, 4).toLowerCase()))
            );
            if (matchedDistrict) mappedDistrictId = matchedDistrict.id;
        }

        setFormData({
            VillageName: village.VillageName,
            District: mappedDistrictId || "",
            State: mappedStateId || "",
            Population: village.Population,
            Area: village.Area
        });
        setIsModalOpen(true);
    };

    // Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this village?")) return;

        try {
            await deleteVillage(id);
            toast.success("Village deleted successfully!");
            fetchVillages();
        } catch {
            toast.error("Failed to delete village");
        }
    };

    // Save (Add or Update)
    const handleSave = async () => {
        if (!formData.VillageName || !formData.State) {
            toast.error("Village Name and State are required!");
            return;
        }

        try {
            if (editingVillage) {
                await updateVillage(editingVillage.VillageID, formData);
                toast.success("Village updated successfully!");
            } else {
                await addVillage(formData);
                toast.success("Village added successfully!");
            }
            setIsModalOpen(false);
            fetchVillages();
        } catch {
            toast.error("Failed to save village");
        }
    };

    // Table Columns
    const columns = [
        { header: "Village ID", accessor: "VillageID" },
        { header: "Village Name", accessor: "VillageName" },
        { header: "District", cell: (row) => row.DistrictName || row.District },
        { header: "State", cell: (row) => row.StateName || row.State },
        { header: "Population", accessor: "Population" },
        { header: "Area (sq/km)", accessor: "Area" },
    ];

    return (
        <div className="p-8 space-y-6">
            <Toaster position="top-center" />

            <SmartDataTable
                title="Village Management"
                columns={columns}
                data={villages}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showSerial={true}
            />

            {/* Loader */}
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* Modal */}
            <SmartModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingVillage ? "Edit Village" : "Add Village"}
                onSave={handleSave}
            >
                <SmartFormField 
                    label="Village Name" 
                    type="text"
                    value={formData.VillageName} 
                    onChange={(e) => setFormData({ ...formData, VillageName: e.target.value })} 
                    required 
                />

                <div className="flex flex-col space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">State *</label>
                    <select
                        value={formData.State}
                        onChange={(e) => setFormData({ ...formData, State: e.target.value, District: "" })}
                        required
                        className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-700"
                    >
                        <option value="">Select State</option>
                        {states.map((s) => (
                            <option key={s.id} value={s.id}>{s.state_name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">District *</label>
                    <select
                        value={formData.District}
                        onChange={(e) => setFormData({ ...formData, District: e.target.value })}
                        required
                        disabled={!formData.State}
                        className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-700 disabled:bg-slate-50 disabled:text-slate-400"
                    >
                        <option value="">Select District</option>
                        {districts
                            .filter((d) => d.state_id.toString() === formData.State.toString())
                            .map((d) => (
                                <option key={d.id} value={d.id}>{d.district_name}</option>
                            ))}
                    </select>
                </div>

                <SmartFormField 
                    label="Population" 
                    type="number"
                    value={formData.Population} 
                    onChange={(e) => setFormData({ ...formData, Population: e.target.value })} 
                    required 
                />

                <SmartFormField 
                    label="Area" 
                    type="number"
                    value={formData.Area} 
                    onChange={(e) => setFormData({ ...formData, Area: e.target.value })} 
                    required 
                />
            </SmartModal>
        </div>
    );
}
