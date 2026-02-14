// Hero Slider Functionality
(function () {
    'use strict';

    let currentSlide = 0;
    let slideInterval = null;
    let slides = [];
    let dots = [];

    // Function to initialize slider
    function initSlider() {
        slides = document.querySelectorAll('.slide');
        dots = document.querySelectorAll('.dot');

        // Silently return if slides don't exist (e.g., on portfolio page)
        if (slides.length === 0) {
            return;
        }

        // Function to show specific slide
        function showSlide(index) {
            if (index < 0 || index >= slides.length) return;

            // Remove active class from all slides and dots
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));

            // Add active class to current slide and dot
            if (slides[index]) {
                slides[index].classList.add('active');
            }
            if (dots[index]) {
                dots[index].classList.add('active');
            }

            currentSlide = index;
        }

        // Function to go to next slide
        function nextSlide() {
            const next = (currentSlide + 1) % slides.length;
            showSlide(next);
        }

        // Function to start auto-play
        function startSlider() {
            // Clear any existing interval
            if (slideInterval) {
                clearInterval(slideInterval);
            }
            slideInterval = setInterval(nextSlide, 4000); // Change slide every 2 seconds
        }

        // Function to stop auto-play
        function stopSlider() {
            if (slideInterval) {
                clearInterval(slideInterval);
                slideInterval = null;
            }
        }

        // Add click event to dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function () {
                showSlide(index);
                stopSlider();
                startSlider(); // Restart auto-play after manual navigation
            });
        });

        // Pause slider on hover
        const slider = document.querySelector('.hero-slider');
        if (slider) {
            slider.addEventListener('mouseenter', stopSlider);
            slider.addEventListener('mouseleave', startSlider);
        }

        // Start the slider
        startSlider();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSlider);
    } else {
        // DOM is already ready
        initSlider();
    }
})();

// Mobile Menu Toggle
(function () {
    'use strict';

    // Prevent multiple initializations
    if (window.mobileMenuInitialized) {
        return;
    }
    window.mobileMenuInitialized = true;

    function initMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mainNav = document.getElementById('mainNav');
        const navLinks = document.querySelectorAll('.nav-link, .dropdown-link');

        if (!mobileMenuToggle || !mainNav) {
            // Retry after a short delay if elements not found
            setTimeout(initMobileMenu, 100);
            return;
        }

        // Remove any existing event listeners by cloning
        const newToggle = mobileMenuToggle.cloneNode(true);
        mobileMenuToggle.parentNode.replaceChild(newToggle, mobileMenuToggle);
        const toggle = document.getElementById('mobileMenuToggle');

        // Function to toggle menu
        let isToggling = false;
        function toggleMenu(e) {
            if (isToggling) return;
            isToggling = true;

            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            const isActive = toggle.classList.contains('active');
            toggle.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
            console.log('Menu toggled:', !isActive ? 'opened' : 'closed');
            setTimeout(() => { isToggling = false; }, 100);
        }

        // Use single touch event to avoid double triggering
        let touchStartTime = 0;
        toggle.addEventListener('touchstart', function (e) {
            touchStartTime = Date.now();
            e.stopPropagation();
        }, { passive: true });

        toggle.addEventListener('touchend', function (e) {
            e.preventDefault();
            e.stopPropagation();
            // Only trigger if touch was quick (not a scroll)
            if (Date.now() - touchStartTime < 300) {
                toggleMenu(e);
            }
        }, { passive: false });

        // Click event for desktop/mouse
        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu(e);
        }, { passive: false });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                toggle.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (mainNav.classList.contains('active') &&
                !mainNav.contains(e.target) &&
                !toggle.contains(e.target)) {
                toggle.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileMenu);
    } else {
        initMobileMenu();
    }
})();

