import React from 'react';
import MetricCard from '../../../components/shared/ui/MetricCard';

const KPISummaryCards = ({ metrics, className = 'xl:col-span-1 grid grid-cols-2 gap-3 text-xs' }) => (
  <div className={className}>
    {metrics.map((metric) => (
      <MetricCard key={metric.id} label={metric.label} value={metric.value} valueClassName={metric.valueClassName} />
    ))}
  </div>
);

export default KPISummaryCards;
