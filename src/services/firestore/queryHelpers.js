export const isFilterActive = (value) => value !== undefined && value !== null && value !== '' && value !== 'All';

export const buildFirestoreWhereFilters = (filters = {}, dateField = 'date') => {
  const { from, to, orderBy, dateField: ignoredDateField, roleScope, ...fieldFilters } = filters;
  const constraints = [];

  if (from) constraints.push({ field: dateField, operator: '>=', value: from });
  if (to) constraints.push({ field: dateField, operator: '<=', value: to });

  Object.entries(fieldFilters).forEach(([field, expected]) => {
    if (isFilterActive(expected)) constraints.push({ field, operator: '==', value: expected });
  });

  if (roleScope?.field && isFilterActive(roleScope.value)) {
    constraints.push({ field: roleScope.field, operator: '==', value: roleScope.value });
  }

  return constraints;
};

export const applyClientFilters = (records, filters = {}) => {
  const { from, to, dateField = 'date', roleScope, orderBy, ...fieldFilters } = filters;

  return records.filter((record) => {
    if (from && record[dateField] < from) return false;
    if (to && record[dateField] > to) return false;

    const matchesFieldFilters = Object.entries(fieldFilters).every(([field, expected]) => {
      if (!isFilterActive(expected)) return true;
      return record[field] === expected;
    });

    if (!matchesFieldFilters) return false;

    if (roleScope?.field && roleScope?.value && record[roleScope.field] !== roleScope.value) return false;

    return true;
  });
};

export const normalizeSnapshot = (snapshot) => {
  const data = [];
  snapshot.forEach((documentSnapshot) => {
    data.push({ id: documentSnapshot.id, ...documentSnapshot.data() });
  });
  return data;
};
