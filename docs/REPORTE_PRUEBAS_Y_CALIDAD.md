# Reporte de Pruebas y Calidad — VAC — Vergez & Asociados

Documento de verificación técnica local y en producción sobre Vercel correspondiente al despliegue final en `https://vac-vergez-asociados.vercel.app`.

---

## 1. Compilación de producción (`npm run build`)

Ejecución posterior a la corrección del destello gris (eliminación de filtros animados en el compositor GPU), ajuste de juego de luces y sombras estilo `drake-apartments` (`.hero-contrast-veil` + `.hero-ambient-glow`), parallax 2D con el mouse y animación elástica letra por letra en `#hero-title`:

- `python scripts/upscale-hero.py`: maestros generados (`images_habitat_villas_master_4k.png` `3840×2160` desde `images_habitat_villas_v3_wide.jpg` e `images_habitat_villas_mobile_4k.png` `2160×2880` desde `images_habitat_villas_uploaded_v3.jpg`).
- `node scripts/prepare-assets.mjs`: ejecutado correctamente (`logoDims: 800x444`, `heroDims: { heroDesktop: 3840x2160, heroMobile: 1440x1920 }`, `institutionalDims: 1059x744`, `projectDims: 548x730`, `totalProjectSets: 8`).
- `tsc --noEmit`: finalizado con código `0`.
- `vite build`: `29` módulos transformados en `1.07 s`; salida en `dist/index.html` (`2.18 kB`), `dist/assets/index-BFEx6GAu.css` (`32.65 kB`) y `dist/assets/index-BiEe-ASL.js` (`195.74 kB`).
- `node scripts/prerender-routes.mjs`: pre-renderizó `10` archivos HTML de rutas + `sitemap.xml` (origen configurado: `https://vac-vergez-asociados.vercel.app`).

---

## 2. Verificación local sobre `dist/` (`qa-verify.mjs` en Microsoft Edge headless)

Se comprobó el bundle final en servidor local estático (`http://127.0.0.1:4173`) antes del despliegue:

| Resolución / Comprobación | `scrollWidth === innerWidth` | `h1` visible (`opacity: 1`) | Imágenes rotas (`brokenImgs`) | Imágenes visibles (`visibleImgsCount`) | Imágenes animadas atascadas (`stuckInvisible`) | Resultado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Móvil (`390x844`) | `390 === 390` | `1` (`Manrope`) | `0` (`[]`) | `4` | `0` de `1` | Aprobado |
| Tablet (`768x1024`) | `768 === 768` | `1` (`Manrope`) | `0` (`[]`) | `4` | `0` de `1` | Aprobado |
| Escritorio (`1440x900`) | `1440 === 1440` | `1` (`Manrope`) | `0` (`[]`) | `4` | `0` de `1` | Aprobado |
| Escritorio amplio (`1920x1080`) | `1920 === 1920` | `1` (`Manrope`) | `0` (`[]`) | `4` | `0` de `1` | Aprobado |

- **LCP Hero en los 4 viewports:** `heroLcpLoading: "eager"`, `heroLcpPriority: "high"`.
- **Errores de consola y red (`qa-verify.mjs`):** `consoleErrors: []`, `networkFailures: []`.
- **Rutas en `qa-verify.mjs` (`1440x900` tras scroll completo):**
  - `/la-firma` (`200`, `animateImagesCount: 3`, `stuckInvisible: 0`), `/experiencia` (`200`, `animateImagesCount: 5`, `stuckInvisible: 0`), `/proyectos` (`200`, `animateImagesCount: 8`, `stuckInvisible: 0`), `/proyectos/torre-panorama` (`200`, `animateImagesCount: 2`, `stuckInvisible: 0`), `/proyectos/bayshore-villa` (`200`, `2`, `0`), `/proyectos/canamar` (`200`, `2`, `0`), `/proyectos/asian-teppanyaki` (`200`, `2`, `0`) y `/contacto` (`200`, `0`, `0`).
  - `/ruta-inexistente` respondió `404` (`Página no encontrada | VAC — Vergez & Asociados`, `<h1>Ruta no encontrada</h1>`).
