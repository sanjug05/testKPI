import React from 'react';

const LoadingState = ({ message = 'Loading…' }) => (
  <div className="flex items-center justify-center gap-2 px-2 py-4 text-xs text-white/60">
    <span className="h-4 w-4 border-2 border-teal border-t-transparent rounded-full animate-spin" />
    {message}
  </div>
);

export default LoadingState;
