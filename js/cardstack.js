// Card Stack Script - Alpine.js function for card carousel
function cardStack() {
    return {
        autoSlideInterval: null,

        init() {
            // Store the original order of cards to map positions correctly
            this.originalOrder = [...this.cards];
            // Reverse the initial order so the first card appears correctly
            this.cards.reverse();
            // Start auto-sliding after a delay to allow initial setup
            setTimeout(() => {
                this.startAutoSlide();
            }, 1000);
        },

        cards: [
            {
                id: 1,
                text: "Un sourire, c'est déjà une livraison réussi",
                description: "Avant même d'arriver à votre porte, ONCLE G Livraisons vous offre un sourire. Dans une ville au rythme effréné, ce sourire devient une certitude que votre quotidien sera allégé.",
                bg: "./img/freepik__ultrarealistic-advertising-photography-captured-by__31974.jpeg"
            },
            {
                id: 2,
                text: "Vos rues sont nos racines",
                description: "Né dans les ruelles de Brazzaville, de Poto-Poto à Bacongo, nous connaissons chaque détour. Plus qu'un service : c'est une déclaration d'amour à la ville.",
                bg: "./img/freepik__ultrarealistic-advertising-photography-captured-by__31972.jpeg"
            },
            {
                id: 3,
                text: "Moins de soucis, plus de vie",
                description: "Chaque minute compte. ONCLE G transforme vos besoins en instants de sérénité. Nous faisons le chemin pour vous, pour que vous profitiez pleinement de vos journées.",
                bg: "./img/freepik__ultrarealistic-advertising-photography-captured-by__31973.jpeg"
            }
        ],
        animatingNext: false,
        animatingPrev: false,

        get widths() {
            const count = this.cards.length;
            return Array.from({ length: count }, (_, i) => 65 + (i * (35 / (count - 1))));
        },

        get tops() {
            const count = this.cards.length;
            return Array.from({ length: count }, (_, i) => i * 40);
        },

        get activeIndex() {
            // Return the index of the currently active card (the one at the end of the array)
            // Since we're moving cards from end to front, the active card is always at index this.cards.length - 1
            // But we need to map this to the original position
            return this.originalOrder.findIndex(card => card.id === this.cards[this.cards.length - 1].id);
        },

        get totalSlides() {
            return this.cards.length;
        },

        getCardStyle(index) {
            // CORRECTION ICI : Ajout explicite de 'height: 100%' et 'background-size: cover'
            return `
                background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4)), url('${this.cards[index].bg}');
                width: ${this.widths[index]}%;
                top: ${this.tops[index]}px;
                height: 100%;
                background-size: cover;
                background-position: center;
                z-index: ${index + 1};
            `;
        },

        next() {
            // Pause auto-slide when user interacts
            this.pauseAutoSlide();

            if (this.animatingNext) return;
            this.animatingNext = true;

            setTimeout(() => {
                this.cards.unshift(this.cards.pop());
                this.$nextTick(() => {
                    this.animatingNext = false;

                    // Resume auto-slide after user interaction
                    this.resumeAutoSlide();
                });
            }, 300);
        },

        prev() {
            // Pause auto-slide when user interacts
            this.pauseAutoSlide();

            if (this.animatingPrev) return;
            this.animatingPrev = true;

            setTimeout(() => {
                this.cards.push(this.cards.shift());
                this.$nextTick(() => {
                    this.animatingPrev = false;

                    // Resume auto-slide after user interaction
                    this.resumeAutoSlide();
                });
            }, 300);
        },

        goToSlide(targetIndex) {
            // Pause auto-slide when user interacts
            this.pauseAutoSlide();

            // Find the card with the target index in the original order
            const targetCard = this.originalOrder[targetIndex];

            // Move the target card to the front by rotating the array
            while (this.cards[this.cards.length - 1].id !== targetCard.id) {
                this.cards.unshift(this.cards.pop());
            }

            // Resume auto-slide after user interaction
            this.resumeAutoSlide();
        },

        // Auto-slide functionality
        startAutoSlide() {
            // Clear any existing interval to prevent multiple intervals
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
            }

            // Set up new interval
            this.autoSlideInterval = setInterval(() => {
                this.next();
            }, 8000); // 8 seconds - faster for better UX
        },

        // Pause auto-slide when user interacts
        pauseAutoSlide() {
            if (this.autoSlideInterval) {
                clearInterval(this.autoSlideInterval);
                this.autoSlideInterval = null;
            }
        },

        // Resume auto-slide after user interaction ends
        resumeAutoSlide() {
            // Wait a bit before resuming to let user finish interaction
            setTimeout(() => {
                if (!this.autoSlideInterval) {
                    this.startAutoSlide();
                }
            }, 5000); // Resume after 5 seconds of inactivity
        }
    }
}