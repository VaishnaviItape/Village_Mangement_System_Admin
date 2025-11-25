import React, { useEffect, useState } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import { getApplications } from "../services/applicationService";
import toast, { Toaster } from "react-hot-toast";

export default function ApplicationPage() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch applications
    const fetchApplications = async () => {
        setLoading(true);
        try {
            const res = await getApplications();
            setApplications(res.data.data);
        } catch {
            toast.error("Failed to fetch applications!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    // Table Columns
    const columns = [
        { header: "Application ID", accessor: "application_id" },
        { header: "User ID", accessor: "user_id" },
        { header: "Certificate Type", accessor: "certificate_type" },
        {
            header: "Application Data",
            accessor: "application_data",
            cell: (row) => row.application_data ? JSON.stringify(row.application_data) : "N/A"
        },
        { header: "Status", accessor: "status" },
        { header: "Assigned Officer", accessor: "assigned_officer_id" },
        {
            header: "Rejection Reason",
            accessor: "reason_rejection",
            cell: (row) => row.reason_rejection || "-"
        },
        { header: "Submitted At", accessor: "submitted_at" },
        { header: "Verified At", accessor: "verified_at" },
        { header: "Approved At", accessor: "approved_at" },
        {
            header: "Certificate File",
            accessor: "certificate_file_url",
            cell: (row) =>
                row.certificate_file_url ? (
                    <a
                        href={row.certificate_file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                    >
                        Download
                    </a>
                ) : "Not Available"
        }
    ];

    return (
        <div className="p-8 space-y-6">
            <Toaster position="top-center" />

            <SmartDataTable
                title="Application Records"
                columns={columns}
                data={applications}
                showSerial={true}
                hideActions={true} // 🚨 Disable Add/Edit/Delete
            />

            {/* Loader */}
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
}
