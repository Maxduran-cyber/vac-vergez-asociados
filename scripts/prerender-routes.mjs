import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

const ROUTES = [
  '/',
  '/la-firma',
  '/experiencia',
  '/proyectos',
  '/proyectos/torre-panorama',
  '/proyectos/bayshore-villa',
  '/proyectos/canamar',
  '/proyectos/asian-teppanyaki',
  '/contacto',
  '/404',
];

function escapeXml(str) {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function escapeAttr(str) {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function resolveDemoOrigin() {
  const envOrigin = process.env.VITE_DEMO_ORIGIN || process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (!envOrigin) {
    return 'https://vac-vergez-asociados.vercel.app';
  }
  return envOrigin.startsWith('http') ? envOrigin.replace(/\/$/, '') : `https://${envOrigin.replace(/\/$/, '')}`;
}

async function main() {
  const templatePath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Missing built index.html at ${templatePath}. Run vite build first.`);
  }

  const templateHtml = fs.readFileSync(templatePath, 'utf8');
  const demoOrigin = resolveDemoOrigin();

  const vite = await createServer({
    root: ROOT_DIR,
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'silent',
    ssr: {
      noExternal: ['gsap'],
    },
  });

  try {
    const { renderRouteForPrerender } = await vite.ssrLoadModule('/src/ssr.ts');

    for (const route of ROUTES) {
      const { resolved, appHtml } = renderRouteForPrerender(route);
      const canonicalUrl = route === '/' ? `${demoOrigin}/` : `${demoOrigin}${route}`;

      let html = templateHtml.replace('<!--APP_HTML-->', appHtml);
      html = html.replace(
        /<title>[\s\S]*?<\/title>/i,
        `<title>${escapeAttr(resolved.meta.title)}</title>`,
      );
      html = html.replace(
        /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
        `<meta name="description" content="${escapeAttr(resolved.meta.description)}" />`,
      );
      html = html.replace(
        /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
        `<meta property="og:title" content="${escapeAttr(resolved.meta.title)}" />`,
      );
      html = html.replace(
        /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
        `<meta property="og:description" content="${escapeAttr(resolved.meta.description)}" />`,
      );

      if (route !== '/404') {
        html = html.replace(
          '</head>',
          `  <link rel="canonical" href="${escapeAttr(canonicalUrl)}" />\n  </head>`,
        );
      }

      if (route === '/') {
        fs.writeFileSync(path.join(DIST_DIR, 'index.html'), html, 'utf8');
      } else if (route === '/404') {
        fs.writeFileSync(path.join(DIST_DIR, '404.html'), html, 'utf8');
      } else {
        const cleanSeg = route.replace(/^\//, '');
        const htmlFilePath = path.join(DIST_DIR, `${cleanSeg}.html`);
        const dirIndexPath = path.join(DIST_DIR, cleanSeg, 'index.html');
        fs.mkdirSync(path.dirname(htmlFilePath), { recursive: true });
        fs.mkdirSync(path.dirname(dirIndexPath), { recursive: true });
        fs.writeFileSync(htmlFilePath, html, 'utf8');
        fs.writeFileSync(dirIndexPath, html, 'utf8');
      }
    }

    const indexableDemoRoutes = ROUTES.filter((r) => r !== '/404');
    const urlEntries = indexableDemoRoutes
      .map((r) => {
        const loc = r === '/' ? `${demoOrigin}/` : `${demoOrigin}${r}`;
        return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n  </url>`;
      })
      .join('\n');

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;
    fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf8');

    console.log(`[prerender-routes] Prerendered ${ROUTES.length} routes + sitemap.xml (origin: ${demoOrigin})`);
  } finally {
    await vite.close();
  }
}

main().catch((err) => {
  console.error('[prerender-routes] Error:', err);
  process.exit(1);
});
