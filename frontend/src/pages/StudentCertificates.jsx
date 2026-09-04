import { useEffect, useState } from "react";
import { getStudentRegistrations } from "../services/registrationService";
import { getCertificate } from "../services/certificateService";
import { downloadCertificatePdf } from "../services/certificateService";
import { ArrowLeft, Award, Download, Calendar, Hash } from "lucide-react";
import { useNavigate } from "react-router-dom";

function StudentCertificates() {
  const [certificates, setCertificates] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => { loadCertificates(); }, []);

  const loadCertificates = async () => {
    try {
      const r = await getStudentRegistrations(userId);
      const approved = r.data.filter(reg => reg.status === "Approved");

      // Fetch all certificates in parallel instead of sequentially (fixes N+1)
      const certPromises = approved.map(async (reg) => {
        try {
          const c = await getCertificate(reg.id);
          return { registration: reg, certificate: c.data };
        } catch {
          return null;
        }
      });

      const results = await Promise.all(certPromises);
      setCertificates(results.filter(Boolean));
    } catch (e) { console.log(e); }
  };

  const downloadCertificate = async (registrationId) => {
    try {
      const r = await downloadCertificatePdf(registrationId);
      const url = window.URL.createObjectURL(new Blob([r.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "Certificate.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) { console.log(e); alert("Unable to download certificate"); }
  };

  return (
    <div style={{ padding: "32px 24px", display: "flex", flexDirection: "column", gap: "24px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button onClick={() => navigate(-1)} style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", background: "white", border: "1px solid #e2e8f0", color: "#475569", cursor: "pointer" }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a", margin: 0 }}>My Certificates</h1>
          <p style={{ color: "#64748b", marginTop: "2px", fontSize: "14px" }}>{certificates.length} certificates earned</p>
        </div>
      </div>

      {certificates.length === 0 ? (
        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", padding: "48px", textAlign: "center" }}>
          <Award size={48} style={{ color: "#cbd5e1", margin: "0 auto 12px" }} />
          <p style={{ color: "#64748b", margin: 0 }}>No certificates found</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
          {certificates.map(item => (
            <div key={item.certificate.id} style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", overflow: "hidden" }}>
              <div style={{ height: "12px", background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}></div>
              <div style={{ padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <div style={{ width: "40px", height: "40px", background: "#eff6ff", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Award size={20} style={{ color: "#2563eb" }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a", margin: 0 }}>{item.registration.event.eventTitle}</h3>
                    <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>Certificate of Achievement</p>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#475569" }}>
                    <Hash size={16} style={{ color: "#94a3b8" }} />
                    <span>{item.certificate.certificateNumber}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#475569" }}>
                    <Calendar size={16} style={{ color: "#94a3b8" }} />
                    <span>{item.certificate.issueDate}</span>
                  </div>
                </div>
                <button onClick={() => downloadCertificate(item.registration.id)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "10px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "white", borderRadius: "10px", fontSize: "14px", fontWeight: 500, border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(37,99,235,0.25)" }}
                  onMouseOver={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #1d4ed8, #1e40af)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #2563eb, #1d4ed8)"; }}>
                  <Download size={16} /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentCertificates;
