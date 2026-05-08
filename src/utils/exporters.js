const downloadBlob = (content, filename, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const escapeCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

export const exportToExcel = ({ filename, columns, records }) => {
  const header = columns.map((column) => escapeCell(column.label)).join(',');
  const rows = records.map((record) => columns.map((column) => escapeCell(record[column.key])).join(','));
  downloadBlob([header, ...rows].join('\n'), `${filename}.csv`, 'text/csv;charset=utf-8;');
};

export const exportToPdf = ({ title, columns, records }) => {
  const printable = window.open('', '_blank', 'noopener,noreferrer');
  if (!printable) return;
  const rows = records.map((record) => `<tr>${columns.map((column) => `<td>${record[column.key] ?? ''}</td>`).join('')}</tr>`).join('');
  printable.document.write(`<!doctype html><html><head><title>${title}</title><style>body{font-family:Arial;padding:24px}table{width:100%;border-collapse:collapse}td,th{border:1px solid #ddd;padding:6px;font-size:11px}th{background:#003b46;color:white}</style></head><body><h2>${title}</h2><table><thead><tr>${columns.map((column) => `<th>${column.label}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></body></html>`);
  printable.document.close();
  printable.print();
};
