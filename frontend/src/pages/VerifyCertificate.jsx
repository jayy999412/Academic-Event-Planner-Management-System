import { useState } from "react";
import { verifyCertificate } from "../services/certificateService";
import { ArrowLeft, Search, CheckCircle, XCircle, Award, User, Calendar, Hash } from "lucide-react";
import { useNavigate } from "react-router-dom";

const card = { background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", padding: "24px" };
const inp = { width: "100%", padding: "12px 14px", border: "1.5px solid #e2e8f0", borderRadius: "10px", fontSize: "14px", color: "#1e293b", background: "#f8fafc", boxSizing: "border-box", outline: "none" };

function VerifyCertificate() {
  const [certificateNumber, setCertificateNumber] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleVerify = async () => {
    try { const r = await verifyCertificate(certificateNumber); setCertificate(r.data); setError(""); }
    catch { setCertificate(null); setError("Certificate Not Found"); }
  };

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: "24px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button onClick={() => navigate(-1)} style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", background: "white", border: "1px solid #e2e8f0", color: "#475569", cursor: "pointer" }}>
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Verify Certificate</h1>
      </div>

      <div style={{ ...card, padding: "32px" }}>
        <div style={{ width: "64px", height: "64px", background: "#eff6ff", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <Award size={32} style={{ color: "#2563eb" }} />
        </div>
        <p style={{ textAlign: "center", color: "#64748b", marginBottom: "24px", fontSize: "14px" }}>Enter the certificate number to verify its authenticity</p>

        <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={20} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input type="text" placeholder="Enter certificate number" value={certificateNumber} onChange={(e) => setCertificateNumber(e.target.value)}
              style={{ ...inp, paddingLeft: "44px" }} />
          </div>
          <button onClick={handleVerify}
            style={{ padding: "12px 24px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "white", fontWeight: 600, borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "14px", boxShadow: "0 4px 12px rgba(37,99,235,0.25)" }}
            onMouseOver={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #1d4ed8, #1e40af)"; }}
            onMouseOut={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #2563eb, #1d4ed8)"; }}>
            Verify
          </button>
        </div>

        {certificate && (
          <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: "16px", padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <CheckCircle size={24} style={{ color: "#059669" }} />
              <h3 style={{ fontWeight: 600, color: "#065f46", margin: 0 }}>Certificate Verified</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: "white", borderRadius: "10px" }}>
                <User size={20} style={{ color: "#94a3b8" }} />
                <div><div style={{ fontSize: "12px", color: "#64748b" }}>Student</div><div style={{ fontSize: "14px", fontWeight: 500, color: "#0f172a" }}>{certificate.registration.user.fullName}</div></div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: "white", borderRadius: "10px" }}>
                <Calendar size={20} style={{ color: "#94a3b8" }} />
                <div><div style={{ fontSize: "12px", color: "#64748b" }}>Event</div><div style={{ fontSize: "14px", fontWeight: 500, color: "#0f172a" }}>{certificate.registration.event.eventTitle}</div></div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: "white", borderRadius: "10px" }}>
                <Hash size={20} style={{ color: "#94a3b8" }} />
                <div><div style={{ fontSize: "12px", color: "#64748b" }}>Certificate No</div><div style={{ fontSize: "14px", fontWeight: 500, color: "#0f172a" }}>{certificate.certificateNumber}</div></div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "16px", padding: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
            <XCircle size={24} style={{ color: "#ef4444" }} />
            <h3 style={{ fontWeight: 600, color: "#dc2626", margin: 0 }}>{error}</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyCertificate;
