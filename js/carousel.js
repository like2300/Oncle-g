// Carousel Script
class Carousel {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 3;
        this.slideElements = [];
        this.dotElements = [];
        this.autoSlideInterval = null;

        this.init();
    }

    init() {
        this.slideElements = [
            document.getElementById('slide-1'),
            document.getElementById('slide-2'),
            document.getElementById('slide-3')
        ];
        this.dotElements = document.querySelectorAll('.dot[data-target]');
        this.addEventListeners();
        this.setActiveSlide(0);
        setTimeout(() => {
            this.startAutoSlide();
        }, 1000);
    }

    setActiveSlide(slideIndex) {
        if (slideIndex < 0 || slideIndex >= this.totalSlides) return;
        this.currentSlide = slideIndex;

        this.slideElements.forEach((slide, index) => {
            slide.style.transition = 'all 0.5s ease';
            const titleElement = slide.querySelector('h1.text-primary');
            const descriptionElement = slide.querySelector('.max-w-xs, .max-w-sm, .max-w-md');

            if (index === this.currentSlide) {
                slide.style.width = '100%';
                slide.style.top = '80px';
                slide.style.zIndex = '3';
                slide.style.display = 'block';

                if(titleElement) {
                    titleElement.classList.remove('opacity-0', 'scale-95');
                    titleElement.classList.add('opacity-100', 'scale-100');
                }
                if(descriptionElement) descriptionElement.classList.remove('hidden');

            } else if (index === this.currentSlide - 1 || (this.currentSlide === 0 && index === this.totalSlides - 1)) {
                slide.style.width = '82.5%';
                slide.style.top = '40px';
                slide.style.zIndex = '2';
                slide.style.display = 'block';

                if(titleElement) {
                    titleElement.classList.add('opacity-0', 'scale-95');
                    titleElement.classList.remove('opacity-100', 'scale-100');
                }
                if(descriptionElement) descriptionElement.classList.add('hidden');

            } else {
                slide.style.width = '65%';
                slide.style.top = '0px';
                slide.style.zIndex = '1';
                slide.style.display = 'block';

                if(titleElement) {
                    titleElement.classList.add('opacity-0', 'scale-95');
                    titleElement.classList.remove('opacity-100', 'scale-100');
                }
                if(descriptionElement) descriptionElement.classList.add('hidden');
            }
        });

        this.updateDots();
        this.updateCounter();
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
