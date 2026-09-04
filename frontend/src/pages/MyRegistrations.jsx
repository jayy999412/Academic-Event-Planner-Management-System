import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getStudentRegistrations, cancelRegistration } from "../services/registrationService";
import { getPaymentByRegistration } from "../services/paymentService";
import { ArrowLeft, Calendar, MapPin, CreditCard, Download, XCircle, Clock } from "lucide-react";

function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => { loadRegistrations(); }, []);

  const loadRegistrations = async () => {
    try { const r = await getStudentRegistrations(userId); setRegistrations(r.data); } catch (e) { console.log(e); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this registration?")) return;
    try { await cancelRegistration(id); alert("Registration Cancelled"); loadRegistrations(); } catch (e) { console.log(e); alert("Cancellation Failed"); }
  };

  const downloadReceipt = async (registrationId) => {
    try {
      const paymentResponse = await getPaymentByRegistration(registrationId);
      const paymentId = paymentResponse.data.id;
      const response = await axios.get(`http://localhost:8080/api/receipts/download/${paymentId}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url; link.download = "Receipt.pdf"; document.body.appendChild(link); link.click(); link.remove();
    } catch (e) { console.log(e); alert("Unable to download receipt"); }
  };

  const statusColors = {
    Approved: { background: "#ecfdf5", color: "#047857" },
    Rejected: { background: "#fef2f2", color: "#dc2626" },
    Cancelled: { background: "#f1f5f9", color: "#64748b" },
    Pending: { background: "#fffbeb", color: "#b45309" },
  };

  return (
    <div style={{ padding: "32px 24px", display: "flex", flexDirection: "column", gap: "24px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button onClick={() => navigate(-1)} style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", background: "white", border: "1px solid #e2e8f0", color: "#475569", cursor: "pointer" }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a", margin: 0 }}>My Registrations</h1>
          <p style={{ color: "#64748b", marginTop: "2px", fontSize: "14px" }}>{registrations.length} total registrations</p>
        </div>
      </div>

      {registrations.length === 0 ? (
        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", padding: "48px", textAlign: "center" }}>
          <Calendar size={48} style={{ color: "#cbd5e1", margin: "0 auto 12px" }} />
          <p style={{ color: "#64748b", margin: 0 }}>No registrations found</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {registrations.map(reg => (
            <div key={reg.id} style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", padding: "20px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px" }}>
                {reg.event?.bannerImage && (
                  <img src={`http://localhost:8080/uploads/${reg.event.bannerImage}`} alt="" loading="lazy" style={{ width: "100%", maxWidth: "96px", height: "80px", objectFit: "cover", borderRadius: "10px" }} />
                )}
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                    <h3 style={{ fontWeight: 600, color: "#0f172a", margin: 0 }}>{reg.event?.eventTitle}</h3>
                    <span style={{ padding: "2px 10px", borderRadius: "9999px", fontSize: "12px", fontWeight: 500, ...(statusColors[reg.status] || statusColors.Pending) }}>{reg.status}</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px", fontSize: "14px", color: "#64748b" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Calendar size={16} />{reg.event?.eventDate}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><MapPin size={16} />{reg.event?.venue?.venueName}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Clock size={16} />{reg.registrationDate}</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {reg.paymentStatus === "SUCCESS" ? (
                    <>
                      <span style={{ padding: "6px 12px", background: "#ecfdf5", color: "#047857", borderRadius: "8px", fontSize: "12px", fontWeight: 500, display: "flex", alignItems: "center", gap: "4px" }}>
                        <CreditCard size={14} /> Paid
                      </span>
                      <button onClick={() => downloadReceipt(reg.id)}
                        style={{ padding: "6px 12px", background: "#eff6ff", color: "#1d4ed8", borderRadius: "8px", fontSize: "12px", fontWeight: 500, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                        onMouseOver={(e) => { e.currentTarget.style.background = "#dbeafe"; }} onMouseOut={(e) => { e.currentTarget.style.background = "#eff6ff"; }}>
                        <Download size={14} /> Receipt
                      </button>
                    </>
                  ) : (
                    <button onClick={() => navigate(`/payment/${reg.id}`)}
                      style={{ padding: "6px 16px", background: "#10b981", color: "white", borderRadius: "8px", fontSize: "12px", fontWeight: 500, border: "none", cursor: "pointer" }}
                      onMouseOver={(e) => { e.currentTarget.style.background = "#059669"; }} onMouseOut={(e) => { e.currentTarget.style.background = "#10b981"; }}>
                      Pay Now
                    </button>
                  )}
                  {reg.status !== "Cancelled" && (
                    <button onClick={() => handleCancel(reg.id)}
                      style={{ padding: "6px 12px", background: "#fef2f2", color: "#dc2626", borderRadius: "8px", fontSize: "12px", fontWeight: 500, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                      onMouseOver={(e) => { e.currentTarget.style.background = "#fee2e2"; }} onMouseOut={(e) => { e.currentTarget.style.background = "#fef2f2"; }}>
                      <XCircle size={14} /> Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRegistrations;
