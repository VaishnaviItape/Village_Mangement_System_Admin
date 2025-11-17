// src/pages/AttendancePage.jsx
import React, { useEffect, useState } from "react";
import SmartDataTable from "../components/tables/SmartDataTable";
import toast, { Toaster } from "react-hot-toast";
import { getAttendanceByDate } from "../services/attendanceService";
import { getAttendanceImage } from "../services/attendanceService";
import { Eye } from "lucide-react";

export default function AttendancePage() {
    const today = new Date().toISOString().split("T")[0]; 

    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(today);
    const [previewImage, setPreviewImage] = useState(null);

    // FETCH ATTENDANCE LIST
    const fetchAttendance = async (date) => {
        setLoading(true);
        try {
            const res = await getAttendanceByDate(date);
            setAttendanceData(res.data);
        } catch (err) {
            toast.error("Failed to fetch attendance data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance(selectedDate);
    }, []);

    const handleDateChange = (e) => {
        const date = e.target.value;
        setSelectedDate(date);
        fetchAttendance(date);
    };

    // ⭐ FETCH IMAGE WHEN USER CLICKS EYE BUTTON
    const handleViewImage = async (attendanceId) => {
        try {
            const res = await getAttendanceImage(attendanceId);

            if (res.data && res.data.length > 0) {
                setPreviewImage(res.data[0].fileUrl); // ⭐ IMAGE URL HERE
            } else {
                toast.error("No image found");
            }
        } catch (err) {
            toast.error("Failed to load image");
        }
    };

    const columns = [
        { header: "Employee Name", accessor: "employeeName" },
        { header: "Check In", accessor: "checkInTime" },
        { header: "Check Out", accessor: "checkOutTime" },
        { header: "Total Hours", accessor: "totalHoursWorked" },
        { header: "Status", accessor: "attendanceStatus" },

        {
            header: "Image",
            accessor: "attendanceId",
            cell: (row) => (
                <Eye
                    size={22}
                    className="cursor-pointer text-indigo-600 hover:text-indigo-900"
                    onClick={() => handleViewImage(row.attendanceId)}
                />
            ),
        },
    ];

    return (
        <div className="p-8 space-y-6">
            <Toaster position="top-center" />

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Attendance Management</h2>

                <div className="flex items-center gap-3">
                    <label>Select Date:</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="border px-3 py-2 rounded-lg"
                    />
                </div>
            </div>

            <SmartDataTable
                title={`Attendance for ${selectedDate}`}
                columns={columns}
                data={attendanceData}
                showSerial={true}
                hideActions={true}
            />

            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white/40">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* ⭐ IMAGE PREVIEW MODAL */}
            {previewImage && (
                <div
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
                    onClick={() => setPreviewImage(null)}
                >
                    <img
                        src={previewImage}
                        alt="Preview"
                        className="max-w-3xl max-h-[90vh] rounded-lg shadow-xl"
                    />
                </div>
            )}
        </div>
    );
}
