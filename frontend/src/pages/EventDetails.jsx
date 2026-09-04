import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getEventById } from "../services/eventService";
import { getGallery } from "../services/galleryService";
import {
  registerEvent,
  checkRegistration,
} from "../services/registrationService";

import {
  ArrowLeft,
  Edit3,
  Users,
  Calendar,
  Clock,
  MapPin,
  Mail,
  User,
  IndianRupee,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

const card = {
  background: "white",
  borderRadius: "16px",
  border: "1px solid #f1f5f9",
  padding: "24px",
};

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const isAdmin = role === "ADMIN";

  const [event, setEvent] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [registered, setRegistered] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    loadEvent();
    loadGallery();
    checkStudentRegistration();
  }, [id]);

  // =========================
  // LOAD EVENT
  // =========================
  const loadEvent = async () => {
    try {
      const r = await getEventById(id);
      setEvent(r.data);
    } catch (e) {
      console.log(e);
    }
  };

  // =========================
  // LOAD GALLERY
  // =========================
  const loadGallery = async () => {
    try {
      const r = await getGallery(id);
      setGallery(r.data);
    } catch (e) {
      console.log(e);
    }
  };

  // =========================
  // CHECK REGISTRATION
  // =========================
  const checkStudentRegistration = async () => {
    try {
      if (!userId) return;

      const r = await checkRegistration(userId, id);
      setRegistered(r.data);
    } catch (e) {
      console.log(e);
    }
  };

  // =========================
  // REGISTER EVENT
  // =========================
  const handleRegister = async () => {
    try {
      await registerEvent({
        userId: Number(userId),
        eventId: Number(id),
      });

      alert("Event Registered Successfully");
      setRegistered(true);
    } catch (error) {
      console.log(error);
      alert(error.response?.data || "Registration Failed");
    }
  };

  // =========================
  // STATUS COLORS
  // =========================
  const getStatusStyle = (status) => {
    if (status === "Upcoming") {
      return { background: "#ecfdf5", color: "#047857" };
    }
    if (status === "Ongoing") {
      return { background: "#fffbeb", color: "#b45309" };
    }
    if (status === "Completed") {
      return { background: "#f1f5f9", color: "#475569" };
    }
    if (status === "Cancelled") {
      return { background: "#fef2f2", color: "#dc2626" };
    }
    return { background: "#f1f5f9", color: "#475569" };
  };

  if (!event) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "256px",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            border: "4px solid #2563eb",
            borderTop: "4px solid transparent",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
      </div>
    );
  }

  // Get status from backend
  const eventStatus = event.status;

  return (
    <div
      style={{
        maxWidth: "1024px",
        margin: "0 auto",
        padding: "32px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* =========================
          PAGE HEADER
      ========================= */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "10px",
            background: "white",
            border: "1px solid #e2e8f0",
            color: "#475569",
            cursor: "pointer",
          }}
        >
          <ArrowLeft size={20} />
        </button>

        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#0f172a",
            margin: 0,
          }}
        >
          Event Details
        </h1>
      </div>

      {/* =========================
          EVENT BANNER
      ========================= */}
      {event.bannerImage && (
        <div
          style={{
            borderRadius: "16px",
            overflow: "hidden",
            height: "256px",
          }}
        >
          <img
            src={`http://localhost:8080/uploads/${event.bannerImage}`}
            alt="Event Banner"
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      )}

      {/* =========================
          EVENT INFORMATION
      ========================= */}
      <div style={card}>
        {/* TITLE + STATUS */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#0f172a",
              margin: 0,
            }}
          >
            {event.eventTitle}
          </h2>

          <span
            style={{
              padding: "4px 12px",
              borderRadius: "9999px",
              fontSize: "14px",
              fontWeight: 500,
              ...(getStatusStyle(eventStatus)),
            }}
          >
            {eventStatus}
          </span>
        </div>

        {/* EVENT DETAILS GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {[
            {
              icon: Calendar,
              label: "Date",
              value: event.eventDate,
            },
            {
              icon: Clock,
              label: "Time",
              value: event.eventTime,
            },
            {
              icon: MapPin,
              label: "Venue",
              value: event.venue?.venueName || "Not specified",
            },
            {
              icon: User,
              label: "Organizer",
              value:
                event.organizer?.fullName || "Not specified",
            },
            {
              icon: Users,
              label: "Capacity",
              value: event.maxParticipants || "Unlimited",
            },
            {
              icon: IndianRupee,
              label: "Fee",
              value: `₹ ${event.registrationFee || 0}`,
            },
            {
              icon: Mail,
              label: "Coordinator",
              value:
                event.facultyCoordinatorName ||
                "Not specified",
            },
            {
              icon: Mail,
              label: "Coordinator Email",
              value:
                event.facultyCoordinatorEmail ||
                "Not specified",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px",
                  background: "#f8fafc",
                  borderRadius: "10px",
                }}
              >
                <Icon
                  size={20}
                  style={{
                    color: "#94a3b8",
                    flexShrink: 0,
                  }}
                />

                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                    }}
                  >
                    {item.label}
                  </div>

                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#0f172a",
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* DESCRIPTION */}
        {event.description && (
          <div style={{ marginBottom: "24px" }}>
            <h3
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#64748b",
                marginBottom: "8px",
              }}
            >
              Description
            </h3>

            <p
              style={{
                color: "#334155",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {event.description}
            </p>
          </div>
        )}

        {/* EVENT SETTINGS */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "24px",
          }}
        >
          {event.quizRequired && (
            <span
              style={{
                padding: "4px 12px",
                background: "#eef2ff",
                color: "#4338ca",
                borderRadius: "9999px",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              Quiz Required
            </span>
          )}

          {event.paymentRequired && (
            <span
              style={{
                padding: "4px 12px",
                background: "#fffbeb",
                color: "#b45309",
                borderRadius: "9999px",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              Payment Required
            </span>
          )}
        </div>

        {/* =========================
            ACTION BUTTONS
        ========================= */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          {/* BACK */}
          <button
            onClick={() => navigate("/events")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              background: "#f1f5f9",
              color: "#334155",
              borderRadius: "10px",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#e2e8f0";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#f1f5f9";
            }}
          >
            <ArrowLeft size={16} />
            Back
          </button>

          {/* EDIT */}
          {isAdmin && (
          <button
            onClick={() =>
              navigate(`/edit-event/${event.id}`)
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              background: "#ecfdf5",
              color: "#047857",
              borderRadius: "10px",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#d1fae5";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#ecfdf5";
            }}
          >
            <Edit3 size={16} />
            Edit
          </button>
          )}

          {/* PARTICIPANTS */}
          {isAdmin && (
          <button
            onClick={() =>
              navigate(`/participants/${event.id}`)
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              background: "#eef2ff",
              color: "#4338ca",
              borderRadius: "10px",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#e0e7ff";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#eef2ff";
            }}
          >
            <Users size={16} />
            Participants
          </button>
          )}

          {/* REGISTER - Only for students */}
          {!isAdmin && (
          <>
          {!registered ? (
            <button
              onClick={handleRegister}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                background:
                  "linear-gradient(135deg, #2563eb, #1d4ed8)",
                color: "white",
                borderRadius: "10px",
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                boxShadow:
                  "0 4px 12px rgba(37,99,235,0.25)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #1d4ed8, #1e40af)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #2563eb, #1d4ed8)";
              }}
            >
              <CheckCircle size={16} />
              Register
            </button>
          ) : (
            <button
              disabled
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                background: "#f1f5f9",
                color: "#94a3b8",
                borderRadius: "10px",
                fontWeight: 500,
                border: "none",
                cursor: "not-allowed",
                fontSize: "14px",
              }}
            >
              <CheckCircle size={16} />
              Already Registered
            </button>
          )}
          </>
          )}
        </div>
      </div>

      {/* =========================
          EVENT GALLERY
      ========================= */}
      {gallery.length > 0 && (
        <div style={card}>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "#0f172a",
              marginBottom: "16px",
            }}
          >
            Event Gallery
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "12px",
            }}
          >
            {gallery.slice(0, 4).map((img) => (
              <div
                key={img.id}
                style={{
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={`http://localhost:8080/uploads/${img.imagePath}`}
                  alt=""
                  style={{
                    width: "100%",
                    height: "160px",
                    objectFit: "cover",
                    transition: "transform 0.3s",
                  }}
                />
              </div>
            ))}
          </div>

          <Link
            to={`/gallery/${event.id}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "16px",
              fontSize: "14px",
              fontWeight: 500,
              color: "#2563eb",
              textDecoration: "none",
            }}
          >
            View Full Gallery
            <ExternalLink size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}

export default EventDetails;