import React, { useEffect, useState } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import { getSchemeApplications } from "../services/schemeApplicationService";
import toast, { Toaster } from "react-hot-toast";

export default function SchemeApplicationsPage() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const res = await getSchemeApplications();
            setApplications(res.data);
        } catch {
            toast.error("Failed to load scheme applications");
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { header: "Application ID", accessor: "scheme_application_id" },
        { header: "User ID", accessor: "user_id" },
        { header: "Scheme ID", accessor: "scheme_id" },
        { header: "Status", accessor: "status" },
        { header: "Eligibility Score", accessor: "eligibility_score" },
        { header: "Submitted At", accessor: "submitted_at" },
        { header: "Approved At", accessor: "approved_at" },
    ];

    return (
        <div className="p-8 space-y-6">
            <Toaster position="top-center" />

            <SmartDataTable
                title="Scheme Applications"
                columns={columns}
                data={applications}
                showSerial={true}
                hideActions={true}  // 🚫 No Add/Edit/Delete
            />

            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white/60 z-50">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
}
