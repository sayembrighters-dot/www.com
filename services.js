// Services Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animate stats on scroll
    const animateStats = () => {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = target.textContent;
                    
                    // Extract number from string (e.g., "500+" -> 500)
                    const numMatch = finalValue.match(/\d+/);
                    if (numMatch) {
                        const num = parseInt(numMatch[0]);
                        const suffix = finalValue.replace(/\d+/, '');
                        
                        let current = 0;
                        const increment = num / 50;
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= num) {
                                target.textContent = num + suffix;
                                clearInterval(timer);
                            } else {
                                target.textContent = Math.floor(current) + suffix;
                            }
                        }, 30);
                    }
                    
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(stat => observer.observe(stat));
    };

    animateStats();

    // Add parallax effect to hero gradient
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroGradient = document.querySelector('.hero-gradient');
        if (heroGradient) {
            heroGradient.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Service card hover effect - add ripple
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Testimonial carousel auto-rotate (optional)
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    let currentTestimonial = 0;
    
    const rotateTestimonials = () => {
        testimonialCards.forEach((card, index) => {
            if (index === currentTestimonial) {
                card.style.transform = 'scale(1.05)';
                card.style.zIndex = '10';
            } else {
                card.style.transform = 'scale(1)';
                card.style.zIndex = '1';
            }
        });
        
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
    };

    // Uncomment to enable auto-rotation
    // setInterval(rotateTestimonials, 5000);

    // Add entrance animations to process steps
    const processSteps = document.querySelectorAll('.process-step');
    const processObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
                processObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    processSteps.forEach(step => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(30px)';
        step.style.transition = 'all 0.6s ease';
        processObserver.observe(step);
    });
});