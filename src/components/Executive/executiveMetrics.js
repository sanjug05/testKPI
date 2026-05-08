const groupCount = (records, field, predicate = () => true) => records.reduce((acc, record) => {
  if (!predicate(record)) return acc;
  const key = record[field] || 'Unassigned';
  acc[key] = (acc[key] || 0) + 1;
  return acc;
}, {});

const sortedEntries = (map, direction = 'desc') => Object.entries(map).sort((a, b) => direction === 'desc' ? b[1] - a[1] : a[1] - b[1]);

export const buildExecutiveSnapshot = (records = []) => {
  const interested = records.filter((record) => record.status === 'Interested').length;
  const shortlisted = records.filter((record) => record.status === 'Shortlisted').length;
  const cftDone = records.filter((record) => record.status === 'CFT Done').length;
  const converted = records.filter((record) => record.status === 'Converted').length;
  const conversionRate = interested ? Math.round((converted / interested) * 100) : 0;
  const activeRegions = new Set(records.map((record) => record.region || record.zone).filter(Boolean)).size;
  const activeTerritories = new Set(records.map((record) => record.territory).filter(Boolean)).size;

  const regionConversions = groupCount(records, 'region', (record) => record.status === 'Converted');
  const territoryConversions = groupCount(records, 'territory', (record) => record.status === 'Converted');
  const sourceVolume = groupCount(records, 'source');
  const monthVolume = groupCount(records, 'monthKey');
  const monthEntries = sortedEntries(monthVolume, 'asc');
  const currentMonth = monthEntries.at(-1)?.[1] || 0;
  const previousMonth = monthEntries.at(-2)?.[1] || 0;
  const monthlyGrowth = previousMonth ? Math.round(((currentMonth - previousMonth) / previousMonth) * 100) : (currentMonth ? 100 : 0);

  const topRegion = sortedEntries(regionConversions)[0] || ['No data', 0];
  const weakTerritories = sortedEntries(territoryConversions, 'asc').slice(0, 3);
  const bestSource = sortedEntries(sourceVolume)[0] || ['No data', 0];

  return {
    cards: [
      { id: 'critical', label: 'Critical KPI focus', value: conversionRate < 25 ? 'Conversion risk' : 'Stable', detail: `${conversionRate}% conversion`, tone: conversionRate < 25 ? 'danger' : 'success', movement: conversionRate >= 25 ? '↑ Healthy' : '↓ Watch' },
      { id: 'converted', label: 'Converted prospects', value: converted, detail: `${cftDone} CFT done · ${shortlisted} shortlisted`, tone: 'success', movement: converted ? '↑ Active' : '→ Flat' },
      { id: 'growth', label: 'Monthly growth trend', value: `${monthlyGrowth}%`, detail: `${currentMonth} records this month`, tone: monthlyGrowth >= 0 ? 'info' : 'warning', movement: monthlyGrowth >= 0 ? '↑ Growing' : '↓ Declining' },
      { id: 'coverage', label: 'National coverage', value: activeRegions, detail: `${activeTerritories} active territories`, tone: 'info', movement: '→ Coverage' },
    ],
    topRegion: { name: topRegion[0], value: topRegion[1] },
    weakTerritories: weakTerritories.length ? weakTerritories.map(([name, value]) => ({ name, value })) : [{ name: 'No data', value: 0 }],
    bestSource: { name: bestSource[0], value: bestSource[1] },
    trends: monthEntries.map(([month, value]) => ({ month, value })),
    onboardingVelocity: records.length ? Math.round(((shortlisted + cftDone + converted) / records.length) * 100) : 0,
  };
};
