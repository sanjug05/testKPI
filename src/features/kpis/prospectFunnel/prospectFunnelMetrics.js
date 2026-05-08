export const calculateProspectFunnelMetrics = (records) => {
  const funnel = { interested: 0, shortlisted: 0, cftDone: 0, converted: 0 };

  records.forEach((record) => {
    if (record.status === 'Interested') funnel.interested += 1;
    if (record.status === 'Shortlisted') funnel.shortlisted += 1;
    if (record.status === 'CFT Done') funnel.cftDone += 1;
    if (record.status === 'Converted') funnel.converted += 1;
  });

  const conversionRate = funnel.interested ? Math.round((funnel.converted / funnel.interested) * 100) : 0;

  return {
    funnel,
    conversionRate,
    summaryCards: [
      { id: 'interested', label: 'Total Interested', value: funnel.interested, valueClassName: 'text-white' },
      { id: 'converted', label: 'Total Converted', value: funnel.converted, valueClassName: 'text-emerald-300' },
      { id: 'rate', label: 'Interested → Converted', value: `${conversionRate}%`, valueClassName: 'text-gold' },
      { id: 'records', label: 'Records in period', value: records.length, valueClassName: 'text-white' },
    ],
  };
};
