import { getPublishedProjects } from '../data/content';
import { renderProjectPicture } from '../components/media';
import { renderOptionalMetadata } from './projectMeta';
import { escapeHtml } from '../utils/html';

export function renderProjectsIndexView(): string {
  const projects = getPublishedProjects();

  const entriesHtml = projects
    .map(
      (project, idx) => `
      <article class="archive-project-row ${idx % 2 === 1 ? 'is-reversed' : ''}">
        <div class="archive-project-meta">
          <span class="project-index-label">${escapeHtml(project.indexLabel)} · Proyectos</span>
          <h2 class="archive-project-title">
            <a class="project-title-link" href="${escapeHtml(project.href)}" data-nav-link>
              ${escapeHtml(project.name)}
            </a>
          </h2>
          <p class="project-neutral-legend">${escapeHtml(project.neutralGalleryLegend)}</p>
          ${renderOptionalMetadata(project.metadata)}
          <div class="archive-project-action">
            <a class="btn btn-dark" href="${escapeHtml(project.href)}" data-nav-link>
              Ver galería del proyecto <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div class="archive-project-pair">
          <a
            class="archive-plate-link"
            href="${escapeHtml(project.href)}"
            data-nav-link
            aria-label="Abrir galería de ${escapeHtml(project.name)}, ${escapeHtml(project.images[0].caption)}"
          >
            <div class="plate-frame plate-frame--3x4" data-animate-image>
              ${renderProjectPicture({
                imageKey: project.images[0].key,
                alt: project.images[0].alt,
                priority: idx === 0 ? 'eager' : 'lazy',
                sizes: '(max-width: 767px) 92vw, 340px',
              })}
            </div>
            <span class="plate-caption">${escapeHtml(project.images[0].caption)}</span>
          </a>

          <a
            class="archive-plate-link"
            href="${escapeHtml(project.href)}"
            data-nav-link
            aria-label="Abrir galería de ${escapeHtml(project.name)}, ${escapeHtml(project.images[1].caption)}"
          >
            <div class="plate-frame plate-frame--3x4" data-animate-image>
              ${renderProjectPicture({
                imageKey: project.images[1].key,
                alt: project.images[1].alt,
                priority: idx === 0 ? 'eager' : 'lazy',
                sizes: '(max-width: 767px) 92vw, 340px',
              })}
            </div>
            <span class="plate-caption">${escapeHtml(project.images[1].caption)}</span>
          </a>
        </div>
      </article>`,
    )
    .join('');

  return `
    <section class="page-hero-section section-light">
      <div class="container">
        <nav class="breadcrumb" aria-label="Ruta de navegación">
          <a href="/" data-nav-link>Inicio</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Proyectos</span>
        </nav>

        <div class="page-header-grid">
          <div>
            <p class="section-eyebrow">Proyectos</p>
            <h1 class="page-title">Obras presentadas por Vergez &amp; Asociados</h1>
          </div>
          <p class="page-lead">
            Selección de proyectos residenciales, corporativos y comerciales en el portafolio de Vergez &amp; Asociados.
          </p>
        </div>
      </div>
    </section>

    <section class="section-white page-band">
      <div class="container">
        <div class="archive-projects-list">
          ${entriesHtml}
        </div>
      </div>
    </section>

    <section class="section-dark page-band-compact">
      <div class="container inline-cta-row">
        <div>
          <h2 class="closing-contact-title">¿Desea consultar información adicional sobre una obra?</h2>
        </div>
        <div class="inline-cta-actions">
          <a class="btn btn-light" href="/contacto" data-nav-link>Contactar</a>
        </div>
      </div>
    </section>
  `;
}
