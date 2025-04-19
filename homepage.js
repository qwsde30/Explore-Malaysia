// for hero background

document.addEventListener("DOMContentLoaded", () => {
  const heroSection = document.querySelector('.hero-section');
  const images = [
      'ImageHomePage/malaysia1.jpg',
      'ImageHomePage/malaysia2.jpg',
      'ImageHomePage/malaysia3.jpg',
      'ImageHomePage/malaysia4.jpg',
      'ImageHomePage/malaysia5.jpg',
      'ImageHomePage/malaysia6.jpg',
      'ImageHomePage/malaysia7.jpg',
      'ImageHomePage/malaysia8.jpg'
  ];

  let currentIndex = 0;

  setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      heroSection.style.backgroundImage = 
          `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${images[currentIndex]}')`;
  }, 3000); // Change every 3 seconds
});

// Alert Box
document.addEventListener('DOMContentLoaded', function() {
  // Check if visitor already submitted name in this session
  if (!sessionStorage.getItem('visitorNameShown')) {
    // Show the welcome alert after a short delay
    setTimeout(function() {
      document.getElementById('welcomeAlert').style.display = 'flex';
    }, 1000);
  }

  // Handle close button
  document.getElementById('closeWelcome').addEventListener('click', function() {
    document.getElementById('welcomeAlert').style.display = 'none';
    sessionStorage.setItem('visitorNameShown', 'true');
  });

  // Handle form submission
  document.getElementById('submitName').addEventListener('click', function() {
    const nameInput = document.getElementById('visitorName');
    const name = nameInput.value.trim();
    
    if (name) {
      sessionStorage.setItem('visitorName', name);
      console.log(`Welcome, ${name}! Enjoy your visit to our website.`);
    }
    
    sessionStorage.setItem('visitorNameShown', 'true');
    document.getElementById('welcomeAlert').style.display = 'none';
  });

  // Allow submission on Enter key
  document.getElementById('visitorName').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      document.getElementById('submitName').click();
    }
  });
});





// ========== WEATHER API ==========
const WEATHER_API = {
  WEATHERAPI: {  // 1M calls/month (recommended)
      url: 'https://api.weatherapi.com/v1/current.json',
      key: '857b4401ee2b4ea28f8111920250904', // Get from https://www.weatherapi.com/
      params: '?key=REPLACE_KEY&q=Kuala Lumpur&aqi=no'
  },
  WEATHERBIT: {  // 500 calls/day
      url: 'https://api.weatherbit.io/v2.0/current',
      key: '857b4401ee2b4ea28f8111920250904', 
      params: '?key=REPLACE_KEY&city=Kuala Lumpur&country=MY'
  }
};

// Current API selection
const currentAPI = WEATHER_API.WEATHERAPI; // Change to WEATHERBIT if preferred

/**
* Fetches weather data from selected API
*/
function fetchWeatherData() {
  // Replace API key in params
  const apiUrl = currentAPI.url + currentAPI.params.replace('REPLACE_KEY', currentAPI.key);
  
  // Show loading state
  document.getElementById('weather-temp').textContent = '...';
  document.getElementById('weather-desc').textContent = 'Loading...';
  
  fetch(apiUrl)
      .then(response => {
          if (!response.ok) throw new Error('Weather data not available');
          return response.json();
      })
      .then(data => {
          if (currentAPI === WEATHER_API.WEATHERAPI) {
              processWeatherAPI(data);
          } else if (currentAPI === WEATHER_API.WEATHERBIT) {
              processWeatherbit(data);
          }
      })
      .catch(error => {
          console.error('Error fetching weather:', error);
          document.getElementById('weather-desc').textContent = 'Weather data unavailable';
          document.getElementById('weather-icon').innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
      });
}

// Process WeatherAPI.com response
function processWeatherAPI(data) {
  document.getElementById('weather-temp').textContent = Math.round(data.current.temp_c);
  document.getElementById('weather-desc').textContent = data.current.condition.text;
  document.getElementById('weather-wind').textContent = Math.round(data.current.wind_kph);
  document.getElementById('weather-humidity').textContent = data.current.humidity;
  document.getElementById('weather-location').textContent = data.location.name;
  updateWeatherIcon(data.current.condition.text);
}

