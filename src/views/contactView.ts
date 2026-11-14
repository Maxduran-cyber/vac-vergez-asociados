import { BRAND_DATA, CONTACT_CONTENT } from '../data/content';
import { escapeHtml } from '../utils/html';

export function renderContactView(): string {
  return `
    <section class="page-hero-section section-light">
      <div class="container">
        <nav class="breadcrumb" aria-label="Ruta de navegación">
          <a href="/" data-nav-link>Inicio</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Contacto</span>
        </nav>

        <div class="page-header-grid">
          <div>
            <p class="section-eyebrow">${escapeHtml(CONTACT_CONTENT.eyebrow)}</p>
            <h1 class="page-title">${escapeHtml(CONTACT_CONTENT.headline)}</h1>
          </div>
          <p class="page-lead">${escapeHtml(CONTACT_CONTENT.intro)}</p>
        </div>
      </div>
    </section>

    <section class="section-white page-band">
      <div class="container">
        <div class="contact-layout-grid">
          <div class="contact-direct-col">
            <div class="contact-channels-card">
              <p class="section-eyebrow">Canales de contacto</p>
              <h2 class="subsection-title">Atención directa</h2>

              <dl class="direct-channels-list">
                <div class="direct-channel-row">
                  <dt class="direct-channel-label">Teléfono</dt>
                  <dd class="direct-channel-val">
                    <a href="${escapeHtml(BRAND_DATA.phoneHref)}">${escapeHtml(BRAND_DATA.phoneDisplay)}</a>
                  </dd>
                </div>
                <div class="direct-channel-row">
                  <dt class="direct-channel-label">Correo electrónico</dt>
                  <dd class="direct-channel-val">
                    <a href="${escapeHtml(BRAND_DATA.emailHref)}">${escapeHtml(BRAND_DATA.emailDisplay)}</a>
                  </dd>
                </div>
              </dl>

              <p class="contact-channel-note">
                Atención directa por vía telefónica o correo electrónico en República Dominicana y el Caribe.
              </p>
            </div>

            <div class="prototype-status-box" role="status">
              <p class="prototype-status-title">${escapeHtml(CONTACT_CONTENT.prototypeNoticeTitle)}</p>
              <p class="prototype-status-body">${escapeHtml(CONTACT_CONTENT.prototypeNoticeBody)}</p>
            </div>
          </div>

          <div class="contact-form-col">
            <div class="contact-form-header">
              <p class="section-eyebrow">Formulario de consulta propuesto</p>
              <h2 class="subsection-title">Estructura preparada para integración</h2>
              <p class="form-intro-note">${escapeHtml(CONTACT_CONTENT.formPendingNote)}</p>
            </div>

            <form class="vac-contact-form" id="contact-form" novalidate>
              <div class="honeypot-field" aria-hidden="true">
                <label for="contact-company-website">Sitio web</label>
                <input id="contact-company-website" name="honeypot" type="text" tabindex="-1" autocomplete="off" />
              </div>

              <div class="form-field">
                <label class="form-label" for="contact-fullname">
                  Nombre completo <span class="form-required" aria-hidden="true">*</span>
                </label>
                <input
                  class="form-input"
                  id="contact-fullname"
                  name="fullName"
                  type="text"
                  required
                  autocomplete="name"
                  placeholder="Ej. Ing. Carlos Mendoza"
                  aria-describedby="contact-fullname-help contact-fullname-error"
                />
                <p class="form-help" id="contact-fullname-help">Indique su nombre o el del representante del proyecto.</p>
                <p class="form-error" id="contact-fullname-error" aria-live="polite"></p>
              </div>

              <div class="form-field-row">
                <div class="form-field">
                  <label class="form-label" for="contact-email">
                    Correo electrónico <span class="form-required" aria-hidden="true">*</span>
                  </label>
                  <input
                    class="form-input"
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    autocomplete="email"
                    placeholder="nombre@empresa.com"
                    aria-describedby="contact-email-error"
                  />
                  <p class="form-error" id="contact-email-error" aria-live="polite"></p>
                </div>

                <div class="form-field">
                  <label class="form-label" for="contact-phone">
                    Teléfono (opcional)
                  </label>
                  <input
                    class="form-input"
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    autocomplete="tel"
                    placeholder="809-000-0000"
                    aria-describedby="contact-phone-help contact-phone-error"
                  />
                  <p class="form-help" id="contact-phone-help">Opcional para coordinación telefónica.</p>
                  <p class="form-error" id="contact-phone-error" aria-live="polite"></p>
                </div>
              </div>

              <div class="form-field">
                <label class="form-label" for="contact-message">
                  Mensaje <span class="form-required" aria-hidden="true">*</span>
                </label>
                <textarea
                  class="form-textarea"
                  id="contact-message"
                  name="message"
                  rows="5"
                  required
                  placeholder="Describa brevemente el tipo de proyecto, ubicación prevista o consulta técnica."
                  aria-describedby="contact-message-help contact-message-error"
                ></textarea>
                <p class="form-help" id="contact-message-help">Mínimo 15 caracteres.</p>
                <p class="form-error" id="contact-message-error" aria-live="polite"></p>
              </div>

              <div class="form-actions-bar">
                <button
                  class="btn btn-dark"
                  type="button"
                  disabled
                  aria-disabled="true"
                  aria-describedby="prototype-submit-note"
                  title="Desactivado en prototipo hasta confirmar receptor oficial y política de privacidad"
                >
                  Envío desactivado en prototipo
                </button>
                <button
                  class="btn btn-outline-dark"
                  id="contact-validate-btn"
                  type="submit"
                >
                  Verificar validación de campos
                </button>
              </div>
              <p class="form-help" id="prototype-submit-note">
                El envío automático permanece desactivado en esta propuesta comercial; ningún dato personal es transmitido ni almacenado.
              </p>

              <div class="form-feedback-banner" id="contact-form-feedback" aria-live="polite" hidden></div>
            </form>
          </div>
        </div>
      </div>
    </section>
  `;
}
