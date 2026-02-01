// Miscellaneous Scripts - Scroll, animations, and other utilities

// Scroll to Top Button Script
document.addEventListener('DOMContentLoaded', () => {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    
    // Show/hide button based on scroll position
    function toggleScrollButton() {
        if (scrollToTopBtn) {
            if (window.scrollY > 500) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }
    }

    // Scroll to top function
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Event listeners
    window.addEventListener('scroll', toggleScrollButton);

    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', scrollToTop);
    }

    // Initial check
    toggleScrollButton();
});

// Menu Script
document.addEventListener('DOMContentLoaded', () => {
    const menuOverlay = document.getElementById('menuOverlay');
    const menuTriggerBtn = document.getElementById('menuTriggerBtn');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');

    // Open menu
    function openMenu() {
        if (menuOverlay) {
            menuOverlay.classList.remove('menu-closed');
            menuOverlay.classList.add('menu-open');
            document.body.style.overflow = 'hidden';
        }
    }

    // Close menu
    function closeMenu() {
        if (menuOverlay) {
            menuOverlay.classList.remove('menu-open');
            menuOverlay.classList.add('menu-closed');
            document.body.style.overflow = '';
        }
    }

    // Event listeners
    if (menuTriggerBtn) {
        menuTriggerBtn.addEventListener('click', openMenu);
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', openMenu);
    }

    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', closeMenu);
    }

    // Close menu when clicking outside
    if (menuOverlay) {
        menuOverlay.addEventListener('click', (e) => {
            if (e.target === menuOverlay) {
                closeMenu();
            }
        });
    }

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });
});

// Fluid animations for bars
document.addEventListener('DOMContentLoaded', () => {
    // Sélectionne toutes les barres
    const bars = document.querySelectorAll('.bar-anim');

    bars.forEach((bar) => {
        // Génère un délai aléatoire entre 0s et 2s
        // Cela crée l'effet "vague" naturel où rien ne bouge en même temps
        const randomDelay = Math.random() * 2;

        // Génère une durée légèrement variable (entre 2.5s et 4s)
        // Pour que certaines barres respirent plus vite que d'autres
        const randomDuration = 2.5 + Math.random() * 1.5;

        // Applique les styles dynamiques
        bar.style.animationDelay = `-${randomDelay}s`; // Délai négatif pour que l'anim commence déjà en cours
        bar.style.animationDuration = `${randomDuration}s`;
    });
});

// Slider navigation function
function scrollSlider() {
    const slider = document.getElementById('slider');
    if (slider) {
        slider.scrollBy({
            left: 300,
            behavior: 'smooth'
        });
    }
}

// Year update for footer
document.addEventListener('DOMContentLoaded', () => {
    const yearElements = document.querySelectorAll('script[src*="getFullYear"]');
    // Note: The year update is typically done inline, but we can add it here if needed
    const yearSpans = document.querySelectorAll('[data-current-year]');
    yearSpans.forEach(span => {
        span.textContent = new Date().getFullYear();
    });
});