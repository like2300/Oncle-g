/**
 * Minimal Site Optimization Script
 * Only handles SEO enhancements without interfering with existing functionality
 */

// SEO Enhancement Class
class SEOEnhancer {
    constructor() {
        this.updateMetaTags();
        this.enhancePageStructure();
    }

    // Update meta tags for current page
    updateMetaTags() {
        const pathname = window.location.pathname.split('/').pop() || 'index.html';
        const pageInfo = this.getPageInfo(pathname);

        // Update title
        document.title = pageInfo.title;

        // Update description
        this.setMetaTag('description', pageInfo.description);
        
        // Update keywords
        this.setMetaTag('keywords', pageInfo.keywords);
        
        // Update Open Graph tags
        this.setMetaTag('og:title', pageInfo.title, 'property');
        this.setMetaTag('og:description', pageInfo.description, 'property');
        this.setMetaTag('og:url', window.location.href, 'property');
        this.setMetaTag('og:image', pageInfo.image || './img/Oncle%20G%20-%20Logo.png', 'property');
        
        // Update Twitter Card tags
        this.setMetaTag('twitter:title', pageInfo.title, 'name');
        this.setMetaTag('twitter:description', pageInfo.description, 'name');
        this.setMetaTag('twitter:image', pageInfo.image || './img/Oncle%20G%20-%20Logo.png', 'name');
        this.setMetaTag('twitter:card', 'summary_large_image', 'name');
    }

    // Set or update a meta tag
    setMetaTag(name, content, attribute = 'name') {
        let meta = document.querySelector(`meta[${attribute}="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute(attribute, name);
            meta.content = content;
            document.head.appendChild(meta);
        } else {
            meta.content = content;
        }
    }

    // Get page-specific info for SEO
    getPageInfo(pathname) {
        const pages = {
            'index.html': {
                title: 'Oncle G - Livraisons Express | Service de Livraison à Brazzaville',
                description: 'ONCLE G Livraisons - Service de livraison express à Brazzaville. Un sourire, c\'est déjà une livraison réussie. Solutions de livraison rapides et fiables.',
                keywords: 'livraison, express, brazzaville, oncle g, delivery, congo, service, rapide, fiable, moto, course',
                image: './img/Oncle%20G%20-%20Logo.png'
            },
            'pro-g.html': {
                title: 'G-PRO Illimité - Oncle G | Livraison Sans Contrainte',
                description: 'G-PRO Illimité par ONCLE G Livraisons - Moto et livreur dédiés pour les professionnels. Carburant, maintenance, remplacement et suivi inclus.',
                keywords: 'g-pro, illimité, oncle g, livraison professionnelle, moto dédiée, service livraison, professionnel, brazzaville',
                image: '../img/Oncle%20G%20-%20Logo.png'
            },
            'G-PROMarketing.html': {
                title: 'G-PRO E-Commerce - Oncle G | Zéro Stock, Zéro Charge',
                description: 'Solution clé en main G-PRO E-Commerce par ONCLE G Livraisons. Vendez sans gérer la logistique. Nous prenons en charge stock, vente et distribution.',
                keywords: 'g-pro, e-commerce, zero stock, oncle g, solution logistique, vente en ligne, distribution, brazzaville',
                image: '../img/Oncle%20G%20-%20Logo.png'
            },
            'ConciergerieExpress.html': {
                title: 'Conciergerie Express - Oncle G | Services Sur Mesure',
                description: 'Service de conciergerie express par ONCLE G Livraisons. Tâches quotidiennes prises en charge par nos experts. Gain de temps garanti.',
                keywords: 'conciergerie, express, oncle g, services, tâches quotidiennes, gain de temps, brazzaville',
                image: '../img/Oncle%20G%20-%20Logo.png'
            },
            'Allô\'Gaz.html': {
                title: 'Allô\'Gaz - Oncle G | Livraison de Gaz à Domicile',
                description: 'Service de livraison de gaz à domicile par ONCLE G Livraisons. Commandez en un geste, recevez rapidement. Sécurité et fiabilité garanties.',
                keywords: 'allô\'gaz, livraison gaz, domicile, oncle g, commande facile, sécurité, brazzaville',
                image: '../img/Oncle%20G%20-%20Logo.png'
            },
            'Allô’Gaz.html': {
                title: 'Allô\'Gaz - Oncle G | Livraison de Gaz à Domicile',
                description: 'Service de livraison de gaz à domicile par ONCLE G Livraisons. Commandez en un geste, recevez rapidement. Sécurité et fiabilité garanties.',
                keywords: 'allô\'gaz, livraison gaz, domicile, oncle g, commande facile, sécurité, brazzaville',
                image: '../img/Oncle%20G%20-%20Logo.png'
            }
        };

        // Default page info if specific page not found
        const defaultInfo = {
            title: 'Oncle G - Livraisons Express | Service de Livraison à Brazzaville',
            description: 'ONCLE G Livraisons - Service de livraison express à Brazzaville. Un sourire, c\'est déjà une livraison réussie.',
            keywords: 'livraison, express, brazzaville, oncle g, delivery, congo',
            image: './img/Oncle%20G%20-%20Logo.png'
        };

        return pages[pathname] || defaultInfo;
    }

    // Enhance page structure for SEO
    enhancePageStructure() {
        // Add schema markup
        this.addSchemaMarkup();

        // Enhance headings structure
        this.enhanceHeadings();
    }

    // Add JSON-LD schema markup
    addSchemaMarkup() {
        const pathname = window.location.pathname.split('/').pop() || 'index.html';
        const pageInfo = this.getPageInfo(pathname);
        
        const schema = {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "ONCLE G Livraisons",
            "image": window.location.origin + "/" + (pageInfo.image || './img/Oncle%20G%20-%20Logo.png').replace('../', ''),
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
            "serviceType": this.getServiceTypeByPage(pathname),
            "description": pageInfo.description
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
    }

    // Determine service type based on page
    getServiceTypeByPage(pathname) {
        if (pathname.includes('pro-g')) return "Professional Delivery Service";
        if (pathname.includes('G-PROMarketing')) return "E-commerce Logistics Service";
        if (pathname.includes('Conciergerie')) return "Concierge Service";
        if (pathname.includes('Gaz')) return "Gas Delivery Service";
        return "Delivery Service";
    }

    // Enhance heading structure
    enhanceHeadings() {
        // Ensure proper heading hierarchy exists
        const mainHeading = document.querySelector('h1');
        if (mainHeading) {
            mainHeading.setAttribute('itemprop', 'headline');
        }
        
        // Add schema markup to main content if it exists
        const mainContent = document.querySelector('main') || document.querySelector('section');
        if (mainContent) {
            mainContent.setAttribute('itemprop', 'mainContentOfPage');
        }
    }
}

// Initialize SEO enhancer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize SEO enhancer
    const seoEnhancer = new SEOEnhancer();
});