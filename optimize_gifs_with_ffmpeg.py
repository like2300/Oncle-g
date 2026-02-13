#!/usr/bin/env python3
"""
GIF Optimization Script using FFmpeg for Oncle G Website
This script will optimize GIFs using FFmpeg to reduce file size while maintaining quality.
"""

import os
import subprocess
import sys


def optimize_gif_with_ffmpeg(input_gif, output_gif, quality='medium'):
    """
    Optimize a GIF using FFmpeg with various compression techniques
    
    Args:
        input_gif: Path to the input GIF
        output_gif: Path where the optimized GIF will be saved
        quality: Quality level ('low', 'medium', 'high', 'lossless')
    """
    try:
        # Check if ffmpeg is available
        proc = subprocess.Popen(['ffmpeg', '-version'],
                              stdout=subprocess.PIPE,
                              stderr=subprocess.PIPE)
        stdout, stderr = proc.communicate()
        if proc.returncode != 0:
            print("Error: ffmpeg is not installed or not in PATH")
            print("Please install ffmpeg using one of these methods:")
            print("  Mac: brew install ffmpeg")
            print("  Ubuntu/Debian: sudo apt-get install ffmpeg")
            print("  CentOS/RHEL: sudo yum install ffmpeg")
            return False

        # Define quality parameters
        quality_params = {
            'low': ['-vf', 'scale=iw/2:ih/2,fps=15', '-gifflags', '+transdiff'],
            'medium': ['-vf', 'scale=trunc(iw/1.5):trunc(ih/1.5),fps=20', '-gifflags', '+transdiff'],
            'high': ['-vf', 'fps=24', '-gifflags', '+transdiff'],
            'lossless': ['-gifflags', '+transdiff']  # Just optimize without quality loss
        }

        # Build ffmpeg command
        cmd = [
            'ffmpeg',
            '-i', input_gif,  # Input file
            '-y'  # Overwrite output file if exists
        ]
        
        # Add quality-specific parameters
        cmd.extend(quality_params.get(quality, quality_params['medium']))
        
        # Add output specification
        cmd.append(output_gif)

        print("Optimizing: {} -> {} (Quality: {})".format(input_gif, output_gif, quality))
        # Use Popen for Python 2/3 compatibility
        proc = subprocess.Popen(cmd,
                               stdout=subprocess.PIPE,
                               stderr=subprocess.PIPE,
                               universal_newlines=True)
        stdout, stderr = proc.communicate()
        return_code = proc.returncode

        if return_code == 0:
            # Calculate size reduction
            original_size = os.path.getsize(input_gif)
            optimized_size = os.path.getsize(output_gif)
            reduction = ((original_size - optimized_size) / original_size) * 100

            print("SUCCESS: Optimized {} -> {}".format(os.path.basename(input_gif), os.path.basename(output_gif)))
            print("  Size: {:,} -> {:,} bytes ({:.1f}% reduction)".format(original_size, optimized_size, reduction))
            return True
        else:
            print("ERROR: Optimizing {}: {}".format(input_gif, stderr))
            return False

    except OSError:  # Python 2 uses OSError instead of FileNotFoundError
        print("Error: ffmpeg command not found. Please install ffmpeg.")
        return False
    except Exception as e:
        print("ERROR: Optimizing {}: {}".format(input_gif, str(e)))
        return False


