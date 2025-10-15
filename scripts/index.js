/*
  LaunchLane – Minimal JavaScript
  Features:
  - Mobile navigation open/close with accessible aria-expanded
  - Smooth scrolling for nav + CTA links
  - Simple contact form validation and friendly success message
*/

/* ----------- Helper: select elements ----------- */
const $ = (sel, scope = document) => scope.querySelector(sel);
const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));

/* ----------- 1) Mobile Nav Toggle ----------- */
const header = $('.site-header');
const navToggleBtn = $('#navToggle');
const primaryNav = $('#primaryNav');

if (navToggleBtn && primaryNav) {
  navToggleBtn.addEventListener('click', () => {
    // Toggle an "open" class on the header which shows/hides the menu (CSS controls display)
    header.classList.toggle('open');

    // Update ARIA expanded state for screen readers
    const expanded = header.classList.contains('open');
    navToggleBtn.setAttribute('aria-expanded', String(expanded));

    // Update the accessible label to reflect state
    navToggleBtn.setAttribute('aria-label', expanded ? 'Close main menu' : 'Open main menu');
  });

  // Close the menu when a nav link is clicked (mobile usability)
  primaryNav.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    // Only act on internal anchors (href starts with '#')
    if (link.getAttribute('href')?.startsWith('#')) {
      header.classList.remove('open');
      navToggleBtn.setAttribute('aria-expanded', 'false');
      navToggleBtn.setAttribute('aria-label', 'Open main menu');
    }
  });
}

/* ----------- 2) Smooth Scrolling ----------- */
// We add this in JS even though CSS has scroll-behavior: smooth;
// Doing it here ensures older browsers still get a smooth experience.
const internalLinks = $$('a[data-scroll="true"]');

internalLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    e.preventDefault(); // Stop the default jump
    const target = document.querySelector(href);

    if (target) {
      // Scroll to the section smoothly
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Shift focus to the target for accessibility (helps keyboard/screen readers)
      target.setAttribute('tabindex', '-1'); // Make focusable if not by default
      target.focus({ preventScroll: true });
    }
  });
});

/* ----------- 3) Footer Year ----------- */
// Small enhancement to keep the footer year current
const yearEl = $('#year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* ----------- 4) Contact Form Validation ----------- */
const form = $('#contactForm');
const messageEl = $('#formMessage');

function isEmailValid(value) {
  // Simple email pattern: "text@text.domain"
  // This is intentionally basic to keep it beginner-friendly.
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(String(value).toLowerCase());
}

if (form && messageEl) {
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent real submission (no backend)

    // Grab field values
    const name = $('#name')?.value.trim();
    const email = $('#email')?.value.trim();
    const message = $('#message')?.value.trim();

    // Basic checks (empty fields + email format)
    if (!name || !email || !message) {
      messageEl.textContent = 'Please fill out all fields.';
      messageEl.style.color = '#fca5a5'; // Light red (kept inline here for simplicity of demo)
      return;
    }

    if (!isEmailValid(email)) {
      messageEl.textContent = 'Please enter a valid email address.';
      messageEl.style.color = '#fca5a5';
      return;
    }

    // If we got here, the form is "valid".
    messageEl.textContent = 'Thanks! Your message has been received. We will get back to you soon.';
    messageEl.style.color = '#34d399'; // Green success

    // Optionally clear the form to show it worked
    form.reset();

    // Move focus to the confirmation for accessibility
    messageEl.focus();
  });

  // Make the message element focusable when needed
  messageEl.setAttribute('tabindex', '-1');
}
