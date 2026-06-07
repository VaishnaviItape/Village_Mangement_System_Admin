import React, { useEffect, useState } from "react";
import axios from "axios";
import SmartModal from "../../components/ui/SmartModal";
import SmartFormField from "../../components/ui/SmartFormField";

const API_URL = "http://localhost:8080/api/sv/vendors";

export default function VendorManagementPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [service, setService] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => { fetchVendors(); }, []);

  const fetchVendors = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) setVendors(res.data.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(API_URL, { name, contact, service_type: service }, { headers: { Authorization: `Bearer ${token}` } });
      fetchVendors();
      setName(""); setContact(""); setService("");
      setIsModalOpen(false);
    } catch (e) { alert("Failed"); }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vendor & Contractor Management</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Add Vendor</button>
      </div>
      
      <SmartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Vendor" onSave={handleCreate}>
        <SmartFormField label="Vendor Name" value={name} onChange={e => setName(e.target.value)} required />
        <SmartFormField label="Contact Info" value={contact} onChange={e => setContact(e.target.value)} required />
        <SmartFormField label="Service Type (e.g. Construction)" value={service} onChange={e => setService(e.target.value)} required />
      </SmartModal>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-50 border-b"><th className="p-4">Name</th><th className="p-4">Contact</th><th className="p-4">Service Type</th></tr>
          </thead>
          <tbody>
            {vendors.map(v => (
              <tr key={v.id} className="border-b">
                <td className="p-4 font-bold">{v.name}</td>
                <td className="p-4">{v.contact}</td>
                <td className="p-4">{v.service_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
