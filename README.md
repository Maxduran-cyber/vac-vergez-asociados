# VAC — Vergez & Asociados | Propuesta Web Corporativa y Editorial Arquitectónica

[![Producción en Vercel](https://img.shields.io/badge/Producci%C3%B3n_en_Vivo-Vercel_HTTPS-0F172A?style=for-the-badge&logo=vercel&logoColor=white)](https://vac-vergez-asociados.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x_Estricto-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![GSAP](https://img.shields.io/badge/GSAP_3.12-ScrollTrigger-16A34A?style=for-the-badge)](https://gsap.com/)
[![Sharp Pipeline](https://img.shields.io/badge/Sharp-Image_Optimization-99CC00?style=for-the-badge)](https://sharp.pixelplumbing.com/)

> **Proyecto de Portafolio Verificable · Max Antonio Durán Castillo**  
> **Rol:** Dirección de Arte Digital, Arquitectura Web Editorial y Desarrollo Frontend (TypeScript · GSAP / ScrollTrigger · Pre-renderizado Estático Multi-Ruta · Optimización de Medios con Sharp).

Propuesta conceptual privada de arquitectura web editorial de alto nivel para la firma **VAC — Vergez & Asociados** (`Construcción y diseño`), desarrollada a partir de información pública y verificada en `https://vac.com.do/` y sus páginas institucionales.

---

## 1. Enlace en Vivo Verificable

| Entorno | Enlace | Cobertura |
| :--- | :--- | :--- |
| **Producción Principal (Vercel)** | **[vac-vergez-asociados.vercel.app](https://vac-vergez-asociados.vercel.app/)** | Despliegue en producción, pre-renderizado estático multi-ruta, navegación SPA optimizada y microinteracciones GSAP |

---

## 2. Características Técnicas Principales

- **Stack Tecnológico:** TypeScript estricto + Vite + GSAP (3.12) / ScrollTrigger + `sharp` para optimización de imagen + pre-renderizado estático multi-ruta (`scripts/prerender-routes.mjs`) + Vercel (`cleanUrls: true`, cabeceras de seguridad y `X-Robots-Tag: noindex, nofollow, noarchive`).
- **Sistema Visual (*Tectonic Monolith*):** Paleta monocromática arquitectónica (`#F5F5F2`, `#FFFFFF`, `#111111`, `#292929`, `#666666`, `#D9D9D4`), familia tipográfica única `Manrope` (`400`, `500`, `600`, `700`), geometría ortogonal (`0px`) y retícula responsiva de 12 columnas en escritorio / 4 en móvil.
- **Entrada «Apertura Arquitectónica» y Movimiento Contenido:** Tres capas aisladas (`.motion-scroll-layer`, `.motion-pointer-layer`, `.motion-intro-layer`), apertura inicial ejecutada una sola vez por sesión, escena de expansión de imagen con pin breve en escritorio (`gsap.matchMedia()`), soporte integral para `prefers-reduced-motion: reduce` y limpieza rigurosa de contexto al navegar.
- **Rutas Reales Pre-renderizadas (`dist/`):**
  - `/` — Portada, escena institucional, presentación de la firma, secuencia editorial de 4 obras maestras, mapa cartográfico del Caribe y cierre de contacto.
  - `/la-firma` — Trayectoria de profesionales con más de 30 años de experiencia y colaboración con supervisión internacional.
  - `/experiencia` — Cobertura hotelera, residencial de lujo y presencia declarada (República Dominicana, Santa Lucía, San Cristóbal, Nieves y Anguila).
  - `/proyectos` — Índice editorial de las obras publicadas.
  - `/proyectos/torre-panorama`, `/proyectos/bayshore-villa`, `/proyectos/canamar`, `/proyectos/asian-teppanyaki` — Fichas individuales con galería real de láminas `3:4` y visor modal accesible (`Escape`, `ArrowLeft`, `ArrowRight`).
  - `/contacto` — Canales directos oficiales (`809-688-4418` e `I.verguez@vac.com.do`) y estructura de contacto preparada con validación de formularios.
  - `/404.html` — Vista 404 personalizada en español con redirección amigable.

---

## 3. Estructura del Proyecto

```plaintext
vac-vergez-asociados/
├── api/                  # Endpoints serverless opcionales para contacto y formularios
├── docs/                 # Documentación técnica, matriz de fuentes y reporte de QA
│   ├── INVENTARIO_RECURSOS.md
│   ├── MANTENIMIENTO_E_INTEGRACION.md
│   ├── REGISTRO_FUENTES_Y_PENDIENTES.md
│   └── REPORTE_PRUEBAS_Y_CALIDAD.md
├── public/               # Activos estáticos públicos (imágenes optimizadas, iconos, robots.txt)
├── raw-assets/           # Fotografías y recursos originales de alta fidelidad
├── scripts/              # Pipelines de optimización con Sharp y pre-renderizado multi-ruta
│   ├── prepare-assets.mjs
│   ├── prerender-routes.mjs
│   └── upscale-hero.py
├── src/                  # Código fuente modular en TypeScript estricto
│   ├── animations/       # Controladores GSAP y ScrollTrigger
│   ├── components/       # Componentes visuales y modales accesibles
│   ├── data/             # Contenido estructurado y validado de la firma
│   ├── styles/           # Sistema de diseño Tectonic Monolith en CSS puro
│   └── main.ts           # Punto de entrada y enrutamiento
├── index.html            # Plantilla HTML5 semántica
├── package.json          # Dependencias y scripts
├── tsconfig.json         # Configuración estricta de compilador TypeScript
├── vercel.json           # Configuración de despliegue, cleanUrls y cabeceras HTTP
└── vite.config.ts        # Configuración del bundler Vite
```

---

## 4. Instalación y Ejecución Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/Maxduran-cyber/vac-vergez-asociados.git
cd vac-vergez-asociados

# 2. Instalar dependencias
npm install

# 3. Preparar derivados de imágenes y levantar servidor de desarrollo
npm run dev

# 4. Compilar optimizado con pre-renderizado estático para producción
npm run build

# 5. Previsualizar el bundle de producción
npm run preview
```

---

## 5. Documentación y Anexos Técnicos

- [Registro de Fuentes y Pendientes](docs/REGISTRO_FUENTES_Y_PENDIENTES.md)
- [Inventario de Recursos](docs/INVENTARIO_RECURSOS.md)
- [Mantenimiento e Integración](docs/MANTENIMIENTO_E_INTEGRACION.md)
- [Reporte de Pruebas y Calidad](docs/REPORTE_PRUEBAS_Y_CALIDAD.md)
