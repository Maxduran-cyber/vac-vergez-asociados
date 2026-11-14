export function renderNotFoundView(): string {
  return `
    <section class="page-hero-section section-light not-found-section">
      <div class="container">
        <p class="section-eyebrow">Error 404</p>
        <h1 class="page-title">Ruta no encontrada</h1>
        <p class="page-lead">
          La dirección solicitada no corresponde a una sección publicada dentro de esta propuesta corporativa para VAC — Vergez &amp; Asociados.
        </p>

        <div class="not-found-actions">
          <a class="btn btn-dark" href="/" data-nav-link>Volver al inicio</a>
          <a class="btn btn-outline-dark" href="/proyectos" data-nav-link>Explorar proyectos</a>
          <a class="btn btn-outline-dark" href="/contacto" data-nav-link>Ir a contacto</a>
        </div>
      </div>
    </section>
  `;
}
