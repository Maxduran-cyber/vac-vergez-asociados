# Mantenimiento e Integración de Producción — VAC

## 1. Edición de proyectos y contenido (`src/data/content.ts`)

El contenido editorial y el catálogo de obras se encuentran separados del diseño:

- Para añadir o actualizar metadatos confirmados de una obra (ubicación, año, superficie, tipología o alcance contractual), editar el objeto `metadata` de cada proyecto en `PROJECTS` dentro de `src/data/content.ts`.
- Los campos opcionales vacíos se omiten automáticamente en la interfaz mediante `renderOptionalMetadata` (`src/views/projectMeta.ts`).
- Si un proyecto pasa a estado borrador, cambiar `publicationStatus: 'draft'`.

## 2. Sustitución de fotografías en alta resolución

1. Colocar los archivos originales aprobados en `raw-assets/`.
2. Actualizar `PROJECT_IMAGES` en `scripts/prepare-assets.mjs` si cambia la resolución objetivo (por ejemplo, `1096×1460` manteniendo `3:4`).
3. Ejecutar `npm run build` para regenerar WebP/JPG, actualizar `src/data/assetManifest.ts`, compilar TypeScript y pre-renderizar las rutas HTML estáticas.

## 3. Activación del formulario de contacto en producción

Actualmente el formulario opera con `PrototypeSafeContactProvider` (`src/services/contactService.ts`) y la función serverless `api/contact.ts` protegida por `VAC_CONTACT_ENABLED !== 'true'`. Para habilitar recepción real tras aprobación de VAC:

1. Confirmar la dirección receptora oficial (`I.verguez@vac.com.do` u otra designada) y el texto legal de privacidad.
2. Configurar en Vercel las variables de entorno privadas:
   - `VAC_CONTACT_ENABLED=true`
   - Credenciales del proveedor de correo autorizado (ej. `RESEND_API_KEY` y `VAC_CONTACT_TO`).
3. Completar el bloque de envío autorizado en `api/contact.ts`.
4. Cambiar `export const contactService = new PrototypeSafeContactProvider()` a `new ApiEndpointContactProvider('/api/contact')` en `src/services/contactService.ts` y habilitar el botón de envío en `src/views/contactView.ts`.

## 4. Retiro de `noindex` en lanzamiento oficial

Antes de apuntar el dominio oficial definitivo:
- Eliminar `<meta name="robots" content="noindex, nofollow, noarchive" />` y `<meta name="googlebot" content="noindex, nofollow" />` en `index.html`.
- Retirar la cabecera `X-Robots-Tag` en `vercel.json` y `api/contact.ts`.
- Actualizar `public/robots.txt` y `VITE_DEMO_ORIGIN` al dominio definitivo de producción.
