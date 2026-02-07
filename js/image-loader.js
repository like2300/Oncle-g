// Image Loader Script - Optimized for WebP images
class ImageLoader {
    constructor() {
        this.imageCache = new Map();
        this.criticalImages = [];
        this.init();
    }

    init() {
        // Identify and preload critical images
        this.preloadCriticalImages();

        // Initialize eager loading for visible images
        this.loadVisibleImages();

        // Initialize lazy loading for other images
        this.initLazyLoading();

        // Add intersection observer for background images
        this.initBackgroundImageLoading();
    }

    // Preload critical images that are above the fold
    preloadCriticalImages() {
        const criticalImageUrls = [
            './img/freepik__ultrarealistic-advertising-photography-captured-by__31974.webp',
            './img/freepik__ultrarealistic-advertising-photography-captured-by__31973.webp',
            './img/freepik__ultrarealistic-advertising-photography-captured-by__31972.webp'
        ];

        criticalImageUrls.forEach(url => {
            this.preloadImage(url);
        });
    }

    // Load images that are already visible in the viewport
    loadVisibleImages() {
        // Find all images with data-src attribute that are currently in viewport
        const allDataImages = document.querySelectorAll('img[data-src]');
        allDataImages.forEach(img => {
            if (this.isElementInViewport(img)) {
                const src = img.dataset.src;

                this.preloadImage(src)
                    .then(loadedImg => {
                        img.src = loadedImg.src;
                        img.dataset.loaded = 'true';
                        img.classList.remove('blur-up');
                        img.classList.add('loaded');
                    })
                    .catch(error => {
                        console.error('Error loading visible image:', error);
                    });
            }
        });
    }

    // Helper function to determine if an element is in the viewport
    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Preload a single image
    preloadImage(src) {
        if (this.imageCache.has(src)) {
            return this.imageCache.get(src);
        }

        return new Promise((resolve, reject) => {
            const img = new Image();
            
            // Add to cache
            this.imageCache.set(src, img);
            
            img.onload = () => resolve(img);
            img.onerror = () => {
                console.warn(`Failed to load image: ${src}`);
                // Try fallback to JPEG if WebP fails
                const fallbackSrc = src.replace(/\.webp$/, '.jpeg');
                if (fallbackSrc !== src) {
                    img.src = fallbackSrc;
                } else {
                    reject(new Error(`Failed to load image: ${src}`));
                }
            };
            
            // Set crossOrigin attribute for CDN resources
            if (src.startsWith('http')) {
                img.crossOrigin = 'anonymous';
            }
            
            img.src = src;
        });
    }

    // Initialize lazy loading for images below the fold
    initLazyLoading() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;

                    // Load the image if it hasn't been loaded yet
                    if (!img.dataset.loaded) {
                        const src = img.dataset.src || img.src;

                        this.preloadImage(src)
                            .then(loadedImg => {
                                // Only update src if it's a data-src (lazy loaded)
                                if (img.dataset.src) {
                                    img.src = loadedImg.src;
                                }
                                img.dataset.loaded = 'true';

                                // Remove the blur effect if present
                                img.classList.remove('blur-up');
                                img.classList.add('loaded');

                                // Stop observing this image
                                observer.unobserve(img);
                            })
                            .catch(error => {
                                console.error('Error loading image:', error);
                                // Stop observing this image even if there was an error
                                observer.unobserve(img);
                            });
                    }
                }
            });
        }, {
            rootMargin: '50px' // Start loading when 50px before entering viewport
        });

        // Find all images with data-src attribute
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // Initialize lazy loading for background images
    initBackgroundImageLoading() {
        const bgImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Load the background image if it hasn't been loaded yet
                    if (!element.dataset.bgLoaded) {
                        const bgImageUrl = element.dataset.bgSrc;
                        
                        this.preloadImage(bgImageUrl)
                            .then(loadedImg => {
                                element.style.backgroundImage = `url('${loadedImg.src}')`;
                                element.dataset.bgLoaded = 'true';
                                
                                // Remove loading class if present
                                element.classList.remove('bg-loading');
                                element.classList.add('bg-loaded');
                                
                                // Stop observing this element
                                observer.unobserve(element);
                            })
                            .catch(error => {
                                console.error('Error loading background image:', error);
                                // Stop observing this element even if there was an error
                                observer.unobserve(element);
                            });
                    }
                }
            });
        }, {
            rootMargin: '50px' // Start loading when 50px before entering viewport
        });

        // Find all elements with data-bg-src attribute
        const lazyBgElements = document.querySelectorAll('[data-bg-src]');
        lazyBgElements.forEach(el => bgImageObserver.observe(el));
    }

    // Method to load all remaining images (for cases where user scrolls quickly)
    loadAllImages() {
        const unloadedImages = document.querySelectorAll('img[data-src]:not([data-loaded])');
        const unloadedBgElements = document.querySelectorAll('[data-bg-src]:not([data-bg-loaded])');
        
        [...unloadedImages, ...unloadedBgElements].forEach(element => {
            if (element.tagName === 'IMG') {
                const src = element.dataset.src;
                this.preloadImage(src)
                    .then(loadedImg => {
                        element.src = loadedImg.src;
                        element.dataset.loaded = 'true';
                        element.classList.remove('blur-up');
                        element.classList.add('loaded');
                    });
            } else {
                const bgSrc = element.dataset.bgSrc;
                this.preloadImage(bgSrc)
                    .then(loadedImg => {
                        element.style.backgroundImage = `url('${loadedImg.src}')`;
                        element.dataset.bgLoaded = 'true';
                        element.classList.remove('bg-loading');
                        element.classList.add('bg-loaded');
                    });
            }
        });
    }
}

// Initialize the image loader when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.imageLoader = new ImageLoader();
    
    // Also add a scroll listener to load all images if user scrolls rapidly
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // After scroll stops for 1 second, load all remaining images
            window.imageLoader.loadAllImages();
        }, 1000);
    }, { passive: true });
});

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageLoader;
}