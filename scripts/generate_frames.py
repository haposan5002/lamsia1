import os
import math
from PIL import Image, ImageDraw

def generate_frames():
    output_dir = "public/sequence"
    os.makedirs(output_dir, exist_ok=True)

    width, height = 1920, 1080
    num_frames = 100

    # Colors
    bg_color = (250, 246, 240)  # #FAF6F0 (Cream)
    accent_color = (27, 59, 54) # #1B3B36 (Forest Green)
    secondary_color = (212, 175, 55) # #D4AF37 (Gold)

    print(f"Generating {num_frames} frames in {output_dir}...")

    for i in range(num_frames):
        img = Image.new("RGB", (width, height), bg_color)
        draw = ImageDraw.Draw(img, "RGBA")

        # Calculate progress (0.0 to 1.0)
        progress = i / (num_frames - 1)
        
        # Center of the screen
        cx, cy = width // 2, height // 2

        # Draw a morphing/spinning geometric abstraction
        # We will draw a series of concentric circles that expand and shift
        
        num_circles = 15
        for j in range(num_circles):
            # Inner circles rotate faster
            angle = (progress * math.pi * 4) + (j * 0.5)
            
            # Radius expands
            base_radius = 50 + (j * 40)
            radius = base_radius + math.sin(progress * math.pi * 2 + j) * 20
            
            # Offset based on angle
            x_offset = math.cos(angle) * (100 + j * 10)
            y_offset = math.sin(angle) * (100 + j * 10)
            
            # Interpolate color from Forest Green to Gold based on depth (j) and time (progress)
            color_progress = (j / num_circles + progress) % 1.0
            r = int(accent_color[0] * (1 - color_progress) + secondary_color[0] * color_progress)
            g = int(accent_color[1] * (1 - color_progress) + secondary_color[1] * color_progress)
            b = int(accent_color[2] * (1 - color_progress) + secondary_color[2] * color_progress)
            
            # Alpha fades out for outer circles
            alpha = int(255 * (1 - (j / num_circles)))
            
            # Draw the circle
            x1 = cx + x_offset - radius
            y1 = cy + y_offset - radius
            x2 = cx + x_offset + radius
            y2 = cy + y_offset + radius
            
            draw.ellipse([x1, y1, x2, y2], outline=(r, g, b, alpha), width=3)

        # Draw a central glowing orb
        orb_radius = 80 + math.sin(progress * math.pi * 4) * 20
        draw.ellipse(
            [cx - orb_radius, cy - orb_radius, cx + orb_radius, cy + orb_radius], 
            fill=(accent_color[0], accent_color[1], accent_color[2], 200)
        )

        # Save frame
        filename = f"frame_{i:04d}.jpg"
        img.save(os.path.join(output_dir, filename), "JPEG", quality=85)
        
        if (i + 1) % 10 == 0:
            print(f"Generated {i + 1}/{num_frames} frames")

    print("Done generating frames.")

if __name__ == "__main__":
    generate_frames()
