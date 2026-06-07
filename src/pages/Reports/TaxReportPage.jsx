import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/reports/taxes";

export default function TaxReportPage() {
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
      console.error("Failed to fetch tax report", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading tax report...</div>;
  if (!report) return <div className="p-6">Error loading report</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Tax Collection Report</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-lg">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Overview</h2>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600 text-lg">Total Ghar Patti Collected:</span>
          <span className="font-bold text-green-600 text-xl">₹{report.totalGharPattiCollected || 0}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-lg">Total Pani Patti Collected:</span>
          <span className="font-bold text-blue-600 text-xl">₹{report.totalPaniPattiCollected || 0}</span>
        </div>
      </div>
    </div>
  );
}
