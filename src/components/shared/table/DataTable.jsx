import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Search } from 'lucide-react';
import ActionButton from '../ui/ActionButton';
import EmptyState from '../ui/EmptyState';
import LoadingState from '../ui/LoadingState';
import { exportToExcel } from '../../../utils/exporters';

const getValue = (record, column) => {
  if (typeof column.accessor === 'function') return column.accessor(record);
  return record[column.key] ?? '';
};

const DataTable = ({
  columns,
  records,
  loading = false,
  emptyMessage = 'No records found.',
  renderRow,
  filename = 'table-export',
  pageSizeOptions = [10, 25, 50],
}) => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ key: columns[0]?.key, direction: 'asc' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeOptions[0]);
  const [columnFilters, setColumnFilters] = useState({});

  const searchableColumns = useMemo(() => columns.filter((column) => column.key !== 'actions'), [columns]);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    return records.filter((record) => {
      const matchesSearch = !query || searchableColumns.some((column) => String(getValue(record, column)).toLowerCase().includes(query));
      const matchesColumnFilters = Object.entries(columnFilters).every(([key, value]) => !value || String(record[key] ?? '').toLowerCase().includes(value.toLowerCase()));
      return matchesSearch && matchesColumnFilters;
    });
  }, [columnFilters, records, search, searchableColumns]);

  const sortedRecords = useMemo(() => {
    const activeColumn = columns.find((column) => column.key === sort.key);
    if (!activeColumn || activeColumn.sortable === false || activeColumn.key === 'actions') return filteredRecords;

    return [...filteredRecords].sort((a, b) => {
      const aValue = String(getValue(a, activeColumn)).toLowerCase();
      const bValue = String(getValue(b, activeColumn)).toLowerCase();
      return sort.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
  }, [columns, filteredRecords, sort.direction, sort.key]);

  const totalPages = Math.max(1, Math.ceil(sortedRecords.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRecords.slice(start, start + pageSize);
  }, [currentPage, pageSize, sortedRecords]);

  const exportColumns = columns.filter((column) => column.key !== 'actions');
  const exportRecords = sortedRecords.map((record) => exportColumns.reduce((acc, column) => ({ ...acc, [column.key]: getValue(record, column) }), {}));

  const handleSort = (column) => {
    if (column.sortable === false || column.key === 'actions') return;
    setSort((current) => ({ key: column.key, direction: current.key === column.key && current.direction === 'asc' ? 'desc' : 'asc' }));
  };

  return (
    <div className="glass-effect overflow-hidden">
      <div className="flex flex-col gap-2 border-b border-white/10 p-3 md:flex-row md:items-center md:justify-between">
        <label className="relative text-xs text-white/60 md:w-72">
          <Search size={14} className="absolute left-2 top-2.5 text-teal" />
          <input
            value={search}
            onChange={(event) => { setSearch(event.target.value); setPage(1); }}
            placeholder="Search table…"
            className="glass-input w-full rounded-lg py-2 pl-8 pr-3 text-xs text-white outline-none transition focus:border-teal"
          />
        </label>
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/60">
          <span>{sortedRecords.length} records</span>
          <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }} className="glass-input rounded px-2 py-1 text-white outline-none">
            {pageSizeOptions.map((option) => <option key={option} value={option}>{option} / page</option>)}
          </select>
          <ActionButton variant="secondary" icon={Download} onClick={() => exportToExcel({ filename, columns: exportColumns, records: exportRecords })}>Export table</ActionButton>
        </div>
      </div>

      <div className="overflow-auto text-[11px]">
        <table className="min-w-full table-fixed border-separate border-spacing-0">
          <thead className="sticky top-0 z-10 bg-navy/95 text-white/65 backdrop-blur">
            <tr>
              {columns.map((column) => (
                <th key={column.key} style={{ width: column.width }} className={column.className || 'px-3 py-2 text-left align-top'}>
                  <button type="button" onClick={() => handleSort(column)} className="inline-flex items-center gap-1 rounded text-left font-semibold transition hover:text-teal focus:outline-none focus:ring-1 focus:ring-teal">
                    {column.label}
                    {sort.key === column.key && column.key !== 'actions' ? <span className="text-teal">{sort.direction === 'asc' ? '↑' : '↓'}</span> : null}
                  </button>
                  {column.filterable !== false && column.key !== 'actions' && (
                    <input
                      value={columnFilters[column.key] || ''}
                      onChange={(event) => { setColumnFilters((current) => ({ ...current, [column.key]: event.target.value })); setPage(1); }}
                      placeholder="Filter"
                      className="mt-1 w-full min-w-20 resize-x rounded border border-white/10 bg-black/20 px-2 py-1 text-[10px] text-white outline-none focus:border-teal"
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={columns.length}><LoadingState message="Loading table records…" /></td></tr>
            )}
            {!loading && paginatedRecords.length === 0 && (
              <tr><td colSpan={columns.length}><EmptyState message={emptyMessage} /></td></tr>
            )}
            {!loading && paginatedRecords.map((record) => renderRow(record))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-2 border-t border-white/10 p-3 text-[11px] text-white/60 sm:flex-row sm:items-center sm:justify-between">
        <span>Showing {paginatedRecords.length ? ((currentPage - 1) * pageSize) + 1 : 0}-{Math.min(currentPage * pageSize, sortedRecords.length)} of {sortedRecords.length}</span>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded-lg border border-white/10 p-1 transition hover:border-teal disabled:opacity-40" disabled={currentPage === 1}><ChevronLeft size={14} /></button>
          <span>Page {currentPage} / {totalPages}</span>
          <button type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} className="rounded-lg border border-white/10 p-1 transition hover:border-teal disabled:opacity-40" disabled={currentPage === totalPages}><ChevronRight size={14} /></button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
