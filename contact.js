/**
 * CONTACT PAGE INTERACTIVITY
 * Enhanced with form validation, local storage, animations, and user feedback
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS animation library
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  });

  // =============================================
  // DOM ELEMENTS SELECTION
  // =============================================
  const form = document.getElementById('myForm');
  const submitBtn = document.getElementById('submit-btn');
  const privacyBtn = document.getElementById('privacy-btn');
  const privacyModal = document.getElementById('privacy-modal');
  const closeModal = document.querySelector('.close-modal');
  const acceptPrivacy = document.getElementById('accept-privacy');
  const faqItems = document.querySelectorAll('.faq-item');
  const successMessage = document.getElementById('success-message');
  const repeatVisitorElement = document.getElementById('repeat-visitors');
  
  // Form data storage key
  const FORM_DATA_KEY = 'exploreMalaysiaContactFormData';

  // =============================================
  // INITIALIZATION FUNCTIONS
  // =============================================
  function init() {
    animateVisitorCounter();
    animateSocialIcons();
    loadFormData();
    setupEventListeners();
    checkFormValidity(); // Initial form validation

    // Set up auto-save on all fields
    const formFields = ['name', 'email', 'phone', 'subject', 'category', 'message'];
    formFields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field) {
        field.addEventListener('input', saveFormData);
        field.addEventListener('blur', saveFormData);
      }
    });
  }

  // =============================================
  // ANIMATION FUNCTIONS
  // =============================================
  function animateVisitorCounter() {
    const targetPercentage = 87;
    const duration = 2500;
    const startTime = Date.now();
    
    function animateCounter() {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentPercentage = Math.floor(progress * targetPercentage);
      
      repeatVisitorElement.textContent = currentPercentage + '%';
      
      // Add gradient color effect based on progress
      const hue = 200 + (progress * 20);
      repeatVisitorElement.style.color = `hsl(${hue}, 100%, 50%)`;
      
      if (progress < 1) {
        requestAnimationFrame(animateCounter);
      } else {
        // Final celebration effects
        repeatVisitorElement.classList.add('celebrate');
        const statsBox = document.querySelector('.stats-box');
        statsBox.classList.add('counter-complete');
        
        // Add confetti effect
        setTimeout(() => {
          createConfetti();
        }, 300);
      }
    }
    
    // Start the counter animation
    animateCounter();
  }
  
  function createConfetti() {
    const statsBox = document.querySelector('.stats-box');
    const colors = ['#007BFF', '#00a1ff', '#ff6b00', '#ffcc00', '#38a169'];
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.width = Math.random() * 10 + 5 + 'px';
      confetti.style.height = confetti.style.width;
      confetti.style.opacity = Math.random() * 0.5 + 0.5;
      
      // Random animation properties
      const animationDuration = Math.random() * 3 + 2;
      const animationDelay = Math.random() * 2;
      
      confetti.style.animation = `confetti-fall ${animationDuration}s ease-in ${animationDelay}s forwards`;
      
      statsBox.appendChild(confetti);
      
      // Remove confetti after animation
      setTimeout(() => {
        confetti.remove();
      }, (animationDuration + animationDelay) * 1000);
    }
  }

  // =============================================
  // EVENT LISTENERS SETUP
  // =============================================
  function setupEventListeners() {
    // FAQ Accordion functionality
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      question.addEventListener('click', () => toggleFaqItem(item));
    });

    // Privacy modal controls
    privacyBtn.addEventListener('click', openPrivacyModal);
    closeModal.addEventListener('click', closePrivacyModal);
    acceptPrivacy.addEventListener('click', handlePrivacyAcceptance);

    // Window click handler for modal
    window.addEventListener('click', (e) => {
      if (e.target === privacyModal) closePrivacyModal();
    });

    // Form field event listeners
    ['name', 'email', 'subject', 'category', 'message'].forEach(fieldId => {
      const field = document.getElementById(fieldId);
      
      field.addEventListener('blur', () => validateField(fieldId));
      field.addEventListener('input', handleFieldInput.bind(null, fieldId));
      
      if (field.tagName === 'SELECT') {
        field.addEventListener('change', handleFieldInput.bind(null, fieldId));
      }
    });

    // Phone field (optional) still saves data
    document.getElementById('phone').addEventListener('input', () => {
      saveFormData();
      checkFormValidity();
    });

    // Form submission
    form.addEventListener('submit', handleFormSubmit);
  }

  // =============================================
  // FAQ ACCORDION FUNCTIONS
  // =============================================
  function toggleFaqItem(item) {
    // Close all other items
    faqItems.forEach(otherItem => {
      if (otherItem !== item && otherItem.classList.contains('active')) {
        otherItem.classList.remove('active');
      }
    });
    
    // Toggle current item
    item.classList.toggle('active');
  }

  // =============================================
  // PRIVACY MODAL FUNCTIONS
  // =============================================
  function openPrivacyModal() {
    privacyModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function closePrivacyModal() {
    privacyModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  function handlePrivacyAcceptance() {
    closePrivacyModal();
    showTemporaryMessage('Thank you for reviewing our privacy policy!', 'success');
  }

  // =============================================
  // FORM VALIDATION FUNCTIONS
  // =============================================
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorElement = document.getElementById(`${inputId}-error`);
    
    errorElement.textContent = message;
    input.classList.add('error');
    input.classList.remove('valid');
  }

  function clearError(inputId) {
    const input = document.getElementById(inputId);
    const errorElement = document.getElementById(`${inputId}-error`);
    
    errorElement.textContent = '';
    input.classList.remove('error');
    input.classList.add('valid');
  }

  function validateField(inputId) {
    const input = document.getElementById(inputId);
    const value = input.value.trim();
    
    if (!value) {
      showError(inputId, 'This field is required.');
      return false;
    }
    
    // Special validation for email
    if (inputId === 'email' && !isValidEmail(value)) {
      showError(inputId, 'Please enter a valid email address.');
      return false;
    }
    
    clearError(inputId);
    return true;
  }

  function checkFormValidity() {
    const requiredFields = ['name', 'email', 'subject', 'category', 'message'];
    let isFormValid = true;
    
    requiredFields.forEach(fieldId => {
      const isValid = validateField(fieldId);
      if (!isValid) isFormValid = false;
    });
    
    submitBtn.disabled = !isFormValid;
    return isFormValid;
  }

  // =============================================
  // FORM DATA PERSISTENCE FUNCTIONS
  // =============================================
  function saveFormData() {
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      subject: document.getElementById('subject').value,
      category: document.getElementById('category').value,
      message: document.getElementById('message').value
    };
    
    try {
      localStorage.setItem(FORM_DATA_KEY, JSON.stringify(formData));
    } catch (e) {
      console.error('LocalStorage error:', e);
      // Fallback to sessionStorage if localStorage fails
      try {
        sessionStorage.setItem(FORM_DATA_KEY, JSON.stringify(formData));
      } catch (e) {
        console.error('SessionStorage also failed:', e);
      }
    }
  }

  function loadFormData() {
    try {
      // Try localStorage first
      let savedData = localStorage.getItem(FORM_DATA_KEY);
      
      // If not found in localStorage, try sessionStorage
      if (!savedData) {
        savedData = sessionStorage.getItem(FORM_DATA_KEY);
      }
      
      if (savedData) {
        const formData = JSON.parse(savedData);
        
        document.getElementById('name').value = formData.name || '';
        document.getElementById('email').value = formData.email || '';
        document.getElementById('phone').value = formData.phone || '';
        document.getElementById('subject').value = formData.subject || '';
        document.getElementById('category').value = formData.category || '';
        document.getElementById('message').value = formData.message || '';
        
        // Validate loaded data
        checkFormValidity();
      }
    } catch (e) {
      console.error('Error loading form data:', e);
    }
  }

  function clearFormData() {
    try {
      localStorage.removeItem(FORM_DATA_KEY);
      sessionStorage.removeItem(FORM_DATA_KEY);
    } catch (e) {
      console.error('Error clearing form data:', e);
    }
  }

  // =============================================
  // UI FEEDBACK FUNCTIONS
  // =============================================
  function showTemporaryMessage(message, type = 'success') {
    const messageElement = document.createElement('div');
    messageElement.className = `temp-message ${type}`;
    messageElement.textContent = message;
    
    document.body.appendChild(messageElement);
    
    setTimeout(() => {
      messageElement.classList.add('fade-out');
      setTimeout(() => {
        messageElement.remove();
      }, 500);
    }, 3000);
  }

  function animateSocialIcons() {
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach((icon, index) => {
      icon.classList.add('animate__bounceIn');
      icon.style.animationDelay = `${index * 0.1}s`;
    });
  }

  // =============================================
  // FORM FIELD INPUT HANDLER
  // =============================================
  function handleFieldInput(fieldId) {
    validateField(fieldId);
    checkFormValidity();
    saveFormData();
  }

  // =============================================
  // FORM SUBMISSION HANDLER
  // =============================================
  function handleFormSubmit(e) {
    e.preventDefault();
    
    const isValid = checkFormValidity();
    
    if (isValid) {
      // Show loading state
      submitBtn.disabled = true;
      const btnText = submitBtn.querySelector('#btn-text');
      const submitIcon = submitBtn.querySelector('i');
      btnText.textContent = 'Sending...';
      submitIcon.classList.replace('fa-paper-plane', 'fa-spinner');
      submitIcon.classList.add('fa-spin');
      
      // Simulate form submission (replace with actual AJAX call)
      setTimeout(() => {
        // Show success message
        successMessage.innerHTML = `
          <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <div>
              <h4>Message Sent Successfully!</h4>
              <p>We've received your message and will respond within 24 hours.</p>
            </div>
          </div>
        `;
        successMessage.classList.add('show', 'animate__animated', 'animate__fadeInUp');
        
        // Reset button state
        btnText.textContent = 'Send Message';
        submitIcon.classList.replace('fa-spinner', 'fa-paper-plane');
        submitIcon.classList.remove('fa-spin');

        // Reset form but keep data in storage
        document.getElementById('myForm').reset();
        
        // Clear all validations
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        document.querySelectorAll('input, select, textarea').forEach(el => {
          el.classList.remove('valid', 'error');
        });
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Scroll to form after submission
        document.getElementById("myForm").scrollIntoView({ behavior: "smooth", block: "start" });
        
        // Hide success message after delay
        setTimeout(() => {
          successMessage.classList.remove('show');
          submitBtn.disabled = false;
        }, 5000);
      }, 1500);
    } else {
      // Scroll to first error
      const firstError = document.querySelector('.error-message:not(:empty)');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }
  
  // =============================================
  // SOCIAL MEDIA PART
  // =============================================
  document.addEventListener('DOMContentLoaded', function() {
    // Create floating shapes dynamically
    const floatingShapes = document.querySelector('.floating-shapes');
    const colors = ['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.2)'];
    
    // Generate 8 floating shapes
    for (let i = 0; i < 8; i++) {
      const shape = document.createElement('div');
      const size = Math.random() * 100 + 50;
      const left = Math.random() * 100;
      const delay = Math.random() * 10;
      const duration = Math.random() * 10 + 10;
      
      shape.style.width = `${size}px`;
      shape.style.height = `${size}px`;
      shape.style.left = `${left}%`;
      shape.style.animationDelay = `${delay}s`;
      shape.style.animationDuration = `${duration}s`;
      shape.style.background = colors[Math.floor(Math.random() * colors.length)];
      
      floatingShapes.appendChild(shape);
    }
    
    // Add hover effect to social media section
    const socialSection = document.querySelector('.social-media-section');
    socialSection.addEventListener('mousemove', (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      socialSection.style.backgroundPosition = `${x * 100}% ${y * 100}%`;
    });
    
    // Add ripple effect to social icons
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
      icon.addEventListener('click', function(e) {
        e.preventDefault();
        
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        
        const x = e.clientX - e.target.getBoundingClientRect().left;
        const y = e.clientY - e.target.getBoundingClientRect().top;
        
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        setTimeout(() => {
          ripple.remove();
        }, 1000);
      });
    });
  });

  // =============================================
  // INITIALIZE THE APPLICATION
  // =============================================
  init();

  // Add confetti style dynamically
  const style = document.createElement('style');
  style.textContent = `
    .confetti {
      position: absolute;
      top: -10px;
      border-radius: 50%;
      z-index: 10;
      transform: rotate(45deg);
    }
    
    @keyframes confetti-fall {
      0% {
        transform: translateY(0) rotate(45deg) rotateX(0);
        opacity: 1;
      }
      100% {
        transform: translateY(150px) rotate(90deg) rotateX(360deg);
        opacity: 0;
      }
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
});