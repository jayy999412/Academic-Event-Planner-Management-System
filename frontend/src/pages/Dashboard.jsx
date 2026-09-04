import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Users, Award, CreditCard, TrendingUp, ArrowUpRight, Clock, Activity, Plus, FileText, ClipboardCheck, BarChart3, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts";
import dashboardService from "../services/dashboardService";

const quickActions = [
  { icon: Plus, label: "Create Event", desc: "Add a new event", path: "/add-event", bg: "#eff6ff", color: "#2563eb" },
  { icon: Users, label: "Participants", desc: "Manage registrations", path: "/my-registrations", bg: "#eef2ff", color: "#4f46e5" },
  { icon: Award, label: "Certificates", desc: "Generate & download", path: "/admin-certificates", bg: "#ecfdf5", color: "#059669" },
  { icon: FileText, label: "Quizzes", desc: "Create & manage", path: "/quiz", bg: "#fffbeb", color: "#d97706" },
  { icon: BarChart3, label: "Reports", desc: "View analytics", path: "/reports", bg: "#faf5ff", color: "#9333ea" },
  { icon: ClipboardCheck, label: "Results", desc: "Publish results", path: "/quiz-results", bg: "#fff1f2", color: "#e11d48" },
];

const COLORS = ["#3b82f6", "#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

const cardStyle = { background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", padding: "24px" };

function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardService.getDashboard();
      setData(response.data);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "400px" }}>
        <Loader2 size={32} style={{ color: "#2563eb", animation: "spin 1s linear infinite" }} />
        <span style={{ marginLeft: "12px", color: "#64748b", fontSize: "14px" }}>Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...cardStyle, textAlign: "center", padding: "48px" }}>
        <p style={{ color: "#ef4444", fontSize: "14px", marginBottom: "16px" }}>{error}</p>
        <button onClick={loadDashboard} style={{ padding: "10px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: 500 }}>
          Retry
        </button>
      </div>
    );
  }

  const stats = [
    { label: "Total Events", value: data?.totalEvents || 0, icon: Calendar, bg: "#eff6ff", color: "#2563eb" },
    { label: "Total Registrations", value: data?.totalRegistrations || 0, icon: Users, bg: "#eef2ff", color: "#4f46e5" },
    { label: "Certificates", value: data?.totalCertificates || 0, icon: Award, bg: "#ecfdf5", color: "#059669" },
    { label: "Revenue", value: `Rs. ${(data?.totalRevenue || 0).toLocaleString()}`, icon: CreditCard, bg: "#fffbeb", color: "#d97706" },
  ];

  const eventStatusData = [
    { name: "Upcoming", value: data?.upcomingEvents || 0, color: "#10b981" },
    { name: "Ongoing", value: data?.ongoingEvents || 0, color: "#f59e0b" },
    { name: "Completed", value: data?.completedEvents || 0, color: "#64748b" },
    { name: "Cancelled", value: data?.cancelledEvents || 0, color: "#ef4444" },
  ];

  const categoryData = (data?.eventsByCategory || []).map((item, index) => ({
    ...item,
    color: COLORS[index % COLORS.length],
  }));

  const monthlyData = data?.monthlyEvents || [];

  const totalAttendable = (data?.totalAttended || 0) + (data?.totalAbsent || 0);
  const attendancePercentage = totalAttendable > 0 ? Math.round((data?.totalAttended || 0) * 100 / totalAttendable) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #2563eb, #4f46e5)",
        borderRadius: "20px", padding: "32px", color: "white",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "250px", height: "250px", background: "rgba(255,255,255,0.06)", borderRadius: "50%" }}></div>
        <div style={{ position: "absolute", bottom: "-80px", left: "-40px", width: "200px", height: "200px", background: "rgba(255,255,255,0.04)", borderRadius: "50%" }}></div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>Welcome back, Admin</h1>
          <p style={{ fontSize: "16px", opacity: 0.8 }}>Manage your academic events efficiently.</p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "16px", fontSize: "14px", opacity: 0.6 }}>
            <Clock size={16} />
            <span>{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} style={{ ...cardStyle, transition: "transform 0.2s, box-shadow 0.2s", cursor: "default" }}
              onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.08)"; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <div style={{ width: "42px", height: "42px", background: stat.bg, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={20} style={{ color: stat.color }} />
                </div>
              </div>
              <div style={{ fontSize: "26px", fontWeight: 700, color: "#0f172a" }}>{stat.value}</div>
              <div style={{ fontSize: "14px", color: "#64748b", marginTop: "4px" }}>{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
        {/* Monthly Events Chart */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: "17px", fontWeight: 600, color: "#0f172a", margin: "0 0 24px" }}>Monthly Events</h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }} />
                <Area type="monotone" dataKey="events" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEvents)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 260, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>No data available</div>
          )}
        </div>

        {/* Event Categories Pie Chart */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: "17px", fontWeight: 600, color: "#0f172a", margin: "0 0 24px" }}>Event Categories</h3>
          {categoryData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={48} outerRadius={72} dataKey="value" strokeWidth={0}>
                    {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ marginTop: "16px" }}>
                {categoryData.map((item) => (
                  <div key={item.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", fontSize: "13px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: item.color }}></div>
                      <span style={{ color: "#475569" }}>{item.name}</span>
                    </div>
                    <span style={{ fontWeight: 600, color: "#0f172a" }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>No categories</div>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Event Status Chart */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: "17px", fontWeight: 600, color: "#0f172a", margin: "0 0 24px" }}>Event Status Overview</h3>
          {eventStatusData.some(d => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={eventStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {eventStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 240, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>No events yet</div>
          )}
        </div>

        {/* Attendance Overview */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: "17px", fontWeight: 600, color: "#0f172a", margin: "0 0 24px" }}>Attendance Overview</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "14px", color: "#64748b" }}>Total Attended</span>
              <span style={{ fontSize: "20px", fontWeight: 700, color: "#10b981" }}>{data?.totalAttended || 0}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "14px", color: "#64748b" }}>Total Absent</span>
              <span style={{ fontSize: "20px", fontWeight: 700, color: "#ef4444" }}>{data?.totalAbsent || 0}</span>
            </div>
            <div style={{ height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${attendancePercentage}%`, background: "linear-gradient(90deg, #10b981, #059669)", borderRadius: "4px", transition: "width 0.5s" }}></div>
            </div>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: "28px", fontWeight: 700, color: "#0f172a" }}>{attendancePercentage}%</span>
              <p style={{ fontSize: "13px", color: "#94a3b8", margin: "4px 0 0" }}>Attendance Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions + Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
        <div style={cardStyle}>
          <h3 style={{ fontSize: "17px", fontWeight: 600, color: "#0f172a", margin: "0 0 20px" }}>Quick Actions</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button key={action.label} onClick={() => navigate(action.path)}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",
                    padding: "20px 12px", borderRadius: "14px", border: "1px solid #f1f5f9",
                    background: "white", cursor: "pointer", transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = "#bfdbfe"; e.currentTarget.style.background = "#f8fafc"; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = "#f1f5f9"; e.currentTarget.style.background = "white"; }}
                >
                  <div style={{ width: "48px", height: "48px", background: action.bg, borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={24} style={{ color: action.color }} />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>{action.label}</div>
                    <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>{action.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ fontSize: "17px", fontWeight: 600, color: "#0f172a", margin: "0 0 20px" }}>System Summary</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { label: "Total Users", value: data?.totalUsers || 0, color: "#2563eb" },
              { label: "Students", value: data?.totalStudents || 0, color: "#6366f1" },
              { label: "Faculty", value: data?.totalFaculty || 0, color: "#8b5cf6" },
              { label: "Total Feedback", value: data?.totalFeedback || 0, color: "#10b981" },
              { label: "Average Rating", value: `${data?.averageRating || 0} / 5`, color: "#f59e0b" },
              { label: "Successful Payments", value: data?.successfulPayments || 0, color: "#059669" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                <span style={{ fontSize: "13px", color: "#64748b" }}>{item.label}</span>
                <span style={{ fontSize: "14px", fontWeight: 600, color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
