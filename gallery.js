document.addEventListener('DOMContentLoaded', function() {
    // === FLIP CARD FUNCTIONALITY ===
    const cards = document.querySelectorAll('.card1');
    
    cards.forEach(card => {
        card.addEventListener('click', function() {
            cards.forEach(c => {
                if (c !== this && c.classList.contains('flipped')) {
                    c.classList.remove('flipped');
                }
            });
            this.classList.toggle('flipped');
        });

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

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.card1')) {
            cards.forEach(card => {
                card.classList.remove('flipped');
                card.style.transform = '';
                card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.12)';
            });
        }
    });

    // === STATE FILTERING FUNCTIONALITY ===
    const filterButtons = document.querySelectorAll('.state-btn');
    const stateSections = document.querySelectorAll('.state-section');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const selected = btn.getAttribute('data-state');

            // Toggle active class
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show/hide relevant sections
            stateSections.forEach(section => {
                if (selected === 'all' || section.id === selected) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });
});