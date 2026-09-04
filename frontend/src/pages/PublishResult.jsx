import { useEffect, useState } from "react";
import { getAllResults, publishResult } from "../services/resultService";
import { ArrowLeft, Send, CheckCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const card = { background: "white", borderRadius: "16px", border: "1px solid #f1f5f9" };

function PublishResult() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { loadResults(); }, []);
  const loadResults = async () => {
    try { const r = await getAllResults(); setResults(r.data); }
    catch (e) { console.log(e); alert("Failed to load quiz results."); }
    finally { setLoading(false); }
  };

  const handlePublish = async (id) => {
    try { await publishResult(id); alert("Result Published Successfully"); loadResults(); }
    catch (e) { console.log(e); alert("Failed to publish result."); }
  };

  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "256px" }}><div style={{ width: "32px", height: "32px", border: "4px solid #2563eb", borderTop: "4px solid transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div></div>;

  const thStyle = { textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", padding: "16px 20px", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" };
  const tdStyle = { padding: "16px 20px", borderBottom: "1px solid #f8fafc", fontSize: "14px" };

  return (
    <div style={{ padding: "32px 24px", display: "flex", flexDirection: "column", gap: "24px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button onClick={() => navigate(-1)} style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", background: "white", border: "1px solid #e2e8f0", color: "#475569", cursor: "pointer" }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Publish Quiz Results</h1>
          <p style={{ color: "#64748b", marginTop: "2px", fontSize: "14px" }}>{results.length} total results</p>
        </div>
      </div>

      <div style={{ ...card, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["ID", "Student", "Quiz", "Score", "Total", "Percentage", "Status", "Published", "Action"].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                  <td style={{ ...tdStyle, color: "#475569" }}>#{result.id}</td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg, #3b82f6, #6366f1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "12px", fontWeight: 600 }}>{result.user?.fullName?.charAt(0)}</div>
                      <span style={{ fontSize: "14px", fontWeight: 500, color: "#0f172a" }}>{result.user?.fullName}</span>
                    </div>
                  </td>
                  <td style={{ ...tdStyle, color: "#475569" }}>{result.quiz?.quizTitle}</td>
                  <td style={{ ...tdStyle, fontWeight: 600, color: "#0f172a" }}>{result.score}</td>
                  <td style={{ ...tdStyle, color: "#475569" }}>{result.totalMarks}</td>
                  <td style={{ ...tdStyle, color: "#475569" }}>{result.percentage.toFixed(2)}%</td>
                  <td style={tdStyle}>
                    <span style={{ padding: "2px 10px", borderRadius: "9999px", fontSize: "12px", fontWeight: 500, ...(result.status === "PASS" ? { background: "#ecfdf5", color: "#047857" } : { background: "#fef2f2", color: "#dc2626" }) }}>{result.status}</span>
                  </td>
                  <td style={tdStyle}>
                    {result.published ? (
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "14px", color: "#059669", fontWeight: 500 }}><CheckCircle size={16} /> Published</span>
                    ) : (
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "14px", color: "#ef4444", fontWeight: 500 }}><Clock size={16} /> Not Published</span>
                    )}
                  </td>
                  <td style={tdStyle}>
                    {result.published ? (
                      <button disabled style={{ padding: "6px 16px", background: "#f1f5f9", color: "#94a3b8", borderRadius: "8px", fontSize: "12px", fontWeight: 500, border: "none", cursor: "not-allowed" }}>Published</button>
                    ) : (
                      <button onClick={() => handlePublish(result.id)}
                        style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 16px", background: "#eff6ff", color: "#1d4ed8", borderRadius: "8px", fontSize: "12px", fontWeight: 500, border: "none", cursor: "pointer" }}
                        onMouseOver={(e) => { e.currentTarget.style.background = "#dbeafe"; }} onMouseOut={(e) => { e.currentTarget.style.background = "#eff6ff"; }}>
                        <Send size={14} /> Publish
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PublishResult;
