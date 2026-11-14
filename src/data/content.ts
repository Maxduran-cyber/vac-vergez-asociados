import { ASSET_DIMENSIONS } from './assetManifest';
import type { NavItem, PageMeta, ProjectEntry, RegionTerritory } from '../types/content';

const CONSULTED_AT = '2026-11-14';

export const BRAND_DATA = {
  shortName: 'VAC',
  fullName: 'VAC — Vergez & Asociados',
  descriptor: 'Vergez & Asociados',
  activity: 'Construcción y diseño',
  phoneDisplay: '809-688-4418',
  phoneHref: 'tel:+18096884418',
  emailDisplay: 'I.verguez@vac.com.do',
  emailHref: 'mailto:I.verguez@vac.com.do',
  officialDomain: 'https://vac.com.do/',
  logoWhite: {
    webp: '/images/vac-logo-white.webp',
    png: '/images/vac-logo-white.png',
    width: ASSET_DIMENSIONS.logo.width,
    height: ASSET_DIMENSIONS.logo.height,
  },
  logoDark: {
    webp: '/images/vac-logo-dark.webp',
    png: '/images/vac-logo-dark.png',
    width: ASSET_DIMENSIONS.logo.width,
    height: ASSET_DIMENSIONS.logo.height,
  },
  institutionalPhoto: {
    webp: '/images/institucional-vac-1059.webp',
    webpSmall: '/images/institucional-vac-760.webp',
    fallback: '/images/institucional-vac-1059.jpg',
    width: ASSET_DIMENSIONS.institutional.width,
    height: ASSET_DIMENSIONS.institutional.height,
    alt: 'Fachada contemporánea con jardines y logotipo institucional de VAC — Vergez & Asociados',
    caption: 'VAC — Construcción y diseño',
  },
} as const;

export const NAVIGATION_ITEMS: readonly NavItem[] = [
  {
    label: 'Inicio',
    href: '/',
    previewImageKey: 'torre-panorama-2',
    previewAlt: 'Torre Panorama',
  },
  {
    label: 'La firma',
    href: '/la-firma',
    previewImageKey: 'bayshore-villa-1',
    previewAlt: 'Bayshore Villa',
  },
  {
    label: 'Proyectos',
    href: '/proyectos',
    previewImageKey: 'torre-panorama-1',
    previewAlt: 'Proyectos de Vergez & Asociados',
  },
  {
    label: 'Experiencia',
    href: '/experiencia',
    previewImageKey: 'canamar-2',
    previewAlt: 'Canamar',
  },
  {
    label: 'Contacto',
    href: '/contacto',
    previewImageKey: 'asian-teppanyaki-2',
    previewAlt: 'Asian Teppanyaki',
  },
];

export const HERO_CONTENT = {
  titleLines: ['Construcción con', 'visión y precisión'] as const,
  support: 'Construcción y diseño en República Dominicana y el Caribe.',
  primaryCta: {
    label: 'Ver proyectos',
    href: '/proyectos' as const,
  },
  secondaryCta: {
    label: 'Contactar',
    href: '/contacto' as const,
  },
  heroImageAlt:
    'Conjunto residencial de villas contemporáneas con fachadas en madera, pérgola metálica y áreas verdes bajo cielo despejado',
};

export const FIRM_CONTENT = {
  eyebrow: 'La firma',
  homeHeadline: 'Experiencia constructiva y dirección técnica',
  homeParagraph:
    'Vergez & Asociados reúne a un equipo de profesionales con más de 30 años de trayectoria en el sector de la construcción en República Dominicana, con experiencia en desarrollos hoteleros, proyectos residenciales de lujo y coordinación junto a firmas internacionales de supervisión en el Caribe.',
  headline: 'Dirección técnica con trayectoria comprobada en construcción y diseño',
  intro:
    'Vergez & Asociados surge de la unión de profesionales con más de 30 años de trayectoria en el sector de la construcción en República Dominicana.',
  paragraphs: [
    'Su equipo ha participado en algunos de los proyectos hoteleros más representativos del país y el Caribe, consolidando en los últimos años una práctica enfocada en proyectos habitacionales de alto estándar.',
    'La firma ha trabajado de la mano con compañías extranjeras de supervisión, respondiendo a cronogramas exigentes y controles de calidad propios de desarrollos internacionales.',
  ],
  pillars: [
    {
      index: '01',
      title: 'Trayectoria profesional',
      body: 'Equipo conformado por profesionales con más de tres décadas de práctica en obra dentro del sector de la construcción en República Dominicana.',
    },
    {
      index: '02',
      title: 'Sector hotelero y residencial',
      body: 'Participación en proyectos hoteleros emblemáticos y desarrollo reciente de obras habitacionales de lujo en el entorno caribeño.',
    },
    {
      index: '03',
      title: 'Coordinación y supervisión internacional',
      body: 'Experiencia acreditada trabajando junto a firmas extranjeras de supervisión bajo estándares de calidad y cumplimiento de plazos.',
    },
  ],
  ctaLabel: 'Conocer la firma',
  ctaHref: '/la-firma' as const,
};

