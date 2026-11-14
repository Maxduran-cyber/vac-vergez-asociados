import type { VerificationGapItem } from '../types/content';

/**
 * Registro interno de fuentes, fechas de consulta y datos pendientes de confirmación.
 * Este módulo permanece estrictamente fuera de la interfaz pública del visitante.
 */
export const INTERNAL_SOURCES_REGISTRY: readonly VerificationGapItem[] = [
  {
    field: 'Marca y denominación comercial',
    currentState: 'VAC; Vergez & Asociados (también impreso como Vergéz & Asociados Constructora)',
    sourceUrl: 'https://vac.com.do/',
    consultedAt: '2026-11-14',
    status: 'verificado',
    notes: 'Confirmar razón social definitiva (ej. Vergez y Asociados SRL / Ing. Oscar Vergez y Asociados, SRL) y RNC antes de lanzamiento oficial.',
  },
  {
    field: 'Actividad presentada',
    currentState: 'Construcción y diseño',
    sourceUrl: 'https://vac.com.do/',
    consultedAt: '2026-11-14',
    status: 'verificado',
    notes: 'Extraído del título del sitio oficial y del archivo images/logo1.png.',
  },
  {
    field: 'Trayectoria del equipo profesional',
    currentState: 'Unión de profesionales con más de 30 años de experiencia en el sector de construcción en República Dominicana',
    sourceUrl: 'https://vac.com.do/about.html',
    consultedAt: '2026-11-14',
    status: 'verificado',
    notes: 'No equivale a fecha de fundación de la sociedad. Fecha de constitución pendiente.',
  },
  {
    field: 'Experiencia hotelera y residencial de lujo',
    currentState: 'Participación del equipo en proyectos hoteleros emblemáticos y desarrollo de proyectos habitacionales de lujo en años recientes',
    sourceUrl: 'https://vac.com.do/about.html',
    consultedAt: '2026-11-14',
    status: 'verificado',
    notes: 'Pendiente catálogo exacto de servicios comerciales y alcance contractual por obra.',
  },
  {
    field: 'Colaboraciones internacionales de supervisión',
    currentState: 'Trabajo conjunto con compañías extranjeras de supervisión cumpliendo tiempos estimados y calidad',
    sourceUrl: 'https://vac.com.do/about.html',
    consultedAt: '2026-11-14',
    status: 'verificado',
    notes: 'No se publican nombres ni logotipos de dichas firmas al no existir identificación oficial.',
  },
  {
    field: 'Presencia declarada en el Caribe',
    currentState: 'República Dominicana, Santa Lucía, San Cristóbal, Nieves y Anguila',
    sourceUrl: 'https://vac.com.do/about.html',
    consultedAt: '2026-11-14',
    status: 'verificado',
    notes: 'No se declaran oficinas físicas ni direcciones postales exactas en dichos territorios.',
  },
  {
    field: 'Portafolio publicado',
    currentState: 'Torre Panorama, Asian Teppanyaki, Bayshore Villa y Canamar',
    sourceUrl: 'https://vac.com.do/bulb.html',
    consultedAt: '2026-11-14',
    status: 'verificado',
    notes: 'Pendiente ubicación exacta, fecha, superficie, alcance contractual de VAC y fotografías originales en alta resolución de cada obra.',
  },
  {
    field: 'Teléfono publicado',
    currentState: '809-688-4418',
    sourceUrl: 'https://vac.com.do/contact.html',
    consultedAt: '2026-11-14',
    status: 'verificado',
    notes: 'Confirmar si dispone de WhatsApp corporativo antes de habilitar enlace directo.',
  },
  {
    field: 'Correo electrónico publicado',
    currentState: 'I.verguez@vac.com.do',
    sourceUrl: 'https://vac.com.do/contact.html',
    consultedAt: '2026-11-14',
    status: 'requiere_confirmacion',
    notes: 'Transcrito literalmente del sitio oficial. Confirmar inicial I./L. y grafía verguez antes de conectar recepción de formularios.',
  },
  {
    field: 'Logotipo e identidad visual',
    currentState: 'images/logo1.png (5020x2820 RGBA blanco) e images/pc_layout.png (1059x744)',
    sourceUrl: 'https://vac.com.do/images/logo1.png',
    consultedAt: '2026-11-14',
    status: 'requiere_confirmacion',
    notes: 'Confirmar cesión de derechos de imágenes, manual de marca oficial y texto de política de privacidad.',
  },
  {
    field: 'Publicaciones de empleo en LinkedIn',
    currentState: 'Referencia interna a funciones de presupuestos, costos, cronogramas, ingeniería/compras y seguridad ocupacional',
    sourceUrl: 'https://do.linkedin.com/jobs/view/ingeniero-civil-at-vergez-y-asociados-srl-vac-4236247572',
    consultedAt: '2026-11-14',
    status: 'pendiente',
    notes: 'Solo indicio operativo; excluido de la oferta comercial pública mientras VAC no apruebe lista de servicios.',
  },
];
