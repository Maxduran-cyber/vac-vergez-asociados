import gsap from 'gsap';
import { BRAND_DATA, NAVIGATION_ITEMS } from '../data/content';
import { ASSET_DIMENSIONS } from '../data/assetManifest';
import { escapeHtml } from '../utils/html';

export function renderSideMenuDrawer(currentPath: string): string {
  const initialPreview = NAVIGATION_ITEMS[0];

  const linksHtml = NAVIGATION_ITEMS.map((item) => {
    const isCurrent =
      item.href === '/'
        ? currentPath === '/'
        : currentPath === item.href || currentPath.startsWith(`${item.href}/`);

    return `
      <li class="drawer-nav-item">
        <a
          class="drawer-nav-link ${isCurrent ? 'is-current' : ''}"
          href="${escapeHtml(item.href)}"
          data-nav-link
          data-drawer-link
          data-preview-key="${escapeHtml(item.previewImageKey)}"
          data-preview-alt="${escapeHtml(item.previewAlt)}"
          ${isCurrent ? 'aria-current="page"' : ''}
        >
          <span class="drawer-nav-label">${escapeHtml(item.label)}</span>
          <span class="drawer-nav-arrow" aria-hidden="true">→</span>
        </a>
      </li>
    `;
  }).join('');

  return `
    <div class="side-menu-root" id="side-menu-root" hidden>
      <div class="side-menu-backdrop" id="side-menu-backdrop" aria-hidden="true"></div>
      <aside
        class="side-menu-drawer"
        id="side-menu-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menú principal de navegación"
      >
        <div class="drawer-header">
          <a class="drawer-brand" href="/" data-nav-link aria-label="VAC — Vergez & Asociados, inicio">
            <img
              src="${escapeHtml(BRAND_DATA.logoWhite.webp)}"
              alt=""
              width="${BRAND_DATA.logoWhite.width}"
              height="${BRAND_DATA.logoWhite.height}"
              class="drawer-brand-logo"
            />
          </a>
          <button
            class="drawer-close-btn"
            id="menu-close"
            type="button"
            aria-label="Cerrar menú"
          >
            Cerrar <span aria-hidden="true">×</span>
          </button>
        </div>

        <div class="drawer-body">
          <nav class="drawer-nav" aria-label="Navegación principal del sitio">
            <ul class="drawer-nav-list">
              ${linksHtml}
            </ul>
          </nav>

          <div class="drawer-preview-col" aria-hidden="true">
            <div class="drawer-preview-frame">
              <img
                id="drawer-preview-img"
                class="drawer-preview-img"
                src="/images/${escapeHtml(initialPreview.previewImageKey)}.webp"
                alt=""
                width="${ASSET_DIMENSIONS.projectPlate.width}"
                height="${ASSET_DIMENSIONS.projectPlate.height}"
                loading="eager"
                decoding="async"
              />
            </div>
            <p class="drawer-preview-caption" id="drawer-preview-caption">
              ${escapeHtml(initialPreview.previewAlt)}
            </p>
          </div>
        </div>

        <div class="drawer-footer">
          <div class="drawer-contact-block">
            <span class="drawer-contact-label">Teléfono</span>
            <a class="drawer-contact-value" href="${escapeHtml(BRAND_DATA.phoneHref)}">${escapeHtml(BRAND_DATA.phoneDisplay)}</a>
          </div>
          <div class="drawer-contact-block">
            <span class="drawer-contact-label">Correo</span>
            <a class="drawer-contact-value" href="${escapeHtml(BRAND_DATA.emailHref)}">${escapeHtml(BRAND_DATA.emailDisplay)}</a>
          </div>
        </div>
      </aside>
    </div>
  `;
}

export interface SideMenuController {
  open: () => void;
  close: (options?: { restoreScroll?: boolean; returnFocus?: boolean }) => void;
  updateCurrentPath: (path: string) => void;
  destroy: () => void;
}

