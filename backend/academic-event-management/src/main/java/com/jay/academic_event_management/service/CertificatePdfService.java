package com.jay.academic_event_management.service;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Image;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfWriter;
import com.jay.academic_event_management.entity.Certificate;
import com.jay.academic_event_management.entity.Event;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.awt.image.BufferedImage;
import java.net.URL;
import javax.imageio.ImageIO;

@Service
public class CertificatePdfService {

    private static final float W = 595.28f;
    private static final float H = 841.89f;
    private static final float CX = W / 2;

    public byte[] generateCertificate(Certificate certificate) {
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            Document doc = new Document(PageSize.A4);
            PdfWriter writer = PdfWriter.getInstance(doc, out);
            doc.open();

            Event event = certificate.getRegistration().getEvent();
            String categoryName = (event.getCategory() != null) ? event.getCategory().getCategoryName() : "";

            PdfContentByte canvas = writer.getDirectContent();

            drawBackgroundImage(canvas, categoryName);
            drawCollegeLogo(canvas);
            drawContent(canvas, certificate, categoryName);

            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private void drawBackgroundImage(PdfContentByte c, String category) {
        try {
            String cat = category != null ? category.toUpperCase().trim() : "";
            String fileName;
            if (cat.contains("WORKSHOP")) fileName = "bg_workshop.png";
            else if (cat.contains("TECHNICAL")) fileName = "bg_technical.png";
            else if (cat.contains("SEMINAR")) fileName = "bg_seminar.png";
            else if (cat.contains("CULTURAL")) fileName = "bg_cultural.png";
            else if (cat.contains("HACKATHON")) fileName = "bg_hackathon.png";
            else fileName = "bg_workshop.png";

            URL imageUrl = getClass().getClassLoader().getResource("certificate/" + fileName);
            if (imageUrl != null) {
                Image bg = Image.getInstance(imageUrl);
                bg.scaleAbsolute(W, H);
                bg.setAbsolutePosition(0, 0);
                c.addImage(bg);
            }
        } catch (Exception e) {
            c.saveState();
            c.setColorFill(new BaseColor(255, 255, 255));
            c.rectangle(0, 0, W, H);
            c.fill();
            c.restoreState();
        }
    }

    private void drawCollegeLogo(PdfContentByte c) {
        try {
            URL logoUrl = getClass().getClassLoader().getResource("certificate/college_logo.png");
            if (logoUrl != null) {
                // Remove white/light background from logo
                BufferedImage original = ImageIO.read(logoUrl.openStream());
                BufferedImage processed = removeBackground(original);

                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                ImageIO.write(processed, "png", baos);
                byte[] logoBytes = baos.toByteArray();

                Image logo = Image.getInstance(logoBytes);
                logo.scaleAbsolute(90, 90);
                logo.setAbsolutePosition(CX - 45, H - 183);
                c.addImage(logo);
            }
        } catch (Exception e) {
            // skip
        }
    }

    private BufferedImage removeBackground(BufferedImage src) {
        int w = src.getWidth();
        int h = src.getHeight();
        BufferedImage dst = new BufferedImage(w, h, BufferedImage.TYPE_INT_ARGB);

        // Sample background color from top-left corner
        int bgRgb = src.getRGB(0, 0) & 0x00FFFFFF;

        for (int y = 0; y < h; y++) {
            for (int x = 0; x < w; x++) {
                int rgb = src.getRGB(x, y);
                int r = (rgb >> 16) & 0xFF;
                int g = (rgb >> 8) & 0xFF;
                int b = rgb & 0xFF;

                int bgR = (bgRgb >> 16) & 0xFF;
                int bgG = (bgRgb >> 8) & 0xFF;
                int bgB = bgRgb & 0xFF;

                // Calculate color distance from background
                int diff = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);

                if (diff < 30) {
                    // Near background color → make transparent
                    dst.setRGB(x, y, 0x00000000);
                } else if (diff < 80) {
                    // Edge pixels → partial transparency for smooth edges
                    int alpha = Math.min(255, diff * 4);
                    dst.setRGB(x, y, (alpha << 24) | (r << 16) | (g << 8) | b);
                } else {
                    // Keep original pixel
                    dst.setRGB(x, y, rgb);
                }
            }
        }
        return dst;
    }

