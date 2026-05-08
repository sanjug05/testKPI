import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit as firestoreLimit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { getCollectionConfig } from '../../config/firestoreCollections';
import { db } from '../firebase';
import { applyClientFilters, buildFirestoreWhereFilters, normalizeSnapshot } from './queryHelpers';

const getCollectionRef = (collectionKey) => {
  const config = getCollectionConfig(collectionKey);
  return collection(db, config.path);
};

export const buildQueryConstraints = (filters = {}, config) => {
  const order = filters.orderBy || config.defaultOrder;
  const whereFilters = buildFirestoreWhereFilters(filters, filters.dateField || config.dateField);
  const constraints = whereFilters.map((filter) => where(filter.field, filter.operator, filter.value));

  if (order) constraints.push(orderBy(order.field, order.direction || 'asc'));
  if (filters.limit) constraints.push(firestoreLimit(filters.limit));

  return constraints;
};

export const fetchCollection = async (collectionKey, filters = {}) => {
  const config = getCollectionConfig(collectionKey);
  const colRef = getCollectionRef(collectionKey);
  const queryConstraints = buildQueryConstraints(filters, config);
  const q = queryConstraints.length ? query(colRef, ...queryConstraints) : query(colRef);
  const snapshot = await getDocs(q);
  const records = normalizeSnapshot(snapshot);

  // Firestore receives all supported equality/date constraints above. This remains as a safety net for
  // derived UI-only filters and prepares the repository contract for future pagination cursors.
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

export const listenCollection = (collectionKey, filters = {}, onData, onError) => {
  const config = getCollectionConfig(collectionKey);
  const colRef = getCollectionRef(collectionKey);
  const queryConstraints = buildQueryConstraints(filters, config);
  const q = queryConstraints.length ? query(colRef, ...queryConstraints) : query(colRef);

  return onSnapshot(q, (snapshot) => {
    const records = normalizeSnapshot(snapshot);
    onData(applyClientFilters(records, {
      ...filters,
      dateField: filters.dateField || config.dateField,
    }));
  }, onError);
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
  listen: (filters, onData, onError) => listenCollection(collectionKey, filters, onData, onError),
});
