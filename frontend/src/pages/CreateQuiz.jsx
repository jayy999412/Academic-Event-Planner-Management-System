import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createQuiz } from "../services/quizService";
import { getAllEvents } from "../services/eventService";
import { ArrowLeft, Save, X } from "lucide-react";

const card = { background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", padding: "24px" };
const inp = { width: "100%", padding: "12px 14px", border: "1.5px solid #e2e8f0", borderRadius: "10px", fontSize: "14px", color: "#1e293b", background: "#f8fafc", boxSizing: "border-box", outline: "none" };
const lbl = { display: "block", fontSize: "13px", fontWeight: 500, color: "#475569", marginBottom: "6px" };

function CreateQuiz() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [quiz, setQuiz] = useState({
    quizTitle: "", description: "", totalMarks: "", passingMarks: "", status: "ACTIVE", event: { id: "" }
  });

  useEffect(() => { loadEvents(); }, []);
  const loadEvents = async () => { try { const r = await getAllEvents(); setEvents(r.data); } catch (e) { console.log(e); } };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "eventId") { setQuiz({ ...quiz, event: { id: value } }); }
    else { setQuiz({ ...quiz, [name]: value }); }
  };

  const saveQuiz = async (e) => {
    e.preventDefault();
    try { await createQuiz(quiz); alert("Quiz Created Successfully"); navigate("/quiz"); }
    catch (error) { console.log(error); alert("Failed To Create Quiz"); }
  };

  return (
    <div style={{ maxWidth: "768px", margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: "24px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button onClick={() => navigate(-1)} style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", background: "white", border: "1px solid #e2e8f0", color: "#475569", cursor: "pointer" }}>
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Create Quiz</h1>
      </div>

      <form onSubmit={saveQuiz} style={{ ...card, display: "flex", flexDirection: "column", gap: "20px" }}>
        <div><label style={lbl}>Quiz Title</label><input type="text" name="quizTitle" value={quiz.quizTitle} onChange={handleChange} required placeholder="Enter quiz title" style={inp} /></div>
        <div><label style={lbl}>Description</label><textarea name="description" value={quiz.description} onChange={handleChange} rows="4" placeholder="Quiz description..." style={{ ...inp, resize: "none" }} /></div>
        <div><label style={lbl}>Select Event</label>
          <select name="eventId" value={quiz.event.id} onChange={handleChange} required style={inp}>
            <option value="">Select Event</option>{events.map(e => <option key={e.id} value={e.id}>{e.eventTitle}</option>)}
          </select></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div><label style={lbl}>Total Marks</label><input type="number" name="totalMarks" value={quiz.totalMarks} onChange={handleChange} required style={inp} /></div>
          <div><label style={lbl}>Passing Marks</label><input type="number" name="passingMarks" value={quiz.passingMarks} onChange={handleChange} required style={inp} /></div>
        </div>
        <div><label style={lbl}>Status</label>
          <select name="status" value={quiz.status} onChange={handleChange} style={inp}>
            <option value="ACTIVE">ACTIVE</option><option value="DRAFT">DRAFT</option><option value="CLOSED">CLOSED</option>
          </select></div>
        <div style={{ display: "flex", gap: "12px", paddingTop: "8px" }}>
          <button type="submit" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 24px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "white", fontWeight: 600, borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "14px", boxShadow: "0 4px 12px rgba(37,99,235,0.25)" }}
            onMouseOver={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #1d4ed8, #1e40af)"; }}
            onMouseOut={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #2563eb, #1d4ed8)"; }}>
            <Save size={20} /> Save Quiz
          </button>
          <button type="button" onClick={() => navigate("/quiz")} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 24px", background: "#f1f5f9", color: "#334155", fontWeight: 500, borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "14px" }}
            onMouseOver={(e) => { e.currentTarget.style.background = "#e2e8f0"; }}
            onMouseOut={(e) => { e.currentTarget.style.background = "#f1f5f9"; }}>
            <X size={20} /> Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateQuiz;
