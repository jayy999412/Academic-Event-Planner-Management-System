import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuestionsByQuiz, submitQuiz } from "../services/questionService";
import { ArrowLeft, CheckCircle, Clock, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

const card = { background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", padding: "24px" };

function StartQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);

  useEffect(() => { loadQuestions(); }, []);
  const loadQuestions = async () => { try { const r = await getQuestionsByQuiz(quizId); setQuestions(r.data); } catch (e) { console.log(e); } };

  const chooseAnswer = (questionId, option) => { setAnswers({ ...answers, [questionId]: option }); };

  const submit = async () => {
    try {
      const payload = {
        userId: Number(localStorage.getItem("userId")),
        quizId: Number(quizId),
        answers: Object.keys(answers).map(id => ({ questionId: Number(id), selectedAnswer: answers[id] }))
      };
      const r = await submitQuiz(payload); setResult(r.data);
    } catch (e) { console.log(e); alert("Quiz Submission Failed"); }
  };

  if (result) {
    const percentage = result.percentage;
    return (
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: "24px", fontFamily: "'Inter', sans-serif" }}>
        <div style={{ ...card, padding: "32px", textAlign: "center" }}>
          <div style={{ width: "80px", height: "80px", margin: "0 auto 24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: percentage >= 50 ? "#ecfdf5" : "#fef2f2" }}>
            <Trophy size={40} style={{ color: percentage >= 50 ? "#059669" : "#ef4444" }} />
          </div>
          <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>Quiz Submitted!</h2>
          <p style={{ color: "#64748b", marginBottom: "32px" }}>Here are your results</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
            <div style={{ padding: "16px", background: "#f8fafc", borderRadius: "10px" }}>
              <div style={{ fontSize: "24px", fontWeight: 700, color: "#2563eb" }}>{result.score}</div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>Score</div>
            </div>
            <div style={{ padding: "16px", background: "#f8fafc", borderRadius: "10px" }}>
              <div style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a" }}>{result.totalMarks}</div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>Total Marks</div>
            </div>
            <div style={{ padding: "16px", background: "#f8fafc", borderRadius: "10px" }}>
              <div style={{ fontSize: "24px", fontWeight: 700, color: percentage >= 50 ? "#059669" : "#ef4444" }}>{percentage}%</div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>Percentage</div>
            </div>
          </div>
          <span style={{ display: "inline-block", padding: "8px 16px", borderRadius: "9999px", fontSize: "14px", fontWeight: 600, ...(percentage >= 50 ? { background: "#ecfdf5", color: "#047857" } : { background: "#fef2f2", color: "#dc2626" }) }}>
            {result.status}
          </span>
          <div style={{ marginTop: "24px" }}>
            <button onClick={() => navigate("/quiz")} style={{ padding: "10px 24px", background: "#2563eb", color: "white", borderRadius: "10px", fontWeight: 500, border: "none", cursor: "pointer", fontSize: "14px" }}
              onMouseOver={(e) => { e.currentTarget.style.background = "#1d4ed8"; }}
              onMouseOut={(e) => { e.currentTarget.style.background = "#2563eb"; }}>
              Back to Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "768px", margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: "24px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button onClick={() => navigate(-1)} style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", background: "white", border: "1px solid #e2e8f0", color: "#475569", cursor: "pointer" }}>
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Start Quiz</h1>
      </div>

      <div style={{ ...card, padding: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ fontSize: "14px", color: "#64748b" }}>Question {currentQ + 1} of {questions.length}</span>
          <span style={{ fontSize: "14px", color: "#64748b" }}>{Object.keys(answers).length} answered</span>
        </div>
        <div style={{ width: "100%", background: "#f1f5f9", borderRadius: "9999px", height: "8px" }}>
          <div style={{ background: "#2563eb", height: "8px", borderRadius: "9999px", transition: "width 0.3s", width: `${((currentQ + 1) / questions.length) * 100}%` }}></div>
        </div>
      </div>

      {questions.length > 0 && !result && (
        <div style={card}>
          <div style={{ marginBottom: "24px" }}>
            <span style={{ padding: "4px 12px", background: "#eff6ff", color: "#1d4ed8", borderRadius: "8px", fontSize: "14px", fontWeight: 500 }}>Q{currentQ + 1}</span>
            <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#0f172a", marginTop: "12px" }}>{questions[currentQ]?.question}</h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
            {["A", "B", "C", "D"].map(option => {
              const text = option === "A" ? questions[currentQ]?.optionA :
                           option === "B" ? questions[currentQ]?.optionB :
                           option === "C" ? questions[currentQ]?.optionC :
                           questions[currentQ]?.optionD;
              const isSelected = answers[questions[currentQ]?.id] === option;
              return (
                <label key={option} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", borderRadius: "10px", border: `2px solid ${isSelected ? "#2563eb" : "#e2e8f0"}`, background: isSelected ? "rgba(37,99,235,0.04)" : "white", cursor: "pointer", transition: "all 0.2s" }}>
                  <input type="radio" checked={isSelected}
                    onChange={() => chooseAnswer(questions[currentQ]?.id, option)} style={{ width: "16px", height: "16px", accentColor: "#2563eb" }} />
                  <span style={{ fontSize: "14px", color: "#334155" }}>{text}</span>
                </label>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            {currentQ > 0 && (
              <button onClick={() => setCurrentQ(currentQ - 1)}
                style={{ padding: "10px 20px", background: "#f1f5f9", color: "#334155", borderRadius: "10px", fontWeight: 500, border: "none", cursor: "pointer", fontSize: "14px" }}
                onMouseOver={(e) => { e.currentTarget.style.background = "#e2e8f0"; }}
                onMouseOut={(e) => { e.currentTarget.style.background = "#f1f5f9"; }}>
                Previous
              </button>
            )}
            {currentQ < questions.length - 1 ? (
              <button onClick={() => setCurrentQ(currentQ + 1)}
                style={{ padding: "10px 20px", background: "#2563eb", color: "white", borderRadius: "10px", fontWeight: 500, border: "none", cursor: "pointer", fontSize: "14px" }}
                onMouseOver={(e) => { e.currentTarget.style.background = "#1d4ed8"; }}
                onMouseOut={(e) => { e.currentTarget.style.background = "#2563eb"; }}>
                Next
              </button>
            ) : (
              <button onClick={submit}
                style={{ padding: "10px 24px", background: "linear-gradient(135deg, #10b981, #059669)", color: "white", fontWeight: 600, borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "14px", boxShadow: "0 4px 12px rgba(16,185,129,0.25)" }}
                onMouseOver={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #059669, #047857)"; }}
                onMouseOut={(e) => { e.currentTarget.style.background = "linear-gradient(135deg, #10b981, #059669)"; }}>
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StartQuiz;
