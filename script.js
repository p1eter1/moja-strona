// script.js
// Implements draggable window, Start menu, theme toggle (persisted), modal, keyboard accessibility, and clock.
// Comments explain where to change behavior or text.

(function(){
  // Helpers
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

  const desktop = $('#desktop');
  const win = $('#window');
  const titlebar = $('#titlebar');
  const startBtn = $('#start-btn');
  const startMenu = $('#start-menu');
  const aboutModal = $('#about-modal');
  const aboutCloseBtns = $$('.close-modal, [data-action="close-about"]');
  const themeSwitch = $('#theme-switch');
  const clockEl = $('#clock');

  // ---------- THEME ----------
  const THEME_KEY = 'p1eter_theme_choice';
  function applyTheme(name){
    if(name === 'classic'){
      desktop.classList.remove('theme-luna');
      desktop.classList.add('theme-classic');
      desktop.setAttribute('data-theme','classic');
    } else {
      desktop.classList.remove('theme-classic');
      desktop.classList.add('theme-luna');
      desktop.setAttribute('data-theme','luna');
    }
  }
  // initialize theme (persisted)
  const stored = localStorage.getItem(THEME_KEY) || 'luna';
  applyTheme(stored);
  themeSwitch.checked = (stored === 'luna');
  // toggle handler
  themeSwitch.addEventListener('change', (e) => {
    const newTheme = e.target.checked ? 'luna' : 'classic';
    applyTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
  });

  // ---------- CLOCK ----------
  function updateClock(){
    const d = new Date();
    const hh = String(d.getHours()).padStart(2,'0');
    const mm = String(d.getMinutes()).padStart(2,'0');
    clockEl.textContent = `${hh}:${mm}`;
  }
  updateClock();
  setInterval(updateClock, 30*1000);

  // ---------- START MENU ----------
  function openStart(){
    const expanded = startMenu.getAttribute('aria-hidden') === 'false';
    if(expanded) closeStart();
    else {
      startMenu.setAttribute('aria-hidden','false');
      startBtn.setAttribute('aria-expanded','true');
      // focus first item
      const first = startMenu.querySelector('.menu-btn, .menu-link');
      if(first) first.focus();
      // close on outside click
      setTimeout(()=>window.addEventListener('click', outsideStart), 0);
    }
  }
  function closeStart(){
    startMenu.setAttribute('aria-hidden','true');
    startBtn.setAttribute('aria-expanded','false');
    window.removeEventListener('click', outsideStart);
  }
  function outsideStart(e){
    if(!startMenu.contains(e.target) && e.target !== startBtn) closeStart();
  }
  startBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openStart();
  });

  // Start menu "About" button
  const aboutBtn = startMenu.querySelector('[data-action="open-about"]');
  if(aboutBtn){
    aboutBtn.addEventListener('click', () => {
      openAbout();
      closeStart();
    });
  }

  // ---------- ABOUT MODAL ----------
  function openAbout(){
    aboutModal.setAttribute('aria-hidden','false');
    // focus close button
    const closeBtn = aboutModal.querySelector('.close-modal');
    if(closeBtn) closeBtn.focus();
    document.addEventListener('keydown', aboutEsc);
  }
  function closeAbout(){
    aboutModal.setAttribute('aria-hidden','true');
    document.removeEventListener('keydown', aboutEsc);
  }
  function aboutEsc(e){
    if(e.key === 'Escape') closeAbout();
  }
  aboutCloseBtns.forEach(b => b.addEventListener('click', closeAbout));
  // clicking overlay closes modal
  aboutModal.addEventListener('click', (e) => {
    if(e.target === aboutModal) closeAbout();
  });

  // ---------- TITLEBAR BUTTONS ----------
  $('#title-controls').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if(!btn) return;
    const action = btn.dataset.action;
    if(action === 'minimize'){
      win.style.display = 'none';
      // show a simple way to restore: clicking taskbar center area
      const center = $('#taskbar-center');
      center.textContent = 'p1eter — minimized (click to restore)';
      center.setAttribute('role','button');
      center.tabIndex = 0;
      const restoreFn = () => {
        win.style.display = 'flex';
        center.textContent = '';
        center.removeAttribute('role');
        center.removeAttribute('tabindex');
        center.removeEventListener('click', restoreFn);
        center.removeEventListener('keydown', restoreKey);
      };
      function restoreKey(e){ if(e.key === 'Enter') restoreFn(); }
      center.addEventListener('click', restoreFn);
      center.addEventListener('keydown', restoreKey);
    } else if(action === 'restore'){
      // simple restore to center of viewport
      win.style.display = 'flex';
      win.style.left = '';
      win.style.top = '';
      win.style.transform = 'none';
      win.focus();
    } else if(action === 'close'){
      // Close: hide window (user can refresh to see again)
      win.style.display = 'none';
      // Also put a small message in taskbar center to restore
      const center = $('#taskbar-center');
      center.textContent = 'Window closed. Refresh page to reopen.';
    }
  });

  // ---------- DRAGGABLE WINDOW ----------
  // supports mouse and touch; window stays within viewport
  (function makeDraggable(elem, handle){
    let dragging = false;
    let startX=0, startY=0, origX=0, origY=0;

    function onMouseDown(e){
      if(e.button !== 0) return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = elem.getBoundingClientRect();
      origX = rect.left;
      origY = rect.top;
      elem.style.transition = 'none';
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      e.preventDefault();
    }
    function onMouseMove(e){
      if(!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      elem.style.position = 'fixed';
      elem.style.left = Math.max(6, Math.min(window.innerWidth - elem.offsetWidth - 6, origX + dx)) + 'px';
      elem.style.top = Math.max(6, Math.min(window.innerHeight - elem.offsetHeight - varTaskbarHeight(), origY + dy)) + 'px';
    }
    function onMouseUp(e){
      dragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      elem.style.transition = '';
    }

    // Touch support
    function onTouchStart(e){
      const t = e.touches[0];
      dragging = true;
      startX = t.clientX;
      startY = t.clientY;
      const rect = elem.getBoundingClientRect();
      origX = rect.left;
      origY = rect.top;
      document.addEventListener('touchmove', onTouchMove, {passive:false});
      document.addEventListener('touchend', onTouchEnd);
    }
    function onTouchMove(e){
      if(!dragging) return;
      const t = e.touches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      elem.style.position = 'fixed';
      elem.style.left = Math.max(6, Math.min(window.innerWidth - elem.offsetWidth - 6, origX + dx)) + 'px';
      elem.style.top = Math.max(6, Math.min(window.innerHeight - elem.offsetHeight - varTaskbarHeight(), origY + dy)) + 'px';
      e.preventDefault();
    }
    function onTouchEnd(e){
      dragging = false;
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    }

    function varTaskbarHeight(){
      // parse CSS var for taskbar height fallback
      const tb = getComputedStyle(document.documentElement).getPropertyValue('--taskbar-height');
      const parsed = parseInt(tb) || 48;
      return parsed + 8;
    }

    handle.addEventListener('mousedown', onMouseDown);
    handle.addEventListener('touchstart', onTouchStart, {passive:false});
    // Also allow keyboard move for accessibility (arrow keys when focused)
    elem.addEventListener('keydown', (e) => {
      const step = e.shiftKey ? 20 : 8;
      if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)){
        e.preventDefault();
        const rect = elem.getBoundingClientRect();
        elem.style.position = 'fixed';
        if(e.key === 'ArrowUp') elem.style.top = (rect.top - step) + 'px';
        if(e.key === 'ArrowDown') elem.style.top = (rect.top + step) + 'px';
        if(e.key === 'ArrowLeft') elem.style.left = (rect.left - step) + 'px';
        if(e.key === 'ArrowRight') elem.style.left = (rect.left + step) + 'px';
      }
    });
  })(win, titlebar);

  // ---------- KEYBOARD ACCESSIBILITY ----------
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape'){
      // close overlays
      if(aboutModal.getAttribute('aria-hidden') === 'false') closeAbout();
      if(startMenu.getAttribute('aria-hidden') === 'false') closeStart();
    }
  });

  // ---------- SMALL UI HELPERS ----------
  // Focus trap: ensure focus returns to start button after closing start menu
  startBtn.addEventListener('keydown', (e)=> {
    if(e.key === 'ArrowDown') {
      e.preventDefault();
      openStart();
    }
  });

  // Accessibility: allow Enter to activate start menu items
  startMenu.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){
      const focused = document.activeElement;
      if(focused && focused.classList.contains('menu-btn')){
        focused.click();
      }
    }
  });

  // Ensure contact links show tooltip text for "Opens in new tab" on hover
  $$('.contact-link').forEach(a => {
    a.addEventListener('mouseenter', () => {
      if(a.target === '_blank') return;
      // append visually-hidden microcopy for screen readers
      a.setAttribute('title', a.href.includes('mailto:') ? 'Opens email client' : 'Opens in new tab');
    });
  });

  // Prevent focus loss when clicking inside start menu or modal
  $$('.menu-link').forEach(l => l.addEventListener('click', () => closeStart()));

  // On load, set ARIA states properly
  startMenu.setAttribute('aria-hidden','true');
  aboutModal.setAttribute('aria-hidden','true');

  // Make theme toggle label reflect current theme text
  function refreshThemeLabel(){
    const label = document.querySelector('.toggle-label');
    label.textContent = themeSwitch.checked ? 'Luna' : 'Classic';
  }
  refreshThemeLabel();
  themeSwitch.addEventListener('change', refreshThemeLabel);

  // Small: trap focus inside modal when open
  aboutModal.addEventListener('keydown', (e) => {
    if(aboutModal.getAttribute('aria-hidden') === 'true') return;
    if(e.key !== 'Tab') return;
    const focusable = Array.from(aboutModal.querySelectorAll('button, [href], input, textarea, [tabindex]:not([tabindex="-1"])')).filter(x => !x.hasAttribute('disabled'));
    if(focusable.length === 0) { e.preventDefault(); return; }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if(e.shiftKey && document.activeElement === first){
      e.preventDefault();
      last.focus();
    } else if(!e.shiftKey && document.activeElement === last){
      e.preventDefault();
      first.focus();
    }
  });

  // Accessibility tip: clicking the taskbar clock focuses the desktop
  document.getElementById('clock').addEventListener('click', ()=> desktop.focus());

  // End of script
})();
