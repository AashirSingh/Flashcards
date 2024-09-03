import os
from PIL import Image, ImageDraw, ImageFont
import random

# Directory where images will be saved
output_dir = "sanskrit_dataset"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# List of fonts to use
font_paths = [
    "/Users/aashirsingh/Documents/testproject3/src/app/fonts/NotoSansDevanagari-VariableFont_wdth,wght.ttf"  # Replace with the correct path to your font file
]

# Function to generate a single image with the letter 'अ'
def generate_image(output_path, font_path, font_size, background_color, text_color):
    try:
        # Create an image with a specific background color
        img = Image.new('RGB', (200, 200), color=background_color)
        d = ImageDraw.Draw(img)
        
        # Load the font and set the font size
        font = ImageFont.truetype(font_path, font_size)
        
        # Calculate text position to center it
        text = "अ"
        text_width, text_height = d.textbbox((0, 0), text, font=font)[2:]
        position = ((200 - text_width) // 2, (200 - text_height) // 2)
        
        # Add the text to the image
        d.text(position, text, font=font, fill=text_color)
        
        # Save the image
        img.save(output_path)
    except Exception as e:
        print(f"Error generating image with font {font_path}: {e}")

# Generate dataset
num_images = 50000
for i in range(num_images):
    # Randomly choose font, font size, background color, and text color
    font_path = random.choice(font_paths)
    font_size = random.randint(80, 150)
    background_color = (random.randint(200, 255), random.randint(200, 255), random.randint(200, 255))
    text_color = (random.randint(0, 50), random.randint(0, 50), random.randint(0, 50))
    
    # Generate image path
    output_path = os.path.join(output_dir, f"sanskrit_a_{i}.png")
    
    # Generate the image
    generate_image(output_path, font_path, font_size, background_color, text_color)
    
    if (i+1) % 1000 == 0:
        print(f"Generated {i+1}/{num_images} images.")

print("Dataset generation completed.")
