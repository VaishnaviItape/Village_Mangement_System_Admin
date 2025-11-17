import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import SmartDataTable from "../components/tables/SmartDataTable";
import { getLeaveRequests, updateLeaveStatus } from "../services/leaveService"; // you'll create this service
import { useNavigate } from "react-router-dom";

export default function LeaveRequestsPage() {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [statusForm, setStatusForm] = useState({ status: "", remark: "" });
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });
    const navigate = useNavigate();

    // Fetch leave requests
    const fetchLeaveRequests = async (token) => {
        if (!token) return;
        setLoading(true);
        try {
            const data = await getLeaveRequests(token);
            const safeData = data.data;
            setLeaveRequests(data.data);
            console.log("safeData", data.data)
            const pending = safeData.filter((l) => l.status === "Pending").length;
            const approved = safeData.filter((l) => l.status === "Approved").length;
            setStats({
                total: safeData.length,
                pending,
                approved,
            });
        } catch (err) {
            toast.error("Failed to fetch leave requests!");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            navigate("/login");
            return;
        }
        fetchLeaveRequests(token);
    }, [navigate]);

    // Open modal for updating status
    const handleEdit = (leave) => {
        setSelectedLeave(leave);
        setStatusForm({
            status: leave.status || "",
            remark: leave.remark || "",
        });
        setShowStatusModal(true);
    };

    // Close modal
    const closeModal = () => {
        setShowStatusModal(false);
        setSelectedLeave(null);
        setStatusForm({ status: "", remark: "" });
    };

    // Save status update
    const handleStatusUpdate = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            toast.error("Session expired! Please login again.");
            navigate("/login");
            return;
        }

        if (!statusForm.status || !statusForm.remark) {
            toast.error("Status and remark are required!");
            return;
        }

        try {
            await updateLeaveStatus(selectedLeave.id, statusForm, token);
            toast.success("Leave request status updated!");
            closeModal();
            fetchLeaveRequests(token);
        } catch (err) {
            toast.error("Failed to update status!");
            console.error(err);
        }
    };

    // Table columns
    const columns = [
        { header: "Employee Name", accessor: "employeeName" },
        { header: "Leave Type", accessor: "leaveType" },
        { header: "From Date", accessor: "fromDate" },
        { header: "To Date", accessor: "toDate" },
        { header: "Days", accessor: "numberOfDays" },
        {
            header: "Status",
            accessor: "status",
            Cell: (row) => (
                <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${row.status === "Approved"
                        ? "bg-emerald-100 text-emerald-600"
                        : row.status === "Rejected"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                >
                    {row.status}
                </span>
            ),
        },
    ];

    return (
        <div className="p-4">
            <Toaster
                position="top-center"
                toastOptions={{
                    style: { minWidth: "400px", fontSize: "18px", padding: "16px" },
                }}
            />

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-5">
                <div className="bg-gradient-to-r from-blue-400 to-blue-500 p-6 rounded-2xl shadow-lg text-white">
                    <h3 className="text-sm text-white/90">Total Requests</h3>
                    <p className="text-3xl font-bold">{stats.total}</p>
                </div>

                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-6 rounded-2xl shadow-lg text-white">
                    <h3 className="text-sm text-white/90">Pending</h3>
                    <p className="text-3xl font-bold">{stats.pending}</p>
                </div>

                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 rounded-2xl shadow-lg text-white">
                    <h3 className="text-sm text-white/90">Approved</h3>
                    <p className="text-3xl font-bold">{stats.approved}</p>
                </div>
            </div>

            {/* Data Table */}
            <SmartDataTable
                title="Leave Requests"
                columns={columns}
                data={leaveRequests}
                onEdit={handleEdit}
                showSerial={true}
                disableAdd={true} // Disable Add button
            />

            {/* Status Update Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-[400px] p-6 animate-fade-in">
                        <h2 className="text-lg font-bold text-slate-800 mb-5">
                            Update Leave Status
                        </h2>

                        <div className="grid grid-cols-1 gap-4">
                            <select
                                value={statusForm.status}
                                onChange={(e) =>
                                    setStatusForm({ ...statusForm, status: e.target.value })
                                }
                                className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="">Select Status</option>
                                <option value="Approved">Approved</option>
                                <option value="Pending">Pending</option>
                                <option value="Rejected">Rejected</option>
                            </select>

                            <textarea
                                placeholder="Enter remark..."
                                rows={3}
                                value={statusForm.remark}
                                onChange={(e) =>
                                    setStatusForm({ ...statusForm, remark: e.target.value })
                                }
                                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={closeModal}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleStatusUpdate}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