// Navigation Active State
(function () {
    'use strict';

    // Skip navigation active state logic if on portfolio page or muda-konsultan page
    if (window.location.pathname.includes('portfolio.html') || window.location.pathname.includes('muda-konsultan.html') || window.location.pathname.includes('privacy-policy.html') || window.location.pathname.includes('blog.html') || window.location.pathname.includes('our-products.html') || window.location.pathname.includes('our-services.html')) {
        return;
    }

    const navLinks = document.querySelectorAll('.nav-link, .dropdown-link');

    // Function to update active state based on current section
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY;
        const windowHeight = window.innerHeight;
        const headerOffset = 150; // Offset untuk header sticky dan padding

        // Remove active from all links first
        navLinks.forEach(link => link.classList.remove('active'));

        // If at top of page, set Home as active
        if (scrollPos < 100) {
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === 'index.html' || href === '#' || href === '/' || href.includes('index.html')) {
                    link.classList.add('active');
                }
            });
            return;
        }

        // First, check if footer/kontak section is visible in viewport
        const footerSection = document.getElementById('kontak');
        if (footerSection) {
            const footerRect = footerSection.getBoundingClientRect();
            // If footer is visible in viewport (even partially), activate Contact Us
            if (footerRect.top < windowHeight && footerRect.bottom > 0) {
                // Check if footer is significantly visible (more than 20% of viewport)
                const footerVisibleHeight = Math.min(footerRect.bottom, windowHeight) - Math.max(footerRect.top, 0);
                const viewportRatio = footerVisibleHeight / windowHeight;

                if (viewportRatio > 0.2 || footerRect.top < windowHeight * 0.5) {
                    navLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href === '#kontak') {
                            link.classList.add('active');
                            return;
                        }
                    });
                    return;
                }
            }
        }

        // Find current section based on scroll position
        let currentSection = null;
        let maxVisibleRatio = 0;

        // Check each section to see which one is most visible
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionId = section.getAttribute('id');

            // Skip footer section in this check (already handled above)
            if (sectionId === 'kontak') {
                return;
            }

            // Calculate visible area of section
            const visibleTop = Math.max(rect.top, 0);
            const visibleBottom = Math.min(rect.bottom, windowHeight);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            const sectionHeight = rect.height;

            // Calculate ratio of visible area
            const visibleRatio = sectionHeight > 0 ? visibleHeight / sectionHeight : 0;

            // Check if section is significantly visible in viewport
            if (rect.top < windowHeight - headerOffset && rect.bottom > headerOffset && visibleRatio > 0.3) {
                if (visibleRatio > maxVisibleRatio) {
                    maxVisibleRatio = visibleRatio;
                    currentSection = sectionId;
                }
            }
        });

        // Update nav links based on current section
        if (currentSection) {
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        } else {
            // If no section found, find nearest section based on scroll position
            let nearestSection = null;
            let minDistance = Infinity;

            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const sectionTop = rect.top + scrollPos;
                const sectionId = section.getAttribute('id');

                // Skip footer in nearest calculation (already handled)
                if (sectionId === 'kontak') {
                    return;
                }

                // Calculate distance from scroll position to section top
                const distance = Math.abs(scrollPos - (sectionTop - headerOffset));

                // Prefer sections that are above or at current scroll position
                if (sectionTop <= scrollPos + headerOffset + 100) {
                    if (distance < minDistance) {
                        minDistance = distance;
                        nearestSection = sectionId;
                    }
                }
            });

            if (nearestSection) {
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `#${nearestSection}`) {
                        link.classList.add('active');
                    }
                });
            } else {
                // Fallback to Home if nothing found
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === 'index.html' || href === '#' || href === '/' || href.includes('index.html')) {
                        link.classList.add('active');
                    }
                });
            }
        }
    }

    // Update active state on click
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Handle anchor links with smooth scroll
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    // Update URL hash
                    history.pushState(null, null, href);

                    // Smooth scroll to target
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Update active state after scroll completes (let scroll detection handle it)
                    setTimeout(updateActiveNav, 800);
                }
            } else if (href === 'index.html' || href.includes('index.html')) {
                // Scroll to top for home link
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                history.pushState(null, null, window.location.pathname);
                setTimeout(updateActiveNav, 800);
            }
        });
    });

    // Update active state on scroll (throttled for performance)
    let scrollTimeout;
    let isScrolling = false;

    window.addEventListener('scroll', function () {
        if (!isScrolling) {
            window.requestAnimationFrame(function () {
                updateActiveNav();
                isScrolling = false;
            });
            isScrolling = true;
        }

        // Also use timeout as backup
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function () {
            updateActiveNav();
        }, 150);
    }, { passive: true });

    // Update active state on hash change
    window.addEventListener('hashchange', function () {
        setTimeout(updateActiveNav, 100);
    });

    // Update active state on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            setTimeout(updateActiveNav, 100);
        });
    } else {
        setTimeout(updateActiveNav, 100);
    }
})();

