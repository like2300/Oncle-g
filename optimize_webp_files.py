#!/usr/bin/env python3
"""
WebP Optimization Script for Oncle G Website
This script optimizes existing WebP files to reduce their size for faster loading.
"""

import os
import subprocess
import sys


def optimize_webp_with_ffmpeg(input_path, output_path, quality=75):
    """
    Optimize a WebP file using FFmpeg
    
    Args:
        input_path: Path to the input WebP
        output_path: Path where the optimized WebP will be saved
        quality: Quality level (1-100, where 100 is highest quality)
    """
    try:
        # Check if ffmpeg is available
        proc = subprocess.Popen(['ffmpeg', '-version'], 
                               stdout=subprocess.PIPE, 
                               stderr=subprocess.PIPE)
        stdout, stderr = proc.communicate()
        if proc.returncode != 0:
            print("Error: ffmpeg is not available")
            return False

        # Build ffmpeg command to re-encode WebP with optimization
        cmd = [
            'ffmpeg',
            '-i', input_path,
            '-quality', str(quality),
            '-loop', '0',  # For animated WebPs
            '-compression_level', '6',  # Higher compression
            '-preset', 'default',  # Compression preset
            output_path,
            '-y'  # Overwrite output file if exists
        ]
        
        print("Optimizing WebP: {} -> {}".format(input_path, output_path))
        proc = subprocess.Popen(cmd,
                               stdout=subprocess.PIPE,
                               stderr=subprocess.PIPE,
                               universal_newlines=True)
        stdout, stderr = proc.communicate()
        
        if proc.returncode == 0:
            # Calculate size reduction
            original_size = os.path.getsize(input_path)
            optimized_size = os.path.getsize(output_path)
            reduction = ((original_size - optimized_size) / original_size) * 100

            print("SUCCESS: Optimized {} -> {}".format(os.path.basename(input_path), os.path.basename(output_path)))
            print("  Size: {:,} -> {:,} bytes ({:.1f}% reduction)".format(original_size, optimized_size, reduction))
            return True
        else:
            print("ERROR: Optimizing WebP {}: {}".format(input_path, stderr))
            return False

    except Exception as e:
        print("ERROR: Optimizing {}: {}".format(input_path, str(e)))
        return False


def find_webp_files(directory):
    """Find all WebP files in the specified directory"""
    webp_files = []
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith('.webp'):
                file_path = os.path.join(root, file)
                file_size = os.path.getsize(file_path)
                webp_files.append((file_path, file_size))
    
    return webp_files


def main():
    print("Oncle G Website - WebP Optimizer")
    print("="*60)
    
    service_svg_directory = "/Users/omerlinks/Documents/carousel/img/service_svg"
    
    # Find all WebP files
    webp_files = find_webp_files(service_svg_directory)
    
    if not webp_files:
        print("No WebP files found in the directory.")
        return
    
    print("\nFound {} WebP files:".format(len(webp_files)))
    for webp_path, size in webp_files:
        print("  - {} ({:,} bytes)".format(webp_path, size))
    
    print("\nOptimization settings:")
    print("1. Optimize WebP files for better compression")
    print("2. Use quality level 80 for good balance of size and quality")
    print("3. Save optimized files in place (backup original with .bak extension)")
    
    successful_count = 0
    total_size_reduction = 0
    
    for webp_path, original_size in webp_files:
        # Create backup of original
        backup_path = webp_path + ".bak"
        os.rename(webp_path, backup_path)
        
        success = optimize_webp_with_ffmpeg(
            backup_path,  # Use backup as input
            webp_path,    # Put optimized version back in original location
            quality=80
        )
        
        if success:
            optimized_size = os.path.getsize(webp_path)
            size_reduction = original_size - optimized_size
            total_size_reduction += size_reduction
            successful_count += 1
        else:
            # If optimization failed, restore the original
            os.rename(backup_path, webp_path)
            print("  Restored original file due to optimization failure")
    
    print("\n" + "="*60)
    print("Optimization complete!")
    print("Successfully optimized {} out of {} WebP files".format(successful_count, len(webp_files)))
    print("Total size reduction: {:,} bytes ({:.2f} MB)".format(total_size_reduction, total_size_reduction/1024/1024))
    print("Optimized WebP files saved in '{}' directory".format(service_svg_directory))
    
    print("\nNote: Backup copies of original files are saved with .bak extension.")
    print("You can remove them after verifying the optimized files work correctly.")


if __name__ == "__main__":
    main()