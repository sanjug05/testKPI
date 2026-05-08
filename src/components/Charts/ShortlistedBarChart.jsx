import React from 'react';
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// TODO: Mount this chart when KPI 2 shortlisted prospect module is stabilized.
const ShortlistedBarChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ left: 10, right: 10, top: 10 }}>
        <XAxis dataKey="monthLabel" tick={{ fill: '#E5F6FF', fontSize: 11 }} />
        <YAxis tick={{ fill: '#E5F6FF', fontSize: 11 }} />
        <Tooltip contentStyle={{ background: '#0A1628', border: '1px solid rgba(255,255,255,0.2)', fontSize: 11 }} />
        <Legend wrapperStyle={{ fontSize: 11 }} formatter={(value) => <span style={{ color: '#E5F6FF' }}>{value}</span>} />
        <Bar dataKey="actual" fill="#00B4D8" radius={[4, 4, 0, 0]} name="Shortlisted" />
        <Bar dataKey="plan" fill="#F6E05E" radius={[4, 4, 0, 0]} name="Plan" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ShortlistedBarChart;
