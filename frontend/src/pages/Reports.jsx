import { useState, useEffect } from "react";
import { Download, FileText, Search, Filter, ChevronLeft, ChevronRight, Loader2, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import reportService from "../services/reportService";

const tabs = [
  { id: "registrations", label: "Registrations" },
  { id: "attendance", label: "Attendance" },
  { id: "payments", label: "Payments" },
  { id: "certificates", label: "Certificates" },
  { id: "users", label: "Users" },
  { id: "feedback", label: "Feedback" },
];

const cardStyle = { background: "white", borderRadius: "16px", border: "1px solid #f1f5f9", padding: "24px" };
const inpStyle = { width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: "10px", fontSize: "14px", color: "#1e293b", background: "#f8fafc", boxSizing: "border-box", outline: "none" };
const btnStyle = { padding: "10px 20px", borderRadius: "10px", border: "none", fontSize: "14px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" };

function Reports() {
  const [activeTab, setActiveTab] = useState("registrations");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ eventId: "", status: "" });

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    loadData();
  }, [activeTab, filters]);

  const loadEvents = async () => {
    try {
      const res = await reportService.getEvents();
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to load events:", err);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      setSearch("");

      let response;
      const { eventId, status } = filters;

      switch (activeTab) {
        case "registrations":
          response = eventId || status
            ? await reportService.getRegistrationsFiltered(eventId || null, status || null)
            : await reportService.getRegistrations();
          break;
        case "attendance":
          response = eventId || status
            ? await reportService.getAttendanceFiltered(eventId || null, status || null)
            : await reportService.getAttendance();
          break;
        case "payments":
          response = eventId || status
            ? await reportService.getPaymentsFiltered(eventId || null, status || null)
            : await reportService.getPayments();
          break;
        case "certificates":
          response = eventId || status
            ? await reportService.getCertificatesFiltered(eventId || null, status || null)
            : await reportService.getCertificates();
          break;
        case "users":
          response = status
            ? await reportService.getUsersFiltered(status)
            : await reportService.getUsers();
          break;
        case "feedback":
          response = eventId
            ? await reportService.getFeedbackFiltered(eventId)
            : await reportService.getFeedback();
          break;
        default:
          response = await reportService.getRegistrations();
      }

      setData(response.data);
    } catch (err) {
      console.error("Failed to load report:", err);
      setError("Failed to load report data.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ eventId: "", status: "" });
  };

  const handleExportCsv = async () => {
    try {
      let response;
      switch (activeTab) {
        case "registrations": response = await reportService.exportRegistrationsCsv(); break;
        case "attendance": response = await reportService.exportAttendanceCsv(); break;
        case "payments": response = await reportService.exportPaymentsCsv(); break;
        case "certificates": response = await reportService.exportCertificatesCsv(); break;
        case "users": response = await reportService.exportUsersCsv(); break;
        case "feedback": response = await reportService.exportFeedbackCsv(); break;
        default: return;
      }
      downloadBlob(response.data, `${activeTab}_report.csv`, "text/csv");
    } catch (err) {
      console.error("CSV export failed:", err);
      alert("Failed to export CSV");
    }
  };

  const handleExportPdf = async () => {
    try {
      let response;
      switch (activeTab) {
        case "registrations": response = await reportService.exportRegistrationsPdf(); break;
        case "attendance": response = await reportService.exportAttendancePdf(); break;
        case "payments": response = await reportService.exportPaymentsPdf(); break;
        case "certificates": response = await reportService.exportCertificatesPdf(); break;
        case "users": response = await reportService.exportUsersPdf(); break;
        case "feedback": response = await reportService.exportFeedbackPdf(); break;
        default: return;
      }
      downloadBlob(response.data, `${activeTab}_report.pdf`, "application/pdf");
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("Failed to export PDF");
    }
  };

  const downloadBlob = (blob, filename, type) => {
    const url = window.URL.createObjectURL(new Blob([blob], { type }));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const filteredData = data.filter((item) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    if (activeTab === "registrations" || activeTab === "attendance") {
      const name = item.user?.fullName?.toLowerCase() || "";
      const event = item.event?.eventTitle?.toLowerCase() || "";
      return name.includes(searchLower) || event.includes(searchLower);
    }
    if (activeTab === "payments") {
      const name = item.registration?.user?.fullName?.toLowerCase() || "";
      const event = item.registration?.event?.eventTitle?.toLowerCase() || "";
      const txn = item.transactionId?.toLowerCase() || "";
      return name.includes(searchLower) || event.includes(searchLower) || txn.includes(searchLower);
    }
    if (activeTab === "certificates") {
      const name = item.registration?.user?.fullName?.toLowerCase() || "";
      const event = item.registration?.event?.eventTitle?.toLowerCase() || "";
      const cert = item.certificateNumber?.toLowerCase() || "";
      return name.includes(searchLower) || event.includes(searchLower) || cert.includes(searchLower);
    }
    if (activeTab === "users") {
      const name = item.fullName?.toLowerCase() || "";
      const email = item.email?.toLowerCase() || "";
      return name.includes(searchLower) || email.includes(searchLower);
    }
    if (activeTab === "feedback") {
      const name = item.registration?.user?.fullName?.toLowerCase() || "";
      const event = item.registration?.event?.eventTitle?.toLowerCase() || "";
      return name.includes(searchLower) || event.includes(searchLower);
    }
    return true;
  });

  const getStatusBadge = (status) => {
    const styles = {
      Approved: { bg: "#ecfdf5", color: "#059669" },
      Present: { bg: "#ecfdf5", color: "#059669" },
      SUCCESS: { bg: "#ecfdf5", color: "#059669" },
      Paid: { bg: "#ecfdf5", color: "#059669" },
      Pending: { bg: "#fffbeb", color: "#d97706" },
      "Not Marked": { bg: "#f1f5f9", color: "#64748b" },
      Rejected: { bg: "#fef2f2", color: "#dc2626" },
      Cancelled: { bg: "#fef2f2", color: "#dc2626" },
      Absent: { bg: "#fef2f2", color: "#dc2626" },
      FAILED: { bg: "#fef2f2", color: "#dc2626" },
    };
    const s = styles[status] || { bg: "#f1f5f9", color: "#64748b" };
    return <span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: 500, background: s.bg, color: s.color }}>{status}</span>;
  };

  const renderSummaryCards = () => {
    if (activeTab === "registrations") {
      const approved = data.filter((r) => r.status === "Approved").length;
      const pending = data.filter((r) => r.status === "Pending").length;
      const rejected = data.filter((r) => r.status === "Rejected").length;
      const cancelled = data.filter((r) => r.status === "Cancelled").length;
      return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px", marginBottom: "20px" }}>
          <SummaryCard label="Total" value={data.length} color="#2563eb" bg="#eff6ff" />
          <SummaryCard label="Approved" value={approved} color="#059669" bg="#ecfdf5" />
          <SummaryCard label="Pending" value={pending} color="#d97706" bg="#fffbeb" />
          <SummaryCard label="Rejected" value={rejected} color="#dc2626" bg="#fef2f2" />
          <SummaryCard label="Cancelled" value={cancelled} color="#64748b" bg="#f1f5f9" />
        </div>
      );
    }
    if (activeTab === "attendance") {
      const present = data.filter((r) => r.attendanceStatus === "Present").length;
      const absent = data.filter((r) => r.attendanceStatus === "Absent").length;
      const pct = data.length > 0 ? Math.round(present * 100 / data.length) : 0;
      return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "20px" }}>
          <SummaryCard label="Total" value={data.length} color="#2563eb" bg="#eff6ff" />
          <SummaryCard label="Present" value={present} color="#059669" bg="#ecfdf5" />
          <SummaryCard label="Absent" value={absent} color="#dc2626" bg="#fef2f2" />
          <SummaryCard label="Attendance %" value={`${pct}%`} color="#8b5cf6" bg="#eef2ff" />
        </div>
      );
    }
    if (activeTab === "payments") {
      const success = data.filter((p) => p.paymentStatus === "SUCCESS").length;
      const pending = data.filter((p) => p.paymentStatus === "PENDING").length;
      const revenue = data.filter((p) => p.paymentStatus === "SUCCESS").reduce((sum, p) => sum + (p.amount || 0), 0);
      return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "20px" }}>
          <SummaryCard label="Total" value={data.length} color="#2563eb" bg="#eff6ff" />
          <SummaryCard label="Successful" value={success} color="#059669" bg="#ecfdf5" />
          <SummaryCard label="Pending" value={pending} color="#d97706" bg="#fffbeb" />
          <SummaryCard label="Revenue" value={`Rs. ${revenue.toLocaleString()}`} color="#8b5cf6" bg="#eef2ff" />
        </div>
      );
    }
    if (activeTab === "certificates") {
      return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", marginBottom: "20px" }}>
          <SummaryCard label="Total Certificates" value={data.length} color="#2563eb" bg="#eff6ff" />
          <SummaryCard label="Issued" value={data.length} color="#059669" bg="#ecfdf5" />
        </div>
      );
    }
    if (activeTab === "users") {
      const students = data.filter((u) => u.role?.roleName === "STUDENT").length;
      const faculty = data.filter((u) => u.role?.roleName === "FACULTY").length;
      const admins = data.filter((u) => u.role?.roleName === "ADMIN").length;
      return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "20px" }}>
          <SummaryCard label="Total" value={data.length} color="#2563eb" bg="#eff6ff" />
          <SummaryCard label="Students" value={students} color="#6366f1" bg="#eef2ff" />
          <SummaryCard label="Faculty" value={faculty} color="#8b5cf6" bg="#faf5ff" />
          <SummaryCard label="Admins" value={admins} color="#059669" bg="#ecfdf5" />
        </div>
      );
    }
    if (activeTab === "feedback") {
      const avgRating = data.length > 0 ? (data.reduce((sum, f) => sum + (f.rating || 0), 0) / data.length).toFixed(1) : "0.0";
      return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", marginBottom: "20px" }}>
          <SummaryCard label="Total Feedback" value={data.length} color="#2563eb" bg="#eff6ff" />
          <SummaryCard label="Average Rating" value={`${avgRating} / 5`} color="#f59e0b" bg="#fffbeb" />
        </div>
      );
    }
    return null;
  };

  const renderTable = () => {
    if (loading) {
      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px" }}>
          <Loader2 size={24} style={{ color: "#2563eb", animation: "spin 1s linear infinite" }} />
          <span style={{ marginLeft: "8px", color: "#64748b" }}>Loading...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div style={{ textAlign: "center", padding: "48px" }}>
          <AlertCircle size={32} style={{ color: "#ef4444", marginBottom: "8px" }} />
          <p style={{ color: "#ef4444" }}>{error}</p>
          <button onClick={loadData} style={{ ...btnStyle, background: "#2563eb", color: "white", marginTop: "12px" }}>Retry</button>
        </div>
      );
    }

    if (filteredData.length === 0) {
      return (
        <div style={{ textAlign: "center", padding: "48px", color: "#94a3b8" }}>
          <FileText size={32} style={{ marginBottom: "8px" }} />
          <p>No data available</p>
        </div>
      );
    }

    switch (activeTab) {
      case "registrations": return renderRegistrationTable();
      case "attendance": return renderAttendanceTable();
      case "payments": return renderPaymentTable();
      case "certificates": return renderCertificateTable();
      case "users": return renderUserTable();
      case "feedback": return renderFeedbackTable();
      default: return null;
    }
  };

  const renderRegistrationTable = () => (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
            <th style={thStyle}>S.No</th>
            <th style={thStyle}>Participant</th>
            <th style={thStyle}>Event</th>
            <th style={thStyle}>Reg. Date</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Payment</th>
            <th style={thStyle}>Attendance</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((r, i) => (
            <tr key={r.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
              <td style={tdStyle}>{i + 1}</td>
              <td style={tdStyle}>{r.user?.fullName || "N/A"}</td>
              <td style={tdStyle}>{r.event?.eventTitle || "N/A"}</td>
              <td style={tdStyle}>{r.registrationDate ? new Date(r.registrationDate).toLocaleDateString() : "N/A"}</td>
              <td style={tdStyle}>{getStatusBadge(r.status)}</td>
              <td style={tdStyle}>{getStatusBadge(r.paymentStatus)}</td>
              <td style={tdStyle}>{getStatusBadge(r.attendanceStatus)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderAttendanceTable = () => (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
            <th style={thStyle}>S.No</th>
            <th style={thStyle}>Participant</th>
            <th style={thStyle}>Event</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((r, i) => (
            <tr key={r.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
              <td style={tdStyle}>{i + 1}</td>
              <td style={tdStyle}>{r.user?.fullName || "N/A"}</td>
              <td style={tdStyle}>{r.event?.eventTitle || "N/A"}</td>
              <td style={tdStyle}>{getStatusBadge(r.attendanceStatus)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderPaymentTable = () => (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
            <th style={thStyle}>S.No</th>
            <th style={thStyle}>Participant</th>
            <th style={thStyle}>Event</th>
            <th style={thStyle}>Amount</th>
            <th style={thStyle}>Method</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Txn ID</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((p, i) => (
            <tr key={p.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
              <td style={tdStyle}>{i + 1}</td>
              <td style={tdStyle}>{p.registration?.user?.fullName || "N/A"}</td>
              <td style={tdStyle}>{p.registration?.event?.eventTitle || "N/A"}</td>
              <td style={tdStyle}>Rs. {p.amount}</td>
              <td style={tdStyle}>{p.paymentMethod}</td>
              <td style={tdStyle}>{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : "N/A"}</td>
              <td style={tdStyle}>{p.transactionId}</td>
              <td style={tdStyle}>{getStatusBadge(p.paymentStatus)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderCertificateTable = () => (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
            <th style={thStyle}>S.No</th>
            <th style={thStyle}>Participant</th>
            <th style={thStyle}>Event</th>
            <th style={thStyle}>Cert Number</th>
            <th style={thStyle}>Issue Date</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((c, i) => (
            <tr key={c.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
              <td style={tdStyle}>{i + 1}</td>
              <td style={tdStyle}>{c.registration?.user?.fullName || "N/A"}</td>
              <td style={tdStyle}>{c.registration?.event?.eventTitle || "N/A"}</td>
              <td style={tdStyle}>{c.certificateNumber}</td>
              <td style={tdStyle}>{c.issueDate}</td>
              <td style={tdStyle}>{getStatusBadge(c.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderUserTable = () => (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
            <th style={thStyle}>S.No</th>
            <th style={thStyle}>Full Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Phone</th>
            <th style={thStyle}>Department</th>
            <th style={thStyle}>Role</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((u, i) => (
            <tr key={u.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
              <td style={tdStyle}>{i + 1}</td>
              <td style={tdStyle}>{u.fullName}</td>
              <td style={tdStyle}>{u.email}</td>
              <td style={tdStyle}>{u.phoneNumber}</td>
              <td style={tdStyle}>{u.department}</td>
              <td style={tdStyle}>{getStatusBadge(u.role?.roleName || "N/A")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderFeedbackTable = () => (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
            <th style={thStyle}>S.No</th>
            <th style={thStyle}>Participant</th>
            <th style={thStyle}>Event</th>
            <th style={thStyle}>Rating</th>
            <th style={thStyle}>Comment</th>
            <th style={thStyle}>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((f, i) => (
            <tr key={f.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
              <td style={tdStyle}>{i + 1}</td>
              <td style={tdStyle}>{f.registration?.user?.fullName || "N/A"}</td>
              <td style={tdStyle}>{f.registration?.event?.eventTitle || "N/A"}</td>
              <td style={tdStyle}>
                <span style={{ color: "#f59e0b", fontWeight: 600 }}>{f.rating} / 5</span>
              </td>
              <td style={{ ...tdStyle, maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.comments}</td>
              <td style={tdStyle}>{f.feedbackDate ? new Date(f.feedbackDate).toLocaleDateString() : "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const getFilterOptions = () => {
    switch (activeTab) {
      case "registrations":
        return (
          <>
            <select value={filters.status} onChange={(e) => handleFilterChange("status", e.target.value)} style={inpStyle}>
              <option value="">All Status</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </>
        );
      case "attendance":
        return (
          <>
            <select value={filters.status} onChange={(e) => handleFilterChange("status", e.target.value)} style={inpStyle}>
              <option value="">All Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </>
        );
      case "payments":
        return (
          <>
            <select value={filters.status} onChange={(e) => handleFilterChange("status", e.target.value)} style={inpStyle}>
              <option value="">All Status</option>
              <option value="SUCCESS">Success</option>
              <option value="PENDING">Pending</option>
            </select>
          </>
        );
      case "certificates":
        return null;
      case "users":
        return (
          <select value={filters.status} onChange={(e) => handleFilterChange("status", e.target.value)} style={inpStyle}>
            <option value="">All Roles</option>
            <option value="STUDENT">Student</option>
            <option value="FACULTY">Faculty</option>
            <option value="ADMIN">Admin</option>
          </select>
        );
      case "feedback":
        return null;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Reports & Analytics</h1>
        <p style={{ color: "#64748b", marginTop: "4px", fontSize: "14px" }}>View and export detailed reports</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", background: "#f1f5f9", borderRadius: "12px", padding: "4px", flexWrap: "wrap" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setFilters({ eventId: "", status: "" }); }}
            style={{
              padding: "10px 16px", borderRadius: "10px", border: "none", fontSize: "13px", fontWeight: 500, cursor: "pointer",
              background: activeTab === tab.id ? "white" : "transparent",
              color: activeTab === tab.id ? "#0f172a" : "#64748b",
              boxShadow: activeTab === tab.id ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              transition: "all 0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      {renderSummaryCards()}

      {/* Filters + Actions */}
      <div style={{ ...cardStyle, padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1", minWidth: "200px", maxWidth: "320px" }}>
            <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ ...inpStyle, paddingLeft: "36px" }}
            />
          </div>

          {/* Event Filter */}
          <select
            value={filters.eventId}
            onChange={(e) => handleFilterChange("eventId", e.target.value)}
            style={{ ...inpStyle, width: "auto", minWidth: "160px" }}
          >
            <option value="">All Events</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>{e.eventTitle}</option>
            ))}
          </select>

          {/* Status Filter */}
          {getFilterOptions()}

          {/* Clear Filters */}
          {(filters.eventId || filters.status) && (
            <button onClick={clearFilters} style={{ ...btnStyle, background: "#f1f5f9", color: "#475569", padding: "10px 14px" }}>
              Clear Filters
            </button>
          )}

          <div style={{ flex: 1 }}></div>

          {/* Export Buttons */}
          <button onClick={handleExportCsv} style={{ ...btnStyle, background: "#ecfdf5", color: "#059669" }}>
            <Download size={16} /> CSV
          </button>
          <button onClick={handleExportPdf} style={{ ...btnStyle, background: "#eff6ff", color: "#2563eb" }}>
            <Download size={16} /> PDF
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={cardStyle}>
        {renderTable()}
      </div>
    </div>
  );
}

function SummaryCard({ label, value, color, bg }) {
  return (
    <div style={{ background: "white", borderRadius: "12px", border: "1px solid #f1f5f9", padding: "16px" }}>
      <div style={{ fontSize: "22px", fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>{label}</div>
    </div>
  );
}

const thStyle = {
  padding: "12px 16px",
  textAlign: "left",
  fontWeight: 600,
  color: "#475569",
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const tdStyle = {
  padding: "12px 16px",
  color: "#334155",
};

export default Reports;
