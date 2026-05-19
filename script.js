// Load Navigation
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        fetch('nav.html')
            .then(response => response.text())
            .then(data => {
                navbar.innerHTML = data;
            });
    }
});

document.addEventListener('click', function (event) {
    // Handle logo click for minigame
    if (event.target.classList.contains('logo')) {
        if (typeof startMinigame === 'function') {
            startMinigame();
        }
        return;
    }

    if (event.target.tagName === 'IMG' && event.target.closest('.image')) {
        const clickedImg = event.target;
        const isEnlarged = clickedImg.classList.contains('enlarged');

        // Remove enlarged class from all other images
        document.querySelectorAll('.image img.enlarged').forEach(img => {
            img.classList.remove('enlarged');
        });

        // If the clicked image wasn't already enlarged, enlarge it
        if (!isEnlarged) {
            clickedImg.classList.add('enlarged');
        }
    }
});
