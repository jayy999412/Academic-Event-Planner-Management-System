import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div style={{
        marginLeft: collapsed ? "72px" : "250px",
        transition: "margin-left 0.3s ease",
      }}>
        <Navbar />
        <main style={{ padding: "24px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
