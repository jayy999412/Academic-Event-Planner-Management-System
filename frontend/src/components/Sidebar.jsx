import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Calendar, Users, Award, CreditCard,
  FileText, ClipboardCheck, BarChart3, Bell, User,
  Settings, LogOut, ChevronLeft, ChevronRight, GraduationCap,
  MessageSquare, History
} from "lucide-react";

const allMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", adminOnly: true },
  { icon: Calendar, label: "Events", path: "/events", adminOnly: false },
  { icon: Users, label: "Participants", path: "/my-registrations", adminOnly: false },
  { icon: Award, label: "Certificates", path: "/admin-certificates", adminOnly: true },
  { icon: Award, label: "My Certificates", path: "/my-certificates", adminOnly: false },
  { icon: CreditCard, label: "Payments", path: "/my-registrations", adminOnly: false },
  { icon: FileText, label: "Quiz Management", path: "/quiz", adminOnly: true },
  { icon: ClipboardCheck, label: "Attendance", path: "/quiz-results", adminOnly: false },
  { icon: BarChart3, label: "Reports", path: "/reports", adminOnly: true },
  { icon: MessageSquare, label: "Feedback", path: "/admin-feedback", adminOnly: true },
  { icon: MessageSquare, label: "Submit Feedback", path: "/feedback", adminOnly: false },
  { icon: History, label: "My Feedback", path: "/feedback-history", adminOnly: false },
  { icon: Bell, label: "Notifications", path: "/notifications", adminOnly: false },
  { icon: User, label: "Profile", path: "/profile", adminOnly: false },
  { icon: Settings, label: "Settings", path: "/change-password", adminOnly: false },
];

function Sidebar({ collapsed, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");
  const isAdmin = role === "ADMIN";

  const menuItems = allMenuItems.filter(item => {
    if (item.adminOnly) return isAdmin;
    return true;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <aside style={{
      position: "fixed", top: 0, left: 0, height: "100vh",
      width: collapsed ? "72px" : "250px",
      background: "white",
      borderRight: "1px solid #e2e8f0",
      zIndex: 40,
      display: "flex", flexDirection: "column",
      transition: "width 0.3s ease",
      overflow: "hidden",
    }}>
      {/* Logo */}
      <div style={{
        height: "64px", display: "flex", alignItems: "center", gap: "12px",
        padding: "0 16px", borderBottom: "1px solid #f1f5f9", flexShrink: 0,
      }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "10px",
          background: "linear-gradient(135deg, #2563eb, #4f46e5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, color: "white",
        }}>
          <GraduationCap size={20} />
        </div>
        {!collapsed && <span style={{ fontWeight: 700, fontSize: "14px", color: "#0f172a", whiteSpace: "nowrap" }}>Academic Events</span>}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button key={item.path + item.label} onClick={() => navigate(item.path)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: "12px",
                padding: "10px 12px", borderRadius: "10px", border: "none",
                fontSize: "14px", fontWeight: 500, cursor: "pointer",
                marginBottom: "2px",
                background: isActive ? "#eff6ff" : "transparent",
                color: isActive ? "#1d4ed8" : "#64748b",
                justifyContent: collapsed ? "center" : "flex-start",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => { if (!isActive) { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.color = "#334155"; } }}
              onMouseOut={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; } }}
            >
              <Icon size={20} style={{ flexShrink: 0, color: isActive ? "#2563eb" : undefined }} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Collapse */}
      <div style={{ padding: "0 8px 8px" }}>
        <button onClick={onToggle}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            padding: "10px", borderRadius: "10px", border: "none",
            fontSize: "13px", fontWeight: 500, cursor: "pointer",
            background: "transparent", color: "#94a3b8",
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.color = "#64748b"; }}
          onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>

      {/* Logout */}
      <div style={{ padding: "0 8px 12px", borderTop: "1px solid #f1f5f9", paddingTop: "8px" }}>
        <button onClick={handleLogout}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: "12px",
            padding: "10px 12px", borderRadius: "10px", border: "none",
            fontSize: "14px", fontWeight: 500, cursor: "pointer",
            background: "transparent", color: "#ef4444",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = "#fef2f2"; }}
          onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <LogOut size={20} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
