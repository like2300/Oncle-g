#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Fonction pour améliorer le SEO d'un fichier HTML
function updateSEOForFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Déterminer le titre et la description en fonction du nom de fichier
    let title = "Oncle G - Livraisons Express | Service de Livraison à Brazzaville";
    let description = "ONCLE G Livraisons - Service de livraison express à Brazzaville. Découvrez nos services innovants : livraison express, livraison de gaz, conciergerie, e-commerce et plus encore. Un sourire, c'est déjà une livraison réussie.";
    
    if (filePath.includes('Allô’Gaz') || filePath.includes('Allô\'Gaz')) {
        title = "Allô'Gaz - Oncle G | Livraison de Gaz à Domicile";
        description = "Service de livraison de gaz à domicile par ONCLE G Livraisons. Commandez en un geste, recevez rapidement. Sécurité et fiabilité garanties.";
    } else if (filePath.includes('ConciergerieExpress')) {
        title = "Conciergerie Express - Oncle G | Services Sur Mesure";
        description = "Service de conciergerie express par ONCLE G Livraisons. Tâches quotidiennes prises en charge par nos experts. Gain de temps garanti.";
    } else if (filePath.includes('G-PROMarketing')) {
        title = "G-PRO E-Commerce - Oncle G | Zéro Stock, Zéro Charge";
        description = "Solution clé en main G-PRO E-Commerce par ONCLE G Livraisons. Vendez sans gérer la logistique. Nous prenons en charge stock, vente et distribution.";
    } else if (filePath.includes('pro-g')) {
        title = "G-PRO Illimité - Oncle G | Livraison Sans Contrainte";
        description = "G-PRO Illimité par ONCLE G Livraisons - Moto et livreur dédiés pour les professionnels. Carburant, maintenance, remplacement et suivi inclus.";
    } else if (filePath.includes('a-propos')) {
        title = "À Propos d'Oncle G | Notre Histoire et Nos Valeurs";
        description = "Découvrez l'histoire d'Oncle G, nos valeurs et notre engagement pour des services de livraison de qualité à Brazzaville.";
    } else if (filePath.includes('livraison-express')) {
        title = "Livraison Express | Oncle G - Rapide et Fiable";
        description = "Service de livraison express par ONCLE G Livraisons. Rapidité, fiabilité et attention au détail pour vos livraisons à Brazzaville.";
    } else if (filePath.includes('contacts')) {
        title = "Contactez Oncle G | Service Client et Support";
        description = "Contactez Oncle G pour toute question sur nos services de livraison. Notre équipe est prête à vous aider avec le sourire.";
    } else if (filePath.includes('commandez-en-un-geste')) {
        title = "Commandez en Un Geste | Oncle G - Service Simplifié";
        description = "Commandez vos services Oncle G en un seul geste. Notre plateforme intuitive vous permet de gérer toutes vos livraisons simplement.";
    } else if (filePath.includes('communaute')) {
        title = "Communauté Oncle G | Rejoignez Notre Réseau";
        description = "Rejoignez la communauté Oncle G et bénéficiez d'avantages exclusifs. Ensemble, faisons de chaque livraison une réussite.";
    } else if (filePath.includes('employer')) {
        title = "Travaillez avec Oncle G | Rejoignez Notre Équipe";
        description = "Rejoignez l'équipe Oncle G et faites partie de l'aventure. Nous recrutons des livreurs passionnés et dévoués à Brazzaville.";
    }
    
    // Remplacer le titre
    const titleRegex = /(<title>)([^<]*)(<\/title>)/i;
    content = content.replace(titleRegex, `$1${title}$3`);
    
    // Remplacer la description
    const descRegex = /(<meta name="description" content=")([^"]*)(">)/i;
    content = content.replace(descRegex, `$1${description}$3`);
    
    // Ajouter les balises de géolocalisation si elles n'existent pas
    if (!content.includes('geo.region')) {
        const headEnd = content.indexOf('</head>');
        if (headEnd !== -1) {
            const geoTags = `    <meta name="geo.region" content="CG">\n    <meta name="geo.placename" content="Brazzaville">\n    <meta name="geo.position" content="-4.261063;15.279534">\n    <meta name="ICBM" content="-4.261063, 15.279534">\n`;
            content = content.substring(0, headEnd) + geoTags + content.substring(headEnd);
        }
    }
    
    // Ajouter canonical si absent
    if (!content.includes('rel="canonical"')) {
        const headEnd = content.indexOf('</head>');
        if (headEnd !== -1) {
            // Extraire le chemin du fichier pour construire l'URL
            const relativePath = path.relative('/Users/omerlinks/Documents/carousel', filePath)
                .replace(/\\/g, '/') // Convertir les antislashs Windows en slashs
                .replace('index.html', '') // Retirer index.html pour la racine
                .replace('.html', ''); // Retirer l'extension
            
            let canonicalUrl = 'https://www.oncleg.com/';
            if (relativePath && !relativePath.includes('index')) {
                canonicalUrl += relativePath;
                if (!relativePath.endsWith('/')) {
                    canonicalUrl += '/';
                }
            }
            
            const canonicalTag = `    <link rel="canonical" href="${canonicalUrl}">\n`;
            content = content.substring(0, headEnd) + canonicalTag + content.substring(headEnd);
        }
    }
    
    // Ajouter le schéma de données si absent
    if (!content.includes('@type": "LocalBusiness"')) {
        const headEnd = content.indexOf('</head>');
        if (headEnd !== -1) {
            // Déterminer le type de service pour le schéma
            let serviceType = "Livraison de colis, Livraison de gaz, Conciergerie, E-commerce";
            if (filePath.includes('Allô’Gaz') || filePath.includes('Allô\'Gaz')) {
                serviceType = "Livraison de gaz à domicile";
            } else if (filePath.includes('ConciergerieExpress')) {
                serviceType = "Conciergerie express";
            } else if (filePath.includes('G-PROMarketing')) {
                serviceType = "Solution e-commerce clé en main";
            } else if (filePath.includes('pro-g')) {
                serviceType = "Livraison professionnelle illimitée";
            }
            
            const schemaMarkup = `    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Oncle G Livraisons",
      "alternateName": "ONCLE G Livraisons",
      "url": "https://www.oncleg.com",
      "logo": "https://www.oncleg.com/img/Oncle%20G%20-%20Logo.svg",
      "image": "https://www.oncleg.com/img/Oncle%20G%20-%20Logo.svg",
      "description": "${description}",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "CG",
        "addressRegion": "Brazzaville"
      },
      "areaServed": {
        "@type": "City",
        "name": "Brazzaville"
      },
      "serviceType": "${serviceType}",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Services d'Oncle G",
        "itemListElement": [{
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Livraison Express"
          }
        }, {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Livraison de Gaz"
          }
        }, {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Conciergerie Express"
          }
        }, {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "G-PRO E-Commerce"
          }
        }]
      },
      "potentialAction": {
        "@type": "OrderAction",
        "target": "https://wa.me/242066338224"
      },
      "sameAs": [
        "https://www.facebook.com/oncleglivraisons",
        "https://www.instagram.com/oncleglivraisons/",
        "https://x.com/OncleGLIVRAISON",
        "https://www.tiktok.com/@oncle.g.livraisons",
        "https://www.linkedin.com/in/oncle-g-livraisons-5272783a0/"
      ],
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "08:00",
        "closes": "22:00"
      }
    }
    </script>\n`;
            content = content.substring(0, headEnd) + schemaMarkup + content.substring(headEnd);
        }
    }
    
    // Sauvegarder le fichier modifié
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`SEO mis à jour pour: ${filePath}`);
}

// Fonction récursive pour parcourir tous les fichiers HTML
function processDirectory(dirPath) {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            // Ignorer les dossiers système
            if (item !== 'node_modules' && !item.startsWith('.') && !item.startsWith('img') && !item.startsWith('css') && !item.startsWith('js')) {
                processDirectory(fullPath);
            }
        } else if (item.endsWith('.html')) {
            updateSEOForFile(fullPath);
        }
    }
}

// Démarrer le traitement depuis le répertoire racine
processDirectory('/Users/omerlinks/Documents/carousel');

console.log('Amélioration SEO terminée pour tous les fichiers HTML!');