// script.js

// Typing animation for main heading
const mainHeading = document.querySelector('.main-heading');
const headingText = "Cześć! Jestem p1eter";
let idx = 0;
function typeWriter() {
  if (idx <= headingText.length) {
    mainHeading.innerHTML = headingText.slice(0, idx) + '<span class="caret" aria-hidden="true"></span>';
    idx++;
    setTimeout(typeWriter, idx < 4 ? 350 : 90 + Math.random() * 60);
  } else {
    mainHeading.innerHTML = headingText; // remove caret at end
  }
}
typeWriter();

// Navigation active link underline and smooth scroll
const navLinks = document.querySelectorAll('.nav-link');
function setActiveNavLink() {
  let scrollPos = window.scrollY || window.pageYOffset;
  let found = false;
  document.querySelectorAll('section.section').forEach((section, i) => {
    const top = section.offsetTop - 80;
    const bottom = top + section.offsetHeight;
    if (scrollPos >= top && scrollPos < bottom && !found) {
      navLinks.forEach(link => link.classList.remove('active'));
      navLinks[i].classList.add('active');
      found = true;
    }
  });
  // If at bottom, highlight Contact
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2) {
    navLinks.forEach(link => link.classList.remove('active'));
    navLinks[navLinks.length - 1].classList.add('active');
  }
}
window.addEventListener('scroll', setActiveNavLink);
window.addEventListener('DOMContentLoaded', setActiveNavLink);

// Smooth scroll for nav links
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    const hash = this.getAttribute('href');
    if (hash.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(hash);
      if (target) {
        window.scrollTo({ top: target.offsetTop - 55, behavior: 'smooth' });
        setTimeout(() => target.setAttribute('tabindex', '-1'), 400);
      }
      // For mobile nav, close menu after click
      document.getElementById('nav-links').classList.remove('open');
      document.querySelector('.nav-toggle').setAttribute('aria-expanded', 'false');
    }
  });
});

// Responsive nav toggle
const navToggle = document.querySelector('.nav-toggle');
navToggle.addEventListener('click', function() {
  const nav = document.getElementById('nav-links');
  nav.classList.toggle('open');
  const expanded = nav.classList.contains('open');
  navToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
});

// Fade-in on scroll for sections and elements
function handleFadeInOnScroll() {
  const fadeElems = document.querySelectorAll('.fade-in-on-scroll');
  fadeElems.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      el.classList.add('visible');
    }
  });
  // Animate skills progress bars
  document.querySelectorAll('.skill-card').forEach(card => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      card.classList.add('visible');
      const progress = card.querySelector('.progress');
      if(progress && progress.style.width.match(/^\d+%$/)) {
        // already set
      } else if(progress) {
        progress.style.width = progress.parentElement.dataset.width || "50%";
      }
    }
  });
}
window.addEventListener('scroll', handleFadeInOnScroll);
window.addEventListener('DOMContentLoaded', handleFadeInOnScroll);

// Animated progress bars on skills
document.querySelectorAll('.skill-card').forEach(card => {
  // No-op for now, handled in fade-in above
});

// Project card hover (optional: can add more JS effects here if needed)

// Contact form validation and feedback
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
contactForm.addEventListener('submit', function(e) {
  e.preventDefault();
  // Very basic client-side validation
  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();
  if (!name || !email || !message) {
    formStatus.textContent = "Please fill in all fields.";
    formStatus.style.color = "#ff364e";
    return;
  }
  if (!/^[\w\-\.\+]+@([\w-]+\.)+[\w-]{2,20}$/.test(email)) {
    formStatus.textContent = "Please enter a valid email address.";
    formStatus.style.color = "#ff364e";
    return;
  }
  // Simulate sending
  formStatus.textContent = "Sending...";
  formStatus.style.color = "#ea0029";
  setTimeout(() => {
    formStatus.textContent = "Thank you for your message!";
    formStatus.style.color = "#4be49a";
    contactForm.reset();
  }, 1200);
});

// Keyboard accessibility for nav toggle
navToggle.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    navToggle.click();
  }
});

// Typing caret
const styleCaret = document.createElement('style');
styleCaret.innerHTML = `.caret { border-right: 2.5px solid #ff364e; animation: blink 1.1s steps(1) infinite; }
@keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0;} }`;
document.head.appendChild(styleCaret);
