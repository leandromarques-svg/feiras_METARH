import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

interface SegmentoChartProps {
  data: { name: string; value: number }[];
}

const COLORS = [
  '#9333ea', '#6366f1', '#06b6d4', '#f59e42', '#f43f5e', '#10b981', '#fbbf24', '#3b82f6', '#a21caf', '#eab308', '#ef4444', '#14b8a6', '#8b5cf6', '#f472b6', '#22d3ee'
];


const SegmentoChart: React.FC<SegmentoChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={40 * data.length + 50}>
    <BarChart
      layout="vertical"
      data={data}
      margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
    >
      <XAxis type="number" />
      <YAxis dataKey="name" type="category" width={120} />
      <Tooltip />
      <Legend />
      <Bar dataKey="value" fill="#8884d8" label={{ position: 'right' }}>
        {data.map((entry, index) => (
          <Cell key={`cell-bar-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

export default SegmentoChart;
