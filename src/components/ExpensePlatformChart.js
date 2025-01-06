import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';

const ExpensePlatformChart = ({ data }) => {
  const chartData = data.map(item => ({
    name: item["Platform"],
    value: item.Amount,
    label: item["Amount Text"],
  }));

  const COLORS = ["#4BC0C0", "#FF9F40", "#23781e", "#9ca2d1", "#ef8ae1"];

  return (
    <ResponsiveContainer width="80%" height={400}>
      <BarChart
        layout="vertical"
        height={400}
        // width={200}
        data={chartData}
        margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis 
          type="category" 
          dataKey="name" 
          width={100} 
          tick={{ fontSize: 14 }} 
        />
        <Tooltip 
          formatter={(value, name) => {
            const item = chartData.find(entry => entry.name === name);
            return item ? item.label : value;  // Show custom label with peso sign
          }}
        />
        <Legend 
          formatter={(value) => {
            const item = chartData.find(entry => entry.name === value);
            if (item) {
              return item.name;
            }
            return value;
          }}
        />
        <Bar 
          dataKey="value" 
          fill="#8884d8" 
          label={{ position: 'insideRight', fill: '#fff', fontSize: 12 }}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ExpensePlatformChart;
