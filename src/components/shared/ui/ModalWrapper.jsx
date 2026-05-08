import React from 'react';

const ModalWrapper = ({ children, open }) => {
  if (!open) return null;

  return <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">{children}</div>;
};

export default ModalWrapper;
