// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
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

// Hero Hexagon Grid Animation
function createHeroHexagons() {
    const grid = document.getElementById('heroGrid');
    if (!grid) return;

    grid.innerHTML = '';

    for (let i = 0; i < 30; i++) {
        const hex = document.createElement('div');
        hex.className = 'hex-cell';
        hex.style.animationDelay = `${Math.random() * 2}s`;

        hex.addEventListener('mouseenter', () => {
            hex.style.backgroundColor = '#ffec8b';
            hex.style.transform = 'scale(1.1)';
        });

        hex.addEventListener('mouseleave', () => {
            hex.style.backgroundColor = '#ffd700';
            hex.style.transform = 'scale(1)';
        });

        grid.appendChild(hex);
    }
}

// Interactive Hexagon Rotation
function initInteractiveHexagon() {
    const hexCells = document.querySelectorAll('.interactive-hexagon .hex-cell');

    hexCells.forEach((cell, index) => {
        cell.addEventListener('mouseenter', () => {
            const angle = cell.getAttribute('data-angle');
            cell.style.backgroundColor = '#ffec8b';

            // Show angle information
            const caption = document.querySelector('.visual-caption');
            if (caption) {
                caption.textContent = `Cell ${index + 1}: ${angle}° rotation - Internal angle: 120°`;
            }
        });

        cell.addEventListener('mouseleave', () => {
            cell.style.backgroundColor = '#ffd700';
            const caption = document.querySelector('.visual-caption');
            if (caption) {
                caption.textContent = 'Interactive hexagonal pattern - hover to explore angles';
            }
        });
    });
}

// Scroll-based animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation (methods and geometry list items)
    const animatedElements = document.querySelectorAll('.method-item, .feature-list li');

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(248, 249, 250, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = '#ffffff';
            navbar.style.backdropFilter = 'none';
        }
    });
}

// Removed correlation bar animation (no longer used)

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createHeroHexagons();
    initInteractiveHexagon();
    initScrollAnimations();
    initNavbarScroll();
    // Animate findings metric bar when visible
    const metricFill = document.querySelector('.metric-fill');
    if (metricFill) {
        const target = metricFill.getAttribute('data-target-width') || '58%';
        metricFill.style.width = '0%';
        const obs = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    metricFill.style.width = target;
                    observer.disconnect();
                }
            });
        }, { threshold: 0.4 });
        obs.observe(metricFill);
    }
});

// Resize handler for responsive adjustments
window.addEventListener('resize', () => {
    // Reinitialize hero hexagons on resize
    createHeroHexagons();
});

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll-heavy functions
window.addEventListener('scroll', throttle(() => {
    // Any additional scroll-based functionality
}, 16)); // ~60fps