// Process Weatherbit.io response
function processWeatherbit(data) {
  const weather = data.data[0];
  document.getElementById('weather-temp').textContent = Math.round(weather.temp);
  document.getElementById('weather-desc').textContent = weather.weather.description;
  document.getElementById('weather-wind').textContent = Math.round(weather.wind_spd * 3.6); // m/s to km/h
  document.getElementById('weather-humidity').textContent = weather.rh;
  document.getElementById('weather-location').textContent = weather.city_name;
  updateWeatherIcon(weather.weather.description);
}

function updateWeatherIcon(weatherCondition) {
  const condition = weatherCondition.toLowerCase();
  const iconElement = document.getElementById('weather-icon');
  
  // Map conditions to icons
  if (condition.includes('rain') || condition.includes('drizzle')) {
      iconElement.innerHTML = '<i class="fas fa-cloud-rain"></i>';
      iconElement.style.color = '#3498db';
  } else if (condition.includes('cloud')) {
      iconElement.innerHTML = '<i class="fas fa-cloud"></i>';
      iconElement.style.color = '#7f8c8d';
  } else if (condition.includes('clear') || condition.includes('sunny')) {
      iconElement.innerHTML = '<i class="fas fa-sun"></i>';
      iconElement.style.color = '#f1c40f';
  } else if (condition.includes('thunder') || condition.includes('storm')) {
      iconElement.innerHTML = '<i class="fas fa-bolt"></i>';
      iconElement.style.color = '#9b59b6';
  } else if (condition.includes('fog') || condition.includes('mist')) {
      iconElement.innerHTML = '<i class="fas fa-smog"></i>';
      iconElement.style.color = '#95a5a6';
  } else {
      iconElement.innerHTML = '<i class="fas fa-cloud-sun"></i>';
      iconElement.style.color = '#e67e22';
  }
}

// ========== TIME DISPLAY ==========
function updateMalaysiaTime() {
  const options = {
      timeZone: 'Asia/Kuala_Lumpur',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
  };
  
  const dateOptions = {
      timeZone: 'Asia/Kuala_Lumpur',
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
  };
  
  const now = new Date();
  document.getElementById('malaysia-time').textContent = now.toLocaleTimeString('en-US', options);
  document.getElementById('malaysia-date').textContent = now.toLocaleDateString('en-US', dateOptions);
}

// Initialize
updateMalaysiaTime();
setInterval(updateMalaysiaTime, 1000);
fetchWeatherData();
setInterval(fetchWeatherData, 1800000); // Update every 30 minutes


// ========== COUNTRY INFORMATION API ========== //
function fetchCountryInfo() {
  // REST Countries API endpoint for Malaysia
  const apiUrl = 'https://restcountries.com/v3.1/name/malaysia?fullText=true';
  
  // Show loading state
  const countryInfoContainer = document.getElementById('country-info-container');
  if (countryInfoContainer) {
      countryInfoContainer.innerHTML = '<div class="text-center"><i class="fas fa-spinner fa-spin"></i> Loading country information...</div>';
  }

  fetch(apiUrl)
      .then(response => {
          if (!response.ok) throw new Error('Country data not available');
          return response.json();
      })
      .then(data => {
          if (data && data.length > 0) {
              displayCountryInfo(data[0]);
          } else {
              throw new Error('No data returned for Malaysia');
          }
      })
      .catch(error => {
          console.error('Error fetching country info:', error);
          if (countryInfoContainer) {
              countryInfoContainer.innerHTML = '<div class="alert alert-warning">Country information currently unavailable</div>';
          }
      });
}

