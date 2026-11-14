import { BRAND_DATA, getPublishedProjects } from '../data/content';
import { renderProjectPicture } from '../components/media';
import { renderOptionalMetadata } from './projectMeta';
import type { ProjectEntry } from '../types/content';
import { escapeHtml } from '../utils/html';

export function renderProjectDetailView(project: ProjectEntry): string {
  const allProjects = getPublishedProjects();
  const currentIndex = allProjects.findIndex((item) => item.slug === project.slug);
  const prevProject = allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length];
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  const platesHtml = project.images
    .map(
      (image, idx) => `
      <figure class="detail-plate-card">
        <button
          class="detail-plate-trigger"
          type="button"
          data-lightbox-trigger
          data-lightbox-group="${escapeHtml(project.slug)}"
          data-plate-key="${escapeHtml(image.key)}"
          data-plate-alt="${escapeHtml(image.alt)}"
          data-plate-caption="${escapeHtml(image.caption)}"
          data-plate-attribution="${escapeHtml(image.attribution)}"
          data-plate-width="${image.width}"
          data-plate-height="${image.height}"
          aria-label="Ampliar ${escapeHtml(image.caption)}"
        >
          <div class="plate-frame plate-frame--3x4" data-animate-image>
            ${renderProjectPicture({
              imageKey: image.key,
              alt: image.alt,
              priority: idx === 0 ? 'eager' : 'lazy',
              sizes: '(max-width: 767px) 92vw, 548px',
            })}
          </div>
          <span class="plate-zoom-hint">Ampliar vista 0${idx + 1} +</span>
        </button>
        <figcaption class="detail-plate-caption-block">
          <span class="plate-caption">${escapeHtml(image.caption)}</span>
          <span class="plate-attribution">${escapeHtml(image.attribution)}</span>
        </figcaption>
      </figure>`,
    )
    .join('');

  const switcherLinks = allProjects
    .map(
      (item) => `
      <a
        class="portfolio-switcher-link ${item.slug === project.slug ? 'is-active' : ''}"
        href="${escapeHtml(item.href)}"
        data-nav-link
        ${item.slug === project.slug ? 'aria-current="page"' : ''}
      >
        <span class="portfolio-switcher-index">${escapeHtml(item.indexLabel)}</span>
        <span class="portfolio-switcher-name">${escapeHtml(item.name)}</span>
      </a>`,
    )
    .join('');

  return `
    <section class="page-hero-section section-light">
      <div class="container">
        <nav class="breadcrumb" aria-label="Ruta de navegación">
          <a href="/" data-nav-link>Inicio</a>
          <span aria-hidden="true">/</span>
          <a href="/proyectos" data-nav-link>Proyectos</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">${escapeHtml(project.name)}</span>
        </nav>

        <div class="detail-header-grid">
          <div>
            <p class="section-eyebrow">Proyecto ${escapeHtml(project.indexLabel)} · Proyectos</p>
            <h1 class="page-title">${escapeHtml(project.name)}</h1>
          </div>

          <div class="detail-header-aside">
            <p class="project-neutral-legend">${escapeHtml(project.neutralGalleryLegend)}</p>
            ${renderOptionalMetadata(project.metadata)}
            <p class="detail-attribution-note">
              Galería fotográfica del proyecto. Para solicitar información técnica sobre esta obra, contacte directamente a la firma.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="section-white page-band">
      <div class="container">
        <div class="detail-gallery-grid">
          ${platesHtml}
        </div>
      </div>
    </section>

    <section class="section-light page-band-compact" aria-label="Navegación entre proyectos">
      <div class="container">
        <p class="section-eyebrow">Más proyectos</p>
        <div class="portfolio-switcher-grid">
          ${switcherLinks}
        </div>

        <div class="detail-prev-next">
          <a class="detail-step-link" href="${escapeHtml(prevProject.href)}" data-nav-link>
            <span class="detail-step-dir">← Proyecto anterior</span>
            <span class="detail-step-name">${escapeHtml(prevProject.name)}</span>
          </a>
          <a class="detail-step-link detail-step-link--next" href="${escapeHtml(nextProject.href)}" data-nav-link>
            <span class="detail-step-dir">Siguiente proyecto →</span>
            <span class="detail-step-name">${escapeHtml(nextProject.name)}</span>
          </a>
        </div>
      </div>
    </section>

    <section class="section-dark page-band-compact">
      <div class="container inline-cta-row">
        <div>
          <p class="section-eyebrow section-eyebrow--light">Consulta sobre ${escapeHtml(project.name)}</p>
          <h2 class="closing-contact-title">Solicite información adicional directamente a VAC</h2>
          <p class="closing-contact-sub">
            Tel. <a href="${escapeHtml(BRAND_DATA.phoneHref)}">${escapeHtml(BRAND_DATA.phoneDisplay)}</a> ·
            <a href="${escapeHtml(BRAND_DATA.emailHref)}">${escapeHtml(BRAND_DATA.emailDisplay)}</a>
          </p>
        </div>
        <div class="inline-cta-actions">
          <a class="btn btn-light" href="/contacto" data-nav-link>Contactar</a>
        </div>
      </div>
    </section>
  `;
}
