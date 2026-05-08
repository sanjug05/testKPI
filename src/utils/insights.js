const groupCount = (records, field, predicate = () => true) => records.reduce((acc, record) => {
  if (!predicate(record)) return acc;
  const key = record[field] || 'Unassigned';
  acc[key] = (acc[key] || 0) + 1;
  return acc;
}, {});

const maxEntry = (map) => Object.entries(map).sort((a, b) => b[1] - a[1])[0] || ['No data', 0];
const minEntry = (map) => Object.entries(map).sort((a, b) => a[1] - b[1])[0] || ['No data', 0];

export const buildProspectInsights = (records) => {
  const byRegion = groupCount(records, 'region');
  const conversionsByRegion = groupCount(records, 'region', (record) => record.status === 'Converted');
  const bySource = groupCount(records, 'source');
  const byMonth = groupCount(records, 'monthKey');
  const [topRegion, topRegionValue] = maxEntry(conversionsByRegion);
  const [weakRegion, weakRegionValue] = minEntry(conversionsByRegion);
  const [topSource, topSourceValue] = maxEntry(bySource);

  return [
    { id: 'top-region', label: 'Top-performing region', value: topRegion, detail: `${topRegionValue} conversions`, tone: 'text-emerald-300' },
    { id: 'weak-zone', label: 'Weakest conversion zone', value: weakRegion, detail: `${weakRegionValue} conversions`, tone: 'text-amber-300' },
    { id: 'source', label: 'Best lead source', value: topSource, detail: `${topSourceValue} leads`, tone: 'text-teal' },
    { id: 'mom', label: 'Month trend samples', value: Object.keys(byMonth).length, detail: `${records.length} records analyzed`, tone: 'text-gold' },
    { id: 'coverage', label: 'Region coverage', value: Object.keys(byRegion).length, detail: 'active reporting regions', tone: 'text-white' },
  ];
};
