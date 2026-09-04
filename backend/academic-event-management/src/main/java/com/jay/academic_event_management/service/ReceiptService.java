package com.jay.academic_event_management.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import com.jay.academic_event_management.entity.Payment;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class ReceiptService {

    public byte[] generateReceipt(Payment payment) {

        try {

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

            Document document = new Document();

            PdfWriter.getInstance(document, outputStream);

            document.open();

            Font titleFont =
                    new Font(Font.FontFamily.HELVETICA, 20, Font.BOLD);

            Font normalFont =
                    new Font(Font.FontFamily.HELVETICA, 12);

            Paragraph title =
                    new Paragraph("Academic Event Management", titleFont);

            title.setAlignment(Element.ALIGN_CENTER);

            document.add(title);

            document.add(new Paragraph(" "));
            document.add(new Paragraph("PAYMENT RECEIPT", titleFont));
            document.add(new Paragraph(" "));

            document.add(new Paragraph(
                    "Receipt Number : " + payment.getReceiptNumber(),
                    normalFont));

            document.add(new Paragraph(
                    "Transaction ID : " + payment.getTransactionId(),
                    normalFont));

            document.add(new Paragraph(
                    "Student : " +
                            payment.getRegistration()
                                    .getUser()
                                    .getFullName(),
                    normalFont));

            document.add(new Paragraph(
                    "Event : " +
                            payment.getRegistration()
                                    .getEvent()
                                    .getEventTitle(),
                    normalFont));

            document.add(new Paragraph(
                    "Amount Paid : ₹" +
                            payment.getAmount(),
                    normalFont));

            document.add(new Paragraph(
                    "Payment Method : " +
                            payment.getPaymentMethod(),
                    normalFont));

            document.add(new Paragraph(
                    "Payment Date : " +
                            payment.getPaymentDate(),
                    normalFont));

            document.add(new Paragraph(
                    "Payment Status : " +
                            payment.getPaymentStatus(),
                    normalFont));

            document.add(new Paragraph(" "));
            document.add(new Paragraph(
                    "Thank you for registering.",
                    normalFont));

            document.close();

            return outputStream.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException(e);

        }

    }

}