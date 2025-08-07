// script.js - minimal tab accessibility & keyboard support
(() => {
  const tabs = Array.from(document.querySelectorAll('.tabs [role="tab"]'));
  const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));

  function activate(targetId){
    tabs.forEach(t => t.setAttribute('aria-selected', t.dataset.target === targetId));
    panels.forEach(p => p.hidden = p.id !== targetId);
    const panel = document.getElementById(targetId);
    panel?.focus();
    history.replaceState(null, '', `#${targetId}`);
  }

  tabs.forEach(btn => {
    btn.addEventListener('click', () => activate(btn.dataset.target));
    btn.addEventListener('keydown', e => {
      const idx = tabs.indexOf(btn);
      if(e.key === 'ArrowRight') tabs[(idx+1)%tabs.length].focus();
      if(e.key === 'ArrowLeft') tabs[(idx-1+tabs.length)%tabs.length].focus();
      if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(btn.dataset.target); }
    });
  });

  // On load: activate hash or first tab
  const initial = location.hash ? location.hash.replace('#','') : tabs[0].dataset.target;
  activate(initial);
})();
