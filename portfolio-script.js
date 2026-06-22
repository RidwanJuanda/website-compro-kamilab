// Portfolio Filter Functionality
(function () {
    'use strict';

    const filterButtons = document.querySelectorAll('.portfolio-filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterButtons.length === 0 || portfolioItems.length === 0) {
        return;
    }

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Get filter value
            const filterValue = this.getAttribute('data-filter');

            // Filter portfolio items
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'block';
                    // Add fade in animation
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });

            // Toggle branding description visibility
            const brandingDesc = document.getElementById('branding-description');
            if (brandingDesc) {
                if (filterValue === 'branding') {
                    brandingDesc.style.display = 'block';
                } else {
                    brandingDesc.style.display = 'none';
                }
            }
        });
    });

    // Initialize all items as visible
    portfolioItems.forEach(item => {
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
    });

    // Check for hash in URL to apply filter automatically
    function checkHashFilter() {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            // Find button with matching data-filter
            const targetButton = document.querySelector(`.portfolio-filter-btn[data-filter="${hash}"]`);
            if (targetButton) {
                // Trigger click on the button
                targetButton.click();

                // Scroll to portfolio section
                const portfolioSection = document.querySelector('.portfolio-section');
                if (portfolioSection) {
                    setTimeout(() => {
                        portfolioSection.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                }
            }
        }
    }

    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkHashFilter);
    } else {
        checkHashFilter();
    }
})();

// Set Active Navigation State for Portfolio Page
(function () {
    'use strict';

    const navLinks = document.querySelectorAll('.nav-link');

    // Remove active class from all links
    navLinks.forEach(link => link.classList.remove('active'));

    // Add active class to Portfolio link
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === 'portfolio.html' || href.includes('portfolio.html')) {
            link.classList.add('active');
        }
    });
})();

// Mobile Menu Toggle for Portfolio Page
// Note: Mobile menu toggle is handled by script.js, so we skip it here to avoid double event listeners
// This function is kept for portfolio-specific menu handling if needed in the future

// Portfolio Image Modal Popup with Zoom
(function () {
    'use strict';

    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalDescription = document.getElementById('modalDescription');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.querySelector('.modal-overlay');
    const portfolioImages = document.querySelectorAll('.portfolio-image-clickable');

    if (!modal || !modalImage || !modalDescription || !modalClose) {
        return;
    }

    // Function to open modal
    function openModal(imageSrc, description) {
        modalImage.src = imageSrc;
        modalImage.classList.remove('zoomed'); // Reset zoom state
        modalDescription.textContent = description || '';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    // Function to close modal
    function closeModal() {
        modal.classList.remove('active');
        modalImage.classList.remove('zoomed'); // Reset zoom state
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Add click event listeners to portfolio images
    portfolioImages.forEach(image => {
        image.addEventListener('click', function (e) {
            e.stopPropagation();
            const imageSrc = this.src;
            const description = this.getAttribute('data-description') || '';
            openModal(imageSrc, description);
        });
    });

    // Close modal when clicking close button
    modalClose.addEventListener('click', function (e) {
        e.stopPropagation();
        closeModal();
    });

    // Close modal when clicking overlay
    modalOverlay.addEventListener('click', function (e) {
        e.stopPropagation();
        closeModal();
    });

    // Close modal when pressing Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Zoom functionality on image click
    modalImage.addEventListener('click', function (e) {
        e.stopPropagation();
        this.classList.toggle('zoomed');
    });

    // Prevent modal from closing when clicking on image container
    const modalImageContainer = document.querySelector('.modal-image-container');
    if (modalImageContainer) {
        modalImageContainer.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }

    // Prevent modal from closing when clicking on description
    const modalDescElement = document.querySelector('.modal-description');
    if (modalDescElement) {
        modalDescElement.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }
})();

// Portfolio Modal
(function () {
    'use strict';

    let currentModalSlide = 0;
    let modalImages = [];

    function openModal(card) {
        console.log('Opening modal for card:', card);
        const modal = document.getElementById('portfolioModal');
        const modalOverlay = modal.querySelector('.portfolio-modal-overlay');
        const modalClose = modal.querySelector('.portfolio-modal-close');
        const modalSlider = modal.querySelector('.portfolio-modal-slider');
        const modalTitle = modal.querySelector('.portfolio-modal-title');
        const modalDesc = modal.querySelector('.portfolio-modal-desc');
        const prevBtn = modal.querySelector('.portfolio-modal-slider-prev');
        const nextBtn = modal.querySelector('.portfolio-modal-slider-next');

        const title = card.dataset.title;
        const desc = card.dataset.desc;
        const images = JSON.parse(card.dataset.images || '[]');

        modalTitle.textContent = title;
        modalDesc.textContent = desc;
        modalImages = images;
        currentModalSlide = 0;

        // Render images
        modalSlider.innerHTML = images.map(img => `
            <img src="${img}" alt="${title}" loading="lazy">
        `).join('');

        function updateSliderPosition() {
            modalSlider.style.transform = `translateX(-${currentModalSlide * 100}%)`;
        }

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        function prevSlide() {
            if (currentModalSlide > 0) {
                currentModalSlide--;
            } else {
                currentModalSlide = modalImages.length - 1;
            }
            updateSliderPosition();
        }

        function nextSlide() {
            if (currentModalSlide < modalImages.length - 1) {
                currentModalSlide++;
            } else {
                currentModalSlide = 0;
            }
            updateSliderPosition();
        }

        // Re-add listeners since we're inside openModal now
        modalClose.onclick = closeModal;
        modalOverlay.onclick = closeModal;
        prevBtn.onclick = prevSlide;
        nextBtn.onclick = nextSlide;

        updateSliderPosition();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function initPortfolioModal() {
        console.log('Initializing portfolio modal...');
        const portfolioBtns = document.querySelectorAll('.portfolio-card-btn');
        console.log('Found buttons:', portfolioBtns.length);
        
        portfolioBtns.forEach(btn => {
            btn.addEventListener('click', function (e) {
                console.log('Button clicked!');
                e.preventDefault();
                e.stopPropagation();
                const card = this.closest('.portfolio-card');
                if (card) {
                    openModal(card);
                }
            });
        });

        // Close on escape key
        document.addEventListener('keydown', function (e) {
            const modal = document.getElementById('portfolioModal');
            if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPortfolioModal);
    } else {
        initPortfolioModal();
    }
})();
