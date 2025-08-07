// script.js
/*
  Polish text and sections: Edit the content array below to change Polish sections.
  Each object is one tab/panel. Keys:
    label: Tab label (must match order of <button>s in HTML)
    html: Polish paragraph(s) — plain text or HTML.
  To add or remove a tab, update both the content array and the <button>s in index.html.
*/

const content = [
  {
    label: 'O mnie',
    html: `<p>Cześć! Tu p1eter<br>
Mam 15 lat i jestem polakiem. Interesuję się technologią, uwielbiam nowinki technologiczne, a także odkrywać, jak działają różne urządzenia. Lubię również bawić się sztuczną inteligencją – jest to świetnym rozwiązaniem na nudę.</p>`
  },
  {
    label: 'Programowanie',
    html: `<p>Od niedawna uczę się programować, nie tylko w pythonie ale też w javascipt. Nie jestem jeszcze najlepszym programistą, ale znam podstawy pythona i javasript, a także HTML i CSS i staram się cały czas uczyć nowych rzeczy.</p>`
  },
  {
    label: 'Inspiracja',
    html: `<p>Chciałbym zaznaczyć, iż wygląd strony jest inspirowany stroną zrobioną przez patricktbp.</p>`
  },
  {
    label: 'Plany',
    html: `<p>Co mam w planach zrobić<br>
Nauczyć się programowawnia jeszcze lepiej, aby w przyszłosci kontynuować swoją pasje. Napisać jakąś gre.</p>`
  },
  {
    label: 'Kontakt',
    html: `<p>Gdzie możesz mnie znaleźć<br>
Możesz mnie znaleźć i porozmawiać na platformie Discord pod nazwą p1eter__ lub śledząc mój profil na Tiktoku o nazwie p1eter6, a także na tej stronie. Jeśli wolisz kontakt bardziej bezpośredni, możesz napisać do mnie maila: juzephsigma@gmail.com.</p>`
  }
];

const tabButtons = document.querySelectorAll('.tabs [role="tab"]');
const tabPanels = document.querySelectorAll('.tabpanel');
const main = document.getElementById('main');

function setPanelContent() {
  tabPanels.forEach((panel, i) => {
    panel.innerHTML = content[i].html;
  });
}

function activateTab(index, opts = {}) {
  // Deactivate all tabs/panels
  tabButtons.forEach((tab, i) => {
    tab.setAttribute('aria-selected', i === index ? 'true' : 'false');
    tab.tabIndex = i === index ? 0 : -1;
    tab.classList.toggle('active', i === index);
  });
  tabPanels.forEach((panel, i) => {
    panel.classList.toggle('active', i === index);
    if (i === index && opts.scrollIntoView) {
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
  // For accessibility: move focus as requested
  if (opts.focus && tabButtons[index]) tabButtons[index].focus();
  // Animation: restart animation for active panel
  if (tabPanels[index]) {
    tabPanels[index].classList.remove('animate');
    void tabPanels[index].offsetWidth; // force reflow
    tabPanels[index].classList.add('animate');
  }
  // Save to localStorage
  localStorage.setItem('activeTab', index);
  // Update URL hash
  if (opts.updateHash) {
    window.location.hash = `#tab${index + 1}`;
  }
}

function getTabIndexFromHash(hash) {
  if (hash && hash.startsWith('#tab')) {
    const n = parseInt(hash.replace('#tab',''), 10);
    if (!isNaN(n) && n > 0 && n <= tabButtons.length) return n - 1;
  }
  return null;
}

// Event listeners
tabButtons.forEach((tab, i) => {
  tab.addEventListener('click', () => {
    activateTab(i, { updateHash: true, scrollIntoView: true });
  });
  tab.addEventListener('keydown', e => {
    let newIdx;
    switch (e.key) {
      case 'ArrowRight':
        newIdx = (i + 1) % tabButtons.length;
        tabButtons[newIdx].focus();
        break;
      case 'ArrowLeft':
        newIdx = (i - 1 + tabButtons.length) % tabButtons.length;
        tabButtons[newIdx].focus();
        break;
      case 'Home':
        tabButtons[0].focus();
        break;
      case 'End':
        tabButtons[tabButtons.length - 1].focus();
        break;
      case 'Enter':
      case ' ':
        activateTab(i, { updateHash: true, scrollIntoView: true, focus: true });
        break;
    }
  });
});

// URL hash and popstate management
window.addEventListener('hashchange', () => {
  const idx = getTabIndexFromHash(location.hash);
  if (idx !== null) activateTab(idx, { scrollIntoView: true });
});
window.addEventListener('popstate', () => {
  const idx = getTabIndexFromHash(location.hash);
  if (idx !== null) activateTab(idx, { scrollIntoView: true });
});

// Initial load logic
document.addEventListener('DOMContentLoaded', () => {
  setPanelContent();
  // Prefer URL hash, else localStorage, else 0
  let idx = getTabIndexFromHash(location.hash);
  if (idx === null) {
    idx = parseInt(localStorage.getItem('activeTab'), 10);
    if (isNaN(idx) || idx < 0 || idx >= tabButtons.length) idx = 0;
  }
  activateTab(idx, { focus: false, updateHash: true });
  // Restore focus to skip link if coming from it
  if (location.hash === '#main') main.focus();
});

// Panel animation: remove class after animation ends
tabPanels.forEach(panel => {
  panel.addEventListener('animationend', () => {
    panel.classList.remove('animate');
  });
});
