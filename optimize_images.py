#!/usr/bin/env python3
"""
Image Optimization Script for Oncle G Website
This script will optimize images to reduce file sizes for faster loading.
"""

import os
from PIL import Image
import pillow_avif  # For AVIF support
import sys

def optimize_image(input_path, output_path, max_width=None, max_height=None, quality=80, format_override=None):
    """
    Optimize a single image by resizing and compressing it
    
    Args:
        input_path: Path to the input image
        output_path: Path where the optimized image will be saved
        max_width: Maximum width for the image
        max_height: Maximum height for the image
        quality: JPEG/WEBP quality percentage (1-100)
        format_override: Force a specific output format ('JPEG', 'PNG', 'WEBP', 'AVIF')
    """
    try:
        with Image.open(input_path) as img:
            # Convert RGBA to RGB if saving as JPEG
            if img.mode in ('RGBA', 'LA') and (format_override == 'JPEG' or (not format_override and input_path.lower().endswith('.jpg') or input_path.lower().endswith('.jpeg'))):
                # Create a white background
                background = Image.new('RGB', img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            
            # Resize image if dimensions are specified
            if max_width or max_height:
                img.thumbnail((max_width or img.width, max_height or img.height), Image.Resampling.LANCZOS)
            
            # Determine output format
            if format_override:
                img_format = format_override
            else:
                ext = os.path.splitext(output_path)[1].lower()
                if ext == '.jpg' or ext == '.jpeg':
                    img_format = 'JPEG'
                elif ext == '.png':
                    img_format = 'PNG'
                elif ext == '.webp':
                    img_format = 'WEBP'
                elif ext == '.avif':
                    img_format = 'AVIF'
                else:
                    img_format = img.format
            
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
            print(f"Optimized: {input_path} -> {output_path}")
            print(f"  Original: {original_size:,} bytes, Optimized: {optimized_size:,} bytes ({reduction:.1f}% reduction)")
            
    except Exception as e:
        print(f"Error optimizing {input_path}: {str(e)}")

def optimize_team_image():
    """Optimize the large team image (7.7MB PNG)"""
    input_path = "img/Gemini_Generated_Image_7hs2j47hs2j47hs2.png"
    output_path = "img/optimized/team_photo_optimized.webp"
    
    # Create optimized directory if it doesn't exist
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Optimize the team image with high quality but reduced size
    optimize_image(
        input_path=input_path,
        output_path=output_path,
        max_width=1920,
        max_height=1080,
        quality=85,
        format_override='WEBP'
    )

def optimize_gifs_to_videos():
    """Convert large GIFs to video format for better compression"""
    print("Note: Converting GIFs to videos requires ffmpeg.")
    print("Install ffmpeg and run these commands manually:")
    print("ffmpeg -i gif/maps.gif -movflags faststart -pix_fmt yuv420p -vf 'scale=trunc(iw/2)*2:trunc(ih/2)*2' videos/maps_optimized.mp4")
    print("ffmpeg -i gif/_scene__202602011102.gif -movflags faststart -pix_fmt yuv420p -vf 'scale=trunc(iw/2)*2:trunc(ih/2)*2' videos/scene_optimized.mp4")
    print()

def optimize_carousel_images():
    """Optimize carousel images"""
    carousel_dir = "img/"
    output_dir = "img/optimized/"
    os.makedirs(output_dir, exist_ok=True)
    
    # Find carousel images
    carousel_images = [
        "freepik__ultrarealistic-advertising-photography-captured-by__31972.webp",
        "freepik__ultrarealistic-advertising-photography-captured-by__31973.webp", 
        "freepik__ultrarealistic-advertising-photography-captured-by__31974.webp"
    ]
    
    for img_name in carousel_images:
        input_path = os.path.join(carousel_dir, img_name)
        if os.path.exists(input_path):
            output_path = os.path.join(output_dir, f"carousel_{img_name}")
            optimize_image(
                input_path=input_path,
                output_path=output_path,
                max_width=1200,
                max_height=800,
                quality=80
            )

def optimize_service_images():
    """Optimize service SVG images (convert to WebP if too large)"""
    service_dir = "img/service_svg/"
    output_dir = "img/service_svg_optimized/"
    os.makedirs(output_dir, exist_ok=True)
    
    # Process large SVGs that are actually images saved as SVG
    import glob
    svg_files = glob.glob(os.path.join(service_dir, "*.svg"))
    
    for svg_path in svg_files:
        # Skip if it's a real SVG vector file (small size)
        if os.path.getsize(svg_path) < 100000:  # Less than 100KB, likely real SVG
            continue
            
        # Convert large "SVG" files to WebP
        base_name = os.path.splitext(os.path.basename(svg_path))[0]
        output_path = os.path.join(output_dir, f"{base_name}_optimized.webp")
        
        # Try to open as image (might be raster image saved as SVG)
        try:
            with Image.open(svg_path) as img:
                img.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
                img.save(output_path, format='WEBP', quality=80, optimize=True)
                print(f"Converted large SVG to WebP: {svg_path} -> {output_path}")
        except:
            print(f"Could not process as image: {svg_path}")

def optimize_popup_image():
    """Optimize the popup image"""
    input_path = "img/img-loader/Livreur.webp"
    output_path = "img/img-loader/Livreur_optimized.webp"
    
    optimize_image(
        input_path=input_path,
        output_path=output_path,
        max_width=800,
        max_height=600,
        quality=80
    )

def optimize_background_images():
    """Optimize background images"""
    input_path = "img/section/PHOTO-2026-02-07-12-26-43 2.jpg"
    output_path = "img/section/PHOTO-2026-02-07-12-26-43_optimized.webp"
    
    # Handle spaces in filename
    input_path_safe = input_path
    if " " in input_path:
        # Look for similar file
        import glob
        matches = glob.glob("img/section/PHOTO-2026-02-07-12-26-43*.jpg")
        if matches:
            input_path_safe = matches[0]
    
    if os.path.exists(input_path_safe):
        optimize_image(
            input_path=input_path_safe,
            output_path=output_path,
            max_width=1920,
            max_height=1080,
            quality=80
        )

def main():
    print("Starting image optimization for Oncle G website...")
    print("="*50)
    
    # Create backup directory
    os.makedirs("backup/", exist_ok=True)
    print("Created backup directory")
    
    # Optimize different categories of images
    print("\n1. Optimizing team image...")
    optimize_team_image()
    
    print("\n2. Optimizing carousel images...")
    optimize_carousel_images()
    
    print("\n3. Optimizing popup image...")
    optimize_popup_image()
    
    print("\n4. Optimizing background images...")
    optimize_background_images()
    
    print("\n5. Optimizing service images...")
    optimize_service_images()
    
    print("\n6. GIF to Video conversion note...")
    optimize_gifs_to_videos()
    
    print("\nOptimization complete!")
    print("\nNext steps:")
    print("- Update your HTML to reference the optimized images")
    print("- For GIFs, you'll need to manually convert them using ffmpeg")
    print("- Test the website to ensure all images display correctly")

if __name__ == "__main__":
    # Check if required libraries are available
    try:
        from PIL import Image
        import pillow_avif  # For AVIF support
    except ImportError:
        print("Required libraries not found. Installing...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow", "pillow-avif-plugin"])
        from PIL import Image
        import pillow_avif
    
    main()