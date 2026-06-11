import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import SmartDataTable from "../../components/tables/SmartDataTable";
import SmartModal from "../../components/ui/SmartModal";
import SmartFormField from "../../components/ui/SmartFormField";
import { getMaintenance, createMaintenance, updateMaintenance, deleteMaintenance } from "../../services/smartVillageService";
import { toast } from "react-toastify";

export default function AssetMaintenancePage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [infrastructure, setInfra] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLog, setEditingLog] = useState(null);
    const [formData, setFormData] = useState({
        asset_id: "",
        maintenance_date: "",
        cost: "",
        description: ""
    });

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await getMaintenance();
            setLogs(res.data.data || []);
        } catch {
            toast.error("Failed to fetch maintenance logs");
        } finally {
            setLoading(false);
        }
    };

    const fetchInfra = async () => {
        try {
            const res = await axiosInstance.get("/api/infrastructure");
            setInfra(res.data.data || []);
        } catch {
            console.error("Failed to fetch infrastructure");
        }
    };

    useEffect(() => {
        fetchLogs();
        fetchInfra();
    }, []);

    const handleAdd = () => {
        setEditingLog(null);
        setFormData({
            asset_id: "",
            maintenance_date: "",
            cost: "",
            description: ""
        });
        setIsModalOpen(true);
    };

    const handleEdit = (log) => {
        setEditingLog(log);
        setFormData({
            asset_id: log.asset_id,
            maintenance_date: log.maintenance_date ? new Date(log.maintenance_date).toISOString().split('T')[0] : "",
            cost: log.cost,
            description: log.description
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this maintenance log?")) return;
        try {
            await deleteMaintenance(id);
            toast.success("Maintenance log deleted successfully");
            fetchLogs();
        } catch {
            toast.error("Failed to delete log");
        }
    };

    const handleSave = async () => {
        if (!formData.asset_id || !formData.maintenance_date || !formData.cost) {
            return toast.error("Asset, date, and cost are required");
        }
        try {
            if (editingLog) {
                await updateMaintenance(editingLog.id, formData);
                toast.success("Log updated successfully");
            } else {
                await createMaintenance(formData);
                toast.success("Log added successfully");
            }
            setIsModalOpen(false);
            fetchLogs();
        } catch {
            toast.error("Failed to save maintenance log");
        }
    };

    const columns = [
        { header: "ID", accessor: "id" },
        { header: "Asset Name", accessor: "asset_name", cell: (row) => <span className="font-bold text-indigo-600">{row.asset_name}</span> },
        { header: "Date", cell: (row) => new Date(row.maintenance_date).toLocaleDateString() },
        { header: "Description", accessor: "description" },
        { header: "Cost", cell: (row) => <span className="text-red-600 font-bold">₹{row.cost}</span> }
    ];

    return (
        <div className="p-8 space-y-6">


            <SmartDataTable
                title="Asset Maintenance Logs"
                columns={columns}
                data={logs}
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
                title={editingLog ? "Edit Maintenance Log" : "Log Maintenance"}
                onSave={handleSave}
            >
                <div className="space-y-6">

                    {/* Header */}
                    <div className="pb-3 border-b border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-800">
                            Maintenance Details
                        </h3>
                        <p className="text-sm text-slate-500">
                            Record infrastructure maintenance activities, costs, and repair information.
                        </p>
                    </div>

                    {/* Main Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Asset Selection */}
                        <div className="flex flex-col space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">
                                Infrastructure Asset
                            </label>

                            <select
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                value={formData.asset_id}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        asset_id: e.target.value
                                    })
                                }
                            >
                                <option value="">Select Asset</option>

                                {infrastructure.map((asset) => (
                                    <option
                                        key={asset.asset_id}
                                        value={asset.asset_id}
                                    >
                                        {asset.asset_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <SmartFormField
                            label="Maintenance Date"
                            type="date"
                            value={formData.maintenance_date}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    maintenance_date: e.target.value
                                })
                            }
                            required
                        />

                        <SmartFormField
                            label="Maintenance Cost (₹)"
                            type="number"
                            placeholder="Enter Maintenance Cost"
                            value={formData.cost}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    cost: e.target.value
                                })
                            }
                            required
                        />

                    </div>

                    {/* Description */}
                    <div>
                        <SmartFormField
                            label="Maintenance Description"
                            type="textarea"
                            rows={4}
                            placeholder="Describe repair work, maintenance activities, materials used, etc."
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value
                                })
                            }
                            required
                            fullWidth
                        />
                    </div>

                    {/* Information Card */}
                    <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4">
                        <h4 className="mb-2 text-sm font-semibold text-cyan-800">
                            Asset Maintenance Record
                        </h4>

                        <p className="text-sm text-cyan-700">
                            Maintain accurate records of repairs, servicing,
                            and maintenance expenses to improve infrastructure
                            planning and ensure asset longevity.
                        </p>
                    </div>

                </div>
            </SmartModal>
        </div>
    );
}
