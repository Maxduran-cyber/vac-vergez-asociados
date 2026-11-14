import { BRAND_DATA, FIRM_CONTENT, getPublishedProjects } from '../data/content';
import { renderInstitutionalPicture, renderProjectPicture } from '../components/media';
import { escapeHtml } from '../utils/html';

export function renderFirmView(): string {
  const projects = getPublishedProjects();
  const sampleWorks = [projects[1], projects[2]].filter(Boolean);

  const pillarsHtml = FIRM_CONTENT.pillars
    .map(
      (pillar) => `
      <li class="firm-pillar">
        <span class="firm-pillar-index">${escapeHtml(pillar.index)}</span>
        <div class="firm-pillar-copy">
          <h3 class="firm-pillar-title">${escapeHtml(pillar.title)}</h3>
          <p class="firm-pillar-body">${escapeHtml(pillar.body)}</p>
        </div>
      </li>`,
    )
    .join('');

  const previewPlatesHtml = sampleWorks
    .map(
      (project) => `
      <a class="firm-preview-card" href="${escapeHtml(project.href)}" data-nav-link>
        <div class="plate-frame plate-frame--3x4" data-animate-image>
          ${renderProjectPicture({
            imageKey: project.images[0].key,
            alt: project.images[0].alt,
            priority: 'lazy',
            sizes: '(max-width: 767px) 92vw, 480px',
          })}
        </div>
        <div class="firm-preview-meta">
          <span class="project-index-label">${escapeHtml(project.indexLabel)} · Proyectos</span>
          <span class="firm-preview-title">${escapeHtml(project.name)}</span>
          <span class="inline-underlined-cta">Ver galería del proyecto →</span>
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
          <span aria-current="page">La firma</span>
        </nav>

        <div class="page-header-grid">
          <div>
            <p class="section-eyebrow">La firma · Vergez &amp; Asociados</p>
            <h1 class="page-title">${escapeHtml(FIRM_CONTENT.headline)}</h1>
          </div>
          <p class="page-lead">${escapeHtml(FIRM_CONTENT.intro)}</p>
        </div>
      </div>
    </section>

    <section class="section-white page-band">
      <div class="container">
        <div class="firm-visual-grid">
          <div class="firm-visual-frame" data-animate-image>
            <div class="firm-visual-media">
              ${renderInstitutionalPicture('firm-visual-img', 'eager')}
            </div>
            <p class="plate-caption">${escapeHtml(BRAND_DATA.institutionalPhoto.caption)}</p>
          </div>

          <div class="firm-narrative-col">
            <h2 class="subsection-title">Origen profesional y criterio de ejecución</h2>
            <div class="editorial-paragraphs">
              ${FIRM_CONTENT.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}
            </div>

            <div class="firm-statement-box">
              <p class="firm-statement-label">Colaboración internacional</p>
              <p class="firm-statement-text">
                El trabajo conjunto con compañías extranjeras de supervisión forma parte de la trayectoria de la firma, manteniendo cumplimiento de tiempos estimados y control de calidad en obra.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section-light page-band">
      <div class="container">
        <div class="section-grid-12">
          <div class="col-span-4-lg">
            <p class="section-eyebrow">Enfoque de trabajo</p>
            <h2 class="section-title">Fundamentos de la práctica</h2>
          </div>
          <div class="col-span-8-lg">
            <ul class="firm-pillars-list">
              ${pillarsHtml}
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="section-white page-band">
      <div class="container">
        <div class="section-header-inline">
          <div>
            <p class="section-eyebrow">Obra reciente y alcance</p>
            <h2 class="section-title">Presencia en República Dominicana y el Caribe</h2>
          </div>
          <div class="inline-cta-actions">
            <a class="text-action-link" href="/experiencia" data-nav-link>
              Ver experiencia regional <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div class="firm-preview-grid">
          ${previewPlatesHtml}
        </div>
      </div>
    </section>

    <section class="section-dark page-band-compact">
      <div class="container inline-cta-row">
        <div>
          <h2 class="closing-contact-title">Explore los proyectos o inicie una consulta</h2>
        </div>
        <div class="inline-cta-actions">
          <a class="btn btn-light" href="/proyectos" data-nav-link>Ver proyectos</a>
          <a class="btn btn-outline-light" href="/contacto" data-nav-link>Contactar</a>
        </div>
      </div>
    </section>
  `;
}
