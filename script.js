/**
 * NativePHP Arabic Documentation
 * Interactive JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    initThemeToggle();
    
    // Mobile Menu
    initMobileMenu();
    
    // Sidebar
    initSidebar();
    
    // Copy Code Buttons
    initCopyButtons();
    
    // Scroll to Top
    initScrollToTop();
    
    // Active Navigation Link
    initActiveNavLink();
    
    // Smooth Scroll for Anchor Links
    initSmoothScroll();
});

/**
 * Theme Toggle
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

/**
 * Mobile Menu
 */
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    mobileMenuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('open');
        
        // Animate hamburger
        const spans = mobileMenuToggle.querySelectorAll('span');
        if (mobileMenu.classList.contains('open')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Close menu when clicking a link
    const mobileNavLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            const spans = mobileMenuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

/**
 * Sidebar
 */
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    
    // Open sidebar
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
    
    // Close sidebar
    sidebarClose.addEventListener('click', closeSidebar);
    
    // Close when clicking outside
    document.addEventListener('click', function(e) {
        if (sidebar.classList.contains('open') && 
            !sidebar.contains(e.target) && 
            !sidebarToggle.contains(e.target)) {
            closeSidebar();
        }
    });
    
    // Close sidebar when clicking a link (on mobile)
    const sidebarLinks = sidebar.querySelectorAll('.nav-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                closeSidebar();
            }
        });
    });
    
    function closeSidebar() {
        sidebar.classList.remove('open');
        document.body.style.overflow = '';
    }
}

/**
 * Copy Code Buttons
 */
function initCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const code = this.getAttribute('data-clipboard');
            
            try {
                await navigator.clipboard.writeText(code);
                
                // Show success state
                const originalHTML = this.innerHTML;
                this.classList.add('copied');
                this.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    تم النسخ!
                `;
                
                // Reset after 2 seconds
                setTimeout(() => {
                    this.classList.remove('copied');
                    this.innerHTML = originalHTML;
                }, 2000);
                
            } catch (err) {
                console.error('Failed to copy:', err);
                
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = code;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                
                try {
                    document.execCommand('copy');
                    this.classList.add('copied');
                    setTimeout(() => this.classList.remove('copied'), 2000);
                } catch (e) {
                    console.error('Fallback copy failed:', e);
                }
                
                document.body.removeChild(textarea);
            }
        });
    });
}

/**
 * Scroll to Top
 */
function initScrollToTop() {
    const scrollTop = document.getElementById('scrollTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollTop.classList.add('visible');
        } else {
            scrollTop.classList.remove('visible');
        }
    });
    
    scrollTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Active Navigation Link
 */
function initActiveNavLink() {
    const sections = document.querySelectorAll('.doc-section');
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without jumping
                history.pushState(null, null, href);
            }
        });
    });
}

/**
 * Keyboard Shortcuts
 */
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to focus search (if implemented)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Search functionality can be added here
    }
    
    // Escape to close sidebar/mobile menu
    if (e.key === 'Escape') {
        const sidebar = document.getElementById('sidebar');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            document.body.style.overflow = '';
        }
        
        if (mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
            const spans = document.querySelectorAll('.mobile-menu-toggle span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }
});

/**
 * Prism.js Language Support for Blade
 */
Prism.languages.blade = {
    'comment': /{{--[\s\S]*?--}}/,
    'blade': {
        pattern: /@[a-zA-Z]+|{{[\s\S]*?}}|{!![\s\S]*?!!}/,
        inside: {
            'tag': {
                pattern: /@[a-zA-Z]+/,
                alias: 'keyword'
            },
            'delimiter': {
                pattern: /{{|}}|{!!|!!}/,
                alias: 'punctuation'
            },
            'php': {
                pattern: /[\s\S]+/,
                inside: Prism.languages.php
            }
        }
    },
    'php': Prism.languages.php,
    'html': Prism.languages.html
};

// Add smooth reveal animation for elements
function revealElements() {
    const elements = document.querySelectorAll('.feature-card, .code-block, .info-box');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}

// Initialize reveal animation
document.addEventListener('DOMContentLoaded', revealElements);
