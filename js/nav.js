/**
 * nav.js — Injects shared navbar and disclaimer banner on every page.
 * Call injectNav() from each page's <script> or from a DOMContentLoaded handler.
 */

(function () {
  const PAGES = [
    { href: 'index.html',       label: 'Dashboard'    },
    { href: 'judges.html',      label: 'Judges'       },
    { href: 'motions.html',     label: 'Motions'      },
    { href: 'temporal.html',    label: 'Time Patterns'},
    { href: 'motion-prep.html', label: 'Motion Prep'  },
    { href: 'methodology.html', label: 'Methodology'  },
  ];

  function currentPage() {
    const path = window.location.pathname;
    return path.split('/').pop() || 'index.html';
  }

  function buildNav() {
    const cur = currentPage();
    const links = PAGES.map(p => {
      const active = (p.href === cur || (cur === '' && p.href === 'index.html'))
        ? 'text-indigo-400 border-b-2 border-indigo-400 pb-0.5'
        : 'text-slate-300 hover:text-indigo-300 transition-colors';
      return `<a href="${p.href}" class="text-sm font-medium ${active}">${p.label}</a>`;
    }).join('');

    const nav = document.createElement('nav');
    nav.id = 'main-nav';
    nav.className = 'bg-slate-900 border-b border-slate-700 sticky top-0 z-50';
    nav.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-14">
          <a href="index.html" class="flex items-center gap-2 group">
            <span class="text-indigo-400 text-xl font-bold tracking-tight group-hover:text-indigo-300 transition-colors">
              Bench<span class="text-cyan-400">Signal</span>
            </span>
            <span class="hidden sm:inline text-xs text-slate-500 font-normal mt-0.5">Spokane Co. Superior Court · 2023</span>
          </a>
          <!-- Desktop links -->
          <div class="hidden md:flex items-center gap-6">
            ${links}
          </div>
          <!-- Mobile hamburger -->
          <button id="nav-toggle" class="md:hidden text-slate-400 hover:text-slate-200 p-2" aria-label="Toggle menu">
            <svg id="nav-icon-open" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <svg id="nav-icon-close" class="w-5 h-5 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <!-- Mobile menu -->
        <div id="mobile-menu" class="hidden md:hidden pb-3 flex-col gap-2 border-t border-slate-700 pt-3">
          ${PAGES.map(p => `<a href="${p.href}" class="block px-2 py-1 text-sm text-slate-300 hover:text-indigo-300">${p.label}</a>`).join('')}
        </div>
      </div>`;

    // Disclaimer banner
    const banner = document.createElement('div');
    banner.className = 'bg-amber-900/40 border-b border-amber-700/50 text-amber-200 text-xs text-center py-1.5 px-4';
    banner.innerHTML = `<strong>Research purposes only.</strong> This site does not constitute legal advice. Data reflects 2023 Spokane County Superior Court public records.`;

    document.body.insertAdjacentElement('afterbegin', banner);
    document.body.insertAdjacentElement('afterbegin', nav);

    // Mobile toggle
    document.getElementById('nav-toggle').addEventListener('click', () => {
      const menu = document.getElementById('mobile-menu');
      const open = document.getElementById('nav-icon-open');
      const close = document.getElementById('nav-icon-close');
      menu.classList.toggle('hidden');
      open.classList.toggle('hidden');
      close.classList.toggle('hidden');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildNav);
  } else {
    buildNav();
  }
})();
