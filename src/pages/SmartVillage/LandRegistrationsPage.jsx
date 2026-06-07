import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/sv/land";

export default function LandRegistrationsPage() {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchLands(); }, []);

  const fetchLands = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) setLands(res.data.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(`${API_URL}/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      setLands(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    } catch (e) { alert("Failed"); }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Land & Crop Registrations</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-50 border-b"><th className="p-4">User</th><th className="p-4">Survey No / Area</th><th className="p-4">Crop</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr>
          </thead>
          <tbody>
            {lands.map(l => (
              <tr key={l.id} className="border-b">
                <td className="p-4">{l.full_name}</td>
                <td className="p-4">{l.survey_number} / {l.land_area}</td>
                <td className="p-4">{l.crop_type}</td>
                <td className="p-4">{l.status}</td>
                <td className="p-4">
                  {l.status === 'Pending' && (
                    <><button onClick={() => handleStatus(l.id, 'Approved')} className="bg-green-600 text-white px-2 py-1 mr-2 rounded">Approve</button>
                    <button onClick={() => handleStatus(l.id, 'Rejected')} className="bg-red-600 text-white px-2 py-1 rounded">Reject</button></>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
