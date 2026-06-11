import React, { useEffect, useState } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import { getCitizens } from "../services/citizenService";
import { getComplaints } from "../services/complaintService";
import { toast } from "react-toastify";
import SmartModal from "../components/ui/SmartModal";
import SmartFormField from "../components/ui/SmartFormField";

export default function ComplaintPage() {
    const [complaints, setComplaints] = useState([]);
    const [citizens, setCitizens] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch complaints and citizens
    const fetchData = async () => {
        setLoading(true);
        try {
            const [complaintRes, citizenRes] = await Promise.all([
                getComplaints(),
                getCitizens()
            ]);
            setComplaints(complaintRes?.data?.data || []);
            setCitizens(citizenRes?.data?.data || []);
        } catch {
            toast.error("Failed to fetch records!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Map User IDs to Names
    const displayComplaints = complaints.map(complaint => {
        const citizen = citizens.find(c => c.id === complaint.user_id || c.user_id === complaint.user_id);
        return {
            ...complaint,
            citizenName: citizen ? citizen.full_name : complaint.user_id
        };
    });

    // Table Columns
    const columns = [
        { header: "Citizen", accessor: "citizenName" },
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
            

            <SmartDataTable
                title="Complaint Records"
                columns={columns}
                data={displayComplaints}
                showSerial={true}
                showAddButton={false}
                showActions={false}
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
