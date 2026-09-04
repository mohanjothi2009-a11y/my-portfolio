/**
 * Main Application Logic for Mohan M's Portfolio (Upgraded & Playful Edition)
 * Features:
 * - Web Audio API Tactile Sounds (Real-time synthesized UI clicks & pops)
 * - Custom Magnetic Cursor with scaling on interactive elements
 * - Project Category Filter Tabs (All, Healthcare, SaaS, Hospitality, EdTech, Landing Pages)
 * - Enhanced Case Study Modals with Embedded High-Resolution Designed Mockups
 * - Theme Switcher (Dark / Light)
 * - Wall of Portfolios Bookmark Celebration with Canvas Confetti
 * - 3D Perspective Tilt & Global Toast System
 */

(function () {
  'use strict';

  // --- 1. Global Toast Notification System ---
  window.showToast = function (message, duration = 3500) {
    let toast = document.getElementById('global-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'global-toast';
      toast.className = 'toast-notice';
      toast.innerHTML = `<span class="toast-dot"></span><span id="toast-text"></span>`;
      document.body.appendChild(toast);
    }

    const textEl = toast.querySelector('#toast-text');
    if (textEl) textEl.textContent = message;

    toast.classList.add('visible');
    clearTimeout(window._toastTimeout);
    window._toastTimeout = setTimeout(() => {
      toast.classList.remove('visible');
    }, duration);
  };

  // --- 2. Tactile Web Audio API Synthesizer (No external assets required) ---
  let audioCtx = null;
  let isSoundEnabled = localStorage.getItem('mohan_sound_active') !== 'false';

  function initAudio() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  window.playClickSound = function () {
    if (!isSoundEnabled) return;
    try {
      initAudio();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
      // Ignore audio context errors
    }
  };

  window.playPopSound = function () {
    if (!isSoundEnabled) return;
    try {
      initAudio();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.09);
    } catch (e) {
      // Ignore
    }
  };

  function setupSoundToggle() {
    const btn = document.getElementById('sound-toggle-btn');
    if (!btn) return;

    updateSoundButtonIcon(btn);

    btn.addEventListener('click', () => {
      isSoundEnabled = !isSoundEnabled;
      localStorage.setItem('mohan_sound_active', isSoundEnabled);
      updateSoundButtonIcon(btn);
      if (isSoundEnabled) {
        window.playPopSound();
        window.showToast?.('Sound effects enabled 🔊');
      } else {
        window.showToast?.('Sound effects muted 🔇');
      }
    });
  }

  function updateSoundButtonIcon(btn) {
    btn.classList.toggle('sound-active', isSoundEnabled);
    btn.innerHTML = isSoundEnabled
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
  }

  // --- 3. Custom Magnetic Interactive Cursor ---
  function setupCustomCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return; // Skip touch devices

    const dot = document.createElement('div');
    dot.className = 'custom-cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'custom-cursor-ring';

    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      requestAnimationFrame(animateRing);
    }
    requestAnimationFrame(animateRing);

    // Expand cursor on interactive elements
    const hoverTargets = 'a, button, [data-study-id], .project-card, .playful-sticker, .filter-pill';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) {
        ring.classList.add('cursor-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) {
        ring.classList.remove('cursor-hover');
      }
    });
  }

  // --- 4. Theme Switcher (Dark / Light Mode) ---
  function setupTheme() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    const savedTheme = localStorage.getItem('mohan_theme') || 'dark';

    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        window.playClickSound();
        const current = document.documentElement.getAttribute('data-theme');
        const nextTheme = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('mohan_theme', nextTheme);
        updateThemeIcon(nextTheme);
        window.showToast?.(`Switched to ${nextTheme} mode`);
      });
    }
  }

  function updateThemeIcon(theme) {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (!toggleBtn) return;
    toggleBtn.innerHTML = theme === 'dark'
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  }

  // --- 5. Project Category Filter Tabs ---
  function setupProjectFilters() {
    const filterPills = document.querySelectorAll('.filter-pill');
    const projectCards = document.querySelectorAll('.project-card');

    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        window.playClickSound();
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const category = pill.getAttribute('data-filter');

        projectCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (category === 'all' || cardCategory === category) {
            card.style.display = 'flex';
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px)';
            setTimeout(() => {
              card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 30);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- 6. 3D Perspective Tilt Effect ---
  function setupTilt() {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    tiltElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const tiltX = (y / (rect.height / 2)) * -10;
        const tiltY = (x / (rect.width / 2)) * 10;
        el.style.transform = `perspective(800px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale(1.02)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
      });
    });
  }

  // --- 7. Enhanced Case Study Modals with Mockup Previews ---
  const CASE_STUDIES = {
    'smilecare': {
      image: 'assets/images/projects/smilecare.jpg',
      tag: 'Healthcare Website & Booking UX',
      title: 'SmileCare Dental Clinic',
      client: 'Apex Dental Care & Specialists',
      duration: '4 Weeks',
      role: 'Lead UI/UX Designer',
      tools: 'Figma, FigJam, Framer, User Research',
      problem: 'Dental clinic patients frequently experience anxiety and friction when navigating cluttered medical websites, struggling to verify doctor credentials and find available appointment slots.',
      solution: 'Designed an ultra-calm, trustworthy, and accessible web experience featuring simplified service menus, verified doctor credentials, transparent price estimates, and a frictionless 3-step appointment booking flow.',
      highlights: [
        { label: '3-Step Booking Flow', desc: 'Reduced appointment booking drop-off by 42% through an interactive calendar & doctor selector.' },
        { label: 'Accessibility First', desc: 'Built with WCAG AAA color contrast, legible typography, and anxiety-reducing soft tones.' },
        { label: 'Doctor Credential Cards', desc: 'Showcases specialized experience, patient testimonials, and verified badges to build immediate patient trust.' },
        { label: 'Mobile Optimized', desc: 'Over 68% of clinic bookings occur on mobile; every touch target was optimized for one-hand thumb use.' }
      ]
    },
    'luxestay': {
      image: 'assets/images/projects/luxestay.jpg',
      tag: 'Hospitality & Luxury Booking Flow',
      title: 'LuxeStay Hotel — The Aurora Suites',
      client: 'Boutique Luxury Hospitality',
      duration: '3 Weeks',
      role: 'Visual & Experience Designer',
      tools: 'Figma, Adobe Firefly, Framer',
      problem: 'Boutique hotels often have visually heavy websites that fail to guide the user seamlessly toward checking room availability and completing reservations.',
      solution: 'Created an editorial, high-end visual narrative featuring immersive room previews, amenity discovery tabs, and an omnipresent sticky reservation bar that keeps the conversion goal always accessible.',
      highlights: [
        { label: 'Editorial Visuals', desc: 'Cinematic photography paired with refined typography and golden luxury accents.' },
        { label: 'Sticky Reservation Bar', desc: 'Instant check-in/out date picker that remains accessible as guests explore suites.' },
        { label: 'Virtual Suite Previews', desc: 'Interactive room tour cards with amenity breakdown and real-time pricing.' },
        { label: 'Streamlined Checkout', desc: 'Zero-clutter reservation confirmation with instant WhatsApp & email invoice integration.' }
      ]
    },
    'taskflow': {
      image: 'assets/images/projects/taskflow.jpg',
      tag: 'Micro-SaaS Web App & Dashboard',
      title: 'TaskFlow Productivity Platform',
      client: 'AeroFlow SaaS Product Concept',
      duration: '5 Weeks',
      role: 'End-to-End Product Designer',
      tools: 'Figma, Tailwind CSS, Notion, Claude',
      problem: 'Modern productivity tools like Jira or Asana can be bloated and intimidating for small agile teams who just need fast task tracking without excessive configuration.',
      solution: 'Engineered a minimalist, keyboard-shortcut-friendly Kanban dashboard with custom priority tags, sprint progress analytics, and a lightning-fast onboarding modal.',
      highlights: [
        { label: 'Modular Kanban Board', desc: 'Drag-and-drop workflow with customizable lanes and color-coded status pills.' },
        { label: 'Fast Keyboard Navigation', desc: 'Quick actions (Cmd+K / Ctrl+K) to create tasks, assign members, and search instantly.' },
        { label: 'Sprint Velocity Insights', desc: 'Daily velocity charts and sprint completion indicators visualized cleanly.' },
        { label: 'Dark Mode Native', desc: 'Engineered for developers and power users working long hours in low-light environments.' }
      ]
    },
    'eduspark': {
      image: 'assets/images/projects/eduspark.jpg',
      tag: 'EdTech Platform & Learning Journey',
      title: 'EduSpark Interactive Learning Portal',
      client: 'EdTech Initiative',
      duration: '4 Weeks',
      role: 'UI/UX Designer & Researcher',
      tools: 'Figma, Miro, Canva, HTML/CSS',
      problem: 'Online course platforms struggle with low course completion rates (averaging under 15%) due to lack of visual milestones and gamified progress tracking.',
      solution: 'Designed an interactive learning portal incorporating progress rings, bite-sized module checklists, peer discussion forums, and shareable accomplishment certificates.',
      highlights: [
        { label: 'Gamified Progress Rings', desc: 'Visual dopamine triggers upon completing coding exercises and quizzes.' },
        { label: 'Split-Screen Live Code UI', desc: 'Integrated interactive code editor alongside video lessons for hands-on learning.' },
        { label: 'Leaderboards & Streaks', desc: 'Community streak badges and peer challenges that boosted engagement by 3.5x.' },
        { label: 'Mobile App Companion', desc: 'Synchronized offline progress tracking for students studying on commute.' }
      ]
    },
    'portfolio': {
      image: 'assets/images/projects/portfolio.jpg',
      tag: 'Personal Brand & Motion Architecture',
      title: 'Mohan M Creative Portfolio System',
      client: 'Mohan M (Self-Directed)',
      duration: 'Ongoing Evolution',
      role: 'Designer & Developer',
      tools: 'Figma, HTML5, Vanilla JS, CSS Glassmorphism',
      problem: 'Generic portfolios fail to convey a designer\'s true personality, problem-solving mindset, and interactive craft.',
      solution: 'Crafted a memorable, editorial-grade digital home inspired by Wall of Portfolios, featuring high-contrast personal portraiture, real-time visitor alerts, and frictionless direct communication.',
      highlights: [
        { label: 'Wall of Portfolios Aesthetic', desc: 'Dual-dock layout with sticky profile and responsive mobile drawer.' },
        { label: 'Silent Email Lead System', desc: 'Dispatches real-time visitor alerts and inquiries directly to Mohan\'s inbox.' },
        { label: 'WhatsApp Instant Launcher', desc: 'One-click modal that pre-formats client project inquiries into WhatsApp chats.' },
        { label: 'Playful Micro-interactions', desc: 'Custom cursor, Web Audio sound effects, and floating Figma-style stickers.' }
      ]
    },
    'startup': {
      image: 'assets/images/projects/startup.jpg',
      tag: 'Startup Landing Page & Growth Design',
      title: 'Aether AI — NextGen Tech Landing Page',
      client: 'Emerging AI Platform Concept',
      duration: '2 Weeks',
      role: 'Conversion & UI Designer',
      tools: 'Figma, Framer, Adobe Photoshop',
      problem: 'Early-stage tech startups struggle to explain complex AI workflows in simple, digestible terms that convert cold visitors into waitlist signups.',
      solution: 'Structured a high-converting landing page adhering to the AIDA framework (Attention, Interest, Desire, Action), pairing interactive feature tabs with crisp social proof and animated micro-demos.',
      highlights: [
        { label: 'AIDA Conversion Architecture', desc: 'Clear visual journey from bold headline hook to single high-contrast CTA.' },
        { label: 'Holographic Neon Glow', desc: 'Cutting-edge electric purple and blue visual identity establishing futuristic authority.' },
        { label: 'Feature Comparison Cards', desc: 'Curated interactive cards explaining automated workflows and data processing.' },
        { label: 'Sub-second Conversion Path', desc: 'One-click demo scheduler and waitlist input with immediate confirmation.' }
      ]
    }
  };

  function setupCaseStudyModals() {
    const modal = document.getElementById('case-study-modal');
    const modalBody = document.getElementById('case-study-modal-body');
    const closeBtn = document.getElementById('case-study-close-btn');
    const triggers = document.querySelectorAll('[data-study-id]');

    if (!modal || !modalBody) return;

    triggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        window.playPopSound();
        const studyId = trigger.getAttribute('data-study-id');
        const data = CASE_STUDIES[studyId];
        if (!data) return;

        modalBody.innerHTML = `
          <div class="case-study-hero-img-box">
            <img src="${escapeHTML(data.image)}" alt="${escapeHTML(data.title)}">
          </div>

          <span class="case-study-badge">${escapeHTML(data.tag)}</span>
          <h2 class="case-study-title">${escapeHTML(data.title)}</h2>

          <div class="case-study-meta">
            <div><span>Client / Concept</span><strong>${escapeHTML(data.client)}</strong></div>
            <div><span>Timeline</span><strong>${escapeHTML(data.duration)}</strong></div>
            <div><span>Role</span><strong>${escapeHTML(data.role)}</strong></div>
            <div><span>Tools</span><strong>${escapeHTML(data.tools)}</strong></div>
          </div>

          <div class="case-study-section">
            <h4>The Problem Space</h4>
            <p>${escapeHTML(data.problem)}</p>
          </div>

          <div class="case-study-section">
            <h4>The Design Solution</h4>
            <p>${escapeHTML(data.solution)}</p>
          </div>

          <div class="case-study-section">
            <h4>Key Highlights & Impact</h4>
            <div class="case-study-highlights">
              ${data.highlights.map(h => `
                <div class="highlight-box">
                  <strong>${escapeHTML(h.label)}</strong>
                  <span>${escapeHTML(h.desc)}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div style="margin-top: 32px; display: flex; gap: 14px; flex-wrap: wrap;">
            <button class="btn-primary open-wa-modal-btn" style="padding: 12px 24px; font-size: 0.92rem;">
              Discuss this project on WhatsApp
            </button>
            <a href="#contact" class="btn-secondary" onclick="document.getElementById('case-study-modal').classList.remove('active'); window.playClickSound();" style="padding: 12px 22px; font-size: 0.92rem;">
              Send Email Inquiry
            </a>
          </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        const innerWa = modalBody.querySelector('.open-wa-modal-btn');
        if (innerWa) {
          innerWa.addEventListener('click', () => {
            modal.classList.remove('active');
            window.playPopSound();
            const waModal = document.getElementById('whatsapp-modal');
            if (waModal) waModal.classList.add('active');
          });
        }
      });
    });

    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      window.playClickSound();
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  // --- 8. Wall of Portfolios Celebration Modal & Bookmark ---
  function setupBookmarkCelebration() {
    const bookmarkBtn = document.getElementById('dock-bookmark-btn');
    const celebrationModal = document.getElementById('celebration-modal');
    const celebrationClose = document.getElementById('celebration-close-btn');

    if (!bookmarkBtn || !celebrationModal) return;

    bookmarkBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.playPopSound();
      const isBookmarked = bookmarkBtn.classList.toggle('bookmarked');

      if (isBookmarked) {
        bookmarkBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          <span>Saved to Bookmarks!</span>
        `;
        celebrationModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        triggerConfetti();
        window.showToast?.('Portfolio bookmarked! Thank you for the support ✨');
      } else {
        bookmarkBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          <span>Bookmark Portfolio</span>
        `;
        window.showToast?.('Removed from bookmarks');
      }
    });

    function closeCelebrate() {
      celebrationModal.classList.remove('active');
      document.body.style.overflow = '';
      window.playClickSound();
    }

    if (celebrationClose) celebrationClose.addEventListener('click', closeCelebrate);
    celebrationModal.addEventListener('click', (e) => {
      if (e.target === celebrationModal) closeCelebrate();
    });
  }

  function triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#38BDF8', '#2563EB', '#10B981', '#F59E0B', '#EC4899', '#FFFFFF'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 18,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 12,
        opacity: 1
      });
    }

    let frame = 0;
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35;
        p.rotation += p.vr;
        p.opacity -= 0.012;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      if (frame < 90) {
        requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    render();
  }

  // --- 9. Mobile Menu Smooth Scroll ---
  function setupMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar-dock');

    if (!toggleBtn || !sidebar) return;

    toggleBtn.addEventListener('click', () => {
      window.playClickSound();
      const isOpen = sidebar.classList.toggle('mobile-open');
      if (isOpen) {
        sidebar.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    sidebar.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
        window.playClickSound();
      });
    });
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- Initializer ---
  document.addEventListener('DOMContentLoaded', () => {
    setupCustomCursor();
    setupTheme();
    setupSoundToggle();
    setupProjectFilters();
    setupTilt();
    setupCaseStudyModals();
    setupBookmarkCelebration();
    setupMobileMenu();
  });
})();
