// SVG Scroll Animation Script
document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // ANIMATION FOR WAVE SVG (Footer)
    // ============================================
    
    // Select the SVG container that should trigger animation on scroll
    const svgContainer = document.querySelector('.svg-wave-animation');

    // Options for Intersection Observer
    const options = {
        threshold: 0.5, // Trigger when 50% of element is visible
        rootMargin: '0px 0px -50px 0px' // Adjust when to trigger
    };

    // Create an Intersection Observer
    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // When SVG container is in view, trigger animation
                animateSVGOnScroll(entry.target);
                // Stop observing this element since animation is triggered
                observer.unobserve(entry.target);
            }
        });
    }, options);

    // Observe SVG container
    if (svgContainer) {
        observer.observe(svgContainer);
    }

    // Alternative: Listen to scroll events for more granular control
    let hasAnimated = false;

    function checkAndAnimateSVG() {
        if (hasAnimated) return; // Prevent multiple animations

        const elements = document.querySelectorAll('.svg-wave-animation');

        if (elements.length > 0) {
            const rect = elements[0].getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Check if element is in viewport (with some offset)
            if (rect.top <= windowHeight * 0.75 && rect.bottom >= windowHeight * 0.25) {
                animateSVGOnScroll(elements[0]);
                hasAnimated = true;

                // Remove scroll listener after animation is triggered
                window.removeEventListener('scroll', checkAndAnimateSVG);
            }
        }
    }

    // Add scroll event listener as fallback
    window.addEventListener('scroll', checkAndAnimateSVG);

    // Also check on load in case element is already in view
    window.addEventListener('load', checkAndAnimateSVG);

    // ============================================
    // ANIMATION FOR A PROPOS SVG (Object loaded SVG)
    // ============================================
    
    // Wait for the object to load and then access its content
    const mapSvgObject = document.getElementById('map-svg');
    
    if (mapSvgObject) {
        mapSvgObject.addEventListener('load', function() {
            try {
                // Access the content document of the object
                const svgDoc = mapSvgObject.contentDocument || mapSvgObject.getSVGDocument();
                
                if (svgDoc) {
                    // Get the SVG element
                    const svgElement = svgDoc.getElementById('animatedSvg');
                    
                    if (svgElement) {
                        // Add CSS styles for animation
                        const style = svgDoc.createElement('style');
                        style.textContent = `
                            /* Configuration de base pour l'animation */
                            svg > g {
                                opacity: 0;
                                transition: opacity 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                                will-change: opacity;
                            }
                            
                            /* État "Visible" déclenché par le JS */
                            svg > g.is-visible {
                                opacity: 1;
                            }
                            
                            /* Animation Spéciale pour les lignes (chemins) */
                            svg path[stroke-dasharray] {
                                stroke-dasharray: 20, 20;
                                animation: dashScroll 30s linear infinite;
                                opacity: 0.6;
                            }
                            
                            @keyframes dashScroll {
                                to {
                                    stroke-dashoffset: -1000;
                                }
                            }
                        `;
                        svgDoc.head.appendChild(style);
                        
                        // Options de l'observateur
                        const observerOptions = {
                            root: null,
                            rootMargin: '0px',
                            threshold: 0.1
                        };
                        
                        // Création de l'observateur
                        const svgObserver = new IntersectionObserver((entries, observer) => {
                            entries.forEach(entry => {
                                if (entry.isIntersecting) {
                                    // Ajoute la classe CSS quand l'élément entre dans l'écran
                                    entry.target.classList.add('is-visible');
                                    // Optionnel : arrêter d'observer une fois animé
                                    observer.unobserve(entry.target);
                                }
                            });
                        }, observerOptions);
                        
                        // Cible uniquement les groupes de premier niveau du SVG
                        const svgGroups = svgElement.querySelectorAll('svg > g');
                        
                        svgGroups.forEach(group => {
                            svgObserver.observe(group);
                        });
                        
                        console.log('A PROPOS SVG animation initialized!');
                    }
                }
            } catch (error) {
                console.log('Could not access SVG content (cross-origin restriction):', error);
            }
        });
    }
});

function animateSVGOnScroll(svgElement) {
    // For wave SVG, we need to restart animations
    // Get all animateTransform elements inside SVG
    const animateElements = svgElement.querySelectorAll('animateTransform');

    // Restart each animation by resetting their begin time
    animateElements.forEach(animateElem => {
        // Get original begin value to reset it
        const originalBegin = animateElem.getAttribute('begin');

        // Temporarily set begin to 0 to restart animation
        animateElem.setAttribute('begin', '0s');

        // Reset to original value after a short delay
        setTimeout(() => {
            if (originalBegin) {
                animateElem.setAttribute('begin', originalBegin);
            } else {
                animateElem.removeAttribute('begin');
            }
        }, 10);
    });

    // Also trigger any CSS animations for .st14 elements
    const st14Elements = document.querySelectorAll('.st14');
    st14Elements.forEach(element => {
        // Remove animation class and re-add to trigger animation
        element.classList.remove('animate-pulse');
        // Force a reflow to restart animation
        void element.offsetWidth;
        element.classList.add('animate-pulse');
    });

    console.log("SVG wave animation triggered on scroll!");
}
