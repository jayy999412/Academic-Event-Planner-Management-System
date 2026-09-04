package com.jay.academic_event_management.service;

import com.jay.academic_event_management.entity.*;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class CsvExportService {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd-MM-yyyy");
    private static final DateTimeFormatter DATETIME_FORMAT = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm");

    // ========================
    // REGISTRATION CSV
    // ========================

    public String exportRegistrationCsv(List<Registration> registrations) {
        StringBuilder sb = new StringBuilder();
        sb.append("S.No,Participant Name,Event Name,Registration Date,Status,Payment Status,Attendance Status\n");

        int sno = 1;
        for (Registration r : registrations) {
            sb.append(sno++).append(",")
              .append(escapeCsv(r.getUser() != null ? r.getUser().getFullName() : "N/A")).append(",")
              .append(escapeCsv(r.getEvent() != null ? r.getEvent().getEventTitle() : "N/A")).append(",")
              .append(r.getRegistrationDate() != null ? r.getRegistrationDate().format(DATETIME_FORMAT) : "N/A").append(",")
              .append(escapeCsv(r.getStatus())).append(",")
              .append(escapeCsv(r.getPaymentStatus())).append(",")
              .append(escapeCsv(r.getAttendanceStatus())).append("\n");
        }
        return sb.toString();
    }

    // ========================
    // ATTENDANCE CSV
    // ========================

    public String exportAttendanceCsv(List<Registration> registrations) {
        StringBuilder sb = new StringBuilder();
        sb.append("S.No,Participant Name,Event Name,Attendance Status\n");

        int sno = 1;
        for (Registration r : registrations) {
            sb.append(sno++).append(",")
              .append(escapeCsv(r.getUser() != null ? r.getUser().getFullName() : "N/A")).append(",")
              .append(escapeCsv(r.getEvent() != null ? r.getEvent().getEventTitle() : "N/A")).append(",")
              .append(escapeCsv(r.getAttendanceStatus())).append("\n");
        }
        return sb.toString();
    }

    // ========================
    // PAYMENT CSV
    // ========================

    public String exportPaymentCsv(List<Payment> payments) {
        StringBuilder sb = new StringBuilder();
        sb.append("S.No,Participant Name,Event Name,Amount,Payment Method,Payment Date,Transaction ID,Receipt Number,Status\n");

        int sno = 1;
        for (Payment p : payments) {
            String participantName = "N/A";
            String eventName = "N/A";
            if (p.getRegistration() != null) {
                if (p.getRegistration().getUser() != null) {
                    participantName = p.getRegistration().getUser().getFullName();
                }
                if (p.getRegistration().getEvent() != null) {
                    eventName = p.getRegistration().getEvent().getEventTitle();
                }
            }
            sb.append(sno++).append(",")
              .append(escapeCsv(participantName)).append(",")
              .append(escapeCsv(eventName)).append(",")
              .append(p.getAmount()).append(",")
              .append(escapeCsv(p.getPaymentMethod())).append(",")
              .append(p.getPaymentDate() != null ? p.getPaymentDate().format(DATETIME_FORMAT) : "N/A").append(",")
              .append(escapeCsv(p.getTransactionId())).append(",")
              .append(escapeCsv(p.getReceiptNumber())).append(",")
              .append(escapeCsv(p.getPaymentStatus())).append("\n");
        }
        return sb.toString();
    }

    // ========================
    // CERTIFICATE CSV
    // ========================

    public String exportCertificateCsv(List<Certificate> certificates) {
        StringBuilder sb = new StringBuilder();
        sb.append("S.No,Participant Name,Event Name,Certificate Number,Issue Date,Status\n");

        int sno = 1;
        for (Certificate c : certificates) {
            String participantName = "N/A";
            String eventName = "N/A";
            if (c.getRegistration() != null) {
                if (c.getRegistration().getUser() != null) {
                    participantName = c.getRegistration().getUser().getFullName();
                }
                if (c.getRegistration().getEvent() != null) {
                    eventName = c.getRegistration().getEvent().getEventTitle();
                }
            }
            sb.append(sno++).append(",")
              .append(escapeCsv(participantName)).append(",")
              .append(escapeCsv(eventName)).append(",")
              .append(escapeCsv(c.getCertificateNumber())).append(",")
              .append(c.getIssueDate() != null ? c.getIssueDate().format(DATE_FORMAT) : "N/A").append(",")
              .append(escapeCsv(c.getStatus())).append("\n");
        }
        return sb.toString();
    }

    // ========================
    // FEEDBACK CSV
    // ========================

    public String exportFeedbackCsv(List<Feedback> feedbacks) {
        StringBuilder sb = new StringBuilder();
        sb.append("S.No,Participant Name,Event Name,Rating,Comments,Feedback Date\n");

        int sno = 1;
        for (Feedback f : feedbacks) {
            String participantName = "N/A";
            String eventName = "N/A";
            if (f.getRegistration() != null) {
                if (f.getRegistration().getUser() != null) {
                    participantName = f.getRegistration().getUser().getFullName();
                }
                if (f.getRegistration().getEvent() != null) {
                    eventName = f.getRegistration().getEvent().getEventTitle();
                }
            }
            sb.append(sno++).append(",")
              .append(escapeCsv(participantName)).append(",")
              .append(escapeCsv(eventName)).append(",")
              .append(f.getRating()).append(",")
              .append(escapeCsv(f.getComments())).append(",")
              .append(f.getFeedbackDate() != null ? f.getFeedbackDate().format(DATETIME_FORMAT) : "N/A").append("\n");
        }
        return sb.toString();
    }

    // ========================
    // USER CSV
    // ========================

    public String exportUserCsv(List<User> users) {
        StringBuilder sb = new StringBuilder();
        sb.append("S.No,Full Name,Email,Phone,Department,Role\n");

        int sno = 1;
        for (User u : users) {
            sb.append(sno++).append(",")
              .append(escapeCsv(u.getFullName())).append(",")
              .append(escapeCsv(u.getEmail())).append(",")
              .append(escapeCsv(u.getPhoneNumber())).append(",")
              .append(escapeCsv(u.getDepartment())).append(",")
              .append(escapeCsv(u.getRole() != null ? u.getRole().getRoleName() : "N/A")).append("\n");
        }
        return sb.toString();
    }

    private String escapeCsv(String value) {
        if (value == null) return "N/A";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
}
