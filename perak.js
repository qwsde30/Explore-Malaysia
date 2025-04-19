/*Hero Section*/ 
const images = [
    'ImagePerak/5.jpg',
    'ImagePerak/2.jpg',
    'ImagePerak/3.jpg',
    'ImagePerak/4.jpg',
    'ImagePerak/1.jpg'

];
let index = 0;

setInterval(() => {
    index = (index + 1) % images.length;
    document.getElementById('hero').style.backgroundImage = `url('${images[index]}')`;
}, 2000); // Change every 2 seconds




document.addEventListener('DOMContentLoaded', function() {
    // Get all flip cards
    const cards = document.querySelectorAll('.card1');
    
    // Add click event to each card
    cards.forEach(card => {
        // Click event for flipping
        card.addEventListener('click', function() {
            // Remove flipped class from all other cards
            cards.forEach(c => {
                if (c !== this && c.classList.contains('flipped')) {
                    c.classList.remove('flipped');
                }
            });
            
            // Toggle flipped class on clicked card
            this.classList.toggle('flipped');
        });
        
        // Add hover effects that don't interfere with flip
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('flipped')) {
                this.style.transform = 'translateY(-10px)';
                this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('flipped')) {
                this.style.transform = '';
                this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.12)';
            }
        });
    });
    
    // Close flipped cards when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.card1')) {
            cards.forEach(card => {
                card.classList.remove('flipped');
                card.style.transform = '';
                card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.12)';
            });
        }
    });
});


document.addEventListener('DOMContentLoaded', function() {
    // Animate the area counter
    const areaCounter = document.getElementById('area-counter');
    const targetArea = 20976; // Perak's area in km²
    const duration = 2000; // Animation duration in ms
    const steps = 100;
    const increment = targetArea / steps;
    let current = 0;
    
    const animateCounter = () => {
        current += increment;
        if (current < targetArea) {
            areaCounter.textContent = Math.floor(current).toLocaleString();
            setTimeout(animateCounter, duration / steps);
        } else {
            areaCounter.textContent = targetArea.toLocaleString();
        }
    };
    
    // Start animation when element is in viewport
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateCounter();
            observer.unobserve(areaCounter);
        }
    }, { threshold: 0.5 });
    
    observer.observe(areaCounter);
    
    // Add hover effects to all stat items
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const number = this.querySelector('.stat-number');
            number.style.transform = 'scale(1.1)';
        });
        
        item.addEventListener('mouseleave', function() {
            const number = this.querySelector('.stat-number');
            number.style.transform = 'scale(1)';
        });
    });
    
    // Add subtle animation to section title on load
    const sectionTitle = document.querySelector('.section-title');
    setTimeout(() => {
        sectionTitle.style.transform = 'translateX(5px)';
        setTimeout(() => {
            sectionTitle.style.transform = 'translateX(0)';
        }, 300);
    }, 500);
});




// Back to top button
window.addEventListener('scroll', function () {
    const backToTop = document.querySelector('.back-to-top');
    if (window.scrollY > 300) {
        backToTop.style.display = 'flex';
    } else {
        backToTop.style.display = 'none';
    }
});

// Smooth scroll
document.querySelector('.back-to-top').addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});