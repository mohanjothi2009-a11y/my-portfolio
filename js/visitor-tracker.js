/**
 * Discreet Visitor Tracker & Lead Dispatcher for Mohan M's Portfolio
 * Replaces public website tracking with private real-time email notifications
 * sent directly to mohanjothi2009@gmail.com on unique visits and inquiries.
 */

(function () {
  'use strict';

  const TARGET_EMAIL = 'mohanjothi2009@gmail.com';
  const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${TARGET_EMAIL}`;
  const SESSION_FLAG = 'mohan_visit_alert_dispatched_v2';

  // --- 1. Gather Client & Visitor Metadata ---
  function getClientMetadata() {
    const ua = navigator.userAgent;
    let os = 'Unknown OS';
    let browser = 'Modern Browser';

    if (ua.indexOf('Win') !== -1) os = 'Windows PC';
    else if (ua.indexOf('Mac') !== -1) os = 'Mac / macOS';
    else if (ua.indexOf('Android') !== -1) os = 'Android Mobile';
    else if (ua.indexOf('like Mac') !== -1 || ua.indexOf('iPhone') !== -1 || ua.indexOf('iPad') !== -1) os = 'iOS Device';
    else if (ua.indexOf('Linux') !== -1) os = 'Linux';

    if (ua.indexOf('Chrome') !== -1 && ua.indexOf('Edg') === -1) browser = 'Google Chrome';
    else if (ua.indexOf('Safari') !== -1 && ua.indexOf('Chrome') === -1) browser = 'Apple Safari';
    else if (ua.indexOf('Firefox') !== -1) browser = 'Mozilla Firefox';
    else if (ua.indexOf('Edg') !== -1) browser = 'Microsoft Edge';

    const screenRes = `${window.screen.width} x ${window.screen.height}`;
    const referrer = document.referrer ? document.referrer : 'Direct / Portfolio Link';
    const visitTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';

    return {
      os,
      browser,
      screenRes,
      referrer,
      visitTime,
      pageUrl: window.location.href
    };
  }

  // --- 2. Silent Visitor Alert Dispatcher to Mohan's Email ---
  async function dispatchVisitorNotification() {
    // Only dispatch once per browser session to prevent email clutter
    if (sessionStorage.getItem(SESSION_FLAG)) {
      return;
    }

    const meta = getClientMetadata();

    // Fetch estimated geo location
    let locationStr = 'Chennai, India';
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const geo = await res.json();
        const city = geo.city || 'Unknown City';
        const region = geo.region || '';
        const country = geo.country_name || 'India';
        locationStr = `${city}${region ? ', ' + region : ''}, ${country}`;
      }
    } catch (err) {
      // Fallback
    }

    const payload = {
      _subject: `[Portfolio Visitor Alert] New visitor from ${locationStr} (${meta.os})`,
      _template: 'table',
      _captcha: 'false',
      "Visitor Location": locationStr,
      "Device & OS": meta.os,
      "Browser": meta.browser,
      "Screen Resolution": meta.screenRes,
      "Time (IST)": meta.visitTime,
      "Referral Source": meta.referrer,
      "Visited URL": meta.pageUrl
    };

    try {
      const resp = await fetch(FORMSUBMIT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (resp.ok) {
        sessionStorage.setItem(SESSION_FLAG, 'true');
        console.log('Visitor alert dispatched to', TARGET_EMAIL);
      }
    } catch (e) {
      // Silent failure, zero disruption to user
    }
  }

  // --- 3. Lead Submission Dispatcher for Contact Form ---
  window.sendLeadAlert = async function (leadData) {
    const meta = getClientMetadata();
    const payload = {
      _subject: `[Portfolio Inquiry] ${leadData.name} - ${leadData.topic}`,
      _template: 'table',
      _captcha: 'false',
      "Client Name": leadData.name,
      "Email Address": leadData.email,
      "Project Topic": leadData.topic,
      "Message": leadData.message,
      "Time (IST)": meta.visitTime,
      "Device": `${meta.os} • ${meta.browser}`,
      "Referral": meta.referrer
    };

    try {
      const res = await fetch(FORMSUBMIT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  };

  // Run automatically on load after small delay
  window.addEventListener('load', () => {
    setTimeout(dispatchVisitorNotification, 1800);
  });
})();
