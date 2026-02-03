/**
 * Simple SEO Enhancement Script
 * Adds SEO improvements without changing page structure
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Update meta tags for better SEO
    updateSEOTags();
});

function updateSEOTags() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // SEO information for each page
    const pageInfo = {
        'index.html': {
            title: 'Oncle G - Livraisons Express | Service de Livraison à Brazzaville',
            description: 'ONCLE G Livraisons - Service de livraison express à Brazzaville. Un sourire, c\'est déjà une livraison réussie. Solutions de livraison rapides et fiables.',
            keywords: 'livraison, express, brazzaville, oncle g, delivery, congo, service, rapide, fiable, moto, course'
        },
        'pro-g.html': {
            title: 'G-PRO Illimité - Oncle G | Livraison Sans Contrainte',
            description: 'G-PRO Illimité par ONCLE G Livraisons - Moto et livreur dédiés pour les professionnels. Carburant, maintenance, remplacement et suivi inclus.',
            keywords: 'g-pro, illimité, oncle g, livraison professionnelle, moto dédiée, service livraison, professionnel, brazzaville'
        },
        'G-PROMarketing.html': {
            title: 'G-PRO E-Commerce - Oncle G | Zéro Stock, Zéro Charge',
            description: 'Solution clé en main G-PRO E-Commerce par ONCLE G Livraisons. Vendez sans gérer la logistique. Nous prenons en charge stock, vente et distribution.',
            keywords: 'g-pro, e-commerce, zero stock, oncle g, solution logistique, vente en ligne, distribution, brazzaville'
        },
        'ConciergerieExpress.html': {
            title: 'Conciergerie Express - Oncle G | Services Sur Mesure',
            description: 'Service de conciergerie express par ONCLE G Livraisons. Tâches quotidiennes prises en charge par nos experts. Gain de temps garanti.',
            keywords: 'conciergerie, express, oncle g, services, tâches quotidiennes, gain de temps, brazzaville'
        },
        'Allô\'Gaz.html': {
            title: 'Allô\'Gaz - Oncle G | Livraison de Gaz à Domicile',
            description: 'Service de livraison de gaz à domicile par ONCLE G Livraisons. Commandez en un geste, recevez rapidement. Sécurité et fiabilité garanties.',
            keywords: 'allô\'gaz, livraison gaz, domicile, oncle g, commande facile, sécurité, brazzaville'
        },
        'Allô’Gaz.html': {
            title: 'Allô\'Gaz - Oncle G | Livraison de Gaz à Domicile',
            description: 'Service de livraison de gaz à domicile par ONCLE G Livraisons. Commandez en un geste, recevez rapidement. Sécurité et fiabilité garanties.',
            keywords: 'allô\'gaz, livraison gaz, domicile, oncle g, commande facile, sécurité, brazzaville'
        }
    };
    
    const info = pageInfo[currentPage] || pageInfo['index.html'];
    
    // Update title
    document.title = info.title;
    
    // Update description
    let descTag = document.querySelector('meta[name="description"]');
    if (descTag) {
        descTag.setAttribute('content', info.description);
    } else {
        descTag = document.createElement('meta');
        descTag.name = 'description';
        descTag.content = info.description;
        document.head.appendChild(descTag);
    }
    
    // Update keywords
    let keywordsTag = document.querySelector('meta[name="keywords"]');
    if (keywordsTag) {
        keywordsTag.setAttribute('content', info.keywords);
    } else {
        keywordsTag = document.createElement('meta');
        keywordsTag.name = 'keywords';
        keywordsTag.content = info.keywords;
        document.head.appendChild(keywordsTag);
    }
    
    // Update Open Graph tags
    updateMetaTag('og:title', info.title, 'property');
    updateMetaTag('og:description', info.description, 'property');
    updateMetaTag('og:url', window.location.href, 'property');
    
    // Update Twitter Card tags
    updateMetaTag('twitter:title', info.title, 'name');
    updateMetaTag('twitter:description', info.description, 'name');
    
    // Add schema markup
    addSchemaMarkup(info);
}

function updateMetaTag(name, content, attribute = 'name') {
    let tag = document.querySelector(`meta[${attribute}="${name}"]`);
    if (tag) {
        tag.setAttribute('content', content);
    } else {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, name);
        tag.content = content;
        document.head.appendChild(tag);
    }
}

function addSchemaMarkup(pageInfo) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "ONCLE G Livraisons",
        "image": window.location.origin + "/img/Oncle%20G%20-%20Logo.png",
        "telephone": "+242 XXX XXX XX", // Replace with actual phone
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Brazzaville",
            "addressCountry": "CG"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": -4.2634,
            "longitude": 15.2847
        },
        "url": window.location.href,
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "07:00",
            "closes": "22:00"
        },
        "areaServed": {
            "@type": "City",
            "name": "Brazzaville"
        },
        "serviceType": "Delivery Service",
        "description": pageInfo.description
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
}