export const EXPERIENCE_CONTENT = {
  eyebrow: 'Alcance regional',
  headline: 'Práctica técnica extendida en República Dominicana y el Caribe',
  intro:
    'Además de su base operativa en República Dominicana, el equipo de Vergez & Asociados declara presencia en proyectos desarrollados en distintas jurisdicciones del Caribe insular.',
  narrative: [
    'La experiencia acumulada abarca la participación en infraestructura hotelera de referencia en el Caribe y la ejecución de desarrollos habitacionales de lujo.',
    'La colaboración continua con compañías extranjeras de supervisión ha permitido sostener criterios consistentes de calidad constructiva y cumplimiento de tiempos estimados a lo largo de la región.',
  ],
  focusAreas: [
    {
      code: 'A',
      heading: 'Infraestructura hotelera',
      detail: 'Participación de su equipo en proyectos hoteleros emblemáticos en República Dominicana y el Caribe.',
    },
    {
      code: 'B',
      heading: 'Residencial de lujo',
      detail: 'Desempeño reciente en desarrollos habitacionales de alto nivel orientados a estándares de detalle y permanencia.',
    },
    {
      code: 'C',
      heading: 'Supervisión internacional',
      detail: 'Articulación directa con firmas extranjeras de supervisión técnica bajo metas definidas de plazo y calidad.',
    },
  ],
};

export const REGIONAL_TERRITORIES: readonly RegionTerritory[] = [
  {
    id: 'rep-dom',
    name: 'República Dominicana',
    publishedLabel: 'Rep. Dom.',
    coordinates: { lon: -70.1627, lat: 18.7357 },
    isInsularCaribe: false,
  },
  {
    id: 'anguilla',
    name: 'Anguila',
    publishedLabel: 'Anguilla',
    coordinates: { lon: -63.0686, lat: 18.2206 },
    isInsularCaribe: true,
  },
  {
    id: 'st-kitts',
    name: 'San Cristóbal',
    publishedLabel: 'St Kitts',
    coordinates: { lon: -62.783, lat: 17.3578 },
    isInsularCaribe: true,
  },
  {
    id: 'nevis',
    name: 'Nieves',
    publishedLabel: 'Nevis',
    coordinates: { lon: -62.5796, lat: 17.1554 },
    isInsularCaribe: true,
  },
  {
    id: 'st-lucia',
    name: 'Santa Lucía',
    publishedLabel: 'St Lucia',
    coordinates: { lon: -60.9789, lat: 13.9094 },
    isInsularCaribe: true,
  },
];

