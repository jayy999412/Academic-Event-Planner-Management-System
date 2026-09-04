import { useState } from "react";
import api from "../services/api";
import { ArrowLeft, Lock, Eye, EyeOff, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const card = { background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", padding: "24px" };
const inp = { width: "100%", padding: "12px 14px", border: "1.5px solid #e2e8f0", borderRadius: "10px", fontSize: "14px", color: "#1e293b", background: "#f8fafc", boxSizing: "border-box", outline: "none" };
const lbl = { display: "block", fontSize: "13px", fontWeight: 500, color: "#475569", marginBottom: "6px" };

function ChangePassword() {
  const navigate = useNavigate();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [formData, setFormData] = useState({ currentPassword: "", newPassword: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/users/change-password", formData, { headers: { Authorization: `Bearer ${token}` } });
      alert(response.data);
      setFormData({ currentPassword: "", newPassword: "" });
    } catch (err) { alert(err.response?.data || "Password change failed"); }
  };

  return (
    <div style={{ maxWidth: "512px", margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: "24px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button onClick={() => navigate(-1)} style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", background: "white", border: "1px solid #e2e8f0", color: "#475569", cursor: "pointer" }}>
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Change Password</h1>
      </div>

      <div style={{ ...card, padding: "32px" }}>
        <div style={{ width: "64px", height: "64px", background: "#eff6ff", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <Shield size={32} style={{ color: "#2563eb" }} />
        </div>
        <p style={{ textAlign: "center", color: "#64748b", marginBottom: "32px", fontSize: "14px" }}>Update your password to keep your account secure</p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={lbl}>Current Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={20} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input type={showCurrent ? "text" : "password"} name="currentPassword" placeholder="Enter current password" value={formData.currentPassword} onChange={handleChange} required
                style={{ ...inp, paddingLeft: "44px", paddingRight: "48px" }} />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: 0 }}>
                {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label style={lbl}>New Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={20} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input type={showNew ? "text" : "password"} name="newPassword" placeholder="Enter new password" value={formData.newPassword} onChange={handleChange} required
                style={{ ...inp, paddingLeft: "44px", paddingRight: "48px" }} />
              <button type="button" onClick={() => setShowNew(!showNew)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: 0 }}>
                {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button type="submit"
            style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "white", fontWeight: 600, borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "14px", boxShadow: "0 4px 12px rgba(37,99,235,0.25)" }}
            onMouseOver={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #1d4ed8, #1e40af)"; }}
            onMouseOut={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #2563eb, #1d4ed8)"; }}>
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
