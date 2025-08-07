// script.js
// Tab system for the page, with keyboard navigation, hash deep-linking and last-tab persistence.
// Ready to use on GitHub Pages (pure client-side).

(() => {
  const TAB_KEY = 'p1eter_last_tab';

  // Tab configuration (IDs must match markup)
  const tabs = [
    {btnId: 'tab-btn-intro', panelId: 'tab-intro'},
    {btnId: 'tab-btn-learn', panelId: 'tab-learn'},
    {btnId: 'tab-btn-inspired', panelId: 'tab-inspired'},
    {btnId: 'tab-btn-plans', panelId: 'tab-plans'},
    {btnId: 'tab-btn-contact', panelId: 'tab-contact'}
  ];

  // Helpers
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  function activateTab(index, focus = true, pushState = true) {
    tabs.forEach((t, i) => {
      const btn = document.getElementById(t.btnId);
      const panel = document.getElementById(t.panelId);
      const selected = i === index;
      btn.setAttribute('aria-selected', selected ? 'true' : 'false');
      btn.tabIndex = selected ? 0 : -1;
      panel.hidden = !selected;
      if (selected) {
        if (focus) btn.focus();
        // update URL hash for deep linking
        const hash = `#${t.panelId}`;
        if (pushState) history.replaceState(null, '', hash);
        localStorage.setItem(TAB_KEY, t.panelId);
      }
    });
  }

  // Find initial tab from hash or localStorage (fallback to 0)
  function initialIndex() {
    const hash = location.hash.replace('#', '');
    if (hash) {
      const found = tabs.findIndex(t => t.panelId === hash);
      if (found >= 0) return found;
    }
    const stored = localStorage.getItem(TAB_KEY);
    if (stored) {
      const found = tabs.findIndex(t => t.panelId === stored);
      if (found >= 0) return found;
    }
    return 0;
  }

  // Add event listeners to tab buttons
  tabs.forEach((t, idx) => {
    const btn = document.getElementById(t.btnId);
    btn.addEventListener('click', (e) => {
      activateTab(idx, true, true);
    });

    // Keyboard navigation for tab buttons (Left/Right/Home/End)
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = (idx + 1) % tabs.length;
        document.getElementById(tabs[next].btnId).focus();
        activateTab(next, false, true);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = (idx - 1 + tabs.length) % tabs.length;
        document.getElementById(tabs[prev].btnId).focus();
        activateTab(prev, false, true);
      } else if (e.key === 'Home') {
        e.preventDefault();
        activateTab(0, true, true);
      } else if (e.key === 'End') {
        e.preventDefault();
        activateTab(tabs.length - 1, true, true);
      }
    });
  });

  // Listen to hashchange (e.g., user pastes link)
  window.addEventListener('hashchange', () => {
    const idx = initialIndex();
    activateTab(idx, true, false);
  });

  // Initialize
  const startIndex = initialIndex();
  activateTab(startIndex, false, false);

  // Small UX: set updated date in footer
  const updatedEl = document.getElementById('updated');
  if (updatedEl) {
    const d = new Date();
    updatedEl.textContent = d.toLocaleDateString('pl-PL', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  // Accessibility: skip to content when pressing Enter on brand
  const brandLink = document.querySelector('.brand a');
  brandLink.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById(tabs[0].panelId).focus();
  });

  // Optional: animate the content panel on tab change
  const panels = $$('section[role="tabpanel"]');
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.attributeName === 'hidden') {
        panels.forEach(p => {
          if (!p.hidden) {
            p.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 220, easing: 'ease-out' });
          }
        });
      }
    }
  });
  panels.forEach(p => observer.observe(p, { attributes: true }));

})();
