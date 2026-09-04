import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getQuizById, updateQuiz } from "../services/quizService";
import { getAllEvents } from "../services/eventService";
import { ArrowLeft, Save } from "lucide-react";

const card = { background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", padding: "24px" };
const inp = { width: "100%", padding: "12px 14px", border: "1.5px solid #e2e8f0", borderRadius: "10px", fontSize: "14px", color: "#1e293b", background: "#f8fafc", boxSizing: "border-box", outline: "none" };
const lbl = { display: "block", fontSize: "13px", fontWeight: 500, color: "#475569", marginBottom: "6px" };

function EditQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [quiz, setQuiz] = useState({ quizTitle: "", description: "", totalMarks: "", passingMarks: "", status: "", event: { id: "" } });

  useEffect(() => { loadQuiz(); loadEvents(); }, []);

  const loadQuiz = async () => { const r = await getQuizById(id); setQuiz(r.data); };
  const loadEvents = async () => { const r = await getAllEvents(); setEvents(r.data); };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "eventId") { setQuiz({ ...quiz, event: { id: value } }); }
    else { setQuiz({ ...quiz, [name]: value }); }
  };

  const update = async (e) => { e.preventDefault(); await updateQuiz(id, quiz); alert("Quiz Updated Successfully"); navigate("/quiz"); };

  return (
    <div style={{ maxWidth: "768px", margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: "24px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button onClick={() => navigate(-1)} style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", background: "white", border: "1px solid #e2e8f0", color: "#475569", cursor: "pointer" }}>
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Edit Quiz</h1>
      </div>

      <form onSubmit={update} style={{ ...card, display: "flex", flexDirection: "column", gap: "20px" }}>
        <div><label style={lbl}>Quiz Title</label><input name="quizTitle" value={quiz.quizTitle} onChange={handleChange} style={inp} /></div>
        <div><label style={lbl}>Description</label><textarea rows="4" name="description" value={quiz.description} onChange={handleChange} style={{ ...inp, resize: "none" }} /></div>
        <div><label style={lbl}>Event</label>
          <select name="eventId" value={quiz.event?.id} onChange={handleChange} style={inp}>
            {events.map(e => <option key={e.id} value={e.id}>{e.eventTitle}</option>)}
          </select></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div><label style={lbl}>Total Marks</label><input type="number" name="totalMarks" value={quiz.totalMarks} onChange={handleChange} style={inp} /></div>
          <div><label style={lbl}>Passing Marks</label><input type="number" name="passingMarks" value={quiz.passingMarks} onChange={handleChange} style={inp} /></div>
        </div>
        <div><label style={lbl}>Status</label>
          <select name="status" value={quiz.status} onChange={handleChange} style={inp}>
            <option value="ACTIVE">ACTIVE</option><option value="DRAFT">DRAFT</option><option value="CLOSED">CLOSED</option>
          </select></div>
        <button type="submit" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 24px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "white", fontWeight: 600, borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "14px", boxShadow: "0 4px 12px rgba(37,99,235,0.25)" }}
          onMouseOver={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #1d4ed8, #1e40af)"; }}
          onMouseOut={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #2563eb, #1d4ed8)"; }}>
          <Save size={20} /> Update Quiz
        </button>
      </form>
    </div>
  );
}

export default EditQuiz;
