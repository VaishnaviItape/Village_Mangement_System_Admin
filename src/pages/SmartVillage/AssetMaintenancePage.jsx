import React, { useEffect, useState } from "react";
import axios from "axios";
import SmartModal from "../../components/ui/SmartModal";
import SmartFormField from "../../components/ui/SmartFormField";

const API_URL = "http://localhost:8080/api/sv/maintenance";

export default function AssetMaintenancePage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [infrastructure, setInfra] = useState([]);
  
  const [assetId, setAssetId] = useState("");
  const [date, setDate] = useState("");
  const [cost, setCost] = useState("");
  const [desc, setDesc] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => { 
    fetchLogs(); 
    fetchInfra();
  }, []);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) setLogs(res.data.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchInfra = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get("http://localhost:8080/api/infrastructure", { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) setInfra(res.data.data);
    } catch (e) { console.error(e); }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(API_URL, { asset_id: assetId, maintenance_date: date, cost, description: desc }, { headers: { Authorization: `Bearer ${token}` } });
      fetchLogs();
      setAssetId(""); setDate(""); setCost(""); setDesc("");
      setIsModalOpen(false);
    } catch (e) { alert("Failed"); }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Asset Maintenance Logs</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Log Maintenance</button>
      </div>
      
      <SmartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Maintenance" onSave={handleCreate}>
        <div className="flex flex-col space-y-4 w-full">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Asset</label>
            <select className="border p-2 rounded w-full" value={assetId} onChange={e => setAssetId(e.target.value)}>
              <option value="">Select Asset</option>
              {infrastructure.map(i => <option key={i.asset_id} value={i.asset_id}>{i.asset_name}</option>)}
            </select>
          </div>
          <SmartFormField label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
          <SmartFormField label="Cost (₹)" type="number" value={cost} onChange={e => setCost(e.target.value)} required />
          <SmartFormField label="Description" type="textarea" value={desc} onChange={e => setDesc(e.target.value)} required fullWidth />
        </div>
      </SmartModal>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-50 border-b"><th className="p-4">Date</th><th className="p-4">Asset Name</th><th className="p-4">Description</th><th className="p-4">Cost</th></tr>
          </thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.id} className="border-b">
                <td className="p-4">{new Date(l.maintenance_date).toLocaleDateString()}</td>
                <td className="p-4 font-bold text-indigo-600">{l.asset_name}</td>
                <td className="p-4">{l.description}</td>
                <td className="p-4 text-red-600 font-bold">₹{l.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
