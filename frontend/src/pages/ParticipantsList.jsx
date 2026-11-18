import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventParticipants, approveRegistration, rejectRegistration, markAttendance } from "../services/registrationService";
import { ArrowLeft, CheckCircle, XCircle, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const card = { background: "white", borderRadius: "16px", border: "1px solid #f1f5f9" };

function ParticipantsList() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);

  useEffect(() => { loadParticipants(); }, []);

  const loadParticipants = async () => {
    try { const r = await getEventParticipants(eventId); setParticipants(r.data); } catch (e) { console.log(e); }
  };

  const approve = async (id) => { await approveRegistration(id); loadParticipants(); };
  const reject = async (id) => { await rejectRegistration(id); loadParticipants(); };
  const attendance = async (id, status) => { await markAttendance(id, status); loadParticipants(); };

  const thStyle = { textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", padding: "16px 24px", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" };
  const tdStyle = { padding: "16px 24px", borderBottom: "1px solid #f8fafc", fontSize: "14px" };

  return (
    <div style={{ padding: "32px 24px", display: "flex", flexDirection: "column", gap: "24px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button onClick={() => navigate(-1)} style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", background: "white", border: "1px solid #e2e8f0", color: "#475569", cursor: "pointer" }}>
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Event Participants</h1>
          <p style={{ color: "#64748b", marginTop: "2px", fontSize: "14px" }}>{participants.length} registered participants</p>
        </div>
      </div>

      <div style={{ ...card, overflow: "hidden" }}>
        {participants.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center" }}>
            <UserCheck size={48} style={{ color: "#cbd5e1", margin: "0 auto 12px" }} />
            <p style={{ color: "#64748b", margin: 0 }}>No participants registered yet</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Student</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Payment</th>
                  <th style={thStyle}>Actions</th>
                  <th style={thStyle}>Attendance</th>
                  <th style={thStyle}>Certificate</th>
                </tr>
              </thead>
              <tbody>
                {participants.map(reg => (
                  <tr key={reg.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #3b82f6, #6366f1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "14px", fontWeight: 600 }}>
                          {reg.user.fullName?.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: 500, color: "#0f172a" }}>{reg.user.fullName}</div>
                          <div style={{ fontSize: "12px", color: "#64748b" }}>{reg.user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ padding: "2px 10px", borderRadius: "9999px", fontSize: "12px", fontWeight: 500, ...(reg.status === "Approved" ? { background: "#ecfdf5", color: "#047857" } : reg.status === "Rejected" ? { background: "#fef2f2", color: "#dc2626" } : { background: "#fffbeb", color: "#b45309" }) }}>{reg.status}</span>
                    </td>
                    <td style={{ ...tdStyle, color: "#475569" }}>{reg.paymentStatus}</td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button onClick={() => approve(reg.id)} style={{ padding: "6px 12px", background: "#ecfdf5", color: "#047857", borderRadius: "8px", fontSize: "12px", fontWeight: 500, border: "none", cursor: "pointer" }}
                          onMouseOver={(e) => { e.currentTarget.style.background = "#d1fae5"; }} onMouseOut={(e) => { e.currentTarget.style.background = "#ecfdf5"; }}>
                          <CheckCircle size={14} style={{ marginRight: "4px", verticalAlign: "middle" }} />Approve
                        </button>
                        <button onClick={() => reject(reg.id)} style={{ padding: "6px 12px", background: "#fef2f2", color: "#dc2626", borderRadius: "8px", fontSize: "12px", fontWeight: 500, border: "none", cursor: "pointer" }}
                          onMouseOver={(e) => { e.currentTarget.style.background = "#fee2e2"; }} onMouseOut={(e) => { e.currentTarget.style.background = "#fef2f2"; }}>
                          <XCircle size={14} style={{ marginRight: "4px", verticalAlign: "middle" }} />Reject
                        </button>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>{reg.attendanceStatus || "Not marked"}</div>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button onClick={() => attendance(reg.id, "Present")} style={{ padding: "6px 12px", background: "#eff6ff", color: "#1d4ed8", borderRadius: "8px", fontSize: "12px", fontWeight: 500, border: "none", cursor: "pointer" }}
                          onMouseOver={(e) => { e.currentTarget.style.background = "#dbeafe"; }} onMouseOut={(e) => { e.currentTarget.style.background = "#eff6ff"; }}>Present</button>
                        <button onClick={() => attendance(reg.id, "Absent")} style={{ padding: "6px 12px", background: "#f1f5f9", color: "#475569", borderRadius: "8px", fontSize: "12px", fontWeight: 500, border: "none", cursor: "pointer" }}
                          onMouseOver={(e) => { e.currentTarget.style.background = "#e2e8f0"; }} onMouseOut={(e) => { e.currentTarget.style.background = "#f1f5f9"; }}>Absent</button>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ padding: "2px 10px", borderRadius: "9999px", fontSize: "12px", fontWeight: 500, ...(reg.certificateEligible ? { background: "#ecfdf5", color: "#047857" } : { background: "#f1f5f9", color: "#64748b" }) }}>
                        {reg.certificateEligible ? "Eligible" : "Not Eligible"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ParticipantsList;
