import React from 'react';
import DataTable from '../../../components/shared/table/DataTable';

const KPITableSection = ({ columns, records, loading, emptyMessage, renderRow, className = 'xl:col-span-3', filename = 'kpi-table-export' }) => (
  <div className={className}>
    <DataTable
      columns={columns}
      records={records}
      loading={loading}
      emptyMessage={emptyMessage}
      renderRow={renderRow}
      filename={filename}
    />
  </div>
);

export default KPITableSection;
