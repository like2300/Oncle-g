const fs = require('fs');
const path = require('path');

// Fonction pour améliorer le SEO d'un fichier HTML
function improveSEO(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Vérifier si c'est un fichier HTML
    if (!content.includes('<html') && !content.includes('.html')) {
        return;
    }
    
    // Améliorer les balises meta pour le SEO
    if (content.includes('<meta name="description"')) {
        // Remplacer la description existante par une description plus optimisée
        const descriptionRegex = /(<meta name="description" content=")([^"]*)(">)/;
        if (filePath.includes('index.html')) {
            content = content.replace(descriptionRegex, `$1Service de livraison express à Brazzaville par Oncle G. Découvrez nos services innovants : livraison express, livraison de gaz, conciergerie, e-commerce et plus encore. Un sourire, c'est déjà une livraison réussie.$3`);
        } else if (filePath.includes('Allô’Gaz') || filePath.includes('Allô\'Gaz')) {
            content = content.replace(descriptionRegex, `$1Service de livraison de gaz à domicile par Oncle G. Commandez en un geste, recevez rapidement. Sécurité et fiabilité garanties.$3`);
        } else if (filePath.includes('ConciergerieExpress')) {
            content = content.replace(descriptionRegex, `$1Service de conciergerie express par Oncle G. Tâches quotidiennes prises en charge par nos experts. Gain de temps garanti.$3`);
        } else if (filePath.includes('G-PROMarketing')) {
            content = content.replace(descriptionRegex, `$1Solution clé en main G-PRO E-Commerce par Oncle G. Vendez sans gérer la logistique. Nous prenons en charge stock, vente et distribution.$3`);
        } else if (filePath.includes('pro-g')) {
            content = content.replace(descriptionRegex, `$1G-PRO Illimité par Oncle G - Moto et livreur dédiés pour les professionnels. Carburant, maintenance, remplacement et suivi inclus.$3`);
        } else if (filePath.includes('a-propos')) {
            content = content.replace(descriptionRegex, `$1Découvrez Oncle G - Notre histoire, nos valeurs et notre engagement pour des services de livraison de qualité à Brazzaville.$3`);
        } else if (filePath.includes('livraison-express')) {
            content = content.replace(descriptionRegex, `$1Service de livraison express par Oncle G. Rapidité, fiabilité et attention au détail pour vos livraisons à Brazzaville.$3`);
        } else if (filePath.includes('contacts')) {
            content = content.replace(descriptionRegex, `$1Contactez Oncle G - Service client et support. Nous sommes là pour répondre à toutes vos questions sur nos services de livraison.$3`);
        } else {
            content = content.replace(descriptionRegex, `$1Oncle G - Services de livraison innovants à Brazzaville. Découvrez nos solutions sur mesure pour simplifier votre quotidien.$3`);
        }
    }
    
    // Ajouter ou mettre à jour les balises keywords
    if (!content.includes('<meta name="keywords"')) {
        const headEnd = content.indexOf('</head>');
        if (headEnd !== -1) {
            let keywords = 'oncle g, livraisons, brazzaville, congo, service de livraison';
            
            if (filePath.includes('Allô’Gaz') || filePath.includes('Allô\'Gaz')) {
                keywords += ', livraison de gaz, gaz domicile, commande gaz';
            } else if (filePath.includes('ConciergerieExpress')) {
                keywords += ', conciergerie, services, tâches quotidiennes, gain de temps';
            } else if (filePath.includes('G-PROMarketing')) {
                keywords += ', e-commerce, zero stock, solution logistique, vente en ligne';
            } else if (filePath.includes('pro-g')) {
                keywords += ', g-pro, livraison professionnelle, moto dédiée, service livraison';
            } else if (filePath.includes('livraison-express')) {
                keywords += ', livraison express, service rapide, livraison fiable';
            }
            
            const newMetaTag = `    <meta name="keywords" content="${keywords}">\n`;
            content = content.substring(0, headEnd) + newMetaTag + content.substring(headEnd);
        }
    }
    
    // Ajouter des balises de géolocalisation pour Brazzaville
    if (!content.includes('geo.region')) {
        const headEnd = content.indexOf('</head>');
        if (headEnd !== -1) {
            const geoTags = `    <meta name="geo.region" content="CG">\n    <meta name="geo.placename" content="Brazzaville">\n    <meta name="geo.position" content="-4.261063;15.279534">\n    <meta name="ICBM" content="-4.261063, 15.279534">\n`;
            content = content.substring(0, headEnd) + geoTags + content.substring(headEnd);
        }
    }
    
    // Ajouter le schema.org pour LocalBusiness
    if (!content.includes('"@type": "LocalBusiness"')) {
        const headEnd = content.indexOf('</head>');
        if (headEnd !== -1) {
            const schemaMarkup = `    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Oncle G Livraisons",
      "alternateName": "ONCLE G Livraisons",
      "url": "https://www.oncleg.com",
      "logo": "https://www.oncleg.com/img/Oncle%20G%20-%20Logo.svg",
      "image": "https://www.oncleg.com/img/Oncle%20G%20-%20Logo.svg",
      "description": "Service de livraison express à Brazzaville. Un sourire, c'est déjà une livraison réussie.",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "CG",
        "addressRegion": "Brazzaville"
      },
      "areaServed": {
        "@type": "City",
        "name": "Brazzaville"
      },
      "serviceType": "Livraison de colis, Livraison de gaz, Conciergerie, E-commerce",
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
      ]
    }
    </script>\n`;
            content = content.substring(0, headEnd) + schemaMarkup + content.substring(headEnd);
        }
    }
    
    // Sauvegarder le fichier modifié
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`SEO amélioré pour: ${filePath}`);
}

// Fonction récursive pour parcourir tous les fichiers HTML
function processDirectory(dirPath) {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (item.endsWith('.html')) {
            improveSEO(fullPath);
        }
    }
}

// Démarrer le traitement depuis le répertoire racine
processDirectory('/Users/omerlinks/Documents/carousel');

console.log('Amélioration SEO terminée pour tous les fichiers HTML!');