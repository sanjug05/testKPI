import React from 'react';

const ConfirmDialog = ({ open, title, message, confirmLabel = 'Confirm', onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="glass-effect w-full max-w-sm p-4">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="mt-2 text-xs text-white/60">{message}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white/70 transition hover:border-white/30">Cancel</button>
          <button type="button" onClick={onConfirm} className="rounded-lg border border-rose-400/40 bg-rose-500/15 px-3 py-2 text-xs text-rose-100 transition hover:bg-rose-500/25">{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
