#!/bin/bash

# Site-wide SEO and Performance Optimization Script
# Updates all HTML pages with proper SEO tags and performance enhancements

echo "Starting site-wide optimization..."

# Define the pages to update
PAGES=(
    "./index.html"
    "./pages/oncle-g/pro-g.html"
    "./pages/oncle-g/G-PROMarketing.html"
    "./pages/oncle-g/ConciergerieExpress.html"
    "./pages/oncle-g/Allô'Gaz.html"
    "./pages/oncle-g/Allô’Gaz.html"
)

# Function to update a single HTML file
update_html_file() {
    local file="$1"
    local title="$2"
    local description="$3"
    local keywords="$4"

    echo "Updating $file..."

    # Create backup
    cp "$file" "${file}.backup"

    # Use sed to update the head section with enhanced SEO tags
    temp_file=$(mktemp)
    
    # Extract the head section and update it
    awk '
    BEGIN { in_head=0; printed_new_head=0; }
    /<head>/ { 
        in_head=1; 
        print "<head>";
        print "    <meta charset=\"UTF-8\">";
        print "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">";
        print "    <title>'"$title"'<\/title>";
        print "";
        print "    <!-- SEO Meta Tags -->";
        print "    <meta name=\"description\" content=\"'"$description"'\">";
        print "    <meta name=\"keywords\" content=\"'"$keywords"'\">";
        print "    <meta name=\"author\" content=\"Oncle G Livraisons\">";
        print "    <meta name=\"robots\" content=\"index, follow\">";
        print "    <meta name=\"theme-color\" content=\"#f6d23a\">";  # Yellow color from your brand
        print "";
        print "    <!-- Open Graph / Facebook -->";
        print "    <meta property=\"og:type\" content=\"website\">";
        print "    <meta property=\"og:url\" content=\"https://www.oncleg.com/'$(basename "$file")'\">";
        print "    <meta property=\"og:title\" content=\"'"$title"'\">";
        print "    <meta property=\"og:description\" content=\"'"$description"'\">";
        print "    <meta property=\"og:image\" content=\"./img/Oncle%20G%20-%20Logo.png\">";
        print "    <meta property=\"og:site_name\" content=\"Oncle G\">";
        print "";
        print "    <!-- Twitter -->";
        print "    <meta property=\"twitter:card\" content=\"summary_large_image\">";
        print "    <meta property=\"twitter:url\" content=\"https://www.oncleg.com/'$(basename "$file")'\">";
        print "    <meta property=\"twitter:title\" content=\"'"$title"'\">";
        print "    <meta property=\"twitter:description\" content=\"'"$description"'\">";
        print "    <meta property=\"twitter:image\" content=\"./img/Oncle%20G%20-%20Logo.png\">";
        print "";
        print "    <!-- link favicon -->";
        print "    <link rel=\"icon\" type=\"image/png\" sizes=\"32x32\" href=\"./img/icons/favicon-32x32.png\">";
        print "    <link rel=\"icon\" type=\"image/png\" sizes=\"16x16\" href=\"./img/icons/favicon-16x16.png\">";
        print "";
        print "    <link rel=\"manifest\" href=\"./img/icons/manifest.json\">";
        print "    <meta name=\"msapplication-config\" content=\"./img/icons/browserconfig.xml\">";
        print "";
        print "    <!-- Preconnect to external domains for performance -->";
        print "    <link rel=\"preconnect\" href=\"https://cdn.tailwindcss.com\">";
        print "    <link rel=\"preconnect\" href=\"https://cdn.jsdelivr.net\">";
        print "    <link rel=\"preconnect\" href=\"https://cdnjs.cloudflare.com\">";
        print "";
        print "    <!-- Critical CSS inlined for faster rendering -->";
        print "    <link rel=\"preload\" href=\"./css/main.css\" as=\"style\" onload=\"this.onload=null;this.rel='stylesheet'\">";
        print "    <link rel=\"preload\" href=\"./css/loader.css\" as=\"style\" onload=\"this.onload=null;this.rel='stylesheet'\">";
        print "    <noscript><link rel=\"stylesheet\" href=\"./css/main.css\"><\/noscript>";
        print "    <noscript><link rel=\"stylesheet\" href=\"./css/loader.css\"><\/noscript>";
        print "";
        print "    <!-- Non-critical CSS loaded asynchronously -->";
        print "    <link rel=\"preload\" href=\"./css/animations.css\" as=\"style\" onload=\"this.onload=null;this.rel='stylesheet'\">";
        print "    <link rel=\"preload\" href=\"./css/typography.css\" as=\"style\" onload=\"this.onload=null;this.rel='stylesheet'\">";
        print "    <link rel=\"preload\" href=\"./css/components.css\" as=\"style\" onload=\"this.onload=null;this.rel='stylesheet'\">";
        print "    <link rel=\"preload\" href=\"./css/layout.css\" as=\"style\" onload=\"this.onload=null;this.rel='stylesheet'\">";
        print "    <link rel=\"preload\" href=\"./css/carousel.css\" as=\"style\" onload=\"this.onload=null;this.rel='stylesheet'\">";
        print "    <link rel=\"preload\" href=\"./css/responsive.css\" as=\"style\" onload=\"this.onload=null;this.rel='stylesheet'\">";
        print "";
        print "    <!-- Font preloading for performance -->";
        print "    <link rel=\"preload\" href=\"./fonts.css\" as=\"style\" onload=\"this.onload=null;this.rel='stylesheet'\">";
        print "";
        print "    <!-- Scripts loaded efficiently -->";
        print "    <script src=\"https://cdn.tailwindcss.com\"><\/script>";
        print "    <script defer src=\"https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js\"><\/script>";
        print "    <script defer src=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css\" onload=\"this.onload=null;this.rel='stylesheet'\"><\/script>";
        print "    <script defer src=\"https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js\"><\/script>";
        print "    <script defer src=\"./scripts/optimize-loading.js\"><\/script>";
        printed_new_head=1;
        next;
    }
    in_head && /<\/head>/ { 
        in_head=0; 
        print "    <script src=\"./js/loader.js\"><\/script>";  # Keep your loader script
        print "<\/head>";
        next;
    }
    in_head { next; }  # Skip old head content
    { print; }
    ' "$file" > "$temp_file" && mv "$temp_file" "$file"
}

