import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, getRoles } from "../services/authService";
import { GraduationCap, Mail, Lock, User, Phone, Building2, Shield, Eye, EyeOff } from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "", email: "", password: "", phoneNumber: "", department: "", role: { id: 2 }
  });

  useEffect(() => {
    getRoles().then(setRoles).catch(() => {});
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      alert("Registration Successful");
      navigate("/");
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data || "Registration Failed";
      alert(typeof msg === "string" ? msg : JSON.stringify(msg));
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 14px 14px 44px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "15px",
    color: "#1e293b",
    background: "#f8fafc",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const inputWrap = { position: "relative" };

  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>
      {/* Left Side */}
      <div
        className="hidden lg:flex"
        style={{
          width: "50%",
          background: "linear-gradient(135deg, #4f46e5, #2563eb)",
          position: "relative",
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "400px", height: "400px", background: "rgba(255,255,255,0.05)", borderRadius: "50%" }}></div>
        <div style={{ position: "absolute", bottom: "-150px", left: "-100px", width: "500px", height: "500px", background: "rgba(255,255,255,0.03)", borderRadius: "50%" }}></div>
        <div style={{ position: "relative", zIndex: 10, color: "white", maxWidth: "500px" }}>
          <div style={{ width: "70px", height: "70px", background: "rgba(255,255,255,0.15)", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "40px" }}>
            <GraduationCap size={36} />
          </div>
          <h1 style={{ fontSize: "48px", fontWeight: 700, lineHeight: 1.15, marginBottom: "16px" }}>Join Our<br />Community</h1>
          <p style={{ fontSize: "18px", opacity: 0.8, lineHeight: 1.7 }}>Create your account and start managing academic events with our powerful platform.</p>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div style={{ width: "100%", maxWidth: "50%", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", background: "#f8fafc" }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>
          <div className="lg:hidden" style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px" }}>
            <div style={{ width: "42px", height: "42px", background: "linear-gradient(135deg, #2563eb, #4f46e5)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
              <GraduationCap size={24} />
            </div>
            <span style={{ fontWeight: 700, fontSize: "18px", color: "#0f172a" }}>AEMS</span>
          </div>

          <div style={{ background: "white", borderRadius: "20px", boxShadow: "0 20px 60px rgba(0,0,0,0.08)", border: "1px solid #f1f5f9", padding: "40px" }}>
            <div style={{ marginBottom: "28px" }}>
              <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>Create an account</h2>
              <p style={{ color: "#64748b", fontSize: "15px" }}>Fill in your details to get started</p>
            </div>

            <form onSubmit={handleSubmit}>
              {[
                { icon: User, name: "fullName", type: "text", placeholder: "John Doe", label: "Full Name" },
                { icon: Mail, name: "email", type: "email", placeholder: "you@example.com", label: "Email Address" },
                { icon: Phone, name: "phoneNumber", type: "text", placeholder: "+91 98765 43210", label: "Phone Number" },
                { icon: Building2, name: "department", type: "text", placeholder: "Computer Science", label: "Department" },
              ].map((field) => {
                const Icon = field.icon;
                return (
                  <div key={field.name} style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#334155", marginBottom: "6px" }}>{field.label}</label>
                    <div style={inputWrap}>
                      <Icon size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                      <input type={field.type} name={field.name} placeholder={field.placeholder} value={formData[field.name]} onChange={handleChange} required
                        style={inputStyle}
                        onFocus={(e) => { e.target.style.borderColor = "#3b82f6"; e.target.style.background = "white"; }}
                        onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; }}
                      />
                    </div>
                  </div>
                );
              })}

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#334155", marginBottom: "6px" }}>I am a</label>
                <div style={inputWrap}>
                  <Shield size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                  <select
                    name="role"
                    value={formData.role.id}
                    onChange={(e) => setFormData({ ...formData, role: { id: Number(e.target.value) } })}
                    required
                    style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                    onFocus={(e) => { e.target.style.borderColor = "#3b82f6"; e.target.style.background = "white"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; }}
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>{r.roleName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#334155", marginBottom: "6px" }}>Password</label>
                <div style={inputWrap}>
                  <Lock size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                  <input type={showPassword ? "text" : "password"} name="password" placeholder="Create a password" value={formData.password} onChange={handleChange} required
                    style={{ ...inputStyle, paddingRight: "44px" }}
                    onFocus={(e) => { e.target.style.borderColor = "#3b82f6"; e.target.style.background = "white"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: "4px" }}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit"
                style={{
                  width: "100%", padding: "14px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "white",
                  border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: 600, cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(37, 99, 235, 0.3)", marginTop: "8px",
                }}>
                Create Account
              </button>
            </form>

            <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "#64748b" }}>
              Already have an account?{" "}
              <Link to="/" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