function displayCountryInfo(countryData) {
  const container = document.getElementById('country-info-container');
  if (!container) return;

  // Format population with commas
  const population = countryData.population.toLocaleString();
  
  // Get currency information
  const currencies = countryData.currencies ? Object.values(countryData.currencies) : [];
  const currency = currencies.length > 0 ? `${currencies[0].name} (${currencies[0].symbol})` : 'Not available';
  
  // Get languages
  const languages = countryData.languages ? Object.values(countryData.languages).join(', ') : 'Not available';
  
  // Get timezones
  const timezones = countryData.timezones ? countryData.timezones.join(', ') : 'Not available';
  
  // Create HTML content
  container.innerHTML = `
      <div class="row">
          <div class="col-md-4">
              <div class="country-info-item">
                  <i class="fas fa-users"></i>
                  <strong>Population:</strong> ${population}
              </div>
          </div>
          <div class="col-md-4">
              <div class="country-info-item">
                  <i class="fas fa-money-bill-wave"></i>
                  <strong>Currency:</strong> ${currency}
              </div>
          </div>
          <div class="col-md-4">
              <div class="country-info-item">
                  <i class="fas fa-language"></i>
                  <strong>Languages:</strong> ${languages}
              </div>
          </div>
          <div class="col-md-4">
              <div class="country-info-item">
                  <i class="fas fa-clock"></i>
                  <strong>Timezones:</strong> ${timezones}
              </div>
          </div>
          <div class="col-md-4">
              <div class="country-info-item">
                  <i class="fas fa-map-marked-alt"></i>
                  <strong>Region:</strong> ${countryData.region} (${countryData.subregion})
              </div>
          </div>
          <div class="col-md-4">
              <div class="country-info-item">
                  <i class="fas fa-phone"></i>
                  <strong>Calling Code:</strong> +${countryData.idd.root}${countryData.idd.suffixes[0]}
              </div>
          </div>
      </div>
      <div class="text-center mt-4">
          <img src="${countryData.flags.png}" alt="Malaysia Flag" class="country-flag-img img-fluid rounded">
      </div>
  `;
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', fetchCountryInfo);




// Airplane Animation JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Airplane animation
  const airplane = document.querySelector('.airplane-animate');
  const divider = document.querySelector('.divider');
  
  if (airplane && divider) {
      let position = 0;
      let direction = 1; // 1 for right, -1 for left
      const speed = 1;
      const dividerWidth = divider.offsetWidth;
      const airplaneWidth = 40; // matches CSS width
      
      function animateAirplane() {
          position += speed * direction;
          
          // Reverse direction at edges
          if (position > dividerWidth - airplaneWidth) {
              direction = -1;
              airplane.style.transform = 'rotate(-45deg) translateY(-50%) scaleX(-1)';
          } else if (position < 0) {
              direction = 1;
              airplane.style.transform = 'rotate(-45deg) translateY(-50%)';
          }
          
          // Update position
          airplane.parentElement.style.left = position + 'px';
          
          requestAnimationFrame(animateAirplane);
      }
      
      // Start animation
      animateAirplane();
      
      // Pause on hover
      airplane.addEventListener('mouseenter', function() {
          airplane.style.animationPlayState = 'paused';
      });
      
      airplane.addEventListener('mouseleave', function() {
          airplane.style.animationPlayState = 'running';
      });
  }
  
  // Tag hover effects
  const tags = document.querySelectorAll('.tag');
  tags.forEach(tag => {
      tag.addEventListener('mouseenter', function() {
          this.style.transform = 'translateY(-5px)';
          this.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
      });
      
      tag.addEventListener('mouseleave', function() {
          this.style.transform = 'translateY(0)';
          this.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
      });
  });
  
  // Initialize carousel if using Owl Carousel
  if (typeof jQuery !== 'undefined' && jQuery.fn.owlCarousel) {
      jQuery('.testimonial-carousel').owlCarousel({
          loop: true,
          margin: 20,
          nav: true,
          dots: false,
          responsive: {
              0: {
                  items: 1
              },
              768: {
                  items: 1
              },
              992: {
                  items: 1
              }
          }
      });
  }
});