// Hero Banner Image Slider
(function () {
    'use strict';

    let currentImageIndex = 0;
    let bannerInterval = null;
    const bannerImages = document.querySelectorAll('.hero-banner-image');

    // Function to show specific image
    function showBannerImage(index) {
        if (bannerImages.length === 0) return;

        // Remove active class from all images
        bannerImages.forEach(img => img.classList.remove('active'));

        // Add active class to current image
        if (bannerImages[index]) {
            bannerImages[index].classList.add('active');
        }

        currentImageIndex = index;
    }

    // Function to go to next image
    function nextBannerImage() {
        const next = (currentImageIndex + 1) % bannerImages.length;
        showBannerImage(next);
    }

    // Function to start auto-play
    function startBannerSlider() {
        // Clear any existing interval
        if (bannerInterval) {
            clearInterval(bannerInterval);
        }
        // Change image every 5 seconds (5000ms)
        bannerInterval = setInterval(nextBannerImage, 4000);
    }

    // Function to stop auto-play
    function stopBannerSlider() {
        if (bannerInterval) {
            clearInterval(bannerInterval);
            bannerInterval = null;
        }
    }

    // Initialize banner slider
    function initBannerSlider() {
        // Silently return if banner images don't exist (e.g., on portfolio page)
        if (bannerImages.length === 0) {
            return;
        }

        // Show first image
        showBannerImage(0);

        // Start auto-play
        startBannerSlider();

        // Pause slider on hover
        const heroImage = document.querySelector('.hero-image');
        if (heroImage) {
            heroImage.addEventListener('mouseenter', stopBannerSlider);
            heroImage.addEventListener('mouseleave', startBannerSlider);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBannerSlider);
    } else {
        initBannerSlider();
    }
})();

// Contact Form WhatsApp Redirect
(function () {
    'use strict';

    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const message = document.getElementById('contactMessage').value.trim();

            // Validate all fields
            if (!name) {
                alert('Please fill in the Name field');
                document.getElementById('contactName').focus();
                return;
            }

            if (!email) {
                alert('Please fill in the Email field');
                document.getElementById('contactEmail').focus();
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please fill in the Email field with the correct format');
                document.getElementById('contactEmail').focus();
                return;
            }

            if (!message) {
                alert('Please fill in the Message field');
                document.getElementById('contactMessage').focus();
                return;
            }

            // Format message for WhatsApp
            let whatsappMessage = `Halo KamiLab Team, saya ${name}.\n\nEmail: ${email}\n\nPesan:\n${message}`;

            // Add hardcoded text for Muda Konsultan page
            if (window.location.pathname.includes('muda-konsultan.html')) {
                whatsappMessage = `Halo KamiLab Team, saya ${name}.\n\nEmail: ${email}\n\nPesan:\nHallo kamilab keuangan, Saya ingin konsultasi mengenai keuangan & pajak\n\n${message}`;
            }

            // Encode message for URL
            const encodedMessage = encodeURIComponent(whatsappMessage);

            // WhatsApp number
            const phoneNumber = '+6285183050289';

            // Create WhatsApp URL
            const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

            // Open WhatsApp in new tab
            window.open(whatsappURL, '_blank');

            // Optional: Reset form after redirect
            // contactForm.reset();
        });
    }
})();

