import { EXPERIENCE_CONTENT, getPublishedProjects } from '../data/content';
import { renderProjectPicture } from '../components/media';
import { renderRegionalMap } from '../components/regionalMap';
import { escapeHtml } from '../utils/html';

export function renderExperienceView(): string {
  const projects = getPublishedProjects();

  const areasHtml = EXPERIENCE_CONTENT.focusAreas
    .map(
      (area) => `
      <li class="experience-row">
        <span class="experience-code">${escapeHtml(area.code)}</span>
        <div class="experience-row-body">
          <h3 class="experience-row-title">${escapeHtml(area.heading)}</h3>
          <p class="experience-row-detail">${escapeHtml(area.detail)}</p>
        </div>
      </li>`,
    )
    .join('');

  const worksLinksHtml = projects
    .map(
      (project) => `
      <a class="experience-work-card" href="${escapeHtml(project.href)}" data-nav-link>
        <div class="plate-frame plate-frame--3x4" data-animate-image>
          ${renderProjectPicture({
            imageKey: project.images[0].key,
            alt: project.images[0].alt,
            priority: 'lazy',
            sizes: '(max-width: 767px) 92vw, 320px',
          })}
        </div>
        <div class="experience-work-info">
          <span class="project-index-label">${escapeHtml(project.indexLabel)}</span>
          <span class="experience-work-name">${escapeHtml(project.name)}</span>
        </div>
      </a>`,
    )
    .join('');

  return `
    <section class="page-hero-section section-light">
      <div class="container">
        <nav class="breadcrumb" aria-label="Ruta de navegación">
          <a href="/" data-nav-link>Inicio</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Experiencia</span>
        </nav>

        <div class="page-header-grid">
          <div>
            <p class="section-eyebrow">Trayectoria y alcance</p>
            <h1 class="page-title">${escapeHtml(EXPERIENCE_CONTENT.headline)}</h1>
          </div>
          <p class="page-lead">${escapeHtml(EXPERIENCE_CONTENT.intro)}</p>
        </div>
      </div>
    </section>

    <section class="section-white page-band">
      <div class="container">
        <div class="section-grid-12">
          <div class="col-span-5-lg">
            <p class="section-eyebrow">Sectores</p>
            <h2 class="section-title">Hotelería, residencial de lujo y coordinación técnica</h2>
            <div class="editorial-paragraphs">
              ${EXPERIENCE_CONTENT.narrative.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}
            </div>
          </div>

          <div class="col-span-7-lg">
            <ul class="experience-list">
              ${areasHtml}
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="section-light page-band">
      <div class="container">
        <div class="section-header-inline">
          <div>
            <p class="section-eyebrow">Alcance regional</p>
            <h2 class="section-title">Presencia en República Dominicana y el Caribe</h2>
          </div>
        </div>
        ${renderRegionalMap()}
      </div>
    </section>

    <section class="section-white page-band">
      <div class="container">
        <div class="section-header-inline">
          <div>
            <p class="section-eyebrow">Proyectos</p>
            <h2 class="section-title">Obras asociadas a esta trayectoria</h2>
          </div>
          <a class="text-action-link" href="/proyectos" data-nav-link>
            Ver todos los proyectos <span aria-hidden="true">→</span>
          </a>
        </div>

        <div class="experience-works-strip">
          ${worksLinksHtml}
        </div>
      </div>
    </section>
  `;
}
