// Load Header and Footer Components
document.addEventListener('DOMContentLoaded', function() {
    // Determine which header file to use based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const headerFile = currentPage === 'index.html' ? 'header-index.html' : 'header.html';

    // Load Header
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        fetch(headerFile)
            .then(response => response.text())
            .then(data => {
                headerPlaceholder.innerHTML = data;
            })
            .catch(error => {
                console.error('Error loading header:', error);
            });
    }

    // Load Footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        fetch('footer.html')
            .then(response => response.text())
            .then(data => {
                footerPlaceholder.innerHTML = data;
            })
            .catch(error => {
                console.error('Error loading footer:', error);
            });
    }
});