// Technologies Show More Toggle
(function () {
    'use strict';

    function initTechShowMore() {
        const btn = document.getElementById('techShowMoreBtn');
        const grid = document.getElementById('techGrid');

        if (!btn || !grid) return;

        btn.addEventListener('click', function () {
            grid.classList.remove('collapsed');
            btn.parentElement.style.display = 'none';
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTechShowMore);
    } else {
        initTechShowMore();
    }
})();

// Scroll to Top Button
(function () {
    'use strict';

    function initScrollToTop() {
        // Create button element dynamically
        const button = document.createElement('button');
        button.className = 'scroll-to-top';
        button.setAttribute('aria-label', 'Scroll to top');
        button.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 19V5M5 12L12 5L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;

        document.body.appendChild(button);

        // Show/Hide logic
        function toggleButton() {
            if (window.scrollY > 300) {
                button.classList.add('show');
            } else {
                button.classList.remove('show');
            }
        }

        // Scroll listener
        window.addEventListener('scroll', toggleButton, { passive: true });

        // Click listener
        button.addEventListener('click', function (e) {
            e.preventDefault();

            // Check if at bottom of page (allow 50px buffer)
            const isAtBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50;

            if (isAtBottom) {
                // Instant scroll if at bottom
                window.scrollTo({
                    top: 0,
                    behavior: 'instant'
                });
            } else {
                // Smooth scroll otherwise
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollToTop);
    } else {
        initScrollToTop();
    }
})();

// Scroll Animation Observer
(function () {
    'use strict';

    function initScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px', // Trigger slightly before element leaves viewport, but mainly when it enters
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, observerOptions);

        const fadeElements = document.querySelectorAll('.fade-in-section');
        fadeElements.forEach(el => observer.observe(el));

        // Fallback: If intersection observer fails or for elements already in view that didn't trigger
        setTimeout(() => {
            fadeElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    el.classList.add('is-visible');
                }
            });
        }, 500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollAnimations);
    } else {
        initScrollAnimations();
    }
})();

// Business Process Interactive Timeline
(function () {
    'use strict';

    function initTimelineAnimations() {
        const steps = document.querySelectorAll('.bp-step');
        const progressLine = document.querySelector('.bp-line-progress');
        const timelineWrapper = document.querySelector('.bp-timeline-wrapper');

        if (steps.length === 0 || !progressLine) return;

        // Observer to toggle active state on steps
        const observerOptions = {
            root: null,
            rootMargin: '-40% 0px -40% 0px', // Active when in middle 20% of screen
            threshold: 0
        };

        const stepObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    updateProgress();
                } else {
                    // Optional: remove active class when scrolling out
                    // entry.target.classList.remove('active');
                }
            });
        }, observerOptions);

        steps.forEach(step => stepObserver.observe(step));

        // Function to update progress line based on active steps
        function updateProgress() {
            // Find the last active step index
            let lastActiveIndex = -1;
            steps.forEach((step, index) => {
                if (step.classList.contains('active')) {
                    lastActiveIndex = index;
                }
            });

            if (lastActiveIndex >= 0) {
                const totalSteps = steps.length;
                // Calculate percentage: if 5 steps, 4 intervals.
                // Step index 0 = 0%, 1 = 25%, 2 = 50%, 3 = 75%, 4 = 100%
                const percentage = (lastActiveIndex / (totalSteps - 1)) * 100;

                // Check media query for mobile vs desktop logic
                if (window.innerWidth >= 993) {
                    // Desktop: Width
                    progressLine.style.width = `${percentage}%`;
                    progressLine.style.height = '1px';
                } else {
                    // Mobile: Height
                    progressLine.style.height = `${percentage}%`;
                    progressLine.style.width = '1px';
                }
            }
        }

        // Update on resize too
        window.addEventListener('resize', updateProgress);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTimelineAnimations);
    } else {
        initTimelineAnimations();
    }
})();

// PDF Download Tracking
(function () {
    'use strict';

    const downloadBtn = document.getElementById('downloadProfileBtn');

    if (downloadBtn) {
        downloadBtn.addEventListener('click', function () {
            // Check if gtag is loaded
            if (typeof gtag === 'function') {
                gtag('event', 'download_company_profile', {
                    'event_category': 'Engagement',
                    'event_label': 'Company Profile PDF',
                    'value': 1,
                    'file_name': 'profile-perusahaan-kamilab.pdf'
                });
                console.log('GA4 Event Tracked: download_company_profile');
            } else {
                console.warn('Google Analytics (gtag) not loaded or blocked.');
            }
        });
    }
})();
