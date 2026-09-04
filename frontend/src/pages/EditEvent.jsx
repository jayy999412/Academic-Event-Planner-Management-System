import { useState, useEffect } from "react";
import { getAllCategories } from "../services/categoryService";
import { getAllVenues } from "../services/venueService";
import { getEventById, updateEvent } from "../services/eventService";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

const card = { background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", padding: "24px" };
const inp = { width: "100%", padding: "12px 14px", border: "1.5px solid #e2e8f0", borderRadius: "10px", fontSize: "14px", color: "#1e293b", background: "#f8fafc", boxSizing: "border-box", outline: "none" };
const lbl = { display: "block", fontSize: "13px", fontWeight: 500, color: "#475569", marginBottom: "6px" };

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [venues, setVenues] = useState([]);
  const [event, setEvent] = useState({
    eventTitle: "", description: "", eventDate: "", eventTime: "",
    registrationDeadline: "", maxParticipants: "", status: "Upcoming",
    paymentRequired: false, registrationFee: 0, quizRequired: false,
    facultyCoordinatorName: "", facultyCoordinatorEmail: "",
    category: { id: "" }, venue: { id: "" }, organizer: { id: 1 }
  });

  useEffect(() => { loadData(); }, [id]);

  const loadData = async () => {
    try {
      const [catRes, venRes, evtRes] = await Promise.all([getAllCategories(), getAllVenues(), getEventById(id)]);
      setCategories(catRes.data);
      setVenues(venRes.data);
      const f = evtRes.data;
      setEvent({ ...f, category: { id: f.category?.id || "" }, venue: { id: f.venue?.id || "" }, organizer: { id: f.organizer?.id || 1 } });
    } catch (error) { console.log(error); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "paymentRequired") { setEvent({ ...event, paymentRequired: checked, registrationFee: checked ? event.registrationFee : 0 }); return; }
    setEvent({ ...event, [name]: type === "checkbox" ? checked : value });
  };

  const handleDropdown = (e) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: { id: value ? Number(value) : "" } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...event,
        maxParticipants: event.maxParticipants ? Number(event.maxParticipants) : null,
      };
      await updateEvent(id, payload); alert("Event Updated Successfully"); navigate("/events"); }
    catch (error) { console.log(error); alert("Failed To Update Event"); }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: "24px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button onClick={() => navigate(-1)} style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", background: "white", border: "1px solid #e2e8f0", color: "#475569", cursor: "pointer" }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Edit Event</h1>
          <p style={{ color: "#64748b", marginTop: "2px", fontSize: "14px" }}>Update event details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ ...card, display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label style={lbl}>Event Title</label>
          <input type="text" name="eventTitle" value={event.eventTitle} onChange={handleChange} style={inp} />
        </div>
        <div>
          <label style={lbl}>Description</label>
          <textarea name="description" value={event.description} onChange={handleChange} rows="4" style={{ ...inp, resize: "none" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div><label style={lbl}>Event Date</label><input type="date" name="eventDate" value={event.eventDate} onChange={handleChange} style={inp} /></div>
          <div><label style={lbl}>Event Time</label><input type="time" name="eventTime" value={event.eventTime} onChange={handleChange} style={inp} /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div><label style={lbl}>Registration Deadline</label><input type="date" name="registrationDeadline" value={event.registrationDeadline} onChange={handleChange} style={inp} /></div>
          <div><label style={lbl}>Maximum Participants</label><input type="number" name="maxParticipants" value={event.maxParticipants} onChange={handleChange} style={inp} /></div>
        </div>
        <div>
          <label style={lbl}>Status (Auto-calculated by system)</label>
          <select
            name="status"
            value={event.status}
            onChange={handleChange}
            style={{ ...inp, background: "#f1f5f9", cursor: "not-allowed" }}
            disabled={event.status !== "Cancelled"}
          >
            <option value="Upcoming">Upcoming (Auto)</option>
            <option value="Ongoing">Ongoing (Auto)</option>
            <option value="Completed">Completed (Auto)</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <p style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
            Status is automatically set based on event date. Only "Cancelled" can be set manually.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div><label style={lbl}>Faculty Coordinator Name</label><input type="text" name="facultyCoordinatorName" value={event.facultyCoordinatorName} onChange={handleChange} style={inp} /></div>
          <div><label style={lbl}>Faculty Coordinator Email</label><input type="email" name="facultyCoordinatorEmail" value={event.facultyCoordinatorEmail} onChange={handleChange} style={inp} /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div><label style={lbl}>Category</label>
            <select name="category" value={event.category.id} onChange={handleDropdown} style={inp}>
              <option value="">Select Category</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.categoryName}</option>)}
            </select></div>
          <div><label style={lbl}>Venue</label>
            <select name="venue" value={event.venue.id} onChange={handleDropdown} style={inp}>
              <option value="">Select Venue</option>{venues.map((v) => <option key={v.id} value={v.id}>{v.venueName}</option>)}
            </select></div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
            <input type="checkbox" name="paymentRequired" checked={event.paymentRequired} onChange={handleChange} style={{ width: "16px", height: "16px", borderRadius: "4px", accentColor: "#2563eb" }} />
            <span style={{ fontSize: "14px", fontWeight: 500, color: "#334155" }}>Payment Required</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
            <input type="checkbox" name="quizRequired" checked={event.quizRequired} onChange={handleChange} style={{ width: "16px", height: "16px", borderRadius: "4px", accentColor: "#2563eb" }} />
            <span style={{ fontSize: "14px", fontWeight: 500, color: "#334155" }}>Quiz Required</span>
          </label>
        </div>
        {event.paymentRequired && (
          <div style={{ maxWidth: "320px" }}><label style={lbl}>Registration Fee</label><input type="number" name="registrationFee" value={event.registrationFee} onChange={handleChange} style={inp} /></div>
        )}
        <button type="submit" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 28px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "white", fontWeight: 600, borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "14px", boxShadow: "0 4px 12px rgba(37,99,235,0.25)" }}
          onMouseOver={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #1d4ed8, #1e40af)"; }}
          onMouseOut={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #2563eb, #1d4ed8)"; }}>
          <Save size={20} /> Update Event
        </button>
      </form>
    </div>
  );
}

export default EditEvent;
