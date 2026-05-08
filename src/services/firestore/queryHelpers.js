export const applyClientFilters = (records, filters = {}) => {
  const { from, to, dateField = 'date', roleScope, orderBy, ...fieldFilters } = filters;

  return records.filter((record) => {
    if (from && record[dateField] < from) return false;
    if (to && record[dateField] > to) return false;

    const matchesFieldFilters = Object.entries(fieldFilters).every(([field, expected]) => {
      if (expected === undefined || expected === null || expected === '' || expected === 'All') return true;
      return record[field] === expected;
    });

    if (!matchesFieldFilters) return false;

    // TODO: Replace this client-side role scope with Firestore security-rule-aware query constraints.
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
