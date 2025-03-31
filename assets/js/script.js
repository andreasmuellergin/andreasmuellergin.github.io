// Wait for the DOM (HTML structure) to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // Get references to the necessary elements
    const heroSection = document.getElementById('start');
    const fadeOverlay = document.querySelector('.hero-fade-overlay');

    // Check if both elements were found
    if (!heroSection || !fadeOverlay) {
        console.error("Required elements for hero fade effect not found.");
        return; // Stop if elements are missing
    }

    // Function to calculate and apply the fade effect
    const handleScrollFade = () => {
        // Get the current vertical scroll position
        const scrollY = window.scrollY || window.pageYOffset;

        // Get the height of the hero section
        const heroHeight = heroSection.offsetHeight;

        // Determine the point where the fade should be complete
        // You can adjust this value (e.g., heroHeight * 0.8 for faster fade)
        const fadeEndScroll = heroHeight * 0.9; // Fade completes when 90% of hero is scrolled

        // Calculate the desired opacity (0 to 1) based on scroll position
        let opacity = scrollY / fadeEndScroll;

        // Clamp the opacity value to be between 0 and 1
        opacity = Math.min(1, Math.max(0, opacity));

        // Apply the calculated opacity to the overlay element
        // Using requestAnimationFrame can sometimes smooth animations, but direct style is often fine here
        fadeOverlay.style.opacity = opacity;
    };

    // Add an event listener to the window for the 'scroll' event
    // { passive: true } is a performance optimization for scroll listeners
    window.addEventListener('scroll', handleScrollFade, { passive: true });

    // Optional: Call the function once on load in case the page loads already scrolled
    handleScrollFade();




    // Select all elements that should be animated
    const animatedSections = document.querySelectorAll('.animate-on-scroll');

    // Check if any elements to animate were found
    if (animatedSections.length > 0) {

        // Intersection Observer configuration
        const observerOptions = {
            root: null, // Use the viewport as the root
            rootMargin: '0px', // No margin
            threshold: 0.15 // Trigger when 15% of the element is visible
        };

        // Callback function for the observer
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                // If the element is intersecting (visible)
                if (entry.isIntersecting) {
                    // Add the 'is-visible' class to trigger the animation
                    entry.target.classList.add('is-visible');
                    // Stop observing the element once it's visible (optional but good practice)
                    observer.unobserve(entry.target);
                }
                // No 'else' needed here - we don't want to re-hide it when scrolling up
            });
        };

        // Create the Intersection Observer
        const intersectionObserver = new IntersectionObserver(observerCallback, observerOptions);

        // Start observing each animated section
        animatedSections.forEach(section => {
            intersectionObserver.observe(section);
        });

    } else {
        console.log("No elements found with the class 'animate-on-scroll'.");
    }

});