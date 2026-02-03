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
            document.body.style.overflow = 'visible';
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