- **Interacciones y accesibilidad verificadas en local:**
  - **Menú lateral:** apertura `#menu-toggle[aria-expanded="true"]`, ancho del panel `634px`, aplicación principal marcada con `inert` (`appInert: true`); cierre restableciendo `ariaExpanded="false"`, foco devuelto a `#menu-toggle` y `appInert: false`.
  - **Visor lightbox:** apertura desde ficha de proyecto (`1 / 2`), avance con teclado a siguiente lámina (`2 / 2`) y cierre con `Escape` (`hidden: true`).
  - **Formulario de contacto:** validación negativa (`"Ingrese su nombre completo (mínimo 3 caracteres)."`), confirmación local sin transmisión ni almacenamiento real y envío real desactivado.
  - **Navegación SPA (`history`):** `/` → `/proyectos` → atrás `/` → adelante `/proyectos`.
  - **Compatibilidad bajo `prefers-reduced-motion: reduce` (simulando `Windows ClientAreaAnimation=False`):** `h1Opacity: "1"`, `firmOpacity: "1"`, `animateImagesAllVisible: true`, `rmProjectsAllVisible: true`, conservando parallax (`rmParallax.pointerLayerTransform: matrix(1, 0, 0, 1, -10.0399, 3.0556)`), halo luminoso (`ambientGlowOpacity: "0.8795"`) y repulsión elástica por carácter (`displacedCount: 13` de `31`).
  - **Estabilidad de render sobre el título (`heroEffects`):** `introLayerFilter: "none"`, `heroImgFilter: "none"`, `introLayerFilterOnHover: "none"`, `desktopCharsRestored: true` y `h1Text: "Construcción con visión y precisión"`.
  - **Vista previa al navegar por el menú (`sideMenu.previews`):** cambio suave verificado al alternar enlaces (`/images/torre-panorama-2.webp` → `/images/bayshore-villa-1.webp` en `La firma` → `/images/torre-panorama-1.webp` en `Proyectos`).
- **Inspección visual de capturas (`docs/capturas/`):** revisadas `01-home-desktop-1440.png` (juego de luces y sombras con velo en ángulo inferior izquierdo y fondo 4K nítido) y `05-home-mobile-390.png` (toma vertical v3 completa con legibilidad alta).

---

## 3. Despliegue y verificación en producción (`https://vac-vergez-asociados.vercel.app`)

- **Proyecto Vercel:** `sistemas-ia-max/vac-vergez-asociados`
- **Deployment ID:** `dpl_4qBe9d1eac6xnYRPFub1beXHWwrG` (`READY`, entorno `production`)
- **URL de producción:** https://vac-vergez-asociados.vercel.app

### 3.1 Comprobación HTTP de rutas y cabeceras en vivo (`verify-live.mjs`)

| Ruta / Recurso | HTTP Status | `X-Robots-Tag` | Título (`<title>`) |
| :--- | :--- | :--- | :--- |
| `/` | `200` | `noindex, nofollow, noarchive` | `VAC — Vergez & Asociados \| Construcción y diseño` |
| `/la-firma` | `200` | `noindex, nofollow, noarchive` | `La firma \| VAC — Vergez & Asociados` |
| `/experiencia` | `200` | `noindex, nofollow, noarchive` | `Experiencia \| VAC — Vergez & Asociados` |
| `/proyectos` | `200` | `noindex, nofollow, noarchive` | `Proyectos \| VAC — Vergez & Asociados` |
| `/proyectos/torre-panorama` | `200` | `noindex, nofollow, noarchive` | `Torre Panorama \| Proyectos — VAC Vergez & Asociados` |
| `/proyectos/bayshore-villa` | `200` | `noindex, nofollow, noarchive` | `Bayshore Villa \| Proyectos — VAC Vergez & Asociados` |
| `/proyectos/canamar` | `200` | `noindex, nofollow, noarchive` | `Canamar \| Proyectos — VAC Vergez & Asociados` |
| `/proyectos/asian-teppanyaki` | `200` | `noindex, nofollow, noarchive` | `Asian Teppanyaki \| Proyectos — VAC Vergez & Asociados` |
| `/contacto` | `200` | `noindex, nofollow, noarchive` | `Contacto \| VAC — Vergez & Asociados` |
| `/robots.txt` | `200` | `noindex, nofollow, noarchive` | `User-agent: * / Disallow: /` |
| `/sitemap.xml` | `200` | `noindex, nofollow, noarchive` | `9` URLs bajo `https://vac-vergez-asociados.vercel.app` |
| `/ruta-inexistente` | `404` | `noindex, nofollow, noarchive` | `Página no encontrada \| VAC — Vergez & Asociados` |

### 3.2 Prueba interactiva de extremo a extremo sobre Vercel (`verify-live.mjs`)

Ejecutada en Microsoft Edge headless directamente contra `https://vac-vergez-asociados.vercel.app`:

