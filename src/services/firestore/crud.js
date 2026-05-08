import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { getCollectionConfig } from '../../config/firestoreCollections';
import { db } from '../firebase';
import { applyClientFilters, normalizeSnapshot } from './queryHelpers';

const getCollectionRef = (collectionKey) => {
  const config = getCollectionConfig(collectionKey);
  return collection(db, config.path);
};

export const fetchCollection = async (collectionKey, filters = {}) => {
  const config = getCollectionConfig(collectionKey);
  const order = filters.orderBy || config.defaultOrder;
  const colRef = getCollectionRef(collectionKey);
  const q = order ? query(colRef, orderBy(order.field, order.direction || 'asc')) : query(colRef);
  const snapshot = await getDocs(q);
  const records = normalizeSnapshot(snapshot);

  return applyClientFilters(records, {
    ...filters,
    dateField: filters.dateField || config.dateField,
  });
};

export const createDocument = async (collectionKey, record) => {
  const docRef = await addDoc(getCollectionRef(collectionKey), record);
  return docRef.id;
};

export const updateDocument = async (collectionKey, id, patch) => {
  const config = getCollectionConfig(collectionKey);
  const ref = doc(db, config.path, id);
  await updateDoc(ref, patch);
};

export const deleteDocument = async (collectionKey, id) => {
  const config = getCollectionConfig(collectionKey);
  const ref = doc(db, config.path, id);
  await deleteDoc(ref);
};

export const createCrudRepository = (collectionKey) => ({
  list: (filters) => fetchCollection(collectionKey, filters),
  create: (record) => createDocument(collectionKey, record),
  update: (id, patch) => updateDocument(collectionKey, id, patch),
  remove: (id) => deleteDocument(collectionKey, id),
});
