import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/reports/complaints";

export default function ComplaintReportPage() {
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
      console.error("Failed to fetch complaint report", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading complaint report...</div>;
  if (!report) return <div className="p-6">Error loading report</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Complaint Report</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-lg">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Status Breakdown</h2>
        {report.length > 0 ? (
          report.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center mb-4">
              <span className="text-gray-600 text-lg capitalize">{item.status}:</span>
              <span className="font-bold text-gray-800 text-xl">{item.count}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No complaints logged.</p>
        )}
      </div>
    </div>
  );
}
