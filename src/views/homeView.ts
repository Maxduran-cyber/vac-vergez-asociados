import {
  BRAND_DATA,
  FIRM_CONTENT,
  HERO_CONTENT,
  getPublishedProjects,
} from '../data/content';
import { renderHeroPicture, renderProjectPicture } from '../components/media';
import { escapeHtml } from '../utils/html';

function buildSplitTitleHtml(lines: readonly string[]): string {
  const visualLines = lines
    .map((line, lineIdx) => {
      const lineWords = line
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => {
          const chars = Array.from(word)
            .map((ch) => `<span class="hero-char" data-hero-char>${escapeHtml(ch)}</span>`)
            .join('');
          return `<span class="hero-title-word">${chars}</span>`;
        })
        .join('<span class="hero-char hero-char-space"> </span>');

      return `<span class="hero-line-mask" data-hero-line-mask data-line-index="${lineIdx}"><span class="hero-line-inner" data-hero-line>${lineWords}</span></span>`;
    })
    .join(' ');

  return `<span class="hero-title-visual">${visualLines}</span>`;
}

export function renderHomeView(): string {
  const leadProject = getPublishedProjects()[0]; // Torre Panorama como muestra de transición hacia Proyectos
  const fullHeroTitle = HERO_CONTENT.titleLines.join(' ');
  const splitHeroTitleHtml = buildSplitTitleHtml(HERO_CONTENT.titleLines);

  return `
    <section class="hero-section" id="hero-section" aria-labelledby="hero-title">
      <div class="hero-media-stage" aria-hidden="true">
        <div class="motion-scroll-layer" data-hero-scroll-layer>
          <div class="motion-pointer-layer" data-hero-pointer-layer>
            <div class="motion-intro-layer" data-hero-intro-layer>
              <div class="hero-media-overscan">
                ${renderHeroPicture(HERO_CONTENT.heroImageAlt)}
              </div>
            </div>
          </div>
        </div>
        <div class="hero-contrast-veil"></div>
        <div class="hero-ambient-glow" id="hero-ambient-glow" data-hero-ambient-glow aria-hidden="true"></div>
      </div>

      <div class="container hero-overlay-container">
        <div class="hero-copy-block" data-hero-copy>
          <span class="hero-accent-rule" data-hero-rule aria-hidden="true"></span>
          <h1 class="hero-title" id="hero-title" aria-label="${escapeHtml(fullHeroTitle)}">
            ${splitHeroTitleHtml}
          </h1>

          <p class="hero-support" data-hero-support>
            ${escapeHtml(HERO_CONTENT.support)}
          </p>

          <div class="hero-actions" data-hero-actions>
            <a class="btn btn-light" data-hero-cta href="${escapeHtml(HERO_CONTENT.primaryCta.href)}" data-nav-link>
              ${escapeHtml(HERO_CONTENT.primaryCta.label)}
            </a>
            <a class="btn btn-outline-light" data-hero-cta href="${escapeHtml(HERO_CONTENT.secondaryCta.href)}" data-nav-link>
              ${escapeHtml(HERO_CONTENT.secondaryCta.label)}
            </a>
          </div>
        </div>
      </div>
    </section>

    <section class="firm-intro-section section-light" id="presentacion-firma" aria-labelledby="firm-intro-heading">
      <div class="container">
        <div class="home-firm-grid">
          <div class="home-firm-copy">
            <p class="section-eyebrow">${escapeHtml(FIRM_CONTENT.eyebrow)}</p>
            <h2 class="section-title" id="firm-intro-heading">${escapeHtml(FIRM_CONTENT.homeHeadline)}</h2>
            <p class="section-lead">${escapeHtml(FIRM_CONTENT.homeParagraph)}</p>
            <div class="firm-intro-action">
              <a class="text-action-link" href="${escapeHtml(FIRM_CONTENT.ctaHref)}" data-nav-link>
                ${escapeHtml(FIRM_CONTENT.ctaLabel)} <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          ${
            leadProject
              ? `
          <div class="home-firm-visual">
            <a
              class="home-firm-visual-link"
              href="/proyectos"
              data-nav-link
              aria-label="Explorar proyectos de Vergez & Asociados"
            >
              <div class="plate-frame plate-frame--3x4" data-animate-image>
                ${renderProjectPicture({
                  imageKey: leadProject.images[0].key,
                  alt: leadProject.images[0].alt,
                  priority: 'lazy',
                  sizes: '(max-width: 767px) 92vw, 440px',
                })}
              </div>
              <span class="inline-underlined-cta home-firm-visual-cta">Ver proyectos →</span>
            </a>
          </div>`
              : ''
          }
        </div>
      </div>
    </section>

    <section class="contact-closing-section section-dark" id="cierre-contacto" aria-labelledby="closing-contact-heading">
      <div class="container">
        <div class="closing-contact-grid">
          <div class="closing-contact-copy">
            <p class="section-eyebrow section-eyebrow--light">Contacto</p>
            <h2 class="closing-contact-title" id="closing-contact-heading">
              ¿Tiene en marcha un proyecto de construcción o diseño?
            </h2>
            <p class="closing-contact-lead">
              Converse directamente con Vergez &amp; Asociados sobre el alcance y planificación de su próximo desarrollo.
            </p>
          </div>

          <div class="closing-contact-channels">
            <div class="closing-channel-item">
              <span class="closing-channel-label">Teléfono</span>
              <a class="closing-channel-value" href="${escapeHtml(BRAND_DATA.phoneHref)}">${escapeHtml(BRAND_DATA.phoneDisplay)}</a>
            </div>
            <div class="closing-channel-item">
              <span class="closing-channel-label">Correo electrónico</span>
              <a class="closing-channel-value" href="${escapeHtml(BRAND_DATA.emailHref)}">${escapeHtml(BRAND_DATA.emailDisplay)}</a>
            </div>
            <div class="closing-contact-cta">
              <a class="btn btn-light" href="/contacto" data-nav-link>
                Contactar <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
