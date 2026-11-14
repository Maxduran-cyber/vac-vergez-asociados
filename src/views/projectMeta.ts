import type { ProjectOptionalMetadata } from '../types/content';
import { escapeHtml } from '../utils/html';

export function renderOptionalMetadata(metadata: ProjectOptionalMetadata): string {
  const rows: Array<{ label: string; value: string }> = [];

  if (metadata.typology?.trim()) {
    rows.push({ label: 'Tipología', value: metadata.typology.trim() });
  }
  if (metadata.location?.trim()) {
    rows.push({ label: 'Ubicación', value: metadata.location.trim() });
  }
  if (metadata.year?.trim()) {
    rows.push({ label: 'Año', value: metadata.year.trim() });
  }
  if (metadata.area?.trim()) {
    rows.push({ label: 'Superficie', value: metadata.area.trim() });
  }
  if (metadata.contractScope?.trim()) {
    rows.push({ label: 'Alcance', value: metadata.contractScope.trim() });
  }

  if (rows.length === 0) {
    return '';
  }

  const itemsHtml = rows
    .map(
      (row) => `
      <div class="meta-datum">
        <dt class="meta-label">${escapeHtml(row.label)}</dt>
        <dd class="meta-value">${escapeHtml(row.value)}</dd>
      </div>`,
    )
    .join('');

  return `<dl class="project-meta-list">${itemsHtml}</dl>`;
}
