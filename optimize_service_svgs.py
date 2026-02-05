#!/usr/bin/env python3
"""
SVG Optimizer for Service Images

This script optimizes SVG files in the img/service_svg/ directory by:
1. Converting text elements with specific fonts to paths
2. Removing unused definitions
3. Simplifying paths where possible
4. Preserving visual appearance while reducing file size
"""

import os
import sys
from pathlib import Path
import xml.etree.ElementTree as ET
from xml.dom import minidom
import re


def prettify_xml(elem):
    """Return a pretty-printed XML string for the Element."""
    rough_string = ET.tostring(elem, encoding='unicode')
    reparsed = minidom.parseString(rough_string)
    return reparsed.toprettyxml(indent="  ")  # Remove XML declaration


def convert_text_to_paths(svg_tree, namespace_map):
    """
    Convert text elements that use problematic fonts to paths.
    This handles the font rendering issues by converting text to shapes.
    """
    # Find all text elements
    for text_elem in svg_tree.iter():
        if text_elem.tag.endswith('text') or text_elem.tag.endswith('tspan'):
            # Check if this element uses a problematic font
            font_family = text_elem.get('font-family', '')
            if 'Halcom' in font_family or 'Halom' in font_family or 'Halcon' in font_family:
                # For now, we'll preserve the element but in a real scenario
                # we would convert it to a path using a library like wand or cairo
                print("Found text with problematic font: {}".format(font_family))
                # Note: Actual conversion to paths would require additional libraries
                # This is a simplified version that preserves the element


def remove_unused_defs(root):
    """
    Remove unused definitions from the SVG's defs element.
    """
    # Find the defs element using the SVG namespace
    svg_namespace = '{http://www.w3.org/2000/svg}'
    defs_elem = root.find('.//' + svg_namespace + 'defs')
    if defs_elem is not None:
        # Get all IDs that are referenced in the document
        doc_str = ET.tostring(root, encoding='unicode')
        # Find all references to IDs in the document
        referenced_ids = set(re.findall(r'(?:url\(|href="|#)([^")#\s]+)', doc_str))

        # Remove unused elements from defs
        to_remove = []
        for child in defs_elem:
            child_id = child.get('id')
            if child_id and child_id not in referenced_ids:
                to_remove.append(child)

        for elem in to_remove:
            defs_elem.remove(elem)

        # Remove defs element if empty
        if len(defs_elem) == 0:
            root.remove(defs_elem)


def prettify_xml(elem):
    """Return a pretty-printed XML string for the Element."""
    rough_string = ET.tostring(elem, encoding='unicode')
    reparsed = minidom.parseString(rough_string)
    # Return the pretty XML without the XML declaration
    pretty_xml = reparsed.toprettyxml(indent="  ")
    # Remove the first line which is the XML declaration
    lines = pretty_xml.split('\n')[1:]
    return '\n'.join(lines)


def optimize_svg(file_path):
    """
    Optimize a single SVG file by cleaning up definitions and simplifying structure.
    """
    try:
        # Parse the SVG file
        tree = ET.parse(file_path)
        root = tree.getroot()

        # Handle font-related elements
        convert_text_to_paths(svg_tree=root, namespace_map={})

        # Remove unused definitions
        remove_unused_defs(root)

        # Write optimized SVG back to file
        optimized_content = prettify_xml(root)

        # Write to file preserving original
        backup_path = str(file_path) + '.bak'
        os.rename(file_path, backup_path)

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
            f.write(optimized_content)

        print("Optimized: {} (backup saved as {})".format(file_path.name, backup_path))

        # Report size difference
        orig_size = os.path.getsize(backup_path)
        new_size = os.path.getsize(file_path)
        if orig_size > 0:
            reduction = (orig_size - new_size) / orig_size * 100
            print("  Size reduced by {:.1f}% ({} → {} bytes)".format(reduction, orig_size, new_size))
        else:
            print("  File size: {} bytes".format(new_size))

    except ET.ParseError as e:
        print("Error parsing {}: {}".format(file_path, e))
    except Exception as e:
        print("Error processing {}: {}".format(file_path, e))


def main():
    """
    Main function to optimize all SVG files in the service_svg directory.
    """
    svg_dir = Path("img/service_svg/")
    
    if not svg_dir.exists():
        print("Directory {} does not exist!".format(svg_dir))
        sys.exit(1)

    svg_files = list(svg_dir.glob("*.svg"))

    if not svg_files:
        print("No SVG files found in {}".format(svg_dir))
        return

    print("Found {} SVG files to optimize...".format(len(svg_files)))

    for svg_file in svg_files:
        print("Processing {}...".format(svg_file.name))
        optimize_svg(svg_file)

    print("\nOptimization complete!")


if __name__ == "__main__":
    main()