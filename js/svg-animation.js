// SVG Scroll Animation Script
document.addEventListener('DOMContentLoaded', function() {
    // Select the SVG container that should trigger animation on scroll
    const svgContainer = document.querySelector('.svg-wave-animation');

    // Options for the Intersection Observer
    const options = {
        threshold: 0.5, // Trigger when 50% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Adjust when to trigger
    };

    // Create an Intersection Observer
    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // When the SVG container is in view, trigger the animation
                animateSVGOnScroll(entry.target);
                // Stop observing this element since animation is triggered
                observer.unobserve(entry.target);
            }
        });
    }, options);

    // Observe the SVG container
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

            // Check if the element is in the viewport (with some offset)
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
});

function animateSVGOnScroll(svgElement) {
    // For the wave SVG, we need to restart the animations
    // Get all the animateTransform elements inside the SVG
    const animateElements = svgElement.querySelectorAll('animateTransform');

    // Restart each animation by resetting their begin time
    animateElements.forEach(animateElem => {
        // Get the original begin value to reset it
        const originalBegin = animateElem.getAttribute('begin');

        // Temporarily set begin to 0 to restart the animation
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
        // Force a reflow to restart the animation
        void element.offsetWidth;
        element.classList.add('animate-pulse');
    });

    console.log("SVG wave animation triggered on scroll!");
}