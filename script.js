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

    // Load and display testimonials
    loadTestimonials(revealObserver);
});

/**
 * Load testimonials from JSON file and display them
 */
async function loadTestimonials(observer) {
    const container = document.getElementById('testimonials-container');
    if (!container) return;

    try {
        const response = await fetch('testimonials.json');
        if (!response.ok) {
            throw new Error('Failed to load testimonials');
        }
        
        const testimonials = await response.json();
        
        // Filter to show only verified testimonials, or show all if no verified ones
        const verifiedTestimonials = testimonials.filter(t => t.verified === true);
        const testimonialsToShow = verifiedTestimonials.length > 0 ? verifiedTestimonials : testimonials;
        
        // Limit to 6 testimonials max
        const displayTestimonials = testimonialsToShow.slice(0, 6);
        
        if (displayTestimonials.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--medium-gray);">No testimonials available at this time.</p>';
            return;
        }
        
        container.innerHTML = displayTestimonials.map(testimonial => {
            const stars = '★'.repeat(testimonial.rating || 5);
            const serviceTag = testimonial.service ? `<span class="testimonial-service">${testimonial.service}</span>` : '';
            
            return `
                <div class="testimonial-card fade-in-up">
                    <div class="testimonial-rating" aria-label="${testimonial.rating || 5} out of 5 stars">${stars}</div>
                    <p class="testimonial-text">${testimonial.testimonial}</p>
                    <div class="testimonial-author">
                        <div class="testimonial-author-name">${testimonial.name}</div>
                        <div class="testimonial-author-details">
                            ${testimonial.position ? testimonial.position : ''}${testimonial.position && testimonial.company ? ', ' : ''}${testimonial.company ? testimonial.company : ''}
                        </div>
                        ${serviceTag}
                    </div>
                </div>
            `;
        }).join('');
        
        // Observe new testimonial cards for animation
        if (observer) {
            container.querySelectorAll('.testimonial-card').forEach(card => {
                observer.observe(card);
            });
        }
        
    } catch (error) {
        console.error('Error loading testimonials:', error);
        container.innerHTML = '<p style="text-align: center; color: var(--medium-gray);">Unable to load testimonials at this time.</p>';
    }
}
