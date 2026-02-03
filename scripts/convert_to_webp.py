#!/usr/bin/env python3
"""
Script pour convertir les images JPEG du carousel en WebP
et mettre à jour le fichier HTML en conséquence
"""

import os
from PIL import Image
import re
import shutil

def convert_jpeg_to_webp(jpeg_path, quality=80):
    """
    Convertit une image JPEG en WebP
    
    Args:
        jpeg_path (str): Chemin de l'image JPEG
        quality (int): Qualité WebP (0-100)
    
    Returns:
        str: Chemin de l'image WebP créée
    """
    webp_path = os.path.splitext(jpeg_path)[0] + '.webp'
    
    with Image.open(jpeg_path) as img:
        # Convertir en RGB si nécessaire (pour les images avec canal alpha)
        if img.mode in ('RGBA', 'LA', 'P'):
            # Créer un fond blanc pour les images avec transparence
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
            img = background
        
        # Sauvegarder au format WebP
        img.save(webp_path, 'WEBP', quality=quality)
    
    # Obtenir les tailles des fichiers
    jpeg_size = os.path.getsize(jpeg_path) / 1024  # Ko
    webp_size = os.path.getsize(webp_path) / 1024  # Ko
    
    print(f"Converti: {os.path.basename(jpeg_path)} ({jpeg_size:.1f}KB) -> {os.path.basename(webp_path)} ({webp_size:.1f}KB)")
    print(f"Réduction: {((jpeg_size - webp_size) / jpeg_size * 100):.1f}%")
    
    return webp_path

def update_html_file(html_path, replacements):
    """
    Met à jour le fichier HTML avec les nouveaux chemins d'images WebP
    
    Args:
        html_path (str): Chemin du fichier HTML
        replacements (dict): Dictionnaire des remplacements à effectuer
    """
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Effectuer les remplacements
    for old_path, new_path in replacements.items():
        # Remplacer dans les attributs style et src
        content = content.replace(old_path, new_path)
        
        # Utiliser une expression régulière pour être plus précise
        pattern = re.escape(old_path)
        content = re.sub(pattern, new_path, content)
    
    # Sauvegarder le fichier modifié
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Fichier HTML mis à jour: {html_path}")

def main():
    # Vérifier si Pillow est installé
    try:
        from PIL import Image
    except ImportError:
        print("Erreur : Pillow n'est pas installé.")
        print("Installez-le avec : pip install Pillow")
        return
    
    project_dir = "/Users/omerlinks/Documents/carousel"
    html_file = os.path.join(project_dir, "index.html")
    
    # Trouver toutes les images JPEG du carousel
    jpeg_images = []
    for file in os.listdir(os.path.join(project_dir, "img")):
        if file.startswith("freepik__") and file.endswith(".jpeg"):
            jpeg_images.append(file)
    
    if not jpeg_images:
        print("Aucune image JPEG du carousel trouvée")
        return
    
    print(f"Trouvé {len(jpeg_images)} images JPEG à convertir:")
    for img in jpeg_images:
        print(f"  - {img}")
    
    # Dictionnaire pour stocker les remplacements
    replacements = {}
    
    # Convertir chaque image
    for jpeg_img in jpeg_images:
        jpeg_path = os.path.join(project_dir, "img", jpeg_img)
        
        # Convertir en WebP
        webp_path = convert_jpeg_to_webp(jpeg_path)
        webp_filename = os.path.basename(webp_path)
        
        # Ajouter au dictionnaire des remplacements
        old_path = f"./img/{jpeg_img}"
        new_path = f"./img/{webp_filename}"
        replacements[old_path] = new_path
        
        # Supprimer l'image JPEG originale
        os.remove(jpeg_path)
        print(f"Supprimé: {jpeg_img}")
    
    print("\nMise à jour du fichier HTML...")
    
    # Mettre à jour le fichier HTML
    update_html_file(html_file, replacements)
    
    print("\nConversion terminée avec succès!")
    print("Toutes les images JPEG ont été converties en WebP et les doublons supprimés.")

if __name__ == "__main__":
    main()