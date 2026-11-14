import { BRAND_DATA, NAVIGATION_ITEMS, PROJECTS } from '../data/content';
import { escapeHtml } from '../utils/html';

export function renderFooter(): string {
  const navLinks = NAVIGATION_ITEMS.map(
    (item) =>
      `<li><a class="footer-link" href="${escapeHtml(item.href)}" data-nav-link>${escapeHtml(item.label)}</a></li>`,
  ).join('');

  const projectLinks = PROJECTS.map(
    (project) =>
      `<li><a class="footer-link" href="${escapeHtml(project.href)}" data-nav-link>${escapeHtml(project.name)}</a></li>`,
  ).join('');

  return `
    <footer class="site-footer" id="site-footer">
      <div class="container">
        <div class="footer-top">
          <div class="footer-brand-col">
            <a class="footer-brand-mark" href="/" data-nav-link aria-label="VAC — Vergez & Asociados, inicio">
              <img
                class="footer-logo"
                src="${escapeHtml(BRAND_DATA.logoWhite.webp)}"
                alt="VAC Construcción y Diseño"
                width="${BRAND_DATA.logoWhite.width}"
                height="${BRAND_DATA.logoWhite.height}"
                loading="lazy"
                decoding="async"
              />
            </a>
            <p class="footer-statement">
              ${escapeHtml(BRAND_DATA.fullName)} · ${escapeHtml(BRAND_DATA.activity)}.
              Equipo de profesionales con más de 30 años de experiencia en construcción en República Dominicana y el Caribe.
            </p>
          </div>

          <div class="footer-nav-grid">
            <div class="footer-col">
              <h2 class="footer-col-title">Navegación</h2>
              <ul class="footer-list">
                ${navLinks}
              </ul>
            </div>

            <div class="footer-col">
              <h2 class="footer-col-title">Proyectos</h2>
              <ul class="footer-list">
                ${projectLinks}
              </ul>
            </div>

            <div class="footer-col">
              <h2 class="footer-col-title">Contacto</h2>
              <ul class="footer-list">
                <li>
                  <a class="footer-link" href="${escapeHtml(BRAND_DATA.phoneHref)}">${escapeHtml(BRAND_DATA.phoneDisplay)}</a>
                </li>
                <li>
                  <a class="footer-link" href="${escapeHtml(BRAND_DATA.emailHref)}">${escapeHtml(BRAND_DATA.emailDisplay)}</a>
                </li>
              </ul>
              <p class="footer-source-note">
                Sitio oficial:
                <a class="footer-external-link" href="${escapeHtml(BRAND_DATA.officialDomain)}" target="_blank" rel="noopener noreferrer">vac.com.do</a>
              </p>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p class="footer-legal">
            Propuesta conceptual privada para presentación comercial a Vergez &amp; Asociados. Entorno no indexable.
          </p>
          <p class="footer-legal">
            No sustituye al dominio oficial ni habilita recepción comercial sin confirmación de la empresa.
          </p>
        </div>
      </div>
    </footer>
  `;
}
