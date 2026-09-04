import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createQuestion } from "../services/questionService";
import { ArrowLeft, Save, X } from "lucide-react";

const card = { background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", padding: "24px" };
const inp = { width: "100%", padding: "12px 14px", border: "1.5px solid #e2e8f0", borderRadius: "10px", fontSize: "14px", color: "#1e293b", background: "#f8fafc", boxSizing: "border-box", outline: "none" };
const lbl = { display: "block", fontSize: "13px", fontWeight: 500, color: "#475569", marginBottom: "6px" };

function AddQuestion() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState({
    question: "", optionA: "", optionB: "", optionC: "", optionD: "",
    correctAnswer: "A", marks: 1, quiz: { id: quizId }
  });

  const handleChange = (e) => { setQuestion({ ...question, [e.target.name]: e.target.value }); };

  const saveQuestion = async (e) => {
    e.preventDefault();
    try { await createQuestion(question); alert("Question Added Successfully"); navigate(`/quiz/${quizId}/questions`); }
    catch (error) { console.log(error); alert("Failed To Add Question"); }
  };

  return (
    <div style={{ maxWidth: "768px", margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: "24px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button onClick={() => navigate(-1)} style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", background: "white", border: "1px solid #e2e8f0", color: "#475569", cursor: "pointer" }}>
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Add New Question</h1>
      </div>

      <form onSubmit={saveQuestion} style={{ ...card, display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label style={lbl}>Question Prompt</label>
          <textarea rows="3" name="question" placeholder="Type the question here..." value={question.question} onChange={handleChange} required style={{ ...inp, resize: "none" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div><label style={lbl}>Option A</label><input name="optionA" placeholder="Enter option A" value={question.optionA} onChange={handleChange} required style={inp} /></div>
          <div><label style={lbl}>Option B</label><input name="optionB" placeholder="Enter option B" value={question.optionB} onChange={handleChange} required style={inp} /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div><label style={lbl}>Option C</label><input name="optionC" placeholder="Enter option C" value={question.optionC} onChange={handleChange} required style={inp} /></div>
          <div><label style={lbl}>Option D</label><input name="optionD" placeholder="Enter option D" value={question.optionD} onChange={handleChange} required style={inp} /></div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={lbl}>Correct Answer</label>
            <select name="correctAnswer" value={question.correctAnswer} onChange={handleChange} style={inp}>
              <option value="A">Option A</option><option value="B">Option B</option><option value="C">Option C</option><option value="D">Option D</option>
            </select>
          </div>
          <div><label style={lbl}>Marks</label><input type="number" name="marks" min="1" value={question.marks} onChange={handleChange} required style={inp} /></div>
        </div>

        <div style={{ display: "flex", gap: "12px", paddingTop: "8px" }}>
          <button type="button" onClick={() => navigate(`/quiz/${quizId}/questions`)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 24px", background: "#f1f5f9", color: "#334155", fontWeight: 500, borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "14px" }}
            onMouseOver={(e) => { e.currentTarget.style.background = "#e2e8f0"; }}
            onMouseOut={(e) => { e.currentTarget.style.background = "#f1f5f9"; }}>
            <X size={20} /> Cancel
          </button>
          <button type="submit" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 24px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "white", fontWeight: 600, borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "14px", boxShadow: "0 4px 12px rgba(37,99,235,0.25)" }}
            onMouseOver={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #1d4ed8, #1e40af)"; }}
            onMouseOut={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #2563eb, #1d4ed8)"; }}>
            <Save size={20} /> Save Question
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddQuestion;
