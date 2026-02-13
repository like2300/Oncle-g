#!/usr/bin/env python3
"""
Batch GIF Optimization Script for Oncle G Website
This script runs the GIF optimizer with default settings for automation.
"""

import os
import subprocess
import sys

def run_optimizer():
    """Run the optimizer with default settings"""
    print("Running GIF optimizer with default settings...")
    print("Quality: medium")
    print("Max colors: 128")
    print("Target FPS: Original")
    print("Method: Both basic and advanced optimization")
    print()
    
    # Prepare the command with piped input to provide default answers
    cmd = [
        sys.executable,  # Use the same Python interpreter
        'optimize_gifs_with_ffmpeg.py'
    ]
    
    # Provide input via stdin to automate the process
    input_data = "3\nmedium\n128\n\n"
    
    try:
        # Use Popen for more control with input
        import subprocess
        proc = subprocess.Popen(
            cmd,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            universal_newlines=True
        )
        
        stdout, stderr = proc.communicate(input=input_data)
        
        print("Optimizer output:")
        print(stdout)
        if stderr:
            print("Errors:")
            print(stderr)
            
        if proc.returncode == 0:
            print("\nGIF optimization completed successfully!")
        else:
            print("\nGIF optimization failed with return code: {}".format(proc.returncode))
            
    except Exception as e:
        print("Error running optimizer: {}".format(str(e)))

if __name__ == "__main__":
    run_optimizer()