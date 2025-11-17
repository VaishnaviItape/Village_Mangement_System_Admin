import { useEffect, useState } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import {
    getDistricts,
    addDistrict,
    updateDistrict,
    deleteDistrict,    
} from "../services/districtService";
import {
    getStates,
    addState,
} from "../services/stateService";
import {
    getCountries,
    addCountry,
} from "../services/countryService";
import toast, { Toaster } from "react-hot-toast";

export default function DistrictTable() {
    const [districts, setDistricts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [states, setStates] = useState([]);
    const [countries, setCountries] = useState([]);

    const [showDistrictModal, setShowDistrictModal] = useState(false);
    const [showStateModal, setShowStateModal] = useState(false);
    const [showCountryModal, setShowCountryModal] = useState(false);
    const [editingDistrict, setEditingDistrict] = useState(null);

    const [selectedCountryId, setSelectedCountryId] = useState("");
    const [filteredStates, setFilteredStates] = useState([]);

    const [newDistrict, setNewDistrict] = useState({ name: "", stateId: "" });
    const [newState, setNewState] = useState({ name: "", countryId: "" });
    const [newCountry, setNewCountry] = useState({ name: "", code: "" });

    const fetchAll = async () => {
        setLoading(true); // 👈 yahan sahi jagah hai
        try {
            const [districtRes, stateRes, countryRes] = await Promise.all([
                getDistricts(),
                getStates(),
                getCountries(),
            ]);

            setDistricts(districtRes.data);
            setStates(stateRes.data);
            setCountries(countryRes.data);
        } catch (error) {
            toast.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchAll();
    }, []);


    // ✅ Country change → filter states
    const handleCountryChange = (countryId) => {
        if (countryId === "add_new") {
            // Open country modal
            setShowCountryModal(true);

            // Reset selection
            setSelectedCountryId("");
            setFilteredStates([]);
        } else {
            setSelectedCountryId(countryId);
            const filtered = states.filter((s) => s.countryId == countryId);
            setFilteredStates(filtered);
            setNewDistrict({ ...newDistrict, stateId: "" });
        }
    };

    // ✅ Open Add Modal
    const handleAddDistrict = () => {
        setEditingDistrict(null);
        setSelectedCountryId("");
        setNewDistrict({ name: "", stateId: "" });
        setShowDistrictModal(true);
    };

    // ✅ Open Edit Modal
    const handleEditDistrict = (district) => {
        const state = states.find((s) => s.id === district.stateId);
        const countryId = state ? state.countryId : "";
        handleCountryChange(countryId);
        setSelectedCountryId(countryId);
        setEditingDistrict(district);
        setNewDistrict({ name: district.name, stateId: district.stateId });
        setShowDistrictModal(true);
    };

    // ✅ Save District (Add or Update)
    const handleSaveDistrict = async () => {
        if (!selectedCountryId || !newDistrict.stateId || !newDistrict.name)
            return toast.error("All fields required!");

        try {
            if (editingDistrict) {
                await updateDistrict(editingDistrict.id, newDistrict);
                toast.success("District updated!");
            } else {
                await addDistrict(newDistrict);
                toast.success("District added!");
            }
            fetchAll();
            setShowDistrictModal(false);
        } catch {
            toast.error("Failed to save district");
        }
    };

    // 🗑️ Delete District
    const handleDeleteDistrict = async (id) => {
        if (!window.confirm("Delete this district?")) return;
        try {
            await deleteDistrict(id);
            toast.success("District deleted!");
            fetchAll();
        } catch {
            toast.error("Failed to delete");
        }
    };

    // ➕ Add State
    const handleAddState = async () => {
        if (!newState.name || !newState.countryId) {
            toast.error("Enter state and select country!");
            return;
        }
        try {
            const res = await addState(newState);
            toast.success("State added successfully!");
            setShowStateModal(false);
            setNewDistrict((prev) => ({ ...prev, stateId: res.data.id }));
            fetchAll();
        } catch {
            toast.error("Failed to add state!");
        }
    };

    // ➕ Add Country
    const handleAddCountry = async () => {
        if (!newCountry.name || !newCountry.code) {
            toast.error("Enter country name and code!");
            return;
        }
        try {
            const res = await addCountry(newCountry);
            toast.success("Country added successfully!");
            setShowCountryModal(false);
            setNewState((prev) => ({ ...prev, countryId: res.data.id }));
            fetchAll();
        } catch {
            toast.error("Failed to add country!");
        }
    };

    const columns = [
        { header: "ID", accessor: "id" },
        { header: "District", accessor: "name" },
        { header: "State", accessor: "stateName" },
    ];

    return (
        <div>
            <Toaster
                position="top-center"  // top-right → top-center
                toastOptions={{
                    style: { minWidth: '400px', fontSize: '25px', padding: '18px 26px' },
                }}
            />
            <SmartDataTable
                title="Districts"
                columns={columns}
                data={districts}
                onAdd={handleAddDistrict}
                onEdit={handleEditDistrict}
                onDelete={handleDeleteDistrict}
                showSerial={true}
            />

            {/* Loader Spinner */}
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white/40 z-50">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* ➕ District Modal */}
            {/* ✨ District Add/Edit Modal */}
            {showDistrictModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-[440px] p-6 animate-fade-in">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">
                            {editingDistrict ? "Edit District" : "Add New District"}
                        </h2>

                        <div className="space-y-4">
                            {/* 🌍 Country Select */}
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">
                                    Select Country
                                </label>
                                <select
                                    value={selectedCountryId || ""}
                                    onChange={(e) => handleCountryChange(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                    <option value="">-- Select Country --</option>
                                    {countries.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                    <option value="add_new" className="text-gray-600 italic bg-gray-100">
                                        ➕ Add New Country
                                    </option>
                                </select>
                            </div>

                            {/* 🏙️ State Select */}
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">
                                    Select State
                                </label>
                                <select
                                    value={newDistrict.stateId || ""}
                                    onChange={(e) => {
                                        if (e.target.value === "add_new") setShowStateModal(true);
                                        else
                                            setNewDistrict({
                                                ...newDistrict,
                                                stateId: e.target.value,
                                            });
                                    }}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                    <option value="">-- Select State --</option>
                                    {filteredStates.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name}
                                        </option>
                                    ))}
                                    <option value="add_new" className="text-gray-600 italic bg-gray-100">
                                        ➕ Add New State
                                    </option>
                                </select>
                            </div>

                            {/* 🏘️ District Name */}
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">
                                    District Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter district name"
                                    value={newDistrict.name}
                                    onChange={(e) =>
                                        setNewDistrict({ ...newDistrict, name: e.target.value })
                                    }
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* 🔘 Buttons */}
                        <div className="flex justify-end mt-6 space-x-3">
                            <button
                                onClick={() => setShowDistrictModal(false)}
                                className="flex items-center gap-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveDistrict}
                                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95"
                            >
                                {editingDistrict ? "Update" : "Add"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ➕ State Modal */}
            {showStateModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-[420px] p-6 animate-fade-in">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">
                            Add New State
                        </h2>

                        <div className="space-y-4">
                            {/* State Name */}
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">
                                    State Name
                                </label>
                                <input
                                    type="text"
                                    value={newState.name}
                                    onChange={(e) =>
                                        setNewState({ ...newState, name: e.target.value })
                                    }
                                    placeholder="Enter state name"
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>

                            {/* Country Select */}
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">
                                    Select Country
                                </label>
                                <select
                                    value={newState.countryId || ""}
                                    onChange={(e) => {
                                        if (e.target.value === "add_new") setShowCountryModal(true);
                                        else setNewState({ ...newState, countryId: e.target.value });
                                    }}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                    <option value="">-- Select Country --</option>
                                    {countries.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                    <option value="add_new" className="text-gray-600 italic bg-gray-100">
                                        ➕ Add New Country
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6 space-x-3">
                            <button
                                onClick={() => setShowStateModal(false)}
                                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 text-sm hover:bg-slate-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddState}
                                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ➕ Country Modal */}
            {showCountryModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-[400px] p-6 animate-fade-in">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Add New Country</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">
                                    Country Name
                                </label>
                                <input
                                    type="text"
                                    value={newCountry.name}
                                    onChange={(e) =>
                                        setNewCountry({ ...newCountry, name: e.target.value })
                                    }
                                    placeholder="Enter country name"
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">
                                    Country Code
                                </label>
                                <input
                                    type="text"
                                    value={newCountry.code}
                                    onChange={(e) =>
                                        setNewCountry({ ...newCountry, code: e.target.value })
                                    }
                                    placeholder="Enter country code"
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-6 space-x-3">
                            <button
                                onClick={() => setShowCountryModal(false)}
                                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 text-sm hover:bg-slate-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddCountry}
                                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
