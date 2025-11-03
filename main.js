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

// Smooth scrolling for navigation links (duration scales with distance)
(function initSmoothScrolling() {
    const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    function smoothScrollTo(toY, duration) {
        const startY = window.pageYOffset || document.documentElement.scrollTop;
        const distance = toY - startY;
        const startTime = performance.now();

        function step(now) {
            const elapsed = now - startTime;
            const t = Math.min(1, elapsed / duration);
            const eased = easeInOutCubic(t);
            window.scrollTo(0, startY + distance * eased);
            if (t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    function getOffsetTop(el) {
        const rect = el.getBoundingClientRect();
        return rect.top + window.pageYOffset;
    }

    function navHeight() {
        const nav = document.querySelector('.navbar');
        return (nav && nav.offsetHeight) ? nav.offsetHeight : 70;
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const hash = this.getAttribute('href');
            const target = document.querySelector(hash);
            if (!target) return; // let default if not found

            e.preventDefault();

            const offset = navHeight() + 8; // small breathing room
            const targetY = Math.max(0, getOffsetTop(target) - offset);

            // Duration scales with distance: 300ms..1200ms
            const distance = Math.abs(window.pageYOffset - targetY);
            const duration = Math.max(300, Math.min(1200, distance * 0.6));

            smoothScrollTo(targetY, duration);

            // Update URL without jumping
            if (history.pushState) {
                history.pushState(null, '', hash);
            } else {
                window.location.hash = hash;
            }
        });
    });
})();

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

// Random Bee Spawner
function createRandomBees(count = 6) {
    const hero = document.querySelector('#home');
    if (!hero) return;

    // Remove any existing bees to avoid duplicates
    hero.querySelectorAll('.bee-wrapper').forEach(el => el.remove());

    const rand = (min, max) => Math.random() * (max - min) + min;

    for (let i = 0; i < count; i++) {
        const rtl = Math.random() < 0.5;
        const topPct = Math.round(rand(6, 92));
        const duration = rand(18, 26).toFixed(1);
        const delay = rand(0, 4).toFixed(2);
        const driftDur = rand(5, 12).toFixed(1);
        const driftDelay = rand(0, 2).toFixed(2);
        const driftAmp = rand(0.5, 4).toFixed(1); // percent

        const wrapper = document.createElement('div');
    wrapper.className = 'bee-wrapper' + (rtl ? ' bee-rtl' : '');
        wrapper.setAttribute('aria-hidden', 'true');
    // Use CSS variables so multiple animations can have independent timings
    wrapper.style.setProperty('--baseTop', `${topPct}%`);
    wrapper.style.setProperty('--flightDur', `${duration}s`);
    wrapper.style.setProperty('--flightDelay', `${delay}s`);
    wrapper.style.setProperty('--driftDur', `${driftDur}s`);
    wrapper.style.setProperty('--driftDelay', `${driftDelay}s`);
    wrapper.style.setProperty('--driftAmp', `${driftAmp}%`);

        wrapper.innerHTML = `
            <svg class="bee-sprite" viewBox="0 0 16 12" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
                <rect class="wing" x="7" y="2" width="4" height="2"/>
                <rect class="wing" x="6" y="3" width="3" height="1"/>
                <rect class="yel" x="4" y="5" width="7" height="3"/>
                <rect class="blk" x="5" y="5" width="1" height="3"/>
                <rect class="blk" x="7" y="5" width="1" height="3"/>
                <rect class="blk" x="9" y="5" width="1" height="3"/>
                <polygon points="0,6 4,5.5 4,6.5" fill="#000"/>
            </svg>
        `;

        const svg = wrapper.querySelector('svg');
        // Randomize buzz amplitude/duration and wing flap speed per bee
        svg.style.setProperty('--buzzAmp', `${rand(1.5, 3.5).toFixed(1)}px`);
        svg.style.setProperty('--buzzDur', `${rand(0.35, 0.6).toFixed(2)}s`);
        svg.style.setProperty('--wingDur', `${rand(0.12, 0.22).toFixed(2)}s`);

        hero.appendChild(wrapper);
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
    createRandomBees(6);
    initWaggleCards();
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
    // Reinitialize hero hexagons on resize (safe no-op since grid removed)
    createHeroHexagons();
    // Do NOT respawn bees on resize to avoid resetting randomness during zoom
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

// Initialize horizontal card interactions for Spatial Distribution
function initWaggleCards() {
    const track = document.querySelector('#waggle-distribution-scroll .hscroll-track');
    if (!track) return;

    track.addEventListener('click', (e) => {
        const card = e.target.closest('.hscroll-card');
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const leftHalf = clickX < rect.width / 2;
        const cls = leftHalf ? 'rotate-left' : 'rotate-right';
        card.classList.remove('rotate-left', 'rotate-right');
        // trigger reflow to restart animation
        void card.offsetWidth;
        card.classList.add(cls);
        setTimeout(() => {
            card.classList.remove('rotate-left', 'rotate-right');
        }, 400);
    });
}
