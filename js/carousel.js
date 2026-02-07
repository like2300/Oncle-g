// Carousel Script
class Carousel {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 4;
        this.slideElements = [];
        this.dotElements = [];
        this.autoSlideInterval = null;

        this.init();
    }

    init() {
        this.slideElements = [
            document.getElementById('slide-1'),
            document.getElementById('slide-2'),
            document.getElementById('slide-3'),
            document.getElementById('slide-4')
        ];
        this.dotElements = document.querySelectorAll('.dot[data-target]');
        this.addEventListeners();
        this.setActiveSlide(3); // Afficher le nouveau slide (slide 4) en premier par défaut
        setTimeout(() => {
            this.startAutoSlide();
        }, 1000);
    }

    setActiveSlide(slideIndex) {
        if (slideIndex < 0 || slideIndex >= this.totalSlides) return;
        this.currentSlide = slideIndex;

        // Use requestAnimationFrame for smoother transitions
        requestAnimationFrame(() => {
            this.slideElements.forEach((slide, index) => {
                slide.style.transition = 'all 0.5s ease';
                const titleElement = slide.querySelector('h1.text-primary');
                const descriptionElement = slide.querySelector('.max-w-xs, .max-w-sm, .max-w-md');

                if (index === this.currentSlide) {
                    slide.style.width = '100%';
                    slide.style.top = '80px';
                    slide.style.zIndex = '4'; // Updated z-index for 4 slides
                    slide.style.display = 'block';

                    // Load the background image if it hasn't been loaded yet
                    if (slide.dataset.bgSrc && !slide.dataset.bgLoaded) {
                        const bgImageUrl = slide.dataset.bgSrc;
                        // Apply the background image with the linear gradient
                        slide.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.55), rgba(63, 55, 0, 0.4)), url('${bgImageUrl}')`;
                        slide.dataset.bgLoaded = 'true';
                        slide.classList.remove('bg-loading');
                        slide.classList.add('bg-loaded');
                    }

                    if(titleElement) {
                        titleElement.classList.remove('opacity-0', 'scale-95');
                        titleElement.classList.add('opacity-100', 'scale-100');
                    }
                    if(descriptionElement) descriptionElement.classList.remove('hidden');

                } else if (index === this.currentSlide - 1 || (this.currentSlide === 0 && index === this.totalSlides - 1)) {
                    slide.style.width = '86.6%'; // Adjusted for 4 slides
                    slide.style.top = '53px'; // Adjusted for 4 slides
                    slide.style.zIndex = '3'; // Updated z-index for 4 slides
                    slide.style.display = 'block';

                    // Load the background image if it hasn't been loaded yet
                    if (slide.dataset.bgSrc && !slide.dataset.bgLoaded) {
                        let gradient = 'linear-gradient(rgba(0, 0, 0, 0.43), rgba(0, 0, 0, 0.4))';
                        if (index === 2) { // For slide 3
                           gradient = 'linear-gradient(rgba(0, 0, 0, 0.48), rgba(0, 0, 0, 0.4))';
                        }
                        const bgImageUrl = slide.dataset.bgSrc;
                        slide.style.backgroundImage = `${gradient}, url('${bgImageUrl}')`;
                        slide.dataset.bgLoaded = 'true';
                        slide.classList.remove('bg-loading');
                        slide.classList.add('bg-loaded');
                    }

                    if(titleElement) {
                        titleElement.classList.add('opacity-0', 'scale-95');
                        titleElement.classList.remove('opacity-100', 'scale-100');
                    }
                    if(descriptionElement) descriptionElement.classList.add('hidden');

                } else if (index === this.currentSlide - 2 || (this.currentSlide < 2 && index === (this.currentSlide + this.totalSlides - 2) % this.totalSlides)) {
                    slide.style.width = '73.3%'; // New width for 4 slides
                    slide.style.top = '26px'; // New position for 4 slides
                    slide.style.zIndex = '2'; // Updated z-index for 4 slides
                    slide.style.display = 'block';

                    // Load the background image if it hasn't been loaded yet
                    if (slide.dataset.bgSrc && !slide.dataset.bgLoaded) {
                        const bgImageUrl = slide.dataset.bgSrc;
                        slide.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.55), rgba(63, 55, 0, 0.4)), url('${bgImageUrl}')`;
                        slide.dataset.bgLoaded = 'true';
                        slide.classList.remove('bg-loading');
                        slide.classList.add('bg-loaded');
                    }

                    if(titleElement) {
                        titleElement.classList.add('opacity-0', 'scale-95');
                        titleElement.classList.remove('opacity-100', 'scale-100');
                    }
                    if(descriptionElement) descriptionElement.classList.add('hidden');

                } else {
                    slide.style.width = '60%'; // New width for back slide in 4 slides
                    slide.style.top = '0px';
                    slide.style.zIndex = '1';
                    slide.style.display = 'block';

                    // Load the background image if it hasn't been loaded yet
                    if (slide.dataset.bgSrc && !slide.dataset.bgLoaded) {
                        const bgImageUrl = slide.dataset.bgSrc;
                        slide.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.55), rgba(63, 55, 0, 0.4)), url('${bgImageUrl}')`;
                        slide.dataset.bgLoaded = 'true';
                        slide.classList.remove('bg-loading');
                        slide.classList.add('bg-loaded');
                    }

                    if(titleElement) {
                        titleElement.classList.add('opacity-0', 'scale-95');
                        titleElement.classList.remove('opacity-100', 'scale-100');
                    }
                    if(descriptionElement) descriptionElement.classList.add('hidden');
                }
            });

            this.updateDots();
            this.updateCounter();
        });
    }

    updateDots() {
        this.dotElements.forEach(dot => {
            const targetIndex = parseInt(dot.getAttribute('data-target'));
            if (targetIndex === this.currentSlide) {
                dot.classList.remove('bg-transparent');
                dot.classList.add('bg-black', 'border-yellow-400');
            } else {
                dot.classList.remove('bg-black', 'border-yellow-400');
                dot.classList.add('bg-transparent');
            }
        });
    }

    updateCounter() {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            counter.textContent = `${this.currentSlide + 1}/${this.totalSlides}`;
        });
    }

    next() {
        this.pauseAutoSlide();
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.setActiveSlide(this.currentSlide);
        this.resumeAutoSlide();
    }

    prev() {
        this.pauseAutoSlide();
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.setActiveSlide(this.currentSlide);
        this.resumeAutoSlide();
    }

    goToSlide(targetIndex) {
        this.pauseAutoSlide();
        if (targetIndex >= 0 && targetIndex < this.totalSlides) {
            this.setActiveSlide(targetIndex);
        }
        this.resumeAutoSlide();
    }

    openOverlay(slideNumber) {
        const overlay = document.getElementById(`overlay-${slideNumber}`);
        if (overlay) {
            overlay.classList.remove('opacity-0', 'pointer-events-none');
            overlay.classList.add('opacity-100', 'pointer-events-auto');
            this.pauseAutoSlide();
        }
    }

    closeOverlay(slideNumber) {
        const overlay = document.getElementById(`overlay-${slideNumber}`);
        if (overlay) {
            overlay.classList.add('opacity-0', 'pointer-events-none');
            overlay.classList.remove('opacity-100', 'pointer-events-auto');
            this.resumeAutoSlide();
        }
    }

    startAutoSlide() {
        if (this.autoSlideInterval) clearInterval(this.autoSlideInterval);
        this.autoSlideInterval = setInterval(() => {
            const anyOverlayOpen = document.querySelector('.hover-overlay.opacity-100');
            if (!anyOverlayOpen) {
                this.next();
            }
        }, 8000);
    }

    pauseAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }

    resumeAutoSlide() {
        setTimeout(() => {
            if (!this.autoSlideInterval) {
                this.startAutoSlide();
            }
        }, 5000);
    }

    addEventListeners() {
        document.querySelectorAll('.arrow-btn-next').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.next();
            });
        });
        document.querySelectorAll('.arrow-btn-prev').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.prev();
            });
        });

        this.dotElements.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(dot.getAttribute('data-target'));
                this.goToSlide(index);
            });
        });
    }
}

let carouselInstance;

function toggleOverlay(slideNumber, open) {
    if (carouselInstance) {
        if (open) {
            carouselInstance.openOverlay(slideNumber);
        } else {
            carouselInstance.closeOverlay(slideNumber);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carouselInstance = new Carousel();
    window.carouselInstance = carouselInstance;
});