# Update each page with appropriate SEO content
update_html_file "./index.html" \
    "Oncle G - Livraisons Express | Service de Livraison à Brazzaville" \
    "ONCLE G Livraisons - Service de livraison express à Brazzaville. Un sourire, c'est déjà une livraison réussie. Solutions de livraison rapides et fiables." \
    "livraison, express, brazzaville, oncle g, delivery, congo, service, rapide, fiable, moto, course"

update_html_file "./pages/oncle-g/pro-g.html" \
    "G-PRO Illimité - Oncle G | Livraison Sans Contrainte" \
    "G-PRO Illimité par ONCLE G Livraisons - Moto et livreur dédiés pour les professionnels. Carburant, maintenance, remplacement et suivi inclus." \
    "g-pro, illimité, oncle g, livraison professionnelle, moto dédiée, service livraison, professionnel, brazzaville"

update_html_file "./pages/oncle-g/G-PROMarketing.html" \
    "G-PRO E-Commerce - Oncle G | Zéro Stock, Zéro Charge" \
    "Solution clé en main G-PRO E-Commerce par ONCLE G Livraisons. Vendez sans gérer la logistique. Nous prenons en charge stock, vente et distribution." \
    "g-pro, e-commerce, zero stock, oncle g, solution logistique, vente en ligne, distribution, brazzaville"

update_html_file "./pages/oncle-g/ConciergerieExpress.html" \
    "Conciergerie Express - Oncle G | Services Sur Mesure" \
    "Service de conciergerie express par ONCLE G Livraisons. Tâches quotidiennes prises en charge par nos experts. Gain de temps garanti." \
    "conciergerie, express, oncle g, services, tâches quotidiennes, gain de temps, brazzaville"

update_html_file "./pages/oncle-g/Allô'Gaz.html" \
    "Allô'Gaz - Oncle G | Livraison de Gaz à Domicile" \
    "Service de livraison de gaz à domicile par ONCLE G Livraisons. Commandez en un geste, recevez rapidement. Sécurité et fiabilité garanties." \
    "allô'gaz, livraison gaz, domicile, oncle g, commande facile, sécurité, brazzaville"

update_html_file "./pages/oncle-g/Allô’Gaz.html" \
    "Allô'Gaz - Oncle G | Livraison de Gaz à Domicile" \
    "Service de livraison de gaz à domicile par ONCLE G Livraisons. Commandez en un geste, recevez rapidement. Sécurité et fiabilité garanties." \
    "allô'gaz, livraison gaz, domicile, oncle g, commande facile, sécurité, brazzaville"

echo "Site optimization complete!"
echo "Updated SEO meta tags and performance optimizations for all pages."
echo "Backup files created with .backup extension."