import { useEffect, useState } from "react";
import axios from "axios";
import { getAllRegistrations } from "../services/registrationService";
import { generateCertificate, getCertificate } from "../services/certificateService";
import { ArrowLeft, Award, Download, Eye, FileText, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const card = { background: "white", borderRadius: "16px", border: "1px solid #f1f5f9" };

function AdminCertificates() {
  const [registrations, setRegistrations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { loadRegistrations(); }, []);
  const loadRegistrations = async () => { try { const r = await getAllRegistrations(); setRegistrations(r.data); } catch (e) { console.log(e); } };

  const handleGenerate = async (registrationId) => {
    try { await generateCertificate(registrationId); alert("Certificate Generated Successfully"); }
    catch (e) { alert(e.response?.data?.message || "Certificate Already Generated"); }
  };

  const handleView = async (registrationId) => {
    try {
      const r = await getCertificate(registrationId);
      alert(`Certificate Number: ${r.data.certificateNumber}\n\nIssue Date: ${r.data.issueDate}\n\nStatus: ${r.data.status}`);
    } catch { alert("Certificate Not Generated"); }
  };

  const handleDownload = async (registrationId) => {
    try {
      const r = await axios.get(`http://localhost:8080/api/certificates/download/${registrationId}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([r.data]));
      const link = document.createElement("a"); link.href = url; link.download = "Certificate.pdf"; document.body.appendChild(link); link.click(); link.remove();
    } catch { alert("Generate Certificate First"); }
  };

  const thStyle = { textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", padding: "16px 24px", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" };
  const tdStyle = { padding: "16px 24px", borderBottom: "1px solid #f8fafc", fontSize: "14px" };

  return (
    <div style={{ padding: "32px 24px", display: "flex", flexDirection: "column", gap: "24px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button onClick={() => navigate(-1)} style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", background: "white", border: "1px solid #e2e8f0", color: "#475569", cursor: "pointer" }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Certificate Management</h1>
          <p style={{ color: "#64748b", marginTop: "2px", fontSize: "14px" }}>{registrations.length} registrations</p>
        </div>
      </div>

      <div style={{ ...card, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Student</th>
                <th style={thStyle}>Event</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Certificate</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map(reg => (
                <tr key={reg.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg, #3b82f6, #6366f1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "12px", fontWeight: 600 }}>{reg.user.fullName?.charAt(0)}</div>
                      <span style={{ fontSize: "14px", fontWeight: 500, color: "#0f172a" }}>{reg.user.fullName}</span>
                    </div>
                  </td>
                  <td style={{ ...tdStyle, color: "#475569" }}>{reg.event.eventTitle}</td>
                  <td style={tdStyle}>
                    <span style={{ padding: "2px 10px", borderRadius: "9999px", fontSize: "12px", fontWeight: 500, ...(reg.status === "Approved" ? { background: "#ecfdf5", color: "#047857" } : { background: "#f1f5f9", color: "#64748b" }) }}>{reg.status}</span>
                  </td>
                  <td style={tdStyle}>
                    {reg.status === "Approved" ? (
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button onClick={() => handleGenerate(reg.id)} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", background: "#eff6ff", color: "#1d4ed8", borderRadius: "8px", fontSize: "12px", fontWeight: 500, border: "none", cursor: "pointer" }}
                          onMouseOver={(e) => { e.currentTarget.style.background = "#dbeafe"; }} onMouseOut={(e) => { e.currentTarget.style.background = "#eff6ff"; }}>
                          <Award size={14} /> Generate
                        </button>
                        <button onClick={() => handleView(reg.id)} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", background: "#eef2ff", color: "#4338ca", borderRadius: "8px", fontSize: "12px", fontWeight: 500, border: "none", cursor: "pointer" }}
                          onMouseOver={(e) => { e.currentTarget.style.background = "#e0e7ff"; }} onMouseOut={(e) => { e.currentTarget.style.background = "#eef2ff"; }}>
                          <Eye size={14} /> View
                        </button>
                        <button onClick={() => handleDownload(reg.id)} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", background: "#ecfdf5", color: "#047857", borderRadius: "8px", fontSize: "12px", fontWeight: 500, border: "none", cursor: "pointer" }}
                          onMouseOver={(e) => { e.currentTarget.style.background = "#d1fae5"; }} onMouseOut={(e) => { e.currentTarget.style.background = "#ecfdf5"; }}>
                          <Download size={14} /> Download
                        </button>
                      </div>
                    ) : (
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "14px", color: "#ef4444", fontWeight: 500 }}><XCircle size={16} /> Not Eligible</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminCertificates;
