#!/bin/bash

# Fix CSS preload syntax in HTML files
# Corrects the syntax for async CSS loading

echo "Fixing CSS preload syntax in HTML files..."

# Define the files to update
PAGES=(
    "./index.html"
    "./pages/oncle-g/pro-g.html"
    "./pages/oncle-g/G-PROMarketing.html"
    "./pages/oncle-g/ConciergerieExpress.html"
    "./pages/oncle-g/Allô'Gaz.html"
    "./pages/oncle-g/Allô’Gaz.html"
)

# Loop through each file and fix the syntax
for file in "${PAGES[@]}"; do
    if [[ -f "$file" ]]; then
        echo "Fixing $file..."
        
        # Create backup
        cp "$file" "${file}.backup2"
        
        # Fix the CSS preload syntax
        sed -i.bak "s/this.rel='stylesheet'/this.rel='stylesheet'/g" "$file"
        sed -i.bak 's/onload="this.onload=null;this.rel=stylesheet"/onload="this.onload=null;this.rel=\'stylesheet\'"/g' "$file"
        
        # Clean up temporary files
        rm -f "$file.bak"
        
        echo "Fixed CSS preload syntax in $file"
    else
        echo "Warning: $file does not exist"
    fi
done

echo "CSS preload syntax fix complete!"