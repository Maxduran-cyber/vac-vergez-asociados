import { ASSET_DIMENSIONS } from '../data/assetManifest';
import { escapeHtml } from '../utils/html';

export interface ProjectPlateOptions {
  imageKey: string;
  alt: string;
  className?: string;
  priority?: 'eager' | 'lazy';
  sizes?: string;
}

export function renderHeroPicture(alt: string): string {
  const desktop = ASSET_DIMENSIONS.heroDesktop;
  const mobile = ASSET_DIMENSIONS.heroMobile;

  return `
    <picture class="hero-picture">
      <source
        media="(max-width: 767px)"
        type="image/webp"
        srcset="/images/hero-habitat-v3-mobile-1080.webp 1080w, /images/hero-habitat-v3-mobile-1440.webp 1440w"
        sizes="100vw"
        width="${mobile.width}"
        height="${mobile.height}"
      />
      <source
        type="image/webp"
        srcset="/images/hero-habitat-v3-4k-1920.webp 1920w, /images/hero-habitat-v3-4k-2560.webp 2560w, /images/hero-habitat-v3-4k-3840.webp 3840w"
        sizes="100vw"
        width="${desktop.width}"
        height="${desktop.height}"
      />
      <img
        class="hero-bg-image"
        src="/images/hero-habitat-v3-4k-1920.jpg"
        alt="${escapeHtml(alt)}"
        width="${desktop.width}"
        height="${desktop.height}"
        loading="eager"
        decoding="sync"
        fetchpriority="high"
      />
    </picture>
  `;
}

export function renderProjectPicture(options: ProjectPlateOptions): string {
  const {
    imageKey,
    alt,
    className = 'plate-image',
    priority = 'lazy',
    sizes = '(max-width: 767px) 92vw, 548px',
  } = options;

  const { width, height } = ASSET_DIMENSIONS.projectPlate;
  const fetchPriority = priority === 'eager' ? ' fetchpriority="high"' : '';
  const decoding = priority === 'eager' ? 'sync' : 'async';

  return `
    <picture class="plate-picture">
      <source
        type="image/webp"
        srcset="/images/${escapeHtml(imageKey)}-420.webp 420w, /images/${escapeHtml(imageKey)}.webp 548w"
        sizes="${escapeHtml(sizes)}"
      />
      <img
        class="${escapeHtml(className)}"
        src="/images/${escapeHtml(imageKey)}.jpg"
        alt="${escapeHtml(alt)}"
        width="${width}"
        height="${height}"
        loading="${priority}"
        decoding="${decoding}"${fetchPriority}
      />
    </picture>
  `;
}

export function renderInstitutionalPicture(className = 'expansion-image', priority: 'eager' | 'lazy' = 'lazy'): string {
  const { width, height } = ASSET_DIMENSIONS.institutional;
  return `
    <picture class="institutional-picture">
      <source
        type="image/webp"
        srcset="/images/institucional-vac-760.webp 760w, /images/institucional-vac-1059.webp 1059w"
        sizes="(max-width: 767px) 92vw, 1059px"
      />
      <img
        class="${escapeHtml(className)}"
        src="/images/institucional-vac-1059.jpg"
        alt="Fachada contemporánea con jardines y logotipo institucional de VAC — Vergez & Asociados"
        width="${width}"
        height="${height}"
        loading="${priority}"
        decoding="async"
      />
    </picture>
  `;
}
