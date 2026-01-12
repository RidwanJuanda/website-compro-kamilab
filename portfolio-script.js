// Portfolio Filter Functionality
(function() {
    'use strict';
    
    const filterButtons = document.querySelectorAll('.portfolio-filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (filterButtons.length === 0 || portfolioItems.length === 0) {
        return;
    }
    
    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
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
        });
    });
    
    // Initialize all items as visible
    portfolioItems.forEach(item => {
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
    });
})();

// Set Active Navigation State for Portfolio Page
(function() {
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
(function() {
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
        image.addEventListener('click', function(e) {
            e.stopPropagation();
            const imageSrc = this.src;
            const description = this.getAttribute('data-description') || '';
            openModal(imageSrc, description);
        });
    });
    
    // Close modal when clicking close button
    modalClose.addEventListener('click', function(e) {
        e.stopPropagation();
        closeModal();
    });
    
    // Close modal when clicking overlay
    modalOverlay.addEventListener('click', function(e) {
        e.stopPropagation();
        closeModal();
    });
    
    // Close modal when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Zoom functionality on image click
    modalImage.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('zoomed');
    });
    
    // Prevent modal from closing when clicking on image container
    const modalImageContainer = document.querySelector('.modal-image-container');
    if (modalImageContainer) {
        modalImageContainer.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Prevent modal from closing when clicking on description
    const modalDescElement = document.querySelector('.modal-description');
    if (modalDescElement) {
        modalDescElement.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
})();
