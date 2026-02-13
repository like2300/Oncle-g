#!/usr/bin/env python3
"""
Script to replace original images with optimized versions in the Oncle G website
This script copies optimized images back to their original locations.
"""

import os
import shutil


def copy_optimized_images_back():
    """Copy optimized images back to their original locations"""
    optimized_dir = "/Users/omerlinks/Documents/carousel/img/optimized_images"
    img_dir = "/Users/omerlinks/Documents/carousel/img"
    
    # Walk through the optimized images directory
    for root, dirs, files in os.walk(optimized_dir):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png', '.tiff', '.bmp')):
                optimized_path = os.path.join(root, file)
                
                # Calculate the corresponding original path
                rel_path = os.path.relpath(root, optimized_dir)
                original_path = os.path.join(img_dir, rel_path, file)
                
                # Copy the optimized file back to the original location
                print("Replacing: {}".format(original_path))
                print("    With: {}".format(optimized_path))
                
                # Ensure the destination directory exists
                dest_dir = os.path.dirname(original_path)
                if not os.path.exists(dest_dir):
                    os.makedirs(dest_dir)
                
                # Copy the file
                shutil.copy2(optimized_path, original_path)
                print("    Copied successfully!")


def main():
    print("Replacing original images with optimized versions...")
    print("="*60)
    
    copy_optimized_images_back()
    
    print("\n" + "="*60)
    print("All images have been replaced with optimized versions!")
    print("Your website now uses the optimized images for faster loading.")


if __name__ == "__main__":
    main()