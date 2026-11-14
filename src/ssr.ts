import { renderFullAppShell, resolveRoute, type ResolvedRoute } from './router';

export function renderRouteForPrerender(pathname: string): {
  resolved: ResolvedRoute;
  appHtml: string;
} {
  const resolved = resolveRoute(pathname);
  const appHtml = renderFullAppShell(resolved);
  return { resolved, appHtml };
}
