import { useEffect, useState } from "react";
import { getPublishedStudentResults } from "../services/resultService";
import { ArrowLeft, Trophy, TrendingUp, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

function QuizResult() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => { loadResults(); }, []);
  const loadResults = async () => {
    try { const r = await getPublishedStudentResults(userId); setResults(r.data); }
    catch (e) { console.log(e); alert("Failed to load results."); }
    finally { setLoading(false); }
  };

  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "256px" }}><div style={{ width: "32px", height: "32px", border: "4px solid #2563eb", borderTop: "4px solid transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div></div>;

  return (
    <div style={{ padding: "32px 24px", display: "flex", flexDirection: "column", gap: "24px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button onClick={() => navigate(-1)} style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", background: "white", border: "1px solid #e2e8f0", color: "#475569", cursor: "pointer" }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a", margin: 0 }}>My Quiz Results</h1>
          <p style={{ color: "#64748b", marginTop: "2px", fontSize: "14px" }}>{results.length} published results</p>
        </div>
      </div>

      {results.length === 0 ? (
        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", padding: "48px", textAlign: "center" }}>
          <Trophy size={48} style={{ color: "#cbd5e1", margin: "0 auto 12px" }} />
          <p style={{ color: "#64748b", margin: 0 }}>No published results found</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
          {results.map((result) => (
            <div key={result.id} style={{ background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
                <div style={{ width: "40px", height: "40px", background: "#eef2ff", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Trophy size={20} style={{ color: "#4f46e5" }} />
                </div>
                <span style={{ padding: "2px 10px", borderRadius: "9999px", fontSize: "12px", fontWeight: 500, ...(result.status === "PASS" ? { background: "#ecfdf5", color: "#047857" } : { background: "#fef2f2", color: "#dc2626" }) }}>
                  {result.status}
                </span>
              </div>
              <h3 style={{ fontWeight: 600, color: "#0f172a", marginBottom: "12px" }}>{result.quiz?.quizTitle}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "16px" }}>
                <div style={{ textAlign: "center", padding: "8px", background: "#f8fafc", borderRadius: "8px" }}>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "#2563eb" }}>{result.score}</div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>Score</div>
                </div>
                <div style={{ textAlign: "center", padding: "8px", background: "#f8fafc", borderRadius: "8px" }}>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>{result.totalMarks}</div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>Total</div>
                </div>
                <div style={{ textAlign: "center", padding: "8px", background: "#f8fafc", borderRadius: "8px" }}>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: result.percentage >= 50 ? "#059669" : "#ef4444" }}>{result.percentage.toFixed(1)}%</div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>Percentage</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#64748b" }}>
                <TrendingUp size={16} /> Submitted {result.submittedAt}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default QuizResult;
