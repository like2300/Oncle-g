/**
 * Site Optimization Script
 * Optimizes loading speed and SEO for Oncle G website
 */

// Optimized resource loading with priority management
class ResourceOptimizer {
    constructor() {
        this.criticalResources = [];
        this.nonCriticalResources = [];
    }

    // Preload critical resources
    preloadCriticalResources() {
        // Preload critical CSS
        this.preloadResource('./css/main.css', 'style');
        this.preloadResource('./css/loader.css', 'style');

        // Preload critical images
        this.preloadResource('./img/Oncle-G-Logo-1-2-Playful.json', 'fetch');
        this.preloadResource('./img/Oncle G - Logo.min.svg', 'image');

        // Preload background images
        this.preloadResource('./img/freepik__ultrarealistic-advertising-photography-captured-by__31974.webp', 'image');
        this.preloadResource('./img/freepik__ultrarealistic-advertising-photography-captured-by__31973.webp', 'image');
        this.preloadResource('./img/freepik__ultrarealistic-advertising-photography-captured-by__31972.webp', 'image');
    }

    // Preload a specific resource
    preloadResource(url, as) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = url;
        link.as = as;
        if (as === 'image') {
            link.fetchPriority = 'high';
        }
        document.head.appendChild(link);
    }

    // Lazy load non-critical resources
    lazyLoadNonCriticalResources() {
        // Defer non-critical JavaScript
        const scripts = [
            './js/animations.js',
            './js/cardstack.js',
            './js/popup.js',
            './js/misc.js',
            './js/menu.js',
            './js/carousel.js',
            './js/scroll.js'
        ];

        scripts.forEach(script => {
            this.loadScript(script, true);
        });
    }

    // Load script dynamically
    loadScript(src, defer = false) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            if (defer) script.defer = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Optimize image loading
    optimizeImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

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

// Performance optimizer
class PerformanceOptimizer {
    constructor() {
        this.optimizeFonts();
        this.optimizeCSS();
        this.implementCaching();
        this.optimizeAnimations();
    }

    // Optimize font loading
    optimizeFonts() {
        // Preload critical fonts
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.href = './fonts.css'; // Your font CSS file
        fontLink.as = 'style';
        document.head.appendChild(fontLink);
    }

    // Optimize CSS loading
    optimizeCSS() {
        // Critical CSS should be inlined, non-critical should be loaded asynchronously
        const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
        cssLinks.forEach(link => {
            if (!this.isCriticalCSS(link.href)) {
                this.loadCSSAsync(link.href);
                // Don't remove the link since the shell script handles this differently
            }
        });
    }

    // Check if CSS is critical
    isCriticalCSS(href) {
        return href.includes('main.css') || href.includes('loader.css');
    }

    // Load CSS asynchronously
    loadCSSAsync(href) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.media = 'print';
        link.onload = function() { this.media = 'all'; };
        document.head.appendChild(link);
    }

    // Optimize animations for performance
    optimizeAnimations() {
        // Reduce animation complexity on low-end devices
        if ('connection' in navigator) {
            const conn = navigator.connection;
            if (conn.effectiveType.includes('slow') || conn.downlink < 1) {
                document.body.classList.add('low-performance-mode');
            }
        }
    }

    // Implement caching strategies
    implementCaching() {
        // Store frequently accessed elements
        this.cacheElements();
    }

    // Cache DOM elements
    cacheElements() {
        this.elements = {
            loader: document.getElementById('loader-overlay'),
            body: document.body
        };
    }
}

// Initialize optimizations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize performance optimizer
    const perfOptimizer = new PerformanceOptimizer();

    // Initialize resource optimizer
    const resourceOptimizer = new ResourceOptimizer();
    resourceOptimizer.preloadCriticalResources();

    // Initialize SEO enhancer
    const seoEnhancer = new SEOEnhancer();

    // After initial load, lazy load non-critical resources
    window.addEventListener('load', () => {
        resourceOptimizer.lazyLoadNonCriticalResources();
    });
});

// Export classes for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ResourceOptimizer, SEOEnhancer, PerformanceOptimizer };
}