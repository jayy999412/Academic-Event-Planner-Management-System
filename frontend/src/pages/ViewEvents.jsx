import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllEvents,
  getCompletedEvents,
  deleteEvent,
} from "../services/eventService";

import {
  Plus,
  Search,
  Eye,
  Edit3,
  Trash2,
  Calendar,
  MapPin,
  Users,
  Image,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

const card = {
  background: "white",
  borderRadius: "16px",
  border: "1px solid #f1f5f9",
  padding: "24px",
};

function ViewEvents() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const isAdmin = role === "ADMIN";

  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);

  // =========================================================
  // LOAD EVENTS
  // =========================================================

  useEffect(() => {
    if (showCompleted) {
      loadCompletedEvents();
    } else {
      loadActiveEvents();
    }
  }, [showCompleted]);

  const loadActiveEvents = async () => {
    try {
      const response = await getAllEvents();
      setEvents(response.data || []);
    } catch (error) {
      console.log("Error loading events:", error);
    }
  };

  const loadCompletedEvents = async () => {
    try {
      const response = await getCompletedEvents();
      setEvents(response.data || []);
    } catch (error) {
      console.log("Error loading completed events:", error);
    }
  };

  // =========================================================
  // DELETE EVENT
  // =========================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteEvent(id);
      alert("Event Deleted Successfully");
      if (showCompleted) {
        loadCompletedEvents();
      } else {
        loadActiveEvents();
      }
    } catch (error) {
      console.log("Delete error:", error);
      alert("Delete Failed");
    }
  };

  // =========================================================
  // FILTER & SORT
  // =========================================================

  const filtered = events
    .filter((event) => {
      if (showCompleted) {
        return event.status === "Completed";
      }
      return event.status !== "Completed";
    })
    .filter((event) =>
      event.eventTitle?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (showCompleted) {
        return new Date(b.eventDate) - new Date(a.eventDate);
      }
      // Newly added first (by createdAt descending)
      const aCreated = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const bCreated = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return bCreated - aCreated;
    });

  // =========================================================
  // EVENT STATUS STYLE
  // =========================================================

  const getStatusStyle = (status) => {
    if (status === "Upcoming") {
      return { background: "#ecfdf5", color: "#059669" };
    }
    if (status === "Ongoing") {
      return { background: "#fffbeb", color: "#d97706" };
    }
    if (status === "Completed") {
      return { background: "#f1f5f9", color: "#64748b" };
    }
    if (status === "Cancelled") {
      return { background: "#fef2f2", color: "#dc2626" };
    }
    return { background: "#f1f5f9", color: "#64748b" };
  };

  // =========================================================
  // STATISTICS
  // =========================================================

  const activeEvents = events.filter((e) => e.status !== "Completed");
  const totalEvents = activeEvents.length;
  const upcomingEvents = activeEvents.filter(
    (event) => event.status === "Upcoming"
  ).length;
  const paidEvents = activeEvents.filter(
    (event) => event.paymentRequired === true
  ).length;
  const quizEvents = activeEvents.filter(
    (event) => event.quizRequired === true
  ).length;

  // =========================================================
  // UI
  // =========================================================

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#0f172a",
              margin: 0,
            }}
          >
            {showCompleted ? "Completed Events" : "Events"}
          </h1>

          <p
            style={{
              color: "#64748b",
              marginTop: "4px",
              fontSize: "14px",
            }}
          >
            {showCompleted
              ? "View all past completed events"
              : "Manage all academic events"}
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {/* VIEW COMPLETED / BACK TO EVENTS */}
          <button
            onClick={() => {
              setShowCompleted(!showCompleted);
              setSearch("");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              background: showCompleted
                ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                : "white",
              color: showCompleted ? "white" : "#475569",
              border: showCompleted ? "none" : "1.5px solid #e2e8f0",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {showCompleted ? (
              <>
                <ArrowLeft size={17} />
                Back to Events
              </>
            ) : (
              <>
                <CheckCircle size={17} />
                View Completed Events
              </>
            )}
          </button>

          {/* ADD EVENT */}
          {isAdmin && !showCompleted && (
            <button
              onClick={() => navigate("/add-event")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                background:
                  "linear-gradient(135deg, #2563eb, #1d4ed8)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow:
                  "0 4px 12px rgba(37, 99, 235, 0.3)",
              }}
            >
              <Plus size={17} />
              Add Event
            </button>
          )}
        </div>
      </div>

      {/* =====================================================
          STATISTICS
      ====================================================== */}

      {!showCompleted && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
          }}
        >
          {[
            {
              label: "Total Events",
              value: totalEvents,
              color: "#2563eb",
              bg: "#eff6ff",
            },
            {
              label: "Upcoming",
              value: upcomingEvents,
              color: "#059669",
              bg: "#ecfdf5",
            },
            {
              label: "Paid Events",
              value: paidEvents,
              color: "#d97706",
              bg: "#fffbeb",
            },
            {
              label: "Quiz Events",
              value: quizEvents,
              color: "#4f46e5",
              bg: "#eef2ff",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                ...card,
                padding: "16px",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: stat.color,
                }}
              >
                {stat.value}
              </div>

              <div
                style={{
                  fontSize: "13px",
                  color: "#64748b",
                  marginTop: "4px",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =====================================================
          SEARCH
      ====================================================== */}

      <div
        style={{
          position: "relative",
          maxWidth: "380px",
        }}
      >
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
          placeholder={
            showCompleted
              ? "Search completed events..."
              : "Search events..."
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 16px 10px 40px",
            background: "white",
            border: "1.5px solid #e2e8f0",
            borderRadius: "10px",
            fontSize: "14px",
            color: "#1e293b",
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#93c5fd";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#e2e8f0";
          }}
        />
      </div>

      {/* =====================================================
          EVENT GRID
      ====================================================== */}

      {filtered.length === 0 ? (
        <div
          style={{
            ...card,
            padding: "48px",
            textAlign: "center",
          }}
        >
          <Calendar
            size={40}
            style={{
              color: "#cbd5e1",
              margin: "0 auto 12px",
              display: "block",
            }}
          />

          <p style={{ color: "#64748b" }}>
            {showCompleted
              ? "No completed events found"
              : "No events found"}
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
          }}
        >
          {filtered.map((event) => {
            const statusStyle = getStatusStyle(event.status);

            return (
              <div
                key={event.id}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  border: "1px solid #f1f5f9",
                  overflow: "hidden",
                  transition: "box-shadow 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 10px 30px rgba(0,0,0,0.08)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* BANNER */}
                {event.bannerImage && (
                  <div
                    style={{
                      height: "160px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={`http://localhost:8080/uploads/${event.bannerImage}`}
                      alt={event.eventTitle}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}

                {/* CONTENT */}
                <div style={{ padding: "16px" }}>
                  {/* TITLE + STATUS */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "#0f172a",
                        margin: 0,
                        flex: 1,
                      }}
                    >
                      {event.eventTitle}
                    </h3>

                    <span
                      style={{
                        padding: "3px 9px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        ...statusStyle,
                      }}
                    >
                      {event.status}
                    </span>
                  </div>

                  {/* EVENT INFORMATION */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      fontSize: "13px",
                      color: "#64748b",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <MapPin size={13} />
                      {event.venue?.venueName || "Not specified"}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Calendar size={13} />
                      {event.eventDate}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Users size={13} />
                      {event.maxParticipants || "Unlimited"}{" "}
                      {event.maxParticipants ? "seats" : ""}
                    </div>
                  </div>

                  {/* BUTTONS */}
                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                    }}
                  >
                    <button
                      onClick={() => navigate(`/event/${event.id}`)}
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                        padding: "8px",
                        background: "#eff6ff",
                        color: "#2563eb",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 500,
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <Eye size={13} />
                      View
                    </button>

                    <button
                      onClick={() => navigate(`/gallery/${event.id}`)}
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                        padding: "8px",
                        background: "#eef2ff",
                        color: "#4f46e5",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 500,
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <Image size={13} />
                      Gallery
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => navigate(`/edit-event/${event.id}`)}
                        style={{
                          width: "32px",
                          height: "32px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#ecfdf5",
                          color: "#059669",
                          borderRadius: "8px",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <Edit3 size={13} />
                      </button>
                    )}

                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(event.id)}
                        style={{
                          width: "32px",
                          height: "32px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#fef2f2",
                          color: "#dc2626",
                          borderRadius: "8px",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ViewEvents;