// Wait for the DOM to be fully loaded before executing JavaScript
$(document).ready(function() {
  // ========== SMOOTH SCROLLING ==========
  /**
   * Smooth scrolling for all anchor links that contain # in href
   * Excludes dropdown toggle links
   */
  $('a[href*="#"]').on('click', function(e) {
      // Check if the link is not a dropdown toggle
      if (!$(this).hasClass('dropdown-toggle')) {
          e.preventDefault(); // Prevent default anchor behavior
          
          // Get the target element's ID from the href attribute
          var target = $(this.hash);
          
          // Check if target exists on the page
          if (target.length) {
              // Animate scroll to the target position
              $('html, body').animate({
                  // Calculate scroll position with 70px offset for fixed navbar
                  scrollTop: target.offset().top - 70
              }, 800, 'swing', function() {
                  // Add hash to URL after scroll completes
                  window.location.hash = $(this).attr('href');
              });
          }
      }
  });
    
    // ========== ANIMATIONS ==========
    /**
     * Check if an element is currently visible in the viewport
     * @param {HTMLElement} element - The element to check
     * @return {boolean} True if element is in viewport
     */
    function isInViewport(element) {
        var rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 && // Element is below top of viewport
            rect.left >= 0 && // Element is right of left edge
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && // Above bottom
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) // Left of right edge
        );
    }
    
    /**
     * Handle scroll-triggered animations for various page elements
     */
    function handleScrollAnimations() {
        // Animate main content sections when they come into view
        $('.hero-section, .feature-box, .destination-card, .newsletter-form').each(function() {
            if (isInViewport(this)) {
                $(this).addClass('fade-in slide-up');
            }
        });
        
        // Animate section titles with a separate effect
        $('.section-title').each(function() {
            if (isInViewport(this)) {
                $(this).css('opacity', 0) // Start invisible
                       .animate({ opacity: 1 }, 1000); // Fade in over 1 second
            }
        });
    }
    
    // Run initial check when page loads
    handleScrollAnimations();
    
    // Check for animations on scroll
    $(window).scroll(function() {
        handleScrollAnimations();
    });
    
    // Hero section staged animations with delays
    setTimeout(function() {
        // First animate the hero section container
        $('.hero-section').css({
            'opacity': 1,
            'transform': 'translateY(0)'
        });
        
        // Then animate the h1 after delay
        setTimeout(function() {
            $('.hero-section h1').css({
                'opacity': 1,
                'transform': 'translateY(0)'
            });
            
            // Then animate the paragraph after delay
            setTimeout(function() {
                $('.hero-section p').css({
                    'opacity': 1,
                    'transform': 'translateY(0)'
                });
                
                // Finally animate the button after delay
                setTimeout(function() {
                    $('.explore-btn').css({
                        'opacity': 1,
                        'transform': 'translateY(0)'
                    });
                }, 300); // 300ms delay
            }, 300); // 300ms delay
        }, 300); // 300ms delay
    }, 100); // Initial 100ms delay
    
    // ========== ANIMATED COUNTERS ==========
    /**
     * Animates all counter elements from 0 to their target values
     */
    function animateCounters() {
        $('.counter').each(function() {
            var $this = $(this); // Current counter element
            var target = parseInt($this.attr('data-target')); // Get target number
            var count = 0; // Start counting from 0
            var duration = 2000; // Animation duration in ms
            var increment = target / (duration / 16); // Calculate increment for 60fps
            
            // Animation interval
            var counter = setInterval(function() {
                count += increment; // Increment counter
                
                // Check if reached target
                if (count >= target) {
                    count = target; // Snap to exact target
                    clearInterval(counter); // Stop animation
                }
                
                $this.text(Math.floor(count)); // Update display
            }, 16); // ~60fps
        });
    }
    
    /**
     * Checks if counters are visible and animates them if needed
     */
    function checkCounters() {
        $('.counters-row').each(function() {
            if (isInViewport(this)) {
                if (!$(this).hasClass('animated')) {
                    $(this).addClass('animated'); // Mark as animated
                    animateCounters(); // Start counting
                }
            }
        });
    }

    // Simple image enlargement on click
    $(document).ready(function() {
        $('.wildlife-carousel img').click(function() {
            // Toggle enlarged class
            $(this).toggleClass('enlarged');
        
            if ($(this).hasClass('enlarged')) {
                // Create overlay for enlarged view
                $('body').append(`
                    <div class="image-overlay">
                        <img src="${$(this).attr('src')}" alt="${$(this).attr('alt')}">
                        <button class="close-btn">&times;</button>
                    </div>
            `   );
            
                // Close button functionality
                $('.close-btn').click(function() {
                    $('.image-overlay').remove();
                    $('.wildlife-carousel img').removeClass('enlarged');
                });
            } else {
                $('.image-overlay').remove();
            }
        });
    });
    
    // ========== TESTIMONIAL CAROUSEL ==========
    /**
     * Initializes the testimonial carousel using Slick slider
     */
    function initTestimonialCarousel() {
        $('.testimonial-carousel').slick({
            dots: true, // Show navigation dots
            arrows: false, // Hide arrows
            autoplay: true, // Auto-rotate
            autoplaySpeed: 5000, // 5 second interval
            fade: true, // Fade transition
            cssEase: 'linear' // Smooth fading
        });
    }
    
    // ========== TOGGLE EFFECTS ==========
    // Dropdown menu animations
    $('.dropdown-menu').on('show.bs.dropdown', function() {
        $(this).hide().slideDown(300); // Slide down animation
    });
    
    $('.dropdown-menu').on('hide.bs.dropdown', function() {
        $(this).slideUp(300); // Slide up animation
    });
    
    // Mobile menu toggle animation
    $('.navbar-toggler').click(function() {
        $('.navbar-collapse').slideToggle(300); // Toggle with slide
    });
    
    // Destination card hover effects
    $('.destination-card').hover(
        // Mouse enter
        function() {
            $(this).find('.card-img-top').css('transform', 'scale(1.05)');
            $(this).find('.btn').addClass('btn-success').removeClass('btn-primary');
        },
        // Mouse leave
        function() {
            $(this).find('.card-img-top').css('transform', 'scale(1)');
            $(this).find('.btn').addClass('btn-primary').removeClass('btn-success');
        }
    );
    
    // Social media icons animation
    $('.social-icons a').hover(
        // Mouse enter
        function() {
            $(this).css('transform', 'translateY(-5px) scale(1.2)');
        },
        // Mouse leave
        function() {
            $(this).css('transform', 'translateY(0) scale(1)');
        }
    );
    
    // ========== ADDITIONAL ENHANCEMENTS ==========
    // Create back-to-top button
    var backToTop = $(
      '<button id="back-to-top" class="btn btn-primary shadow rounded-circle">' +
      '<i class="fas fa-circle-chevron-up"></i>' +
      '</button>'
    );
    $('body').append(backToTop);
    
    // Show/hide back-to-top based on scroll
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            backToTop.fadeIn();
        } else {
            backToTop.fadeOut();
        }
    });
    
    // Back-to-top functionality
    backToTop.click(function() {
        $('html, body').animate({ scrollTop: 0 }, 800);
        return false;
    });
    
    // Initially hide back-to-top button
    backToTop.hide();
    
    // Initialize Bootstrap tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();
    
    // Add tooltips to social icons
    $('.social-icons a').each(function() {
        var platform = $(this).find('i').attr('class').split(' ')[1].replace('fa-', '');
        $(this).attr({
            'title': 'Follow us on ' + platform.charAt(0).toUpperCase() + platform.slice(1),
            'data-bs-toggle': 'tooltip'
        });
    });
    
    // ========== INITIALIZATIONS ==========
    // Check counters on scroll
    $(window).scroll(function() {
        checkCounters();
    });
    
    // Initialize testimonial carousel
    initTestimonialCarousel();
    
    // Initial check for counters
    checkCounters();
});


