import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";

import NotificationBell from "../components/NotificationBell";

function Navbar() {

  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);

  const ref = useRef();

  useEffect(() => {

    const handler = (e) => {

      if (ref.current && !ref.current.contains(e.target)) {

        setProfileOpen(false);

      }

    };

    document.addEventListener("mousedown", handler);

    return () => {

      document.removeEventListener("mousedown", handler);

    };

  }, []);

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");

    navigate("/");

  };

  return (

    <header
      style={{
        height: "64px",
        background: "white",
        borderBottom: "1px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
    >

      {/* Search */}

      <div style={{ flex: 1, maxWidth: "480px" }}>

        <div style={{ position: "relative" }}>

          <Search
            size={16}
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
            }}
          />

          <input
            type="text"
            placeholder="Search events, quizzes, participants..."
            style={{
              width: "100%",
              padding: "10px 16px 10px 40px",
              background: "#f8fafc",
              border: "1.5px solid #e2e8f0",
              borderRadius: "10px",
              fontSize: "14px",
              color: "#1e293b",
              outline: "none",
              boxSizing: "border-box",
              transition: "all 0.2s",
            }}
            onFocus={(e) => {

              e.target.style.background = "white";

              e.target.style.borderColor = "#93c5fd";

            }}
            onBlur={(e) => {

              e.target.style.background = "#f8fafc";

              e.target.style.borderColor = "#e2e8f0";

            }}
          />

        </div>

      </div>

      {/* Right Side */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >

        {/* Notification Bell */}

        <NotificationBell />

        {/* Profile */}

        <div ref={ref} style={{ position: "relative" }}>

          <button
            onClick={() => setProfileOpen(!profileOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 10px",
              borderRadius: "10px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
            onMouseOver={(e) => {

              e.currentTarget.style.background = "#f8fafc";

            }}
            onMouseOut={(e) => {

              e.currentTarget.style.background = "transparent";

            }}
          >

            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg,#3b82f6,#6366f1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >

              <User size={16} />

            </div>

            <ChevronDown
              size={14}
              style={{ color: "#94a3b8" }}
            />

          </button>

          {

            profileOpen && (

              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "100%",
                  marginTop: "8px",
                  width: "220px",
                  background: "white",
                  borderRadius: "14px",
                  boxShadow:
                    "0 20px 60px rgba(0,0,0,0.12)",
                  border: "1px solid #f1f5f9",
                  padding: "6px",
                  zIndex: 50,
                }}
              >

                <button
                  onClick={() => {

                    navigate("/profile");

                    setProfileOpen(false);

                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "none",
                    background: "transparent",
                    fontSize: "14px",
                    color: "#334155",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >

                  <User size={16} />

                  My Profile

                </button>

                <button
                  onClick={() => {

                    navigate("/change-password");

                    setProfileOpen(false);

                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "none",
                    background: "transparent",
                    fontSize: "14px",
                    color: "#334155",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >

                  <Settings size={16} />

                  Settings

                </button>

                <div
                  style={{
                    height: "1px",
                    background: "#f1f5f9",
                    margin: "4px 0",
                  }}
                ></div>

                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "none",
                    background: "transparent",
                    fontSize: "14px",
                    color: "#ef4444",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >

                  <LogOut size={16} />

                  Logout

                </button>

              </div>

            )

          }

        </div>

      </div>

    </header>

  );

}

export default Navbar;
