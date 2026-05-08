import React from 'react';
import { format } from 'date-fns';
import ActionButton from '../../../components/shared/ui/ActionButton';
import KPITableSection from '../components/KPITableSection';
import { PROSPECT_FUNNEL_TABLE_COLUMNS } from './prospectFunnelConfig';

const ProspectFunnelTable = ({ loading, records, readOnly, canEdit = false, canDelete = false, onEdit, onDelete }) => (
  <KPITableSection
    columns={PROSPECT_FUNNEL_TABLE_COLUMNS}
    records={records}
    loading={loading}
    emptyMessage="No prospect data in this period. Use the form to add sample entries (disabled in View Only mode)."
    renderRow={(record) => (
      <tr key={record.id} className="bg-white/5">
        <td className="px-2 py-1">{record.date ? format(new Date(record.date), 'dd-MMM') : ''}</td>
        <td className="px-2 py-1">{record.source}</td>
        <td className="px-2 py-1">{record.prospectName}</td>
        <td className="px-2 py-1">{record.company}</td>
        <td className="px-2 py-1">{record.region || record.zone}</td>
        <td className="px-2 py-1">{record.state}</td>
        <td className="px-2 py-1">{record.territory}</td>
        <td className="px-2 py-1">{record.contact}</td>
        <td className="px-2 py-1"><span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px]">{record.status}</span></td>
        <td className="px-2 py-1">{record.salesperson}</td>
        <td className="px-2 py-1 text-right space-x-1">
          {!readOnly && (canEdit || canDelete) && (
            <>
              {canEdit && <ActionButton variant="link" className="inline-flex" onClick={() => onEdit(record)}>Edit</ActionButton>}
              {canDelete && <ActionButton variant="danger" className="inline-flex" onClick={() => onDelete(record.id)}>Del</ActionButton>}
            </>
          )}
        </td>
      </tr>
    )}
  />
);

export default ProspectFunnelTable;
