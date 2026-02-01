document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('premiumPopup');
    const closePopupX = document.getElementById('closePopupX'); // The X button
    const exploreBtn = document.getElementById('exploreButton'); // The "Explorer Maintenant" button

    // Check if popup has been shown before
    const hasSeenPopup = localStorage.getItem('hasSeenPremiumPopup');

    // Show popup if user hasn't seen it before
    if (!hasSeenPopup) {
        // Small delay to ensure page loads first
        setTimeout(() => {
            popup.classList.remove('hidden');
            // Trigger the animation
            setTimeout(() => {
                const popupContent = popup.querySelector('.popup-content');
                popupContent.classList.add('popup-show');
                popupContent.style.transform = 'scale(1)';
                popupContent.style.opacity = '1';
            }, 50);
        }, 500);

        // Mark as seen in localStorage
        localStorage.setItem('hasSeenPremiumPopup', 'true');
    }

    // Close popup functions
    function closePopup() {
        const popupContent = popup.querySelector('.popup-content');
        popupContent.classList.remove('popup-show');
        popupContent.style.transform = 'scale(0.9)';
        popupContent.style.opacity = '0';

        // Hide the popup after animation completes
        setTimeout(() => {
            popup.classList.add('hidden');
        }, 500);
    }

    // Event listeners
    if (closePopupX) closePopupX.addEventListener('click', closePopup); // X button closes popup
    if (exploreBtn) exploreBtn.addEventListener('click', closePopup); // "Explorer Maintenant" button closes popup

    // Also close if user clicks outside the popup content
    if (popup) {
        popup.addEventListener('click', function(e) {
            if (e.target === popup) {
                closePopup();
            }
        });
    }

    // Slide-in menu functionality
    const menuOverlay = document.getElementById('menuOverlay');
    const menuTriggerBtn = document.getElementById('menuTriggerBtn');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const menuLinks = menuOverlay ? menuOverlay.querySelectorAll('a') : [];

    // Toggle Menu
    function toggleMenu() {
        const isOpen = menuOverlay.classList.contains('menu-open');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const menuTriggerBtn = document.getElementById('menuTriggerBtn');

        if (isOpen) {
            menuOverlay.classList.replace('menu-open', 'menu-closed');
            document.body.style.overflow = 'auto';
            // Show the mobile menu icon when menu is closed
            if (mobileMenuBtn) {
                mobileMenuBtn.classList.remove('hidden');
            }
            // Show the desktop menu trigger when menu is closed (uniquement sur PC)
            if (menuTriggerBtn && window.innerWidth >= 768) {
                menuTriggerBtn.classList.remove('hidden');
            }
        } else {
            menuOverlay.classList.replace('menu-closed', 'menu-open');
            document.body.style.overflow = 'hidden';
            // Hide the mobile menu icon when menu is open (it's already hidden on desktop anyway)
            if (mobileMenuBtn) {
                mobileMenuBtn.classList.add('hidden');
            }
            // Hide the desktop menu trigger when menu is open
            if (menuTriggerBtn) {
                menuTriggerBtn.classList.add('hidden');
            }
        }
    }

    // Event listeners for opening the menu
    if (menuTriggerBtn) {
        menuTriggerBtn.addEventListener('click', toggleMenu);
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMenu);
    }

    // Event listener for closing the menu
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', toggleMenu);
    }

    // Close menu when clicking on a link
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuOverlay.classList.replace('menu-open', 'menu-closed');
            document.body.style.overflow = 'auto';
        });
    });

    // Close menu when clicking outside the menu content
    if (menuOverlay) {
        menuOverlay.addEventListener('click', function(e) {
            if (e.target === menuOverlay) {
                menuOverlay.classList.replace('menu-open', 'menu-closed');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Popup simple (id closePopup)
    const closePopupBtn = document.getElementById('closePopup');
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', function() {
            const popupSimple = document.getElementById('popup');
            if (popupSimple) {
                popupSimple.style.display = 'none';
            }
        });
    }

    // Barres d'animation aléatoires
    const bars = document.querySelectorAll('.bar-anim');
    bars.forEach((bar) => {
        const randomDelay = Math.random() * 2;
        const randomDuration = 2.5 + Math.random() * 1.5;
        bar.style.animationDelay = `-${randomDelay}s`;
        bar.style.animationDuration = `${randomDuration}s`;
    });
});

function scrollSlider() {
    const slider = document.getElementById('slider');
    if (slider) {
        const card = slider.querySelector('.flex-shrink-0');
        if (card) {
            const cardWidth = card.offsetWidth;
            slider.scrollBy({
                left: cardWidth * 1.2,
                behavior: 'smooth'
            });
        } else {
            slider.scrollBy({
                left: 800,
                behavior: 'smooth'
            });
        }
    }
}
