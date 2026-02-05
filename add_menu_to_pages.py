#!/usr/bin/env python3
"""
Script to add the navigation menu to all HTML pages in the carousel project
"""

import os
from pathlib import Path


def add_menu_to_html_file(file_path):
    """
    Adds the navigation menu to a single HTML file
    """
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Check if menu already exists in the file
    if '<div id="menuOverlay"' in content:
        print(f"Menu already exists in {file_path.name}, skipping...")
        return False
    
    # Define the menu HTML code to insert
    menu_code = '''    <!-- Slide-in Navigation Menu -->
    <div id="menuOverlay" class="fixed inset-0 z-[666] bg-black/90 menu-overlay menu-closed overflow-y-auto p-6 md:p-12 lg:p-24">
        <div class="flex flex-col min-h-full">
             <header class="mb-12 md:mb-20">
                <!-- <h2 class="text-4xl md:block hidden md:text-5xl lg:text-7xl font-bold tracking-tight text-white">Navigation</h2> -->
            </header>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 md:gap-x-16 gap-y-8 md:gap-y-12 flex-grow">

                <a href="./index.html" class="group border-b border-gray-800 pb-4 hover:border-primary transition text-white">
                    <div class="flex justify-between items-center">
                        <span class="text-sm uppercase tracking-widest text-gray-500">01</span>
                        <h3 class="text-xl md:text-2xl group-hover:text-primary">LE SOURIRE DE L'ONCLE</h3>
                    </div>
                </a>

                <a href="./pages/livraison-express.html" class="group border-b border-gray-800 pb-4 hover:border-primary transition text-white">
                    <div class="flex justify-between items-center">
                        <span class="text-sm uppercase tracking-widest text-gray-500">02</span>
                        <h3 class="text-xl md:text-2xl group-hover:text-primary">LIVRAISON EXPRESS</h3>
                    </div>
                </a>

                <a href="./pages/commandez-en-un-geste.html" class="group border-b border-gray-800 pb-4 hover:border-primary transition text-white">
                    <div class="flex justify-between items-center">
                        <span class="text-sm uppercase tracking-widest text-gray-500">03</span>
                        <h3 class="text-xl md:text-xl font-semibold group-hover:text-primary">COMMANDEZ EN UN GESTE</h3>
                    </div>
                </a>

                <a href="./pages/a-propos.html" class="group border-b border-gray-800 pb-4 hover:border-primary transition text-white">
                    <div class="flex justify-between items-center">
                        <span class="text-sm uppercase tracking-widest text-gray-500">04</span>
                        <h3 class="text-xl md:text-2xl group-hover:text-primary">À PROPOS</h3>
                    </div>
                </a>

                <a href="./pages/communaute.html" class="group border-b border-gray-800 pb-4 hover:border-primary transition text-white">
                    <div class="flex justify-between items-center">
                        <span class="text-sm uppercase tracking-widest text-gray-500">05</span>
                        <h3 class="text-xl md:text-2xl group-hover:text-primary">COMMUNAUTÉ</h3>
                    </div>
                </a>

                <a href="./pages/contacts.html" class="group border-b border-gray-800 pb-4 hover:border-primary transition text-white">
                    <div class="flex justify-between items-center">
                        <span class="text-sm uppercase tracking-widest text-gray-500">06</span>
                        <h3 class="text-xl md:text-2xl group-hover:text-primary">CONTACTS</h3>
                    </div>
                </a>
            </div>

            <!-- Close button -->
            <button id="closeMenuBtn" class="mt-5 w-[50px] h-[50px] bg-primary flex items-center justify-center text-white self-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 384 512" fill="currentColor">
                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                </svg>
            </button>
        </div>
    </div>'''

    # Find the closing body tag and insert menu before it
    if '</body>' in content:
        # Insert the menu code before the closing body tag
        new_content = content.replace('</body>', f'    {menu_code}\n</body>')
        
        # Write the updated content back to the file
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(new_content)
        
        print(f"Menu added to {file_path.name}")
        return True
    else:
        print(f"No closing body tag found in {file_path.name}, menu not added")
        return False


def main():
    """
    Main function to process all HTML files in the project
    """
    project_root = Path("/Users/omerlinks/Documents/carousel")
    html_files = list(project_root.rglob("*.html"))
    
    print(f"Found {len(html_files)} HTML files to process...")
    
    processed_count = 0
    for html_file in html_files:
        if add_menu_to_html_file(html_file):
            processed_count += 1
    
    print(f"\nCompleted! Menu added to {processed_count} HTML files.")


if __name__ == "__main__":
    main()