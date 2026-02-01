// Slider Script
function scrollSlider() {
    const slider = document.getElementById('slider');
    if (slider) {
        slider.scrollBy({
            left: 300,
            behavior: 'smooth'
        });
    }
}
