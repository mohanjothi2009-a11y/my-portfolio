/**
 * Contact & WhatsApp Integrations for Mohan M's Portfolio
 * Handles direct WhatsApp messaging with custom templates, automated lead dispatch,
 * mailto backup, and clipboard feedback.
 */

(function () {
  'use strict';

  const PHONE_NUMBER = '919629485076';
  const EMAIL_ADDRESS = 'mohanjothi2009@gmail.com';

  // --- 1. WhatsApp Launcher & Modal ---
  function setupWhatsApp() {
    const waModal = document.getElementById('whatsapp-modal');
    const waDirectBtns = document.querySelectorAll('.open-wa-modal-btn');
    const waCloseBtn = document.getElementById('whatsapp-modal-close');
    const waSendBtn = document.getElementById('send-wa-message-btn');
    const waMsgInput = document.getElementById('whatsapp-custom-text');
    const waPresets = document.querySelectorAll('.wa-preset-pill');

    if (!waModal) return;

    // Open WhatsApp modal
    waDirectBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.playClickSound?.();
        waModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    // Close WhatsApp modal
    function closeWaModal() {
      waModal.classList.remove('active');
      document.body.style.overflow = '';
      window.playClickSound?.();
    }

    if (waCloseBtn) {
      waCloseBtn.addEventListener('click', closeWaModal);
    }

    waModal.addEventListener('click', (e) => {
      if (e.target === waModal) closeWaModal();
    });

    // Preset click
    waPresets.forEach(preset => {
      preset.addEventListener('click', () => {
        window.playClickSound?.();
        waPresets.forEach(p => p.classList.remove('active'));
        preset.classList.add('active');
        const text = preset.getAttribute('data-text');
        if (waMsgInput && text) {
          waMsgInput.value = text;
        }
      });
    });

    // Open WhatsApp with text
    if (waSendBtn) {
      waSendBtn.addEventListener('click', () => {
        window.playClickSound?.();
        const text = (waMsgInput ? waMsgInput.value.trim() : '') ||
          'Hi Mohan, I saw your portfolio and would like to discuss a UI/UX project!';
        const encoded = encodeURIComponent(text);
        const url = `https://wa.me/${PHONE_NUMBER}?text=${encoded}`;
        window.open(url, '_blank', 'noopener,noreferrer');
        closeWaModal();
        window.showToast?.('Opening WhatsApp to chat with Mohan...');
      });
    }
  }

  // --- 2. Contact Form Dispatcher ---
  function setupContactForm() {
    const form = document.getElementById('main-contact-form');
    if (!form) return;

    // Topic selection pills
    const topicPills = document.querySelectorAll('.topic-pill-btn');
    let selectedTopic = 'UI/UX Design Project';

    topicPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        window.playClickSound?.();
        topicPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        selectedTopic = pill.getAttribute('data-topic') || pill.textContent;
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      window.playClickSound?.();

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !message) {
        window.showToast?.('Please fill out all fields before sending!');
        return;
      }

      window.showToast?.('Sending your message to Mohan\'s email...');

      // Dispatch to Mohan's email via FormSubmit
      if (window.sendLeadAlert) {
        window.sendLeadAlert({
          name: name,
          email: email,
          topic: selectedTopic,
          message: message
        });
      }

      // Build mailto URI as instant fallback
      const subject = encodeURIComponent(`[Portfolio Inquiry - ${selectedTopic}] From ${name}`);
      const body = encodeURIComponent(
        `Hi Mohan,\n\nName: ${name}\nEmail: ${email}\nTopic: ${selectedTopic}\n\nMessage:\n${message}\n\n---\nSent from your portfolio website.`
      );
      const mailtoUrl = `mailto:${EMAIL_ADDRESS}?subject=${subject}&body=${body}`;

      setTimeout(() => {
        window.showToast?.('Inquiry dispatched! Opening mail client draft backup...');
        window.location.href = mailtoUrl;
      }, 700);

      form.reset();
    });
  }

  // --- 3. One-Click Copy Buttons ---
  function setupCopyActions() {
    const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
    copyEmailBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.playClickSound?.();
        copyToClipboard(EMAIL_ADDRESS, 'Email address copied: ' + EMAIL_ADDRESS);
      });
    });

    const copyPhoneBtns = document.querySelectorAll('.copy-phone-btn');
    copyPhoneBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.playClickSound?.();
        copyToClipboard('+919629485076', 'Phone number copied: +91 9629485076');
      });
    });
  }

  function copyToClipboard(text, successMsg) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        window.showToast?.(successMsg);
      }).catch(() => {
        fallbackCopy(text, successMsg);
      });
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      window.showToast?.(successMsg);
    } catch (err) {
      window.showToast?.('Copy failed. Please copy manually: ' + text);
    }
    document.body.removeChild(tempInput);
  }

  // --- Initializer ---
  document.addEventListener('DOMContentLoaded', () => {
    setupWhatsApp();
    setupContactForm();
    setupCopyActions();
  });
})();
