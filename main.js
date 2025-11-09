/**
 * Portfolio Main JavaScript File
 * Author: Ahmed Saber
 */

(function() {
  'use strict';

  // ========================================
  // Preloader
  // ========================================
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.remove();
        }, 300);
      }, 500);
    });
  }

  // ========================================
  // Mobile Navigation Toggle
  // ========================================
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const navmenu = document.querySelector('.navmenu');
  
  if (mobileNavToggle && navmenu) {
    mobileNavToggle.addEventListener('click', function() {
      navmenu.classList.toggle('active');
      this.classList.toggle('bi-list');
      this.classList.toggle('bi-x');
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.navmenu a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navmenu.classList.contains('active')) {
          navmenu.classList.remove('active');
          mobileNavToggle.classList.remove('bi-x');
          mobileNavToggle.classList.add('bi-list');
        }
      });
    });
  }

  // ========================================
  // Header Scroll Effect
  // ========================================
  const header = document.querySelector('.header');
  
  function handleScroll() {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  if (header) {
    window.addEventListener('scroll', handleScroll);
  }

  // ========================================
  // Active Navigation Link on Scroll
  // ========================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navmenu a');

  function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');
      const navLink = document.querySelector(`.navmenu a[href="#${sectionId}"]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => link.classList.remove('active'));
        if (navLink) {
          navLink.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', highlightNavigation);

  // ========================================
  // Smooth Scroll for Navigation Links
  // ========================================
  const scrollLinks = document.querySelectorAll('a[href^="#"]');
  
  scrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href === '#' || href === '') return;
      
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        const offsetTop = target.offsetTop - 80;
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // ========================================
  // Scroll Top Button
  // ========================================
  const scrollTop = document.querySelector('.scroll-top');
  
  function toggleScrollTop() {
    if (window.scrollY > 300) {
      scrollTop.classList.add('active');
    } else {
      scrollTop.classList.remove('active');
    }
  }

  if (scrollTop) {
    window.addEventListener('scroll', toggleScrollTop);
    
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ========================================
  // Initialize AOS (Animate On Scroll)
  // ========================================
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
      offset: 100
    });
  }

  // ========================================
  // Typed.js Effect for Hero Section
  // ========================================
  const typedElement = document.querySelector('.typed');
  
  if (typedElement && typeof Typed !== 'undefined') {
    const typedStrings = typedElement.getAttribute('data-typed-items');
    
    if (typedStrings) {
      new Typed('.typed', {
        strings: typedStrings.split(',').map(s => s.trim()),
        typeSpeed: 80,
        backSpeed: 50,
        backDelay: 2000,
        loop: true,
        showCursor: true,
        cursorChar: '|'
      });
    }
  }

  // ========================================
  // Counter Animation for Stats
  // ========================================
  function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const suffix = element.getAttribute('data-suffix') || '+';
    
    const timer = setInterval(() => {
      current += increment;
      
      if (current >= target) {
        element.textContent = target + suffix;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current) + suffix;
      }
    }, 30);
  }

  const statsSection = document.querySelector('.profile-stats');
  
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statItems = entry.target.querySelectorAll('.stat-item h4');
          
          statItems.forEach(item => {
            const count = parseInt(item.getAttribute('data-count'));
            
            if (count) {
              item.textContent = '0+';
              animateCounter(item, count);
            }
          });
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(statsSection);
  }

  // ========================================
  // Skills Progress Bar Animation
  // ========================================
  const skillsSection = document.querySelector('.skills-showcase');
  
  if (skillsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progressBars = entry.target.querySelectorAll('.progress-bar');
          
          progressBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            
            if (progress) {
              setTimeout(() => {
                bar.style.width = progress + '%';
              }, 100);
            }
          });
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(skillsSection);
  }

  // ========================================
  // Skills Carousel (windowed loop with GSAP)
  // Shows 6 items at a time and every 1s shifts items by removing last and adding next at start
  // ========================================
  const skillsTrack = document.querySelector('.skills-track'); // data source (kept in DOM)
  let skillsWindow = null;
  let loopInterval = null;
  let skillsTween = null;

  function buildSkillsData() {
    if (!skillsTrack) return [];
    const items = Array.from(skillsTrack.querySelectorAll('.skill-item'));
    return items.map(item => {
      const iconEl = item.querySelector('.skill-icon');
      const nameEl = item.querySelector('.skill-name');
      return {
        iconHTML: iconEl ? iconEl.outerHTML : '',
        name: nameEl ? nameEl.textContent.trim() : ''
      };
    });
  }

  function createSkillNode(data) {
    const el = document.createElement('div');
    el.className = 'skill-item';
    el.innerHTML = `
      <div class="skill-info">
        ${data.iconHTML}
        <span class="skill-name">${data.name}</span>
      </div>`;
    return el;
  }

  function initSkillsLoop() {
    if (!skillsTrack || typeof gsap === 'undefined') return;

    // cleanup previous
    if (skillsWindow) {
      if (skillsWindow.parentNode) skillsWindow.parentNode.removeChild(skillsWindow);
      skillsWindow = null;
    }
    if (skillsTween) {
      skillsTween.kill();
      skillsTween = null;
    }

    const data = buildSkillsData();
    if (!data.length) return;

    // create visible window container (flex row)
    skillsWindow = document.createElement('div');
    skillsWindow.className = 'skills-window';

    // insert the window before the hidden track
    skillsTrack.parentNode.insertBefore(skillsWindow, skillsTrack);

    // render items (original sequence)
    const itemNodes = data.map(d => createSkillNode(d));
    itemNodes.forEach(n => skillsWindow.appendChild(n));

    // duplicate nodes to allow seamless scroll
    const cloneNodes = itemNodes.map(n => n.cloneNode(true));
    cloneNodes.forEach(n => skillsWindow.appendChild(n));

    // determine visible container width (where 6 items must fit)
    const visibleContainer = skillsTrack.parentNode; // .skills-carousel
    const visibleWidth = visibleContainer ? visibleContainer.clientWidth : window.innerWidth;

    // set each item's width so exactly 6 fit the visible container
    const allChildren = Array.from(skillsWindow.children);
    const itemWidth = Math.floor(visibleWidth / 6);
    allChildren.forEach(ch => {
      ch.style.width = itemWidth + 'px';
      ch.style.flex = '0 0 ' + itemWidth + 'px';
      ch.style.maxWidth = itemWidth + 'px';
    });

    // measure width of the original set (including gaps)
    const originalCount = itemNodes.length;
    let totalWidth = 0;
    const calcWidths = () => {
      const firstSet = Array.from(skillsWindow.children).slice(0, originalCount);
      const gap = parseFloat(getComputedStyle(skillsWindow).gap) || 18;
      const widths = firstSet.reduce((acc, el) => acc + el.offsetWidth, 0);
      totalWidth = widths + gap * Math.max(0, firstSet.length - 1);
      return totalWidth;
    };

    if (calcWidths() === 0) {
      setTimeout(() => { if (calcWidths() !== 0) startMarquee(totalWidth); }, 120);
    } else {
      startMarquee(totalWidth);
    }

    function startMarquee(originalWidth) {
      // ensure container width encompasses both sets
      skillsWindow.style.width = (originalWidth * 2) + 'px';

      // set speed/duration: target ~12s per originalWidth
      const duration = 12; // seconds per loop (user preference 10-15)

      // create animation: move left by originalWidth, repeat infinitely, pause 7s between loops
      skillsTween = gsap.to(skillsWindow, {
        x: -originalWidth,
        duration: duration,
        ease: 'none',
        repeat: -1,
        repeatDelay: 7
      });

      // pause on hover
      skillsWindow.addEventListener('mouseenter', () => { if (skillsTween) skillsTween.pause(); });
      skillsWindow.addEventListener('mouseleave', () => { if (skillsTween) skillsTween.resume(); });
    }
  }

  // initialize after load
  window.addEventListener('load', initSkillsLoop);

  // re-init on resize (debounced)
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      initSkillsLoop();
    }, 250);
  });

  // ========================================
  // Projects Filter
  // ========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Filter projects
      projectItems.forEach(item => {
        const category = item.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });

      // Re-initialize AOS for filtered items
      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }
    });
  });

  // ========================================
  // GLightbox for Project Images
  // ========================================
  if (typeof GLightbox !== 'undefined') {
    const lightbox = GLightbox({
      selector: '.glightbox',
      touchNavigation: true,
      loop: true,
      autoplayVideos: true
    });
  }

  // ========================================
  // Contact Form Validation & Submission
  // ========================================
  const contactForm = document.querySelector('#contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const loading = this.querySelector('.loading');
      const errorMessage = this.querySelector('.error-message');
      const sentMessage = this.querySelector('.sent-message');
      const submitBtn = this.querySelector('.btn-submit');
      
      // Hide all messages
      loading.style.display = 'block';
      errorMessage.style.display = 'none';
      sentMessage.style.display = 'none';
      submitBtn.disabled = true;
      
      // Get form data
      const formData = new FormData(this);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
      };
      
      // Simulate form submission (replace with actual API call)
      setTimeout(() => {
        loading.style.display = 'none';
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(data.email)) {
          errorMessage.textContent = 'Please enter a valid email address.';
          errorMessage.style.display = 'block';
          submitBtn.disabled = false;
          return;
        }
        
        // Success
        sentMessage.style.display = 'block';
        submitBtn.disabled = false;
        this.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          sentMessage.style.display = 'none';
        }, 5000);
        
      }, 2000);
    });
  }

  // ========================================
  // Dynamic Year in Footer
  // ========================================
  const yearElement = document.querySelector('#currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ========================================
  // Parallax Effect for Background
  // ========================================
  const hero = document.querySelector('.hero');
  
  if (hero) {
    window.addEventListener('mousemove', (e) => {
      const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
      
      const heroImg = hero.querySelector('img');
      if (heroImg) {
        heroImg.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.1)`;
      }
    });
  }

  // ========================================
  // Animate Elements on Hover
  // ========================================
  const cards = document.querySelectorAll('.profile-card, .exp-card, .cert-card, .project-card, .service-item');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // ========================================
  // Lazy Loading for Images
  // ========================================
  const images = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    images.forEach(img => {
      img.src = img.getAttribute('data-src');
      img.removeAttribute('data-src');
    });
  }

  // ========================================
  // Copy Email to Clipboard
  // ========================================
  const emailElements = document.querySelectorAll('.detail-content strong, .info-item p');
  
  emailElements.forEach(element => {
    if (element.textContent.includes('@')) {
      element.style.cursor = 'pointer';
      element.title = 'Click to copy email';
      
      element.addEventListener('click', function() {
        const email = this.textContent.trim();
        
        if (navigator.clipboard) {
          navigator.clipboard.writeText(email).then(() => {
            // Show temporary tooltip
            const tooltip = document.createElement('span');
            tooltip.textContent = 'Email copied!';
            tooltip.style.cssText = `
              position: absolute;
              background: #10b981;
              color: white;
              padding: 5px 10px;
              border-radius: 5px;
              font-size: 12px;
              z-index: 1000;
              margin-top: -30px;
            `;
            
            this.style.position = 'relative';
            this.appendChild(tooltip);
            
            setTimeout(() => {
              tooltip.remove();
            }, 2000);
          });
        }
      });
    }
  });

  // ========================================
  // Social Links Tracking
  // ========================================
  const socialLinks = document.querySelectorAll('.social-links a, .social-connect a');
  
  socialLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const platform = this.querySelector('i').className;
      console.log(`Social link clicked: ${platform}`);
      // Add analytics tracking here if needed
    });
  });

  // ========================================
  // Keyboard Navigation Enhancement
  // ========================================
  document.addEventListener('keydown', (e) => {
    // Press 'Escape' to close mobile menu
    if (e.key === 'Escape' && navmenu && navmenu.classList.contains('active')) {
      navmenu.classList.remove('active');
      mobileNavToggle.classList.remove('bi-x');
      mobileNavToggle.classList.add('bi-list');
    }
    
    // Press 'Home' to scroll to top
    if (e.key === 'Home') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // ========================================
  // Performance Optimization - Debounce Scroll
  // ========================================
  function debounce(func, wait) {
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

  // Apply debounce to scroll events
  window.addEventListener('scroll', debounce(() => {
    handleScroll();
    highlightNavigation();
    toggleScrollTop();
  }, 10));

  // ========================================
  // Console Welcome Message
  // ========================================
  console.log('%c👨‍💻 Welcome to Ahmed Saber\'s Portfolio!', 'color: #00d4ff; font-size: 20px; font-weight: bold;');
  console.log('%cFull Stack .NET Developer', 'color: #667eea; font-size: 16px;');
  console.log('%cLooking for collaboration? Let\'s connect!', 'color: #a0aec0; font-size: 14px;');
  console.log('%c📧 ahmedsaberkh7@gmail.com', 'color: #10b981; font-size: 14px;');

  // ========================================
  // Initialize Everything on Load
  // ========================================
  window.addEventListener('load', () => {
    highlightNavigation();
    
    // Add fade-in animation to body
    document.body.style.opacity = '0';
    setTimeout(() => {
      document.body.style.transition = 'opacity 0.5s ease';
      document.body.style.opacity = '1';
    }, 100);
  });

})();