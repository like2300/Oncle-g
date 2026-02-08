#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Fonction pour générer le sitemap
function generateSitemap() {
    const domain = 'https://www.oncleg.com';
    const urls = [];
    
    // Fonction récursive pour parcourir tous les fichiers HTML
    function scanDirectory(dirPath, relativePath = '') {
        const items = fs.readdirSync(dirPath);
        
        for (const item of items) {
            const fullPath = path.join(dirPath, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                // Ignorer les dossiers système
                if (item !== 'node_modules' && !item.startsWith('.')) {
                    scanDirectory(fullPath, path.join(relativePath, item));
                }
            } else if (item.endsWith('.html')) {
                let urlPath = path.join('/', relativePath, item);
                urlPath = urlPath.replace(/\\/g, '/'); // Convertir les antislashs en slashs
                
                // Ne pas inclure les fichiers d'index multiples
                if (!(urlPath.includes('index.html') && urlPath !== '/index.html')) {
                    urls.push({
                        loc: domain + urlPath,
                        lastmod: new Date(stat.mtime).toISOString().split('T')[0],
                        changefreq: getUrlChangeFreq(urlPath),
                        priority: getUrlPriority(urlPath)
                    });
                }
            }
        }
    }
    
    // Fonction pour déterminer la fréquence de changement
    function getUrlChangeFreq(urlPath) {
        if (urlPath === '/index.html') return 'daily';
        if (urlPath.includes('/pages/')) return 'weekly';
        if (urlPath.includes('/oncle-g/') || urlPath.includes('/a-propos') || urlPath.includes('/contacts')) return 'monthly';
        return 'weekly';
    }
    
    // Fonction pour déterminer la priorité
    function getUrlPriority(urlPath) {
        if (urlPath === '/index.html') return '1.0';
        if (urlPath.includes('/oncle-g/')) return '0.9';
        if (urlPath.includes('/pages/')) return '0.8';
        return '0.7';
    }
    
    // Parcourir le répertoire racine
    scanDirectory('/Users/omerlinks/Documents/carousel');

    // Générer le XML du sitemap
    let sitemapXml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemapXml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    urls.forEach(url => {
        sitemapXml += '  <url>\n';
        sitemapXml += `    <loc>${url.loc}</loc>\n`;
        sitemapXml += `    <lastmod>${url.lastmod}</lastmod>\n`;
        sitemapXml += `    <changefreq>${url.changefreq}</changefreq>\n`;
        sitemapXml += `    <priority>${url.priority}</priority>\n`;
        sitemapXml += '  </url>\n';
    });

    sitemapXml += '</urlset>';

    // Écrire le fichier sitemap
    fs.writeFileSync('/Users/omerlinks/Documents/carousel/sitemap.xml', sitemapXml);
    console.log(`Sitemap généré avec ${urls.length} URLs`);
}

generateSitemap();