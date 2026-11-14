import { REGIONAL_TERRITORIES } from '../data/content';
import { escapeHtml } from '../utils/html';

// Proyección equirectangular calibrada para la cuenca del Caribe (lat 11.8°N–20.8°N, lon -75.2°W–-59.2°W)
const LON_MIN = -75.2;
const LON_SPAN = 16.0;
const LAT_MAX = 20.8;
const LAT_SPAN = 9.0;
const VIEW_W = 800;
const VIEW_H = 468;

function projectLonLat(lon: number, lat: number): { x: number; y: number } {
  const x = ((lon - LON_MIN) / LON_SPAN) * VIEW_W;
  const y = ((LAT_MAX - lat) / LAT_SPAN) * VIEW_H;
  return {
    x: Number(x.toFixed(1)),
    y: Number(y.toFixed(1)),
  };
}

function buildPolygonPoints(coords: ReadonlyArray<readonly [number, number]>): string {
  return coords
    .map(([lon, lat]) => {
      const { x, y } = projectLonLat(lon, lat);
      return `${x},${y}`;
    })
    .join(' ');
}

// Siluetas geográficas aproximadas de referencia cartográfica para la cuenca del Caribe
const HAITI_POLY = buildPolygonPoints([
  [-73.45, 19.95],
  [-72.80, 19.92],
  [-71.75, 19.68],
  [-71.72, 19.00],
  [-71.85, 18.45],
  [-71.74, 18.03],
  [-72.85, 18.22],
  [-74.45, 18.45],
  [-74.42, 18.62],
  [-72.90, 18.55],
  [-72.42, 18.56],
  [-72.72, 19.12],
  [-73.32, 19.52],
]);

const REP_DOM_POLY = buildPolygonPoints([
  [-71.75, 19.72],
  [-71.25, 19.90],
  [-70.69, 19.80],
  [-69.90, 19.67],
  [-69.18, 19.22],
  [-69.36, 19.12],
  [-69.05, 19.02],
  [-68.34, 18.62],
  [-68.36, 18.38],
  [-68.96, 18.42],
  [-69.89, 18.47],
  [-70.33, 18.23],
  [-70.60, 18.35],
  [-71.09, 18.21],
  [-71.36, 17.60],
  [-71.74, 18.03],
  [-71.85, 18.45],
  [-71.72, 19.00],
]);

const PUERTO_RICO_POLY = buildPolygonPoints([
  [-67.25, 18.48],
  [-66.55, 18.49],
  [-65.62, 18.40],
  [-65.65, 18.05],
  [-66.40, 17.98],
  [-67.18, 17.96],
  [-67.26, 18.26],
]);

const CONTEXT_ISLANDS: ReadonlyArray<{ name: string; lon: number; lat: number; rx: number; ry: number }> = [
  { name: 'St. Martin', lon: -63.06, lat: 18.07, rx: 4, ry: 3 },
  { name: 'Antigua', lon: -61.80, lat: 17.08, rx: 5, ry: 4 },
  { name: 'Guadalupe', lon: -61.55, lat: 16.25, rx: 7, ry: 6 },
  { name: 'Dominica', lon: -61.37, lat: 15.41, rx: 4, ry: 7 },
  { name: 'Martinica', lon: -61.02, lat: 14.64, rx: 5, ry: 7 },
  { name: 'San Vicente', lon: -61.20, lat: 13.25, rx: 4, ry: 6 },
];

