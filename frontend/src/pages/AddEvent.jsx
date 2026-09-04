import { useState, useEffect } from "react";
import axios from "axios";
import { getAllCategories } from "../services/categoryService";
import { getAllVenues } from "../services/venueService";
import { createEvent } from "../services/eventService";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AddEvent() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [venues, setVenues] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  // --------------------------------------------------
  // DATE FUNCTIONS
  // --------------------------------------------------

  // Converts Date object to YYYY-MM-DD
  // Uses local date instead of UTC.
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Today's date
  const today = new Date();

  // Minimum date = today
  const minDate = formatDate(today);

  // Maximum date = exactly 1 year from today
  const oneYearLater = new Date(today);
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

  const maxDate = formatDate(oneYearLater);

  // --------------------------------------------------
  // EVENT STATE
  // --------------------------------------------------

  const [event, setEvent] = useState({
    eventTitle: "",
    description: "",
    eventDate: "",
    eventTime: "",
    registrationDeadline: "",
    maxParticipants: "",
    status: "Upcoming",
    paymentRequired: false,
    registrationFee: 0,
    bannerImage: "",
    quizRequired: false,
    facultyCoordinatorName: "",
    facultyCoordinatorEmail: "",
    category: { id: "" },
    venue: { id: "" },
    organizer: { id: 1 },
  });

  // --------------------------------------------------
  // LOAD CATEGORIES AND VENUES
  // --------------------------------------------------

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoryResponse, venueResponse] = await Promise.all([
        getAllCategories(),
        getAllVenues(),
      ]);

      setCategories(categoryResponse.data);
      setVenues(venueResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  // --------------------------------------------------
  // NORMAL INPUT CHANGE
  // --------------------------------------------------

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setEvent({
      ...event,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // --------------------------------------------------
  // EVENT DATE CHANGE
  // --------------------------------------------------

  const handleEventDateChange = (e) => {
    const selectedDate = e.target.value;

    // Previous date check
    if (selectedDate < minDate) {
      alert("Previous dates cannot be selected.");
      return;
    }

    // More than one year check
    if (selectedDate > maxDate) {
      alert("Event date cannot be more than 1 year from today.");
      return;
    }

    // If registration deadline already exists
    // make sure it is not after the new event date.
    let newDeadline = event.registrationDeadline;

    if (newDeadline && newDeadline > selectedDate) {
      newDeadline = "";
    }

    setEvent({
      ...event,
      eventDate: selectedDate,
      registrationDeadline: newDeadline,
    });
  };

  // --------------------------------------------------
  // REGISTRATION DEADLINE CHANGE
  // --------------------------------------------------

  const handleDeadlineChange = (e) => {
    const selectedDate = e.target.value;

    // Previous date
    if (selectedDate < minDate) {
      alert("Registration deadline cannot be a previous date.");
      return;
    }

    // More than one year
    if (selectedDate > maxDate) {
      alert(
        "Registration deadline cannot be more than 1 year from today."
      );
      return;
    }

    // Deadline cannot be after event date
    if (event.eventDate && selectedDate > event.eventDate) {
      alert(
        "Registration deadline cannot be after the event date."
      );
      return;
    }

    setEvent({
      ...event,
      registrationDeadline: selectedDate,
    });
  };

  // --------------------------------------------------
  // UPLOAD BANNER
  // --------------------------------------------------

  const uploadBanner = async (file) => {
    const formData = new FormData();

    formData.append("file", file);

    const response = await axios.post(
      "http://localhost:8080/api/events/uploadBanner",
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  };

  // --------------------------------------------------
  // SUBMIT EVENT
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Event date required
    if (!event.eventDate) {
      alert("Please select an event date.");
      return;
    }

    // Event date cannot be before today
    if (event.eventDate < minDate) {
      alert("Event date cannot be a previous date.");
      return;
    }

    // Event date cannot be more than one year
    if (event.eventDate > maxDate) {
      alert("Event date cannot be more than 1 year from today.");
      return;
    }

    // Registration deadline required
    if (!event.registrationDeadline) {
      alert("Please select a registration deadline.");
      return;
    }

    // Deadline cannot be before today
    if (event.registrationDeadline < minDate) {
      alert(
        "Registration deadline cannot be a previous date."
      );
      return;
    }

    // Deadline cannot be more than one year
    if (event.registrationDeadline > maxDate) {
      alert(
        "Registration deadline cannot be more than 1 year from today."
      );
      return;
    }

    // Deadline cannot be after event date
    if (event.registrationDeadline > event.eventDate) {
      alert(
        "Registration deadline cannot be after the event date."
      );
      return;
    }

    try {
      let bannerPath = "";

      // Upload banner if selected
      if (selectedFile) {
        bannerPath = await uploadBanner(selectedFile);
      }

      // Create event
      await createEvent({
        ...event,
        bannerImage: bannerPath,
        maxParticipants: event.maxParticipants ? Number(event.maxParticipants) : null,
      });

      alert("Event Created Successfully");

      navigate("/events");
    } catch (error) {
      console.log(error);
      alert("Failed To Create Event");
    }
  };

  // --------------------------------------------------
  // STYLES
  // --------------------------------------------------

  const inp = {
    width: "100%",
    padding: "12px 14px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#1e293b",
    background: "#f8fafc",
    boxSizing: "border-box",
    outline: "none",
  };

  const lbl = {
    display: "block",
    fontSize: "13px",
    fontWeight: 500,
    color: "#475569",
    marginBottom: "6px",
  };

  const card = {
    background: "white",
    borderRadius: "16px",
    border: "1px solid #f1f5f9",
    padding: "24px",
  };

  const section = {
    fontSize: "15px",
    fontWeight: 600,
    color: "#2563eb",
    marginBottom: "16px",
    paddingBottom: "8px",
    borderBottom: "1px solid #f1f5f9",
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "10px",
            background: "white",
            border: "1.5px solid #e2e8f0",
            color: "#475569",
            cursor: "pointer",
            fontSize: "20px",
          }}
        >
          ←
        </button>

        <div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#0f172a",
              margin: 0,
            }}
          >
            Create Event
          </h1>

          <p
            style={{
              color: "#64748b",
              fontSize: "14px",
              margin: "4px 0 0 0",
            }}
          >
            Fill in the details to create a new event
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>

        {/* ==========================================
            EVENT OVERVIEW
        ========================================== */}

        <div style={card}>
          <div style={section}>Event Overview</div>

          {/* EVENT TITLE */}
          <div style={{ marginBottom: "16px" }}>
            <label style={lbl}>Event Title</label>

            <input
              name="eventTitle"
              value={event.eventTitle}
              onChange={handleChange}
              required
              placeholder="Enter event title"
              style={inp}
            />
          </div>

          {/* DESCRIPTION */}
          <div style={{ marginBottom: "16px" }}>
            <label style={lbl}>Description</label>

            <textarea
              name="description"
              value={event.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe your event..."
              style={{
                ...inp,
                resize: "vertical",
              }}
            />
          </div>

          {/* EVENT BANNER */}
          <div style={{ marginBottom: "16px" }}>
            <label style={lbl}>Event Banner</label>

            <label
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "140px",
                border: "2px dashed #e2e8f0",
                borderRadius: "12px",
                cursor: "pointer",
              }}
            >
              <Upload
                size={28}
                style={{
                  color: "#94a3b8",
                  marginBottom: "8px",
                }}
              />

              <span
                style={{
                  fontSize: "13px",
                  color: "#64748b",
                }}
              >
                {selectedFile
                  ? selectedFile.name
                  : "Click to upload"}
              </span>

              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];

                  if (file) {
                    setSelectedFile(file);
                    setPreview(
                      URL.createObjectURL(file)
                    );
                  }
                }}
              />
            </label>

            {preview && (
              <img
                src={preview}
                alt="Event Banner Preview"
                style={{
                  width: "100%",
                  maxHeight: "240px",
                  objectFit: "contain",
                  marginTop: "12px",
                  borderRadius: "10px",
                }}
              />
            )}
          </div>

          {/* CATEGORY + VENUE */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            {/* CATEGORY */}
            <div>
              <label style={lbl}>Category</label>

              <select
                value={event.category.id}
                onChange={(e) =>
                  setEvent({
                    ...event,
                    category: {
                      id: Number(e.target.value),
                    },
                  })
                }
                required
                style={inp}
              >
                <option value="">
                  Select Category
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>

            {/* VENUE */}
            <div>
              <label style={lbl}>Venue</label>

              <select
                value={event.venue.id}
                onChange={(e) =>
                  setEvent({
                    ...event,
                    venue: {
                      id: Number(e.target.value),
                    },
                  })
                }
                required
                style={inp}
              >
                <option value="">
                  Select Venue
                </option>

                {venues.map((venue) => (
                  <option
                    key={venue.id}
                    value={venue.id}
                  >
                    {venue.venueName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ==========================================
            SCHEDULE & CAPACITY
        ========================================== */}

        <div
          style={{
            ...card,
            marginTop: "16px",
          }}
        >
          <div style={section}>
            Schedule & Capacity
          </div>

          {/* EVENT DATE + START TIME */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            {/* EVENT DATE */}
            <div>
              <label style={lbl}>
                Event Date
              </label>

              <input
                type="date"
                name="eventDate"
                value={event.eventDate}
                onChange={handleEventDateChange}
                min={minDate}
                max={maxDate}
                required
                style={inp}
              />

              <small
                style={{
                  display: "block",
                  color: "#64748b",
                  fontSize: "11px",
                  marginTop: "5px",
                }}
              >
                Select a date from today up to one year.
              </small>
            </div>

            {/* START TIME */}
            <div>
              <label style={lbl}>
                Start Time
              </label>

              <input
                type="time"
                name="eventTime"
                value={event.eventTime}
                onChange={handleChange}
                required
                style={inp}
              />
            </div>
          </div>

          {/* DEADLINE + MAX SEATS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            {/* REGISTRATION DEADLINE */}
            <div>
              <label style={lbl}>
                Registration Deadline
              </label>

              <input
                type="date"
                name="registrationDeadline"
                value={event.registrationDeadline}
                onChange={handleDeadlineChange}
                min={minDate}
                max={event.eventDate || maxDate}
                required
                style={inp}
              />

              <small
                style={{
                  display: "block",
                  color: "#64748b",
                  fontSize: "11px",
                  marginTop: "5px",
                }}
              >
                Deadline must be today or before the
                event date.
              </small>
            </div>

            {/* MAXIMUM SEATS */}
            <div>
              <label style={lbl}>
                Maximum Seats
              </label>

              <input
                type="number"
                name="maxParticipants"
                placeholder="Leave blank if unlimited"
                value={event.maxParticipants}
                onChange={handleChange}
                min="1"
                style={inp}
              />
            </div>
          </div>
        </div>

        {/* ==========================================
            FACULTY COORDINATION
        ========================================== */}

        <div
          style={{
            ...card,
            marginTop: "16px",
          }}
        >
          <div style={section}>
            Faculty Coordination
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            {/* COORDINATOR NAME */}
            <div>
              <label style={lbl}>
                Coordinator Name
              </label>

              <input
                name="facultyCoordinatorName"
                placeholder="Dr. Name"
                value={event.facultyCoordinatorName}
                onChange={handleChange}
                style={inp}
              />
            </div>

            {/* COORDINATOR EMAIL */}
            <div>
              <label style={lbl}>
                Coordinator Email
              </label>

              <input
                type="email"
                name="facultyCoordinatorEmail"
                placeholder="email@edu.in"
                value={event.facultyCoordinatorEmail}
                onChange={handleChange}
                style={inp}
              />
            </div>
          </div>
        </div>

        {/* ==========================================
            SETTINGS
        ========================================== */}

        <div
          style={{
            ...card,
            marginTop: "16px",
          }}
        >
          <div style={section}>
            Settings
          </div>

          <div
            style={{
              display: "flex",
              gap: "24px",
              marginBottom: "16px",
            }}
          >
            {/* PAYMENT REQUIRED */}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                color: "#334155",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                name="paymentRequired"
                checked={event.paymentRequired}
                onChange={handleChange}
                style={{
                  width: "16px",
                  height: "16px",
                  accentColor: "#2563eb",
                }}
              />

              Payment Required
            </label>

            {/* QUIZ REQUIRED */}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                color: "#334155",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                name="quizRequired"
                checked={event.quizRequired}
                onChange={handleChange}
                style={{
                  width: "16px",
                  height: "16px",
                  accentColor: "#2563eb",
                }}
              />

              Quiz Required
            </label>
          </div>

          {/* REGISTRATION FEE */}
          {event.paymentRequired && (
            <div style={{ maxWidth: "300px" }}>
              <label style={lbl}>
                Registration Fee (₹)
              </label>

              <input
                type="number"
                name="registrationFee"
                value={event.registrationFee}
                onChange={handleChange}
                min="0"
                style={inp}
              />
            </div>
          )}
        </div>

        {/* ==========================================
            PUBLISH EVENT
        ========================================== */}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "14px",
            background:
              "linear-gradient(135deg, #2563eb, #1d4ed8)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
            marginTop: "16px",
            boxShadow:
              "0 4px 12px rgba(37, 99, 235, 0.3)",
          }}
        >
          Publish Event
        </button>
      </form>
    </div>
  );
}

export default AddEvent;