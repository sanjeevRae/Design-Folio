import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

(function() {
  'use strict';

  // ---- Configuration ----
  const CONFIG = {
    floatSpeed: 6000,
    floatAmplitude: 10,
    hoverScale: 1.05,
    transitionDuration: 650
  };

  // ---- Initialize on DOM Ready ----
  document.addEventListener('DOMContentLoaded', function() {
    // Add loaded class to body to trigger smooth page content fade-in
    setTimeout(() => {
      document.body.classList.add('loaded');
    }, 50);

    initFloatingVisuals();
    initClockMenu();
    initPhotoFilters();
    initVideoPlayback();
    initSmoothScroll();
    initPageTransitions();
    initFormLabels();
    initBookingForm();
    initBackButton();
  });

  // Re-run clock menu layout on load and resize to ensure perfect alignment
  window.addEventListener('load', initClockMenu);
  window.addEventListener('resize', initClockMenu);

  // Handle back/forward button page cache (Bfcache) to ensure smooth fade-in
  window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
      document.body.classList.add('loaded');
    }
  });

  // ---- Floating Visuals (Home Page) ----
  function initFloatingVisuals() {
    const wrapper = document.querySelector('.visuals-wrapper');
    if (!wrapper) return;
    
    const visualsList = document.querySelector('.visuals-list');
    if (!visualsList) return;

    // Clean up any existing cloned items
    const clones = visualsList.querySelectorAll('.visuals-item[data-clone]');
    clones.forEach(clone => clone.remove());

    // Select original items
    const originalItems = Array.from(visualsList.querySelectorAll('.visuals-item')).filter(item => {
      return !item.dataset.clone;
    });
    if (!originalItems.length) return;

    // Mark original items and ensure their indexes are preserved
    originalItems.forEach((item, i) => {
      item.dataset.original = "true";
      item.dataset.index = i;
    });

    // Kill existing ScrollTriggers for these items to avoid duplicates on resize/re-init
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars.scroller === ".visuals-wrapper" || (trigger.trigger && trigger.trigger.classList.contains('visuals-item'))) {
        trigger.kill();
      }
    });

    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    
    let gapScale = 1;
    let widthScale = 1;

    if (viewportW <= 767) {
      gapScale = 0.52;
      widthScale = 0.72;
    } else if (viewportW < 1024) {
      gapScale = 0.7;
      widthScale = 0.75;
    } else if (viewportW < 1400) {
      gapScale = 0.85;
      widthScale = 0.9;
    }

    let maxEndX = viewportW;
    let minStartX = Infinity;

    // 1. Calculate positions and properties for the original items (Group A)
    originalItems.forEach((item, index) => {
      let x, y, rotationZ, rotationY, rotationX, scale, width;
      let zIndex = Math.floor(Math.random() * 20) + 5;

      if (index === 0) { // Dove Cameron (Left-Center)
        width = 300 * widthScale;
        const centerOffset = viewportW <= 767 ? -420 * gapScale : -320 * gapScale;
        x = (viewportW / 2) + centerOffset - (width / 2);
        y = viewportW <= 767 ? viewportH * 0.38 : viewportH * 0.35;
        rotationZ = -9;
        rotationY = 0;
        rotationX = 0;
        scale = 1;
        zIndex = 15;
      } else if (index === 1) { // Kelly Rowland (Center)
        width = 270 * widthScale;
        x = (viewportW / 2) - (width / 2) - (viewportW <= 767 ? 35 : 0);
        y = viewportW <= 767 ? (viewportH * 0.12) + 75 : viewportH * 0.05;
        rotationZ = 0;
        rotationY = 0;
        rotationX = 0;
        scale = 1.05;
        zIndex = 20;
      } else if (index === 2) { // Elle Q (Right-Center)
        width = 330 * widthScale;
        const centerOffset = viewportW <= 767 ? 420 * gapScale : 320 * gapScale;
        x = (viewportW / 2) + centerOffset - (width / 2);
        y = viewportW <= 767 ? viewportH * 0.20 : viewportH * 0.12;
        rotationZ = 9;
        rotationY = 0;
        rotationX = 0;
        scale = 1;
        zIndex = 15;
      } else if (index === 4) { // Ali D (Far Left)
        width = 290 * widthScale;
        const centerOffset = -720 * gapScale;
        x = (viewportW / 2) + centerOffset - (width / 2);
        y = viewportW <= 767 ? viewportH * 0.22 : viewportH * 0.14;
        rotationZ = -12;
        rotationY = 0;
        rotationX = 0;
        scale = 1;
        zIndex = 10;
      } else if (index === 3) { // Brianna (Far Right)
        width = 290 * widthScale;
        const centerOffset = 720 * gapScale;
        x = (viewportW / 2) + centerOffset - (width / 2);
        y = viewportW <= 767 ? viewportH * 0.38 : viewportH * 0.35;
        rotationZ = 12;
        rotationY = 0;
        rotationX = 0;
        scale = 1;
        zIndex = 10;
      } else {
        // Off-screen scrollable items starting from the right side
        width = (240 + (index % 3) * 45) * widthScale;
        const baseOffset = 1050 * gapScale;
        x = (viewportW / 2) + baseOffset + (index - 5) * (360 * gapScale);
        
        if (viewportW <= 767) {
          if (index % 3 === 0) {
            y = viewportH * 0.16;
          } else if (index % 3 === 1) {
            y = viewportH * 0.38;
          } else {
            y = viewportH * 0.26;
          }
        } else {
          if (index % 3 === 0) {
            y = viewportH * 0.08;
          } else if (index % 3 === 1) {
            y = viewportH * 0.35;
          } else {
            y = viewportH * 0.20;
          }
        }

        // Alternate tilt directions for a beautiful, organic layout
        rotationZ = (index % 2 === 0) ? (-8 - (index % 3) * 2) : (8 + (index % 3) * 2);
        rotationY = 0;
        rotationX = 0;
        scale = 0.9;
        zIndex = 5;
      }

      const delay = Math.random() * -6;

      // Temporarily store original properties on element dataset
      item.dataset.origX = x;
      item.dataset.origY = y;
      item.dataset.origWidth = width;
      item.dataset.origZIndex = zIndex;
      item.dataset.origRotationZ = rotationZ;
      item.dataset.origScale = scale || 1;
      item.dataset.origDelay = delay;

      const endX = x + width;
      if (x < minStartX) {
        minStartX = x;
      }
      if (endX > maxEndX) {
        maxEndX = endX;
      }
    });

    // 2. Determine the loop offset D
    const spacingStep = 360 * gapScale;
    const D = maxEndX - minStartX + spacingStep;

    // 3. Clone elements for Group B and Group C
    const groupBClones = [];
    const groupCClones = [];

    originalItems.forEach(item => {
      // Group B Clone
      const cloneB = item.cloneNode(true);
      cloneB.dataset.clone = "true";
      cloneB.dataset.group = "B";
      cloneB.removeAttribute('id'); // Ensure IDs are unique
      
      // Group C Clone
      const cloneC = item.cloneNode(true);
      cloneC.dataset.clone = "true";
      cloneC.dataset.group = "C";
      cloneC.removeAttribute('id');

      // Sync data attributes to clones
      ['origX', 'origY', 'origWidth', 'origZIndex', 'origRotationZ', 'origScale', 'origDelay'].forEach(key => {
        cloneB.dataset[key] = item.dataset[key];
        cloneC.dataset[key] = item.dataset[key];
      });

      visualsList.appendChild(cloneB);
      visualsList.appendChild(cloneC);

      groupBClones.push(cloneB);
      groupCClones.push(cloneC);
    });

    // 4. Combine all items to set positions and compile ScrollTriggers
    const allItems = [
      ...originalItems.map(item => ({ el: item, offset: 0 })),
      ...groupBClones.map(item => ({ el: item, offset: D })),
      ...groupCClones.map(item => ({ el: item, offset: 2 * D }))
    ];

    allItems.forEach(({ el, offset }) => {
      const origX = parseFloat(el.dataset.origX);
      const origY = parseFloat(el.dataset.origY);
      const origWidth = parseFloat(el.dataset.origWidth);
      const origZIndex = el.dataset.origZIndex;
      const rotationZ = parseFloat(el.dataset.origRotationZ);
      const scale = parseFloat(el.dataset.origScale);
      const delay = parseFloat(el.dataset.origDelay);

      const targetX = origX + offset;

      el.style.left = targetX + 'px';
      el.style.top = origY + 'px';
      el.style.width = origWidth + 'px';
      el.style.zIndex = origZIndex;
      el.style.setProperty('--delay', delay + 's');

      // 5. Build ScrollTrigger timeline
      const baseScale = scale || 1;
      const parallaxX = 90 * (parseInt(origZIndex) / 15);
      const parallaxY = 25 * (parseInt(origZIndex) / 15);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          scroller: ".visuals-wrapper",
          horizontal: true,
          start: "left right",
          end: "right left",
          scrub: true,
          invalidateOnRefresh: true
        }
      });

      tl.fromTo(el, 
        {
          opacity: 0.12,
          scale: 0.7 * baseScale,
          x: parallaxX,
          y: parallaxY,
          rotation: rotationZ
        },
        {
          opacity: 1,
          scale: 1.15 * baseScale,
          x: 0,
          y: 0,
          rotation: rotationZ,
          duration: 0.5,
          ease: "sine.out"
        }
      ).to(el, {
        opacity: 0.12,
        scale: 0.7 * baseScale,
        x: -parallaxX,
        y: -parallaxY,
        rotation: rotationZ,
        duration: 0.5,
        ease: "sine.in"
      });
    });

    // Set the overall width of the scrolling list
    visualsList.style.width = (maxEndX + 2 * D + (viewportW * 0.15)) + 'px';

    // Set initial scroll position to start in Group B (middle group)
    // Only do this on the very first layout init to prevent resetting user's position on minor resizes
    if (!wrapper.dataset.hasInitialScroll) {
      wrapper.dataset.hasInitialScroll = 'true';
      wrapper.scrollLeft = D;
    }

    // 6. Set up the dynamic loop handler on scroll
    if (!wrapper.dataset.loopHandlerInit) {
      wrapper.dataset.loopHandlerInit = 'true';

      wrapper.addEventListener('scroll', () => {
        const scrollLeft = wrapper.scrollLeft;
        
        // If we scroll too far left into Group A, wrap forward to Group B
        if (scrollLeft < D * 0.5) {
          wrapper.scrollLeft = scrollLeft + D;
          
          // Adjust any active smooth scroll tweens to prevent scroll fight
          const activeTweens = gsap.getTweensOf(wrapper);
          activeTweens.forEach(tween => {
            if (tween.vars.scrollLeft !== undefined) {
              const currentTarget = tween.vars.scrollLeft;
              tween.vars.scrollLeft = currentTarget + D;
              tween.invalidate();
            }
          });
        }
        // If we scroll too far right into Group C, wrap backward to Group B
        else if (scrollLeft > D * 1.5) {
          wrapper.scrollLeft = scrollLeft - D;
          
          const activeTweens = gsap.getTweensOf(wrapper);
          activeTweens.forEach(tween => {
            if (tween.vars.scrollLeft !== undefined) {
              const currentTarget = tween.vars.scrollLeft;
              tween.vars.scrollLeft = currentTarget - D;
              tween.invalidate();
            }
          });
        }
      });
    }

    // 7. Horizontal scroll with mouse wheel (Ultra-Smooth GSAP-driven scroll)
    if (!wrapper.dataset.scrollInit) {
      wrapper.dataset.scrollInit = 'true';
      wrapper.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0) {
          e.preventDefault();
          // Adjust scroll speed multiplier
          let targetScroll = wrapper.scrollLeft + e.deltaY * 1.3;
          const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
          targetScroll = Math.max(0, Math.min(maxScroll, targetScroll));
          
          gsap.to(wrapper, {
            scrollLeft: targetScroll,
            duration: 0.65,
            overwrite: 'auto',
            ease: 'power2.out',
            onUpdate: () => {
              ScrollTrigger.update();
            }
          });
        }
      }, { passive: false });
    }

    // Refresh ScrollTrigger to register layout coordinates correctly
    ScrollTrigger.refresh();

    // Initialize Intersection Observer for low-res placeholder blur-up and lazy video playback
    initVisualsIntersectionObserver();

    // Reposition on resize
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        initFloatingVisuals();
        ScrollTrigger.refresh();
      }, 250);
    });
  }

  // ---- Intersection Observer for Media Blur-up ----
  function initVisualsIntersectionObserver() {
    const linkElements = document.querySelectorAll('.visuals-item a');
    if (!linkElements.length) return;

    const observerOptions = {
      root: document.querySelector('.visuals-wrapper'),
      rootMargin: '120px',
      threshold: 0.05
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const link = entry.target;
        const media = link.querySelector('img, video');
        if (!media) return;

        if (entry.isIntersecting) {
          media.classList.add('loaded');
          
          if (media.tagName === 'VIDEO') {
            media.play().catch(err => {
              console.log('Video play error on entry:', err);
            });
          }
        } else {
          if (media.tagName === 'VIDEO') {
            media.pause();
          }
        }
      });
    }, observerOptions);

    linkElements.forEach(link => {
      observer.observe(link);
    });
  }

  // ---- Clock Menu (Footer Navigation) ----
  function applyClockLayout(activeLabel) {
    const menu = document.querySelector('.clock-menu');
    if (!menu) return;

    const items = menu.querySelectorAll('.clock-menu-item');
    const viewport = menu.querySelector('.clock-menu-viewport') || menu;

    const centerX = viewport.offsetWidth / 2;
    const centerY = viewport.offsetHeight - 12; 

    // The desired logical order around the circle
    const logicalOrder = ['Home', 'Book', 'About', 'Video', 'Photo'];
    
    // Find active element matching the label
    let activeItemEl = null;
    items.forEach(item => {
      const isThisActive = item.textContent.trim().toLowerCase() === activeLabel.toLowerCase();
      if (isThisActive) {
        item.classList.add('active');
        activeItemEl = item;
      } else {
        item.classList.remove('active');
      }
    });
    
    const activeLogicalIndex = logicalOrder.findIndex(l => l.toLowerCase() === activeLabel.toLowerCase());

    const viewportW = window.innerWidth;
    const isMobile = viewportW <= 767;
    const isTablet = viewportW > 767 && viewportW <= 1024;
    
    // Scale slots dynamically based on screen size so that it fits perfectly on mobile
    const radiusScale = isMobile ? 0.72 : (isTablet ? 0.85 : 1.0);
    const activeScaleVal = isMobile ? 1.15 : 1.35;
    const inactiveScaleVal = isMobile ? 0.85 : 0.95;

    // Symmetrical, snug, elegant dial layout - perfect circle with exactly 40° spacing
    const slots = [
      { xOffset: 77 * radiusScale, yOffset: -92 * radiusScale },   // Slot 0: Mid Right (Home, 50°)
      { xOffset: 118 * radiusScale, yOffset: -21 * radiusScale },  // Slot 1: Bottom Right (Book, 10°)
      { xOffset: -118 * radiusScale, yOffset: -21 * radiusScale }, // Slot 2: Bottom Left (About, 170°)
      { xOffset: -77 * radiusScale, yOffset: -92 * radiusScale },  // Slot 3: Mid Left (Video, 130°)
      { xOffset: 0 * radiusScale, yOffset: -120 * radiusScale }    // Slot 4: Top Center (Photo, 90°)
    ];

    let activeX = 0;
    let activeY = 0;
    let activeScale = 1;

    items.forEach((item) => {
      const label = item.textContent.trim();
      const logicalIndex = logicalOrder.findIndex(l => l.toLowerCase() === label.toLowerCase());
      
      if (logicalIndex === -1) return;

      const slot = slots[logicalIndex];
      const isActive = (logicalIndex === activeLogicalIndex);
      
      const x = centerX + slot.xOffset;
      const y = centerY + slot.yOffset;

      item.style.left = x + 'px';
      item.style.top = y + 'px';
      
      const itemScale = isActive ? activeScaleVal : inactiveScaleVal;
      item.style.transform = `translate(-50%, -50%) scale(${itemScale})`;
      item.style.zIndex = isActive ? 10 : 1;
      
      if (isActive) {
        activeX = x;
        activeY = y;
        activeScale = itemScale;
      }
    });

    // Clock hands - point precisely to top-left and bottom-left of active item
    const hourHand = menu.querySelector('.clock-hand.hour');
    const minuteHand = menu.querySelector('.clock-hand.minute');
    const center = menu.querySelector('.clock-center');

    if (activeItemEl && hourHand && minuteHand) {
      // Get logical fallback widths if DOM width is not computed yet
      let fallbackWidth = 50;
      const normLabel = activeLabel.toLowerCase();
      if (normLabel === 'home') fallbackWidth = 45;
      else if (normLabel === 'book') fallbackWidth = 45;
      else if (normLabel === 'about') fallbackWidth = 55;
      else if (normLabel === 'video') fallbackWidth = 50;
      else if (normLabel === 'photo') fallbackWidth = 50;

      // Calculate active item bounds
      const w = ((activeItemEl.offsetWidth || fallbackWidth) + 6) * activeScale;
      const h = (activeItemEl.offsetHeight || 18) * activeScale;
      
      // Symmetrical target offsets based on item position relative to center
      let tlx, tly, blx, bly;
      const xMargin = 6;
      const yMargin = 6;

      if (activeX > centerX + 20) {
        // Active item is on the right. Hands point to its left edge.
        tlx = activeX - (w * 0.5) - xMargin;
        tly = activeY - (h * 0.2);
        blx = activeX - (w * 0.5) - xMargin;
        bly = activeY + (h * 0.2);
      } else if (activeX < centerX - 20) {
        // Active item is on the left. Hands point to its right edge.
        tlx = activeX + (w * 0.5) + xMargin;
        tly = activeY - (h * 0.2);
        blx = activeX + (w * 0.5) + xMargin;
        bly = activeY + (h * 0.2);
      } else {
        // Active item is at the top center (e.g. Photo). Hands point to its bottom edge.
        tlx = activeX - (w * 0.25);
        tly = activeY + (h * 0.5) + yMargin;
        blx = activeX + (w * 0.25);
        bly = activeY + (h * 0.5) + yMargin;
      }
      
      // Top line math
      const dtx = tlx - centerX;
      const dty = tly - centerY;
      const angleTop = Math.atan2(dty, dtx) * (180 / Math.PI);
      const distTop = Math.sqrt(dtx*dtx + dty*dty);
      
      // Bottom line math
      const dbx = blx - centerX;
      const dby = bly - centerY;
      const angleBot = Math.atan2(dby, dbx) * (180 / Math.PI);
      const distBot = Math.sqrt(dbx*dbx + dby*dby);

      hourHand.style.left = centerX + 'px';
      hourHand.style.top = centerY + 'px';
      hourHand.style.transform = `translateY(-50%) rotate(${angleBot}deg)`;
      hourHand.style.width = `${distBot}px`;

      minuteHand.style.left = centerX + 'px';
      minuteHand.style.top = centerY + 'px';
      minuteHand.style.transform = `translateY(-50%) rotate(${angleTop}deg)`;
      minuteHand.style.width = `${distTop}px`;
    }

    if (center) {
      center.style.left = (centerX - 2.5) + 'px';
      center.style.top = (centerY - 2.5) + 'px';
      center.style.width = '5px';
      center.style.height = '5px';
    }
  }

  function initClockMenu() {
    const menu = document.querySelector('.clock-menu');
    if (!menu) return;

    const items = menu.querySelectorAll('.clock-menu-item');
    
    // Find hardcoded active label
    let currentActiveLabel = 'Home';
    items.forEach(item => {
      if (item.classList.contains('active')) {
        currentActiveLabel = item.textContent.trim();
      }
    });

    // Check if we have a saved active label from previous page to animate from
    const prevLabel = sessionStorage.getItem('prevActiveLabel');

    if (prevLabel && prevLabel.toLowerCase() !== currentActiveLabel.toLowerCase()) {
      // Clear immediately to prevent loop
      sessionStorage.removeItem('prevActiveLabel');

      // 1. Instantly render the previous active state with no transition
      menu.classList.add('no-transition');
      applyClockLayout(prevLabel);

      // Force layout reflow so the browser registers the non-transition state
      void menu.offsetHeight;

      // 2. Schedule the transition to the current active state in the next paint cycle
      requestAnimationFrame(() => {
        setTimeout(() => {
          menu.classList.remove('no-transition');
          applyClockLayout(currentActiveLabel);
        }, 50);
      });
    } else {
      // Direct render
      applyClockLayout(currentActiveLabel);
    }
  }

  // ---- Photo Gallery Filters ----
  function initPhotoFilters() {
    const filters = document.querySelectorAll('.photo-filter');
    const items = document.querySelectorAll('.photo-item');

    if (!filters.length || !items.length) return;

    filters.forEach(filter => {
      filter.addEventListener('click', function() {
        const category = this.dataset.filter;

        // Update active filter
        filters.forEach(f => f.classList.remove('active'));
        this.classList.add('active');

        // Filter items
        items.forEach(item => {
          if (category === 'all' || item.dataset.category === category) {
            item.style.display = '';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 10);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // ---- Video Playback ----
  function initVideoPlayback() {
    const videoItems = document.querySelectorAll('.video-item');

    videoItems.forEach(item => {
      const video = item.querySelector('video');
      if (!video) return;

      // Play on hover
      item.addEventListener('mouseenter', function() {
        video.play().catch(() => {});
      });

      item.addEventListener('mouseleave', function() {
        video.pause();
        video.currentTime = 0;
      });
    });
  }

  // ---- Smooth Scroll ----
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // ---- Page Transitions ----
  function initPageTransitions() {
    // Select all <a> tags with an href attribute
    const links = document.querySelectorAll('a[href]');
    
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (!href) return;
        
        // Exclude anchors, email/phone links, and links targeting new tabs
        if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;
        if (this.getAttribute('target') === '_blank') return;
        
        // Ensure same origin (internal links)
        try {
          const url = new URL(href, window.location.href);
          if (url.origin !== window.location.origin) return;
        } catch (err) {
          // If URL parsing fails, skip if it's an external absolute URL
          if (href.startsWith('http://') || href.startsWith('https://')) return;
        }

        e.preventDefault();

        // 1. Identify if it is a clock menu item click
        const isClockMenu = this.classList.contains('clock-menu-item');
        
        // Always store previous state to make load-transition smooth
        const currentActive = document.querySelector('.clock-menu-item.active');
        if (currentActive) {
          sessionStorage.setItem('prevActiveLabel', currentActive.textContent.trim());
        }

        if (isClockMenu) {
          const targetLabel = this.textContent.trim();
          // Update clock menu positions immediately on the current page to start the sliding transition
          applyClockLayout(targetLabel);
        }
        
        // Fade out
        document.body.classList.remove('loaded');
        
        // Navigate after the transition duration
        setTimeout(() => {
          window.location.href = href;
        }, CONFIG.transitionDuration);
      });
    });
  }

  // ---- Form Floating Labels ----
  function initFormLabels() {
    const fields = document.querySelectorAll('.field input, .field textarea');

    fields.forEach(field => {
      field.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
      });

      field.addEventListener('blur', function() {
        if (!this.value) {
          this.parentElement.classList.remove('focused');
        }
      });
    });
  }

  // ---- Booking Form / EmailJS ----
  function initBookingForm() {
    const form = document.querySelector('.book-form');
    if (!form) return;

    const status = document.getElementById('formStatus');
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    const emailjs = window.emailjs;

    if (emailjs && publicKey) {
      emailjs.init(publicKey);
    }

    form.addEventListener('submit', async function(event) {
      event.preventDefault();

      if (!emailjs || !serviceId || !templateId || !publicKey) {
        if (status) {
          status.textContent = 'Email service is not configured yet. Add the EmailJS values to your .env file.';
        }
        return;
      }

      const submitButton = form.querySelector('.submit-btn');
      const originalText = submitButton ? submitButton.textContent : '';

      if (status) {
        status.textContent = 'Sending your booking request...';
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
      }

      try {
        await emailjs.sendForm(serviceId, templateId, form);
        form.reset();
        form.querySelectorAll('.field').forEach(field => field.classList.remove('focused'));

        if (status) {
          status.textContent = 'Booking request sent successfully.';
        }
      } catch (error) {
        if (status) {
          status.textContent = 'Something went wrong sending the form. Check your EmailJS .env values and try again.';
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        }
      }
    });
  }

  // ---- Back Button ----
  function initBackButton() {
    const backBtn = document.querySelector('.back-btn');
    if (!backBtn) return;

    // Show back button when scrolled
    window.addEventListener('scroll', function() {
      if (window.scrollY > 100) {
        backBtn.classList.add('visible');
      } else {
        backBtn.classList.remove('visible');
      }
    });

    backBtn.addEventListener('click', function() {
      window.history.back();
    });
  }

  // ---- Parallax Effect for About Page ----
  function initParallax() {
    const portrait = document.querySelector('.about-portrait');
    if (!portrait) return;

    window.addEventListener('scroll', function() {
      const scrollY = window.scrollY;
      portrait.style.transform = `translateY(${scrollY * 0.1}px)`;
    });
  }

  // Initialize parallax
  initParallax();
  
  // ---- Keyboard Navigation ----
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const backBtn = document.querySelector('.back-btn');
      if (backBtn && backBtn.classList.contains('visible')) {
        window.history.back();
      }
    }
  });

  // ---- Swipe Indicator Fade ----
  function initSwipeIndicator() {
    const indicator = document.querySelector(".swipe-up-indicator");
    if (!indicator) return;
    
    let isHidden = false;
    
    const hideIndicator = () => {
      if (isHidden) return;
      isHidden = true;
      indicator.style.opacity = "0";
      indicator.style.pointerEvents = "none";
      window.removeEventListener("scroll", handleScroll);
      setTimeout(() => indicator.remove(), 300);
    };
    
    const handleScroll = function() {
      if (window.scrollY > 20) {
        hideIndicator();
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    
    // Automatically hide after 6 seconds
    setTimeout(hideIndicator, 6000);
  }
  initSwipeIndicator();

})();
