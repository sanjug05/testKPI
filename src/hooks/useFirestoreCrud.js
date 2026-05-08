import { useMemo } from 'react';
import { createCrudRepository } from '../services/firestore/crud';

export const useFirestoreCrud = (collectionKey) => (
  useMemo(() => createCrudRepository(collectionKey), [collectionKey])
);
