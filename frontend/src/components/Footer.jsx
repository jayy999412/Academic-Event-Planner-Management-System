import { GraduationCap } from "lucide-react";

function Footer() {
  return (
    <footer style={{
      background: "white", borderTop: "1px solid #e2e8f0",
      padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ width: "28px", height: "28px", background: "linear-gradient(135deg, #2563eb, #4f46e5)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <GraduationCap size={14} style={{ color: "white" }} />
        </div>
        <span style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Academic Event Management</span>
      </div>
      <p style={{ fontSize: "12px", color: "#94a3b8" }}>
        &copy; {new Date().getFullYear()} AEMS. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