export function renderRegionalMap(): string {
  const gridLinesX = [100, 200, 300, 400, 500, 600, 700]
    .map((x) => `<line x1="${x}" y1="0" x2="${x}" y2="${VIEW_H}" stroke="#D9D9D4" stroke-width="0.75" />`)
    .join('');

  const gridLinesY = [78, 156, 234, 312, 390]
    .map((y) => `<line x1="0" y1="${y}" x2="${VIEW_W}" y2="${y}" stroke="#D9D9D4" stroke-width="0.75" />`)
    .join('');

  const contextDots = CONTEXT_ISLANDS.map((isl) => {
    const { x, y } = projectLonLat(isl.lon, isl.lat);
    return `<ellipse cx="${x}" cy="${y}" rx="${isl.rx}" ry="${isl.ry}" fill="#E4E4DF" stroke="#B8B8B2" stroke-width="0.75" />`;
  }).join('');

  const rdPos = projectLonLat(-70.16, 18.92);

  const pinsHtml = REGIONAL_TERRITORIES.map((territory) => {
    const pos = territory.id === 'rep-dom'
      ? rdPos
      : projectLonLat(territory.coordinates.lon, territory.coordinates.lat);

    const labelOffset = (() => {
      switch (territory.id) {
        case 'rep-dom':
          return { dx: 0, dy: -36, anchor: 'middle' };
        case 'anguilla':
          return { dx: 14, dy: -10, anchor: 'start' };
        case 'st-kitts':
          return { dx: -14, dy: -4, anchor: 'end' };
        case 'nevis':
          return { dx: 14, dy: 18, anchor: 'start' };
        case 'st-lucia':
          return { dx: -14, dy: 4, anchor: 'end' };
        default:
          return { dx: 12, dy: 4, anchor: 'start' };
      }
    })();

    return `
      <g class="map-territory-pin" data-territory-pin="${escapeHtml(territory.id)}">
        <circle cx="${pos.x}" cy="${pos.y}" r="14" fill="#111111" fill-opacity="0.06" class="map-pin-halo" />
        <rect x="${pos.x - 4}" y="${pos.y - 4}" width="8" height="8" fill="#111111" stroke="#F5F5F2" stroke-width="1.5" class="map-pin-core" />
        <text
          x="${pos.x + labelOffset.dx}"
          y="${pos.y + labelOffset.dy}"
          text-anchor="${labelOffset.anchor}"
          class="map-pin-label"
        >${escapeHtml(territory.name)}</text>
      </g>
    `;
  }).join('');

  const territoryListHtml = REGIONAL_TERRITORIES.map(
    (territory, idx) => `
      <li class="territory-item" data-territory-item="${escapeHtml(territory.id)}" tabindex="0">
        <span class="territory-index">0${idx + 1}</span>
        <span class="territory-name">${escapeHtml(territory.name)}</span>
        <span class="territory-ref">${escapeHtml(territory.publishedLabel)}</span>
      </li>
    `,
  ).join('');

  return `
    <div class="regional-atlas">
      <div class="regional-map-frame" data-animate-image>
        <svg
          class="regional-map-svg"
          viewBox="0 0 ${VIEW_W} ${VIEW_H}"
          role="img"
          aria-label="Mapa cartográfico del Caribe que señala República Dominicana, Anguila, San Cristóbal, Nieves y Santa Lucía"
        >
          <rect width="${VIEW_W}" height="${VIEW_H}" fill="#FFFFFF" />
          <g class="map-grid" aria-hidden="true">
            ${gridLinesX}
            ${gridLinesY}
          </g>
          <text x="16" y="24" class="map-coord-tag">CUENCA DEL CARIBE · PRESENCIA EN EL CARIBE</text>
          <text x="784" y="452" text-anchor="end" class="map-coord-tag">11.8°N – 20.8°N / 75.2°W – 59.2°W</text>

          <g class="map-landmasses">
            <polygon points="${HAITI_POLY}" fill="#EFEFEA" stroke="#C4C4BE" stroke-width="1" />
            <polygon points="${PUERTO_RICO_POLY}" fill="#EFEFEA" stroke="#C4C4BE" stroke-width="1" />
            ${contextDots}
            <polygon points="${REP_DOM_POLY}" fill="#292929" fill-opacity="0.14" stroke="#111111" stroke-width="1.35" />
          </g>

          <g class="map-pins">
            ${pinsHtml}
          </g>
        </svg>
        <p class="map-footnote">
          Mapa referencial de presencia en proyectos desarrollados por la firma en el Caribe. Los territorios señalados no corresponden a oficinas ni sedes permanentes.
        </p>
      </div>

      <div class="regional-territories-panel">
        <p class="regional-panel-kicker">Presencia en el Caribe</p>
        <ul class="territory-list">
          ${territoryListHtml}
        </ul>
      </div>
    </div>
  `;
}

export function initRegionalMapInteractions(): () => void {
  const items = Array.from(document.querySelectorAll<HTMLElement>('[data-territory-item]'));
  const pins = Array.from(document.querySelectorAll<SVGGElement>('[data-territory-pin]'));
  if (items.length === 0 || pins.length === 0) return () => undefined;

  const setActive = (id: string | null) => {
    items.forEach((el) => {
      el.classList.toggle('is-active', el.dataset.territoryItem === id);
    });
    pins.forEach((pin) => {
      pin.classList.toggle('is-active', pin.dataset.territoryPin === id);
    });
  };

  const cleanups: Array<() => void> = [];

  items.forEach((item) => {
    const id = item.dataset.territoryItem ?? null;
    const onEnter = () => setActive(id);
    const onLeave = () => setActive(null);
    item.addEventListener('mouseenter', onEnter);
    item.addEventListener('focus', onEnter);
    item.addEventListener('mouseleave', onLeave);
    item.addEventListener('blur', onLeave);
    cleanups.push(() => {
      item.removeEventListener('mouseenter', onEnter);
      item.removeEventListener('focus', onEnter);
      item.removeEventListener('mouseleave', onLeave);
      item.removeEventListener('blur', onLeave);
    });
  });

  return () => {
    cleanups.forEach((fn) => fn());
  };
}
