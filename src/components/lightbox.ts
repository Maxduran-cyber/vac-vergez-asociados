export interface LightboxPlate {
  srcWebp: string;
  srcFallback: string;
  alt: string;
  caption: string;
  attribution: string;
  width: number;
  height: number;
}

export function renderLightboxModal(): string {
  return `
    <div
      class="lightbox-dialog"
      id="project-lightbox"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-caption"
      hidden
    >
      <div class="lightbox-backdrop" data-lightbox-close></div>
      <div class="lightbox-surface" role="document">
        <div class="lightbox-topbar">
          <span class="lightbox-counter" id="lightbox-counter">1 / 2</span>
          <button
            class="lightbox-close-btn"
            id="lightbox-close"
            type="button"
            aria-label="Cerrar visor de galería"
          >
            Cerrar ×
          </button>
        </div>

        <div class="lightbox-stage">
          <button
            class="lightbox-nav-btn lightbox-nav-btn--prev"
            id="lightbox-prev"
            type="button"
            aria-label="Lámina anterior"
          >
            ←
          </button>
          <figure class="lightbox-figure">
            <picture>
              <source id="lightbox-source-webp" type="image/webp" />
              <img
                id="lightbox-img"
                class="lightbox-img"
                alt=""
                width="548"
                height="730"
              />
            </picture>
            <figcaption class="lightbox-meta">
              <span class="lightbox-caption" id="lightbox-caption"></span>
              <span class="lightbox-attribution" id="lightbox-attribution"></span>
            </figcaption>
          </figure>
          <button
            class="lightbox-nav-btn lightbox-nav-btn--next"
            id="lightbox-next"
            type="button"
            aria-label="Siguiente lámina"
          >
            →
          </button>
        </div>
      </div>
    </div>
  `;
}

export function initLightboxController(): () => void {
  const dialog = document.getElementById('project-lightbox');
  const appShell = document.getElementById('app-shell');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const sourceWebp = document.getElementById('lightbox-source-webp') as HTMLSourceElement | null;
  const imgEl = document.getElementById('lightbox-img') as HTMLImageElement | null;
  const captionEl = document.getElementById('lightbox-caption');
  const attributionEl = document.getElementById('lightbox-attribution');
  const counterEl = document.getElementById('lightbox-counter');

  if (!dialog || !closeBtn || !prevBtn || !nextBtn || !sourceWebp || !imgEl || !captionEl || !attributionEl || !counterEl) {
    return () => undefined;
  }

  let plates: LightboxPlate[] = [];
  let currentIndex = 0;
  let opener: HTMLElement | null = null;
  let savedScrollY = 0;

  const updateSlide = () => {
    const plate = plates[currentIndex];
    if (!plate) return;
    sourceWebp.srcset = plate.srcWebp;
    imgEl.src = plate.srcFallback;
    imgEl.alt = plate.alt;
    imgEl.width = plate.width;
    imgEl.height = plate.height;
    captionEl.textContent = plate.caption;
    attributionEl.textContent = plate.attribution;
    counterEl.textContent = `${currentIndex + 1} / ${plates.length}`;
    prevBtn.toggleAttribute('disabled', plates.length <= 1);
    nextBtn.toggleAttribute('disabled', plates.length <= 1);
  };

  const close = () => {
    if (dialog.hasAttribute('hidden')) return;
    dialog.setAttribute('hidden', '');
    sourceWebp.removeAttribute('srcset');
    imgEl.removeAttribute('src');
    if (appShell) {
      appShell.removeAttribute('inert');
      appShell.removeAttribute('aria-hidden');
    }
    document.body.style.overflow = '';
    window.scrollTo(0, savedScrollY);
    if (opener && opener.isConnected) {
      opener.focus({ preventScroll: true });
    } else {
      document.getElementById('main-content')?.focus({ preventScroll: true });
    }
    opener = null;
  };

  const open = (items: LightboxPlate[], startIndex: number, triggerEl: HTMLElement) => {
    plates = items;
    currentIndex = Math.max(0, Math.min(items.length - 1, startIndex));
    opener = triggerEl;
    savedScrollY = window.scrollY;
    updateSlide();
    dialog.removeAttribute('hidden');
    if (appShell) {
      appShell.setAttribute('inert', '');
      appShell.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = 'hidden';
    closeBtn.focus({ preventScroll: true });
  };

  const onDocumentClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const trigger = target.closest<HTMLElement>('[data-lightbox-trigger]');
    if (trigger) {
      const groupId = trigger.dataset.lightboxGroup ?? 'default';
      const groupTriggers = Array.from(
        document.querySelectorAll<HTMLElement>(`[data-lightbox-trigger][data-lightbox-group="${groupId}"]`),
      );
      const items: LightboxPlate[] = groupTriggers.map((btn) => ({
        srcWebp: `/images/${btn.dataset.plateKey}.webp`,
        srcFallback: `/images/${btn.dataset.plateKey}.jpg`,
        alt: btn.dataset.plateAlt ?? '',
        caption: btn.dataset.plateCaption ?? '',
        attribution: btn.dataset.plateAttribution ?? '',
        width: Number(btn.dataset.plateWidth ?? 548),
        height: Number(btn.dataset.plateHeight ?? 730),
      }));
      const idx = groupTriggers.indexOf(trigger);
      open(items, idx >= 0 ? idx : 0, trigger);
      return;
    }

    if (event.target === dialog || (target && target.getAttribute('id') === 'project-lightbox') || target?.classList.contains('lightbox-backdrop')) {
      close();
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (dialog.hasAttribute('hidden')) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    } else if (event.key === 'ArrowLeft' && plates.length > 1) {
      event.preventDefault();
      currentIndex = (currentIndex - 1 + plates.length) % plates.length;
      updateSlide();
    } else if (event.key === 'ArrowRight' && plates.length > 1) {
      event.preventDefault();
      currentIndex = (currentIndex + 1) % plates.length;
      updateSlide();
    } else if (event.key === 'Tab') {
      const focusables = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]):not([hidden]), a[href]:not([hidden])',
        ),
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  const onPrev = () => {
    if (plates.length <= 1) return;
    currentIndex = (currentIndex - 1 + plates.length) % plates.length;
    updateSlide();
  };

  const onNext = () => {
    if (plates.length <= 1) return;
    currentIndex = (currentIndex + 1) % plates.length;
    updateSlide();
  };

  document.addEventListener('click', onDocumentClick);
  document.addEventListener('keydown', onKeyDown);
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', onPrev);
  nextBtn.addEventListener('click', onNext);

  return () => {
    document.removeEventListener('click', onDocumentClick);
    document.removeEventListener('keydown', onKeyDown);
    closeBtn.removeEventListener('click', close);
    prevBtn.removeEventListener('click', onPrev);
    nextBtn.removeEventListener('click', onNext);
  };
}
