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
import { db } from './firebase';

export const collections = {
  prospectFunnel: 'ch_prospect_funnel',
  shortlisted: 'ch_shortlisted',
  // TODO: Wire remaining KPI 3–16 collections after the core shell is stable.
};

export async function fetchProspectFunnel({ from, to, source } = {}) {
  const colRef = collection(db, collections.prospectFunnel);
  const q = query(colRef, orderBy('date', 'asc'));
  const snapshot = await getDocs(q);
  const data = [];

  snapshot.forEach((d) => {
    const item = { id: d.id, ...d.data() };
    if (from && item.date < from) return;
    if (to && item.date > to) return;
    if (source && source !== 'All' && item.source !== source) return;
    data.push(item);
  });

  return data;
}

export async function createProspectFunnel(record) {
  const colRef = collection(db, collections.prospectFunnel);
  const docRef = await addDoc(colRef, record);
  return docRef.id;
}

export async function updateProspectFunnel(id, patch) {
  const ref = doc(db, collections.prospectFunnel, id);
  await updateDoc(ref, patch);
}

export async function deleteProspectFunnel(id) {
  const ref = doc(db, collections.prospectFunnel, id);
  await deleteDoc(ref);
}

// TODO: The shortlisted KPI business logic was present in fragments but is intentionally not mounted yet.
export async function fetchShortlisted({ from, to } = {}) {
  const colRef = collection(db, collections.shortlisted);
  const q = query(colRef, orderBy('shortlistDate', 'asc'));
  const snapshot = await getDocs(q);
  const data = [];

  snapshot.forEach((d) => {
    const item = { id: d.id, ...d.data() };
    if (from && item.shortlistDate < from) return;
    if (to && item.shortlistDate > to) return;
    data.push(item);
  });

  return data;
}

export async function createShortlisted(record) {
  const colRef = collection(db, collections.shortlisted);
  const docRef = await addDoc(colRef, record);
  return docRef.id;
}

export async function updateShortlisted(id, patch) {
  const ref = doc(db, collections.shortlisted, id);
  await updateDoc(ref, patch);
}

export async function deleteShortlisted(id) {
  const ref = doc(db, collections.shortlisted, id);
  await deleteDoc(ref);
}
