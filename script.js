// Navigation toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });

    // Close menu when window is resized above mobile breakpoint
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
        }
    });

    // --- Animations: load and scroll-triggered ---
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Helper: add animation classes with optional delay (ms)
    function reveal(el, delay = 0, className = 'in') {
        if (!el) return;
        el.classList.add('animate');
        if (prefersReduced) {
            el.classList.add(className);
            return;
        }
        if (delay) {
            el.style.transitionDelay = (delay / 1000) + 's';
        }
        // trigger in next frame
        requestAnimationFrame(() => el.classList.add(className));
        // clear inline style after transition to avoid persisting delay (match longer duration)
        setTimeout(() => el.style.transitionDelay = '', (delay || 0) + 1400);
    }

    // Staggered load animations
    const loadEls = document.querySelectorAll('.animate-on-load');
    loadEls.forEach((el, i) => {
        const delay = i * 140 + 200; // slower stagger
        // for nav items, make sure they use li children timing
        reveal(el, delay, 'in');
    });

    // Scroll-triggered reveals using IntersectionObserver
    const scrollEls = document.querySelectorAll('.animate-on-scroll, .layout-image');
    if ('IntersectionObserver' in window && !prefersReduced) {
        const io = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    reveal(el, 0, 'in-view');
                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.12 });
        scrollEls.forEach(el => io.observe(el));
    } else {
        // fallback: reveal immediately
        scrollEls.forEach(el => reveal(el, 0, 'in-view'));
    }

    // --- Image Fade Container Functionality ---
    function initImageFadeContainers() {
        const containers = document.querySelectorAll('.image-fade-container');
        
        containers.forEach(container => {
            const images = container.querySelectorAll('.fade-image');
            
            // Only proceed if there are at least 2 images
            if (images.length < 2) return;
            
            // Get transition duration from data attribute (in seconds)
            const duration = parseFloat(container.dataset.transitionDuration) || 6;
            
            // Set CSS variable for animation duration
            container.style.setProperty('--fade-duration', `${duration}s`);
            
            // Activate the container to start animations
            container.classList.add('active');
            
            // Optional: Manual control with JavaScript for more complex scenarios
            let currentIndex = 0;
            const imageCount = images.length;
            
            // Function to switch images manually (can be used for custom controls)
            container.switchImage = function(index) {
                if (index >= 0 && index < imageCount) {
                    images.forEach((img, i) => {
                        img.style.opacity = i === index ? '1' : '0';
                    });
                    currentIndex = index;
                }
            };
            
            // Function to go to next image
            container.nextImage = function() {
                currentIndex = (currentIndex + 1) % imageCount;
                this.switchImage(currentIndex);
            };
            
            // Function to go to previous image
            container.prevImage = function() {
                currentIndex = (currentIndex - 1 + imageCount) % imageCount;
                this.switchImage(currentIndex);
            };
        });
    }
    
    // Initialize image fade containers
    initImageFadeContainers();
    
    // Reinitialize if new containers are added dynamically
    window.initImageFadeContainers = initImageFadeContainers;
});
