// app.js — off-canvas menu + CTA dropdown + footer year + nested DFW submenu + a11y keys
(() => {
  // ----- Footer year -----
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // ===== Off-canvas menu =====
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
    document.documentElement.style.overflow = 'hidden'; // prevent page scroll
  };

  const closeMenu = () => {
    if (!menu) return;
    menu.classList.remove('open');
    backdrop?.classList.remove('show');
    hamburger?.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    hamburger && hamburger.focus();
    document.documentElement.style.overflow = ''; // restore scroll
  };

  hamburger?.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  backdrop?.addEventListener('click', () => {
    closeMenu();
    closeDropdown?.();
  });

  // ===== Main CTA dropdown =====
  // Page guard: skip all dropdown wiring on Happy Homes page
  const onHappyHomes = document.body.classList.contains('page-happy-homes');

  // These may be null (especially on Happy Homes)
  const ctaBtn  = onHappyHomes ? null : document.getElementById('adoptCta');
  const ctaMenu = onHappyHomes ? null : document.getElementById('adoptMenu');

  // Nested submenu (DFW)
  const dfwToggle = onHappyHomes ? null : document.getElementById('dfwToggle');
  const dfwMenu   = onHappyHomes ? null : document.getElementById('dfwMenu');

  const getFocusable = (root) =>
    root
      ? Array.from(
          root.querySelectorAll(
            'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
          )
        ).filter(el => !el.hasAttribute('aria-disabled'))
      : [];

  const closeSubmenus = () => {
    if (dfwMenu) {
      dfwMenu.classList.remove('show');
      dfwMenu.setAttribute('aria-hidden', 'true');
    }
    if (dfwToggle) dfwToggle.setAttribute('aria-expanded', 'false');
  };

  const openDropdown = () => {
    if (!ctaMenu || !ctaBtn) return;
    ctaMenu.classList.add('show');
    ctaBtn.setAttribute('aria-expanded', 'true');
    ctaMenu.setAttribute('aria-hidden', 'false');

    const focusables = getFocusable(ctaMenu);
    (focusables[0] || dfwToggle || ctaBtn).focus();
  };

  const closeDropdown = () => {
    if (!ctaMenu || !ctaBtn) return;
    ctaMenu.classList.remove('show');
    ctaBtn.setAttribute('aria-expanded', 'false');
    ctaMenu.setAttribute('aria-hidden', 'true');
    closeSubmenus();
    ctaBtn.focus();
  };

  // Close menu/dropdown on Escape anywhere
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (menu?.classList.contains('open')) closeMenu();
      if (ctaMenu?.classList.contains('show')) closeDropdown();
    }
  });

  // Prevent navigation on placeholders / disabled actions
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a.menu-item.placeholder, .cta-item.disabled');
    if (a) e.preventDefault();
  });

  // Wire events only if the dropdown exists and we're not on Happy Homes
  if (ctaBtn && ctaMenu) {
    ctaBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = ctaMenu?.classList.contains('show');
      isOpen ? closeDropdown() : openDropdown();
    });

    // Click outside closes dropdown
    document.addEventListener('click', (e) => {
      if (!ctaMenu || !ctaBtn) return;
      if (!ctaMenu.classList.contains('show')) return;
      const t = e.target;
      if (!ctaMenu.contains(t) && t !== ctaBtn) closeDropdown();
    });

    // ----- Nested DFW submenu toggle (click) -----
    dfwToggle?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!dfwMenu) return;
      const isOpen = dfwMenu.classList.contains('show');
      if (isOpen) {
        dfwMenu.classList.remove('show');
        dfwMenu.setAttribute('aria-hidden', 'true');
        dfwToggle.setAttribute('aria-expanded', 'false');
      } else {
        dfwMenu.classList.add('show');
        dfwMenu.setAttribute('aria-hidden', 'false');
        dfwToggle.setAttribute('aria-expanded', 'true');
        const firstCity = dfwMenu.querySelector('.cta-subitem');
        firstCity && firstCity.focus();
      }
    });

    // ===== Keyboard navigation inside dropdown =====
    ctaMenu?.addEventListener('keydown', (e) => {
      const focusables = getFocusable(ctaMenu);
      const idx = focusables.indexOf(document.activeElement);

      if (e.key === 'Escape') {
        e.preventDefault();
        closeDropdown();
        return;
      }

      // Open/close submenu with ArrowRight/Left on dfwToggle
      if (document.activeElement === dfwToggle) {
        if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          dfwToggle.click();
        }
        if (e.key === 'ArrowLeft' && dfwMenu?.classList.contains('show')) {
          e.preventDefault();
          dfwToggle.click();
        }
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = focusables[(idx + 1) % focusables.length];
        next?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = focusables[(idx - 1 + focusables.length) % focusables.length];
        prev?.focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        focusables[0]?.focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        focusables[focusables.length - 1]?.focus();
      }
    });

    // Prevent page scroll when using arrow keys within dropdown
    ['ArrowDown','ArrowUp','Home','End'].forEach(k => {
      ctaMenu?.addEventListener('keydown', (e) => {
        if (e.key === k) e.stopPropagation();
      });
    });
  }
})();
