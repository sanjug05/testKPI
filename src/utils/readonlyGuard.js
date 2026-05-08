import toast from 'react-hot-toast';

export function guardWrite(viewOnly) {
  if (viewOnly) {
    toast.error('View Only Mode: Editing is disabled');
    return false;
  }

  return true;
}
