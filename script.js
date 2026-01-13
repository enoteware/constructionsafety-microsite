/**
 * Construction Safety Consulting - Site JavaScript
 * Handles mobile menu, scroll effects, and animations
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');

            // Toggle aria-expanded for accessibility
            const isExpanded = navMenu.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });

    // Scroll reveal animations with IntersectionObserver
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with fade-in-up class
    document.querySelectorAll('.fade-in-up').forEach(el => {
        revealObserver.observe(el);
    });

    // Auto-add fade-in-up to key elements if not already present
    const autoAnimateSelectors = [
        '.service-card',
        '.benefit-card',
        '.credentials-column',
        '.agency-card',
        '.installation-column',
        '.qual-column',
        '.engagement-card',
        '.faq-item',
        '.service-item',
        '.coverage-item',
        '.project-column',
        '.expertise-column',
        '.markets-column'
    ];

    autoAnimateSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            if (!el.classList.contains('fade-in-up')) {
                el.classList.add('fade-in-up');
                // Add stagger delay based on position
                el.style.transitionDelay = `${index * 0.1}s`;
                revealObserver.observe(el);
            }
        });
    });

    // Also animate section headings
    document.querySelectorAll('section h2').forEach(el => {
        if (!el.classList.contains('fade-in-up')) {
            el.classList.add('fade-in-up');
            revealObserver.observe(el);
        }
    });

    document.querySelectorAll('.section-intro').forEach(el => {
        if (!el.classList.contains('fade-in-up')) {
            el.classList.add('fade-in-up');
            revealObserver.observe(el);
        }
    });
});