def optimize_gif_advanced(input_gif, output_gif, max_colors=256, fps=None):
    """
    Advanced GIF optimization using palette-based approach
    
    Args:
        input_gif: Path to the input GIF
        output_gif: Path where the optimized GIF will be saved
        max_colors: Maximum number of colors in the palette (2-256)
        fps: Target frames per second (None to keep original)
    """
    try:
        # Create a temporary palette
        palette_path = output_gif.replace('.gif', '_palette.png')
        
        # Generate palette
        palette_cmd = [
            'ffmpeg',
            '-i', input_gif,
            '-vf', 'palettegen=max_colors={}'.format(max_colors),
            '-y',
            palette_path
        ]
        
        proc = subprocess.Popen(palette_cmd,
                               stdout=subprocess.PIPE,
                               stderr=subprocess.PIPE,
                               universal_newlines=True)
        stdout, stderr = proc.communicate()

        if proc.returncode != 0:
            print("ERROR: Error generating palette for {}: {}".format(input_gif, stderr))
            return False

        # Apply palette to create optimized GIF
        filter_complex_parts = ['paletteuse=dither=bayer:bayer_scale=3']
        if fps:
            filter_complex_parts.insert(0, 'fps={}'.format(fps))

        filter_complex = ','.join(filter_complex_parts)

        cmd = [
            'ffmpeg',
            '-i', input_gif,
            '-i', palette_path,
            '-lavfi', '[{}]split[a][b];[a]{}[c];[b][c]overlay=format=rgb'.format(0, filter_complex),
            '-y',
            output_gif
        ]

        print("Advanced optimizing: {} -> {}".format(input_gif, output_gif))
        proc = subprocess.Popen(cmd,
                               stdout=subprocess.PIPE,
                               stderr=subprocess.PIPE,
                               universal_newlines=True)
        stdout, stderr = proc.communicate()

        # Clean up temporary palette file
        if os.path.exists(palette_path):
            os.remove(palette_path)

        if proc.returncode == 0:
            # Calculate size reduction
            original_size = os.path.getsize(input_gif)
            optimized_size = os.path.getsize(output_gif)
            reduction = ((original_size - optimized_size) / original_size) * 100

            print("SUCCESS: Successfully advanced optimized: {} -> {}".format(os.path.basename(input_gif), os.path.basename(output_gif)))
            print("  Size: {:,} -> {:,} bytes ({:.1f}% reduction)".format(original_size, optimized_size, reduction))
            return True
        else:
            print("ERROR: Error advanced optimizing {}: {}".format(input_gif, stderr))
            return False

    except Exception as e:
        print("ERROR: Error advanced optimizing {}: {}".format(input_gif, str(e)))
        return False


def find_gif_files(directory='.'):
    """Find all GIF files in the specified directory and subdirectories"""
    gif_paths = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith('.gif'):
                gif_paths.append(os.path.join(root, file))
    return gif_paths