export function initSideMenuController(): SideMenuController {
  const root = document.getElementById('side-menu-root');
  const backdrop = document.getElementById('side-menu-backdrop');
  const drawer = document.getElementById('side-menu-drawer');
  const closeBtn = document.getElementById('menu-close');
  const appShell = document.getElementById('app-shell');
  const previewFrame = drawer?.querySelector<HTMLElement>('.drawer-preview-frame') ?? null;
  const previewImg = document.getElementById('drawer-preview-img') as HTMLImageElement | null;
  const previewCaption = document.getElementById('drawer-preview-caption');

  let isOpen = false;
  let savedScrollY = 0;
  let activeTween: gsap.core.Timeline | null = null;
  let previewTween: gsap.core.Timeline | null = null;
  let currentPreviewKey = NAVIGATION_ITEMS[0]?.previewImageKey ?? '';

  NAVIGATION_ITEMS.forEach((item) => {
    const img = new window.Image();
    img.src = `/images/${item.previewImageKey}.webp`;
  });

  const getToggleBtn = () => document.getElementById('menu-toggle');
  const getDrawerLinks = () => Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-drawer-link]'));

  const updatePreview = (link: HTMLElement) => {
    const key = link.dataset.previewKey;
    const alt = link.dataset.previewAlt;
    if (!key || !previewImg || key === currentPreviewKey) return;

    currentPreviewKey = key;

    previewTween?.kill();
    const previewTargets = [previewFrame, previewImg, previewCaption].filter(Boolean);
    gsap.killTweensOf(previewTargets);

    previewImg.src = `/images/${key}.webp`;
    if (previewCaption && alt) {
      previewCaption.textContent = alt;
    }

    const tl = gsap.timeline();
    if (previewFrame) {
      tl.fromTo(
        previewFrame,
        { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0.35 },
        { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 0.68, ease: 'power3.out', clearProps: 'clipPath,opacity' },
        0,
      );
    }
    tl.fromTo(
      previewImg,
      { opacity: 0.2, scale: 1.12, y: 10 },
      { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'power3.out', clearProps: 'transform,opacity' },
      0,
    );
    if (previewCaption) {
      tl.fromTo(
        previewCaption,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', clearProps: 'transform,opacity' },
        0.1,
      );
    }
    previewTween = tl;
  };

  const lockScroll = () => {
    savedScrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  };

  const unlockScroll = (restoreScroll: boolean) => {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    if (restoreScroll) {
      window.scrollTo(0, savedScrollY);
    }
  };

  const open = () => {
    if (!root || !drawer || !backdrop || isOpen) return;
    isOpen = true;
    activeTween?.kill();
    previewTween?.kill();

    const toggleBtn = getToggleBtn();
    toggleBtn?.setAttribute('aria-expanded', 'true');

    root.removeAttribute('hidden');
    if (appShell) {
      appShell.setAttribute('inert', '');
      appShell.setAttribute('aria-hidden', 'true');
    }
    lockScroll();

    const links = getDrawerLinks();
    gsap.set(backdrop, { opacity: 0 });
    gsap.set(drawer, { xPercent: 100 });
    gsap.set(links, { opacity: 0, y: 12 });
    if (previewFrame) {
      gsap.set(previewFrame, { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0, y: 24 });
    }
    if (previewImg) {
      gsap.set(previewImg, { scale: 1.15 });
    }
    if (previewCaption) {
      gsap.set(previewCaption, { opacity: 0, y: 8 });
    }

    let userHoveredSinceOpen = false;
    const markHovered = () => {
      userHoveredSinceOpen = true;
    };
    drawer.addEventListener('pointerover', markHovered, { once: true });

    const tl = gsap.timeline({
      onComplete: () => {
        drawer.removeEventListener('pointerover', markHovered);
        if (!userHoveredSinceOpen) {
          (links[0] ?? closeBtn)?.focus({ preventScroll: true });
        }
      },
    });
    tl.to(backdrop, { opacity: 1, duration: 0.36, ease: 'power2.out' }, 0)
      .to(drawer, { xPercent: 0, duration: 0.42, ease: 'power3.out' }, 0)
      .to(
        links,
        {
          opacity: 1,
          y: 0,
          duration: 0.32,
          stagger: 0.048,
          ease: 'power2.out',
        },
        0.14,
      );

    if (previewFrame) {
      tl.to(
        previewFrame,
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          y: 0,
          duration: 0.78,
          ease: 'power3.out',
          clearProps: 'clipPath,transform,opacity',
        },
        0.2,
      );
    }
    if (previewImg) {
      tl.to(
        previewImg,
        {
          scale: 1,
          duration: 0.9,
          ease: 'power3.out',
          clearProps: 'transform',
        },
        0.2,
      );
    }
    if (previewCaption) {
      tl.to(
        previewCaption,
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
        },
        0.34,
      );
    }

    activeTween = tl;
  };

  const finishClose = (restoreScroll: boolean, returnFocus: boolean) => {
    if (!root) return;
    root.setAttribute('hidden', '');
    if (appShell) {
      appShell.removeAttribute('inert');
      appShell.removeAttribute('aria-hidden');
    }
    unlockScroll(restoreScroll);

    const toggleBtn = getToggleBtn();
    toggleBtn?.setAttribute('aria-expanded', 'false');
    if (returnFocus && toggleBtn && toggleBtn.isConnected) {
      toggleBtn.focus({ preventScroll: true });
    }
  };

  const close = (options?: { restoreScroll?: boolean; returnFocus?: boolean }) => {
    if (!root || !drawer || !backdrop || !isOpen) return;
    const restoreScroll = options?.restoreScroll ?? true;
    const returnFocus = options?.returnFocus ?? true;
    isOpen = false;
    activeTween?.kill();

    const tl = gsap.timeline({
      onComplete: () => finishClose(restoreScroll, returnFocus),
    });
    tl.to(drawer, { xPercent: 100, duration: 0.36, ease: 'power3.in' }, 0).to(
      backdrop,
      { opacity: 0, duration: 0.32, ease: 'power2.in' },
      0,
    );
    activeTween = tl;
  };

  const updateCurrentPath = (path: string) => {
    getDrawerLinks().forEach((link) => {
      const href = link.getAttribute('href') ?? '';
      const isCurrent = href === '/' ? path === '/' : path === href || path.startsWith(`${href}/`);
      link.classList.toggle('is-current', isCurrent);
      if (isCurrent) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const onDocumentClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    if (target.closest('#menu-toggle')) {
      event.preventDefault();
      if (isOpen) close();
      else open();
      return;
    }
    if (target.closest('#menu-close') || target === backdrop) {
      event.preventDefault();
      close();
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (!isOpen || !drawer) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      close({ restoreScroll: true, returnFocus: true });
      return;
    }

    if (event.key === 'Tab') {
      const focusable = Array.from(
        drawer.querySelectorAll<HTMLElement>(
          'a[href]:not([hidden]):not([aria-hidden="true"]), button:not([disabled]):not([hidden]):not([aria-hidden="true"]), [tabindex]:not([tabindex="-1"]):not([hidden])',
        ),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  const onLinkInteract = (event: Event) => {
    const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-drawer-link]');
    if (target) {
      updatePreview(target);
    }
  };

  document.addEventListener('click', onDocumentClick);
  document.addEventListener('keydown', onKeyDown);
  drawer?.addEventListener('pointerover', onLinkInteract);
  drawer?.addEventListener('mouseover', onLinkInteract);
  drawer?.addEventListener('focusin', onLinkInteract);

  return {
    open,
    close,
    updateCurrentPath,
    destroy: () => {
      activeTween?.kill();
      previewTween?.kill();
      document.removeEventListener('click', onDocumentClick);
      document.removeEventListener('keydown', onKeyDown);
      drawer?.removeEventListener('pointerover', onLinkInteract);
      drawer?.removeEventListener('mouseover', onLinkInteract);
      drawer?.removeEventListener('focusin', onLinkInteract);
    },
  };
}
