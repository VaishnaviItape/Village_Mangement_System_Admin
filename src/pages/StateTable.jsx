import { useState, useEffect } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import { getStates, addState } from "../services/stateService";
import { addCountry, getCountries } from "../services/countryService";
import toast, { Toaster } from "react-hot-toast";

export default function StateTable() {
    const [states, setStates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [countries, setCountries] = useState([]);

    const [showStateModal, setShowStateModal] = useState(false);
    const [showCountryModal, setShowCountryModal] = useState(false);
    const [editingState, setEditingState] = useState(null);
    const [newState, setNewState] = useState({ name: "", countryId: "" });
    const [newCountry, setNewCountry] = useState({ name: "", code: "" });

    // 🔄 Fetch States & Countries
    const fetchStates = async () => {
        try {
            const res = await getStates();
            setStates(res.data);
        } catch {
            toast.error("Failed to fetch states");
        }
    };

    const fetchCountries = async () => {
        try {
            const res = await getCountries();
            setCountries(res.data);
        } catch {
            toast.error("Failed to fetch countries");
        }
    };

    useEffect(() => {
        fetchStates();
        fetchCountries();
    }, []);

    // ➕ Add State
    const handleAddState = () => {
        setShowStateModal(true);
        setNewState({ name: "", countryId: "" });
        setEditingState(null);
    };

    const handleEditState = (state) => {
        setEditingState(state);
        setNewState({ name: state.name, countryId: state.countryId });
        setShowStateModal(true);
    };

    const handleSaveState = async () => {
        if (!newState.name || !newState.countryId) {
            toast.error("Please enter state name and select a country");
            return;
        }
        try {
            if (editingState) {
                await updateState(editingState.id, newState);
                toast.success("State updated!");
            } else {
                await addState(newState);
                toast.success("State added!");
            }
            fetchStates();
            setShowStateModal(false);
            setEditingState(null);
            setNewState({ name: "", countryId: "" });
        } catch {
            toast.error("Failed to save state");
        }
    };


    // ----------------- State Delete -----------------
    const handleDeleteState = async (id) => {
        if (!confirm("Are you sure to delete this state?")) return;
        try {
            await deleteState(id);
            toast.success("State deleted!");
            fetchStates();
        } catch {
            toast.error("Failed to delete state");
        }
    };

    // ➕ Add Country (from Country modal or State modal)
    const handleAddCountry = async () => {
        if (!newCountry.name || !newCountry.code) {
            toast.error("Please enter country name and code");
            return;
        }
        try {
            const res = await addCountry(newCountry);
            toast.success("Country added!");
            fetchCountries();
            setShowCountryModal(false);
            setNewCountry({ name: "", code: "" });

            // Auto-select newly added country in State modal
            setNewState({ ...newState, countryId: res.data.id });
        } catch {
            toast.error("Failed to add country");
        }
    };

    const columns = [
        { header: "ID", accessor: "id" },
        { header: "State", accessor: "name" },
        { header: "Country", accessor: "countryName" },
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
                title="States"
                columns={columns}
                data={states}
                onAdd={handleAddState}
                onEdit={handleEditState}
                onDelete={handleDeleteState}
                showSerial={true}
            />

            {/* ==================== State Modal ==================== */}
            {showStateModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white w-96 max-w-[90%] p-6 rounded-xl shadow-xl">
                        <h2 className="text-xl font-bold mb-4">
                            {editingState ? "Edit State" : "Add State"}
                        </h2>

                        <input
                            type="text"
                            placeholder="State Name"
                            value={newState.name}
                            onChange={(e) =>
                                setNewState({ ...newState, name: e.target.value })
                            }
                            className="w-full border px-3 py-2 rounded mb-4"
                        />

                        <div className="flex gap-2 mb-4">
                            <select
                                value={newState.countryId}
                                onChange={(e) => {
                                    if (e.target.value === "add_new") {
                                        setShowCountryModal(true);
                                    } else {
                                        setNewState({ ...newState, countryId: e.target.value });
                                    }
                                }}
                                className="flex-1 border px-3 py-2 rounded"
                            >
                                <option value="">Select Country</option>
                                {countries.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                                <option
                                    value="add_new"
                                    className="text-gray-600 italic bg-gray-100 font-medium"
                                >
                                    ➕ Add New Country
                                </option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowStateModal(false)}
                                className="px-4 py-2 bg-gray-300 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveState}
                                className="px-4 py-2 bg-green-500 text-white rounded"
                            >
                                {editingState ? "Update" : "Add"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ==================== Country Modal ==================== */}
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
