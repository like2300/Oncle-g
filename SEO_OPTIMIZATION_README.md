# Oncle G Website Optimization

This project contains optimizations for the Oncle G website to improve loading speed and SEO.

## Files Created

### 1. `/scripts/optimize-loading.js`
A JavaScript file that implements various performance optimizations:
- Resource preloading for critical assets
- Lazy loading for non-critical resources
- Dynamic script loading
- SEO enhancement through dynamic meta tag updates
- Schema markup injection
- Performance optimizations based on device capabilities

### 2. `/scripts/update-seo.sh`
A shell script that updates all HTML pages with:
- Enhanced SEO meta tags
- Improved title tags
- Better descriptions and keywords
- Open Graph and Twitter Card tags
- Performance-focused resource loading attributes

## Optimizations Implemented

### Performance Optimizations
- **Resource Preloading**: Critical CSS and images are preloaded to reduce loading times
- **Asynchronous CSS Loading**: Non-critical CSS is loaded asynchronously to prevent render blocking
- **Lazy Loading**: Non-critical JavaScript is loaded after the main content
- **Font Optimization**: Fonts are preloaded to prevent layout shifts
- **Image Optimization**: Images are prepared for lazy loading with intersection observers

### SEO Optimizations
- **Page-Specific Titles**: Each page now has a unique, descriptive title
- **Meta Descriptions**: Detailed, relevant descriptions for each page
- **Keywords**: Relevant keywords for each page topic
- **Open Graph Tags**: Proper social media sharing metadata
- **Twitter Cards**: Optimized for Twitter sharing
- **Schema Markup**: LocalBusiness schema for better search engine understanding
- **Structured Data**: Proper heading hierarchy and semantic HTML

### Specific Pages Updated
- `index.html` - Main landing page
- `pages/oncle-g/pro-g.html` - G-PRO Illimité service page
- `pages/oncle-g/G-PROMarketing.html` - G-PRO E-Commerce service page
- `pages/oncle-g/ConciergerieExpress.html` - Conciergerie service page
- `pages/oncle-g/Allô'Gaz.html` - Gas delivery service page
- `pages/oncle-g/Allô’Gaz.html` - Alternative gas delivery page

## How to Use

1. The shell script has already been run and updated all HTML files
2. The JavaScript file is loaded on all pages via the updated HTML
3. No additional configuration is needed

## Benefits

- **Faster Loading Times**: Critical resources load first, improving perceived performance
- **Better Search Rankings**: Enhanced SEO elements help with search engine visibility
- **Improved Social Sharing**: Proper Open Graph and Twitter Card tags
- **Better Accessibility**: Semantic HTML and proper heading structure
- **Mobile Optimization**: Responsive design considerations maintained

## Notes

- Backups of the original HTML files were created with the `.backup` extension
- The optimization script dynamically adjusts based on the current page
- Schema markup is customized per page to reflect the specific service offered