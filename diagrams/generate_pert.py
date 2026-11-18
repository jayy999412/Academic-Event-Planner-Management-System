from PIL import Image, ImageDraw, ImageFont
import os

WIDTH = 1200
TASK_HEIGHT = 120
GAP = 15
HEADER_HEIGHT = 35
MARGIN_TOP = 80
MARGIN_LEFT = 100
BOX_WIDTH = 700

tasks = [
    ("01", "Project Planning & Requirement Analysis", "01", "05", "5d"),
    ("02", "System Analysis & Database Design", "06", "12", "7d"),
    ("03", "UI Design & Prototype Development", "13", "17", "5d"),
    ("04", "Module 1 - User Management & Authentication", "18", "25", "8d"),
    ("05", "Module 2 - Event Management", "26", "36", "11d"),
    ("06", "Module 3 - Registration & Participant Management", "37", "45", "9d"),
    ("07", "Module 4 - Payment & Certificate Management", "46", "54", "9d"),
    ("08", "Module 5 - Notification & Feedback", "55", "61", "7d"),
    ("09", "Module 6 - Reports & Analytics", "62", "69", "8d"),
    ("10", "System Integration & Testing", "70", "78", "9d"),
]

TOTAL_HEIGHT = MARGIN_TOP + len(tasks) * (TASK_HEIGHT + GAP) + 50

img = Image.new("RGB", (WIDTH, TOTAL_HEIGHT), "white")
draw = ImageDraw.Draw(img)

try:
    font_bold = ImageFont.truetype("arialbd.ttf", 18)
    font_normal = ImageFont.truetype("arial.ttf", 16)
    font_title = ImageFont.truetype("arialbd.ttf", 26)
    font_subtitle = ImageFont.truetype("arial.ttf", 18)
except:
    font_bold = ImageFont.truetype("arial.ttf", 18)
    font_normal = ImageFont.truetype("arial.ttf", 16)
    font_title = ImageFont.truetype("arial.ttf", 26)
    font_subtitle = ImageFont.truetype("arial.ttf", 18)

BLUE = "#1565C0"
WHITE = "#FFFFFF"
LIGHT_BLUE = "#E3F2FD"

x = MARGIN_LEFT
y = MARGIN_TOP

for num, name, start, finish, duration in tasks:
    header_h = HEADER_HEIGHT
    body_h = TASK_HEIGHT

    draw.rectangle([x, y, x + BOX_WIDTH, y + header_h], fill=BLUE)
    draw.text((x + 10, y + 8), f"{num}", fill=WHITE, font=font_bold)
    draw.text((x + 60, y + 8), "Task", fill=WHITE, font=font_bold)

    draw.rectangle([x, y + header_h, x + BOX_WIDTH, y + header_h + body_h], fill=WHITE, outline="#CCCCCC")

    draw.text((x + 20, y + header_h + 10), name, fill="#1a1a1a", font=font_bold)

    left_x = x + 20
    right_x = x + BOX_WIDTH // 2 + 20
    info_y = y + header_h + 40

    draw.text((left_x, info_y), f"Start Day: {start}", fill="#333333", font=font_normal)
    draw.text((right_x, info_y), start, fill="#333333", font=font_normal)

    draw.text((left_x, info_y + 22), f"Finish Day: {finish}", fill="#333333", font=font_normal)
    draw.text((right_x, info_y + 22), finish, fill="#333333", font=font_normal)

    draw.text((left_x, info_y + 44), f"Duration: {duration}", fill="#333333", font=font_normal)
    draw.text((right_x, info_y + 44), duration, fill="#333333", font=font_normal)

    arrow_start_y = y + header_h + body_h
    arrow_end_y = y + header_h + body_h + GAP
    arrow_x = x + BOX_WIDTH // 2

    draw.line([(arrow_x, arrow_start_y), (arrow_x, arrow_end_y)], fill=BLUE, width=3)
    draw.polygon([
        (arrow_x - 8, arrow_end_y - 8),
        (arrow_x + 8, arrow_end_y - 8),
        (arrow_x, arrow_end_y)
    ], fill=BLUE)

    y += TASK_HEIGHT + GAP + HEADER_HEIGHT

output_path = os.path.join(os.path.expanduser("~"), "Desktop", "pert_chart.png")
img.save(output_path, "PNG", dpi=(300, 300))
print(f"Saved to: {output_path}")
