import { BRAND_DATA } from '../data/content';
import { escapeHtml } from '../utils/html';

export function renderHeader(isDarkHeroRoute: boolean): string {
  const modeClass = isDarkHeroRoute ? 'site-header--hero-dark' : 'site-header--solid-light';

  return `
    <a class="skip-link" href="#main-content">Saltar al contenido principal</a>
    <header class="site-header ${modeClass}" id="site-header" data-dark-hero="${isDarkHeroRoute ? 'true' : 'false'}">
      <div class="container header-inner">
        <a
          class="brand-mark"
          href="/"
          data-nav-link
          aria-label="VAC — Vergez & Asociados, ir al inicio"
        >
          <span class="brand-logo-wrap">
            <img
              class="brand-logo brand-logo--white"
              src="${escapeHtml(BRAND_DATA.logoWhite.webp)}"
              alt=""
              width="${BRAND_DATA.logoWhite.width}"
              height="${BRAND_DATA.logoWhite.height}"
              decoding="async"
            />
            <img
              class="brand-logo brand-logo--dark"
              src="${escapeHtml(BRAND_DATA.logoDark.webp)}"
              alt=""
              width="${BRAND_DATA.logoDark.width}"
              height="${BRAND_DATA.logoDark.height}"
              decoding="async"
            />
          </span>
          <span class="brand-divider" aria-hidden="true"></span>
          <span class="brand-name">${escapeHtml(BRAND_DATA.descriptor)}</span>
        </a>

        <div class="header-actions">
          <a class="header-contact-link" href="/contacto" data-nav-link>
            Contacto
          </a>
          <button
            class="menu-toggle-btn"
            id="menu-toggle"
            type="button"
            aria-expanded="false"
            aria-controls="side-menu-drawer"
            aria-haspopup="dialog"
          >
            <span class="menu-toggle-lines" aria-hidden="true">
              <span></span>
              <span></span>
            </span>
            <span class="menu-toggle-label">Menú</span>
          </button>
        </div>
      </div>
    </header>
  `;
}
