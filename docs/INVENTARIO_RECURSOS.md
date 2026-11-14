# Inventario Técnico de Recursos — VAC (Vergez & Asociados)

## 1. Activos gráficos descargados y procesados (`scripts/prepare-assets.mjs` + `sharp`)

Los activos institucionales y de obras provienen de `https://vac.com.do/` (almacenados localmente en `raw-assets/`), y la fotografía arquitectónica de portada (*«habitat VILLAS»*) procede del recurso vertical v3 aportado (`images_habitat_villas_uploaded_v3.jpg`, `727×968` sRGB JPEG) junto con su extensión panorámica `16:9` fiel (`images_habitat_villas_v3_wide.jpg`, `1376×768`), procesados hasta resolución **4K** (`3840×2160` escritorio / `2160×2880` maestro móvil) en WebP/JPG optimizados dentro de `public/images/` y servidos con `Cache-Control: public, max-age=0, must-revalidate` para actualización inmediata sin caché obsoleta.

| Recurso origen | Dimensiones origen | Derivados generados en `public/images/` | Uso en la propuesta |
| --- | --- | --- | --- |
| Portada v3 (`images_habitat_villas_v3_wide.jpg` para 16:9 + `images_habitat_villas_uploaded_v3.jpg` para móvil) → mejora tonal y escalado 4K (`scripts/upscale-hero.py` → `images_habitat_villas_master_4k.png` `3840×2160` y `images_habitat_villas_mobile_4k.png` `2160×2880`) | Escritorio `1376×768` / Móvil `727×968` sRGB JPEG | Escritorio (`16:9`): `hero-habitat-v3-4k-3840.webp` (`3840×2160`), `hero-habitat-v3-4k-2560.webp` (`2560×1440`), `hero-habitat-v3-4k-1920.webp/.jpg` (`1920×1080`). Móvil (`3:4`): `hero-habitat-v3-mobile-1440.webp` (`1440×1920`), `hero-habitat-v3-mobile-1080.webp/.jpg` (`1080×1440`) | Portada fotográfica a sangre en `/` con `<picture>` responsivo por media query (`767px`), degradado luminoso localizado, parallax 3D GSAP con mouse y efecto interactivo sobre el título |
| `images/logo1.png` (`vac.com.do`) | `5020×2820` PNG alfa | `vac-logo-white.webp/.png` (`800×444`), `vac-logo-dark.webp/.png` (`800×444`) | Cabecera (transparente sobre hero a blanco/sólido al hacer scroll), menú lateral y pie de página |
| `images/pc_layout.png` (`vac.com.do`) | `1059×744` PNG | `institucional-vac-1059.webp/.jpg` (`1059×744`), `institucional-vac-760.webp` (`760×534`) | Bloque visual institucional en `/la-firma` con paso sutil de claridad y enfoque (`modulate` + `sharpen`) |
| `images/Torre panorama1.png` (`vac.com.do`) | `548×730` PNG | `torre-panorama-1.webp/.jpg`, `torre-panorama-1-420.webp` | Encuadre inicial de obra en `/la-firma`, `/proyectos`, `/proyectos/torre-panorama` |
| `images/Torre panorama 2.png` (`vac.com.do`) | `548×730` PNG | `torre-panorama-2.webp/.jpg`, `torre-panorama-2-420.webp` | Avance de «La firma» en `/`, vista previa del menú, `/proyectos`, `/proyectos/torre-panorama` |
| `images/bayshore villa1.png` (`vac.com.do`) | `548×730` PNG | `bayshore-villa-1.webp/.jpg`, `bayshore-villa-1-420.webp` | `/experiencia`, `/proyectos`, `/proyectos/bayshore-villa` |
| `images/bayshore villa2.png` (`vac.com.do`) | `548×730` PNG | `bayshore-villa-2.webp/.jpg`, `bayshore-villa-2-420.webp` | `/proyectos` y galería `/proyectos/bayshore-villa` |
| `images/Canamar1.png` (`vac.com.do`) | `548×730` PNG | `canamar-1.webp/.jpg`, `canamar-1-420.webp` | `/experiencia`, `/proyectos`, `/proyectos/canamar` |
| `images/Canamar2.png` (`vac.com.do`) | `548×730` PNG | `canamar-2.webp/.jpg`, `canamar-2-420.webp` | `/proyectos` y galería `/proyectos/canamar` |
| `images/Asian Teppanyaki 1.png` (`vac.com.do`) | `548×730` PNG | `asian-teppanyaki-1.webp/.jpg`, `asian-teppanyaki-1-420.webp` | `/proyectos` y galería `/proyectos/asian-teppanyaki` |
| `images/Asian Teppanyaki2.png` (`vac.com.do`) | `548×730` PNG | `asian-teppanyaki-2.webp/.jpg`, `asian-teppanyaki-2-420.webp` | `/experiencia`, `/proyectos`, `/proyectos/asian-teppanyaki` |

> **Nota técnica sobre la fotografía de portada (`habitat VILLAS`):** Partiendo del archivo `727×968 px` recibido (`images_habitat_villas_uploaded_v3.jpg`), se conservó íntegramente la toma original en móvil (`2160×2880 px` maestro → derivados `1440×1920` / `1080×1440`) y se generó una composición panorámica `16:9` fiel hacia la izquierda para escritorio (`1376×768 px` → maestro `3840×2160 px` 4K). `scripts/upscale-hero.py` aplica balance tonal (`Brightness 1.04`, `Contrast 1.06`, `Color 1.04`), escalado `Lanczos` 4K y enfoque multiescala guiado por bordes sin halos ni invención arquitectónica sobre la villa y letrero originales. Como toda ampliación asistida, no equivale a detalle óptico nativo capturado en sensor 4K, pero ofrece máxima nitidez sin recorte en escritorio y móvil; la escena no se atribuye como obra ejecutada por VAC.

> **Nota sobre resolución de obras:** Las 8 fotografías de obras tienen resolución nativa `548×730 px` (relación `3:4`) y reciben un ajuste sutil de luminosidad y nitidez en `scripts/prepare-assets.mjs` manteniendo contenedores `aspect-ratio: 3 / 4` para evitar distorsión.

## 2. Tipografía y sistema visual

- **Familia única:** `Manrope` (`400`, `500`, `600`, `700`) vía Google Fonts (`display=swap`).
- **Sistema de diseño:** *Tectonic Monolith* (`#F5F5F2`, `#FFFFFF`, `#111111`, `#292929`, `#666666`, `#D9D9D4`), geometría ortogonal (`border-radius: 0`), retícula responsiva de 12 columnas.

## 3. Dependencias

- **Producción:** `gsap` (`^3.12.5` + `ScrollTrigger`).
- **Desarrollo/Compilación:** `sharp` (`^0.33.5`), `typescript` (`^5.6.3`), `vite` (`^5.4.11`), `playwright-core` (`^1.49.1`, verificación local).
