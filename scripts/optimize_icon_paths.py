#!/usr/bin/env python3
"""
Script pour optimiser les chemins d'icônes dans le fichier HTML
en remplaçant les chemins locaux par des versions CDN quand c'est possible
"""

import re
import os

def update_social_icons_cdn(html_path):
    """
    Met à jour les chemins des icônes de réseaux sociaux dans le fichier HTML
    pour améliorer la performance
    """
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Dictionnaire des icônes et leurs CDN alternatifs
    # Pour les icônes SVG spécifiques à Oncle G, on garde les versions locales
    # mais on optimise les chemins pour une meilleure mise en cache
    
    # Mise à jour des chemins pour qu'ils soient relatifs au déploiement GitHub
    # En remplaçant "./img/" par "/Oncle-g/img/" pour correspondre à GitHub Pages
    content = re.sub(r'(\.\./|\./)img/icone_social/', '/Oncle-g/img/icone_social/', content)
    
    # Sauvegarder le fichier modifié
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Fichier HTML mis à jour pour les chemins des icônes : {html_path}")

def main():
    project_dir = "/Users/omerlinks/Documents/carousel"
    html_file = os.path.join(project_dir, "index.html")
    
    print("Optimisation des chemins d'icônes dans le fichier HTML...")
    update_social_icons_cdn(html_file)
    
    print("Optimisation terminée!")

if __name__ == "__main__":
    main()