export const PROJECTS: readonly ProjectEntry[] = [
  {
    slug: 'torre-panorama',
    href: '/proyectos/torre-panorama',
    indexLabel: '01',
    name: 'Torre Panorama',
    publicationStatus: 'published',
    neutralGalleryLegend: 'Galería del proyecto',
    metadata: {},
    images: [
      {
        key: 'torre-panorama-1',
        width: ASSET_DIMENSIONS.projectPlate.width,
        height: ASSET_DIMENSIONS.projectPlate.height,
        alt: 'Torre Panorama, vista exterior en perspectiva de fachada principal',
        caption: 'Vista 01 · Torre Panorama',
        attribution: 'VAC — Vergez & Asociados',
        sourceUrl: 'https://vac.com.do/images/Torre%20panorama1.png',
      },
      {
        key: 'torre-panorama-2',
        width: ASSET_DIMENSIONS.projectPlate.width,
        height: ASSET_DIMENSIONS.projectPlate.height,
        alt: 'Torre Panorama, vista ascendente de volumen vertical y acceso principal',
        caption: 'Vista 02 · Torre Panorama',
        attribution: 'VAC — Vergez & Asociados',
        sourceUrl: 'https://vac.com.do/images/Torre%20panorama%202.png',
      },
    ],
    sources: [
      { url: 'https://vac.com.do/', consultedAt: CONSULTED_AT, verificationStatus: 'verificado' },
      { url: 'https://vac.com.do/bulb.html', consultedAt: CONSULTED_AT, verificationStatus: 'verificado' },
    ],
  },
  {
    slug: 'bayshore-villa',
    href: '/proyectos/bayshore-villa',
    indexLabel: '02',
    name: 'Bayshore Villa',
    publicationStatus: 'published',
    neutralGalleryLegend: 'Galería del proyecto',
    metadata: {},
    images: [
      {
        key: 'bayshore-villa-1',
        width: ASSET_DIMENSIONS.projectPlate.width,
        height: ASSET_DIMENSIONS.projectPlate.height,
        alt: 'Bayshore Villa, acceso interior entre volúmenes hacia terraza frente al mar',
        caption: 'Vista 01 · Bayshore Villa',
        attribution: 'VAC — Vergez & Asociados',
        sourceUrl: 'https://vac.com.do/images/bayshore%20villa1.png',
      },
      {
        key: 'bayshore-villa-2',
        width: ASSET_DIMENSIONS.projectPlate.width,
        height: ASSET_DIMENSIONS.projectPlate.height,
        alt: 'Bayshore Villa, espacio interior de doble altura orientado hacia área exterior',
        caption: 'Vista 02 · Bayshore Villa',
        attribution: 'VAC — Vergez & Asociados',
        sourceUrl: 'https://vac.com.do/images/bayshore%20villa2.png',
      },
    ],
    sources: [
      { url: 'https://vac.com.do/', consultedAt: CONSULTED_AT, verificationStatus: 'verificado' },
      { url: 'https://vac.com.do/bulb.html', consultedAt: CONSULTED_AT, verificationStatus: 'verificado' },
    ],
  },
  {
    slug: 'canamar',
    href: '/proyectos/canamar',
    indexLabel: '03',
    name: 'Canamar',
    publicationStatus: 'published',
    neutralGalleryLegend: 'Galería del proyecto',
    metadata: {},
    images: [
      {
        key: 'canamar-1',
        width: ASSET_DIMENSIONS.projectPlate.width,
        height: ASSET_DIMENSIONS.projectPlate.height,
        alt: 'Canamar, fachada exterior con balcones acristalados y aleros superiores',
        caption: 'Vista 01 · Canamar',
        attribution: 'VAC — Vergez & Asociados',
        sourceUrl: 'https://vac.com.do/images/Canamar1.png',
      },
      {
        key: 'canamar-2',
        width: ASSET_DIMENSIONS.projectPlate.width,
        height: ASSET_DIMENSIONS.projectPlate.height,
        alt: 'Canamar, área común de piscina y terrazas rodeadas de vegetación',
        caption: 'Vista 02 · Canamar',
        attribution: 'VAC — Vergez & Asociados',
        sourceUrl: 'https://vac.com.do/images/Canamar2.png',
      },
    ],
    sources: [
      { url: 'https://vac.com.do/', consultedAt: CONSULTED_AT, verificationStatus: 'verificado' },
      { url: 'https://vac.com.do/bulb.html', consultedAt: CONSULTED_AT, verificationStatus: 'verificado' },
    ],
  },
  {
    slug: 'asian-teppanyaki',
    href: '/proyectos/asian-teppanyaki',
    indexLabel: '04',
    name: 'Asian Teppanyaki',
    publicationStatus: 'published',
    neutralGalleryLegend: 'Galería del proyecto',
    metadata: {},
    images: [
      {
        key: 'asian-teppanyaki-1',
        width: ASSET_DIMENSIONS.projectPlate.width,
        height: ASSET_DIMENSIONS.projectPlate.height,
        alt: 'Asian Teppanyaki, detalle interior de barra teppanyaki con campana metálica y celosía',
        caption: 'Vista 01 · Asian Teppanyaki',
        attribution: 'VAC — Vergez & Asociados',
        sourceUrl: 'https://vac.com.do/images/Asian%20Teppanyaki%201.png',
      },
      {
        key: 'asian-teppanyaki-2',
        width: ASSET_DIMENSIONS.projectPlate.width,
        height: ASSET_DIMENSIONS.projectPlate.height,
        alt: 'Asian Teppanyaki, salón principal bajo cubierta inclinada de madera y luminarias colgantes',
        caption: 'Vista 02 · Asian Teppanyaki',
        attribution: 'VAC — Vergez & Asociados',
        sourceUrl: 'https://vac.com.do/images/Asian%20Teppanyaki2.png',
      },
    ],
    sources: [
      { url: 'https://vac.com.do/', consultedAt: CONSULTED_AT, verificationStatus: 'verificado' },
      { url: 'https://vac.com.do/bulb.html', consultedAt: CONSULTED_AT, verificationStatus: 'verificado' },
    ],
  },
];

