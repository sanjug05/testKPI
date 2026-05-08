import React from 'react';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const COLORS = ['#00B4D8', '#4FD1C5', '#F6E05E', '#F56565'];

const ProspectFunnelChart = ({ funnel }) => {
  const { interested, shortlisted, cftDone, converted } = funnel || {};
  const data = [
    { stage: 'Interested', value: interested || 0 },
    { stage: 'Shortlisted', value: shortlisted || 0 },
    { stage: 'CFT Done', value: cftDone || 0 },
    { stage: 'Converted', value: converted || 0 },
  ];

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ left: 20, right: 10 }}>
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="stage" tick={{ fill: '#E5F6FF', fontSize: 11 }} />
        <Tooltip
          cursor={{ fill: 'rgba(255,255,255,0.06)' }}
          contentStyle={{ background: '#0A1628', border: '1px solid rgba(255,255,255,0.2)', fontSize: 11 }}
        />
        <Bar dataKey="value" radius={8}>
          {data.map((entry, index) => (
            <Cell key={entry.stage} fill={COLORS[index] || COLORS[0]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ProspectFunnelChart;
