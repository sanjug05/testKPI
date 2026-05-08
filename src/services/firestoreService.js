import { collections } from '../config/firestoreCollections';
import { createCrudRepository } from './firestore/crud';

const prospectFunnelRepository = createCrudRepository('prospectFunnel');
const shortlistedRepository = createCrudRepository('shortlisted');

export { collections };

export const fetchProspectFunnel = ({ from, to, source } = {}) => (
  prospectFunnelRepository.list({ from, to, source })
);

export const createProspectFunnel = (record) => prospectFunnelRepository.create(record);
export const updateProspectFunnel = (id, patch) => prospectFunnelRepository.update(id, patch);
export const deleteProspectFunnel = (id) => prospectFunnelRepository.remove(id);

// TODO: Mount the shortlisted KPI through the standardized KPI architecture after validation.
export const fetchShortlisted = ({ from, to } = {}) => shortlistedRepository.list({ from, to });
export const createShortlisted = (record) => shortlistedRepository.create(record);
export const updateShortlisted = (id, patch) => shortlistedRepository.update(id, patch);
export const deleteShortlisted = (id) => shortlistedRepository.remove(id);
