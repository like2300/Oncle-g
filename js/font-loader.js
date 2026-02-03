/**
 * Advanced Font Loading System
 * Ensures Halcom font loads reliably across all browsers and devices
 */

// Check if the font is already loaded
function isFontLoaded(fontFamily) {
    const testText = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set a default font to measure
    ctx.font = '72px monospace';
    const defaultWidth = ctx.measureText(testText).width;
    
    // Set the test font to measure
    ctx.font = `72px "${fontFamily}", monospace`;
    const customWidth = ctx.measureText(testText).width;
    
    // If widths are different, the font is loaded
    return defaultWidth !== customWidth;
}

// Force font loading by creating temporary elements with the font
function forceFontLoad() {
    // Ensure document.body exists before trying to append to it
    if (!document.body) {
        console.warn('Document body not available yet, deferring font loading...');
        setTimeout(forceFontLoad, 100);
        return;
    }

    // Create a temporary element to force font rendering
    const fontTester = document.createElement('div');
    fontTester.style.position = 'absolute';
    fontTester.style.left = '-9999px';
    fontTester.style.top = '-9999px';
    fontTester.style.visibility = 'hidden';
    fontTester.style.fontFamily = 'Halcom, sans-serif';
    fontTester.style.fontSize = '72px';
    fontTester.innerHTML = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    document.body.appendChild(fontTester);

    // Force reflow to trigger font loading
    void fontTester.offsetWidth;

    // Remove after a short delay
    setTimeout(() => {
        if (document.body && document.body.contains(fontTester)) {
            document.body.removeChild(fontTester);
        }
    }, 100);
}

// Font loading with Web Font Loader approach (custom implementation)
function loadCustomFonts() {
    // First, try to detect if the font is already available
    if (isFontLoaded('Halcom')) {
        console.log('Halcom font already loaded');
        applyFontGlobally();
        return;
    }

    // Force font loading
    forceFontLoad();

    // Wait for font to load with timeout
    const maxWaitTime = 5000; // 5 seconds
    const startTime = Date.now();

    const checkFontInterval = setInterval(() => {
        if (isFontLoaded('Halcom') || Date.now() - startTime > maxWaitTime) {
            clearInterval(checkFontInterval);

            if (isFontLoaded('Halcom')) {
                console.log('Halcom font loaded successfully');
                applyFontGlobally();
            } else {
                console.warn('Halcom font failed to load, using fallback');
                applyFallbackFont();
            }
        }
    }, 50);
}

// Apply font to all elements
function applyFontGlobally() {
    // Add a class to body to indicate fonts are loaded (with safety check)
    if (document.body) {
        document.body.classList.add('font-loaded');
        document.body.classList.remove('font-loading');
    }

    // Apply font to all elements using CSS
    const styleElement = document.createElement('style');
    styleElement.id = 'halcom-global-font-styles';
    styleElement.textContent = `
        *, *::before, *::after {
            font-family: 'Halcom', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
        }

        body {
            font-family: 'Halcom', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
        }

        input, textarea, select, button {
            font-family: 'Halcom', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
        }
    `;

    document.head.appendChild(styleElement);
}

// Apply fallback font if primary font fails
function applyFallbackFont() {
    const styleElement = document.createElement('style');
    styleElement.id = 'halcom-fallback-font-styles';
    styleElement.textContent = `
        *, *::before, *::after {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
        }

        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
        }

        input, textarea, select, button {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
        }
    `;

    document.head.appendChild(styleElement);

    // Also update body class if document.body exists
    if (document.body) {
        document.body.classList.add('font-error');
        document.body.classList.remove('font-loading');
    }
}

// Initialize font loading when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Add loading class to body initially (with safety check)
    if (document.body) {
        document.body.classList.add('font-loading');
    } else {
        // If body isn't ready yet, wait for it
        const waitForBody = setInterval(() => {
            if (document.body) {
                document.body.classList.add('font-loading');
                clearInterval(waitForBody);
                setTimeout(loadCustomFonts, 100);
            }
        }, 50);
        return; // Don't call loadCustomFonts immediately if body isn't ready
    }

    // Load fonts with a slight delay to ensure CSS is processed
    setTimeout(loadCustomFonts, 100);
});

// Also try to load fonts on window load for additional reliability
window.addEventListener('load', function() {
    if (!isFontLoaded('Halcom')) {
        loadCustomFonts();
    }
});

// Additional font loading strategy using FontFaceSet API if available
function advancedFontLoading() {
    if ('fonts' in document) {
        // Wait for all fonts to load
        document.fonts.ready.then(() => {
            console.log('All fonts loaded via FontFaceSet API');
        }).catch(err => {
            console.warn('Font loading failed via FontFaceSet API:', err);
        });
    }
}

// Call advanced loading if fonts API is available
if ('fonts' in document) {
    setTimeout(advancedFontLoading, 200);
}

// Monitor for dynamic content that might need font application
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) { // Element node
                // Reapply font styles to ensure dynamic content uses the font
                const styleSheets = document.querySelectorAll('#halcom-global-font-styles, #halcom-fallback-font-styles');
                if (styleSheets.length === 0) {
                    // Reapply global font styles if they don't exist
                    if (isFontLoaded('Halcom')) {
                        applyFontGlobally();
                    } else {
                        applyFallbackFont();
                    }
                }
            }
        });
    });
});

// Observe the entire document for changes
observer.observe(document, {
    childList: true,
    subtree: true
});