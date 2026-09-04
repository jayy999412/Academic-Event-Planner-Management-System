import { useEffect, useState } from "react";
import api from "../services/api";
import { ArrowLeft, User, Mail, Phone, Building2, Shield, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const card = { background: "white", borderRadius: "16px", border: "1px solid #f1f5f9" };

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/users/profile", { headers: { Authorization: `Bearer ${token}` } });
        setUser(response.data);
      } catch (err) { console.log(err); }
    };
    fetchProfile();
  }, []);

  if (!user) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "256px" }}><div style={{ width: "32px", height: "32px", border: "4px solid #2563eb", borderTop: "4px solid transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div></div>;

  return (
    <div style={{ maxWidth: "768px", margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: "24px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button onClick={() => navigate(-1)} style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", background: "white", border: "1px solid #e2e8f0", color: "#475569", cursor: "pointer" }}>
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a", margin: 0 }}>My Profile</h1>
      </div>

      <div style={{ ...card, overflow: "hidden" }}>
        <div style={{ height: "128px", background: "linear-gradient(135deg, #2563eb, #6366f1)", position: "relative" }}>
          <div style={{ position: "absolute", bottom: "-48px", left: "32px" }}>
            <div style={{ width: "96px", height: "96px", background: "white", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", border: "4px solid white" }}>
              <div style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #3b82f6, #6366f1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User size={40} style={{ color: "white" }} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ paddingTop: "64px", padding: "64px 32px 32px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a", margin: 0 }}>{user.fullName}</h2>
              <p style={{ color: "#64748b", margin: 0 }}>{user.role?.roleName}</p>
            </div>
            <span style={{ padding: "4px 12px", background: "#eff6ff", color: "#1d4ed8", borderRadius: "9999px", fontSize: "14px", fontWeight: 500 }}>{user.role?.roleName}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {[
              { icon: Mail, label: "Email Address", value: user.email },
              { icon: Phone, label: "Phone Number", value: user.phoneNumber },
              { icon: Building2, label: "Department", value: user.department },
              { icon: Shield, label: "Role", value: user.role?.roleName },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", background: "#f8fafc", borderRadius: "10px" }}>
                  <div style={{ width: "40px", height: "40px", background: "white", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                    <Icon size={20} style={{ color: "#2563eb" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>{item.label}</div>
                    <div style={{ fontSize: "14px", fontWeight: 500, color: "#0f172a" }}>{item.value}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={() => navigate("/change-password")}
            style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "24px", padding: "10px 20px", background: "#f1f5f9", color: "#334155", borderRadius: "10px", fontWeight: 500, border: "none", cursor: "pointer", fontSize: "14px" }}
            onMouseOver={(e) => { e.currentTarget.style.background = "#e2e8f0"; }} onMouseOut={(e) => { e.currentTarget.style.background = "#f1f5f9"; }}>
            <Edit3 size={16} /> Change Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
