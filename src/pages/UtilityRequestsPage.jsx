import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/utility";

export default function UtilityRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setRequests(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch utility requests", error);
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
        setRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
      }
    } catch (error) {
      console.error("Error updating status", error);
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Utility & Infrastructure Requests</h1>
      <p className="text-gray-600">Review Water Connections, Building NOCs, and Repair Requests.</p>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-gray-600 font-semibold">User</th>
              <th className="px-4 py-3 text-gray-600 font-semibold">Type</th>
              <th className="px-4 py-3 text-gray-600 font-semibold">Details</th>
              <th className="px-4 py-3 text-gray-600 font-semibold">Target Asset</th>
              <th className="px-4 py-3 text-gray-600 font-semibold">Document</th>
              <th className="px-4 py-3 text-gray-600 font-semibold">Status</th>
              <th className="px-4 py-3 text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? (
              requests.map((req) => (
                <tr key={req.id} className="border-b">
                  <td className="px-4 py-3">{req.user_name}</td>
                  <td className="px-4 py-3 font-medium text-indigo-600">{req.request_type}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold">{req.location}</p>
                    <p className="text-gray-500 text-xs">{req.description}</p>
                  </td>
                  <td className="px-4 py-3">{req.asset_name || <span className="text-gray-400">N/A</span>}</td>
                  <td className="px-4 py-3">
                    {req.document_url ? (
                      <a 
                        href={`http://localhost:8080${req.document_url}`} 
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
                      req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      req.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 space-x-2 flex">
                    {req.status === 'Pending' && (
                      <>
                        <button 
                          onClick={() => handleUpdateStatus(req.id, 'Approved')}
                          className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(req.id, 'Rejected')}
                          className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
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
                  No utility requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
