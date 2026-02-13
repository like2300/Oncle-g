#!/usr/bin/env python3
"""
GIF to Video Conversion Script for Oncle G Website
This script will convert large GIFs to video format for better compression.
"""

import os
import subprocess
import sys

def convert_gif_to_video(gif_path, output_path, video_format='mp4'):
    """
    Convert a GIF to video format using ffmpeg
    
    Args:
        gif_path: Path to the input GIF
        output_path: Path where the video will be saved
        video_format: Video format to use ('mp4', 'webm')
    """
    try:
        # Check if ffmpeg is available
        result = subprocess.run(['ffmpeg', '-version'], 
                              stdout=subprocess.PIPE, 
                              stderr=subprocess.PIPE)
        if result.returncode != 0:
            print("Error: ffmpeg is not installed or not in PATH")
            print("Please install ffmpeg using one of these methods:")
            print("  Mac: brew install ffmpeg")
            print("  Ubuntu/Debian: sudo apt-get install ffmpeg")
            print("  CentOS/RHEL: sudo yum install ffmpeg")
            return False
        
        # Build ffmpeg command
        cmd = [
            'ffmpeg',
            '-i', gif_path,  # Input file
            '-movflags', 'faststart',  # Optimize for web streaming
            '-pix_fmt', 'yuv420p',  # Compatibility
            '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',  # Scale to even dimensions
            '-y',  # Overwrite output file if exists
            output_path
        ]
        
        print(f"Converting: {gif_path} -> {output_path}")
        result = subprocess.run(cmd, 
                               stdout=subprocess.PIPE, 
                               stderr=subprocess.PIPE, 
                               text=True)
        
        if result.returncode == 0:
            # Calculate size reduction
            original_size = os.path.getsize(gif_path)
            converted_size = os.path.getsize(output_path)
            reduction = ((original_size - converted_size) / original_size) * 100
            
            print(f"✓ Successfully converted: {os.path.basename(gif_path)} -> {os.path.basename(output_path)}")
            print(f"  Size: {original_size:,} → {converted_size:,} bytes ({reduction:.1f}% reduction)")
            return True
        else:
            print(f"✗ Error converting {gif_path}: {result.stderr}")
            return False
            
    except FileNotFoundError:
        print("Error: ffmpeg command not found. Please install ffmpeg.")
        return False
    except Exception as e:
        print(f"✗ Error converting {gif_path}: {str(e)}")
        return False

def update_html_for_video(html_path, old_gif_path, new_video_path, video_tag_attrs=''):
    """
    Update HTML to replace GIF with video tag
    """
    try:
        with open(html_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace GIF references with video tags
        # For the maps.gif
        if 'maps.gif' in old_gif_path:
            content = content.replace(
                '<img src="./gif/maps.gif"',
                f'<video {video_tag_attrs} muted autoplay loop playsinline><source src="{new_video_path}" type="video/mp4">Your browser does not support the video tag.</video>'
            )
        
        # For the scene GIF
        elif '_scene__202602011102.gif' in old_gif_path:
            content = content.replace(
                'src="./gif/_scene__202602011102.gif"',
                f'src="{new_video_path}" type="video/mp4"'
            )
            # Also update the object tag if needed
            content = content.replace(
                '<img src="./gif/_scene__202602011102.gif"',
                f'<video {video_tag_attrs} muted autoplay loop playsinline><source src="{new_video_path}" type="video/mp4">Your browser does not support the video tag.</video>'
            )
        
        # Write updated content back to file
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✓ Updated HTML to use video instead of {os.path.basename(old_gif_path)}")
        
    except Exception as e:
        print(f"✗ Error updating HTML: {str(e)}")

def main():
    print("Oncle G Website - GIF to Video Converter")
    print("="*50)
    
    # Create videos directory
    os.makedirs("videos", exist_ok=True)
    
    # Define GIF files to convert
    gifs_to_convert = [
        {
            'input': 'gif/maps.gif',
            'output': 'videos/maps.mp4',
            'description': 'Maps animation (was 18.9MB)'
        },
        {
            'input': 'gif/_scene__202602011102.gif',
            'output': 'videos/scene.mp4',
            'description': 'Scene animation (was 8.2MB)'
        }
    ]
    
    print("\nConverting large GIFs to MP4 videos...\n")
    
    for gif_info in gifs_to_convert:
        input_path = gif_info['input']
        output_path = gif_info['output']
        description = gif_info['description']
        
        if os.path.exists(input_path):
            print(f"Processing: {description}")
            success = convert_gif_to_video(input_path, output_path, 'mp4')
            if success:
                print(f"  Saved as: {output_path}\n")
            else:
                print(f"  Failed to convert: {input_path}\n")
        else:
            print(f"File not found: {input_path}")
    
    print("\n" + "="*50)
    print("Conversion complete!")
    print("\nTo use the videos in your HTML:")
    print("1. Replace <img> tags referencing the GIFs with <video> tags")
    print("2. Example for maps.gif:")
    print('   <video width="800" height="600" muted autoplay loop playsinline>')
    print('     <source src="videos/maps.mp4" type="video/mp4">')
    print('     Your browser does not support the video tag.')
    print('   </video>')
    print("\n3. For fallback, you can keep the GIF as a poster image:")
    print('   <video poster="gif/maps.gif" muted autoplay loop playsinline>')
    print('     <source src="videos/maps.mp4" type="video/mp4">')
    print('     <img src="gif/maps.gif" alt="Maps animation">')
    print('   </video>')
    
    print("\nExpected size reductions:")
    print("- maps.gif (18.9MB) → videos/maps.mp4 (~1-3MB)")
    print("- _scene__.gif (8.2MB) → videos/scene.mp4 (~0.5-2MB)")

if __name__ == "__main__":
    main()