def main():
    print("Oncle G Website - GIF Optimizer using FFmpeg")
    print("="*60)
    
    # Find all GIF files in the project
    gif_files = find_gif_files('.')
    
    if not gif_files:
        print("No GIF files found in the current directory and subdirectories.")
        print("Please make sure you're running this script from the correct directory.")
        return
    
    print("\nFound {} GIF files:".format(len(gif_files)))
    for gif in gif_files:
        size = os.path.getsize(gif)
        print("  - {} ({:,} bytes)".format(gif, size))
    
    print("\nSelect optimization method:")
    print("1. Basic optimization (faster)")
    print("2. Advanced optimization (better compression)")
    print("3. Both methods (recommended)")
    
    try:
        # For Python 2/3 compatibility and piped input
        import sys
        if sys.version_info[0] >= 3:
            # Python 3
            user_input = input
        else:
            # Python 2
            user_input = raw_input

        choice = user_input("\nEnter your choice (1-3, default 3): ")
        if hasattr(choice, 'strip'):  # Check if it's a string
            choice = choice.strip() or "3"
        else:
            choice = "3"  # Default if somehow not a string

        if choice not in ['1', '2', '3']:
            print("Invalid choice. Using option 3 (both methods).")
            choice = "3"
            
        quality_choice = user_input("Enter quality level (low/medium/high/lossless, default medium): ")
        if hasattr(quality_choice, 'strip'):  # Check if it's a string
            quality_choice = quality_choice.strip() or "medium"
        else:
            quality_choice = "medium"  # Default if not a string
            
        max_colors_input = user_input("Max colors for advanced optimization (2-256, default 128): ")
        if hasattr(max_colors_input, 'strip'):  # Check if it's a string
            max_colors_input = max_colors_input.strip() or "128"
        else:
            max_colors_input = "128"  # Default if not a string
            
        try:
            max_colors = int(max_colors_input)
            max_colors = max(2, min(256, max_colors))  # Clamp between 2 and 256
        except ValueError:
            max_colors = 128
            
        fps_input = user_input("Target FPS (positive integer, or press Enter to keep original): ")
        if hasattr(fps_input, 'strip'):  # Check if it's a string
            fps_input = fps_input.strip()
        else:
            fps_input = ""  # Default if not a string
        target_fps = None
        if fps_input:
            try:
                target_fps = int(fps_input)
                if target_fps <= 0:
                    target_fps = None
            except ValueError:
                target_fps = None
                
    except KeyboardInterrupt:
        print("\nOperation cancelled by user.")
        return
    
    print("\nStarting optimization with settings:")
    print("  Quality: {}".format(quality_choice))
    print("  Max colors: {}".format(max_colors))
    print("  Target FPS: {}".format(target_fps if target_fps else 'Original'))
    print()

    # Create optimized directory (Python 2/3 compatible)
    optimized_dir = "optimized_gifs"
    if not os.path.exists(optimized_dir):
        os.makedirs(optimized_dir)

    successful_count = 0
    total_size_reduction = 0

    for gif_path in gif_files:
        original_size = os.path.getsize(gif_path)

        # Define output path
        rel_path = os.path.relpath(gif_path)
        output_filename = "optimized_{}".format(rel_path.replace('/', '_').replace('\\', '_'))
        output_path = os.path.join(optimized_dir, output_filename)
        
        success = False
        
        if choice in ['1', '3']:
            # Try basic optimization
            success = optimize_gif_with_ffmpeg(gif_path, output_path, quality=quality_choice)
        
        if choice == '2' or (choice == '3' and not success):
            # Try advanced optimization
            success = optimize_gif_advanced(gif_path, output_path, max_colors=max_colors, fps=target_fps)
        elif choice == '3' and success:
            # If basic succeeded and we're doing both, try advanced on the basic result
            # Actually, let's compare both results and keep the smaller one
            basic_output = output_path
            advanced_output = output_path.replace('.gif', '_advanced.gif')
            
            if optimize_gif_advanced(gif_path, advanced_output, max_colors=max_colors, fps=target_fps):
                basic_size = os.path.getsize(basic_output)
                advanced_size = os.path.getsize(advanced_output)
                
                if advanced_size < basic_size:
                    # Keep the advanced version, remove the basic one
                    os.rename(advanced_output, basic_output)
                    print("  Kept advanced version ({:,} bytes) over basic ({:,} bytes)".format(advanced_size, basic_size))
                else:
                    # Keep the basic version, remove the advanced one
                    os.remove(advanced_output)
                    print("  Kept basic version ({:,} bytes) over advanced ({:,} bytes)".format(basic_size, advanced_size))
        
        if success:
            optimized_size = os.path.getsize(output_path)
            size_reduction = original_size - optimized_size
            total_size_reduction += size_reduction
            successful_count += 1
    
    print("\n" + "="*60)
    print("Optimization complete!")
    print("Successfully optimized {} out of {} GIFs".format(successful_count, len(gif_files)))
    print("Total size reduction: {:,} bytes ({:.2f} MB)".format(total_size_reduction, total_size_reduction/1024/1024))
    print("Optimized GIFs saved in '{}' directory".format(optimized_dir))
    
    print("\nFor web use, consider:")
    print("1. Converting remaining large GIFs to video format (MP4/WebM) for better compression")
    print("2. Using the convert_gifs_to_videos.py script for animations over 1MB")
    print("3. Implementing lazy loading for GIFs that are below the fold")


if __name__ == "__main__":
    main()