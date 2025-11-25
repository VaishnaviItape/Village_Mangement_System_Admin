import React, { useEffect, useState } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import { getComplaints } from "../services/complaintService";
import toast, { Toaster } from "react-hot-toast";

export default function ComplaintPage() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch complaints
    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const res = await getComplaints();
            setComplaints(res.data.data);
        } catch {
            toast.error("Failed to fetch complaints!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    // Table Columns
    const columns = [
        { header: "Complaint ID", accessor: "complaint_id" },
        { header: "User ID", accessor: "user_id" },
        { header: "Category", accessor: "category" },
        { header: "Description", accessor: "description" },
        { header: "Priority", accessor: "priority" },
        { header: "Status", accessor: "status" },
        {
            header: "Photo",
            accessor: "photo_url",
            cell: (row) =>
                row.photo_url ? (
                    <a
                        href={row.photo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                    >
                        View Image
                    </a>
                ) : "No Image"
        },
        {
            header: "Location",
            accessor: "location",
            cell: (row) => (row.location ? JSON.stringify(row.location) : "N/A")
        }
    ];

    return (
        <div className="p-8 space-y-6">
            <Toaster position="top-center" />

            <SmartDataTable
                title="Complaint Records"
                columns={columns}
                data={complaints}
                showSerial={true}
                hideActions={true} // 🚨 THIS HIDES Add/Edit/Delete
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
