import React, { useEffect, useState } from "react";
import axios from "axios";
import SmartModal from "../../components/ui/SmartModal";
import SmartFormField from "../../components/ui/SmartFormField";

const API_URL = "http://localhost:8080/api/sv/sabha";

export default function GramSabhaPage() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [agenda, setAgenda] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => { fetchMeetings(); }, []);

  const fetchMeetings = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) setMeetings(res.data.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(API_URL, { meeting_date: date, agenda }, { headers: { Authorization: `Bearer ${token}` } });
      fetchMeetings();
      setDate(""); setAgenda("");
      setIsModalOpen(false);
    } catch (e) { alert("Failed"); }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gram Sabha Meetings</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Schedule Meeting</button>
      </div>
      
      <SmartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule New Meeting" onSave={handleCreate}>
        <SmartFormField label="Meeting Date" type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required />
        <SmartFormField label="Agenda" type="textarea" value={agenda} onChange={e => setAgenda(e.target.value)} required fullWidth />
      </SmartModal>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-50 border-b"><th className="p-4">Date</th><th className="p-4">Agenda</th><th className="p-4">Status</th></tr>
          </thead>
          <tbody>
            {meetings.map(m => (
              <tr key={m.id} className="border-b">
                <td className="p-4">{new Date(m.meeting_date).toLocaleString()}</td>
                <td className="p-4">{m.agenda}</td>
                <td className="p-4">{m.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
