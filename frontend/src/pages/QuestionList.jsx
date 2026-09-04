import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getQuestionsByQuiz, deleteQuestion } from "../services/questionService";
import { Plus, Edit3, Trash2, HelpCircle, CheckCircle } from "lucide-react";

function QuestionList() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);

  useEffect(() => { loadQuestions(); }, []);
  const loadQuestions = async () => { try { const r = await getQuestionsByQuiz(quizId); setQuestions(r.data); } catch (e) { console.log(e); } };
  const removeQuestion = async (id) => { if (!window.confirm("Delete Question?")) return; try { await deleteQuestion(id); loadQuestions(); } catch { alert("Delete Failed"); } };

  return (
    <div style={{ padding: "32px 24px", display: "flex", flexDirection: "column", gap: "24px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Question Management</h1>
          <p style={{ color: "#64748b", marginTop: "4px", fontSize: "14px" }}>{questions.length} questions in this quiz</p>
        </div>
        <button onClick={() => navigate(`/quiz/${quizId}/question/add`)}
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "white", fontWeight: 600, borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "14px", boxShadow: "0 4px 12px rgba(37,99,235,0.25)" }}
          onMouseOver={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #1d4ed8, #1e40af)"; }}
          onMouseOut={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #2563eb, #1d4ed8)"; }}>
          <Plus size={20} /> Add Question
        </button>
      </div>

      {questions.length === 0 ? (
        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", padding: "48px", textAlign: "center" }}>
          <HelpCircle size={48} style={{ color: "#cbd5e1", margin: "0 auto 12px" }} />
          <p style={{ color: "#64748b", margin: 0 }}>No questions yet</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {questions.map((question, index) => (
            <div key={question.id} style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", flex: 1 }}>
                  <div style={{ width: "32px", height: "32px", background: "#eff6ff", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#2563eb" }}>{index + 1}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "14px", fontWeight: 500, color: "#0f172a", marginBottom: "8px" }}>{question.question}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {[
                        { label: "A", value: question.optionA },
                        { label: "B", value: question.optionB },
                        { label: "C", value: question.optionC },
                        { label: "D", value: question.optionD },
                      ].map(opt => (
                        <span key={opt.label} style={{ padding: "4px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 500, ...(question.correctAnswer === opt.label ? { background: "#ecfdf5", color: "#047857" } : { background: "#f8fafc", color: "#475569" }) }}>
                          {opt.label}. {opt.value}
                          {question.correctAnswer === opt.label && <CheckCircle size={12} style={{ marginLeft: "4px", verticalAlign: "middle" }} />}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ padding: "4px 8px", background: "#f1f5f9", color: "#475569", borderRadius: "8px", fontSize: "12px", fontWeight: 500 }}>{question.marks} marks</span>
                  <button onClick={() => navigate(`/question/edit/${question.id}`)}
                    style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", background: "#ecfdf5", color: "#047857", borderRadius: "8px", border: "none", cursor: "pointer" }}
                    onMouseOver={(e) => { e.currentTarget.style.background = "#d1fae5"; }} onMouseOut={(e) => { e.currentTarget.style.background = "#ecfdf5"; }}>
                    <Edit3 size={16} />
                  </button>
                  <button onClick={() => removeQuestion(question.id)}
                    style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", background: "#fef2f2", color: "#dc2626", borderRadius: "8px", border: "none", cursor: "pointer" }}
                    onMouseOver={(e) => { e.currentTarget.style.background = "#fee2e2"; }} onMouseOut={(e) => { e.currentTarget.style.background = "#fef2f2"; }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default QuestionList;
