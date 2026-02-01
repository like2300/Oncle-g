// Loader Script
document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const loaderOverlay = document.getElementById('loader-overlay');
    const paths = document.querySelectorAll('.speed-path');
    const progressBar = document.getElementById('loader-progress');

    // Récupération des sons
    const audioElectric = document.getElementById('audio-electric');
    const audioStop = document.getElementById('audio-stop');

    // Réglage volumes
    if(audioElectric) audioElectric.volume = 0.5;
    if(audioStop) audioStop.volume = 1.0;

    // 1. Initialisation : Bloquer le scroll
    body.classList.add('loading');

    // 2. Lancer l'animation de tracé (Visuel immédiat)
    paths.forEach(path => {
        path.classList.add('animate-draw');
    });

    // 3. Tenter de lancer le son électrique (Peut être bloqué par le navigateur)
    if(audioElectric) {
        audioElectric.play().catch(() => console.log("Autoplay audio bloqué"));
    }

    // --- SIMULATION D'ATTENTE (TRICKLE) ---
    // On fait avancer la barre doucement tant que la page n'est pas chargée
    // pour ne pas qu'elle reste bloquée à 0%.
    let progress = 0;
    const interval = setInterval(() => {
        // On augmente doucement jusqu'à 90% max
        if (progress < 90) {
            // Plus on avance, plus ça ralentit (effet naturel)
            let increment = (90 - progress) / 20;
            progress += Math.max(0.5, increment);
            progressBar.style.width = progress + "%";
        }
    }, 100);

    // --- LE VRAI ÉVÉNEMENT DE CHARGEMENT ---
    // Se déclenche quand TOUT est chargé (Images, CSS, JS externe)
    window.addEventListener('load', () => {

        // On arrête la simulation d'attente
        clearInterval(interval);

        // On force la barre à 100% instantanément
        progressBar.style.width = "100%";

        // Petite pause de 200ms pour que l'œil voie la barre pleine
        setTimeout(() => {
            finishLoader();
        }, 200);
    });

    // Fonction de fermeture
    function finishLoader() {
        // Arrêt son électrique
        if(audioElectric) {
            audioElectric.pause();
            audioElectric.currentTime = 0;
        }

        // Jouer l'impact (STOP)
        if(audioStop) {
            audioStop.play().catch(() => {});
        }

        // Remplissage Blanc du Logo (L'Impact Visuel)
        paths.forEach(path => {
            path.classList.add('animate-fill');
        });

        // Disparition finale (Après l'impact)
        setTimeout(() => {
            loaderOverlay.classList.add('loader-fade-out');
            body.classList.remove('loading');
        }, 600); // 0.6s pour laisser le temps de voir le logo blanc
    }

    // SÉCURITÉ : Si la page met plus de 10 secondes (bug réseau), on force l'ouverture
    setTimeout(() => {
        if (body.classList.contains('loading')) {
            window.dispatchEvent(new Event('load'));
        }
    }, 10000);
});
