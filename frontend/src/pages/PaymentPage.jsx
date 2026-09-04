import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { payNow } from "../services/paymentService";
import { getStudentRegistrations } from "../services/registrationService";
import { ArrowLeft, CreditCard, Shield, CheckCircle } from "lucide-react";

const card = { background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", padding: "24px" };

function PaymentPage() {
  const { registrationId } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [registration, setRegistration] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  useEffect(() => { loadRegistration(); }, []);

  const loadRegistration = async () => {
    try { const r = await getStudentRegistrations(userId); setRegistration(r.data.find(reg => reg.id === Number(registrationId))); } catch (e) { console.log(e); }
  };

  const handlePayment = async () => {
    try {
      await payNow({ registrationId: registration.id, amount: registration.event.registrationFee, paymentMethod });
      alert("Payment Successful"); navigate("/my-registrations");
    } catch (e) { console.log(e); alert("Payment Failed"); }
  };

  if (!registration) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "256px" }}><div style={{ width: "32px", height: "32px", border: "4px solid #2563eb", borderTop: "4px solid transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div></div>;

  const methods = [
    { id: "UPI", label: "UPI", desc: "Google Pay, PhonePe, Paytm" },
    { id: "Card", label: "Credit/Debit Card", desc: "Visa, Mastercard, RuPay" },
    { id: "Net Banking", label: "Net Banking", desc: "All major banks" },
  ];

  return (
    <div style={{ maxWidth: "512px", margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: "24px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button onClick={() => navigate(-1)} style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", background: "white", border: "1px solid #e2e8f0", color: "#475569", cursor: "pointer" }}>
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Payment</h1>
      </div>

      <div style={card}>
        <div style={{ background: "linear-gradient(135deg, #eff6ff, #eef2ff)", borderRadius: "10px", padding: "20px", marginBottom: "24px" }}>
          <h3 style={{ fontWeight: 600, color: "#0f172a", margin: "0 0 4px 0" }}>{registration.event.eventTitle}</h3>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>Registration #{registration.id}</p>
          <div style={{ marginTop: "12px", fontSize: "30px", fontWeight: 700, color: "#2563eb" }}>₹ {registration.event.registrationFee}</div>
        </div>

        <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#334155", marginBottom: "12px" }}>Select Payment Method</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
          {methods.map(m => (
            <label key={m.id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", borderRadius: "10px", border: `2px solid ${paymentMethod === m.id ? "#2563eb" : "#e2e8f0"}`, background: paymentMethod === m.id ? "rgba(37,99,235,0.04)" : "white", cursor: "pointer", transition: "all 0.2s" }}>
              <input type="radio" name="payment" value={m.id} checked={paymentMethod === m.id} onChange={(e) => setPaymentMethod(e.target.value)} style={{ width: "16px", height: "16px", accentColor: "#2563eb" }} />
              <div>
                <div style={{ fontSize: "14px", fontWeight: 500, color: "#0f172a" }}>{m.label}</div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>{m.desc}</div>
              </div>
            </label>
          ))}
        </div>

        <button onClick={handlePayment}
          style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #10b981, #059669)", color: "white", fontWeight: 600, borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "14px", boxShadow: "0 4px 12px rgba(16,185,129,0.25)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
          onMouseOver={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #059669, #047857)"; }}
          onMouseOut={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #10b981, #059669)"; }}>
          <Shield size={20} /> Pay ₹ {registration.event.registrationFee}
        </button>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "16px", fontSize: "12px", color: "#94a3b8" }}>
          <CheckCircle size={16} /> Secure payment powered by Razorpay
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
