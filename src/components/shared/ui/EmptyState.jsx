import React from 'react';

export const EmptyTableRow = ({ colSpan, message }) => (
  <tr>
    <td colSpan={colSpan} className="px-2 py-4 text-center text-white/60">{message}</td>
  </tr>
);

const EmptyState = ({ message }) => (
  <div className="px-2 py-4 text-center text-xs text-white/60">{message}</div>
);

export default EmptyState;
