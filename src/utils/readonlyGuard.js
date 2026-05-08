import toast from 'react-hot-toast';

export function guardWrite(readOnly, roleLabel = 'Viewer') {
  if (readOnly) {
    toast.error(`${roleLabel}: Editing is disabled for this action`);
    return false;
  }

  return true;
}