// ========== STORAGE IMPLEMENTATIONS ==========

/**
 * COOKIE FUNCTIONS
 * Helper functions for working with cookies
 */
function setCookie(name, value, days) {
    let expires = ""; // Initialize expiration string
    if (days) { // If expiration days are provided
      const date = new Date(); // Get current date
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Set expiration time
      expires = "; expires=" + date.toUTCString(); // Format expiration string
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/"; // Set cookie
  }
  
  function getCookie(name) {
    const nameEQ = name + "="; // Create key to search
    const ca = document.cookie.split(';'); // Get all cookies
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]; // Get individual cookie
      while (c.charAt(0) === ' ') c = c.substring(1); // Trim leading spaces
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length); // Return value if match found
    }
    return null; // Return null if not found
  }
  
  /**
   * COOKIE CONSENT MANAGEMENT
   * Handles displaying and processing cookie consent
   */
  function handleCookieConsent() {
    // If consent not yet given, show the banner
    if (!getCookie('cookieConsent')) {
      $('#cookieConsent').removeClass('d-none'); // Show consent banner
    }
  
    // Handle "Accept Cookies" click
    $('#acceptCookies').click(function() {
      setCookie('cookieConsent', 'true', 30); // Store consent for 30 days
      $('#cookieConsent').fadeOut(); // Hide banner
      initStorageFeatures(); // Enable features that require storage
    });
  
    // Handle "Decline Cookies" click
    $('#declineCookies').click(function() {
      setCookie('cookieConsent', 'false', 1); // Decline, expires in 1 day
      $('#cookieConsent').fadeOut(); // Hide banner
    });
  }
  
  /**
   * THEME MANAGEMENT
   * Handles dark/light theme preference
   */
  function initTheme() {
    const savedTheme = localStorage.getItem('themePreference'); // Get saved theme
    if (savedTheme === 'dark') {
      $('body').addClass('dark-mode'); // Apply dark mode
      $('#themeToggle').html('<i class="fas fa-sun"></i> Light Mode'); // Set toggle text/icon
    }
  
    // Toggle theme on button click
    $('#themeToggle').click(function() {
      $('body').toggleClass('dark-mode'); // Toggle dark mode class
      if ($('body').hasClass('dark-mode')) {
        localStorage.setItem('themePreference', 'dark'); // Save dark mode
        $(this).html('<i class="fas fa-sun"></i> Light Mode');
      } else {
        localStorage.setItem('themePreference', 'light'); // Save light mode
        $(this).html('<i class="fas fa-moon"></i> Dark Mode');
      }
    });
  }
  
  /**
   * NEWSLETTER SUBSCRIPTION
   * Stores subscription status in localStorage
   */
  function initNewsletter() {
    // On newsletter form submission
    $('.newsletter-form').submit(function(e) {
      e.preventDefault(); // Prevent default form submission
  
      const email = $(this).find('input[type="email"]').val().trim(); // Get email
  
      // Validate email format
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Please enter a valid email address'); // Show alert if invalid
        return;
      }
  
      // Save subscription details to localStorage
      localStorage.setItem('subscribedEmail', email);
      localStorage.setItem('newsletterSubscribed', 'true');
      localStorage.setItem('newsletterSubscribedDate', new Date().toISOString());
  
      // Replace form with success message
      $(this).html(`
        <div class="alert alert-success">
          <i class="fas fa-check-circle"></i> 
          Thank you for subscribing! We'll keep you updated.
        </div>
      `);
    });
  
    // Show already subscribed message if applicable
    if (localStorage.getItem('newsletterSubscribed') === 'true') {
      const email = localStorage.getItem('subscribedEmail');
      const subDate = new Date(localStorage.getItem('newsletterSubscribedDate'));
  
      $('.newsletter-form').html(`
        <div class="alert alert-info">
          <i class="fas fa-info-circle"></i> 
          You subscribed on ${subDate.toLocaleDateString()} (${email})
        </div>
      `);
    }
  }
  
  /**
   * RECENTLY VIEWED PAGES
   * Tracks pages viewed in this session
   */
  function trackRecentViews() {
    const currentPage = {
      title: document.title, // Get current page title
      url: window.location.pathname, // Get current page path
      timestamp: new Date().toISOString() // Timestamp of visit
    };
  
    // Load existing views from sessionStorage
    let recentViews = JSON.parse(sessionStorage.getItem('recentViews') || '[]');
  
    // Add current page if it's not already the most recent
    if (recentViews.length === 0 || recentViews[0].url !== currentPage.url) {
      recentViews.unshift(currentPage); // Add to beginning
      recentViews = recentViews.slice(0, 5); // Keep only last 5
      sessionStorage.setItem('recentViews', JSON.stringify(recentViews)); // Save to sessionStorage
    }
  
    // Show recent views in UI
    if (recentViews.length > 0) {
      $('#recentlyViewed').html(`
        <h5>Recently Viewed</h5>
        <ul class="list-unstyled">
          ${recentViews.map(view => `
            <li>
              <a href="${view.url}" class="text-decoration-none">
                <i class="fas fa-chevron-right me-2"></i>${view.title}
              </a>
            </li>
          `).join('')}
        </ul>
      `);
    }
  }
  
  /**
   * FAVORITE DESTINATIONS
   * Allows users to mark destinations as favorites
   */
  function initFavoriteDestinations() {
    let favorites = JSON.parse(localStorage.getItem('favoriteDestinations') || '[]'); // Load saved favorites
  
    // Loop through each destination card and update UI
    $('.destination-card').each(function() {
      const destination = $(this).find('.card-title').text(); // Get destination name
      if (favorites.includes(destination)) {
        $(this).find('.btn').addClass('btn-favorited') // Add "favorited" style
          .html('<i class="fas fa-heart"></i> Favorited'); // Change button text
      }
    });
  
    // Handle favorite button click
    $('.destination-card .btn').click(function(e) {
      e.preventDefault();
      const destination = $(this).closest('.destination-card').find('.card-title').text(); // Get destination name
      let favorites = JSON.parse(localStorage.getItem('favoriteDestinations') || '[]'); // Reload favorites
  
      if ($(this).hasClass('btn-favorited')) {
        // If already favorited, remove from list
        favorites = favorites.filter(fav => fav !== destination);
        $(this).removeClass('btn-favorited').html('Explore'); // Reset button
      } else {
        // Add to favorites
        favorites.push(destination);
        $(this).addClass('btn-favorited')
          .html('<i class="fas fa-heart"></i> Favorited');
      }
  
      // Save updated favorites list
      localStorage.setItem('favoriteDestinations', JSON.stringify(favorites));
    });
  }
  
  /**
   * FORM DATA PERSISTENCE
   * Saves form data in sessionStorage
   */
  function initFormPersistence() {
    $('form').each(function() {
      const formId = $(this).attr('id'); // Get form ID
      if (!formId) return; // Skip if no ID
  
      // Restore saved input values
      $(this).find('input, textarea, select').each(function() {
        const savedValue = sessionStorage.getItem(`${formId}_${this.name}`);
        if (savedValue !== null) {
          $(this).val(savedValue); // Set saved value
        }
      });
  
      // Save data on input/change
      $(this).on('input change', 'input, textarea, select', function() {
        sessionStorage.setItem(`${formId}_${this.name}`, $(this).val());
      });
  
      // Clear saved data on form submit
      $(this).submit(function() {
        $(this).find('input, textarea, select').each(function() {
          sessionStorage.removeItem(`${formId}_${this.name}`);
        });
      });
    });
  }
  
  /**
   * INITIALIZE ALL STORAGE FEATURES
   * Called after cookie consent is given
   */
  function initStorageFeatures() {
    initTheme(); // Initialize theme toggle
    initNewsletter(); // Initialize newsletter logic
    trackRecentViews(); // Track recently viewed pages
    initFavoriteDestinations(); // Handle favorites
    initFormPersistence(); // Enable form data saving
  }
  
  // ========== DOCUMENT READY ==========
  $(document).ready(function() {
    handleCookieConsent(); // Show cookie consent first
  
    // If cookies already accepted, initialize storage-related features
    if (getCookie('cookieConsent') === 'true') {
      initStorageFeatures();
    }
  
    // Other code that should run on page load (animations, etc.) goes here...
  });
  

/* Fcebook*/ 
// Load Facebook SDK with optimized settings
// Facebook PlugIn Integration  
function loadMalaysiaFacebookPlugin() {
  if (window.fbLoaded) return;
  window.fbLoaded = true;
  
  const js = document.createElement('script');
  js.id = 'facebook-jssdk';
  js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v15.0';
  js.async = true;
  js.defer = true;
  js.crossOrigin = 'anonymous';
  document.body.appendChild(js);
  
  // Resize handler for better embed responsiveness
  window.addEventListener('resize', function() {
    if (typeof FB !== 'undefined') {
      FB.XFBML.parse();
    }
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  loadMalaysiaFacebookPlugin();
  
  // Initialize animations if AOS is available
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });
  }
});

// Fallback for Facebook embed in case of slow loading
setTimeout(function() {
  if (typeof FB === 'undefined') {
    loadMalaysiaFacebookPlugin();
  }
}, 2000);