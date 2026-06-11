import React, { useEffect, useState } from "react";
import SmartDataTable from "../../components/tables/SmartDataTable";
import SmartModal from "../../components/ui/SmartModal";
import SmartFormField from "../../components/ui/SmartFormField";
import { getMeetings, createMeeting, updateMeeting, deleteMeeting } from "../../services/smartVillageService";
import { toast } from "react-toastify";

export default function GramSabhaPage() {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMeeting, setEditingMeeting] = useState(null);
    const [formData, setFormData] = useState({
        meeting_date: "",
        agenda: "",
        minutes: "",
        status: "Scheduled"
    });

    const fetchMeetings = async () => {
        setLoading(true);
        try {
            const res = await getMeetings();
            setMeetings(res.data.data || []);
        } catch {
            toast.error("Failed to fetch meetings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMeetings();
    }, []);

    const handleAdd = () => {
        setEditingMeeting(null);
        setFormData({
            meeting_date: "",
            agenda: "",
            minutes: "",
            status: "Scheduled"
        });
        setIsModalOpen(true);
    };

    const handleEdit = (meeting) => {
        setEditingMeeting(meeting);
        setFormData({
            meeting_date: meeting.meeting_date ? new Date(meeting.meeting_date).toISOString().slice(0, 16) : "",
            agenda: meeting.agenda,
            minutes: meeting.minutes || "",
            status: meeting.status || "Scheduled"
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this meeting?")) return;
        try {
            await deleteMeeting(id);
            toast.success("Meeting deleted successfully");
            fetchMeetings();
        } catch {
            toast.error("Failed to delete meeting");
        }
    };

    const handleSave = async () => {
        if (!formData.meeting_date || !formData.agenda) {
            return toast.error("Date and agenda are required");
        }
        try {
            if (editingMeeting) {
                await updateMeeting(editingMeeting.id, formData);
                toast.success("Meeting updated successfully");
            } else {
                await createMeeting(formData);
                toast.success("Meeting scheduled successfully");
            }
            setIsModalOpen(false);
            fetchMeetings();
        } catch {
            toast.error("Failed to save meeting");
        }
    };

    const columns = [
        { header: "ID", accessor: "id" },
        { header: "Date & Time", cell: (row) => new Date(row.meeting_date).toLocaleString() },
        { header: "Agenda", accessor: "agenda" },
        { header: "Status", accessor: "status" },
        { header: "Minutes", accessor: "minutes" }
    ];

    return (
        <div className="p-8 space-y-6">


            <SmartDataTable
                title="Gram Sabha Meetings Management"
                columns={columns}
                data={meetings}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showSerial={true}
            />

            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            <SmartModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingMeeting ? "Edit Meeting" : "Schedule Meeting"}
                onSave={handleSave}
            >
                <div className="space-y-6">

                    {/* Header */}
                    <div className="pb-3 border-b border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-800">
                            Meeting Details
                        </h3>
                        <p className="text-sm text-slate-500">
                            Schedule meetings, manage agendas, and maintain meeting records.
                        </p>
                    </div>

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <SmartFormField
                            label="Meeting Date & Time"
                            type="datetime-local"
                            value={formData.meeting_date}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    meeting_date: e.target.value
                                })
                            }
                            required
                        />

                        {editingMeeting && (
                            <SmartFormField
                                label="Status"
                                type="select"
                                options={[
                                    "Scheduled",
                                    "Completed",
                                    "Cancelled"
                                ]}
                                value={formData.status}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        status: e.target.value
                                    })
                                }
                            />
                        )}

                    </div>

                    {/* Agenda */}
                    <div>
                        <SmartFormField
                            label="Meeting Agenda"
                            type="textarea"
                            placeholder="Enter meeting agenda and discussion points..."
                            value={formData.agenda}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    agenda: e.target.value
                                })
                            }
                            required
                            fullWidth
                        />
                    </div>

                    {/* Minutes Section */}
                    {editingMeeting && (
                        <div>
                            <SmartFormField
                                label="Minutes of Meeting"
                                type="textarea"
                                placeholder="Enter decisions, resolutions, and meeting outcomes..."
                                value={formData.minutes}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        minutes: e.target.value
                                    })
                                }
                                fullWidth
                            />
                        </div>
                    )}

                    {/* Info Card */}
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                        <h4 className="text-sm font-semibold text-blue-800 mb-2">
                            Meeting Information
                        </h4>
                        <p className="text-sm text-blue-700">
                            Record meeting schedules, agendas, attendance decisions,
                            and resolutions for proper Gram Panchayat governance and
                            transparency.
                        </p>
                    </div>

                </div>
            </SmartModal>
        </div>
    );
}