- **Endpoint serverless `POST /api/contact`:** HTTP `503` con respuesta segura `{"status":"prototype_disabled","message":"Recepción desactivada en entorno prototipo. Confirmar VAC_CONTACT_ENABLED y buzón oficial con Vergez & Asociados."}`.
- **Parallax GSAP, efecto hover sobre título y transición de cabecera en escritorio (`1440x900`):**
  - Cabecera en portada: `hasDarkHeroHeader: true`, `isScrolledAtTop: false`; tras scroll a `220px`, `isScrolledAfter220: true`.
  - Imagen hero y caché: `heroSources: 2`, `heroImageStatus: 200`, `heroImageCacheControl: "public, max-age=0, must-revalidate"`, `mobileHeroImageStatus: 200`, `heroCurrentSrc: https://vac-vergez-asociados.vercel.app/images/hero-habitat-v3-4k-1920.webp`, `heroLoading: "eager"`, `heroFetchPriority: "high"`, `hasMotionLayers: true`.
  - **Parallax GSAP + halo luminoso al mover el mouse sobre portada:** `.motion-pointer-layer` responde (`matrix(1, 0, 0, 1, -10.0362, 3.0545)`), `#hero-ambient-glow` sigue al puntero (`opacity: "0.8795"`, `matrix(1, 0, 0, 1, 835.063, -14.9219)`), con `introLayerFilter: "none"` y `heroImgFilter: "none"` (sin destello gris).
  - **Dispersión elástica por carácter al pasar por el título (`#hero-title`):** `13` de `31` caracteres en `.hero-char` reaccionan dentro de un radio de `160px` (`h1Text: "Construcción con visión y precisión"`, `introLayerFilterOnHover: "none"`) y vuelven con `elastic.out(1.1, 0.5)`.
  - **Verificación en vivo bajo `reducedMotion: 'reduce'` (SO Windows):** `rmH1Opacity: "1"`, `rmParallax` activo (`matrix(1, 0, 0, 1, -10.0399, 3.0556)`, `ambientGlowOpacity: "0.8795"`) y `rmTitleHover` activo (`13` de `31` caracteres).
  - **Parallax al desplazarse:** `.motion-scroll-layer` responde (`matrix(1.03, 0, 0, 1.03, 0, -5.1724)`).
  - Inicio tras scroll completo: `scrollWidth: 1440`, `innerWidth: 1440`, `visibleImgsCount: 4`, `brokenImgs: []`, `animateImagesCount: 1`, `stuckInvisible: 0`.
- **Rutas interiores en vivo tras scroll completo:**
  - `/la-firma` (`200`, `visibleImgsCount: 5`, `brokenImgs: []`, `animateImagesCount: 3`, `stuckInvisible: 0`)
  - `/experiencia` (`200`, `visibleImgsCount: 6`, `brokenImgs: []`, `animateImagesCount: 5`, `stuckInvisible: 0`)
  - `/proyectos` (`200`, `visibleImgsCount: 10`, `brokenImgs: []`, `animateImagesCount: 8`, `stuckInvisible: 0`)
  - `/proyectos/torre-panorama` (`200`, `visibleImgsCount: 4`, `brokenImgs: []`, `animateImagesCount: 2`, `stuckInvisible: 0`)
  - `/contacto` (`200`, `visibleImgsCount: 2`, `brokenImgs: []`, `animateImagesCount: 0`, `stuckInvisible: 0`)
- **Flujos interactivos en vivo:**
  - Menú (`torre-panorama-2.webp` inicial → `bayshore-villa-1.webp` en `La firma` → `torre-panorama-1.webp` en `Proyectos`, desplegado con `opacity: "1"`, `frameClip: "none"`) → `/proyectos` → `/proyectos/torre-panorama` → apertura de lightbox (`1 / 2` → `2 / 2`) → cierre con `Escape` → enlace `/contacto`.
  - En `/contacto`: enlaces directos `tel:+18096884418` y `mailto:I.verguez@vac.com.do`, validación negativa y positiva local sin envío real y `submitDisabled: true`.
- **Inicio en móvil (`390x844`) tras scroll completo:** `heroCurrentSrc: https://vac-vergez-asociados.vercel.app/images/hero-habitat-v3-mobile-1080.webp`, `scrollWidth: 390`, `innerWidth: 390`, `visibleImgsCount: 4`, `brokenImgs: []`, `animateImagesCount: 1`, `stuckInvisible: 0`; menú móvil `aria-expanded: "true"` → `Escape` → `"false"`.
- **Estabilidad en vivo:** `consoleErrors: []` y `networkFailures: []`.
