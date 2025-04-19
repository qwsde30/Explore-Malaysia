document.addEventListener('DOMContentLoaded', function () {
    const backToTop = document.querySelector('.back-to-top');

    // Guard in case the element doesn't exist
    if (!backToTop) {
        console.warn('No element with class ".back-to-top" found.');
        return;
    }

    // Show/hide on scroll
    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            backToTop.style.display = 'flex';
        } else {
            backToTop.style.display = 'none';
        }
    });

    // Smooth scroll on click
    backToTop.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});







