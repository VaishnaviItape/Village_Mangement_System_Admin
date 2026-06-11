import React, { useEffect, useState } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import { getApplications } from "../services/applicationService";
import { toast } from "react-toastify";
import SmartModal from "../components/ui/SmartModal";
import SmartFormField from "../components/ui/SmartFormField";

export default function ApplicationPage() {
    const [applications, setApplications] = useState([]);
    const [citizens, setCitizens] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch applications, citizens, and users
    const fetchData = async () => {
        setLoading(true);
        try {
            const [appRes, citRes, userRes] = await Promise.all([
                getApplications(),
                import("../services/citizenService").then(m => m.getCitizens()),
                import("../services/userService").then(m => m.getUsers())
            ]);
            setApplications(appRes.data.data || []);
            setCitizens(citRes.data.data || []);
            setUsers(userRes.data.data || []);
        } catch {
            toast.error("Failed to fetch data!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const enrichedApplications = applications.map(app => {
        const citizen = citizens.find(c => String(c.user_id) === String(app.user_id));
        const officer = users.find(u => String(u.id) === String(app.assigned_officer_id));
        
        return {
            ...app,
            userName: citizen ? citizen.full_name : app.user_id,
            officerName: officer ? officer.full_name : (app.assigned_officer_id || "-")
        };
    });

    // Table Columns
    const columns = [
        { header: "Application ID", accessor: "application_id" },
        { header: "User Name", accessor: "userName" },
        { header: "Certificate Type", accessor: "certificate_type" },
        {
            header: "Application Data",
            accessor: "application_data",
            cell: (row) => row.application_data ? JSON.stringify(row.application_data) : "N/A"
        },
        { header: "Status", accessor: "status" },
        { header: "Assigned Officer", accessor: "officerName" },
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


            <SmartDataTable
                title="Application Records"
                columns={columns}
                data={enrichedApplications}
                showSerial={true}
                showAddButton={false}
                hideActions={true} // 🚨 Disable Add/Edit/Delete
            />

            {/* Loader */}
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
                    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
}
