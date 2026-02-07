// Contact form handler for sending messages via WhatsApp
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('section.mt-20 form');
    if (!contactForm) return; // Only run if the form exists

    const nomInput = document.getElementById('nom');
    const telephoneInput = document.getElementById('telephone');
    const messageInput = document.getElementById('message');
    const submitButton = contactForm.querySelector('button[type="submit"], button.w-full');

    if (submitButton) {
        submitButton.addEventListener('click', function(e) {
            e.preventDefault();

            // Get form values
            const nom = nomInput ? nomInput.value.trim() : '';
            const telephone = telephoneInput ? telephoneInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';

            // Validate form
            if (!nom || !message) {
                alert('Veuillez remplir les champs obligatoires (Nom et Message)');
                return;
            }

            // Format the message for WhatsApp
            let whatsappMessage = `Nouveau message d'Oncle G:\n\n`;
            whatsappMessage += `Nom: ${nom}\n`;
            if (telephone) {
                whatsappMessage += `Téléphone: ${telephone}\n`;
            }
            whatsappMessage += `\nMessage:\n${message}`;

            // Encode the message for URL
            const encodedMessage = encodeURIComponent(whatsappMessage);

            // Open WhatsApp with the pre-filled message
            // Using the Oncle G phone number from the contact section
            const phoneNumber = '242066338224'; // Updated to match the tel link format used in the site (+242 06...)
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

            window.open(whatsappUrl, '_blank');
        });
    }

    // Also handle form submission via Enter key
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                submitButton.click();
            }
        });
    });
});
