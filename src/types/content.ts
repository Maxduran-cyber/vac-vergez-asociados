export type RoutePath =
  | '/'
  | '/la-firma'
  | '/experiencia'
  | '/proyectos'
  | '/proyectos/torre-panorama'
  | '/proyectos/asian-teppanyaki'
  | '/proyectos/bayshore-villa'
  | '/proyectos/canamar'
  | '/contacto';

export interface NavItem {
  label: string;
  href: RoutePath;
  previewImageKey: string;
  previewAlt: string;
}

export interface ProjectImage {
  key: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  attribution: string;
  sourceUrl: string;
}

export interface ProjectOptionalMetadata {
  location?: string;
  year?: string;
  area?: string;
  typology?: string;
  contractScope?: string;
}

export interface ProjectSourceRecord {
  url: string;
  consultedAt: string;
  verificationStatus: 'verificado' | 'pendiente_confirmacion';
}

export interface ProjectEntry {
  slug: string;
  href: `/proyectos/${string}`;
  indexLabel: string;
  name: string;
  publicationStatus: 'published' | 'draft';
  leadSummary?: string;
  neutralGalleryLegend: string;
  metadata: ProjectOptionalMetadata;
  images: readonly [ProjectImage, ProjectImage];
  sources: readonly ProjectSourceRecord[];
}

export interface RegionTerritory {
  id: string;
  name: string;
  publishedLabel: string;
  coordinates: {
    lon: number;
    lat: number;
  };
  isInsularCaribe: boolean;
}

export interface VerificationGapItem {
  field: string;
  currentState: string;
  sourceUrl: string;
  consultedAt: string;
  status: 'verificado' | 'requiere_confirmacion' | 'pendiente';
  notes: string;
}

export interface PageMeta {
  path: string;
  title: string;
  description: string;
}
