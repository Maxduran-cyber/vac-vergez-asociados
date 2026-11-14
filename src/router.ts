import { PAGE_METADATA, getProjectBySlug } from './data/content';
import { renderHeader } from './components/header';
import { renderFooter } from './components/footer';
import { renderSideMenuDrawer } from './components/sideMenu';
import { renderLightboxModal } from './components/lightbox';
import { renderHomeView } from './views/homeView';
import { renderFirmView } from './views/firmView';
import { renderExperienceView } from './views/experienceView';
import { renderProjectsIndexView } from './views/projectsIndexView';
import { renderProjectDetailView } from './views/projectDetailView';
import { renderContactView } from './views/contactView';
import { renderNotFoundView } from './views/notFoundView';
import type { PageMeta } from './types/content';

export interface ResolvedRoute {
  normalizedPath: string;
  isFound: boolean;
  isDarkHero: boolean;
  meta: PageMeta;
  mainHtml: string;
}

export function normalizePathname(rawPathname: string): string {
  const withoutQuery = rawPathname.split('?')[0].split('#')[0];
  if (withoutQuery.length > 1 && withoutQuery.endsWith('/')) {
    return withoutQuery.slice(0, -1);
  }
  return withoutQuery || '/';
}

export function resolveRoute(rawPathname: string): ResolvedRoute {
  const path = normalizePathname(rawPathname);

  if (path === '/' || path === '/index.html') {
    return {
      normalizedPath: '/',
      isFound: true,
      isDarkHero: true,
      meta: PAGE_METADATA['/'],
      mainHtml: renderHomeView(),
    };
  }

  if (path === '/la-firma') {
    return {
      normalizedPath: '/la-firma',
      isFound: true,
      isDarkHero: false,
      meta: PAGE_METADATA['/la-firma'],
      mainHtml: renderFirmView(),
    };
  }

  if (path === '/experiencia') {
    return {
      normalizedPath: '/experiencia',
      isFound: true,
      isDarkHero: false,
      meta: PAGE_METADATA['/experiencia'],
      mainHtml: renderExperienceView(),
    };
  }

  if (path === '/proyectos') {
    return {
      normalizedPath: '/proyectos',
      isFound: true,
      isDarkHero: false,
      meta: PAGE_METADATA['/proyectos'],
      mainHtml: renderProjectsIndexView(),
    };
  }

  if (path.startsWith('/proyectos/')) {
    const slug = path.slice('/proyectos/'.length);
    const project = getProjectBySlug(slug);
    if (project) {
      return {
        normalizedPath: project.href,
        isFound: true,
        isDarkHero: false,
        meta: PAGE_METADATA[project.href] ?? {
          path: project.href,
          title: `${project.name} | VAC — Vergez & Asociados`,
          description: project.neutralGalleryLegend,
        },
        mainHtml: renderProjectDetailView(project),
      };
    }
  }

  if (path === '/contacto') {
    return {
      normalizedPath: '/contacto',
      isFound: true,
      isDarkHero: false,
      meta: PAGE_METADATA['/contacto'],
      mainHtml: renderContactView(),
    };
  }

  return {
    normalizedPath: path,
    isFound: false,
    isDarkHero: false,
    meta: PAGE_METADATA['/404'],
    mainHtml: renderNotFoundView(),
  };
}

export function renderFullAppShell(resolved: ResolvedRoute): string {
  return `
    <div id="app-shell">
      ${renderHeader(resolved.isDarkHero)}
      <main id="main-content" tabindex="-1">
        ${resolved.mainHtml}
      </main>
      ${renderFooter()}
    </div>
    ${renderSideMenuDrawer(resolved.normalizedPath)}
    ${renderLightboxModal()}
  `;
}
