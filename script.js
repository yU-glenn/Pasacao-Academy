/* ================================================
   UNIVERSITY WEBSITE - Custom JavaScript
   Features: Scroll Animations, Counter, Lightbox,
             Sticky Navbar, Back to Top, Smooth Scroll
   ================================================ */

   'use strict';

   // Wait for DOM to load
   document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // 1. STICKY NAVBAR - Add shadow on scroll
    // ============================================
    const navbar = document.getElementById('mainNavbar');
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', function() {
      // Navbar shadow
      if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }

      // Back to Top button visibility
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    // ============================================
    // 2. BACK TO TOP FUNCTIONALITY
    // ============================================
    backToTopBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // ============================================
    // 3. SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const navHeight = navbar ? navbar.offsetHeight : 0;
          const topBarHeight = document.querySelector('.top-bar') ? document.querySelector('.top-bar').offsetHeight : 0;
          const totalOffset = navHeight + topBarHeight;

          // Close mobile menu if open
          const navbarCollapse = document.getElementById('navbarMain');
          if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            const toggler = document.querySelector('.navbar-toggler');
            if (toggler) {
              toggler.click();
            }
          }

          const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - totalOffset;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });

    // ============================================
    // 4. SCROLL REVEAL ANIMATIONS
    // ============================================
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    function checkReveal() {
      const windowHeight = window.innerHeight;
      const revealPoint = 150;

      revealElements.forEach(element => {
        const revealTop = element.getBoundingClientRect().top;
        if (revealTop < windowHeight - revealPoint) {
          element.classList.add('active');
        }
      });
    }

    // Initial check
    checkReveal();

    // Check on scroll
    window.addEventListener('scroll', checkReveal);

    // ============================================
    // 5. ANIMATED COUNTERS
    // ============================================
    const counters = document.querySelectorAll('.counter');
    let countersAnimated = false;

    function animateCounters() {
      if (countersAnimated) return;

      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // ms
        const step = Math.ceil(target / (duration / 16)); // ~60fps

        let current = 0;

        const updateCounter = () => {
          current += step;
          if (current >= target) {
            counter.textContent = target.toLocaleString();
            return;
          }
          counter.textContent = current.toLocaleString();
          requestAnimationFrame(updateCounter);
        };

        updateCounter();
      });

      countersAnimated = true;
    }

    // Trigger counters when stats section is visible
    const statsSection = document.querySelector('.stats-section');

    function checkStatsVisibility() {
      if (!statsSection || countersAnimated) return;

      const rect = statsSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight - 100 && rect.bottom > 0) {
        animateCounters();
      }
    }

    // Check on load and scroll
    checkStatsVisibility();
    window.addEventListener('scroll', checkStatsVisibility);

    // ============================================
    // 6. GALLERY LIGHTBOX
    // ============================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    const closeLightbox = document.getElementById('closeLightbox');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let currentImageIndex = 0;
    const galleryImages = [];

    // Collect all gallery image sources
    galleryItems.forEach(item => {
      const img = item.querySelector('img');
      if (img) {
        galleryImages.push(img.src);
      }
    });

    // Open lightbox
    galleryItems.forEach((item, index) => {
      item.addEventListener('click', function() {
        currentImageIndex = parseInt(this.getAttribute('data-index')) || index;
        openLightbox(currentImageIndex);
      });
    });

    function openLightbox(index) {
      if (!lightboxModal || !lightboxImage) return;
      lightboxImage.src = galleryImages[index];
      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    // Close lightbox
    if (closeLightbox) {
      closeLightbox.addEventListener('click', closeLightboxFn);
    }

    function closeLightboxFn() {
      if (!lightboxModal) return;
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Click outside image to close
    if (lightboxModal) {
      lightboxModal.addEventListener('click', function(e) {
        if (e.target === this) {
          closeLightboxFn();
        }
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (!lightboxModal || !lightboxModal.classList.contains('active')) return;

      if (e.key === 'Escape') {
        closeLightboxFn();
      } else if (e.key === 'ArrowLeft') {
        navigateLightbox(-1);
      } else if (e.key === 'ArrowRight') {
        navigateLightbox(1);
      }
    });

    // Lightbox navigation
    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', function() {
        navigateLightbox(-1);
      });
    }

    if (lightboxNext) {
      lightboxNext.addEventListener('click', function() {
        navigateLightbox(1);
      });
    }

    function navigateLightbox(direction) {
      if (!lightboxImage) return;

      currentImageIndex += direction;

      // Loop around
      if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
      } else if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
      }

      lightboxImage.src = galleryImages[currentImageIndex];
    }

    // ============================================
    // 7. CONTACT FORM HANDLING
    // ============================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Simple validation
        const name = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !subject || !message) {
          showFormAlert('Please fill in all required fields.', 'danger');
          return;
        }

        // Email validation
        if (!isValidEmail(email)) {
          showFormAlert('Please enter a valid email address.', 'danger');
          return;
        }

        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          contactForm.reset();
          showFormAlert('Thank you! Your message has been sent successfully. We will get back to you soon.', 'success');
        }, 1500);
      });
    }

    function showFormAlert(message, type) {
      // Remove existing alert
      const existingAlert = document.querySelector('.form-alert');
      if (existingAlert) {
        existingAlert.remove();
      }

      const alertDiv = document.createElement('div');
      alertDiv.className = `alert alert-${type} form-alert alert-dismissible fade show mt-3`;
      alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      `;

      const formWrapper = document.querySelector('.contact-form-wrapper');
      if (formWrapper) {
        formWrapper.insertBefore(alertDiv, formWrapper.firstChild);
      }

      // Auto dismiss after 5 seconds
      setTimeout(() => {
        if (alertDiv) {
          alertDiv.remove();
        }
      }, 5000);
    }

    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    // ============================================
    // 8. NAVBAR ACTIVE LINK HIGHLIGHTING
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-navbar .nav-link');

    function highlightActiveLink() {
      let currentSection = '';
      const scrollPosition = window.scrollY + 200;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          currentSection = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href && href.substring(1) === currentSection) {
          link.classList.add('active');
        }
      });
    }

    window.addEventListener('scroll', highlightActiveLink);

    // ============================================
    // 9. BOOTSTRAS CAROUSEL AUTO-PLAY SPEED
    // ============================================
    const testimonialCarousel = document.getElementById('testimonialCarousel');
    if (testimonialCarousel) {
      const carousel = new bootstrap.Carousel(testimonialCarousel, {
        interval: 5000,
        wrap: true,
        pause: 'hover'
      });
    }

    // ============================================
    // 10. PREVENT DEFAULT FOR EMPTY HASH LINKS
    // ============================================
    document.querySelectorAll('a[href="#"]').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
      });
    });

    // ============================================
    // 11. SEARCH MODAL FUNCTIONALITY
    // ============================================
    const searchOverlay = document.getElementById('searchOverlay');
    const searchToggle = document.querySelector('.nav-search');
    const searchClose = document.querySelector('.close-search-btn');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchSubmitBtn');
    const searchResults = document.getElementById('searchResults');

    // Site pages data for search
    const sitePages = [
      { title: 'Home', url: 'index.html', icon: 'fa-home', category: 'Page' },
      { title: 'About Us', url: 'about.html', icon: 'fa-info-circle', category: 'Page' },
      { title: 'Admissions', url: 'admissions.html', icon: 'fa-graduation-cap', category: 'Page' },
      { title: 'Academics', url: 'academics.html', icon: 'fa-book', category: 'Page' },
      { title: 'Research', url: 'research.html', icon: 'fa-flask', category: 'Page' },
      { title: 'Campus Life', url: 'campus-life.html', icon: 'fa-tree', category: 'Page' },
      { title: 'News & Events', url: 'news.html', icon: 'fa-newspaper', category: 'Page' },
      { title: 'Contact Us', url: 'contact.html', icon: 'fa-envelope', category: 'Page' },
      { title: 'Search', url: 'search.html', icon: 'fa-search', category: 'Page' },
      { title: 'Elementary Program', url: 'programs/elementary.html', icon: 'fa-child', category: 'Program' },
      { title: 'Junior High School', url: 'programs/junior-high.html', icon: 'fa-user-graduate', category: 'Program' },
      { title: 'Senior High School', url: 'programs/senior-high.html', icon: 'fa-users', category: 'Program' },
      { title: 'College Programs', url: 'programs/college.html', icon: 'fa-university', category: 'Program' },
      { title: 'Graduate School', url: 'programs/graduate.html', icon: 'fa-graduation-cap', category: 'Program' },
      { title: 'Technical-Vocational', url: 'programs/technical.html', icon: 'fa-tools', category: 'Program' },
      { title: 'Apply Now', url: 'admissions.html', icon: 'fa-check-circle', category: 'Admissions' },
      { title: 'Scholarships', url: 'admissions.html#scholarships', icon: 'fa-trophy', category: 'Admissions' },
      { title: 'Academic Calendar', url: 'academics.html#calendar', icon: 'fa-calendar-alt', category: 'Academics' },
      { title: 'Library', url: 'campus-life.html#library', icon: 'fa-library', category: 'Campus' },
      { title: 'Student Portal', url: 'campus-life.html#portal', icon: 'fa-user-graduate', category: 'Campus' },
      { title: 'Faculty', url: 'about.html#faculty', icon: 'fa-chalkboard-teacher', category: 'About' },
      { title: 'Alumni', url: 'about.html#alumni', icon: 'fa-users', category: 'About' }
    ];

    function openSearch() {
      if (!searchOverlay) return;
      searchOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        if (searchInput) searchInput.focus();
      }, 300);
    }

    function closeSearch() {
      if (!searchOverlay) return;
      searchOverlay.classList.remove('active');
      document.body.style.overflow = '';
      if (searchInput) searchInput.value = '';
      if (searchResults) searchResults.classList.remove('active');
    }

    if (searchToggle) {
      searchToggle.addEventListener('click', openSearch);
    }

    if (searchClose) {
      searchClose.addEventListener('click', closeSearch);
    }

    // Close on overlay click
    if (searchOverlay) {
      searchOverlay.addEventListener('click', function(e) {
        if (e.target === this) closeSearch();
      });
    }

    // Keyboard shortcut: Ctrl+K or / to open search
    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName))) {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape' && searchOverlay && searchOverlay.classList.contains('active')) {
        closeSearch();
      }
    });

    // Live search filtering
    function performSearch(query) {
      if (!searchResults) return;
      const q = query.toLowerCase().trim();

      if (q.length < 1) {
        searchResults.classList.remove('active');
        return;
      }

      const matches = sitePages.filter(page =>
        page.title.toLowerCase().includes(q) ||
        page.category.toLowerCase().includes(q)
      );

      if (matches.length === 0) {
        searchResults.innerHTML = `
          <div class="result-item" style="cursor:default;justify-content:center;">
            <div class="result-text text-center">
              <h6>No results found</h6>
              <small>Try searching for "Admissions", "Programs", etc.</small>
            </div>
          </div>
        `;
      } else {
        searchResults.innerHTML = matches.slice(0, 8).map(page => `
          <a href="${page.url}" class="result-item">
            <i class="fas ${page.icon}"></i>
            <div class="result-text">
              <h6>${page.title}</h6>
              <small>${page.category}</small>
            </div>
          </a>
        `).join('');
      }

      searchResults.classList.add('active');
    }

    if (searchInput) {
      searchInput.addEventListener('input', function() {
        performSearch(this.value);
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener('click', function() {
        const q = searchInput ? searchInput.value.trim() : '';
        if (q) {
          window.location.href = 'search.html?q=' + encodeURIComponent(q);
        }
      });
    }

    // Enter key submits to search page
    if (searchInput) {
      searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          const q = this.value.trim();
          if (q) {
            window.location.href = 'search.html?q=' + encodeURIComponent(q);
          }
        }
      });
    }

    // ============================================
    // 12. PAGE TRANSITIONS
    // ============================================
    // Add transition overlay to body
    const transitionOverlay = document.createElement('div');
    transitionOverlay.className = 'page-transition-overlay';
    transitionOverlay.innerHTML = '<div class="transition-layer"></div>';
    document.body.appendChild(transitionOverlay);

    // Intercept all internal navigation links
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href || href === '#' || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
      if (link.getAttribute('target') === '_blank') return;

      e.preventDefault();
      const targetUrl = href;

      // Activate transition
      transitionOverlay.classList.add('active');

      setTimeout(() => {
        window.location.href = targetUrl;
      }, 400);
    });

    // Exit transition on page load
    window.addEventListener('pageshow', function() {
      transitionOverlay.classList.remove('active');
      transitionOverlay.classList.add('exit');
      setTimeout(() => {
        transitionOverlay.classList.remove('exit');
      }, 500);
    });

    // ============================================
    // 13. MOBILE NAV ENHANCEMENT - Accordion submenus
    // ============================================
    const navbarCollapse = document.getElementById('navbarMain');
    if (navbarCollapse) {
      // Find dropdown toggles and make them accordion-style on mobile
      const dropdownToggles = navbarCollapse.querySelectorAll('.nav-item.dropdown > .nav-link, .nav-item.mega-menu > .nav-link');
      dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
          // Only on mobile (when collapse is shown)
          if (window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
            e.preventDefault();
            const parent = this.closest('.nav-item');
            const menu = parent.querySelector('.dropdown-menu');
            if (menu) {
              const isOpen = menu.classList.contains('show');
              // Close all other open menus
              navbarCollapse.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
              if (!isOpen) {
                menu.classList.add('show');
              }
            }
          }
        });
      });
    }

    // ============================================
    // 14. ENHANCED FORM VALIDATION (Real-time)
    // ============================================
    const contactFormFields = document.querySelectorAll('#contactForm .form-control');
    contactFormFields.forEach(field => {
      field.addEventListener('blur', function() {
        validateField(this);
      });
      field.addEventListener('input', function() {
        // Remove error state while typing
        if (this.classList.contains('is-invalid')) {
          if (this.value.trim()) {
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
          }
        }
      });
    });

    function validateField(field) {
      const value = field.value.trim();
      const isRequired = field.hasAttribute('required');

      if (!isRequired) return;

      if (!value) {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
        return false;
      }

      if (field.type === 'email' && !isValidEmail(value)) {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
        return false;
      }

      field.classList.remove('is-invalid');
      field.classList.add('is-valid');
      return true;
    }

    // Override original form submit with enhanced validation
    if (contactForm) {
      const originalSubmit = contactForm.onsubmit;
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const fields = [
          { el: document.getElementById('fullName'), label: 'Full Name' },
          { el: document.getElementById('email'), label: 'Email Address' },
          { el: document.getElementById('subject'), label: 'Subject' },
          { el: document.getElementById('message'), label: 'Message' }
        ];

        let isValid = true;
        fields.forEach(f => {
          if (f.el) {
            if (!validateField(f.el)) {
              isValid = false;
            }
          }
        });

        if (!isValid) {
          showFormAlert('Please fill in all required fields correctly.', 'danger');
          return;
        }

        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          contactForm.reset();
          // Clear validation states
          contactFormFields.forEach(f => {
            f.classList.remove('is-valid', 'is-invalid');
          });
          showFormAlert('Thank you! Your message has been sent successfully. We will get back to you soon.', 'success');
        }, 1500);
      });
    }

    // ============================================
    // 15. BREADCRUMB AUTO-GENERATION
    // ============================================
    function generateBreadcrumbs() {
      const breadcrumbContainer = document.querySelector('.breadcrumb-section .breadcrumb');
      if (!breadcrumbContainer) return;

      const path = window.location.pathname;
      const filename = path.split('/').pop() || 'index.html';
      const pageName = filename.replace('.html', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

      // Keep existing breadcrumb items if any, otherwise generate
      const existingItems = breadcrumbContainer.querySelectorAll('.breadcrumb-item');
      if (existingItems.length > 1) return; // Already has breadcrumbs

      // Clear
      breadcrumbContainer.innerHTML = '';

      // Home
      const homeItem = document.createElement('li');
      homeItem.className = 'breadcrumb-item';
      homeItem.innerHTML = '<a href="index.html"><i class="fas fa-home me-1"></i>Home</a>';
      breadcrumbContainer.appendChild(homeItem);

      // Check if it's a sub-page
      if (path.includes('/programs/')) {
        const programsItem = document.createElement('li');
        programsItem.className = 'breadcrumb-item';
        programsItem.innerHTML = '<a href="../academics.html">Academics</a>';
        breadcrumbContainer.appendChild(programsItem);
      }

      // Current page
      if (filename !== 'index.html') {
        const currentItem = document.createElement('li');
        currentItem.className = 'breadcrumb-item active';
        currentItem.setAttribute('aria-current', 'page');
        currentItem.textContent = pageName;
        breadcrumbContainer.appendChild(currentItem);
      }
    }

    generateBreadcrumbs();

    // ============================================
    // 16. NAVBAR BRAND LINK TO HOME
    // ============================================
    const brandLink = document.querySelector('.navbar-brand');
    if (brandLink && brandLink.getAttribute('href') === '#') {
      brandLink.setAttribute('href', 'index.html');
    }

    console.log('Premier University website initialized successfully.');
   });