    private void drawContent(PdfContentByte c, Certificate cert, String categoryName) throws Exception {
        String catUpper = categoryName != null ? categoryName.toUpperCase().trim() : "";

        BaseFont titleFont = BaseFont.createFont(BaseFont.HELVETICA_BOLD, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
        BaseFont regularFont = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
        BaseFont italicFont = BaseFont.createFont(BaseFont.HELVETICA_OBLIQUE, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);

        String studentName = cert.getRegistration().getUser().getFullName();
        String eventTitle = cert.getRegistration().getEvent().getEventTitle();
        String organizerName = cert.getRegistration().getEvent().getFacultyCoordinatorName();

        BaseColor titleColor, accentColor, subColor, nameColor;
        if (catUpper.contains("TECHNICAL")) {
            titleColor = new BaseColor(15, 40, 75);
            accentColor = new BaseColor(0, 130, 170);
            subColor = new BaseColor(80, 100, 120);
            nameColor = new BaseColor(15, 40, 75);
        } else if (catUpper.contains("SEMINAR")) {
            titleColor = new BaseColor(20, 42, 30);
            accentColor = new BaseColor(45, 80, 60);
            subColor = new BaseColor(90, 105, 95);
            nameColor = new BaseColor(30, 60, 45);
        } else if (catUpper.contains("CULTURAL")) {
            titleColor = new BaseColor(140, 35, 15);
            accentColor = new BaseColor(200, 85, 35);
            subColor = new BaseColor(130, 95, 80);
            nameColor = new BaseColor(160, 50, 25);
        } else if (catUpper.contains("HACKATHON")) {
            titleColor = new BaseColor(30, 20, 60);
            accentColor = new BaseColor(90, 45, 160);
            subColor = new BaseColor(100, 90, 130);
            nameColor = new BaseColor(0, 140, 180);
        } else {
            titleColor = new BaseColor(18, 40, 75);
            accentColor = new BaseColor(190, 160, 70);
            subColor = new BaseColor(100, 100, 100);
            nameColor = new BaseColor(18, 40, 75);
        }

        String heading = getHeading(catUpper);

        // ========== SYSTEM NAME ==========
        c.beginText();
        c.setFontAndSize(titleFont, 14);
        c.setColorFill(accentColor);
        c.showTextAligned(Element.ALIGN_CENTER, "ACADEMIC EVENT PLANNER AND MANAGEMENT SYSTEM", CX, H - 255, 0);
        c.endText();

        // ========== CERTIFICATE TITLE ==========
        c.beginText();
        c.setFontAndSize(titleFont, 28);
        c.setColorFill(titleColor);
        c.showTextAligned(Element.ALIGN_CENTER, heading, CX, H - 340, 0);
        c.endText();

        // ========== DIVIDER UNDER TITLE ==========
        c.saveState();
        c.setColorStroke(accentColor);
        c.setLineWidth(1.5f);
        c.moveTo(CX - 180, H - 365);
        c.lineTo(CX + 180, H - 365);
        c.stroke();
        c.restoreState();

        // ========== CERTIFY TEXT ==========
        c.beginText();
        c.setFontAndSize(italicFont, 13);
        c.setColorFill(subColor);
        c.showTextAligned(Element.ALIGN_CENTER, "This is to certify that", CX, H - 405, 0);
        c.endText();

        // ========== STUDENT NAME ==========
        c.beginText();
        c.setFontAndSize(titleFont, 30);
        c.setColorFill(nameColor);
        c.showTextAligned(Element.ALIGN_CENTER, studentName, CX, H - 460, 0);
        c.endText();

        // Name underline with dots
        c.saveState();
        c.setColorStroke(accentColor);
        c.setLineWidth(2f);
        c.moveTo(CX - 170, H - 472);
        c.lineTo(CX + 170, H - 472);
        c.stroke();
        c.restoreState();
        drawSmallDiamond(c, CX - 170, H - 472, 5, accentColor);
        drawSmallDiamond(c, CX + 170, H - 472, 5, accentColor);

        // ========== PARTICIPATED TEXT ==========
        c.beginText();
        c.setFontAndSize(italicFont, 12);
        c.setColorFill(subColor);
        c.showTextAligned(Element.ALIGN_CENTER, "has successfully participated in", CX, H - 510, 0);
        c.endText();

        // ========== EVENT NAME ==========
        c.beginText();
        c.setFontAndSize(titleFont, 19);
        c.setColorFill(accentColor);
        c.showTextAligned(Element.ALIGN_CENTER, eventTitle, CX, H - 555, 0);
        c.endText();

        // ========== CATEGORY ==========
        if (!categoryName.isEmpty()) {
            c.beginText();
            c.setFontAndSize(italicFont, 11);
            c.setColorFill(subColor);
            c.showTextAligned(Element.ALIGN_CENTER, "Category", CX, H - 590, 0);
            c.setFontAndSize(titleFont, 13);
            c.setColorFill(accentColor);
            c.showTextAligned(Element.ALIGN_CENTER, categoryName, CX, H - 608, 0);
            c.endText();
        }

        // ========== CERTIFICATE INFO ==========
        c.beginText();
        c.setFontAndSize(regularFont, 9);
        c.setColorFill(subColor);
        c.showTextAligned(Element.ALIGN_LEFT, "Certificate No:", 195, 220, 0);
        c.setFontAndSize(titleFont, 9);
        c.setColorFill(titleColor);
        c.showTextAligned(Element.ALIGN_LEFT, cert.getCertificateNumber(), 275, 220, 0);

        c.setFontAndSize(regularFont, 9);
        c.setColorFill(subColor);
        c.showTextAligned(Element.ALIGN_LEFT, "Date of Issue:", 195, 200, 0);
        c.setFontAndSize(titleFont, 9);
        c.setColorFill(titleColor);
        c.showTextAligned(Element.ALIGN_LEFT, cert.getIssueDate().toString(), 275, 200, 0);
        c.endText();

        // ========== SIGNATURE ==========
        // Draw signature line
        c.saveState();
        c.setColorStroke(subColor);
        c.setLineWidth(0.8f);
        c.moveTo(CX + 90, 170);
        c.lineTo(CX + 210, 170);
        c.stroke();
        c.restoreState();

        // Draw handwritten-style signature
        drawSignature(c, CX + 150, 188);

        c.beginText();
        c.setFontAndSize(regularFont, 8);
        c.setColorFill(subColor);
        c.showTextAligned(Element.ALIGN_CENTER, "Authorized Signature", CX + 150, 158, 0);
        if (organizerName != null && !organizerName.isEmpty()) {
            c.setFontAndSize(titleFont, 9);
            c.setColorFill(titleColor);
            c.showTextAligned(Element.ALIGN_CENTER, organizerName, CX + 150, 144, 0);
        }
        c.endText();

        // ========== FOOTER ==========
        c.beginText();
        c.setFontAndSize(regularFont, 7);
        c.setColorFill(new BaseColor(140, 140, 140));
        c.showTextAligned(Element.ALIGN_CENTER, "Academic Event Planner and Management System  |  Verify at your institution portal", CX, 108, 0);
        c.endText();
    }

    private void drawSmallDiamond(PdfContentByte c, float cx, float cy, float size, BaseColor color) {
        c.saveState();
        c.setColorFill(color);
        c.moveTo(cx, cy + size);
        c.lineTo(cx + size, cy);
        c.lineTo(cx, cy - size);
        c.lineTo(cx - size, cy);
        c.closePath();
        c.fill();
        c.restoreState();
    }

    private void drawSignature(PdfContentByte c, float cx, float cy) {
        c.saveState();
        c.setColorStroke(new BaseColor(30, 30, 80));
        c.setLineWidth(1.2f);
        c.setLineCap(1);
        c.setLineJoin(1);
        // First letter stroke
        c.moveTo(cx - 45, cy + 5);
        c.lineTo(cx - 40, cy + 15);
        c.curveTo(cx - 38, cy + 20, cx - 30, cy + 18, cx - 28, cy + 10);
        c.curveTo(cx - 26, cy + 2, cx - 32, cy - 5, cx - 25, cy - 3);
        c.stroke();
        // Middle swoosh
        c.moveTo(cx - 25, cy - 3);
        c.curveTo(cx - 15, cy + 5, cx - 5, cy - 8, cx + 5, cy + 2);
        c.curveTo(cx + 12, cy + 10, cx + 18, cy - 5, cx + 25, cy + 5);
        c.stroke();
        // Final underline flick
        c.setLineWidth(1.5f);
        c.moveTo(cx + 25, cy + 5);
        c.curveTo(cx + 30, cy + 8, cx + 35, cy + 2, cx + 40, cy + 6);
        c.stroke();
        c.restoreState();
    }

    private String getHeading(String category) {
        if (category.contains("WORKSHOP")) return "CERTIFICATE OF COMPLETION";
        if (category.contains("TECHNICAL")) return "CERTIFICATE OF ACHIEVEMENT";
        if (category.contains("SEMINAR")) return "CERTIFICATE OF PARTICIPATION";
        if (category.contains("CULTURAL")) return "CERTIFICATE OF EXCELLENCE";
        if (category.contains("HACKATHON")) return "CERTIFICATE OF ACHIEVEMENT";
        return "CERTIFICATE OF PARTICIPATION";
    }
}
