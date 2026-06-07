import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/civic";

export default function CivicRegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setRegistrations(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch civic registrations", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.put(`${API_URL}/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setRegistrations(prev => prev.map(reg => reg.id === id ? { ...reg, status } : reg));
      }
    } catch (error) {
      console.error("Error updating status", error);
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Civic Registrations</h1>
      <p className="text-gray-600">Review and approve Birth, Death, and Marriage registrations.</p>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-gray-600 font-semibold">User</th>
              <th className="px-4 py-3 text-gray-600 font-semibold">Type</th>
              <th className="px-4 py-3 text-gray-600 font-semibold">Applicant Name</th>
              <th className="px-4 py-3 text-gray-600 font-semibold">Event Date</th>
              <th className="px-4 py-3 text-gray-600 font-semibold">Document</th>
              <th className="px-4 py-3 text-gray-600 font-semibold">Status</th>
              <th className="px-4 py-3 text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {registrations.length > 0 ? (
              registrations.map((reg) => (
                <tr key={reg.id} className="border-b">
                  <td className="px-4 py-3">{reg.user_name}</td>
                  <td className="px-4 py-3 font-medium">{reg.type}</td>
                  <td className="px-4 py-3">{reg.applicant_name}</td>
                  <td className="px-4 py-3">{new Date(reg.event_date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    {reg.document_url ? (
                      <a 
                        href={`http://localhost:8080${reg.document_url}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Doc
                      </a>
                    ) : (
                      <span className="text-gray-400">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      reg.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      reg.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {reg.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-2 flex">
                    {reg.status === 'Pending' && (
                      <>
                        <button 
                          onClick={() => handleUpdateStatus(reg.id, 'Approved')}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(reg.id, 'Rejected')}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                  No registrations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
