import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/reports/users";

export default function UserReportPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setReport(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch user report", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading user report...</div>;
  if (!report) return <div className="p-6">Error loading report</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">User Report</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Demographics</h2>
        {report.usersByRole.length > 0 ? (
          report.usersByRole.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center mb-2">
              <span className="text-gray-600 text-lg capitalize">{item.role || 'Unknown'}:</span>
              <span className="font-bold text-gray-800 text-xl">{item.count}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No users found.</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Recent Registrations</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-gray-600">Name</th>
                <th className="px-4 py-2 text-gray-600">Email</th>
                <th className="px-4 py-2 text-gray-600">Role</th>
                <th className="px-4 py-2 text-gray-600">Joined</th>
              </tr>
            </thead>
            <tbody>
              {report.recentRegistrations.map((user, idx) => (
                <tr key={idx} className="border-b">
                  <td className="px-4 py-3">{user.full_name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3 capitalize">{user.role}</td>
                  <td className="px-4 py-3">{new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
