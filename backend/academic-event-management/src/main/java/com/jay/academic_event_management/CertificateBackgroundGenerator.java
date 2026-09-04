package com.jay.academic_event_management;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.geom.*;
import java.awt.image.BufferedImage;
import java.io.File;


public class CertificateBackgroundGenerator {

    static final int W = 2480;
    static final int H = 3508;
    static final int CX = W / 2;
    static final int MARGIN = 80;

    public static void main(String[] args) throws Exception {
        String outDir = "src/main/resources/certificate/";

        generateWorkshop(outDir + "bg_workshop.png");
        generateTechnical(outDir + "bg_technical.png");
        generateSeminar(outDir + "bg_seminar.png");
        generateCultural(outDir + "bg_cultural.png");
        generateHackathon(outDir + "bg_hackathon.png");

        System.out.println("All 5 certificate backgrounds generated!");
    }

    // ==================== WORKSHOP — Navy + Gold Classical ====================
    static void generateWorkshop(String path) throws Exception {
        BufferedImage img = new BufferedImage(W, H, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = img.createGraphics();
        Q(g);

        // Cream background
        fillGrad(g, 0, 0, W, H, new Color(255, 252, 240), new Color(245, 238, 220));

        // Outer border
        g.setColor(new Color(18, 40, 75));
        g.setStroke(new BasicStroke(14));
        g.drawRect(MARGIN, MARGIN, W - MARGIN * 2, H - MARGIN * 2);

        // Gold inner border
        g.setColor(new Color(190, 160, 70));
        g.setStroke(new BasicStroke(4));
        g.drawRect(MARGIN + 20, MARGIN + 20, W - (MARGIN + 20) * 2, H - (MARGIN + 20) * 2);

        // Thin decorative line
        g.setColor(new Color(190, 160, 70, 120));
        g.setStroke(new BasicStroke(1.5f));
        g.drawRect(MARGIN + 35, MARGIN + 35, W - (MARGIN + 35) * 2, H - (MARGIN + 35) * 2);

        // Double-line top band
        fillGrad(g, 0, 200, W, 500, new Color(18, 40, 75), new Color(25, 55, 100));
        g.setColor(new Color(190, 160, 70));
        g.fillRect(0, 195, W, 6);
        g.fillRect(0, 500, W, 6);

        // Gold pinstripe in band
        g.setColor(new Color(210, 185, 110));
        g.setStroke(new BasicStroke(1));
        g.drawLine(MARGIN + 50, 350, W - MARGIN - 50, 350);

        // Bottom band
        fillGrad(g, 0, H - 350, W, H - 80, new Color(18, 40, 75), new Color(25, 55, 100));
        g.setColor(new Color(190, 160, 70));
        g.fillRect(0, H - 355, W, 6);
        g.fillRect(0, H - 85, W, 6);

        // Corner ornaments — ornate gold C-curves
        for (int[] corner : new int[][]{{1, 1}, {-1, 1}, {1, -1}, {-1, -1}}) {
            drawWorkshopCorner(g, corner[0], corner[1]);
        }

        // Side decorative elements — vertical gold bars
        for (int y = 600; y < H - 600; y += 80) {
            g.setColor(new Color(190, 160, 70, 40));
            g.fillRect(MARGIN + 40, y, 3, 40);
            g.fillRect(W - MARGIN - 43, y, 3, 40);
        }

        // Center decorative line below header
        g.setColor(new Color(190, 160, 70));
        g.setStroke(new BasicStroke(2));
        g.drawLine(CX - 200, 545, CX + 200, 545);
        drawGoldDot(g, CX - 200, 545, 6);
        drawGoldDot(g, CX + 200, 545, 6);
        drawGoldDot(g, CX, 545, 8);

        // Seal placeholder area
        drawWorkshopSeal(g, CX, H - 580);

        g.dispose();
        ImageIO.write(img, "png", new File(path));
    }

    // ==================== TECHNICAL — Light Professional + Blue/Cyan ====================
    static void generateTechnical(String path) throws Exception {
        BufferedImage img = new BufferedImage(W, H, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = img.createGraphics();
        Q(g);

        // Light background
        fillGrad(g, 0, 0, W, H, new Color(248, 252, 255), new Color(240, 246, 252));

        // Double border — dark blue outer, cyan inner
        g.setColor(new Color(15, 45, 80));
        g.setStroke(new BasicStroke(8));
        g.drawRect(MARGIN, MARGIN, W - MARGIN * 2, H - MARGIN * 2);

        g.setColor(new Color(0, 160, 200));
        g.setStroke(new BasicStroke(2));
        g.drawRect(MARGIN + 20, MARGIN + 20, W - (MARGIN + 20) * 2, H - (MARGIN + 20) * 2);

        // Thin decorative line
        g.setColor(new Color(15, 45, 80, 60));
        g.setStroke(new BasicStroke(0.8f));
        g.drawRect(MARGIN + 32, MARGIN + 32, W - (MARGIN + 32) * 2, H - (MARGIN + 32) * 2);

        // Subtle grid pattern (very light)
        g.setColor(new Color(15, 45, 80, 15));
        g.setStroke(new BasicStroke(0.3f));
        for (int i = 0; i < W; i += 60) g.drawLine(i, MARGIN + 40, i, H - MARGIN - 40);
        for (int j = 0; j < H; j += 60) g.drawLine(MARGIN + 40, j, W - MARGIN - 40, j);

        // Top decorative lines
        g.setColor(new Color(15, 45, 80));
        g.setStroke(new BasicStroke(1.5f));
        g.drawLine(MARGIN + 50, 225, W - MARGIN - 50, 225);
        g.setColor(new Color(0, 160, 200));
        g.setStroke(new BasicStroke(1f));
        g.drawLine(MARGIN + 50, 233, W - MARGIN - 50, 233);

        // Bottom decorative lines
        g.setColor(new Color(15, 45, 80));
        g.setStroke(new BasicStroke(1.5f));
        g.drawLine(MARGIN + 50, H - 235, W - MARGIN - 50, H - 235);
        g.setColor(new Color(0, 160, 200));
        g.setStroke(new BasicStroke(1f));
        g.drawLine(MARGIN + 50, H - 227, W - MARGIN - 50, H - 227);

        // Corner accents
        drawHackathonCorner(g, MARGIN + 38, MARGIN + 38, 1, 1);
        drawHackathonCorner(g, W - MARGIN - 38, MARGIN + 38, -1, 1);
        drawHackathonCorner(g, MARGIN + 38, H - MARGIN - 38, 1, -1);
        drawHackathonCorner(g, W - MARGIN - 38, H - MARGIN - 38, -1, -1);

        // Header divider
        g.setColor(new Color(15, 45, 80));
        g.setStroke(new BasicStroke(1.5f));
        g.drawLine(CX - 150, 545, CX - 10, 545);
        g.setColor(new Color(0, 160, 200));
        g.drawLine(CX + 10, 545, CX + 150, 545);

        // Seal
        drawTechSeal(g, CX, H - 580);

        g.dispose();
        ImageIO.write(img, "png", new File(path));
    }

    // ==================== SEMINAR — Olive Green + Gold Formal ====================
    static void generateSeminar(String path) throws Exception {
        BufferedImage img = new BufferedImage(W, H, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = img.createGraphics();
        Q(g);

        // Warm off-white
        fillGrad(g, 0, 0, W, H, new Color(252, 250, 245), new Color(245, 240, 230));

        // Triple border — outer olive
        g.setColor(new Color(45, 80, 60));
        g.setStroke(new BasicStroke(10));
        g.drawRect(MARGIN, MARGIN, W - MARGIN * 2, H - MARGIN * 2);

        // Middle gold
        g.setColor(new Color(170, 145, 100));
        g.setStroke(new BasicStroke(3));
        g.drawRect(MARGIN + 22, MARGIN + 22, W - (MARGIN + 22) * 2, H - (MARGIN + 22) * 2);

        // Inner olive thin
        g.setColor(new Color(45, 80, 60, 150));
        g.setStroke(new BasicStroke(1));
        g.drawRect(MARGIN + 38, MARGIN + 38, W - (MARGIN + 38) * 2, H - (MARGIN + 38) * 2);

        // Top decorative lines only (no green band)
        g.setColor(new Color(170, 145, 100));
        g.setStroke(new BasicStroke(1.5f));
        g.drawLine(MARGIN + 50, 220, W - MARGIN - 50, 220);
        g.drawLine(MARGIN + 50, 235, W - MARGIN - 50, 235);

        // Bottom decorative lines only (no green band)
        g.setColor(new Color(170, 145, 100));
        g.setStroke(new BasicStroke(1.5f));
        g.drawLine(MARGIN + 50, H - 240, W - MARGIN - 50, H - 240);
        g.drawLine(MARGIN + 50, H - 225, W - MARGIN - 50, H - 225);

        // Corner brackets — formal L-shapes
        for (int[] corner : new int[][]{{1, 1}, {-1, 1}, {1, -1}, {-1, -1}}) {
            drawSeminarBracket(g, corner[0], corner[1]);
        }

        // Small ornamental dots along sides
        for (int y = 580; y < H - 580; y += 60) {
            g.setColor(new Color(170, 145, 100, 50));
            g.fillOval(MARGIN + 46, y - 3, 6, 6);
            g.fillOval(W - MARGIN - 52, y - 3, 6, 6);
        }

        // Header divider
        g.setColor(new Color(170, 145, 100));
        g.setStroke(new BasicStroke(1.5f));
        g.drawLine(CX - 160, 545, CX + 160, 545);

        // Seal
        drawSeminarSeal(g, CX, H - 575);

        g.dispose();
        ImageIO.write(img, "png", new File(path));
    }

    // ==================== CULTURAL — Orange + Purple Vibrant ====================
    static void generateCultural(String path) throws Exception {
        BufferedImage img = new BufferedImage(W, H, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = img.createGraphics();
        Q(g);

        // Warm background
        fillGrad(g, 0, 0, W, H, new Color(255, 252, 245), new Color(250, 245, 235));

        // Borders
        g.setColor(new Color(200, 85, 35));
        g.setStroke(new BasicStroke(8));
        g.drawRect(MARGIN, MARGIN, W - MARGIN * 2, H - MARGIN * 2);
        g.setColor(new Color(140, 55, 125));
        g.setStroke(new BasicStroke(3));
        g.drawRect(MARGIN + 22, MARGIN + 22, W - (MARGIN + 22) * 2, H - (MARGIN + 22) * 2);

        // Top gradient band (orange → red)
        for (int i = 0; i < 300; i++) {
            float r = i / 300f;
            g.setColor(new Color((int)(210 + r * 35), (int)(75 - r * 30), (int)(25 + r * 20)));
            g.drawLine(0, 210 + i, W, 210 + i);
        }
        g.setColor(new Color(218, 165, 32));
        g.fillRect(0, 204, W, 7);
        g.fillRect(0, 510, W, 7);

        // Bottom gradient band (orange → purple)
        for (int i = 0; i < 260; i++) {
            float r = i / 260f;
            g.setColor(new Color((int)(180 + r * 40), (int)(55 + r * 10), (int)(65 + r * 50)));
            g.drawLine(0, H - 350 + i, W, H - 350 + i);
        }
        g.setColor(new Color(218, 165, 32));
        g.fillRect(0, H - 356, W, 7);
        g.fillRect(0, H - 90, W, 7);

        // Corner circles — concentric
        for (int[] corner : new int[][]{{1, 1}, {-1, 1}, {1, -1}, {-1, -1}}) {
            drawCulturalCorner(g, corner[0], corner[1]);
        }

        // Decorative dots along accent lines
        g.setColor(new Color(218, 165, 32));
        for (int x = 200; x < W - 200; x += 30) {
            g.fillOval(x - 3, 200, 6, 6);
            g.fillOval(x - 3, 510, 6, 6);
            g.fillOval(x - 3, H - 355, 6, 6);
            g.fillOval(x - 3, H - 90, 6, 6);
        }

        // Header divider
        g.setColor(new Color(200, 85, 35));
        g.setStroke(new BasicStroke(2));
        g.drawLine(CX - 170, 545, CX + 170, 545);

        // Seal
        drawCulturalSeal(g, CX, H - 575);

        g.dispose();
        ImageIO.write(img, "png", new File(path));
    }

    // ==================== HACKATHON — Light Professional + Purple/Cyan ====================
    static void generateHackathon(String path) throws Exception {
        BufferedImage img = new BufferedImage(W, H, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = img.createGraphics();
        Q(g);

        // Light cream background
        fillGrad(g, 0, 0, W, H, new Color(252, 250, 248), new Color(248, 244, 238));

        // Double border — purple outer, cyan inner
        g.setColor(new Color(90, 45, 160));
        g.setStroke(new BasicStroke(8));
        g.drawRect(MARGIN, MARGIN, W - MARGIN * 2, H - MARGIN * 2);

        g.setColor(new Color(0, 160, 200));
        g.setStroke(new BasicStroke(2));
        g.drawRect(MARGIN + 20, MARGIN + 20, W - (MARGIN + 20) * 2, H - (MARGIN + 20) * 2);

        // Thin decorative line
        g.setColor(new Color(90, 45, 160, 80));
        g.setStroke(new BasicStroke(0.8f));
        g.drawRect(MARGIN + 32, MARGIN + 32, W - (MARGIN + 32) * 2, H - (MARGIN + 32) * 2);

        // Top decorative lines
        g.setColor(new Color(90, 45, 160));
        g.setStroke(new BasicStroke(1.5f));
        g.drawLine(MARGIN + 50, 225, W - MARGIN - 50, 225);
        g.setColor(new Color(0, 160, 200));
        g.setStroke(new BasicStroke(1f));
        g.drawLine(MARGIN + 50, 233, W - MARGIN - 50, 233);

        // Bottom decorative lines
        g.setColor(new Color(90, 45, 160));
        g.setStroke(new BasicStroke(1.5f));
        g.drawLine(MARGIN + 50, H - 235, W - MARGIN - 50, H - 235);
        g.setColor(new Color(0, 160, 200));
        g.setStroke(new BasicStroke(1f));
        g.drawLine(MARGIN + 50, H - 227, W - MARGIN - 50, H - 227);

        // Corner accents
        drawHackathonCorner(g, MARGIN + 38, MARGIN + 38, 1, 1);
        drawHackathonCorner(g, W - MARGIN - 38, MARGIN + 38, -1, 1);
        drawHackathonCorner(g, MARGIN + 38, H - MARGIN - 38, 1, -1);
        drawHackathonCorner(g, W - MARGIN - 38, H - MARGIN - 38, -1, -1);

        // Header divider
        g.setColor(new Color(90, 45, 160));
        g.setStroke(new BasicStroke(1.5f));
        g.drawLine(CX - 150, 545, CX - 10, 545);
        g.setColor(new Color(0, 160, 200));
        g.drawLine(CX + 10, 545, CX + 150, 545);

        // Seal
        drawHackathonSeal(g, CX, H - 580);

        g.dispose();
        ImageIO.write(img, "png", new File(path));
    }

    // ==================== UTILITY METHODS ====================

    static void Q(Graphics2D g) {
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
        g.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC);
    }

    static void fillGrad(Graphics2D g, int x, int y, int w, int h, Color top, Color bot) {
        g.setPaint(new GradientPaint(x, y, top, x, y + h, bot));
        g.fillRect(x, y, w, h);
    }

    static void drawGoldDot(Graphics2D g, int x, int y, int r) {
        g.setColor(new Color(190, 160, 70));
        g.fillOval(x - r, y - r, r * 2, r * 2);
    }

    static void drawCircuitNode(Graphics2D g, int x, int y, int r, Color color) {
        g.setColor(new Color(color.getRed(), color.getGreen(), color.getBlue(), 40));
        g.fillOval(x - r - 4, y - r - 4, (r + 4) * 2, (r + 4) * 2);
        g.setColor(color);
        g.fillOval(x - r, y - r, r * 2, r * 2);
    }

    static void drawHexOutline(Graphics2D g, int cx, int cy, int r, Color color) {
        g.setColor(color);
        g.setStroke(new BasicStroke(1.2f));
        int[] xPts = new int[6], yPts = new int[6];
        for (int i = 0; i < 6; i++) {
            double a = Math.PI / 3 * i - Math.PI / 6;
            xPts[i] = (int) (cx + r * Math.cos(a));
            yPts[i] = (int) (cy + r * Math.sin(a));
        }
        g.drawPolygon(xPts, yPts, 6);
    }

    // ========== WORKSHOP DECORATORS ==========
    static void drawWorkshopCorner(Graphics2D g, int dx, int dy) {
        int x = dx > 0 ? MARGIN + 50 : W - MARGIN - 50;
        int y = dy > 0 ? MARGIN + 50 : H - MARGIN - 50;
        g.setColor(new Color(190, 160, 70));
        g.setStroke(new BasicStroke(5, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
        // Ornate C-curve
        QuadCurve2D q1 = new QuadCurve2D.Double(x, y + dy * 100, x + dx * 60, y + dy * 50, x + dx * 100, y);
        g.draw(q1);
        QuadCurve2D q2 = new QuadCurve2D.Double(x + dx * 15, y + dy * 100, x + dx * 65, y + dy * 65, x + dx * 100, y + dy * 15);
        g.draw(q2);
        // Small diamond
        int[] xPts = {x + dx * 55, x + dx * 65, x + dx * 55, x + dx * 45};
        int[] yPts = {y + dy * 55, y + dy * 45, y + dy * 35, y + dy * 45};
        g.fillPolygon(xPts, yPts, 4);
    }

    static void drawWorkshopSeal(Graphics2D g, int cx, int cy) {
        int r = 100;
        // Glow
        g.setColor(new Color(190, 160, 70, 25));
        g.fillOval(cx - r - 20, cy - r - 20, (r + 20) * 2, (r + 20) * 2);
        // Outer ring
        g.setColor(new Color(190, 160, 70));
        g.fillOval(cx - r, cy - r, r * 2, r * 2);
        // Inner
        g.setColor(new Color(18, 40, 75));
        g.fillOval(cx - r + 18, cy - r + 18, (r - 18) * 2, (r - 18) * 2);
        // Star
        g.setColor(new Color(190, 160, 70));
        drawStar(g, cx, cy, 5, r - 32, r / 3);
    }

    static void drawStar(Graphics2D g, int cx, int cy, int pts, int outerR, int innerR) {
        int[] xP = new int[pts * 2], yP = new int[pts * 2];
        double a = Math.PI / 2, step = Math.PI / pts;
        for (int i = 0; i < pts * 2; i++) {
            int r = (i % 2 == 0) ? outerR : innerR;
            xP[i] = (int) (cx + r * Math.cos(a));
            yP[i] = (int) (cy + r * Math.sin(a));
            a -= step;
        }
        g.fillPolygon(xP, yP, pts * 2);
    }

    // ========== TECHNICAL DECORATORS ==========
    static void drawCircuitTrace(Graphics2D g, int x, int y, int dx, int dy) {
        g.setColor(new Color(0, 180, 220));
        g.setStroke(new BasicStroke(2.5f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND));
        g.drawLine(x, y, x + dx * 60, y);
        g.drawLine(x + dx * 60, y, x + dx * 60, y + dy * 40);
        g.drawLine(x + dx * 60, y + dy * 40, x + dx * 100, y + dy * 40);
        drawCircuitNode(g, x + dx * 100, y + dy * 40, 4, new Color(0, 220, 255));
    }

    static void drawTechSeal(Graphics2D g, int cx, int cy) {
        int r = 95;
        g.setColor(new Color(15, 45, 80, 20));
        g.fillOval(cx - r - 15, cy - r - 15, (r + 15) * 2, (r + 15) * 2);
        // Hexagon
        int[] xP = new int[6], yP = new int[6];
        for (int i = 0; i < 6; i++) {
            double a = Math.PI / 3 * i - Math.PI / 6;
            xP[i] = (int) (cx + r * Math.cos(a));
            yP[i] = (int) (cy + r * Math.sin(a));
        }
        g.setColor(new Color(15, 45, 80));
        g.fillPolygon(xP, yP, 6);
        g.setColor(new Color(248, 252, 255));
        int ri = r - 16;
        int[] xi = new int[6], yi = new int[6];
        for (int i = 0; i < 6; i++) {
            double a = Math.PI / 3 * i - Math.PI / 6;
            xi[i] = (int) (cx + ri * Math.cos(a));
            yi[i] = (int) (cy + ri * Math.sin(a));
        }
        g.fillPolygon(xi, yi, 6);
        g.setColor(new Color(15, 45, 80));
        drawStar(g, cx, cy, 6, ri - 20, ri / 3);
    }

    // ========== SEMINAR DECORATORS ==========
    static void drawSeminarBracket(Graphics2D g, int dx, int dy) {
        int x = dx > 0 ? MARGIN + 55 : W - MARGIN - 55;
        int y = dy > 0 ? MARGIN + 55 : H - MARGIN - 55;
        g.setColor(new Color(170, 145, 100));
        g.setStroke(new BasicStroke(4, BasicStroke.CAP_SQUARE, BasicStroke.JOIN_MITER));
        g.drawLine(x, y + dy * 80, x, y);
        g.drawLine(x, y, x + dx * 80, y);
        g.setStroke(new BasicStroke(1.5f));
        g.drawLine(x + dx * 8, y + dy * 80, x + dx * 8, y + dy * 8);
        g.drawLine(x + dx * 8, y + dy * 8, x + dx * 80, y + dy * 8);
    }

    static void drawSeminarSeal(Graphics2D g, int cx, int cy) {
        int r = 95;
        g.setColor(new Color(45, 80, 60, 25));
        g.fillOval(cx - r - 15, cy - r - 15, (r + 15) * 2, (r + 15) * 2);
        g.setColor(new Color(45, 80, 60));
        g.fillOval(cx - r, cy - r, r * 2, r * 2);
        g.setColor(new Color(170, 145, 100));
        g.fillOval(cx - r + 16, cy - r + 16, (r - 16) * 2, (r - 16) * 2);
        g.setColor(new Color(45, 80, 60));
        drawStar(g, cx, cy, 6, r - 30, r / 3);
    }

    // ========== CULTURAL DECORATORS ==========
    static void drawCulturalCorner(Graphics2D g, int dx, int dy) {
        int x = dx > 0 ? MARGIN + 50 : W - MARGIN - 50;
        int y = dy > 0 ? MARGIN + 50 : H - MARGIN - 50;
        // Concentric circles
        int[] sizes = {30, 20, 12};
        Color[] colors = {new Color(200, 85, 35), new Color(255, 255, 255), new Color(140, 55, 125)};
        for (int i = 0; i < sizes.length; i++) {
            g.setColor(colors[i]);
            g.fillOval(x - sizes[i], y - sizes[i], sizes[i] * 2, sizes[i] * 2);
        }
        // Decorative dots radiating out
        for (int angle = 0; angle < 360; angle += 45) {
            double rad = Math.toRadians(angle);
            int dotX = (int) (x + 40 * Math.cos(rad));
            int dotY = (int) (y + 40 * Math.sin(rad));
            g.setColor(new Color(218, 165, 32, 150));
            g.fillOval(dotX - 3, dotY - 3, 6, 6);
        }
    }

    static void drawCulturalSeal(Graphics2D g, int cx, int cy) {
        int r = 100;
        g.setColor(new Color(200, 85, 35, 25));
        g.fillOval(cx - r - 18, cy - r - 18, (r + 18) * 2, (r + 18) * 2);
        g.setColor(new Color(200, 85, 35));
        g.fillOval(cx - r, cy - r, r * 2, r * 2);
        g.setColor(new Color(255, 248, 235));
        g.fillOval(cx - r + 16, cy - r + 16, (r - 16) * 2, (r - 16) * 2);
        g.setColor(new Color(140, 55, 125));
        g.fillOval(cx - r + 28, cy - r + 28, (r - 28) * 2, (r - 28) * 2);
        g.setColor(new Color(200, 85, 35));
        drawStar(g, cx, cy, 5, r - 42, (r - 42) / 3);
    }

    // ========== HACKATHON DECORATORS ==========
    static void drawHackathonCorner(Graphics2D g, int x, int y, int dx, int dy) {
        // L-shaped corner accent
        g.setColor(new Color(0, 180, 220, 180));
        g.setStroke(new BasicStroke(3, BasicStroke.CAP_SQUARE, BasicStroke.JOIN_MITER));
        g.drawLine(x, y + dy * 50, x, y);
        g.drawLine(x, y, x + dx * 50, y);
        // Inner L
        g.setColor(new Color(120, 60, 200, 140));
        g.setStroke(new BasicStroke(1.5f));
        g.drawLine(x + dx * 8, y + dy * 50, x + dx * 8, y + dy * 8);
        g.drawLine(x + dx * 8, y + dy * 8, x + dx * 50, y + dy * 8);
    }

    static void drawHackathonSeal(Graphics2D g, int cx, int cy) {
        int r = 95;
        // Glow
        g.setColor(new Color(90, 45, 160, 25));
        g.fillOval(cx - r - 15, cy - r - 15, (r + 15) * 2, (r + 15) * 2);
        // Diamond
        int[] xP = {cx, cx + r, cx, cx - r};
        int[] yP = {cy + r, cy, cy - r, cy};
        g.setColor(new Color(90, 45, 160));
        g.fillPolygon(xP, yP, 4);
        // Inner diamond
        int ri = r - 16;
        int[] xi = {cx, cx + ri, cx, cx - ri};
        int[] yi = {cy + ri, cy, cy - ri, cy};
        g.setColor(new Color(252, 250, 248));
        g.fillPolygon(xi, yi, 4);
        // Star
        g.setColor(new Color(90, 45, 160));
        drawStar(g, cx, cy, 6, ri - 18, (ri - 18) / 3);
    }
}
