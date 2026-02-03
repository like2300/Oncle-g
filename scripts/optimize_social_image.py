#!/usr/bin/env python3
"""
Script pour optimiser une image pour les réseaux sociaux
Dimensions cibles : 1200x630 pixels
Poids cible : < 300KB
Formats supportés : PNG/JPG
"""

import os
from PIL import Image
import sys

def optimize_image(input_path, output_path=None, target_width=1200, target_height=630, max_size_kb=300):
    """
    Optimise une image pour les réseaux sociaux
    
    Args:
        input_path (str): Chemin de l'image d'origine
        output_path (str): Chemin de l'image optimisée (optionnel)
        target_width (int): Largeur cible
        target_height (int): Hauteur cible
        max_size_kb (int): Taille maximale en KB
    """
    
    # Ouvrir l'image originale
    with Image.open(input_path) as img:
        # Convertir en RGB si nécessaire (pour les images avec canal alpha)
        if img.mode in ('RGBA', 'LA', 'P'):
            # Créer un fond blanc pour les images avec transparence
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
            img = background
        
        # Redimensionner l'image
        img_resized = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
        
        # Déterminer le chemin de sortie
        if output_path is None:
            base_path = os.path.splitext(input_path)[0]
            output_path = f"{base_path}_optimized.jpg"
        
        # Sauvegarder en JPEG avec qualité ajustable
        quality = 95  # Qualité initiale
        while quality > 10:  # Réduire la qualité jusqu'à atteindre la taille cible
            img_resized.save(output_path, 'JPEG', quality=quality, optimize=True)
            
            # Vérifier la taille du fichier
            file_size_kb = os.path.getsize(output_path) / 1024
            
            if file_size_kb <= max_size_kb:
                break
                
            quality -= 5  # Réduire la qualité
        
        # Si malgré tout la taille est trop grande, réduire davantage la qualité
        if file_size_kb > max_size_kb:
            quality = 50  # Réduction drastique de la qualité
            img_resized.save(output_path, 'JPEG', quality=quality, optimize=True)
            file_size_kb = os.path.getsize(output_path) / 1024
        
        print(f"Image optimisée sauvegardée : {output_path}")
        print(f"Dimensions : {img_resized.width}x{img_resized.height}px")
        print(f"Poids : {file_size_kb:.1f}KB")
        print(f"Qualité JPEG : {quality}%")
        
        return output_path

def main():
    # Vérifier si Pillow est installé
    try:
        from PIL import Image
    except ImportError:
        print("Erreur : Pillow n'est pas installé.")
        print("Installez-le avec : pip install Pillow")
        sys.exit(1)
    
    # Chemin de l'image originale
    input_image = "img/ScreenShot.png"
    project_dir = "/Users/omerlinks/Documents/carousel"
    input_path = os.path.join(project_dir, input_image)
    
    if not os.path.exists(input_path):
        print(f"Erreur : L'image {input_path} n'existe pas")
        sys.exit(1)
    
    # Chemin de sortie
    output_path = os.path.join(project_dir, "img/og-image.jpg")
    
    print("Optimisation de l'image pour les réseaux sociaux...")
    print(f"Image d'origine : {input_path}")
    
    # Optimiser l'image
    optimized_path = optimize_image(
        input_path=input_path,
        output_path=output_path,
        target_width=1200,
        target_height=630,
        max_size_kb=250  # Légèrement en dessous de la limite pour être sûr
    )
    
    print("\nOpération terminée avec succès!")
    
    # Mise à jour du fichier HTML pour utiliser la nouvelle image
    html_file = os.path.join(project_dir, "index.html")
    update_html_with_new_image(html_file, "img/og-image.jpg")

def update_html_with_new_image(html_file, new_image_path):
    """Met à jour le fichier HTML pour utiliser la nouvelle image optimisée"""
    if not os.path.exists(html_file):
        print(f"Le fichier {html_file} n'existe pas")
        return
    
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remplacer les références à l'image dans les balises meta
    import re
    
    # Mise à jour des balises Open Graph
    content = re.sub(
        r'(property="og:image"\s+content=")[^"]*(")',
        rf'\g<1>{new_image_path}\g<2>',
        content
    )
    
    # Mise à jour des balises Twitter
    content = re.sub(
        r'(property="twitter:image"\s+content=")[^"]*(")',
        rf'\g<1>{new_image_path}\g<2>',
        content
    )
    
    # Mise à jour de la balise thumbnail
    content = re.sub(
        r'(name="thumbnail"\s+content=")[^"]*(")',
        rf'\g<1>{new_image_path}\g<2>',
        content
    )
    
    # Mise à jour de la balise image_src
    content = re.sub(
        r'(rel="image_src"\s+type="image/[^"]+"\s+href=")[^"]*(")',
        rf'\g<1>{new_image_path}\g<2>',
        content
    )
    
    # Sauvegarder le fichier modifié
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Fichier HTML mis à jour pour utiliser {new_image_path}")

if __name__ == "__main__":
    main()