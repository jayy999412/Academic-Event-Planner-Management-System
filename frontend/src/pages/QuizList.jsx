import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllQuiz, deleteQuiz } from "../services/quizService";
import { Plus, FileText, Play, Edit3, Trash2, BookOpen } from "lucide-react";

function QuizList() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => { loadQuiz(); }, []);

  const loadQuiz = async () => { try { const r = await getAllQuiz(); setQuizzes(r.data); } catch (e) { console.log(e); } };
  const removeQuiz = async (id) => { if (!window.confirm("Delete Quiz?")) return; try { await deleteQuiz(id); loadQuiz(); } catch { alert("Delete Failed"); } };

  return (
    <div style={{ padding: "32px 24px", display: "flex", flexDirection: "column", gap: "24px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Quiz Management</h1>
          <p style={{ color: "#64748b", marginTop: "4px", fontSize: "14px" }}>Create and manage quizzes</p>
        </div>
        <button onClick={() => navigate("/quiz/create")}
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "white", fontWeight: 600, borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "14px", boxShadow: "0 4px 12px rgba(37,99,235,0.25)" }}
          onMouseOver={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #1d4ed8, #1e40af)"; }}
          onMouseOut={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #2563eb, #1d4ed8)"; }}>
          <Plus size={20} /> Create Quiz
        </button>
      </div>

      {quizzes.length === 0 ? (
        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", padding: "48px", textAlign: "center" }}>
          <BookOpen size={48} style={{ color: "#cbd5e1", margin: "0 auto 12px" }} />
          <p style={{ color: "#64748b", margin: 0 }}>No quizzes found</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
          {quizzes.map(quiz => (
            <div key={quiz.id} style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
                <div style={{ width: "40px", height: "40px", background: "#eef2ff", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FileText size={20} style={{ color: "#4f46e5" }} />
                </div>
                <span style={{ padding: "2px 10px", borderRadius: "9999px", fontSize: "12px", fontWeight: 500, ...(quiz.status === "ACTIVE" ? { background: "#ecfdf5", color: "#047857" } : quiz.status === "DRAFT" ? { background: "#fffbeb", color: "#b45309" } : { background: "#f1f5f9", color: "#64748b" }) }}>{quiz.status}</span>
              </div>
              <h3 style={{ fontWeight: 600, color: "#0f172a", margin: "0 0 4px 0" }}>{quiz.quizTitle}</h3>
              <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "16px" }}>{quiz.event?.eventTitle}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "14px", color: "#64748b", marginBottom: "16px" }}>
                <span>Marks: <strong style={{ color: "#334155" }}>{quiz.totalMarks}</strong></span>
                <span>Pass: <strong style={{ color: "#334155" }}>{quiz.passingMarks}</strong></span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => navigate(`/quiz/${quiz.id}/questions`)}
                  style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "8px", background: "#eef2ff", color: "#4338ca", borderRadius: "10px", fontSize: "14px", fontWeight: 500, border: "none", cursor: "pointer" }}
                  onMouseOver={(e) => { e.currentTarget.style.background = "#e0e7ff"; }} onMouseOut={(e) => { e.currentTarget.style.background = "#eef2ff"; }}>
                  <FileText size={16} /> Questions
                </button>
                <button onClick={() => navigate(`/quiz/start/${quiz.id}`)}
                  style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "8px", background: "#ecfdf5", color: "#047857", borderRadius: "10px", fontSize: "14px", fontWeight: 500, border: "none", cursor: "pointer" }}
                  onMouseOver={(e) => { e.currentTarget.style.background = "#d1fae5"; }} onMouseOut={(e) => { e.currentTarget.style.background = "#ecfdf5"; }}>
                  <Play size={16} /> Start
                </button>
                <button onClick={() => navigate(`/quiz/edit/${quiz.id}`)}
                  style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", background: "#fffbeb", color: "#d97706", borderRadius: "10px", border: "none", cursor: "pointer" }}
                  onMouseOver={(e) => { e.currentTarget.style.background = "#fef3c7"; }} onMouseOut={(e) => { e.currentTarget.style.background = "#fffbeb"; }}>
                  <Edit3 size={16} />
                </button>
                <button onClick={() => removeQuiz(quiz.id)}
                  style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", background: "#fef2f2", color: "#dc2626", borderRadius: "10px", border: "none", cursor: "pointer" }}
                  onMouseOver={(e) => { e.currentTarget.style.background = "#fee2e2"; }} onMouseOut={(e) => { e.currentTarget.style.background = "#fef2f2"; }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default QuizList;
