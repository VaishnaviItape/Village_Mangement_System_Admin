
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import SmartDataTable from "../components/tables/SmartDataTable";
import axiosInstance from "../services/axiosInstance";
import { getJobsList } from "../services/jobsService";
import {Search, Play } from "lucide-react";

export default function JobLogs() {
  const [jobList, setJobList] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedJob, setSelectedJob] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showingLogs, setShowingLogs] = useState(false); // false = job list view

  // ✅ Fetch Job List
  const fetchJobList = async () => {
    setLoading(true);
    try {
      const jobs = await getJobsList();
      const formatted = jobs.map((job) => ({
        id: job,
        jobName: job,
      }));
      setJobList(jobs);
      setTableData(formatted);
      setShowingLogs(false);
    } catch {
      toast.error("Failed to load job list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobList();
  }, []);

  // ✅ Trigger Job
  const handleTriggerNow = async (jobName) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(`/Jobs/run/${jobName}`);
      toast.success(res?.data?.message || `${jobName} triggered successfully`);
    } catch {
      toast.error("Failed to trigger job");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Search Logs
  const handleSearch = async () => {
    if (!selectedJob) return toast.error("Please select a job first");

    setLoading(true);
    try {
      let url = `/Jobs/logs/filter?jobName=${selectedJob}`;
      if (selectedStatus !== "All") {
        url += `&isSuccess=${selectedStatus === "Success"}`;
      }
      const res = await axiosInstance.get(url);
      setTableData(res.data);
      setShowingLogs(true);
    } catch {
      toast.error("Failed to fetch filtered logs");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Refresh
  const handleRefresh = () => {
    fetchJobList();
    setSelectedJob("");
    setSelectedStatus("All");
  };

  // ✅ Columns Setup
  const columns = showingLogs
    ? [
        { header: "Job Name", accessor: "jobName" },
        {
          header: "Status",
          accessor: "isSuccess",
          cell: (row) => (
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                row.isSuccess
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {row.isSuccess ? "Success" : "Failed"}
            </span>
          ),
        },
        { header: "Started At", accessor: "startedAt" },
        { header: "Ended At", accessor: "endedAt" },
        { header: "Duration (s)", accessor: "durationSeconds" },
        { header: "Error Message", accessor: "errorMessage" },
      ]
    : [
        { header: "Job Name", accessor: "jobName" },
        {
          header: "Action",
          accessor: "action",
          cell: (row) => (
            <button
              onClick={() => handleTriggerNow(row.jobName)}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95"
            >
               <Play  size={18} className="transition-transform duration-300 rotate-hover" /> 
              Trigger Now
            </button>
          ),
        },
      ];


  const headerContent = (
    <div className="flex flex-wrap items-center gap-3">
      {/* Job Dropdown */}
      <select
        value={selectedJob}
        onChange={(e) => setSelectedJob(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
      >
        <option value="">Select Job</option>
        {jobList.map((job) => (
          <option key={job} value={job}>
            {job}
          </option>
        ))}
      </select>

      {/* Status Dropdown */}
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
      >
        <option value="All">All</option>
        <option value="Success">Success</option>
        <option value="Fail">Fail</option>
      </select>

      {/* Buttons */}
      <button
        onClick={handleSearch}
        className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <Search size={18} className="transition-transform duration-300 rotate-hover" /> 
        Search Logs
      </button>

      
    </div>
  );

  return (
    <div className="p-6">
      <Toaster
        position="top-center"
        toastOptions={{
          style: { minWidth: "380px", fontSize: "18px", padding: "14px 20px" },
        }}
      />

      <SmartDataTable
        title={showingLogs ? "Job Execution Logs" : "Scheduled Jobs"}
        columns={columns}
        data={tableData}
        showSerial={true}
        showAddButton={false} // JobLogs में Add button नहीं चाहिए
        showActions={false} // logs view में actions दिखाएँ
        headerContent={headerContent} // ✅ Custom Search + Filter
      />

      {/* Loader */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/60 z-50">
          <div className="w-14 h-14 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
