import React from 'react';
import { EmptyTableRow } from '../../../components/shared/ui/EmptyState';

const KPITableSection = ({ columns, records, loading, emptyMessage, renderRow, className = 'xl:col-span-3 overflow-x-auto text-[11px]' }) => (
  <div className={className}>
    <table className="min-w-full border-separate border-spacing-y-1">
      <thead className="text-white/60">
        <tr>
          {columns.map((column) => (
            <th key={column.key} className={column.className || 'text-left px-2 py-1'}>{column.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading && <EmptyTableRow colSpan={columns.length} message="Loading…" />}
        {!loading && records.length === 0 && <EmptyTableRow colSpan={columns.length} message={emptyMessage} />}
        {!loading && records.map(renderRow)}
      </tbody>
    </table>
  </div>
);

export default KPITableSection;
