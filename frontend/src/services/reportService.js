import api from "./api";

const reportService = {
  // Registrations
  getRegistrations: () => api.get("/reports/registrations"),
  getRegistrationsFiltered: (eventId, status) => {
    const params = new URLSearchParams();
    if (eventId) params.append("eventId", eventId);
    if (status) params.append("status", status);
    return api.get(`/reports/registrations/filtered?${params.toString()}`);
  },

  // Attendance
  getAttendance: () => api.get("/reports/attendance"),
  getAttendanceFiltered: (eventId, status) => {
    const params = new URLSearchParams();
    if (eventId) params.append("eventId", eventId);
    if (status) params.append("status", status);
    return api.get(`/reports/attendance/filtered?${params.toString()}`);
  },

  // Payments
  getPayments: () => api.get("/reports/payments"),
  getPaymentsFiltered: (eventId, status) => {
    const params = new URLSearchParams();
    if (eventId) params.append("eventId", eventId);
    if (status) params.append("status", status);
    return api.get(`/reports/payments/filtered?${params.toString()}`);
  },

  // Certificates
  getCertificates: () => api.get("/reports/certificates"),
  getCertificatesFiltered: (eventId, status) => {
    const params = new URLSearchParams();
    if (eventId) params.append("eventId", eventId);
    if (status) params.append("status", status);
    return api.get(`/reports/certificates/filtered?${params.toString()}`);
  },

  // Feedback
  getFeedback: () => api.get("/reports/feedback"),
  getFeedbackFiltered: (eventId) => {
    const params = new URLSearchParams();
    if (eventId) params.append("eventId", eventId);
    return api.get(`/reports/feedback/filtered?${params.toString()}`);
  },

  // Users
  getUsers: () => api.get("/reports/users"),
  getUsersFiltered: (role) => {
    const params = new URLSearchParams();
    if (role) params.append("role", role);
    return api.get(`/reports/users/filtered?${params.toString()}`);
  },

  // Events (for filter dropdowns)
  getEvents: () => api.get("/reports/events"),

  // CSV Exports
  exportRegistrationsCsv: () => api.get("/reports/export/registrations", { responseType: "blob" }),
  exportAttendanceCsv: () => api.get("/reports/export/attendance", { responseType: "blob" }),
  exportPaymentsCsv: () => api.get("/reports/export/payments", { responseType: "blob" }),
  exportCertificatesCsv: () => api.get("/reports/export/certificates", { responseType: "blob" }),
  exportFeedbackCsv: () => api.get("/reports/export/feedback", { responseType: "blob" }),
  exportUsersCsv: () => api.get("/reports/export/users", { responseType: "blob" }),

  // PDF Exports
  exportRegistrationsPdf: () => api.get("/reports/export/registrations/pdf", { responseType: "blob" }),
  exportAttendancePdf: () => api.get("/reports/export/attendance/pdf", { responseType: "blob" }),
  exportPaymentsPdf: () => api.get("/reports/export/payments/pdf", { responseType: "blob" }),
  exportCertificatesPdf: () => api.get("/reports/export/certificates/pdf", { responseType: "blob" }),
  exportFeedbackPdf: () => api.get("/reports/export/feedback/pdf", { responseType: "blob" }),
  exportUsersPdf: () => api.get("/reports/export/users/pdf", { responseType: "blob" }),
};

export default reportService;
