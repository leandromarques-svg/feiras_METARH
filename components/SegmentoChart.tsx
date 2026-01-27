import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SegmentoChartProps {
  data: { name: string; value: number }[];
}

const COLORS = [
  '#9333ea', '#6366f1', '#06b6d4', '#f59e42', '#f43f5e', '#10b981', '#fbbf24', '#3b82f6', '#a21caf', '#eab308', '#ef4444', '#14b8a6', '#8b5cf6', '#f472b6', '#22d3ee'
];

const SegmentoChart: React.FC<SegmentoChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);

export default SegmentoChart;
