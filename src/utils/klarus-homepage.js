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
      
      // Prevent scroll events from interfering with mobile menu
      document.addEventListener('scroll', (e) => {
        // Don't close mobile menu on scroll - let user scroll within menu
        if (this.mobileMenuOpen) {
          e.stopPropagation();
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

    // Header scroll effect with color change
    let lastScrollTop = 0;
    const header = document.querySelector('.cs_site_header');
    const mainHeader = document.querySelector('.cs_main_header');
    const mainHeaderIn = document.querySelector('.cs_main_header_in');
    
    if (header) {
      // Initialize navbar state on page load
      const initializeNavbarState = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 50) {
          header.classList.add('cs_scrolled');
          if (mainHeader) mainHeader.classList.add('cs_scrolled');
          if (mainHeaderIn) mainHeaderIn.classList.add('cs_scrolled');
        } else {
          header.classList.remove('cs_scrolled');
          if (mainHeader) mainHeader.classList.remove('cs_scrolled');
          if (mainHeaderIn) mainHeaderIn.classList.remove('cs_scrolled');
        }
      };
      
      // Initialize on page load
      initializeNavbarState();
      
      window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class based on scroll position
        if (scrollTop > 50) {
          // Add scrolled class for blue background
          header.classList.add('cs_scrolled');
          if (mainHeader) mainHeader.classList.add('cs_scrolled');
          if (mainHeaderIn) mainHeaderIn.classList.add('cs_scrolled');
        } else {
          // Remove scrolled class for white background
          header.classList.remove('cs_scrolled');
          if (mainHeader) mainHeader.classList.remove('cs_scrolled');
          if (mainHeaderIn) mainHeaderIn.classList.remove('cs_scrolled');
        }
        
        // Hide/show header on scroll direction (existing functionality)
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

// Active link highlighting using IntersectionObserver
(function () {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = Array.from(document.querySelectorAll('.cs_nav .cs_nav_list > li > a'));
  if (!sections.length || !navLinks.length) return;

  const map = new Map();
  navLinks.forEach((a) => {
    const h = (a.getAttribute('href') || '').replace('#', '');
    if (h) map.set(h, a);
  });

  const setActive = (id) => {
    navLinks.forEach((a) => a.classList.remove('cs_active'));
    const link = map.get(id);
    if (link) link.classList.add('cs_active');
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    { rootMargin: '-35% 0px -55% 0px', threshold: prefersReduced ? 0.25 : 0.5 }
  );

  sections.forEach((s) => io.observe(s));
})();

// Hero parallax for background shapes (lightweight)
(function () {
  if (typeof window === 'undefined') return;
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  const hero = document.querySelector('.cs_hero');
  if (!hero) return;
  const shapeBg = hero.querySelector('.cs_hero_bg_shape');
  const shape4 = hero.querySelector('.cs_hero_shape4');
  const shape5 = hero.querySelector('.cs_hero_shape5');
  if (!shapeBg && !shape4 && !shape5) return;

  let ticking = false;
  const reset = () => {
    if (shapeBg) shapeBg.style.transform = 'translateX(-50%)';
    if (shape4) shape4.style.transform = 'none';
    if (shape5) shape5.style.transform = 'none';
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      if (window.scrollY < 12) { reset(); ticking = false; return; }
      const rect = hero.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
      const y1 = (progress - 0.5) * 18; // subtle
      const y2 = (progress - 0.5) * 28;
      if (shapeBg) shapeBg.style.transform = `translate(-50%, ${y1}px)`;
      if (shape4) shape4.style.transform = `translate3d(0, ${y2}px, 0)`;
      if (shape5) shape5.style.transform = `translate3d(0, ${-y2}px, 0)`;
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// Reveal feature/user cards on scroll and add tilt-on-hover
(function () {
  if (typeof window === 'undefined') return;
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal
  const revealTargets = Array.from(document.querySelectorAll('.cs_iconbox.cs_style_1.cs_type_1, .cs_iconbox.cs_style_2, .cs_user_feature .cs_user_feature_item'));
  revealTargets.forEach((el) => el.classList.add('reveal-up'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-revealed');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: reduce ? 0.1 : 0.25 });
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-revealed'));
  }

  // Tilt
  if (reduce) return;
  const tiltTargets = Array.from(document.querySelectorAll('.cs_iconbox.cs_style_1.cs_type_1, .cs_user_feature .cs_user_feature_item'));
  tiltTargets.forEach((card) => {
    card.classList.add('tilt-on-hover');
    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rotateX = Math.max(-6, Math.min(6, -dy * 6));
      const rotateY = Math.max(-6, Math.min(6, dx * 6));
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };
    const onLeave = () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    };
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
  });
})();

// Contact form result helper (non-blocking)
(function () {
  if (typeof window === 'undefined') return;
  const form = document.getElementById('cs_form');
  const result = document.getElementById('cs_result');
  if (!form || !result) return;
  let timer;
  form.addEventListener('submit', function () {
    clearTimeout(timer);
    result.textContent = 'Sending...';
    timer = setTimeout(() => {
      result.textContent = 'Submitted. Thank you!';
      setTimeout(() => { result.textContent = ''; }, 3500);
    }, 1800);
  });
})();
