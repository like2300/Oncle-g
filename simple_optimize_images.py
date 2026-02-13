#!/usr/bin/env python3
"""
Simple Image Optimization Script for Oncle G Website
This script will optimize the largest images to reduce file sizes for faster loading.
"""

import os
from PIL import Image
import sys

def optimize_image(input_path, output_path, max_width=None, max_height=None, quality=80):
    """
    Optimize a single image by resizing and compressing it
    """
    try:
        with Image.open(input_path) as img:
            # Convert RGBA to RGB if saving as JPEG
            if img.mode in ('RGBA', 'LA'):
                # Create a white background
                background = Image.new('RGB', img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            
            # Resize image if dimensions are specified
            if max_width or max_height:
                img.thumbnail((max_width or img.width, max_height or img.height), Image.Resampling.LANCZOS)
            
            # Determine output format
            ext = os.path.splitext(output_path)[1].lower()
            if ext in ['.jpg', '.jpeg']:
                img_format = 'JPEG'
            elif ext == '.png':
                img_format = 'PNG'
            elif ext == '.webp':
                img_format = 'WEBP'
            else:
                img_format = img.format  # Keep original format
            
            # Save optimized image
            save_kwargs = {}
            if img_format in ['JPEG', 'WEBP']:
                save_kwargs['quality'] = quality
                save_kwargs['optimize'] = True
            elif img_format == 'PNG':
                save_kwargs['optimize'] = True
            
            img.save(output_path, format=img_format, **save_kwargs)
            
            # Print size reduction info
            original_size = os.path.getsize(input_path)
            optimized_size = os.path.getsize(output_path)
            reduction = ((original_size - optimized_size) / original_size) * 100
            print(f"✓ Optimized: {os.path.basename(input_path)} -> {os.path.basename(output_path)}")
            print(f"  Size: {original_size:,} → {optimized_size:,} bytes ({reduction:.1f}% reduction)")
            
    except Exception as e:
        print(f"✗ Error optimizing {input_path}: {str(e)}")

def main():
    print("Oncle G Website - Image Optimization Script")
    print("="*50)
    
    # Create optimized directory
    os.makedirs("img/optimized", exist_ok=True)
    
    print("\nOptimizing the largest images for faster loading:\n")
    
    # 1. Optimize the massive team image (7.7MB)
    if os.path.exists("img/Gemini_Generated_Image_7hs2j47hs2j47hs2.png"):
        print("1. Optimizing team image (currently 7.7MB)...")
        optimize_image(
            input_path="img/Gemini_Generated_Image_7hs2j47hs2j47hs2.png",
            output_path="img/optimized/team_photo.webp",
            max_width=1200,
            max_height=800,
            quality=80
        )
    
    # 2. Optimize carousel images
    carousel_images = [
        "freepik__ultrarealistic-advertising-photography-captured-by__31972.webp",
        "freepik__ultrarealistic-advertising-photography-captured-by__31973.webp",
        "freepik__ultrarealistic-advertising-photography-captured-by__31974.webp"
    ]
    
    print("\n2. Optimizing carousel images...")
    for i, img_name in enumerate(carousel_images, 1):
        img_path = f"img/{img_name}"
        if os.path.exists(img_path):
            optimize_image(
                input_path=img_path,
                output_path=f"img/optimized/carousel_{i}.webp",
                max_width=1000,
                max_height=700,
                quality=80
            )
    
    # 3. Optimize popup image
    if os.path.exists("img/img-loader/Livreur.webp"):
        print("\n3. Optimizing popup image...")
        optimize_image(
            input_path="img/img-loader/Livreur.webp",
            output_path="img/optimized/livreur.webp",
            max_width=600,
            max_height=500,
            quality=80
        )
    
    # 4. Optimize background image
    bg_img_path = "img/section/PHOTO-2026-02-07-12-26-43 2.jpg"
    # Handle potential space in filename
    import glob
    bg_matches = glob.glob("img/section/PHOTO-2026-02-07-12-26-43*.jpg")
    if bg_matches:
        print("\n4. Optimizing background image...")
        optimize_image(
            input_path=bg_matches[0],
            output_path="img/optimized/background.webp",
            max_width=1200,
            max_height=800,
            quality=80
        )
    
    print("\n" + "="*50)
    print("Optimization complete!")
    print("\nTo use optimized images:")
    print("1. Update your HTML to reference the optimized images in img/optimized/")
    print("2. For the team image, replace '../img/Gemini_Generated_Image_7hs2j47hs2j47hs2.png' with 'img/optimized/team_photo.webp'")
    print("3. Test your website to ensure all images display correctly")
    
    print("\nFor the large GIFs (maps.gif and _scene__.gif), consider converting to video format:")
    print("- Install ffmpeg: brew install ffmpeg (Mac) or apt-get install ffmpeg (Linux)")
    print("- Convert GIFs to MP4: ffmpeg -i gif/maps.gif -movflags faststart -pix_fmt yuv420p videos/maps.mp4")

if __name__ == "__main__":
    # Check if PIL is available
    try:
        from PIL import Image
    except ImportError:
        print("Installing required library...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
        from PIL import Image
    
    main()