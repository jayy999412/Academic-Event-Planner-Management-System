package com.jay.academic_event_management.service;

import com.jay.academic_event_management.entity.*;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PdfReportService {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd-MM-yyyy");
    private static final DateTimeFormatter DATETIME_FORMAT = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm");

    private static final Font TITLE_FONT = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD, BaseColor.DARK_GRAY);
    private static final Font SUBTITLE_FONT = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL, BaseColor.GRAY);
    private static final Font HEADER_FONT = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, BaseColor.WHITE);
    private static final Font CELL_FONT = new Font(Font.FontFamily.HELVETICA, 9, Font.NORMAL, BaseColor.DARK_GRAY);

    // ========================
    // REGISTRATION REPORT PDF
    // ========================

    public byte[] generateRegistrationPdf(List<Registration> registrations) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate());

        try {
            PdfWriter.getInstance(document, baos);
            document.open();

            addHeader(document, "Registration Report");
            addDateInfo(document);

            PdfPTable table = new PdfPTable(7);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{5, 20, 25, 20, 12, 12, 15});

            addTableHeaders(table, new String[]{"S.No", "Participant", "Event", "Reg. Date", "Status", "Payment", "Attendance"});

            int sno = 1;
            for (Registration r : registrations) {
                table.addCell(createCell(String.valueOf(sno++)));
                table.addCell(createCell(r.getUser() != null ? r.getUser().getFullName() : "N/A"));
                table.addCell(createCell(r.getEvent() != null ? r.getEvent().getEventTitle() : "N/A"));
                table.addCell(createCell(r.getRegistrationDate() != null ? r.getRegistrationDate().format(DATETIME_FORMAT) : "N/A"));
                table.addCell(createCell(r.getStatus()));
                table.addCell(createCell(r.getPaymentStatus()));
                table.addCell(createCell(r.getAttendanceStatus()));
            }

            document.add(table);
            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return baos.toByteArray();
    }

    // ========================
    // ATTENDANCE REPORT PDF
    // ========================

    public byte[] generateAttendancePdf(List<Registration> registrations) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate());

        try {
            PdfWriter.getInstance(document, baos);
            document.open();

            addHeader(document, "Attendance Report");
            addDateInfo(document);

            // Summary
            long total = registrations.size();
            long present = registrations.stream().filter(r -> "Present".equalsIgnoreCase(r.getAttendanceStatus())).count();
            long absent = registrations.stream().filter(r -> "Absent".equalsIgnoreCase(r.getAttendanceStatus())).count();
            double percentage = total > 0 ? (present * 100.0 / total) : 0;

            Paragraph summary = new Paragraph();
            summary.add(new Paragraph("Total Registered: " + total + "  |  Present: " + present + "  |  Absent: " + absent + "  |  Attendance: " + String.format("%.1f", percentage) + "%", SUBTITLE_FONT));
            summary.setSpacingAfter(10);
            document.add(summary);

            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{5, 30, 35, 30});

            addTableHeaders(table, new String[]{"S.No", "Participant", "Event", "Status"});

            int sno = 1;
            for (Registration r : registrations) {
                table.addCell(createCell(String.valueOf(sno++)));
                table.addCell(createCell(r.getUser() != null ? r.getUser().getFullName() : "N/A"));
                table.addCell(createCell(r.getEvent() != null ? r.getEvent().getEventTitle() : "N/A"));
                table.addCell(createCell(r.getAttendanceStatus()));
            }

            document.add(table);
            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return baos.toByteArray();
    }

    // ========================
    // PAYMENT REPORT PDF
    // ========================

    public byte[] generatePaymentPdf(List<Payment> payments) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate());

        try {
            PdfWriter.getInstance(document, baos);
            document.open();

            addHeader(document, "Payment Report");
            addDateInfo(document);

            double totalRevenue = payments.stream()
                    .filter(p -> "SUCCESS".equalsIgnoreCase(p.getPaymentStatus()))
                    .mapToDouble(Payment::getAmount)
                    .sum();
            Paragraph summary = new Paragraph();
            summary.add(new Paragraph("Total Payments: " + payments.size() + "  |  Total Revenue: Rs. " + String.format("%.2f", totalRevenue), SUBTITLE_FONT));
            summary.setSpacingAfter(10);
            document.add(summary);

            PdfPTable table = new PdfPTable(8);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{5, 20, 20, 12, 15, 18, 15, 15});

            addTableHeaders(table, new String[]{"S.No", "Participant", "Event", "Amount", "Method", "Date", "Txn ID", "Status"});

            int sno = 1;
            for (Payment p : payments) {
                String participantName = "N/A";
                String eventName = "N/A";
                if (p.getRegistration() != null) {
                    if (p.getRegistration().getUser() != null) participantName = p.getRegistration().getUser().getFullName();
                    if (p.getRegistration().getEvent() != null) eventName = p.getRegistration().getEvent().getEventTitle();
                }
                table.addCell(createCell(String.valueOf(sno++)));
                table.addCell(createCell(participantName));
                table.addCell(createCell(eventName));
                table.addCell(createCell("Rs. " + p.getAmount()));
                table.addCell(createCell(p.getPaymentMethod()));
                table.addCell(createCell(p.getPaymentDate() != null ? p.getPaymentDate().format(DATETIME_FORMAT) : "N/A"));
                table.addCell(createCell(p.getTransactionId()));
                table.addCell(createCell(p.getPaymentStatus()));
            }

            document.add(table);
            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return baos.toByteArray();
    }

    // ========================
    // CERTIFICATE REPORT PDF
    // ========================

    public byte[] generateCertificatePdf(List<Certificate> certificates) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate());

        try {
            PdfWriter.getInstance(document, baos);
            document.open();

            addHeader(document, "Certificate Report");
            addDateInfo(document);

            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{5, 20, 25, 20, 15, 15});

            addTableHeaders(table, new String[]{"S.No", "Participant", "Event", "Cert Number", "Issue Date", "Status"});

            int sno = 1;
            for (Certificate c : certificates) {
                String participantName = "N/A";
                String eventName = "N/A";
                if (c.getRegistration() != null) {
                    if (c.getRegistration().getUser() != null) participantName = c.getRegistration().getUser().getFullName();
                    if (c.getRegistration().getEvent() != null) eventName = c.getRegistration().getEvent().getEventTitle();
                }
                table.addCell(createCell(String.valueOf(sno++)));
                table.addCell(createCell(participantName));
                table.addCell(createCell(eventName));
                table.addCell(createCell(c.getCertificateNumber()));
                table.addCell(createCell(c.getIssueDate() != null ? c.getIssueDate().format(DATE_FORMAT) : "N/A"));
                table.addCell(createCell(c.getStatus()));
            }

            document.add(table);
            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return baos.toByteArray();
    }

    // ========================
    // FEEDBACK REPORT PDF
    // ========================

    public byte[] generateFeedbackPdf(List<Feedback> feedbacks) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate());

        try {
            PdfWriter.getInstance(document, baos);
            document.open();

            addHeader(document, "Feedback Report");
            addDateInfo(document);

            double avgRating = feedbacks.stream().mapToInt(Feedback::getRating).average().orElse(0);
            Paragraph summary = new Paragraph();
            summary.add(new Paragraph("Total Feedback: " + feedbacks.size() + "  |  Average Rating: " + String.format("%.1f", avgRating) + " / 5", SUBTITLE_FONT));
            summary.setSpacingAfter(10);
            document.add(summary);

            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{5, 20, 25, 10, 30, 20});

            addTableHeaders(table, new String[]{"S.No", "Participant", "Event", "Rating", "Comment", "Date"});

            int sno = 1;
            for (Feedback f : feedbacks) {
                String participantName = "N/A";
                String eventName = "N/A";
                if (f.getRegistration() != null) {
                    if (f.getRegistration().getUser() != null) participantName = f.getRegistration().getUser().getFullName();
                    if (f.getRegistration().getEvent() != null) eventName = f.getRegistration().getEvent().getEventTitle();
                }
                table.addCell(createCell(String.valueOf(sno++)));
                table.addCell(createCell(participantName));
                table.addCell(createCell(eventName));
                table.addCell(createCell(String.valueOf(f.getRating())));
                table.addCell(createCell(f.getComments()));
                table.addCell(createCell(f.getFeedbackDate() != null ? f.getFeedbackDate().format(DATETIME_FORMAT) : "N/A"));
            }

            document.add(table);
            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return baos.toByteArray();
    }

    // ========================
    // USER REPORT PDF
    // ========================

    public byte[] generateUserPdf(List<User> users) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate());

        try {
            PdfWriter.getInstance(document, baos);
            document.open();

            addHeader(document, "User Report");
            addDateInfo(document);

            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{5, 20, 25, 20, 15, 15});

            addTableHeaders(table, new String[]{"S.No", "Full Name", "Email", "Phone", "Department", "Role"});

            int sno = 1;
            for (User u : users) {
                table.addCell(createCell(String.valueOf(sno++)));
                table.addCell(createCell(u.getFullName()));
                table.addCell(createCell(u.getEmail()));
                table.addCell(createCell(u.getPhoneNumber()));
                table.addCell(createCell(u.getDepartment()));
                table.addCell(createCell(u.getRole() != null ? u.getRole().getRoleName() : "N/A"));
            }

            document.add(table);
            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return baos.toByteArray();
    }

    // ========================
    // HELPER METHODS
    // ========================

    private void addHeader(Document document, String title) throws DocumentException {
        Paragraph header = new Paragraph();
        header.add(new Paragraph("Academic Event Planner and Management System", TITLE_FONT));
        header.add(Chunk.NEWLINE);
        header.add(new Paragraph(title, new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD, BaseColor.DARK_GRAY)));
        header.setSpacingAfter(5);
        document.add(header);
    }

    private void addDateInfo(Document document) throws DocumentException {
        Paragraph dateInfo = new Paragraph();
        dateInfo.add(new Paragraph("Generated Date: " + LocalDate.now().format(DATE_FORMAT), SUBTITLE_FONT));
        dateInfo.setSpacingAfter(15);
        document.add(dateInfo);
    }

    private void addTableHeaders(PdfPTable table, String[] headers) {
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, HEADER_FONT));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            cell.setPadding(8);
            cell.setBackgroundColor(new BaseColor(37, 99, 235));
            table.addCell(cell);
        }
    }

    private PdfPCell createCell(String content) {
        PdfPCell cell = new PdfPCell(new Phrase(content != null ? content : "N/A", CELL_FONT));
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setPadding(6);
        return cell;
    }
}
