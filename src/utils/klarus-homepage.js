/**
 * KLARUS HOMEPAGE - SINGLE SOURCE OF TRUTH
 * Centralized JavaScript functionality for the homepage
 */

class KlarusHomepageManager {
  constructor() {
    this.isInitialized = false;
    this.mobileMenuOpen = false;
    this.init();
  }

  /**
   * Initialize the homepage functionality
   */
  init() {
    if (this.isInitialized) return;
    
    console.log('🚀 Initializing Klarus Homepage Manager...');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupComponents());
    } else {
      this.setupComponents();
    }
    
    this.isInitialized = true;
  }

  /**
   * Setup all homepage components
   */
  setupComponents() {
    this.setupMobileMenu();
    this.setupScrollEffects();
    this.setupAnimations();
    this.loadExternalAssets();
  }

  /**
   * Setup mobile menu functionality
   */
  setupMobileMenu() {
    // Wait for DOM to be ready
    setTimeout(() => {
      const menuToggle = document.querySelector('.cs_menu_toggle');
      const navList = document.querySelector('.cs_nav_list');
      const closeNav = document.querySelector('.cs_close_nav');

      console.log('🔍 Mobile menu elements:', { menuToggle, navList, closeNav });

      if (menuToggle && navList) {
        // Remove any existing event listeners to prevent conflicts
        const newMenuToggle = menuToggle.cloneNode(true);
        menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);
        
        // Add our event listener
        newMenuToggle.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          console.log('📱 Mobile menu toggle clicked');
          this.toggleMobileMenu();
        });
      }

      if (closeNav && navList) {
        // Remove any existing event listeners to prevent conflicts
        const newCloseNav = closeNav.cloneNode(true);
        closeNav.parentNode.replaceChild(newCloseNav, closeNav);
        
        // Add our event listener
        newCloseNav.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          console.log('❌ Mobile menu close clicked');
          this.closeMobileMenu();
        });
      }

      // Close mobile menu when clicking outside - but be more specific
      document.addEventListener('click', (e) => {
        if (this.mobileMenuOpen && 
            !e.target.closest('.cs_nav') && 
            !e.target.closest('.cs_menu_toggle') &&
            !e.target.closest('.cs_close_nav')) {
          console.log('🔄 Closing mobile menu - clicked outside');
          this.closeMobileMenu();
        }
      });

      // Close mobile menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.mobileMenuOpen) {
          console.log('🔄 Closing mobile menu - escape key');
          this.closeMobileMenu();
        }
      });
    }, 100);
  }

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu() {
    const menuToggle = document.querySelector('.cs_menu_toggle');
    const navList = document.querySelector('.cs_nav_list');

    if (!menuToggle || !navList) {
      console.log('❌ Mobile menu elements not found');
      return;
    }

    this.mobileMenuOpen = !this.mobileMenuOpen;
    
    console.log('🔄 Toggling mobile menu. Open:', this.mobileMenuOpen);
    
    if (this.mobileMenuOpen) {
      this.openMobileMenu();
    } else {
      this.closeMobileMenu();
    }
  }

  /**
   * Open mobile menu
   */
  openMobileMenu() {
    const menuToggle = document.querySelector('.cs_menu_toggle');
    const navList = document.querySelector('.cs_nav_list');

    if (!menuToggle || !navList) {
      console.log('❌ Mobile menu elements not found for opening');
      return;
    }

    console.log('📱 Opening mobile menu');
    
    // Add active classes
    navList.classList.add('cs_active');
    menuToggle.classList.add('cs_toggle_active');
    document.body.classList.add('cs_mobile_menu_active');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Force visibility with inline styles as backup
    navList.style.left = '0vw';
    navList.style.display = 'block';
    navList.style.visibility = 'visible';
    navList.style.opacity = '1';
    navList.style.transform = 'translateX(0)';
    
    console.log('✅ Mobile menu opened. Classes:', {
      navList: navList.className,
      menuToggle: menuToggle.className,
      body: document.body.className
    });
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu() {
    const menuToggle = document.querySelector('.cs_menu_toggle');
    const navList = document.querySelector('.cs_nav_list');

    if (!menuToggle || !navList) {
      console.log('❌ Mobile menu elements not found for closing');
      return;
    }

    console.log('❌ Closing mobile menu');
    
    // Remove active classes
    navList.classList.remove('cs_active');
    menuToggle.classList.remove('cs_toggle_active');
    document.body.classList.remove('cs_mobile_menu_active');
    this.mobileMenuOpen = false;

    // Restore body scroll
    document.body.style.overflow = '';
    
    // Force hide with inline styles as backup
    navList.style.left = '-80vw';
    navList.style.display = 'none';
    navList.style.visibility = 'hidden';
    navList.style.opacity = '0';
    navList.style.transform = 'translateX(-100%)';
    
    console.log('✅ Mobile menu closed. Classes:', {
      navList: navList.className,
      menuToggle: menuToggle.className,
      body: document.body.className
    });
  }

  /**
   * Setup scroll effects
   */
  setupScrollEffects() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Header scroll effect
    let lastScrollTop = 0;
    const header = document.querySelector('.cs_site_header');
    
    if (header) {
      window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
          // Scrolling down
          header.classList.add('cs_scrolled_down');
        } else {
          // Scrolling up
          header.classList.remove('cs_scrolled_down');
        }
        
        lastScrollTop = scrollTop;
      });
    }
  }

  /**
   * Setup animations
   */
  setupAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('.cs_section, .cs_iconbox, .cs_testimonial').forEach(el => {
      observer.observe(el);
    });
  }

  /**
   * Load external assets (Poze CSS/JS)
   */
  loadExternalAssets() {
    // Load Poze CSS files
    const cssFiles = [
      '/poze-assets/css/bootstrap.min.css',
      '/poze-assets/css/fontawesome.min.css',
      '/poze-assets/css/slick.css',
      '/poze-assets/css/animate.css',
      '/poze-assets/css/style.css'
    ];

    cssFiles.forEach(href => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
      }
    });

    // Load Poze JS files (excluding main.js to prevent mobile menu conflicts)
    const jsFiles = [
      '/poze-assets/js/jquery.min.js',
      '/poze-assets/js/jquery.slick.min.js',
      '/poze-assets/js/wow.min.js'
      // Note: main.js excluded to prevent mobile menu conflicts
    ];

    jsFiles.forEach(src => {
      if (!document.querySelector(`script[src="${src}"]`)) {
        const script = document.createElement('script');
        script.src = src;
        script.async = false;
        document.body.appendChild(script);
      }
    });
  }

  /**
   * Public API methods
   */
  
  /**
   * Get mobile menu state
   */
  isMobileMenuOpen() {
    return this.mobileMenuOpen;
  }

  /**
   * Force close mobile menu
   */
  forceCloseMobileMenu() {
    this.closeMobileMenu();
  }

  /**
   * Refresh homepage
   */
  refresh() {
    this.setupComponents();
  }
}

// Initialize the homepage manager
// This is the SINGLE SOURCE OF TRUTH for homepage mobile menu functionality
const klarusHomepage = new KlarusHomepageManager();

// Export for use in React components
window.KlarusHomepage = klarusHomepage;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KlarusHomepageManager;
}
