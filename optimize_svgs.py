#!/usr/bin/env python3
"""
SVG Optimizer Script

This script reduces the file size of SVG files in the img/service_svg directory,
excluding the PROPOS.svg file. It performs various optimizations like removing
unnecessary whitespace, comments, metadata, and redundant attributes.
"""

import os
import re
import sys


def remove_comments(svg_content):
    """Remove XML comments from SVG content."""
    return re.sub(r'<!--.*?-->', '', svg_content, flags=re.DOTALL)


def remove_metadata(svg_content):
    """Remove metadata elements from SVG content."""
    # Remove metadata, title, desc, etc.
    svg_content = re.sub(r'<metadata[^>]*>.*?</metadata>', '', svg_content, flags=re.DOTALL | re.IGNORECASE)
    svg_content = re.sub(r'<title[^>]*>.*?</title>', '', svg_content, flags=re.DOTALL | re.IGNORECASE)
    svg_content = re.sub(r'<desc[^>]*>.*?</desc>', '', svg_content, flags=re.DOTALL | re.IGNORECASE)
    return svg_content


def minimize_whitespace(svg_content):
    """Minimize whitespace in SVG content."""
    # Remove leading/trailing whitespace
    svg_content = re.sub(r'^\s+', '', svg_content)
    svg_content = re.sub(r'\s+$', '', svg_content)
    
    # Reduce multiple spaces to single space
    svg_content = re.sub(r'[ \t]+', ' ', svg_content)
    
    # Remove spaces around certain characters
    svg_content = re.sub(r'([{}:,])\s+', r'\1', svg_content)
    svg_content = re.sub(r'\s+([{}:,])', r'\1', svg_content)
    
    # Remove newline characters
    svg_content = re.sub(r'\n\s*', '', svg_content)
    
    return svg_content


def remove_unused_defs(svg_content):
    """Remove unused definitions from SVG content."""
    # Find all IDs that are referenced
    references = set()
    for match in re.finditer(r'(?:href|use|clip-path|mask|fill|stroke)=["\']?#([^"\'\s>]+)', svg_content):
        references.add(match.group(1))
    
    # Remove unused definitions
    def remove_unused(match):
        attrs = match.group(0)
        # Extract ID attribute
        id_match = re.search(r'id=["\']([^"\']+)["\']', attrs)
        if id_match and id_match.group(1) not in references:
            return ''
        return match.group(0)
    
    # Remove unused symbols, gradients, patterns, etc.
    svg_content = re.sub(r'<(?:defs|g|symbol|linearGradient|radialGradient|pattern|clipPath|mask)[^>]*id=["\'][^"\']*["\'][^>]*/?>.*?</(?:defs|g|symbol|linearGradient|radialGradient|pattern|clipPath|mask)>', remove_unused, svg_content, flags=re.DOTALL | re.IGNORECASE)
    
    return svg_content


def optimize_paths(svg_content):
    """Optimize path data in SVG content."""
    # Remove extra spaces in path data
    def optimize_path(match):
        path_data = match.group(2)
        # Normalize path data by removing extra spaces
        path_data = re.sub(r'\s+', ' ', path_data).strip()
        # Remove spaces around commas and operators
        path_data = re.sub(r'\s*([,])\s*', r'\1', path_data)
        path_data = re.sub(r'\s*([MLHVCSQTAZmlhvcsqtaz])\s*', r'\1', path_data)
        return '{}="{}"'.format(match.group(1), path_data)
    
    svg_content = re.sub(r'(d|path)\s*=\s*["\']([^"\']*)["\']', optimize_path, svg_content, flags=re.IGNORECASE)
    return svg_content


def reduce_precision(svg_content):
    """Reduce precision of floating point numbers in SVG content."""
    def reduce_number(match):
        num = float(match.group(0))
        # Round to 3 decimal places
        rounded = round(num, 3)
        # Convert back to string, removing unnecessary trailing zeros
        str_num = "{:.3f}".format(rounded).rstrip('0').rstrip('.')
        return str_num

    # Match numbers in SVG attributes
    svg_content = re.sub(r'\d+\.\d+', reduce_number, svg_content)
    return svg_content


def optimize_svg(svg_content):
    """Apply all optimization techniques to SVG content."""
    svg_content = remove_comments(svg_content)
    svg_content = remove_metadata(svg_content)
    svg_content = remove_unused_defs(svg_content)
    svg_content = optimize_paths(svg_content)
    svg_content = reduce_precision(svg_content)
    svg_content = minimize_whitespace(svg_content)
    return svg_content


def main():
    """Main function to process SVG files in the service_svg directory."""
    svg_dir = "img/service_svg"

    if not os.path.exists(svg_dir):
        print("Directory {} does not exist!".format(svg_dir))
        sys.exit(1)

    # Get all SVG files in the directory
    all_files = os.listdir(svg_dir)
    svg_files = []
    for f in all_files:
        if f.lower().endswith('.svg') and f.lower() != "propos.svg":
            svg_files.append(os.path.join(svg_dir, f))

    if not svg_files:
        print("No SVG files found in {} (excluding PROPOS.svg)".format(svg_dir))
        return

    print("Found {} SVG files to optimize...".format(len(svg_files)))

    for svg_file_path in svg_files:
        file_name = os.path.basename(svg_file_path)
        print("Optimizing {}...".format(file_name))

        # Read original file
        with open(svg_file_path, 'r', encoding='utf-8') as f:
            original_content = f.read()

        original_size = len(original_content.encode('utf-8'))

        # Optimize the SVG
        optimized_content = optimize_svg(original_content)

        # Write optimized file
        with open(svg_file_path, 'w', encoding='utf-8') as f:
            f.write(optimized_content)

        new_size = len(optimized_content.encode('utf-8'))
        reduction = original_size - new_size
        reduction_percent = (reduction / original_size) * 100 if original_size > 0 else 0

        print("  Original: {} bytes, Optimized: {} bytes, Saved: {} bytes ({:.2f}%)".format(
            original_size, new_size, reduction, reduction_percent))

if __name__ == "__main__":
    main()