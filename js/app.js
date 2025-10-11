// app.js — menu + CTA dropdown + footer year
(() => {
  // Footer year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // ----- Off-canvas menu -----
  const menu = document.getElementById('sidemenu');
  const hamburger = document.querySelector('.hamburger');
  const backdrop = document.querySelector('.backdrop');

  const openMenu = () => {
    if (!menu) return;
    menu.classList.add('open');
    backdrop?.classList.add('show');
    hamburger?.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
    const firstLink = menu.querySelector('.menu-item');
    firstLink && firstLink.focus();
  };
  const closeMenu = () => {
    if (!menu) return;
    menu.classList.remove('open');
    backdrop?.classList.remove('show');
    hamburger?.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    hamburger && hamburger.focus();
  };

  hamburger?.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });
  backdrop?.addEventListener('click', closeMenu);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
      closeDropdown();
    }
  });

  // ----- CTA dropdown -----
  const ctaBtn = document.getElementById('adoptCta');
  const ctaMenu = document.getElementById('adoptMenu');

  const openDropdown = () => {
    ctaMenu?.classList.add('show');
    ctaBtn?.setAttribute('aria-expanded', 'true');
    ctaMenu?.setAttribute('aria-hidden', 'false');
  };
  const closeDropdown = () => {
    ctaMenu?.classList.remove('show');
    ctaBtn?.setAttribute('aria-expanded', 'false');
    ctaMenu?.setAttribute('aria-hidden', 'true');
  };

  ctaBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = ctaMenu?.classList.contains('show');
    isOpen ? closeDropdown() : openDropdown();
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!ctaMenu || !ctaBtn) return;
    if (ctaMenu.classList.contains('show')) {
      const target = e.target;
      if (!ctaMenu.contains(target) && target !== ctaBtn) {
        closeDropdown();
      }
    }
  });
})();
