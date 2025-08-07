// script.js - tabs + keyboard + hash
document.addEventListener('DOMContentLoaded', () => {
  const tabs = Array.from(document.querySelectorAll('.tabs [role="tab"]'));
  const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
  if(!tabs.length) return;

  const activate = (id, push=false) => {
    tabs.forEach(t => t.setAttribute('aria-selected', t.dataset.target === id ? 'true' : 'false'));
    panels.forEach(p => p.hidden = p.id !== id);
    const panel = document.getElementById(id);
    panel?.focus();
    if(push) history.pushState(null,'',`#${id}`); else history.replaceState(null,'',`#${id}`);
  };

  tabs.forEach((btn, i) => {
    btn.addEventListener('click', () => activate(btn.dataset.target, true));
    btn.addEventListener('keydown', e => {
      if(e.key === 'ArrowRight') tabs[(i+1)%tabs.length].focus();
      if(e.key === 'ArrowLeft') tabs[(i-1+tabs.length)%tabs.length].focus();
      if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(btn.dataset.target, true); }
    });
  });

  // initial: hash or first
  const hash = location.hash.replace('#','');
  const initial = hash && document.getElementById(hash) ? hash : tabs[0].dataset.target;
  activate(initial);

  // handle back/forward
  window.addEventListener('popstate', () => {
    const h = location.hash.replace('#','') || tabs[0].dataset.target;
    activate(h);
  });
});
