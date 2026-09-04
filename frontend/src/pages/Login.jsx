import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { GraduationCap, Mail, Lock, Eye, EyeOff } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      localStorage.setItem("token", response.token);
      localStorage.setItem("userId", response.userId);
      localStorage.setItem("role", response.roleName);
      alert("Login Successful");
      navigate("/dashboard");
    } catch (error) {
      alert("Invalid Email or Password");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>
      {/* Left Side */}
      <div
        className="hidden lg:flex"
        style={{
          width: "50%",
          background: "linear-gradient(135deg, #2563eb, #4f46e5)",
          position: "relative",
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "400px", height: "400px", background: "rgba(255,255,255,0.05)", borderRadius: "50%" }}></div>
        <div style={{ position: "absolute", bottom: "-150px", left: "-100px", width: "500px", height: "500px", background: "rgba(255,255,255,0.03)", borderRadius: "50%" }}></div>

        <div style={{ position: "relative", zIndex: 10, color: "white", maxWidth: "500px" }}>
          <div
            style={{
              width: "70px",
              height: "70px",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "40px",
            }}
          >
            <GraduationCap size={36} />
          </div>
          <h1 style={{ fontSize: "48px", fontWeight: 700, lineHeight: 1.15, marginBottom: "16px" }}>
            Academic Event<br />Management System
          </h1>
          <p style={{ fontSize: "18px", opacity: 0.8, lineHeight: 1.7, marginBottom: "50px" }}>
            Organize, manage, and track academic events with a modern, professional platform designed for educational institutions.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px" }}>
            <div>
              <div style={{ fontSize: "32px", fontWeight: 700 }}>500+</div>
              <div style={{ fontSize: "14px", opacity: 0.6, marginTop: "4px" }}>Events Managed</div>
            </div>
            <div>
              <div style={{ fontSize: "32px", fontWeight: 700 }}>10K+</div>
              <div style={{ fontSize: "14px", opacity: 0.6, marginTop: "4px" }}>Students</div>
            </div>
            <div>
              <div style={{ fontSize: "32px", fontWeight: 700 }}>99%</div>
              <div style={{ fontSize: "14px", opacity: 0.6, marginTop: "4px" }}>Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div
        style={{
          width: "100%",
          maxWidth: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          background: "#f8fafc",
        }}
      >
        <div style={{ width: "100%", maxWidth: "420px" }}>
          {/* Mobile Logo */}
          <div
            className="lg:hidden"
            style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px" }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <GraduationCap size={24} />
            </div>
            <span style={{ fontWeight: 700, fontSize: "18px", color: "#0f172a" }}>AEMS</span>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: "20px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
              border: "1px solid #f1f5f9",
              padding: "40px",
            }}
          >
            <div style={{ marginBottom: "32px" }}>
              <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>Welcome back</h2>
              <p style={{ color: "#64748b", fontSize: "15px" }}>Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#334155", marginBottom: "8px" }}>
                  Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <Mail size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                    onChange={handleChange}
                    style={{
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
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "#3b82f6"; e.target.style.background = "white"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#334155", marginBottom: "8px" }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <Lock size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    required
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "14px 44px 14px 44px",
                      border: "1.5px solid #e2e8f0",
                      borderRadius: "12px",
                      fontSize: "15px",
                      color: "#1e293b",
                      background: "#f8fafc",
                      boxSizing: "border-box",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "#3b82f6"; e.target.style.background = "white"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#94a3b8",
                      padding: "4px",
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", color: "#475569" }}>
                  <input type="checkbox" style={{ width: "16px", height: "16px", borderRadius: "4px", accentColor: "#2563eb" }} />
                  Remember me
                </label>
                <button type="button" style={{ background: "none", border: "none", fontSize: "14px", color: "#2563eb", fontWeight: 500, cursor: "pointer" }}>
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(37, 99, 235, 0.3)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseOver={(e) => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 6px 20px rgba(37, 99, 235, 0.4)"; }}
                onMouseOut={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 15px rgba(37, 99, 235, 0.3)"; }}
              >
                Sign In
              </button>
            </form>

            <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "#64748b" }}>
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                style={{ background: "none", border: "none", color: "#2563eb", fontWeight: 600, cursor: "pointer", fontSize: "14px" }}
              >
                Create account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
