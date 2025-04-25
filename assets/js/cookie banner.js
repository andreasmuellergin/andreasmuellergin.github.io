// Wait for the DOM (HTML structure) to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('cookiesAccepted') === 'true') {
        return; // Don't show banner if already accepted
    }

    // Get the banner and button elements
    var banner = document.getElementById('cookie-banner');
    var acceptButton = document.getElementById('accept-cookies');

    // If elements exist, show the banner
    if (banner && acceptButton) {
        banner.style.display = 'block'; // Show the banner

        // Add event listener to the accept button
        acceptButton.addEventListener('click', function() {
            localStorage.setItem('cookiesAccepted', 'true'); // Store acceptance
            banner.style.display = 'none'; // Hide the banner
        });
    }
});