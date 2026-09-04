package com.jay.academic_event_management.controller;

import com.jay.academic_event_management.service.CsvExportService;
import com.jay.academic_event_management.service.PdfReportService;
import com.jay.academic_event_management.service.ReportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports/export")
@PreAuthorize("hasRole('ADMIN')")
public class ExportController {

    private final CsvExportService csvExportService;
    private final PdfReportService pdfReportService;
    private final ReportService reportService;

    public ExportController(CsvExportService csvExportService,
                            PdfReportService pdfReportService,
                            ReportService reportService) {
        this.csvExportService = csvExportService;
        this.pdfReportService = pdfReportService;
        this.reportService = reportService;
    }

    // ========================
    // CSV EXPORTS
    // ========================

    @GetMapping("/registrations")
    public ResponseEntity<byte[]> exportRegistrationCsv() {
        String csv = csvExportService.exportRegistrationCsv(reportService.getRegistrationReport());
        return buildCsvResponse(csv, "registration_report.csv");
    }

    @GetMapping("/attendance")
    public ResponseEntity<byte[]> exportAttendanceCsv() {
        String csv = csvExportService.exportAttendanceCsv(reportService.getAttendanceReport());
        return buildCsvResponse(csv, "attendance_report.csv");
    }

    @GetMapping("/payments")
    public ResponseEntity<byte[]> exportPaymentCsv() {
        String csv = csvExportService.exportPaymentCsv(reportService.getPaymentReport());
        return buildCsvResponse(csv, "payment_report.csv");
    }

    @GetMapping("/certificates")
    public ResponseEntity<byte[]> exportCertificateCsv() {
        String csv = csvExportService.exportCertificateCsv(reportService.getCertificateReport());
        return buildCsvResponse(csv, "certificate_report.csv");
    }

    @GetMapping("/feedback")
    public ResponseEntity<byte[]> exportFeedbackCsv() {
        String csv = csvExportService.exportFeedbackCsv(reportService.getFeedbackReport());
        return buildCsvResponse(csv, "feedback_report.csv");
    }

    @GetMapping("/users")
    public ResponseEntity<byte[]> exportUserCsv() {
        String csv = csvExportService.exportUserCsv(reportService.getUserReport());
        return buildCsvResponse(csv, "user_report.csv");
    }

    // ========================
    // PDF EXPORTS
    // ========================

    @GetMapping("/registrations/pdf")
    public ResponseEntity<byte[]> exportRegistrationPdf() {
        byte[] pdf = pdfReportService.generateRegistrationPdf(reportService.getRegistrationReport());
        return buildPdfResponse(pdf, "registration_report.pdf");
    }

    @GetMapping("/attendance/pdf")
    public ResponseEntity<byte[]> exportAttendancePdf() {
        byte[] pdf = pdfReportService.generateAttendancePdf(reportService.getAttendanceReport());
        return buildPdfResponse(pdf, "attendance_report.pdf");
    }

    @GetMapping("/payments/pdf")
    public ResponseEntity<byte[]> exportPaymentPdf() {
        byte[] pdf = pdfReportService.generatePaymentPdf(reportService.getPaymentReport());
        return buildPdfResponse(pdf, "payment_report.pdf");
    }

    @GetMapping("/certificates/pdf")
    public ResponseEntity<byte[]> exportCertificatePdf() {
        byte[] pdf = pdfReportService.generateCertificatePdf(reportService.getCertificateReport());
        return buildPdfResponse(pdf, "certificate_report.pdf");
    }

    @GetMapping("/feedback/pdf")
    public ResponseEntity<byte[]> exportFeedbackPdf() {
        byte[] pdf = pdfReportService.generateFeedbackPdf(reportService.getFeedbackReport());
        return buildPdfResponse(pdf, "feedback_report.pdf");
    }

    @GetMapping("/users/pdf")
    public ResponseEntity<byte[]> exportUserPdf() {
        byte[] pdf = pdfReportService.generateUserPdf(reportService.getUserReport());
        return buildPdfResponse(pdf, "user_report.pdf");
    }

    // ========================
    // HELPER METHODS
    // ========================

    private ResponseEntity<byte[]> buildCsvResponse(String csv, String filename) {
        byte[] content = csv.getBytes();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", filename);
        headers.setContentLength(content.length);
        return ResponseEntity.ok().headers(headers).body(content);
    }

    private ResponseEntity<byte[]> buildPdfResponse(byte[] pdf, String filename) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", filename);
        headers.setContentLength(pdf.length);
        return ResponseEntity.ok().headers(headers).body(pdf);
    }
}
