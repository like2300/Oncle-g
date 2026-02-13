#!/usr/bin/env python3
"""
SVG to WebP Conversion Script for Oncle G Website
This script converts large SVG files to optimized WebP format using FFmpeg.
"""

import os
import subprocess
import sys


def convert_svg_to_webp(input_path, output_path, quality=75, size_limit=1920):
    """
    Convert an SVG to WebP using FFmpeg
    
    Args:
        input_path: Path to the input SVG
        output_path: Path where the WebP will be saved
        quality: Quality level (1-100, where 100 is highest quality)
        size_limit: Maximum dimension for resizing (preserving aspect ratio)
    """
    try:
        # Check if ffmpeg is available
        result = subprocess.Popen(['ffmpeg', '-version'], 
                                 stdout=subprocess.PIPE, 
                                 stderr=subprocess.PIPE)
        stdout, stderr = result.communicate()
        if result.returncode != 0:
            print("Error: ffmpeg is not available")
            return False

        # Build ffmpeg command to convert SVG to WebP
        # First, we'll convert SVG to PNG intermediate, then to WebP
        png_intermediate = output_path.replace('.webp', '_temp.png')
        
        # Convert SVG to PNG first (higher resolution for quality)
        cmd_svg_to_png = [
            'ffmpeg',
            '-i', input_path,
            '-background', 'white',  # Handle transparency
            '-alpha_remove',  # Remove alpha channel and replace with white background
            '-resize', '{}x{}'.format(size_limit, size_limit),  # Limit maximum size
            '-density', '300',  # High density for quality
            png_intermediate,
            '-y'  # Overwrite output file if exists
        ]
        
        print("Converting SVG to intermediate PNG: {} -> {}".format(input_path, png_intermediate))
        proc = subprocess.Popen(cmd_svg_to_png,
                               stdout=subprocess.PIPE,
                               stderr=subprocess.PIPE,
                               universal_newlines=True)
        stdout, stderr = proc.communicate()
        
        if proc.returncode != 0:
            print("ERROR: Converting SVG to PNG {}: {}".format(input_path, stderr))
            return False
        
        # Now convert PNG to WebP
        cmd_png_to_webp = [
            'ffmpeg',
            '-i', png_intermediate,
            '-quality', str(quality),
            '-compression_level', '6',  # Use compression_level instead of define
            output_path,
            '-y'  # Overwrite output file if exists
        ]
        
        print("Converting PNG to WebP: {} -> {}".format(png_intermediate, output_path))
        proc = subprocess.Popen(cmd_png_to_webp,
                               stdout=subprocess.PIPE,
                               stderr=subprocess.PIPE,
                               universal_newlines=True)
        stdout, stderr = proc.communicate()
        
        if proc.returncode == 0:
            # Calculate size reduction
            original_size = os.path.getsize(input_path)
            converted_size = os.path.getsize(output_path)
            reduction = ((original_size - converted_size) / original_size) * 100

            print("SUCCESS: Converted {} -> {}".format(os.path.basename(input_path), os.path.basename(output_path)))
            print("  Size: {:,} -> {:,} bytes ({:.1f}% reduction)".format(original_size, converted_size, reduction))
            
            # Clean up intermediate PNG file
            if os.path.exists(png_intermediate):
                os.remove(png_intermediate)
                
            return True
        else:
            print("ERROR: Converting PNG to WebP {}: {}".format(png_intermediate, stderr))
            # Clean up intermediate PNG file even if conversion failed
            if os.path.exists(png_intermediate):
                os.remove(png_intermediate)
            return False

    except Exception as e:
        print("ERROR: Converting {}: {}".format(input_path, str(e)))
        return False


def find_large_svg_files(directory, size_threshold_mb=1):
    """Find SVG files larger than the specified threshold in MB"""
    large_svgs = []
    size_threshold_bytes = size_threshold_mb * 1024 * 1024
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith('.svg'):
                file_path = os.path.join(root, file)
                file_size = os.path.getsize(file_path)
                if file_size > size_threshold_bytes:
                    large_svgs.append((file_path, file_size))
    
    return large_svgs


def main():
    print("Oncle G Website - SVG to WebP Converter")
    print("="*60)
    
    service_svg_directory = "/Users/omerlinks/Documents/carousel/img/service_svg"
    
    # Find large SVG files (> 500KB)
    large_svgs = find_large_svg_files(service_svg_directory, 0.5)  # 500KB threshold
    
    if not large_svgs:
        print("No large SVG files found in the directory.")
        return
    
    print("\nFound {} large SVG files:".format(len(large_svgs)))
    for svg_path, size in large_svgs:
        print("  - {} ({:,} bytes)".format(svg_path, size))
    
    print("\nConverting settings:")
    print("1. Convert SVG to WebP format for better compression")
    print("2. Use quality level 80 for good balance of size and quality")
    print("3. Limit maximum dimension to 1920px")
    print("4. Save WebP files in the same directory")
    
    successful_count = 0
    total_size_reduction = 0
    
    for svg_path, original_size in large_svgs:
        # Create output path with .webp extension
        output_path = svg_path.rsplit('.', 1)[0] + '.webp'
        
        success = convert_svg_to_webp(
            svg_path, 
            output_path, 
            quality=80, 
            size_limit=1920
        )
        
        if success:
            converted_size = os.path.getsize(output_path)
            size_reduction = original_size - converted_size
            total_size_reduction += size_reduction
            successful_count += 1
    
    print("\n" + "="*60)
    print("Conversion complete!")
    print("Successfully converted {} out of {} SVG files".format(successful_count, len(large_svgs)))
    print("Total size reduction: {:,} bytes ({:.2f} MB)".format(total_size_reduction, total_size_reduction/1024/1024))
    print("WebP files saved in '{}' directory".format(service_svg_directory))
    
    print("\nNote: You will need to update your HTML files to reference the WebP images")
    print("or implement fallbacks for browsers that don't support WebP.")


if __name__ == "__main__":
    main()