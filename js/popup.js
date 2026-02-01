// Popup Script - Premium popup functionality
document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('premiumPopup');
    const closePopupX = document.getElementById('closePopupX');  // The X button
    const exploreBtn = document.getElementById('exploreButton');  // The "Explorer Maintenant" button

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
    closePopupX.addEventListener('click', closePopup);  // X button closes popup
    exploreBtn.addEventListener('click', closePopup);   // "Explorer Maintenant" button closes popup

    // Also close if user clicks outside the popup content
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            closePopup();
        }
    });
});