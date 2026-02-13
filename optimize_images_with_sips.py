#!/usr/bin/env python3
"""
Image Optimization Script using SIPS for Oncle G Website
This script will optimize heavy images using SIPS (Scriptable Image Processing System) on macOS.
"""

import os
import subprocess
import sys


def optimize_image_with_sips(input_path, output_path, quality='normal', max_dimension=None):
    """
    Optimize an image using SIPS (Scriptable Image Processing System) on macOS
    
    Args:
        input_path: Path to the input image
        output_path: Path where the optimized image will be saved
        quality: Quality level ('low', 'normal', 'high')
        max_dimension: Maximum dimension for resizing (optional)
    """
    try:
        # Check if sips is available
        proc = subprocess.Popen(['sips', '--version'], 
                              stdout=subprocess.PIPE, 
                              stderr=subprocess.PIPE)
        stdout, stderr = proc.communicate()
        if proc.returncode != 0:
            print("Error: sips is not available on this system")
            return False

        # Build sips command
        cmd = ['sips', '-s', 'formatOptions', 'high' if quality == 'high' else 'normal']
        
        # Add resize option if max_dimension is specified
        if max_dimension:
            cmd.extend(['--resampleHeightWidthMax', str(max_dimension)])
        
        cmd.extend([input_path, '--out', output_path])

        print("Optimizing: {} -> {}".format(input_path, output_path))
        # Use Popen for Python 2/3 compatibility
        proc = subprocess.Popen(cmd,
                               stdout=subprocess.PIPE,
                               stderr=subprocess.PIPE,
                               universal_newlines=True)
        stdout, stderr = proc.communicate()
        return_code = proc.returncode

        if return_code == 0:
            # Calculate size reduction
            original_size = os.path.getsize(input_path)
            optimized_size = os.path.getsize(output_path)
            reduction = ((original_size - optimized_size) / original_size) * 100

            print("SUCCESS: Optimized {} -> {}".format(os.path.basename(input_path), os.path.basename(output_path)))
            print("  Size: {:,} -> {:,} bytes ({:.1f}% reduction)".format(original_size, optimized_size, reduction))
            return True
        else:
            print("ERROR: Optimizing {}: {}".format(input_path, stderr))
            return False

    except OSError:  # Python 2 uses OSError instead of FileNotFoundError
        print("Error: sips command not found. This script is designed for macOS systems.")
        return False
    except Exception as e:
        print("ERROR: Optimizing {}: {}".format(input_path, str(e)))
        return False


def find_heavy_images(directory, size_threshold_mb=1):
    """Find images larger than the specified threshold in MB"""
    heavy_images = []
    size_threshold_bytes = size_threshold_mb * 1024 * 1024
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png', '.tiff', '.bmp')):
                file_path = os.path.join(root, file)
                file_size = os.path.getsize(file_path)
                if file_size > size_threshold_bytes:
                    heavy_images.append((file_path, file_size))
    
    return heavy_images


def main():
    print("Oncle G Website - Image Optimizer using SIPS")
    print("="*60)
    
    img_directory = "/Users/omerlinks/Documents/carousel/img"
    
    # Find heavy images (> 500KB)
    heavy_images = find_heavy_images(img_directory, 0.5)  # 500KB threshold
    
    if not heavy_images:
        print("No heavy images found in the directory.")
        return
    
    print("\nFound {} heavy images:".format(len(heavy_images)))
    for img_path, size in heavy_images:
        print("  - {} ({:,} bytes)".format(img_path, size))
    
    print("\nOptimization settings:")
    print("1. Resize large images to max 1920x1080 (for web display)")
    print("2. Use normal quality for balance between size and quality")
    print("3. Save optimized images in 'optimized_images' subdirectory")
    
    # Create optimized directory
    optimized_dir = os.path.join(img_directory, "optimized_images")
    if not os.path.exists(optimized_dir):
        os.makedirs(optimized_dir)
    
    successful_count = 0
    total_size_reduction = 0
    
    for img_path, original_size in heavy_images:
        # Create output path in optimized_images subdirectory
        rel_path = os.path.relpath(img_path, img_directory)
        output_subdir = os.path.join(optimized_dir, os.path.dirname(rel_path))
        
        # Create subdirectory if it doesn't exist
        if not os.path.exists(output_subdir):
            os.makedirs(output_subdir)
        
        output_path = os.path.join(output_subdir, os.path.basename(img_path))
        
        # Determine max dimension based on image type
        max_dim = 1920  # Standard for most web images
        if 'icon' in img_path.lower() or 'favicon' in img_path.lower():
            max_dim = 512  # Smaller for icons
        
        success = optimize_image_with_sips(
            img_path, 
            output_path, 
            quality='normal', 
            max_dimension=max_dim
        )
        
        if success:
            optimized_size = os.path.getsize(output_path)
            size_reduction = original_size - optimized_size
            total_size_reduction += size_reduction
            successful_count += 1
    
    print("\n" + "="*60)
    print("Optimization complete!")
    print("Successfully optimized {} out of {} images".format(successful_count, len(heavy_images)))
    print("Total size reduction: {:,} bytes ({:.2f} MB)".format(total_size_reduction, total_size_reduction/1024/1024))
    print("Optimized images saved in '{}' directory".format(optimized_dir))
    
    print("\nNote: You will need to update your HTML files to reference the optimized images")
    print("or copy them back to their original locations if preferred.")


if __name__ == "__main__":
    main()