export function getPublishedProjects(): readonly ProjectEntry[] {
  return PROJECTS.filter((project) => project.publicationStatus === 'published');
}

export function getProjectBySlug(slug: string): ProjectEntry | undefined {
  return getPublishedProjects().find((project) => project.slug === slug);
}

export const CONTACT_CONTENT = {
  eyebrow: 'Contacto',
  headline: 'Conversación directa sobre su próximo proyecto',
  intro:
    'Para consultas preliminares de promotores, inversionistas o equipos de proyecto, Vergez & Asociados dispone de sus canales directos de atención.',
  prototypeNoticeTitle: 'Propuesta conceptual privada',
  prototypeNoticeBody:
    'Este entorno de demostración no transmite formularios ni almacena datos personales. Para iniciar contacto real, utilice directamente el teléfono o el correo electrónico indicados.',
  formPendingNote:
    'El envío automático permanece desactivado en esta propuesta comercial mientras Vergez & Asociados confirma la recepción operativa del formulario.',
};

export const PAGE_METADATA: Record<string, PageMeta> = {
  '/': {
    path: '/',
    title: 'VAC — Vergez & Asociados | Construcción y diseño',
    description:
      'Propuesta corporativa para VAC — Vergez & Asociados. Construcción y diseño en República Dominicana y el Caribe por un equipo con más de 30 años de experiencia.',
  },
  '/la-firma': {
    path: '/la-firma',
    title: 'La firma | VAC — Vergez & Asociados',
    description:
      'Trayectoria institucional de VAC — Vergez & Asociados: profesionales con más de 30 años de experiencia en construcción, supervisión internacional y presencia en el Caribe.',
  },
  '/experiencia': {
    path: '/experiencia',
    title: 'Experiencia | VAC — Vergez & Asociados',
    description:
      'Experiencia hotelera, proyectos habitacionales de lujo, colaboración con supervisión extranjera y presencia en proyectos en República Dominicana y el Caribe.',
  },
  '/proyectos': {
    path: '/proyectos',
    title: 'Proyectos | VAC — Vergez & Asociados',
    description:
      'Proyectos de VAC — Vergez & Asociados: Torre Panorama, Bayshore Villa, Canamar y Asian Teppanyaki.',
  },
  '/proyectos/torre-panorama': {
    path: '/proyectos/torre-panorama',
    title: 'Torre Panorama | Proyectos — VAC Vergez & Asociados',
    description: 'Galería del proyecto Torre Panorama presentada por VAC — Vergez & Asociados.',
  },
  '/proyectos/bayshore-villa': {
    path: '/proyectos/bayshore-villa',
    title: 'Bayshore Villa | Proyectos — VAC Vergez & Asociados',
    description: 'Galería del proyecto Bayshore Villa presentada por VAC — Vergez & Asociados.',
  },
  '/proyectos/canamar': {
    path: '/proyectos/canamar',
    title: 'Canamar | Proyectos — VAC Vergez & Asociados',
    description: 'Galería del proyecto Canamar presentada por VAC — Vergez & Asociados.',
  },
  '/proyectos/asian-teppanyaki': {
    path: '/proyectos/asian-teppanyaki',
    title: 'Asian Teppanyaki | Proyectos — VAC Vergez & Asociados',
    description: 'Galería del proyecto Asian Teppanyaki presentada por VAC — Vergez & Asociados.',
  },
  '/contacto': {
    path: '/contacto',
    title: 'Contacto | VAC — Vergez & Asociados',
    description:
      'Canales directos de contacto de VAC — Vergez & Asociados: teléfono 809-688-4418 y correo electrónico I.verguez@vac.com.do.',
  },
  '/404': {
    path: '/404',
    title: 'Página no encontrada | VAC — Vergez & Asociados',
    description: 'La ruta solicitada no existe en esta propuesta corporativa de VAC — Vergez & Asociados.',
  },
};
